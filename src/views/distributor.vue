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
                        <div>
                            <el-button v-if="scope.row.distributorId!=null && scope.row.distributorId!=0"
                                size="mini"
                                @click="handleSku(scope.row.distributorId)">设置特殊价格
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


        <el-dialog title="分销商价格设置" class="dialog" :visible.sync="priceVisible" @close="resetDialog('priceForm')">
            <el-form :model="sku" ref="priceForm">
                <el-form-item label="已代理渠道">
                    <el-select placeholder="请选择已代理渠道" v-model="sku.channelId" @change="getAgentBrandByChannel">
                        <el-option v-for="item in channelList" :label="item.name" :key="item.channelId" :value="item.channelId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="已代理品牌：">
                    <el-select  placeholder="请选择已代理品牌" v-model="sku.brandId" @change="getProductList">
                        <el-option v-for="item in brandList" :label="item.brandName" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-select  placeholder="请选择商品名称" v-model="sku.spuId" @change="getSpuDetail">
                        <el-option v-for="item in spuList" :label="item.productName" :key="item.productId" :value="item.productId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="属性">
                    <el-select v-model="sku.skuId" placeholder="请选择属性值" @change="getSkuDetail">
                        <el-option v-for="item in skuList" :label="item.skuAttr" :key="item.skuId" :value="item.skuId"></el-option>
                    </el-select>
                </el-form-item>
                
               <div v-if="sku.skuId">
                参考价:
                <div v-for="(item, index) in sku.refer" label="批量" :key="index" class="price flex-row hor-center ver-center">
                    <div>{{item.lowQuantity}}</div>
                    <div>~</div>
                    <div>{{item.highQuantity}}</div>
                    <div>价格:</div>
                    <div>{{item.price}}</div>
                    <div>会员等级:</div>
                    <div>{{item.levelId}}</div>
                </div>
            </div>
                
            </el-form>
            <el-form ref="priceList" style="margin: 10px auto;">
                <div v-if="sku.skuId" v-for="i in priceNum" label="批量" :key="i" class="price flex-row hor-center ver-center">
                    <el-input  v-model="sku.priceList[i-1].lowQuantity"></el-input>
                    <div>~</div>
                    <el-input  v-model="sku.priceList[i-1].highQuantity"></el-input>
                    <div>价格:</div>
                    <el-input  v-model="sku.priceList[i-1].price"></el-input>
                    <div>库存:</div>
                    <el-input  v-model="sku.priceList[i-1].stock"></el-input>
                    <el-button size="mi\\\ni" type="primary" @click="handleRemovePriceList(i-1)">删除</el-button>
                </div>
                <div class="flex-col ver-center addBtn promotion">
                    <el-button @click="handleReAdd">+ 添加批次</el-button>
                </div>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="priceVisible = false">取 消</el-button>
                <el-button type="primary" :disabled="!sku.skuId || sku.priceList.length == 0" @click="saveSpecialPriceList()">确 定</el-button>
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
        updatePoint,
        getChannelList,
        getAgentBrandByChannel,
        getProductList,
        getSpuDetail,
        saveSpecialPriceList
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
                channelList: [],
                brandList: [],
                spuList: [],
                skuList: [],
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
                },

                priceVisible: false,
                sku: {
                    channelId: null,
                    brandId: null,
                    spuId: null,
                    skuId: null,
                    priceList: []
                },
                priceNum: 0
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

            handleSku(distributorId) {
                this.$set(this.sku, 'distributorId', distributorId);
                this.sku.priceList = [{
                    startPiece: 0,
                    endPiece: 0,
                    price: 0,
                    lock: 0
                }];
                this.priceNum = 1;
                this.priceVisible = true;
                this.getChannelList();
            },

            handleRemovePriceList(index) {
                this.sku.priceList.splice(index, 1);
                this.priceNum = this.priceNum - 1;
            },

            handleReAdd() {
                if (!this.sku.skuId) {
                    return;
                }
                this.sku.priceList.push({
                    lowQuantity: 0,
                    highQuantity: 0,
                    price: 0,
                    stock: 0
                });
                this.priceNum = this.priceNum + 1;
            },
            resetDialog(formName) {
                if (formName === 'priceForm') {
                    this.sku = {
                        channelId: null,
                        brandId: null,
                        spuId: null,
                        skuId: null,
                        priceList: []
                    };
                    this.priceNum = 0;
                } else {
                    this.editPoint = {
                        userId: null,
                        type: '+',
                        point: 0,
                        reason: null
                    };
                }
                
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
            saveSpecialPriceList() {
                const param = {
                    ...this.sku
                };
                saveSpecialPriceList(param).then((res) => {
                    if (res.status == 200 && res.data > 0) {
                        this.$message({
                            message: '保存成功',
                            type: 'success',
                            duration: 2000,
                            onClose: () => {
                                this.priceVisible = false;
                                this.getUserList();
                            }
                        });
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
            },

            getChannelList() {
                const param = {
                   distributorId: this.sku.distributorId
                };
                getChannelList(param).then((res) => {
                    if (res.status == 200) {
                        this.$set(this, 'channelList', res.data);
                        this.$set(this.sku, 'brandId', null);
                    }
                });
            },

            getAgentBrandByChannel(channelId) {
                const param = {
                    distributorId: this.sku.distributorId,
                    channelId
                };
                getAgentBrandByChannel(param).then((res) => {
                    if (res.status == 200) {
                        this.$set(this, 'brandList', res.data);
                    }
                });
            },

            // 获取spu
            getProductList(brandId) {
                 const param = {
                    userType: 1,
                    brandIds: [brandId]
                };
                getProductList(param).then((res) => {
                    if (res.status == 200) {
                        this.$set(this, 'spuList', res.data);
                    }
                });
            },

            // 获取sku
            getSpuDetail(spuId) {
                const param = {
                    spuId
                };
                getSpuDetail(param).then((res) => {
                    if (res.status == 200) {
                        const skuList = res.data.skuDetailList;
                        skuList.map(item => {
                            if (item.priceList.length === 0) {
                                return true;
                            }
                            const sku = item.priceList[item.priceList.length - 1];
                            item.skuId = sku.skuId;
                            item.skuAttr = sku.skuAttr;
                        });
                        this.$set(this, 'skuList', skuList);
                    }
                });
            },

            // 获取sku价格
            getSkuDetail(skuId) {
                const sku = this.skuList.find(item => item.skuId == skuId);
                const priceList = sku.priceList;
                if (!priceList || priceList.length === 0) {
                    return;
                }
                const tmpSpecial = [];
                const tmpCommon = [];
                priceList.map(item => {
                    if (item.special) {
                        item.lowQuantity = item.startPiece;
                        item.highQuantity = item.endPiece;
                        item.price = item.price;
                        tmpSpecial.push(item);
                        return true;
                    }
                    if (!item.promotionId && !item.special) {
                        item.lowQuantity = item.startPiece;
                        item.highQuantity = item.endPiece;
                        item.price = item.price;
                        tmpCommon.push(item);
                        return true;
                    }
                    return false;
                });
                this.$set(this.sku, 'priceList', tmpSpecial);
                this.$set(this.sku, 'refer', tmpCommon);
                this.priceNum = tmpSpecial.length;
            },

            
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
