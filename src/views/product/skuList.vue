<template>
    <div class="category">
        <div class="search flex-col hor-center">
            <el-form :inline="true">
                <el-form-item>
                    <el-button @click="this.$router.push({ path: '/center/product'});" type="primary">返回商品列表</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button class="el-icon-plus" @click="handleSku('add')" type="primary"></el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-collapse>
            <el-collapse-item v-for="(sku, index) in tableData.skuDetailList" :name="sku.skuId" :key="index">
                <template slot="title">
                    <div v-for="item in sku.skuImg" :key="item">
                        <img :src="item" :key="item" width="50" height="50" style="margin: 10px;"/>
                    </div>
                    <div>
                         sku编号：
                        {{sku.skuCode}}
                    </div>
                    <div>
                         零售价：
                        {{sku.retailPrice|formatMoney(sku.retailPrice)}}
                    </div>
                    <div>
                         最低价：
                        {{sku.minPrice|formatMoney(sku.minPrice)}}
                    </div>
                    <div>
                         库存：
                        {{sku.stock}}
                    </div>
                    <div>
                         销售数量：
                        {{sku.salesNum}}
                    </div>
                    <div class="flex-row">
                        <span>属性：</span>
                        <div v-for="attr in sku.skuAttr" :key="attr.name" style="margin-left: 4px;">
                            {{attr.attrName}}:{{attr.attrValue}}
                        </div>
                    </div>
                    <div>
                        <el-button
                            type="primary"
                            size="mini"
                            class="el-icon-edit"
                            @click="handleSku('edit', sku)">
                        </el-button>
                    </div>
                </template>
                <div class="tableBox" v-if="sku.priceList && sku.priceList.length > 0">
                    <el-table
                        :data="sku.priceList"
                        style="width: 40%">
                        <el-table-column
                            label="会员等级"
                            width="120"
                            prop="levelId"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            label="价格"
                            width="400"
                            align="center">
                            <template scope="scope">
                                <div>
                                    <span>{{scope.row.startPiece}}</span> ~ <span>{{scope.row.endPiece}}</span>
                                    <span>价格：{{scope.row.price|formatMoney(scope.row.price)}}</span>
                                </div>
                                <div v-if="scope.row.promotionId">促销价</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="flex-row hor-center addBtn">
                    <el-button @click="handlePriceList('add', sku)">+ 添加批次</el-button>
                    <el-button @click="handlePriceList('edit', sku)">修改价格</el-button>
                </div>
            </el-collapse-item>
        </el-collapse>

        <el-dialog :title="sku.title" class="dialog" :visible.sync="skuVisible" @close="resetDialog('form')">
            <el-form :model="sku" ref="form" inline>
                <el-form-item label="sku图片">
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="sku.skuImg" :src="sku.skuImg[0]" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="sku编号">
                   <el-input  v-model="sku.skuCode"></el-input>
                </el-form-item>
                <el-form-item label="零售价">
                   <el-input  v-model="sku.retailPrice"></el-input>
                </el-form-item>
                <el-form-item label="最低价">
                    <el-input  v-model="sku.minPrice"></el-input>
                </el-form-item>
                <el-form-item label="库存">
                    <el-input  v-model="sku.stock"></el-input>
                </el-form-item>
                <div class="flex-col">
                    <el-form-item v-for="(item, index) in attrList" :key="item.attrName" :label="item.attrName">
                        <el-select class="type" v-model="sku.skuAttr[index].attrValue" placeholder="请选择属性值">
                            <el-option v-for="attr in item.attrValue" :label="attr" :key="attr" :value="attr"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                
                <el-form-item v-if="sku.title == '新增sku商品'" v-for="i in priceNum" label="批量" :key="i" class="price">
                   <el-input  v-model="sku.priceList[i-1].startPiece"></el-input>
                   ~
                   <el-input  v-model="sku.priceList[i-1].endPiece"></el-input>
                   价格:
                   <el-input  v-model="sku.priceList[i-1].price"></el-input>
                   会员等级:
                   <el-input  v-model="sku.priceList[i-1].levelId"></el-input>
                   <el-button size="mini" type="primary" @click="handleRemovePriceList(sku.priceList, i-1)">删除</el-button>
                </el-form-item>
                <div  v-if="sku.title == '新增sku商品'" class="flex-row hor-center addBtn">
                    <el-button @click="handleReAdd(sku.priceList)">+ 添加批次</el-button>
                </div>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="skuVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveSku()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog class="dialog" :visible.sync="priceListVisible" @close="resetDialog('priceList')" >
            <el-form ref="priceList" >
                <el-form-item v-if="priceListVisible" v-for="i in priceNum" label="批量" :key="i" class="price">
                   <el-input  v-model="priceList[i-1].startPiece"></el-input>
                   ~
                   <el-input  v-model="priceList[i-1].endPiece"></el-input>
                   价格:
                   <el-input  v-model="priceList[i-1].price"></el-input>
                   会员等级:
                   <el-input  v-model="priceList[i-1].levelId"></el-input>
                   <el-button size="mini" type="primary" @click="handleRemovePriceList(priceList, i-1)">删除</el-button>
                </el-form-item>
                <div class="flex-row hor-center addBtn">
                    <el-button @click="handleReAdd(priceList)">+ 添加批次</el-button>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="priceListVisible = false">取 消</el-button>
                <el-button type="primary" @click="savePriceList()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<style>
    @import "../../css/category";
</style>
<script>
    import {
        getSpuDetail,
        saveSku,
        savePriceList
    } from '../../api/api';

    export default {
        data() {
            return {
                spuId: null,
                tableData: [],
                attrList: [],
                sku: {
                    title: null,
                    skuCode: null,
                    skuImg: [],
                    retailPrice: null,
                    minPrice: null,
                    stock: null,
                    skuAttr: [],
                    priceList: []
                },
                priceList: [],
                currentSkuId: 0,
                priceNum: 0,
                skuVisible: false,
                priceListVisible: false
            };
        },
        methods: {
            handleAvatarSuccess(res, file) {
                this.brand.logo = URL.createObjectURL(file.raw);
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
            handleSku(type, row) {
                if (type === 'edit') {
                    this.sku = {
                        title: '修改sku商品',
                        ...row,
                    };
                } else {
                    this.sku.title = '新增sku商品';
                    this.sku.priceList = [{
                        startPiece: 0,
                        endPiece: 0,
                        price: 0,
                        levelId: 1
                    }];
                    this.priceNum = 1;
                }
                this.skuVisible = true;
            },
            handlePriceList(type, row) {
                this.priceListVisible = true;
                this.currentSkuId = row.skuId;
                this.priceList = [...row.priceList];
                if (type === 'add') {
                    this.priceList.push({
                        startPiece: 0,
                        endPiece: 0,
                        price: 0,
                        levelId: 1
                    });
                }
                this.priceNum = this.priceList.length;
            },

            handleRemovePriceList(priceList, index) {
                priceList.splice(index, 1);
                this.priceNum = this.priceNum - 1;
            },

            handleReAdd(priceList) {
                priceList.push({
                    startPiece: 0,
                    endPiece: 0,
                    price: 0,
                    levelId: 1
                });
                this.priceNum = this.priceNum + 1;
            },
            saveSku() {
                let skuAttr = '';
                this.sku.skuAttr.map(item => {
                    skuAttr = `${skuAttr}${item.attrName}：${item.attrValue}；`;
                    return true;
                });
                skuAttr = skuAttr.substring(0, skuAttr.length - 1);
                const param = {
                    ...this.sku,
                    id: this.sku.skuId,
                    productId: this.spuId,
                };
                const priceList = param.priceList;
                priceList.map(item => {
                    item.lowQuantity = item.startPiece;
                    item.highQuantity = item.endPiece;
                    item.level = item.levelId;
                });
                param.skuAttr = skuAttr;
                param.priceList = priceList;
                param.skuImg = param.skuImg.toString();
                saveSku(param).then((res) => {
                    if (res.status == 200 && res.data > 0) {
                        this.$message({
                            message: '保存成功',
                            type: 'success',
                            duration: 2000,
                            onClose: () => {
                                this.skuVisible = false;
                                this.getSpuDetail();
                            }
                        });
                    }
                });
            },
            savePriceList() {
                const priceList = this.priceList;
                priceList.map(item => {
                    item.lowQuantity = item.startPiece;
                    item.highQuantity = item.endPiece;
                    item.level = item.levelId;
                });
                const param = {
                    skuId: this.currentSkuId,
                    priceList: this.priceList
                };
                savePriceList(param).then((res) => {
                    if (res.status == 200) {
                        this.$message({
                            message: '保存成功',
                            type: 'success',
                            duration: 2000,
                            onClose: () => {
                                this.priceListVisible = false;
                                this.getSpuDetail();
                            }
                        });
                    }
                });
            },
            resetDialog(formName) {
                if (formName === 'priceList') {
                    this.priceList = [];
                } else {
                    const skuAttr = [];
                    
                    this.attrList.map(item => {
                        skuAttr.push({
                            attrName: item.attrName,
                            attrValue: null
                        });
                    });
                    this.sku = {
                        title: null,
                        skuCode: null,
                        skuImg: [],
                        retailPrice: null,
                        minPrice: null,
                        stock: null,
                        skuAttr,
                        priceList: []
                    };
                }
                this.priceNum = 0;
                this.$refs[formName].resetFields();
            },
        

            getSpuDetail() {
                const param = {
                    spuId: this.spuId,
                };
                getSpuDetail(param).then((res) => {
                    if (res.status == 200) {
                        const tableData = res.data;
                        tableData.skuDetailList && tableData.skuDetailList.map(item => {
                            const sku = item.priceList.find(price => price.promotionId == null && price.special == null);
                            item.skuAttr = [];
                            if (sku.skuAttr) {
                                const attr = sku.skuAttr.split('；');
                                attr.map(i => {
                                    item.skuAttr.push({
                                        attrName: i.split('：')[0],
                                        attrValue: i.split('：')[1]
                                    });
                                });
                            }
                            item.skuImg = sku.skuImg && sku.skuImg.split(';');
                            item.skuId = sku.skuId;
                            item.retailPrice = sku.retailPrice;
                            item.minPrice = sku.minPrice;
                            item.salesNum = sku.salesNum;
                            item.stock = sku.stock;
                            item.skuCode = sku.skuCode;
                        });
                        this.$set(this, 'tableData', res.data);
                        if (this.tableData.spuSearchVO.size) {
                            const attrList = this.tableData.spuSearchVO.size.split('；');
                            this.attrList.length === 0 && attrList.map(item => {
                                const attr = item.split('：');
                                const attrValue = attr[1].split('、');
                                this.attrList.push({
                                    attrName: attr[0],
                                    attrValue
                                });
                            });
                            const skuAttr = [];
                            this.attrList.map(item => {
                                skuAttr.push({
                                    attrName: item.attrName,
                                    attrValue: null
                                });
                            });
                            this.sku.skuAttr = skuAttr;
                        }
                    }
                });
            },
        },
        mounted() {
            this.spuId = parseInt(this.$route.query.spuId);
            this.getSpuDetail();
        }
    };
</script>
