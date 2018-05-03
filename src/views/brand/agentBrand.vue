<template>
    <div class="brand">
        <div class="search flex-col hor-center">
            <el-form :model="searchGroup" :inline="true" label-width="90px">
                <div class="searchItem">
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
                        <el-input  v-model="searchGroup.brandName" placeholder="请输入品牌名称"></el-input>
                    </el-form-item>
                </div>
                <div class="searchItem">
                    <el-form-item label="审核状态">
                        <el-select class="type" v-model="searchGroup.status" placeholder="请选择品牌审核状态">
                            <el-option label="全部" value="YN"></el-option>
                            <el-option label="已代理" value="Y"></el-option>
                            <el-option label="审核中" value="W"></el-option>
                            <el-option label="已拒绝" value="R"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分销商名称">
                        <el-input  v-model="searchGroup.nickName" placeholder="请请输入分销商名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="handleSearch" type="primary">查询</el-button>
                    </el-form-item>
                </div>
                
                
            </el-form>
        </div>
        <div class="tableBox">
            <el-table
                :data="tableData"
                style="width: 96%">
                <el-table-column
                    label="分销商"
                    width="110"
                    align="center"
                    prop="nickName">
                </el-table-column>
                <el-table-column
                    label="所属类目"
                    width="110"
                    prop="categoryName"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="品牌名称"
                    width="110"
                    prop="brandName"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="渠道"
                    width="90"
                    prop="channelName"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="状态"
                    width="80"
                    align="center">
                    <template scope="scope">
                        <div>{{scope.row.status|formateStatus(scope.row.status)}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="拒绝原因"
                    width="160"
                    class="long-title"
                    align="center">
                    <template scope="scope">
                        <div>{{scope.row|formateReason(scope.row)}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="申请材料"
                    width="120"
                    prop="brandCertificate"
                    class="long-title"
                    align="center">
                </el-table-column>
                
                <el-table-column
                    label="创建时间"
                    width="178"
                    align="center">
                    <template scope="scope">
                        {{scope.row.createTime|formatDate(scope.row.createTime)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button
                                v-if="scope.row.status == 'W'"
                                type="primary"
                                size="mini"
                                class="el-icon-check"
                                @click="handleAgentStatus(scope.row, 'Y')">
                            </el-button>
                            <el-button
                                v-if="scope.row.status == 'W' || scope.row.status == 'Y'"
                                type="primary"
                                size="mini"
                                class="el-icon-close"
                                @click="handleAgentStatus(scope.row, 'N')">
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

        <el-dialog class="dialog" :visible.sync="brandVisible">
            <el-form :model="brand" :inline="true">
                <el-form-item label="拒绝理由">
                    <el-input type="textarea" v-model="brand.reason"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="brandVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateAgentStatus('N')">确 定</el-button>
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
        getAgentBrandList,
        getChannelOptionList,
        updateAgentStatus
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
                brand: {},
                brandVisible: false,
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

            reConfirm() {
                this.$confirm('是否确认通过审核?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.updateAgentStatus('Y');
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消审批',
                        onClose: () => {
                            this.brand = {};
                        }
                    });      
                });
            },
            // 审核
            handleAgentStatus(row, status) {
                this.$set(this, 'brand', row);

                if (status === 'Y') {
                   this.reConfirm();
                } else {
                    this.brandVisible = true;
                }
            },
            updateAgentStatus(status) {
                const param = {
                    ...this.brand
                };
                param.status = status;
                updateAgentStatus(param).then((res) => {
                    if (res.status == 200 && res.data > 0) {
                        this.$message({
                            message: '提交成功',
                            type: 'warning',
                            duration: 2000,
                            onClose: () => {
                                if (this.brand.status === 'R') {
                                    this.brandVisible = false;
                                }
                                this.brand = {};
                                this.getAgentBrandList();
                            }
                        });
                    } else {
                        this.$message({
                            message: '提交失败',
                            type: 'warning',
                            duration: 2000,
                            onClose: () => {
                                if (this.brand.status === 'R') {
                                    this.brandVisible = false;
                                }
                                this.brand = {};
                                this.getAgentBrandList();
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
                    ...this.searchForm,
                    ...this.page
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
                    case 'R':
                        return '已拒绝';
                    case 'W':
                        return '审核中';
                    default:
                        return '已代理';
                }
            },
            formatePoint: points => ((points !== null) ? points : '用户信息未完善'),
            formateReason: (row) => {
                switch (row.status) {
                    case 'R':
                        return row.reason;
                    default:
                        return ' 无';
                }
            },
        }
    };
</script>
