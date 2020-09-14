---
title: webpack相关分享
sidebarDepth: 2
---

## 使用require.context实现前端工程自动化


### 1. 介绍
一个webpack的api,通过执行require.context函数获取一个特定的上下文,主要用来实现自动化导入模块,在前端工程中,如果遇到从一个文件夹引入很多模块的情况,可以使用这个api,它会遍历文件夹中的指定文件,然后自动导入,使得不需要每次显式的调用import导入模块

### 2. 使用场景
日常情况下,我们使用最多的则是在vuex大型项目的module管理上面
```js
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)


const modulesFiles = require.context('./modules', true, /\.js$/)

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters
})

export default store

```

让我们对比一下,正常情况下,我们不用工程化该怎么做

``` js
import Vue from 'vue'
import Vuex from 'vuex'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import user from './modules/user'
import app from './modules/app'
import tagsView from './modules/tagsView'
import activity from './modules/activity'
import cms from './modules/cms'
import dataCenter from './modules/dataCenter'
import enter from './modules/enter'
import productCenter from './modules/productCenter'
import role from './modules/role'
import onlineShopInventory from './modules/onlineShopInventory'
import notice from './modules/notice'

import rfm from './modules/rfmShop'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    user,
    tagsView,
    activity,
    cms,
    dataCenter,
    enter,
    productCenter,
    role,
    onlineShopInventory,
    notice
  },
  getters
})

export default store
```

是不是感觉又臭又长,我们每次都需要手动引入,一旦后期更改文件之后,还会出现报错的问题

### 3. 分析require.context

1. directory {String} -读取文件的路径
2. useSubdirectories {Boolean} -是否遍历文件的子目录  
3. regExp {RegExp} -匹配文件的正则

**语法: require.context(directory, useSubdirectories = false, regExp = /^.//);**

::: tip 提示 
   :smiley: 当然我们不仅在vuex和router等项目中使用前端工程化,图片的引入也同样受用
:::

### 4. 图片引入
常规情况下,我们项目文件html的图片标签引入文件会是这样的:

``` html
  <img src="../assets/logo.png">
```
但是这种带来的问题就是后期我们在更换图片文件夹和图片位置的时候,也需要手动修改,这就显得很low了:thumbsdown:

于是我们可以在webpack配置,默认用@访问src文件下的文件,这样我们只要保证我们访问的图片在src下就可以了

``` html
  <img src="@/assets/logo.png">
```
但是问题又来了,我新建的图片文件夹在src下,不在原目录下,我是不是又需要更改一下呢,而且失去了智能提醒,还需要手动写路径,无疑让我们很不爽
于是我们利用了模块化的思想解决了这个问题,利用require导入

``` js
export default{
   bg_top:require('@/assets/topshow.png'), 
   pro_msg:require('@/assets/product_msg.png'),
   pro_msg:require('@/assets/product_msg.png'),
   pro_black:require('@/assets/black.png'),
   pro_full:require('@/assets/full.png'),
   pro_progress:require('@/assets/progress.png'),
   pro_source:require('@/assets/product_source.png'),
   pro_1:require('@/assets/img_1.png'),
   pro_2:require('@/assets/img_2.png'),
   pro_3:require('@/assets/img_3.png'),
   pro_4:require('@/assets/img_4.png'),
   pro_5:require('@/assets/img_5.png'),
   pro_report:require('@/assets/report.png'),
   pro_last:require('@/assets/last.png'),
   pro_step:require('@/assets/step.png')
}
```
挂载到vue中
``` js
import Source from '@/utils/source'
Vue.prototype.$source = Source
```

页面使用
``` html
 <img :src="$source.bg_top" alt="">
```

此刻我只想说一句,又更有逼格了,不对等等,我感觉也没有好用到哪去啊,还让我们多写了代码,也没有解决问题,不符合程序员的气质:dizzy_face:

**于是前端工程化完美的解决了这个问题**

```js
const source = {}
let requireContext = require.context('../assets/.', true,  /\.(?:jpg|gif|png)$/)
console.log(requireContext)
// requireContext.keys() 返回匹配成功模块的名字组成的数组
requireContext.keys().forEach((key) => {
  // 通过 requireContext(key)导出文件内容
  const mod = requireContext(key)
  source[key.match(/(?<=.\/).*?(?=.jpg|.gif|.png)/)] = mod.__esModule && mod.default ? mod.default : mod
})
export default{
  ...source
 }
```

此时在控制台

![](/images/webpack.png)

全局可以直接使用,而且我们后期如果需要更改文件夹,只需要统一配置就行,也不用担心文件路径,用起来方便很多

``` html
 <img :src="$source.logo" alt="">
```
::: warning 注意
:disappointed: 日常正则匹配一定要处理好,否则全局图片崩盘,到时候就爽歪歪咯
:::


