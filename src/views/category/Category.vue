<template>
<!--  <h2>分类</h2>-->
  <div class="wrapper">
<!--    &lt;!&ndash;1.无论是否设置click:false, button都可以点击&ndash;&gt;-->
<!--    <button @click="btnClick">按钮</button>-->

<!--    &lt;!&ndash;2.必须设置click:true, 那么div才能监听点击&ndash;&gt;-->
<!--    <div @click="divClick">呵呵呵呵</div>-->

    <h2>分类</h2>
  </div>

</template>

<script>
  // import BScroll from 'better-scroll'

  export default {
    name: "Category",
    // data() {
    //   return {
    //     scroll: null
    //   }
    // },
    // 组件创建完后调用created
    // mounted(){
    //   this.scroll = new BScroll(document.querySelector('.wrapper'),{
    //     probeType: 3,
    //     pullUpLoad: true
    //
    //   })
    //
    //   this.scroll.on('scroll', (position) => {
    //     console.log(position);
    //   })
    //
    //   this.scroll.on('pullingUp', () => {
    //     console.log('上啦加载更多');
    //   })
    // },
    // methods: {
    //   btnClick() {
    //     console.log('btnClick');
    //   },
    //   divClick() {
    //     console.log('divClick');
    //   }
    // }
  }
</script>

<style scoped>

  /*.wrapper {*/
  /*  height: 150px;*/
  /*  background-color: red;*/

  /*  overflow: hidden;*/
  /*!*内部自动隐藏超出部分*!*/
  /*!*  overflow-y: scroll;*!*/
  /*}*/
</style>
