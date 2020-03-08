<template>
    <div class="loading-wrap" v-show="visible">
        <div class="loading-box">
            <div class="loading"></div>
            <div class="text" v-show="!!text">{{text}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'loading',
        data(){
            return {
                visible:false,
                text:''
            }
        }
    }
</script>

<style scoped>
    .loading-wrap{
        position: fixed;
        z-index:10000;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:rgba(255,255,255,.8);
    }
    @keyframes loading {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .loading-box{
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        text-align:center;
        font-size:14px;
        line-height:26px;
        color:#409EFF;
    }
    .loading{
        margin:0 auto 10px;
        width:40px;
        height:40px;
        border:2px solid #409EFF;
        border-top-color:transparent;
        border-radius: 50%;
        animation: loading 1.2s linear infinite;
    }
</style>