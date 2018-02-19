<template>
    <div class="brand">
        <div class="search flex-col hor-center">
            <el-form :model="searchGroup" :inline="true">
                <el-form-item label="类目">
                    <el-select class="type" v-model="searchGroup.categoryId" placeholder="请选择类目">
                        <el-option v-for="item in categoryList" :label="item.categoryName" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌名称">
                    <el-input  v-model="searchGroup.brandName"></el-input>
                </el-form-item>
                <el-form-item label="品牌完善状态">
                    <el-select class="type" v-model="searchGroup.isFinished" placeholder="请选择品牌完善状态">
                        <el-option label="全部" value="YN"></el-option>
                        <el-option label="已完善" value="Y"></el-option>
                        <el-option label="未完善" value="N"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                <el-button @click="handleSearch" type="primary">查询</el-button>
                <el-button class="el-icon-plus" @click="handleAdd" type="primary"></el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableBox">
            <el-table
                :data="tableData"
                style="width: 96%">
                <el-table-column
                    label="logo"
                    width="120"
                    align="center">
                    <template scope="scope">
                        <img :src="scope.row.logo" width="50" height="50" style="margin: 10px;"/>
                        
                    </template>
                </el-table-column>
                <el-table-column
                    label="所属类目"
                    width="150"
                    prop="categoryName"
                >
                </el-table-column>
                <el-table-column
                    label="品牌名称"
                    width="170"
                    prop="brandName"
                >
                </el-table-column>
                <el-table-column
                    label="状态"
                    width="100"
                >
                    <template scope="scope">
                        <div>{{scope.row.isFinished|formateStatus(scope.row.isFinished)}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="描述"
                    width="220"
                    prop="description"
                    class="long-title"
                >
                </el-table-column>
                
                <el-table-column
                    label="创建时间"
                    width="180"
                >
                    <template scope="scope">
                        {{scope.row.createTime|formatDate(scope.row.createTime)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button
                                type="primary"
                                size="mini"
                                class="el-icon-more"
                                @click="getBrandAttachment(scope.row.id)">
                            </el-button>
                            <el-button
                                type="primary"
                                size="mini"
                                class="el-icon-edit"
                                @click="handleEdit(scope.row.id)">
                            </el-button>
                            <el-button
                                type="primary"
                                size="mini"
                                class="el-icon-delete"
                                @click="deleteBrand(scope.row.id)">
                            </el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="pagination">
            <el-pagination layout="prev, pager, next" :page-size="page.pageSize" :total="page.total"
                            :current-page="page.pageNum" @current-change="handleCurrentChange">
            </el-pagination>
        </div>

        <el-dialog title="相关信息" class="dialog" :visible.sync="dialogVisible">
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updatePoint()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="brand.title" class="dialog" :visible.sync="brandVisible">
            <el-form :model="brand">
                <el-form-item label="类目">
                    <el-select class="type" v-model="brand.categoryId" ref="category" placeholder="请选择类目">
                        <el-option v-for="item in categoryList" :label="item.categoryName" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌logo">
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="brand.logo" :src="brand.logo" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="品牌名称">
                    <el-input  v-model="brand.brandName"></el-input>
                </el-form-item>
               <el-form-item label="品牌描述">
                    <el-input
                        class="reason"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入品牌描述"
                        v-model="brand.description">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="brandVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveBrand()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style>
    @import "../../css/brand";
</style>
<script>
    import {
        getCategoryList,
        getBrandList,
        getBrandAttachment,
        getBrandById,
        deleteBrand,
        saveBrand
    } from '../../api/api';
    import * as formatDate from '../../js/date';

    export default {
        data() {
            return {
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
                categoryList: [],
                tableData: [],
                brandAttachment: {},
                page: {
                    pageNum: 1,
                    total: 0,
                    pageSize: 20
                },
                dialogVisible: false,
                brandVisible: false,
                brand: {
                    id: null,
                    brandName: null,
                    categoryId: null,
                    logo: null,
                    description: null
                }
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
            handleSearch() {
                this.searchForm = {
                    ...this.searchGroup
                };
                this.page.pageNum = 1;
                this.getBrandList();
            },

            // 页码变更
            handleCurrentChange(val) {
                this.searchGroup = {
                    ...this.searchForm
                };
                this.page.pageNum = val;
                this.getBrandList();
            },
            handleEdit(id) {
                this.$set(this.brand, 'id', id);
                this.$set(this.brand, 'title', '修改品牌');
                this.getBrandById(id);
                this.brandVisible = true;
            },
            handleAdd() {
                this.$set(this.brand, 'id', null);
                this.$set(this.brand, 'title', '新增品牌');
                this.brandVisible = true;
            },
            resetDialog(formName) {
                this.brand = {
                    id: null,
                    brandName: null,
                    categoryId: null,
                    logo: null,
                    description: null
                };
                this.$refs[formName].resetFields();
            },
            saveBrand() {
                this.brandVisible = false;
                if (this.brand.title === '新增品牌') {
                    this.searchGroup = {
                        categoryId: null,
                        brandName: null,
                        isFinished: null
                    };
                }
                
                const param = {
                    ...this.brand,
                    categoryName: this.$refs.category.selectedLabel,
                };
                saveBrand(param).then((res) => {
                    let type = 'error';
                    let message = '修改失败';
                    if (res.status == 200) {
                        if (res.data == -10) {
                            message = '修改失败，该品牌下存在商品，不可更改类目';
                        } else if (res.data > 0) {
                            type = 'success';
                            message = '修改成功';
                        }
                    }
                    this.$message({
                        message: `${message}`,
                        type: `${type}`,
                        duration: 2000,
                        onClose: () => {
                            this.page.pageNum = 1;
                            this.getBrandList();
                        }
                    });
                });
            },
            deleteBrand(brandId) {
                const param = {
                    brandId
                };
                deleteBrand(param).then((res) => {
                    if (res.status == 200) {
                        if (res.data == -10) {
                            this.$message({
                                message: '该品牌有相关商品，请先删除商品',
                                type: 'warning',
                                duration: 2000,
                            });
                        } else if (res.data > 0) {
                            this.$message({
                                message: '删除品牌成功',
                                type: 'success',
                                duration: 2000,
                                onClose: () => {
                                    this.page.pageNum = 1;
                                    this.getBrandList();
                                }
                            });
                        }
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
            getBrandList() {
                const search = {
                    ...this.searchForm
                };
                search.isFinished = search.isFinished === 'YN' ? null : search.isFinished;
                const param = {
                    ...search,
                    ...this.page,
                };
                getBrandList(param).then((res) => {
                    if (res.status == 200) {
                        this.$set(this, 'tableData', res.data);
                        this.page.total = res.page.total;
                    }
                });
            },
            getBrandById(id) {
                const param = {
                    id 
                };
                getBrandById(param).then((res) => {
                    if (res.status == 200) {
                        this.$set(this, 'brand', {
                            ...res.data
                        });
                    }
                });
            },
            getBrandAttachment(brandId) {
                const param = {
                    brandId
                };
                getBrandList(param).then((res) => {
                    if (res.status == 200) {
                        this.$set(this, 'brandAttachment', res.data);
                        this.page.total = res.page.total;
                    }
                });
            }
        },
        created() {
            this.getBrandList();
            this.getCategoryList();
        },
        filters: {
            formateStatus: (status) => {
                switch (status) {
                    case 'Y':
                        return '已完善';
                    default:
                        return '未完善';
                }
            },
            formatePoint: points => ((points !== null) ? points : '用户信息未完善')
        }
    };
</script>
