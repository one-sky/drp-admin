<template>
    <div class="center">
        <div class="top">
            <div class="name">
                admin
            </div>
            <el-button class="logout" type="primary">退出</el-button>
        </div>
        <div class="flex-row">
            <el-menu
                :default-active="model + ''"
                mode="horizontal"
                active-text-color="#ffd04b"
                class="tab"
                router
            >
                <template v-for="(item, index) in MENU">
                    <el-menu-item v-if="!item.children" :index="item.router + ''" :key="index">{{item.name}}</el-menu-item>
                    <template v-else>
                        <el-menu-item-group :index="item.router + ''" :key="index">
                            <template slot="title">{{item.name}}</template>
                            <el-menu-item v-for="(child, key) in item.children" :index="child.router + ''" :key="key">{{child.name}}</el-menu-item>
                        </el-menu-item-group>
                    </template>
                    
                </template>
            </el-menu>
            <router-view style="flex:1;"/>
        </div>
        
    </div>
</template>

<style>
    @import "../css/center";
</style>
<script>
    export default {
        data() {
            return {
                MENU: [
                    {
                        name: '分销商管理',
                        router: '/center/distributor',
                    },
                    {
                        name: '品牌管理',
                        children: [
                        {
                            name: '平台品牌管理',
                            router: '/center/brandDetail',
                        }, {
                            name: '分销商品牌代理',
                            router: '/center/agentBrand',
                        }]
                    },
                    {
                        name: '类目管理',
                        router: '/distributor',
                    },
                    {
                        name: '商品管理',
                        router: '/distributor',
                    },
                    {
                        name: '订单管理',
                        router: '/distributor',
                    },
                    {
                        name: '营销管理',
                        router: '/distributor',
                    },
                    {
                        name: '内容设置',
                        router: '/distributor',
                    }
                ],
                model: 0
            };
        },
        methods: {

        },
    };
</script>
