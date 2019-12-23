import Toast from './Toast'

const obj = {}

//install执行时默认会传出一个参数Vue
obj.install = function (Vue) {
  // Vue.extend(Toast)
  // console.log(Toast.$el);//undefined
  // document.body.appendChild(Toast.$el)

  //1.创建一个组件构造器
  const toastContrustor =  Vue.extend(Toast)
  //2.通过new的方式,根据组件构造器,可以创建出来一个组件对象
  const toast = new toastContrustor()
  //3.将组件对象手动挂载到某一元素上
  toast.$mount(document.createElement('div'))
  //4.toast.$el对应的就是div
  document.body.appendChild(toast.$el)

  Vue.prototype.$toast = toast;
}

export default obj
