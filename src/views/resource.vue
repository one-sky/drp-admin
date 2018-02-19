<template>
</template><template>
    <div>
        <el-menu
            :default-active="model"
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            @select="handleSelect"
        >
            <el-menu-item v-for="item in MENU" :index="item.id" :key="item.id">{{item.name}}</el-menu-item>
        </el-menu>
        <router-view/>
    </div>
</template>

<style>
</style>
<script>
    const MENU = [
        {
            id: 1,
            name: '分销商管理',
            router: '/distributor',
        },
        {
            id: 2,
            name: '品牌管理',
            router: '/distributor',
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
    ];
    export default {
        methods: {
            handleSelect(key, keyPath) {
                this.$router.push({ path: `/center${MENU[key-1].router}` });
            }

        },
    };
</script>
