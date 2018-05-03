<template>
    <div class="category">
        <div class="search flex-col hor-center">
            <el-form :model="searchGroup" :inline="true" label-width="90px">
                <div class="searchItem">
                    <el-form-item label="类目">
                        <el-select class="type" v-model="searchGroup.categoryId" placeholder="请选择类目" @change="changeCategory()">
                            <el-option label="全部" value="0"></el-option>
                            <el-option v-for="item in categoryList" :label="item.categoryName" :key="item.id" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="品牌">
                        <el-select class="type" v-model="searchGroup.brandId" placeholder="请选择品牌">
                            <el-option label="全部" key="0" value="0"></el-option>
                            <el-option v-for="item in sBrandList" :label="item.brandName" :key="item.id" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品名称">
                        <el-input  v-model="searchGroup.productName" placeholder="请输入商品名称"></el-input>
                    </el-form-item>
                </div>
                <div class="searchItem">
                    <el-form-item label="上架状态">
                        <el-select class="type" v-model="searchGroup.online" placeholder="请选择商品上架状态">
                            <el-option label="全部" value="YN"></el-option>
                            <el-option label="上架中" value="Y"></el-option>
                            <el-option label="已下架" value="N"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="handleSearch" type="primary">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="el-icon-plus" @click="handleAdd" type="primary"></el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <el-table
            :data="tableData"
            style="width: 96%">
            <el-table-column
                label="图片"
                width="120"
                align="center">
                <template scope="scope">
                    <div v-if="scope.row.thumbnailImage" v-for="(item, index) in scope.row.thumbnailImage" :key="index" >
                        <img :src="item" :key="item" width="50" height="50" style="margin: 10px;"/>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="商品名称"
                width="120"
                align="center"
                prop="productName">
            </el-table-column>
            <el-table-column
                label="类目名称"
                width="120"
                align="center"
                prop="categoryName">
            </el-table-column>
            <el-table-column
                label="品牌名称"
                width="120"
                align="center"
                prop="brandName">
            </el-table-column>
            <el-table-column
                label="上架状态"
                width="120"
                align="center">
                <template scope="scope">
                    <div>{{scope.row.online|formateStatus(scope.row.online)}}</div>
                </template>
            </el-table-column>
            <el-table-column
                label="销售数量"
                width="120"
                align="center"
                prop="salesNum">
            </el-table-column>
            <el-table-column
                label="零售价"
                width="120"
                align="center">
                <template scope="scope">
                    {{scope.row.retailPrice|formatMoney(scope.row.retailPrice)}}
                </template>
            </el-table-column>
            <el-table-column
                label="价格范围"
                width="100"
                align="center">
                <template scope="scope">
                    <div>
                        {{scope.row.priceRange}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button
                            type="primary"
                            size="mini"
                            @click="handleSkuList(scope.row.productId)">
                            查看商品详情
                        </el-button>
                        <el-button
                            type="primary"
                            size="mini"
                            class="el-icon-edit"
                            @click="handleAttr(scope.row)">
                        </el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination layout="prev, pager, next" :page-size="page.pageSize" :total="page.total"
                            :current-page="page.pageNum" @current-change="handleCurrentChange">
            </el-pagination>
        </div>

        <el-dialog :title="product.title" class="dialog" :visible.sync="productVisible" @close="resetDialog('form')">
            <el-form :model="product" ref="form" label-width="100px">
                <el-form-item label="所属类目" >
                    <el-select class="type" v-model="product.categoryId" placeholder="请选择所属类目" @change="handleCategory">
                        <el-option v-for="item in categoryList" :label="item.categoryName" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌" >
                    <el-select class="type" v-model="product.brandId" placeholder="请选择品牌" >
                        <el-option v-for="item in dBrandList" :label="item.brandName" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品图片">
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="product.thumbnailImage" :src="product.thumbnailImage" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input  v-model="product.productName"></el-input>
                </el-form-item>
                <el-form-item label="商品零售价">
                    <el-input  v-model="product.retailPrice"></el-input>
                </el-form-item>
                <el-form-item label="商品属性">
                    <el-checkbox-group v-model="product.spuAttr">
                        <div v-for="(item, index) in attrList" :key="index" style="margin-bottom: 30px;">
                            {{item.attrName}}:
                            <el-checkbox-button v-for="attr in item.attrValueEntityList" :label="attr" :key="attr.id">{{attr.attrValue}}</el-checkbox-button>
                        </div>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="商品规格">
                    <el-input  v-model="product.size" placeholder="颜色：红色、白色；大小：30mm"></el-input>
                </el-form-item>
                <el-form-item label="商品状态">
                    <el-switch
                        v-model="product.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="productVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveProduct()">确 定</el-button>
            </div>
        </el-dialog>
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
        getAttributeList,
        getSpuDetail,
        saveProduct,
    } from '../../api/api';
    import * as formatDate from '../../js/date';

    export default {
        data() {
            return {
                tableData: [],
                productVisible: false,
                product: {
                    categoryId: null,
                    brandId: null,
                    thumbnailImage: null,
                    productName: null,
                    retailPrice: null,
                    status: 1,
                    spuAttr: [],
                    afterSpuAttr: '',
                    beforeSpuAttr: '',
                    size: ''
                },
                categoryList: [],
                // 查询的品牌列表
                sBrandList: [],
                // dialog的品牌列表
                dBrandList: [],
                // 类目对应的属性列表
                attrList: [],
                searchGroup: {
                    categoryId: null,
                    brandId: null,
                    productName: null,
                    online: null
                },
                searchForm: {
                    categoryId: null,
                    brandId: null,
                    productName: null,
                    online: null
                },
                page: {
                    pageNum: 1,
                    total: 0,
                    pageSize: 20
                }
            };
        },
        methods: {
            handleAvatarSuccess(res, file) {
                this.product.thumbnailImage = URL.createObjectURL(file.raw).toString();
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            handleCategory(categoryId) {
                this.getBrandListByCategoryId(categoryId);
                this.$nextTick(() => {
                    this.handleAttr(this.product);
                });
            },
            handleSearch() {
                this.searchForm = {
                    ...this.searchGroup
                };
                this.page.pageNum = 1;
                this.getProductList();
            },

            // 页码变更
            handleCurrentChange(val) {
                this.searchGroup = {
                    ...this.searchForm
                };
                this.page.pageNum = val;
                this.getProductList();
            },

            changeCategory(categoryId) {
                this.getBrandListByCategoryId(categoryId, 'search');
            },
            handleEdit(product) {
                this.productVisible = true;
                product.title = '修改商品';
                if (product.spuAttr && typeof product.spuAttr === 'string') {
                    const spuAttr = [];
                    product.spuAttr = (product.spuAttr || '').split(',');
                    this.attrList.map(attr => {
                        attr.attrValueEntityList && attr.attrValueEntityList.map(value => {
                            if (product.spuAttr.includes(`${value.id}`)) {
                                spuAttr.push(value);
                            }
                        });
                    });
                    product.spuAttr = [...spuAttr];
                }
                this.product = { ...product };
                this.$set(this.product, 'status', product.online == 'Y');
            },

            handleAdd() {
                this.$set(this.product, 'title', '新增商品');
                this.productVisible = true;
            },

            handleAttr(product) {
                const param = {
                    userType: 1,
                    categoryIds: [parseInt(product.categoryId)]
                };
                getAttributeList(param).then((res) => {
                    if (res.status == 200) {
                        this.$set(this, 'attrList', res.data);
                        this.$nextTick(() => {
                            this.handleEdit(product);
                        });
                    }
                });
            },

            handleSkuList(spuId) {
                this.$router.push({ path: '/center/skuList',
                    query: {
                        spuId
                    }
                });
            },

            // saveAttr() {
            //     const spuAttr = [];
            //     const afterSpuAttr = [];
            //     this.spuAttr && this.spuAttr.map(item => {
            //         spuAttr.push(item.attrName);
            //         afterSpuAttr.push(item.id);
            //     });
            //     this.product.spuAttr = spuAttr;
            //     this.product.afterSpuAttr = (afterSpuAttr || '') && afterSpuAttr.toString();
            //     this.attrVisible = false;
            // },

            saveProduct() {
                const param = {
                    ...this.product,
                    id: this.product.productId
                };

                param.online = param.status ? 'Y' : 'N';
                const spuAttr = [];
                param.spuAttr.map(item => {
                    if (item && item.id) {
                        spuAttr.push(item.id);
                    }
                });
                param.spuAttr = `${param.beforeSpuAttr};${spuAttr && spuAttr.toString()}`;
                param.thumbnailImage = param.thumbnailImage && param.thumbnailImage.toString();
                saveProduct(param).then((res) => {
                    if (res.status == 200 && res.data > 0) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 2000,
                            onClose: () => {
                                this.productVisible = false;
                                this.getProductList();
                            }
                        });
                    }
                });
            },
            resetDialog(formName) {

                // this.product = {
                //     categoryId: null,
                //     brandId: null,
                //     thumbnailImage: null,
                //     productName: null,
                //     retailPrice: null,
                //     status: 1,
                //     spuAttr: [...this.beforEditAttr],
                // };
                // this.$refs[formName].resetFields();
            },
        
            // 类目
            getCategoryList() {
                const param = {
                    userType: -1
                };
                getCategoryList(param).then((res) => {
                    if (res.status == 200) {
                        const categoryList = res.data && res.data != '' ? res.data : [];
                        // 获得一级类目
                        this.$set(this, 'categoryList', categoryList.length > 0 && categoryList.filter(item => item.level === '2'));
                    }
                });
            },

            getBrandListByCategoryId(categoryId, type) {
                const param = {
                    categoryId
                };
                getBrandListByCategoryId(param).then((res) => {
                    if (res.status == 200) {
                        if (type === 'search') {
                            this.searchGroup.brandId = null;
                            this.$set(this, 'sBrandList', res.data);
                        } else {
                            this.product.brandId = null;
                            this.$set(this, 'dBrandList', res.data);
                        }
                    }
                });
            },

            getProductList() {
                const param = {
                    categoryIds: (this.searchForm.categoryId && this.searchForm.categoryId !='0') ? [this.searchForm.categoryId] : null,
                    brandIds: (this.searchForm.brandId && this.searchForm.brandId !='0') ? [this.searchForm.brandId] : null,
                    productName: this.searchForm.productName,
                    online: this.searchForm.online == 'YN' ? null : this.searchForm.online,
                    ...this.page
                };
                getProductList(param).then((res) => {
                    if (res.status == 200) {
                        const tableData = res.data;
                        tableData.map(item => {
                            item.beforeSpuAttr = item.spuAttr === 'null' ? '' : item.spuAttr;
                            item.thumbnailImage = item.thumbnailImage && item.thumbnailImage.split('；');
                        });
                        this.$set(this, 'tableData', tableData);
                    }
                });
            },

            // getSpuDetail(spuId) {
            //     if (!spuId) {
            //         return;
            //     }
            //     // 是否已经获取过了spuDetail
            //     const spu = this.tableData.find(item => item.productId == spuId);
            //     const param = {
            //         spuId
            //     };
            //     getSpuDetail(param).then((res) => {
            //         if (res.status == 200) {
            //             const list = res.data.skuDetailList;
            //             list.map(skuList => {
            //                 const sku = skuList.priceList[skuList.priceList.length - 1];

            //                 // 设置属性
            //                 skuList.skuAttr = [];
            //                 const skuAttr = sku.skuAttr.split('；');
            //                 skuAttr && skuAttr.map(item => {
            //                     skuList.skuAttr.push({
            //                         attrName: item.split('：')[0],
            //                         attrValue: item.split('：')[1]
            //                     });
            //                 });

            //                 // 设置图片
            //                 skuList.skuImg = [];
            //                 sku.skuImg && skuList.skuImg.push(sku.skuImg.split('；'));
            //                 skuList.retailPrice = sku.retailPrice;
            //                 skuList.minPrice = sku.minPrice;
            //                 skuList.salesNum = sku.salesNum;
            //                 skuList.stock = sku.stock;
            //                 skuList.size = sku.size;

            //                 // 设置promotionList commonList
            //                 skuList.promotionList = [];
            //                 skuList.commonList = [];
            //                 skuList.priceList.map(item => {
            //                     if (item.promotionId) {
            //                         skuList.promotionList.push(item);
            //                     } else if (!item.special) {
            //                         skuList.commonList.push(item);
            //                     }
            //                 });
            //             });
            //             this.$set(this, 'skuList', list);
            //         }
            //     });
            // },


        },
        created() {
            this.getCategoryList();
            this.getProductList();
            this.getBrandListByCategoryId();
        },
        filters: {
            formateStatus: (status) => {
                switch (status) {
                    case 'Y':
                        return '上架中';
                    default:
                        return '已下架';
                }
            },
            formatePoint: points => ((points !== null) ? points : '用户信息未完善')
        }
    };
</script>
