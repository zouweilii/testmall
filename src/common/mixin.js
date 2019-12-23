import {debounce} from "common/utils";
import BackTop from 'components/content/backtop/BackTop'

export const itemListenerMixin={
  data(){
    return {
      itemImgListener:null
    }
  },
  mounted(){
    const refresh = debounce(this.$refs.scroll.refresh, 50)

    //对监听的事件进行一个保存
    this.itemImgListener= () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad',this.itemImgListener)
    // console.log('混入内容');
  }
}

export const backTopMixin = {
  components:{
    BackTop
  },
  data(){
   return {
     isShowBackTop: false
   }
  },
  methods:{
    backClick(){
      // console.log('backClick');
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
    listenerShowBackTop(position){
      this.isShowBackTop = (-position.y) > 1000
    }
  }
}
