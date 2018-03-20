<template>
    <div class="category">
        <el-button class=" addPromotion el-icon-plus" @click="goToUpdate('update')" type="primary"></el-button>
        <el-collapse>
            <el-collapse-item v-for="(item, index) in tableData" :name="sku.skuId" :key="index">
                <template slot="title">
                    <img :src="item.coverImg" width="50" height="50" style="margin: 10px;"/>
                    <div>
                        {{item.promotionName}}
                    </div>
                    <div>
                         {{item.salesEffStart|formatDate(item.salesEffStart)}}~{{item.salesEffEnd|formatDate(item.salesEffEnd)}}
                    </div>
                    <div>
                        {{item.discription}}
                    </div>
                    <div>
                        {{item.status|formatStatus(item.status)}}
                    </div>
                    <div>
                        <el-button
                            type="primary"
                            size="mini"
                            class="el-icon-edit"
                            @click="goToUpdate('update', item.id)">
                        </el-button>
                        <el-button
                            type="primary"
                            size="mini"
                            @click="goToUpdate('product', item.id)">
                            查看促销商品
                        </el-button>
                    </div>
                </template>
            </el-collapse-item>
        </el-collapse>

    </div>
</template>

<style>
    @import "../../css/category";
</style>
<script>
    import {
        getPromotionList
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
            getPromotionList() {
                const param = {
                    isIndex: false,
                    ...this.page,
                    userType: -1,
                };
                getPromotionList(param).then((res) => {
                    if (res.status == 200) {
                        this.$set(this, 'tableData', res.data);
                    }
                });
            },

            goToUpdate(uri, promotionId) {
                this.$router.push({
                    path: `/center/promotion/${uri}`,
                    query: {
                        promotionId
                    }
                });
            }
        },
        mounted() {
            this.getPromotionList();
        },
        filters: {
            formatStatus: (status) => {
                switch (status) {
                    case 1:
                        return '基本信息完善';
                    case 2:
                        return '商品信息完善';
                    case 3:
                        return '进行中';
                    case 4:
                        return '已结束';
                    default:
                        return '基本信息完善';
                }
            }
        }
        
    };
</script>
