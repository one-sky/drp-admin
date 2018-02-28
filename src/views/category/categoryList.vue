<template>
    <div class="category">
        <div class="search flex-col hor-center">
            <el-form :inline="true">
                <el-form-item>
                    <el-button class="el-icon-plus" @click="handleAdd" type="primary"></el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-collapse>
            <el-collapse-item v-for="(category, index) in tableData" :name="category.categoryName" :key="index">
                <template slot="title">
                    <img :src="category.categoryPic" width="60" height="60" />
                    <div>
                        {{category.categoryName}}
                        {{category.categoryEgName}}
                    </div>
                    <div>
                        状态：
                        {{category.status|formateStatus(category.status)}}
                    </div>
                    <div>
                         创建时间：
                        {{category.createTime|formatDate(category.createTime)}}
                    </div>
                    <div>
                        <el-button
                            type="primary"
                            size="mini"
                            class="el-icon-edit"
                            @click="handleEdit(category)">
                        </el-button>
                        <el-button
                            v-if="!category.childCategoryList || category.childCategoryList.length === 0"
                            type="primary"
                            size="mini"
                            class="el-icon-delete"
                            @click="deleteCategory(category)">
                        </el-button>
                    </div>
                    
                </template>
                <div class="tableBox">
                    <el-table
                        :data="category.childCategoryList"
                        style="width: 96%">
                        <el-table-column
                            label="类目图片"
                            width="120"
                            align="center">
                            <template scope="scope">
                                <img :src="scope.row.categoryPic" width="50" height="50" style="margin: 10px;"/>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="名称"
                            width="120"
                            prop="categoryName"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            label="英文名称"
                            width="120"
                            prop="categoryEgName"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            label="状态"
                            width="170"
                            align="center">
                            <template scope="scope">
                                {{scope.row.status|formateStatus(scope.row.status)}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="属性"
                            width="220"
                            align="center">
                            <template scope="scope">
                                <div class="flex-row-col hor-center">
                                    <el-button
                                        v-for="(item, index) in scope.row.attrList"
                                        v-if="index < 3"
                                        :key="item.id"
                                        class="attr">
                                        {{item.attrName}}
                                    </el-button>
                                    <el-button v-if="scope.row.attrList && scope.row.attrList.length > 3">...</el-button>
                                    <el-button size="mini" v-if="scope.row.attrList.length == 0" type="primary" @click="handleAttr(scope.row.id)">
                                        增加属性
                                    </el-button>
                                    <el-button v-else size="mini" type="primary" @click="handleAttr(scope.row.id)">
                                        查看属性详情
                                    </el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="创建时间"
                            width="180"
                            align="center">
                            <template scope="scope">
                                {{scope.row.createTime|formatDate(scope.row.createTime)}}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button-group>
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        class="el-icon-edit"
                                        @click="handleEdit(scope.row, category.status)">
                                    </el-button>
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        class="el-icon-delete"
                                        @click="deleteCategory(scope.row)">
                                    </el-button>
                                </el-button-group>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-collapse-item>
        </el-collapse>

        <el-dialog :title="category.title" class="dialog" :visible.sync="categoryVisible" @close="resetDialog('form')">
            <el-form :model="category" ref="form">
                <el-form-item label="类目级别" v-if="category.title == '新增类目'">
                    <el-select class="type" v-model="category.level" placeholder="请选择类目级别">
                        <el-option label="一级大类" value="1"></el-option>
                        <el-option label="二级类目" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属类目" v-if="category.level == 2" >
                    <el-select class="type" v-model="category.parentId" placeholder="请选择所属类目" @change="changeStatus">
                        <el-option v-for="item in tableData" :label="item.categoryName" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类目图片">
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="category.categoryPic" :src="category.categoryPic" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="类目名称">
                    <el-input  v-model="category.categoryName"></el-input>
                </el-form-item>
                <el-form-item label="类目英文名称">
                    <el-input  v-model="category.categoryEgName"></el-input>
                </el-form-item>
                <el-form-item label="类目是否使用">
                    <el-switch
                        v-model="category.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :disabled="!!category.switch">
                    </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="categoryVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveCategory()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<style>
    @import "../../css/category";
</style>
<script>
    import {
        getAttributeList,
        getCategoryList,
        getCategoryById,
        saveCategory,
        deleteCategory
    } from '../../api/api';
    import * as formatDate from '../../js/date';

    export default {
        data() {
            return {
                tableData: [],
                categoryVisible: false,
                category: {
                    categoryPic: null,
                    categoryName: null,
                    categoryEgName: null,
                    status: 1,
                    parentId: null,
                    level: null,
                    switch: false,
                },
                attrList: [],
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
            changeStatus(val) {
                const category = this.tableData.find(item => item.id == val);
                if (category != null && category.status == 2) {
                    this.$set(this.category, 'status', 2);
                    this.$set(this.category, 'switch', true);
                } else {
                    this.$set(this.category, 'switch', true);
                }
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
            handleEdit(row) {
                this.getCategoryById(row.id);
                this.categoryVisible = true;
            },
            handleAdd() {
                this.$set(this.category, 'title', '新增类目');
                this.categoryVisible = true;
            },
            handleAttr(categoryId) {
                this.$router.push({ path: '/center/attrList',
                    query: {
                        categoryId
                    }
                });
            },
            deleteCategory(category) {
                const param = {
                    ...category
                };
                deleteCategory(param).then((res) => {
                    if (res.status == 200) {
                        this.$message({
                            message: `${this.formateDeleteMessage(res.data)}`,
                            type: `${res.data > 0 ? 'success' : 'warning'}`,
                            duration: 2000,
                            onClose: () => {
                                this.categoryVisible = false;
                                this.getAttributeList();
                            }
                        });
                    }
                });
            },
            saveCategory() {
                const param = {
                    ...this.category
                };
                param.status = param.status ? 1 : 2;
                saveCategory(param).then((res) => {
                    if (res.status == 200) {
                        this.$message({
                            message: `${this.formateMessage(res.data)}`,
                            type: `${res.data > 0 ? 'success' : 'warning'}`,
                            duration: 2000,
                            onClose: () => {
                                this.categoryVisible = false;
                                this.getAttributeList();
                            }
                        });
                    }
                });
            },
            resetDialog(formName) {
                this.category = {
                    categoryPic: null,
                    categoryName: null,
                    categoryEgName: null,
                    status: 2,
                    parentId: null,
                    level: null,
                    switch: false,
                };
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
                        const tableData = categoryList.filter(item => {
                            if (item.level == 1) {
                                item.childCategoryList = categoryList.filter(child => child.level == 2 && child.parentId == item.id);
                                this.attrList.length > 0 && item.childCategoryList && item.childCategoryList.map(i => {
                                    i.attrList = this.attrList.filter(attr => attr.categoryId == i.id);
                                });
                                return true;
                            }
                            return false;
                        });
                        this.$set(this, 'tableData', tableData);
                    }
                });
            },

            getAttributeList() {
                const param = {
                    userType: -1
                };
                getAttributeList(param).then((res) => {
                    if (res.status == 200) {
                        this.$set(this, 'attrList', res.data);
                        this.getCategoryList();
                    }
                });
            },

            // 类目
            getCategoryById(id) {
                const param = {
                    id
                };
                getCategoryById(param).then((res) => {
                    if (res.status == 200) {
                        this.$set(this, 'category', res.data);
                        this.category.status = (this.category.status == 1);
                        this.$set(this.category, 'title', '修改类目');
                    }
                });
            },
        },
        created() {
            this.getAttributeList();
        },
        filters: {
            formateStatus: (status) => {
                switch (status) {
                    case 1:
                        return '使用中';
                    default:
                        return '未使用';
                }
            },
            formatePoint: points => ((points !== null) ? points : '用户信息未完善')
        }
    };
</script>
