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
                @select="handleSelect"
                class="tab"
            >
                <template v-for="item in MENU">
                    <el-menu-item v-if="!item.children" :index="item.id + ''" :key="item.id">{{item.name}}</el-menu-item>
                    <template v-else>
                        <el-menu-item-group :index="item.id" :key="item.id">
                            <template slot="title">{{item.name}}</template>
                            <el-menu-item v-for="child in item.children" :index="child.id" :key="child.id">{{child.name}}</el-menu-item>
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
                        id: 1,
                        name: '分销商管理',
                        router: '/distributor',
                    },
                    {
                        id: 2,
                        name: '品牌管理',
                        children: [
                        {
                            id: 2.1,
                            name: '平台品牌管理',
                            router: '/distributor',
                        }, {
                            id: 2.2,
                            name: '分销商品牌代理',
                            router: '/distributor',
                        }]
                    },
                    {
                        id: 3,
                        name: '类目管理',
                        router: '/distributor',
                    },
                    {
                        id: 4,
                        name: '商品管理',
                        router: '/distributor',
                    },
                    {
                        id: 5,
                        name: '订单管理',
                        router: '/distributor',
                    },
                    {
                        id: 6,
                        name: '营销管理',
                        router: '/distributor',
                    },
                    {
                        id: 7,
                        name: '内容设置',
                        router: '/distributor',
                    }
                ],
                model: 0
            };
        },
        methods: {
            handleSelect(key) {
                this.$router.push({ path: `/center${this.MENU[key].router}` });
            }

        },
    };
</script>
