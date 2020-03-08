<template>
    <div class="common-wrap">
        <h2>nextTick演示</h2>
        <h3 id="msg1">{{msg1}}</h3>
        <h3 id="msg2">{{msg2}}</h3>
        <button @click="handleNextTick">点我点我</button>
    </div>
</template>

<script>
    export default {
        name:'nextTickDemo',
        data(){
            return {
                msg1:'内容1',
                msg2:'内容2'
            }
        },
        methods:{
            handleNextTick(){
                this.msg1 = '内容1修改'
                this.$nextTick(()=>{
                    window.alert(document.querySelector('#msg2').textContent)
                    window.alert('视图更新啦1')
                })
                this.$nextTick(()=>{
                    window.alert('视图更新啦2')
                })
                this.msg2 = '内容2修改'
            }
        }
    }
</script>

<style scoped>

</style>