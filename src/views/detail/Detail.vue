<template>
  <div id="details">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="param" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
<!--    <toast :message="message" :isShow="show"/>-->
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'


  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'
  // import Toast from 'components/common/toast/Toast'

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail";
  import {debounce} from "common/utils";
  import {itemListenerMixin,backTopMixin} from 'common/mixin'

  import {mapActions} from 'vuex'

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      // Toast
    },
    mixins: [itemListenerMixin,backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        // itemImgListener:null
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex:0,
        // message:'',
        // show:false
      }
    },
    mounted() {


      // console.log('mounted');
      // const refresh = debounce(this.$refs.scroll.refresh, 50)
      //
      // //对监听的事件进行一个保存
      // this.itemImgListener= () => {
      //   refresh()
      // }
      // this.$bus.$on('itemImageLoad',this.itemImgListener)
    },
    destroyed() {
      this.$bus.$off('itemImageLoad', this.itemImgListener)
      // console.log('destroyed');
    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {

        // console.log('---');
        this.$refs.scroll.refresh()

        this.getThemeTopY()
      },
      titleClick(index) {
        // console.log(index);
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentScroll(position) {
        // 1.获取值
        const positionY = -position.y;
        //2.positionY和主题的值进行对比
        // console.log(Number.MAX_VALUE);

        let length = this.themeTopYs.length
        for (let i = 0; i < length-1; i++) {
          // if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
          //   this.currentIndex = i
          //   // console.log(this.currentIndex);
          //   this.$refs.nav.currentIndex=this.currentIndex
          if(this.currentIndex !== i &&(positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }
          }

        //3.是否显示回到顶部
        this.listenerShowBackTop(position)
          },
      addToCart(){
        //1.获取购物车需要展示的信息
        const product={}
        product.image=this.topImages[0];
        product.title=this.goods.title;
        product.desc=this.goods.desc;
        product.price=this.goods.realPrice;
        product.iid=this.iid;

        //2.将商品添加到购物车里
        // this.$store.commit('addCart',product) //mutations
        //actions
        // this.$store.dispatch('addCart',product).then(res => {
        //   console.log(res);
        // })

        this.addCart(product).then(res => {
        //   this.isShow=true;
        //   this.message = res ;
        //
        //   setTimeout(() => {
        //     this.isShow=false;
        //     this.message = '' ;
        //   },1500)
        //   console.log(res);

          this.$toast.show(res,2000)
          console.log(this.$toast);
        })

        //3.成功添加到购物车

      }

          //hack判断
        //   if(this.currentIndex !== i &&(positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
        //     this.currentIndex = i
        //     this.$refs.nav.currentIndex = this.currentIndex
        //   }
        // }
        //3.判断backTop是否显示
        // this.isShowBackTop=(-position.y)>1000
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 1.获取顶部的图片轮播数据
        // console.log(res);
        const data = res.result;
        this.topImages = data.itemInfo.topImages

        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo;

        // 5.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        //6.取出评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }

        // //第一次值不对
        // //原因:this.$refs.param.$el压根就没有渲染
        // this.themeTopYs=[]
        // this.themeTopYs.push(0);
        // this.themeTopYs.push(this.$refs.param.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        // console.log(this.themeTopYs);
        //
        // //第二次值不对
        // //原因:图片没有计算在内
        // this.$nextTick(() => {
        //   //根据最新的数据,对应的DOM已经被渲染出来
        //   //但图片依旧没有加载完(目前获取的offsettop不包含其中的图片)
        //   //一般offsettop不对,都是因为图片
        //   this.themeTopYs=[]
        //   this.themeTopYs.push(0);
        //   this.themeTopYs.push(this.$refs.param.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        //
        //   console.log(this.themeTopYs);
        // })

      })

      // 3.请求推荐数据
      getRecommend().then(res => {
        // console.log(res);
        this.recommends = res.data.list
      })

      //给getThemeTopY赋值(对给this.themeTopYs赋值的操作进行防抖)
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.param.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        this.themeTopYs.push(Number.MAX_VALUE);

        // console.log(this.themeTopYs);
      }, 100)

    }
  }
</script>

<style scoped>
  #details {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .content {
    height: calc(100% - 44px - 49px);
    background-color: #fff;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  /*.content {*/
  /*  overflow: hidden;*/

  /*  position: absolute;*/
  /*  top: 44px;*/
  /*  bottom: 49px;*/
  /*  left: 0;*/
  /*  right: 0;*/
  /*}*/
</style>
