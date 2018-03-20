<template>
    <div class="category">
        <el-form :model="sku" ref="form" inline style="margin: 20px 10px">
            <div class="flex-row">
                <el-form-item label="类目">
                    <el-select class="type" placeholder="请选择类目" v-model="sku.categoryId" @change="getBrandListByCategoryId">
                        <el-option v-for="item in categoryList" :label="item.categoryName" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌">
                    <el-select class="type" placeholder="请选择品牌" v-model="sku.brandId" @change="getProductList">
                        <el-option v-for="item in brandList" :label="item.brandName" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-select class="type" placeholder="请选择商品名称" v-model="sku.spuId" @change="getSpuDetail">
                        <el-option v-for="item in spuList" :label="item.productName" :key="item.productId" :value="item.productId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="属性">
                    <el-select class="type" v-model="sku.skuId" placeholder="请选择属性值" @change="getSkuDetail">
                        <el-option v-for="item in skuList" :label="item.skuAttr" :key="item.skuId" :value="item.skuId"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            
            <div v-if="sku.skuId">
                参考价:
                <div v-for="(item, index) in sku.refer" label="批量" :key="index" class="price promotion flex-row hor-center ver-center">
                    <div>{{item.lowQuantity}}</div>
                    <div>~</div>
                    <div>{{item.highQuantity}}</div>
                    <div>价格:</div>
                    <div>{{item.price}}</div>
                    <div>会员等级:</div>
                    <div>{{item.levelId}}</div>
                </div>
            </div>
        </el-form>

        <el-form ref="priceList" style="margin: 10px auto;">
            <div v-if="sku.skuId" v-for="i in priceNum" label="批量" :key="i" class="price promotion flex-row hor-center ver-center">
                <el-input  v-model="sku.priceList[i-1].lowQuantity"></el-input>
                <div>~</div>
                <el-input  v-model="sku.priceList[i-1].highQuantity"></el-input>
                <div>价格:</div>
                <el-input  v-model="sku.priceList[i-1].price"></el-input>
                <el-button size="mini" type="primary" @click="handleRemovePriceList(i-1)">删除</el-button>
            </div>
            <div class="flex-col ver-center addBtn promotion">
                <el-button @click="handleReAdd">+ 添加批次</el-button>
                <el-button type="primary" @click="savePromotionPriceList" style="margin-top: 30px;">确 定</el-button>
            </div>
            
        </el-form>

    </div>
</template>

<style>
    @import "../../css/category";
</style>
<script>
    import {
        getCategoryList,
        getBrandListByCategoryId,
        getProductList,
        getSpuDetail,
        getProductPromotion,
        savePromotionPriceList
    } from '../../api/api';

    export default {
        data() {
            return {
                promotionId: null,
                categoryList: [],
                brandList: [],
                spuList: [],
                skuList: [],
                sku: {
                    categoryId: null,
                    brandId: null,
                    spuId: null,
                    skuId: null,
                    priceList: []
                },
                priceNum: 0,
            };
        },
        methods: {
            handleRemovePriceList(index) {
                this.sku.priceList.splice(index, 1);
                this.priceNum = this.priceNum - 1;
            },

            handleReAdd() {
                if (!this.sku.skuId) {
                    return;
                }
                this.sku.priceList.push({
                    lowQuantity: 0,
                    highQuantity: 0,
                    price: 0,
                });
                this.priceNum = this.priceNum + 1;
            },
            savePromotionPriceList() {
                const param = {
                    promotionId: this.promotionId,
                    skuId: this.sku.skuId,
                    priceList: this.sku.priceList
                };
                savePromotionPriceList(param).then((res) => {
                    if (res.status == 200) {
                        this.$message({
                            message: '保存成功',
                            type: 'success',
                            duration: 2000,
                            onClose: () => {
                                this.getProductPromotion();
                            }
                        });
                    }
                });
            },
            // 类目
            getCategoryList() {
                const param = {
                    userType: 1
                };
                getCategoryList(param).then((res) => {
                    if (res.status == 200) {
                        const categoryList = res.data && res.data != '' ? res.data : [];
                        // 获得一级类目
                        this.$set(this, 'categoryList', categoryList.length > 0 && categoryList.filter(item => item.level === '2'));
                    }
                });
            },

            // 获取品牌
            getBrandListByCategoryId(categoryId) {
                 const param = {
                    categoryId
                };
                getBrandListByCategoryId(param).then((res) => {
                    if (res.status == 200) {
                        this.$set(this, 'brandList', res.data);
                    }
                });
            },

            // 获取spu
            getProductList(brandId) {
                 const param = {
                    userType: 1,
                    brandIds: [brandId]
                };
                getProductList(param).then((res) => {
                    if (res.status == 200) {
                        this.$set(this, 'spuList', res.data);
                    }
                });
            },

            // 获取sku
            getSpuDetail(spuId) {
                const param = {
                    spuId
                };
                getSpuDetail(param).then((res) => {
                    if (res.status == 200) {
                        const skuList = res.data.skuDetailList;
                        skuList.map(item => {
                            if (item.priceList.length === 0) {
                                return true;
                            }
                            const sku = item.priceList[item.priceList.length - 1];
                            item.skuId = sku.skuId;
                            item.skuAttr = sku.skuAttr;
                        });
                        this.$set(this, 'skuList', skuList);
                    }
                });
            },


            // 获取sku价格
            getSkuDetail(skuId) {
                const sku = this.skuList.find(item => item.skuId == skuId);
                const priceList = sku.priceList;
                if (!priceList || priceList.length === 0) {
                    return;
                }
                const tmpPromotion = [];
                const tmpCommon = [];
                priceList.map(item => {
                    if (item.promotionId == this.promotionId) {
                        item.lowQuantity = item.startPiece;
                        item.highQuantity = item.endPiece;
                        item.price = item.price;
                        tmpPromotion.push(item);
                        return true;
                    }
                    if (!item.promotionId && !item.special) {
                        item.lowQuantity = item.startPiece;
                        item.highQuantity = item.endPiece;
                        item.price = item.price;
                        tmpCommon.push(item);
                        return true;
                    }
                    return false;
                });
                this.$set(this.sku, 'priceList', tmpPromotion);
                this.$set(this.sku, 'refer', tmpCommon);
                this.priceNum = tmpPromotion.length;
            },
            getProductPromotion(skuId) {
                const param = {
                    skuId,
                    promotionId: this.promotionId
                };
                getProductPromotion(param).then((res) => {
                    if (res.status == 200) {
                        this.$set(this.sku, 'priceList', res.data);
                    }
                });
            }
        },
        mounted() {
            this.promotionId = parseInt(this.$route.query.promotionId);
            this.getCategoryList();
        }
    };
</script>
