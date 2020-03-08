<script>
    import Vue from 'vue'
    let normalData = {
        key: '这是一个普通的属性值'
    }
    export default {
        name:'observableDemo',
        render(h){
            return h(
                'h3', 
                {
                    class:"common-wrap"
                },
                 `变成可响应的对象，一秒后属性会被修改：${normalData.key}`
            )
        },
        created(){
            Vue.observable(normalData)
            window.setTimeout(()=>{
                normalData.key = '这是一个响应后的属性值'
            },1000)
        }
    }
</script>