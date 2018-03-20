<template>
    <div class="category">
        <el-button class="promotionBtn" type="primary" @click="$router.push({path: '/center/promotion/index'})">返 回</el-button>
        <el-form :model="promotion" ref="form" inline>
            <div class="promotionEdit flex-row ">
                <el-form-item label="封面图">
                   <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="promotion.coverImg" :src="promotion.coverImg" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="促销标题">
                    <el-input  v-model="promotion.promotionName"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" class="textarea" v-model="promotion.discription"></el-input>
                </el-form-item>
            </div>
           <div class="promotionEdit flex-row">
                <el-form-item label="促销日期">
                    <el-date-picker
                        type="datetime"
                        v-model="promotion.salesEffStart"
                        format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="促销截止日期">
                    <el-date-picker
                        type="datetime"
                        v-model="promotion.salesEffEnd"
                        format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="是否开启" v-if="promotion.status > 2">
                    <el-input v-model="promotion.use"></el-input>
                </el-form-item>
           </div>
            

            <el-form-item class="promotionEdit" label="内容">
                <div id="editorElem" ref="editor" style="text-align:left"></div>
            </el-form-item>
        </el-form>
        <el-button  class="promotionBtn" type="primary" @click="savePromotion">确 定</el-button>

    </div>
</template>

<style>
    @import "../../css/category";
</style>
<script>
    import E from 'wangeditor';
    import {
        getPromotionById,
        savePromotion
    } from '../../api/api';
    import * as formatDate from '../../js/date';

    export default {
        data() {
            return {
                promotionId: null,
                promotion: {
                    coverImg: null,
                    promotionName: null,
                    discription: null,
                    salesEffStart: null,
                    salesEffEnd: null,
                    status: 1,
                    use: false,
                    content: null
                },
                editor: null
            };
        },
        methods: {
            handleAvatarSuccess(res, file) {
                this.brand.logo = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            changeStatus(val) {
                const category = this.tableData.find(item => item.id == val);
                if (category != null && category.status == 2) {
                    this.$set(this.category, 'status', 2);
                    this.$set(this.category, 'switch', true);
                } else {
                    this.$set(this.category, 'switch', true);
                }
            },
            getPromotionById() {
                const param = {
                    id: this.promotionId
                };
                getPromotionById(param).then((res) => {
                    if (res.status == 200) {
                        const promotion = res.data;
                        promotion.use = promotion.status == 3;
                       
                        this.editor.txt.html(promotion.content);
                        this.$set(this, 'promotion', promotion);
                    }
                });
            },
            savePromotion() {
                const param = {
                    ...this.promotion,
                    content: this.editor.txt.html()
                };
                param.salesEffStart = Date.parse(new Date(param.salesEffStart));
                param.salesEffEnd = Date.parse(new Date(param.salesEffEnd));
                param.status = param.status > 2 ? (param.use ? 3 : 4) : param.status;
                savePromotion(param).then((res) => {
                    if (res.status == 200 && res.data > 0) {
                        this.$message({
                            message: '保存成功',
                            type: 'success',
                            duration: 2000,
                            onClose: () => {
                                this.getPromotionById();
                            }
                        });
                    }
                });
            },
        },
        mounted() {
            this.promotionId = parseInt(this.$route.query.promotionId);
            if (this.promotionId) {
                this.getPromotionById();
            } else {
                this.$set(this.promotion, status, 2);
            }
            this.editor = new E('#editorElem');
            this.editor.create();
        }
    };
</script>
