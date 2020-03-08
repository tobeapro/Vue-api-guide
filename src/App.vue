<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
html,body,div,p{
  margin:0;
  padding:0;
}
.common-wrap{
  padding:20px;
  text-align: center;
}
button {
    display: inline-block;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    padding: 8px 16px;
    font-size: 14px;
    text-align: center;
    color: #fff;
    background-color: #409EFF;
    border:none;
    border-radius: 4px;
    cursor: pointer;
}
button:hover{
  background: #66b1ff;
  border-color: #66b1ff;
}
</style>
