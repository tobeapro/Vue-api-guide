<template>
    <div class="common-wrap">
        <h2>loading</h2>
        <button @click="handleLoading">点我点我</button>
    </div>
</template>

<script>
    export default {
        name:'loadingDemo',
        methods:{
            handleLoading(){
                this.$loading.show('三秒后自动关闭')
                window.setTimeout(()=>{
                    this.$loading.hide()
                },3000)
            }
        }
    }
</script>

<style scoped>

</style>