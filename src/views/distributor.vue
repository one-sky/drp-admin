<template>
    <div class="distributor">
        <div class="search flex-col hor-center">
            <el-form :model="searchGroup" :inline="true">
                <el-form-item label="用户昵称">
                    <el-input  v-model="searchGroup.nickName"></el-input>
                </el-form-item>
                <el-form-item label="会员等级">
                    <el-input  v-model="searchGroup.vipId"></el-input>
                </el-form-item>
                <el-form-item>
                <el-button @click="handleSearch" type="primary">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableBox">
            <el-table
                :data="tableData"
                style="width: 96%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <div class="flex-row">
                            <div class="left-items flex-col">
                                <div class="item">
                                    <div class="title">头像：</div>
                                    <img :src="props.row.headUrl" width="50" height="50"/>
                                </div>
                                <div class="item">
                                    <div class="title">性别：</div>
                                    <div>{{ props.row.sexual|formateSexual(props.row.sexual) }}</div>
                                </div>
                                <div class="item">
                                    <div class="title">qq：</div>
                                    <div>{{ props.row.qq }}</div>
                                </div>
                                <div class="item">
                                    <div class="title">旺旺号：</div>
                                    <div>{{ props.row.wwId }}</div>
                                </div>
                            </div>
                            <div class="right-items flex-col">
                                <div class="item">
                                    <div class="title">公司名称：</div>
                                    <div>{{ props.row.name }}</div>
                                </div>
                                <div class="item">
                                    <div class="title">联系人：</div>
                                    <div>{{ props.row.contractor }}</div>
                                </div>
                                <div class="item">
                                    <div class="title">联系地址：</div>
                                    <div>{{ props.row.provinceDesc }}{{ props.row.cityDesc }}{{ props.row.areaDesc }}
                                        &nbsp;{{ props.row.contractAddress }}</div>
                                </div>
                                <div class="item">
                                    <div class="title">电子邮箱：</div>
                                    <div>{{ props.row.email }}</div>
                                </div>
                            </div>
                            
                            
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="昵称"
                    width="100"
                    prop="nickName">
                </el-table-column>
                <el-table-column
                    label="联系电话"
                    width="130"
                    prop="phone"
                >
                </el-table-column>
                <el-table-column
                    label="会员等级"
                    width="110"
                    prop="vipName"
                >
                </el-table-column>
                <el-table-column
                    label="积分"
                    width="110"
                >
                    <template scope="scope">
                        <div>{{scope.row.points|formatePoint(scope.row.points)}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="累计金额"
                    width="110"
                >
                    <template scope="scope">
                        {{scope.row.totalAmount|formatMoney(scope.row.totalAmount)}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="注册时间"
                    width="180"
                >
                    <template scope="scope">
                        {{scope.row.createTime|formatDate(scope.row.createTime)}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="上一次登陆时间"
                    width="180"
                >
                    <template scope="scope">
                        {{scope.row.lastUpdateTime|formatDate(scope.row.lastUpdateTime)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div>
                            <el-button v-if="scope.row.distributorId!=null && scope.row.distributorId!=0"
                                size="mini"
                                @click="handleEdit(scope.row.userId)">修改积分
                            </el-button>
                        </div>
                        
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="pagination">
            <el-pagination layout="prev, pager, next" :page-size="page.pageSize" :total="page.total"
                            :current-page="page.pageNum" @current-change="handleCurrentChange">
            </el-pagination>
        </div>

        <el-dialog title="修改积分" class="dialog" :visible.sync="dialogVisible" @close="resetDialog('dialogForm')">
            <el-form :model="editPoint" ref="dialogForm">
                <el-form-item label="积分：">
                    <el-select class="type" v-model="editPoint.type" placeholder="请选择加减积分">
                        <el-option label="+" value="+"></el-option>
                        <el-option label="-" value="-"></el-option>
                    </el-select>
                    <el-input-number v-model="editPoint.point" :min="1" :max="10000" ></el-input-number>
                </el-form-item>
                
                <el-form-item label="原因：">
                    <el-input
                        class="reason"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入原因"
                        v-model="editPoint.reason">
                    </el-input>
                </el-form-item>
                

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updatePoint()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style>
    @import "../css/distributor";
</style>
<script>
    import {
        getUserList,
        updatePoint 
    } from '../api/api';
    import * as formatDate from '../js/date';

    export default {
        data() {
            return {
                searchGroup: {
                    nickName: '',
                    vipId: ''
                },
                searchForm: {
                    nickName: '',
                    vipId: ''
                },
                tableData: [],
                page: {
                    pageNum: 1,
                    total: 0,
                    pageSize: 20
                },
                dialogVisible: false,
                editPoint: {
                    userId: null,
                    type: '+',
                    point: 0,
                    reason: null
                }
            };
        },
        methods: {
            handleSearch() {
                this.searchForm = {
                    ...this.searchGroup
                };
                this.page.pageNum = 1;
                this.getUserList();
            },

            // 页码变更
            handleCurrentChange(val) {
                this.searchGroup = {
                    ...this.searchForm
                };
                this.page.pageNum = val;
                this.getUserList();
            },
            handleEdit(userId) {
                this.$set(this.editPoint, 'userId', userId);
                this.dialogVisible = true;
            },
             resetDialog(formName) {
                this.editPoint = {
                    userId: null,
                    type: '+',
                    point: 0,
                    reason: null
                };
                this.$refs[formName].resetFields();
            },
            updatePoint() {
                if (!this.editPoint.reason) {
                    return;
                }
                if (this.editPoint.type === '-') {
                    this.editPoint.point = -1 * this.editPoint.point;
                }
                const param = {
                    ...this.editPoint
                };
                updatePoint(param).then((res) => {
                    if (res.status == 200 && res.data > 0) {
                        this.getUserList();
                        this.dialogVisible = false;
                    }
                });
            },
            getUserList() {
                const param = {
                    ...this.searchForm,
                    ...this.page,
                };
                getUserList(param).then((res) => {
                    if (res.status == 200) {
                        this.$set(this, 'tableData', res.data);
                        this.page.total = res.page.total;
                    }
                });
            }
        },
        created() {
            this.getUserList();
        },
        filters: {
            formateSexual: (sexual) => {
                switch (sexual) {
                    case 1:
                        return '男';
                    case 2:
                        return '女';
                    default:
                        return '未知';
                }
            },
            formatePoint: points => ((points !== null) ? points : '用户信息未完善')
        }
    };
</script>
