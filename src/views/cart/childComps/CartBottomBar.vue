<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        @click.native="checkClick"
        :isChecked="isSelectAll"
        class="check-button"/>
      <span>全选</span>
    </div>
    <div class="price">
      合计:{{totalPrice}}
    </div>
    <div class="calculate" @click="calClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton'
  import { mapGetters } from 'vuex'

  export default {
    name: "CartBottomBar",
    components:{
      CheckButton
    },
    computed:{
      ...mapGetters(['cartList']),
      totalPrice(){
        //filter 过滤  , reduce 汇总
        return '¥'+this.cartList.filter( item =>{
          return item.checked
          }).reduce((preValue,item) => {
           return preValue+item.price * item.count
        },0).toFixed(2)
      },
      checkLength(){
        return this.cartList.filter(item => item.checked).length
      },
      isSelectAll(){
        if(this.cartList.length === 0 ) return false

        //1.使用filter
        // return !(this.cartList.filter(item => !item.checked).length)

        //2.使用find
        // return !(this.cartList.find(item => !item.checked))

        //3.普通方法
        for(let item of this.cartList){
          if(!item.checked){
            return false
          }
        }
        return true
      }
    },
    methods:{
      checkClick(){
        if(this.isSelectAll){
          //全选中
          this.cartList.forEach(item => item.checked =false)
        }else{
          //有未选中的
          this.cartList.forEach(item => item.checked =true)
        }

        //不能做如下简化
        // this.cartList.forEach(item => item.checked =!this.isSelectAll)
      },
      calClick(){
        if(!this.isSelectAll){
          this.$toast.show('请选择购买的商品',2000)
        }
      }
    }
  }
</script>

<style scoped>
.bottom-bar{
  position: relative;
  display:flex;

  height: 40px;
  line-height: 40px;

  background-color: #eee;

}
.check-content{
  display: flex;
  align-items: center;
  margin-left: 10px;
  /*width: 40px;*/
}
  .check-button{
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .price{
    margin-left: 20px;
    /*flex: 1;*/
  }
  .calculate{
    position: absolute;
    right: 0px;
    width: 90px;
    color: #fff;
    background-color: red;
    text-align: center;
  }
</style>
