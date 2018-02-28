<template>
    <div class="category">
        <div class="search flex-col hor-center">
            <el-form :model="searchGroup" :inline="true" label-width="90px">
                <div class="searchItem">
                    <el-form-item label="类目">
                        <el-select class="type" v-model="searchGroup.categoryId" placeholder="请选择类目" @change="changeCategory()">
                            <el-option v-for="item in categoryList" :label="item.categoryName" :key="item.id" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="品牌">
                        <el-select class="type" v-model="searchGroup.brandId" placeholder="请选择品牌">
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
                            @click="handleSkuList(scope.row)">
                            查看商品详情
                        </el-button>
                        <el-button
                            type="primary"
                            size="mini"
                            class="el-icon-edit"
                            @click="handleEdit(scope.row)">
                        </el-button>
                        <el-button
                            type="primary"
                            size="mini"
                            class="el-icon-delete"
                            @click="deleteProduct(scope.row)">
                        </el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>

        <!-- <el-collapse @change="getSpuDetail" accordion>
            <el-collapse-item v-for="(product, index) in tableData" :name="product.productId" :key="index">
                <template slot="title">
                    <template v-for="item in product.thumbnailImage">
                        <img :src="item" width="60" height="60" :key="item" />
                    </template>
                    <div>
                        {{product.productName}}{{skuList ? skuList.skuAttr : false}}
                    </div>
                    <div>
                        类目
                        {{product.categoryName}}
                    </div>
                    <div>
                        上架状态：
                        {{product.online|formateStatus(product.online)}}
                    </div>
                    <div>
                         创建时间：
                        {{product.createTime|formatDate(product.createTime)}}
                    </div>
                    <div>
                        <el-button
                            type="primary"
                            size="mini"
                            class="el-icon-edit"
                            @click="handleEdit(product)">
                        </el-button>
                    </div>
                </template>
                
                <templat v-if="skuList">
                    <div class="tableBox">
                        <el-table
                            :data="skuList"
                            style="width: 96%">
                            <el-table-column
                                label="图片"
                                width="120"
                                align="center">
                                <template scope="scope" v-for="item in scope.row.skuImg">
                                    <img :src="item" :key="item" width="50" height="50" style="margin: 10px;"/>
                                </template>
                            </el-table-column>
                            
                            <el-table-column
                                label="属性"
                                width="120"
                                align="center">
                                <template scope="scope" v-for="item in scope.row.skuAttr">
                                    <div :key="item" class="flex-row">
                                        <div >{{item.attrName}}</div>
                                        <div>{{item.attrValue}}</div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="零售价"
                                width="170"
                                align="center">
                                <template scope="scope">
                                    {{scope.row.retailPrice|formateMoney(scope.row.retailPrice)}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="促销价"
                                width="170"
                                align="center">
                                <template scope="scope" v-for="item in scope.row.promotionList">
                                    <div :key="item">
                                        <span>{{item.startPiece}}</span> ~ <span>{{item.endPiece}}</span>
                                        <span>价格：{{item.price|formateMoney(item.price)}}</span>
                                        <span>库存：{{item.stock}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="批发价"
                                width="170"
                                align="center">
                                <template scope="scope" v-for="item in scope.row.commonList">
                                    <div :key="item">
                                        <span>会员等级：{{item.levelId}}</span>
                                        <span>{{item.startPiece}}</span> ~ <span>{{item.endPiece}}</span>
                                        <span>价格：{{item.price|formateMoney(item.price)}}</span>
                                        <span>库存：{{item.stock}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="销售数量"
                                width="120"
                                prop="salesNum"
                                align="center">
                            </el-table-column>
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-button-group>
                                        <el-button
                                            type="primary"
                                            size="mini"
                                            @click="handleAttr(scope.row)">
                                            查看属性
                                        </el-button>
                                        <el-button
                                            type="primary"
                                            size="mini"
                                            class="el-icon-edit"
                                            @click="handleEdit(scope.row)">
                                        </el-button>
                                        <el-button
                                            type="primary"
                                            size="mini"
                                            class="el-icon-delete"
                                            @click="deleteProduct(scope.row)">
                                        </el-button>
                                    </el-button-group>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </templat>
                
            </el-collapse-item>
        </el-collapse> -->

        <el-dialog :title="product.title" class="dialog" :visible.sync="productVisible" @close="resetDialog('form')">
            <el-form :model="product" ref="form" label-width="100px">
                <el-form-item label="所属类目" >
                    <el-select class="type" v-model="product.categoryId" placeholder="请选择所属类目" @change="getBrandListByCategoryId">
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
                <el-form-item label="商品价格范围">
                    <div class="flex-row">
                        <el-input  v-model="product.lowPrice"></el-input>
                        ~
                        <el-input  v-model="product.highPrice"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="商品属性">
                    <el-tag
                        v-for="tag in product.spuAttr"
                        :key="tag"
                        closable>
                        {{tag}}
                    </el-tag>
                    <el-button size="small" @click="handleAttr">+ New Tag</el-button>
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

        <el-dialog title="添加属性" class="dialog" :visible.sync="attrVisible" @close="resetDialog('attr')">
            <el-form :model="product.skuAttr" ref="attr">
                <el-form-item label-width="80px">
                    <el-checkbox-group v-model="product.spuAttr">
                        <el-checkbox
                            v-for="item in attrList"
                            :label="item.attrName"
                            :key="item.id">
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="attrVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAttr()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<style>
    @import "../css/category";
</style>
<script>
    import {
        getCategoryList,
        getBrandListByCategoryId,
        getProductList,
        getAttributeList,
        getSpuDetail,
        saveProduct,
        deleteProduct
    } from '../api/api';
    import * as formatDate from '../js/date';

    export default {
        data() {
            return {
                tableData: [],
                productVisible: false,
                attrVisible: false,
                product: {
                    categoryId: null,
                    brandId: null,
                    thumbnailImage: null,
                    productName: null,
                    retailPrice: null,
                    lowPrice: null,
                    highPrice: null,
                    status: 1,
                    spuAttr: [],
                },
                beforEditAttr: [],
                categoryList: [],
                // 查询的品牌列表
                sBrandList: [],
                // dialog的品牌列表
                dBrandList: [],
                // 类目对应的属性列表
                attrList: [],
                searchGroup: {
                    categoryId: null,
                    brandName: null,
                    isFinished: null
                },
                searchForm: {
                    categoryId: null,
                    brandName: null,
                    isFinished: null
                },
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
            formateSaveMessage(data) {
                switch (data) {
                    case -10:
                        return '该类目下存在商品，您不能修改该类目，请先删除商品后操作';
                    case -11:
                        return '该类目下存在属性标签，您不能修改该类目，请先删除属性后操作';
                    case -20:
                        return '该类目下存在上架商品，您不能关闭该类目状态，请先关闭或删除商品后操作';
                    case -21:
                        return '该类目下存在使用中的属性，您不能关闭该类目状态，请先关闭或删除属性后操作';
                    case -30:
                        return '该类目下存在使用中的子类目，您不能关闭该类目状态，请先关闭或删除子类目后操作';
                    default:
                        return '修改成功';
                }
            },
            formateDeleteMessage(data) {
                switch (data) {
                    case -10:
                        return '该类目下存在商品，您不能删除该类目，请先删除商品后操作';
                    case -11:
                        return '该类目下存在属性标签，您不能删除该类目，请先删除属性后操作';
                    default:
                        return '删除成功';
                }
            },

            handleEdit(product) {
                product.title = '修改商品';
                product.status = product.online == 'Y';
                this.beforEditAttr = product.spuAttr;
                this.$set(this, 'product', product);
                this.productVisible = true;
            },

            handleAdd() {
                this.$set(this.product, 'title', '新增商品');
                this.productVisible = true;
            },

            handleAttr() {
                const param = {
                    userType: 1,
                    categoryIds: [parseInt(this.product.categoryId)]
                };
                getAttributeList(param).then((res) => {
                    if (res.status == 200) {
                        if (res.data.length === 0) {
                            this.$message({
                                message: '该类目下没有属性，请先新增属性',
                                type: 'warning',
                                duration: 2000,
                            });
                        } else {
                            this.attrVisible = true;
                            this.$set(this, 'attrList', res.data);
                        }
                    }
                });
            },

            saveAttr() {
                this.attrVisible = false;
            },

            deleteProduct(product) {
                const param = {
                    ...product
                };
                deleteProduct(param).then((res) => {
                    if (res.status == 200) {
                        this.$message({
                            message: `${this.formateDeleteMessage(res.data)}`,
                            type: `${res.data > 0 ? 'success' : 'warning'}`,
                            duration: 2000,
                            onClose: () => {
                                this.productVisible = false;
                                this.getProductList();
                            }
                        });
                    }
                });
            },
            saveProduct() {
                const param = {
                    ...this.product
                };
                param.status = param.status ? 1 : 2;
                saveProduct(param).then((res) => {
                    if (res.status == 200) {
                        this.$message({
                            message: `${this.formateMessage(res.data)}`,
                            type: `${res.data > 0 ? 'success' : 'warning'}`,
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
                if (formName == 'attr') {
                    this.product.spuAttr = this.beforEditAttr;
                } else {
                    this.product = {
                        categoryId: null,
                        brandId: null,
                        thumbnailImage: null,
                        productName: null,
                        retailPrice: null,
                        lowPrice: null,
                        highPrice: null,
                        status: 1,
                        spuAttr: this.beforEditAttr,
                    };
                }
                this.$refs[formName].resetFields();
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
                    ...this.searchForm,
                    ...this.page
                };
                getProductList(param).then((res) => {
                    if (res.status == 200) {
                        const tableData = res.data;
                        tableData.map(item => {
                            item.thumbnailImage = item.thumbnailImage && item.thumbnailImage.split('；');
                            if (item.spuAttr) {
                                item.spuAttr = item.spuAttr.split('；').map(attr => attr.split('：')[0]);
                            }
                        });
                        this.$set(this, 'tableData', tableData);
                    }
                });
            },

            getSpuDetail(spuId) {
                if (!spuId) {
                    return;
                }
                // 是否已经获取过了spuDetail
                const spu = this.tableData.find(item => item.productId == spuId);
                const param = {
                    spuId
                };
                getSpuDetail(param).then((res) => {
                    if (res.status == 200) {
                        const list = res.data.skuDetailList;
                        list.map(skuList => {
                            const sku = skuList.priceList[skuList.priceList.length - 1];

                            // 设置属性
                            skuList.skuAttr = [];
                            const skuAttr = sku.skuAttr.split('；');
                            skuAttr && skuAttr.map(item => {
                                skuList.skuAttr.push({
                                    attrName: item.split('：')[0],
                                    attrValue: item.split('：')[1]
                                });
                            });

                            // 设置图片
                            skuList.skuImg = [];
                            sku.skuImg && skuList.skuImg.push(sku.skuImg.split('；'));
                            skuList.retailPrice = sku.retailPrice;
                            skuList.minPrice = sku.minPrice;
                            skuList.salesNum = sku.salesNum;
                            skuList.stock = sku.stock;

                            // 设置promotionList commonList
                            skuList.promotionList = [];
                            skuList.commonList = [];
                            skuList.priceList.map(item => {
                                if (item.promotionId) {
                                    skuList.promotionList.push(item);
                                } else if (!item.special) {
                                    skuList.commonList.push(item);
                                }
                            });
                        });
                        this.$set(this, 'skuList', list);
                    }
                });
            },


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
