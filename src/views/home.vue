<template>
    <div class="common-wrap">
        <h1>Index</h1>
        <div class="common-wrap">
            <button @click="$router.push('/loadingDemo')">Vue.extend使用——实现一个loading组件</button>
        </div>
        <div class="common-wrap">
            <button @click="$router.push('/nextTickDemo')">nextTick实例</button>
        </div>
        <div class="common-wrap">
            <button @click="$router.push('/observableDemo')">Vue.observable使一个普通对象可响应</button>
        </div>
    </div>
</template>

<script>
    export default {
        name:'home'
    }
</script>