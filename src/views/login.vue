<template>
    <div class="login">
        <el-form :model="user" class="form">
            <el-form-item>
                <div class="flex-row">
                    <div class="flex-row hor-ver-center">
                        <img src="../imgs/login/user_icon.png" height="17" width="15"/>
                    </div>
                    <el-input type="text" v-model="user.phone"></el-input>
                </div>
            </el-form-item>
            <el-form-item>
                <div class="flex-row">
                    <div class="flex-row hor-ver-center">
                        <img src="../imgs/login/password_icon.png" height="17" width="15"/>
                    </div>
                    <el-input type="password" v-model="user.password"></el-input>
                </div>
            </el-form-item>
            <el-form-item>
                <router-link to="/forgetPassword">忘记密码</router-link>
            </el-form-item>
            <el-form-item>
                <el-button class="submit" type="primary" @click="login">登 录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style>
    @import "../css/login";
</style>
<script>
    import md5 from 'md5';
    import { login } from '../api/api';
    
    export default {
        data() {
            return {
                user: {
                    phone: '',
                    password: '',
                },
                // 图片验证码
                verifyCode: null,
            };
        },

        methods: {
            login() {
                this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    const param = {
                        phone: this.user.phone,
                        password: md5(this.user.password).toUpperCase()
                    };
                    login(param).then((res) => {
                    if (res.status == 200) {
                        const userData = res.data;
                        if (userData) {
                            this.$router.push({ path: '/center' });
                        }
                    }
                    });
                }
                });
            },
        },
    };
</script>
