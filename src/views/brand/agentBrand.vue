<template>
    <div class="brand">
        <div class="search flex-col hor-center">
            <el-form :model="searchGroup" :inline="true">
                <el-form-item label="类目">
                    <el-select class="type" v-model="searchGroup.categoryId" placeholder="请选择类目">
                        <el-option v-for="item in categoryList" :label="item.categoryName" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道">
                    <el-select class="type" v-model="searchGroup.channelId" placeholder="请选择渠道">
                        <el-option v-for="item in channelList" :label="item.channelName" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌名称">
                    <el-input  v-model="searchGroup.brandName"></el-input>
                </el-form-item>
                <el-form-item label="审核状态">
                    <el-select class="type" v-model="searchGroup.status" placeholder="请选择品牌审核状态">
                        <el-option label="全部" value="YN"></el-option>
                        <el-option label="已代理" value="Y"></el-option>
                        <el-option label="未代理" value="N"></el-option>
                        <el-option label="审核中" value="W"></el-option>
                        <el-option label="已拒绝" value="R"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分销商名称">
                    <el-input  v-model="searchGroup.nickName"></el-input>
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
                    label="分销商"
                    width="120"
                    align="center"
                    prop="nickName">
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
                    label="渠道"
                    width="170"
                    prop="channelName"
                >
                </el-table-column>
                <el-table-column
                    label="状态"
                    width="100"
                >
                    <template scope="scope">
                        <div>{{scope.row.status|formateStatus(scope.row.status)}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="scope.row.status == 'R'"
                    label="拒绝原因"
                    width="220"
                    prop="reasone"
                    class="long-title"
                >
                </el-table-column>
                <el-table-column
                    label="申请材料"
                    width="220"
                    prop="brandCertificate"
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

    </div>
</template>

<style>
    @import "../../css/brand";
</style>
<script>
    import {
        getCategoryList,
        getAgentBrandList,
        getChannelOptionList,
    } from '../../api/api';

    export default {
        data() {
            return {
                searchGroup: {
                    categoryId: null,
                    channelId: null,
                    brandName: null,
                    status: null,
                    nickName: null,
                },
                searchForm: {
                    categoryId: null,
                    channelId: null,
                    brandName: null,
                    status: null,
                    nickName: null,
                },
                categoryList: [],
                channelList: [],
                tableData: [],
                brandAttachment: {},
                page: {
                    pageNum: 1,
                    total: 0,
                    pageSize: 20
                },
            };
        },
        methods: {
            handleSearch() {
                this.searchForm = {
                    ...this.searchGroup
                };
                this.page.pageNum = 1;
                this.getAgentBrandList();
            },

            // 页码变更
            handleCurrentChange(val) {
                this.searchGroup = {
                    ...this.searchForm
                };
                this.page.pageNum = val;
                this.getAgentBrandList();
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
            getChannelOptionList() {
                const param = {
                    userType: -1
                };
                getChannelOptionList(param).then((res) => {
                    if (res.status == 200) {
                        this.$set(this, 'channelList', res.data);
                    }
                });
            },
            getAgentBrandList() {
                const param = {
                    ...this.searchForm
                };
                getAgentBrandList(param).then((res) => {
                    if (res.status == 200) {
                        this.$set(this, 'tableData', res.data);
                    }
                });
            }
        },
        created() {
            this.getAgentBrandList();
            this.getCategoryList();
            this.getChannelOptionList();
        },
        filters: {
            formateStatus: (status) => {
                switch (status) {
                    case 'Y':
                        return '已代理';
                    case 'N':
                        return '未代理';
                    case 'W':
                        return '已代理';
                    default:
                        return '未完善';
                }
            },
            formatePoint: points => ((points !== null) ? points : '用户信息未完善')
        }
    };
</script>
