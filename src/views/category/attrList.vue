<template>
    <div class="category" :key = "category.id">
        <div class="search flex-col hor-center">
            <el-form :inline="true">
                <el-form-item>
                    <el-button @click="handleAdd" type="primary">返回类目列表</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button class="el-icon-plus" @click="handleAdd" type="primary"></el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-collapse>
            <el-collapse-item v-for="(attr, index) in tableData" :name="attr.attrName" :key="index">
                <template slot="title">
                    <div>
                        {{attr.attrName}}
                    </div>
                    <div>
                         创建时间：
                        {{attr.createTime|formatDate(attr.createTime)}}
                    </div>
                    <div>
                        <el-button
                            type="primary"
                            size="mini"
                            class="el-icon-edit"
                            @click="handleEdit(attr, 'attr')">
                        </el-button>
                        <el-button
                            v-if="!attr.attrValueEntityList || attr.attrValueEntityList.length === 0"
                            type="primary"
                            size="mini"
                            class="el-icon-delete"
                            @click="deleteAttr(attr)">
                        </el-button>
                    </div>
                    
                </template>
                <div class="tableBox">
                    <el-table
                        :data="attr.attrValueEntityList"
                        style="width: 96%">
                        <el-table-column
                            label="名称"
                            width="120"
                            prop="attrValue"
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
                                        @click="handleEdit(scope.row, 'attrValue', attr)">
                                    </el-button>
                                    <el-button
                                        v-if="!scope.row.spuIds"
                                        type="primary"
                                        size="mini"
                                        class="el-icon-delete"
                                        @click="deleteAttr(scope.row)">
                                    </el-button>
                                </el-button-group>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-collapse-item>
        </el-collapse>

        <el-dialog :title="attr.title" class="dialog" :visible.sync="attrVisible" @close="resetDialog('form')">
            <el-form :model="attr" ref="form">
                <el-form-item label="属性级别" v-if="attr.title == '新增属性'">
                    <el-select class="type" v-model="attr.level" placeholder="请选择类目级别">
                        <el-option label="属性大类" value="1"></el-option>
                        <el-option label="子属性" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属类目"  v-if="attr.level == 1" >
                    <el-select class="type" v-model="attr.categoryId" placeholder="请选择类目" :disabled="attr.status && attr.title=='修改属性'">
                        <el-option v-for="item in categoryList" :label="item.categoryName" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属属性" v-else >
                    <el-select class="type" v-model="attr.attrId" placeholder="请选择所属属性">
                        <el-option v-for="item in tableData" :label="item.attrName" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="属性名称">
                    <el-input  v-model="attr.name"></el-input>
                </el-form-item>
                <el-form-item label="属性是否使用" v-if="attr.level == 2">
                    <el-switch
                        v-model="attr.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
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
    @import "../../css/category";
</style>
<script>
    import {
        getAttributeList,
        getCategoryList,
        getCategoryById,
        saveAttr,
        deleteAttr,
        saveAttrValue,
        deleteAttrValue
    } from '../../api/api';
    import * as formatDate from '../../js/date';

    export default {
        data() {
            return {
                tableData: [],
                category: {
                    id: 0
                },
                categoryList: [],
                attrVisible: false,
                attr: {
                    title: null,
                    name: null,
                    status: true,
                    categoryId: null,
                    attrId: null,
                    level: null,
                    switch: false,
                },
            };
        },
        methods: {
            handleEdit(row, type) {
                this.attrVisible = true;
                if (type === 'attr') {
                    this.attr = {
                        title: '修改属性',
                        id: row.id,
                        name: row.attrName,
                        status: row.status,
                        categoryId: this.category.id,
                        attrId: row.attrId,
                        level: 1,
                        switch: true
                    };
                } else {
                    this.attr = {
                        title: '修改属性',
                        id: row.id,
                        name: row.attrValue,
                        status: row.status == 1,
                        categoryId: this.category.id,
                        attrId: row.attrId,
                        level: 2,
                    };
                }
            },
            handleAdd() {
                this.$set(this.attr, 'title', '新增属性');
                this.attrVisible = true;
            },
            deleteAttr(attr) {
                const param = {
                    ...attr
                };
               if (attr.categoryId && attr.categoryId > 0) {
                    deleteAttr(param).then((res) => {
                        if (res.status == 200 && res.data > 0) {
                            this.$message({
                                message: '删除成功',
                                type: 'success',
                                duration: 2000,
                                onClose: () => {
                                    this.attrVisible = false;
                                    this.getAttributeList();
                                }
                            });
                        }
                    });
               } else {
                   deleteAttrValue(param).then((res) => {
                        if (res.status == 200 && res.data > 0) {
                            this.$message({
                                message: '删除成功',
                                type: 'success',
                                duration: 2000,
                                onClose: () => {
                                    this.attrVisible = false;
                                    this.getAttributeList();
                                }
                            });
                        }
                    });
               }
            },
            saveAttr() {
                const param = {
                    ...this.attr,
                };
                param.status = param.status ? 1 : 2;
                if (this.attr.level == 1) {
                    param.attrName = this.attr.name;
                    saveAttr(param).then((res) => {
                        if (res.status == 200) {
                            this.$message({
                                message: '保存成功',
                                type: 'success',
                                duration: 2000,
                                onClose: () => {
                                    if (this.attr.title == '新增属性' && this.attr.categoryId != this.category.id) {
                                        this.category.id = this.attr.categoryId;
                                        this.attrVisible = false;
                                        this.getAttributeList();
                                        this.$router.push({ path: '/center/attrList',
                                            query: {
                                                categoryId: this.attr.categoryId
                                            }
                                        });
                                    } else {
                                        this.attrVisible = false;
                                        this.getAttributeList();
                                    }
                                }
                            });
                        }
                    });
                } else {
                    param.attrValue = this.attr.name;
                    saveAttrValue(param).then((res) => {
                        if (res.status == 200) {
                            this.$message({
                                message: '保存成功',
                                type: 'success',
                                duration: 2000,
                                onClose: () => {
                                    this.attrVisible = false;
                                    this.getAttributeList();
                                }
                            });
                        }
                    });
                }
            },
            resetDialog(formName) {
                this.attr = {
                    name: null,
                    status: false,
                    categoryId: this.category.id,
                    attrId: null,
                    level: null,
                    switch: false,
                };
                this.$refs[formName].resetFields();
            },
        
            // 类目
            getCategoryById() {
                const param = {
                    id: this.category.id
                };
                getCategoryById(param).then((res) => {
                    if (res.status == 200) {
                        this.$set(this, 'category', res.data);
                    }
                });
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

            getAttributeList() {
                const param = {
                    userType: -1,
                    categoryIds: [this.category.id]
                };
                getAttributeList(param).then((res) => {
                    if (res.status == 200) {
                        this.$set(this, 'tableData', res.data);
                    }
                });
            },
        },
        mounted() {
            this.$set(this.category, 'id', parseInt(this.$route.query.categoryId));
            this.getAttributeList();
            this.getCategoryById();
            this.getCategoryList();
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
