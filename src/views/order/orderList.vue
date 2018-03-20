<template>
    <div class="category">
        <div class="search flex-col hor-center">
            <el-form :model="searchGroup" :inline="true" label-width="90px">
                <div class="searchItem">
                    <el-form-item label="订单编号">
                        <el-input  v-model="searchGroup.orderCode" placeholder="请输入订单编号"></el-input>
                    </el-form-item>
                    <el-form-item label="下单时间：">
                        <el-date-picker type="datetime" v-model="searchGroup.startDate"></el-date-picker>
                        <span>到</span>
                        <el-date-picker type="datetime" v-model="searchGroup.endDate"></el-date-picker>
                    </el-form-item>
                </div>
                <div class="searchItem">
                    <el-form-item label="订单状态">
                        <el-select class="type" v-model="searchGroup.orderStatus" placeholder="请选择订单状态">
                            <el-option v-for="item in status" :label="item.value" :key="item.key" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="收件人姓名">
                        <el-input  v-model="searchGroup.receiveName" placeholder="请输入收件人姓名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="handleSearch" type="primary">查询</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <el-collapse accordion class="order">
            <el-collapse-item v-for="item in tableData" title="一致性 Consistency" :key="item.id" :name="item.id">
                <template slot="title">
                    <div>
                        <div class="flex-row">
                            <div>
                                {{item.orderCode}}
                            </div>
                            <div>
                                类型：{{item.type|formatType(item.type)}}
                            </div>
                            <div>
                                总金额：{{item.totalAmount|formatMoney(item.totalAmount)}}
                            </div>
                            <div>
                                订单状态：{{item.status|formatStatus(item.status)}}
                            </div>
                            <div>
                                收件人信息：
                                {{item.receiveName}} {{item.receivePhone}}<br/>
                                {{item.province}}{{item.city}}{{item.area}} {{item.detailAddress}}
                            </div>
                            <div>
                                备注：
                                {{item.buyerMessage}}
                            </div>
                            
                        </div>
                        <div class="flex-row">
                            <div>
                                下单时间
                                {{item.orderTime|formatDate(item.orderTime)}}
                            </div>
                            <div v-if="item.status > 10">
                                支付时间
                                {{item.paymentTime|formatDate(item.paymentTime)}}
                            </div>
                            <div v-if="item.status > 20">
                                发货时间
                                {{item.deliveryTime|formatDate(item.deliveryTime)}}
                            </div>
                            <div v-if="item.status > 30">
                                完成时间
                                {{item.finishTime|formatDate(item.finishTime)}}
                            </div>
                            <div v-if="item.status > 20">
                                {{item.deliveryName}} {{item.deliveryCode}}
                            </div>
                            <div>
                                <el-button class="el-icon-check" v-if="item.status == 20" @click="handleStatus(item.id)"></el-button>
                            </div>
                        </div>
                    </div>
                   
                </template>
                <div class="flex-row hor-center">
                    <el-table
                        :data="item.orderItemVOList"
                        style="width: 78%">
                        <el-table-column
                            label="商品名称"
                            width="270"
                            align="center"
                            prop="spuName">
                        </el-table-column>
                        <el-table-column
                            label="属性"
                            width="150"
                            align="center"
                            prop="skuAttr">
                        </el-table-column>
                        <el-table-column
                            label="原始价格"
                            width="120"
                            align="center">
                            <template scope="scope">
                                <div>{{scope.row.originalPrice|formatMoney(scope.row.originalPrice)}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="现价"
                            width="120"
                            align="center">
                            <template scope="scope">
                                <div>{{scope.row.skuPrice|formatMoney(scope.row.skuPrice)}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="数量"
                            width="120"
                            align="center"
                            prop="skuQuantity">
                        </el-table-column>
                    </el-table>
                </div>
                
            </el-collapse-item>
        </el-collapse>
        
        <div class="pagination">
            <el-pagination layout="prev, pager, next" :page-size="page.pageSize" :total="page.total"
                            :current-page="page.pageNum" @current-change="handleCurrentChange">
            </el-pagination>
        </div>

        <el-dialog title="物流" class="dialog" :visible.sync="statusVisible" @close="resetDialog('form')">
            <el-form :model="order" ref="form">
                <el-form-item label-width="80px" label="快递公司">
                    <el-input  v-model="order.deliveryName"></el-input>
                </el-form-item>
                <el-form-item label-width="80px" label="快递单号">
                    <el-input  v-model="order.deliveryCode"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="statusVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveDelivery()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<style>
    @import "../../css/category";
</style>
<script>
    import {
        getOrderList,
        updateOrder
    } from '../../api/api';
    import * as formatDate from '../../js/date';

    export default {
        data() {
            return {
                tableData: [],
                // 订单状态
                status: [
                    {
                        key: '100',
                        value: '全部订单'
                    },
                    {
                        key: '10',
                        value: '待付款'
                    },
                    {
                        key: '20',
                        value: '待发货'
                    },
                    {
                        key: '30',
                        value: '待收货'
                    },
                    {
                        key: '40',
                        value: '已完成'
                    },
                    {
                        key: '0',
                        value: '已取消'
                    },
                ],
                searchGroup: {
                    orderCode: null,
                    startDate: null,
                    endDate: null,
                    orderStatus: null,
                    receiveName: null
                },
                searchForm: {
                    orderCode: null,
                    startDate: null,
                    endDate: null,
                    orderStatus: null,
                    receiveName: null
                },
                page: {
                    pageNum: 1,
                    total: 0,
                    pageSize: 20
                },
                order: {
                    id: null,
                    deliveryName: null,
                    deliveryCode: null
                },
                statusVisible: false
            };
        },
        methods: {
            handleSearch() {
                this.searchForm = {
                    ...this.searchGroup
                };
                this.page.pageNum = 1;
                this.getOrderList();
            },
            // 页码变更
            handleCurrentChange(val) {
                this.searchGroup = {
                    ...this.searchForm
                };
                this.page.pageNum = val;
                this.getOrderList();
            },

            handleStatus(orderId) {
                this.statusVisible = true;
                this.$set(this.order, 'id', orderId);
            },

            resetDialog(formName) {
                this.order = {
                    id: null,
                    deliveryName: null,
                    deliveryCode: null
                };
                this.$refs[formName].resetFields();
            },

            saveDelivery() {
                const param = {
                    ...this.order
                };
                updateOrder(param).then((res) => {
                    if (res.status == 200 && res.data > 0) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 2000,
                            onClose: () => {
                                this.statusVisible = false;
                                this.getOrderList();
                            }
                        });
                    }
                });
            },
            

            getOrderList() {
                const param = {
                    ...this.searchForm,
                    ...this.page
                };
                param.orderStatus = (!param.orderStatus || param.orderStatus == 100) ? null : param.orderStatus;
                getOrderList(param).then((res) => {
                    if (res.status == 200) {
                        this.$set(this, 'tableData', res.data);
                    }
                });
            },

        },
        created() {
            this.getOrderList();
        },
        filters: {
            formatType: (type) => {
                switch (type) {
                    case 1:
                        return '批发';
                    default:
                        return '一件代发';
                }
            },
            formatStatus: (status) => {
                switch (status) {
                    case 10:
                        return '待付款';
                    case 20:
                        return '待发货';
                    case 30:
                        return '待收货';
                    case 40:
                        return '已完成';
                    default:
                        return '已取消';
                }
            }
        }
    };
</script>
