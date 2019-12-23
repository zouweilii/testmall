<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive"><slot  name="item-icon"></slot></div>
    <div v-else ><slot name="item-icon-active"></slot></div>
    <div :style="activeStyle"><slot  name="item-text"></slot></div>

<!--    <img src="../../assets/img/tabbar/home.svg" alt="">-->
<!--    <div>首页</div>-->
  </div>
</template>

<script>
  export default {
    name: "TabBarItem",
    //传值  父传子
    props:{
      path:String,
      activeColor:{
        type:String,
        default:'hotpink'
      }
    },
    data(){
      return {
        // isActive:true
      }
    },
    computed:{
      isActive(){
        //等于 -1  没找到 , !=-1  找到了 即为true  当前的isActive为true 高亮显示
        return this.$route.path.indexOf(this.path) !=-1;
      },
      activeStyle(){
        return this.isActive ? {color:this.activeColor}:{}
      }
    },
    methods:{
      itemClick(){
        //使得点击item就显示对应的item里的内容
        this.$router.replace(this.path)
      }
    }
  }
</script>

<style scoped>
  .tab-bar-item{
    flex:1;
    text-align: center;
    height: 49px;
    /*line-height: 49px;*/
    font-size: 14px;
  }
  .tab-bar-item img{
    height: 24px;
    width: 24px;
    margin-top: 3px;
    vertical-align: middle;
    margin-bottom: 2px;
  }
  /*.active{*/
  /*  color: hotpink;*/
  /*}*/
</style>
