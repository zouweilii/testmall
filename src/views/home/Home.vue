<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <!-- v-show 当滚动超过原有的tabcontrol的高度时,显示,否则就隐藏-->
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <home-recommend-view :recommends="recommends"></home-recommend-view>
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                    ref="tabControl2"/>
      <good-list :goods="showGoods"/>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>
<script>
import HomeSwiper from './childComps/HomeSwiper'
import HomeRecommendView from './childComps/HomeRecommendView'
import FeatureView from './childComps/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'

import {getHomeMultidata, getHomeGoods} from 'network/home'
import {debounce} from 'common/utils'
import {itemListenerMixin,backTopMixin} from 'common/mixin'

  export default {
    name: "Home",
    components: {
      HomeSwiper,
      HomeRecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodList,
      Scroll,
    },
    mixins:[itemListenerMixin,backTopMixin],
    data(){
      return{
        banners:[],
        recommends:[],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        tabOffsetTop:0,
        isTabFixed:false,
        saveY:0,
        // itemImgListener:null
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    destroyed(){
      // console.log('home destroyed');
    },
    activated() {
      console.log('activated');
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      console.log('deactivated');

      //1.保存Y值
      this.saveY = this.$refs.scroll.getScrollY()

      //2.取消全局事件监听
      // this.$bus.$off('itemImgLoad',函数)
    },
    created(){
      //1.请求多个数据
      this.getHomeMultidata();

      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    mounted(){
      // //3.监听item中图片加载完成
      // this.$bus.$on('itemImageLoad',() => {
      //   console.log('---');
      //   this.$refs.scroll.refresh()
      // })

      // 1.图片加载完成的事件监听
      // const refresh = debounce(this.$refs.scroll.refresh, 50)
      //
      // //对监听的事件进行一个保存
      // this.itemImgListener= () => {
      //   refresh()
      // }
      // this.$bus.$on('itemImageLoad',this.itemImgListener)


    },
    methods:{
      /**
       * 事件监听相关的方法
       */
      // debounce(func,delay){
      //   let timer=null;
      //   return function(...args){
      //     if(timer) clearTimeout(timer)
      //     timer =setTimeout(() => {
      //       func.apply(this,args)
      //     },delay)
      //   }
      // },
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        //两个tabcontrol都与最新点击的index保持一致
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      contentScroll(position) {
        // 1.判断BackTop是否显示
        // this.isShowBackTop = (-position.y) > 1000
        this.listenerShowBackTop(position)

        // 2.决定tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.currentType)
        // console.log('加载更多的方法');
      },
      swiperImageLoad(){
        //获取tabControl的offsetTop
        //所有的组件都有一个属性$el:用于获取组件中的元素

        //保存tabcontrol的高度
        this.tabOffsetTop=this.$refs.tabControl2.$el.offsetTop;
      },
      /**
       * 网络请求相关的方法
       */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // this.result = res;
          //保存数据, 防止函数调用完就被回收
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          // console.log(res)
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          // 完成上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home{
    /*margin-top: 44px;*/
    /*margin-bottom: 44px;*/
    height: 100vh;
  }
.home-nav{
  background-color: var(--color-tint);
  color: white;

  /*在使用浏览器原生滚动时, 为了让导航不跟随一起滚动*/
  /*position: fixed;*/
  /*left: 0;*/
  /*right: 0;*/
  /*top:0;*/
  /*z-index: 9;*/
}
  /*.tab-control{*/
  /*  !*position: sticky;*!*/
  /*  top:44px;*/
  /*  z-index: 9;*/
  /*}*/

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control{
    position:relative;
    z-index: 9;
  }

  /*.content {*/
  /*height: calc(100% - 93px);*/
  /*overflow: hidden;*/
  /*margin-top: 44px;*/
  /*}*/

  /*.fixed{*/
  /*  position: fixed;*/
  /*  left: 0;*/
  /*  right: 0;*/
  /*  top: 44px;*/
  /*}*/
</style>
