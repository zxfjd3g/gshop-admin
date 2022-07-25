## day01

### 解决bug的基本操作流程

```
1. 浏览器控制台(Console)
2. 请求(network)
3. 审查标签样式(Elements) 
4. 查看组件 (vue插件)   组成结构/内部数据
5. 查看vuex的数据    vuex插件
6. 查看前台数据存储 (application)  cookie / localStorage / sessionStorage

查看可疑代码   ==> 打印输出 / debugger
```

### git的6个基本操作

```
1. 创建本地仓库
	创建并配置.gitignore
	git init
	git add .
	git commit -m "init"
	
2. 创建远程仓库
	指定仓库名 ==> 创建
3. 将本地仓库中的代码推送到远程仓库
	git remote add origin https://gitee.com/zxfjd3g/code-210510.git
	git push origin master
4. 本地代码有更新=> 提交到本地仓库并推送到远程仓库
	git add .
	git commit -m "add README"
	git push origin master
5. 远程仓库有更新 => 拉取到本地仓库
	git pull origin master
6. 克隆远程仓库到本地仓库
	git clone url
	
分支操作
	master: 默认主分支 ==> 不在此分支下写代码
	master -> dev: 开发分支 ==> 多个开发共用
	dev -> 个人分支/特性分支  ==> 在此分支上写代码  ==> 完成之后合并dev分支
	
	创建并切换到dev: git checkout -b dev
	将dev分支推送到远程仓库: git push origin dev
	根据dev创建并切换到个人分支: git checkout -b xfzhang_02
	推送个人分支到远程: git push origin xfzhang_02
	
	整体拉取所有分支: git pull
	根据远程的特定分支创建本地特定分支: 
		git checkout -b xfzhang_02   不正确, 它是根据当前本地分支创建新分支
		git checkout -b xfzhang_02 origin/xfzhang_02 根据远程的xfzhang_02分支创建本地对应分支
	
在拉取远程更新前必须保证工作区是干净的
如果有修改, 拉取失败 ==> 如何处理?
查看状态: git status
    方式1: 重置工作区的修改 git restore *
    方式2: 提交到本地仓库 git add . / git commit -m "xxx"
```



### 任务01: 运行潘家成的后台管理模板项目, 并理解主要的文件目录结构

```js
src 
  api # 包含多个接口请求函数模块
    user.js # 用户登陆相关接口请求函数
  assets # 包含一些静态资源, 如图片
  components # 包含一些通用的非路由组件
  icons # 包含svg图标
  layout # 管理界面整体布局
    components/Navbar.vue # 头部导航条组件
  router # 路由相关
  store # vuex相关
    modules/user.js # 用户的vuex子模块
    getters.js # 总的getter计算属性
    index.js # store对象
  styles # 包含一些scss样式模块
  utils # 包含一些工具模块
    auth.js # 存储token的模块
    request.js # axios二次封装的模块
  views # 包含一些路由组件
    login/index.vue # 用户登陆路由组件
  App.vue # 应用根组件
  main.js # 入口js
  permission.js # 使用全局守卫做权限控制的模块
.env.development  # 配置开发环境的变量   代理前缀路径
.env.production # 配置生产环境的变量 代理前缀路径
jsconfig.json # 用于引入模块路径时, 加@后还可以提示
package-lock.json  # 保存了下载的依赖包的准确详细信息
vue.config.js # webpack配置   配置代理等
```



### 任务02: 使用swagger测试 登陆 / 获取用户信息 / 获取品牌分页列表的接口

```
测试/测/对接口: 测试接口文档与真实接口是否一致
	1. 接口文档(本地/在线) + postman(请求工具)
	2. swagger(接口文档 + 请求工具)
请求操作成功的响应数据的code值: 20000/200代表成功
```



### 任务03: 理解 '登陆和自动登陆' 的流程

![image-20211127105533674](images/image-20211228193929034.png)

### 任务04: 修改已有代码, 实现 '登陆 / 自动登陆 / 退出登陆' 3个功能

```
1. 配置代理服务器: vue.config.js
2. 请求携带token与指定正确的code值: utils/request.js
3. 使用localStorage代替cookie存储token: utils/auth.js
4. 定义登陆相关的接口请求函数: api/user.js
5. 完善获取用户信息的异步action: store/modules/user.js
6. 登陆的静音校验与背景图片: views/login/index.vue
7. 在头部显示当前登陆用户名: layout/components/NavBar.vue

```

### 任务05: 搭建商品管理相关路由, 理解菜单路由配置

```js
{
	path: '/product',  // 一级路由路径
    component: Layout, // 一级路由组件
    redirect: '/product/category/list', // 自动路由到指定的默认二级路由
    name: 'Product', // 标识名称 => 用于后面要讲路由权限控制
    meta: { 
        title: '商品管理', // 一级菜单的标题
        icon: 'el-icon-shopping-cart-full'  // 一级菜单的图标
    },
    children: [ // 二级路由
      {
        // path: '/product/category/list',
        path: 'category/list',  // 路由路径
        name: 'Category', // 标识名称
        component: () => import('@/views/product/category/list.vue'), // 组件
        meta: { title: '分类管理' } // 菜单标题
      },
    ]
}
```



### 任务06: ES6 模块化(ES Module)导出与导入

```
最重要的一句话: 
	整个模块总是一个对象, 任何导出的语法都是向这个模块对象中添加属性/方法

暴露/导出模块的语法
  1. 分别导出
  2. 默认导出
  3. 统一导出
引入/导入模块的语法
  1. 引入单个的
  2. 引入默认的
  3. 引入全部
引入并暴露模块
  将import直接改为export
```



### 任务07: 定义品牌管理的接口请求函数模块, 并统一管理

```
1. 根据接口文档定义品牌管理对应的接口请求函数模块: api/product/trademark.js
2. 对接口请求函数模块进行统一暴露: api/index.js
3. 将API整体模块对象挂载到Vue原型对象 => 让所有组件直接可见API对象: main.js
4. 在组件中调用接口请求函数 => 测试: views/product/trademark.vue

注意: 修改request.js  ==> res.code !== 20000 && res.code!==200
```



### 任务08: 利用element-ui组件快速完成品牌管理界面布局(静态数据)

```
elementUI组件: Card / Button / Table / Pagination
插槽: 具名 / 默认 / 作用域插槽
使用elementUI快速布局: 找到组件文档 ==> 找到相似例子(可能需要多个) => 最后看API
可能需要适当修改组件的一些样式
```

## day02

API

​	语法: web API / Vue API / React API

​	前后台交互的接口: url/method/请求参数格式/响应数据格式

插槽:

​	默认插槽

​	具名插槽

​	作用域插槽

### 任务09: 动态显示品牌分页列表

```
定义分页列表的data数据: trademarks / currentPage / pageSize / total
定义获取分页列表的方法: getList
显示第一页: 在mounted中调用getList获取分页数据显示, 并在模板中显示出来
当前页码发生改变或者每页数量发生改变重新获取分页列表: @current-change / @size-change
列表动态显示的loading效果: v-loading指令

```



### 任务10: 动态显示品牌添加和更新界面

```
elementUI组件: Dialog / Form / Input / Upload / Button
区分添加还修改品牌: form.id是否有值
问题: 显示修改后, 再显示添加 ==> 显示是修改
	原因: 前面修改指定的form数据还在 
	解决: 在显示添加前重置form
```



### 任务11: 上传品牌图片

```
使用upload组件实现上传功能
 action: 处理上传请求的url ==> 不能直接使用目标url(跨域) => 利用代理服务 => 必须指定 /dev-api
on-success: 指定上传成功的回调 => 将返回的图片url保存到form.logUrl上
before-upload: 指定上传前的回调 => 用于对文件大小和类型进行限制 ==> 如果不满足要求就不提交上传请求

问题: 修改品牌不能取消
	原因: 表单与列表共享同一个品牌对象
	解决: 让表单使用拷贝产生的品牌对象
```



### 任务12: 对品牌添加表单进行前台表单校验

```
前台表单校验:
	前台项目: vee-validate
	后台项目: elementUI的Form组件内置的校验API
校验的时机:
	对单个表单项: 输入过程中: trigger: change  默认值 / 失去焦点: trigger: blur
	对所有表单项: 在点击提交按钮, form.validate(valid => {})
实现校验的编码方式:
	声明式: 直接声明使用一些内置的校验规则, 不需要亲自去编码判断数据的合法性
	自定义验证: 通过validator配置来指定校验器函数来亲自对输入的数据进行合法性的判断

问题1: 上传完图片, 显示的提示信息没有消失
	原因: 没有触发校验
	解决: 在上传成功后, 主动去对logoUrl 或者直接清除提示信息   form.validateField()/clearVaidate()
问题2: 关闭再打开, 前面显示错误信息还在
	原因: Dialog关闭时对应的DOM结构还是存在的(就包含错误信息)
	解决: 在显示之后立即清除提示信息 ==> watch + 判断为true + $nextTick() + clearValidate()
```

![内置校验规则](images/内置校验规则.png)

### 任务13: 实现添加和更新功能

```
发送添加/更新的请求
区别: 还是根据form.id是否有值
请求成功后, 获取哪页显示? 添加显示第一页, 更新显示当前页
请求过程中, 按钮显示loading:  :loading="btnLoading" => 无论成功还是失败都要改为false
		try...finally{ 在些处理}
错误信息提示: error.data || error.message
```



### 任务14: 实现品牌删除功能

```
显示确定框: this.$confirm().then(() => {}).catch(() => {})
调用删除品牌的接口请求函数
删除成功重新获取分页列表显示  => 如果当前页只有一条数据了

问题1: 删除请求出错提示不对
	原因: 正确的信息在data, 而没有message
	解决: 指定提示信息时, 优先考虑data, 再考虑message
问题2: 删除失败后会显示点击取消的提示
	原因: 请求错误产生的失败promise传递给了catch  ==> 点击取消和请求出错都会执行catch的回调
	解决: 
		方式一: 在catch回调中判断error是否是'cancel', 才提示
		方式二: 不用catch, 通过then同时指定失败回调, 请求失败时就不会执行, 只有点击取消按钮才会执行
```



## day03

### 任务15: 封装一个带功能文本提示的按钮组件

```
HintButton: 使用el-button/ el-toolTip
使用到一种祖孙间通信方式: $attrs与$listeners   v-bind / v-on
	$attrs: 包含所有没有在props声明的标签属性(class和style除外)
	$listeners: 包含所有监听回调函数
注册全局组件: Vue.component()

问题1: 确定框显示后关闭确定框, toolTip的提示文本又会重新显示
	原因: 关闭确认框后, 上一次点击的按钮又自动获得了焦点  ==> 官方还没有解决这个问题
问题2: 删除指定品牌后, 对应位置的新品牌也还会显示toolTip的提示文本
	原因: el-table内部默认使用下标作为遍历元素的key, 新的数据复用了被删除数据的key, 就复用了对应的元素
	解决: 通过row-key来指定使用id值作为key  ==> 不再显示文本提示 / 效果高
	
```



### 任务16: 三级分类选择组件--静态界面

```
components/CategorySelector
elementUI的组件: Form / Select / Option
```



### 任务17: 三级分类选择组件--动态显示分类列表

```
定义获取分类列表的接口请求函数
在CategorySelector调用请求函数动态获取列表数据显示一级分类列表
在选择一级分类项时请求获取二级分类列表
在选择二级分类项时请求获取三级分类列表
问题: 当选择二级或一级分类项时, 子级选择的分类没有还显示着旧数据, 应该是没有选择数据
	原因: 没有清除子级相关数据
	解决: 当选择一个分类项时, 清除子级相关数据
```



### 任务18: 三级分类选择组件--改变分类通知父组件

```
子向父通信: 自定义事件
	子组件: 子组件分发事件, 携带数据
	父组件: 绑定事件监听, 接受数据, 并做相应处理
CategorySelector: $emit('category-change', {categoryId:23, level: 1/2/3})
Attr: @category-change   只有当收到的数据level为3时, 才发请求获取属性列表
```



### 任务19: 平台属性列表界面

```
定义平台管理相关接口请求函数
在确定三级分类后, 请求获取属性列表显示
在选择一级或二级分类后, 清除子级分类ID和属性列表
控制按钮的可操作性: 只有确定了三级分类才可操作
```



### 任务20: 平台属性修改/添加--动态显示

```
设计一个标识是否显示列表页面的变量: isShowList=true
点击按钮时切换isShowList值
动态显示要修改的属性数据(属性名 + 属性值列表)
```



### 任务21: 平台属性修改/添加--修改属性值

```
让属性值(attrValue)在查看模式与编辑模式进行切换显示
为每个attrValue设计一个标识属性edit, 如果为true显示input, 如果不存在或为false, 显示span
从查看模式 => 编辑模式
	给span绑定click ==> 给当前attrValue指定edit为true
	注意1: 当没有edit时, 必须使用$set来添加edit属性, 不能直接添加
	注意2: 显示input后, 自动获取焦点
		给每个input添加一个唯一的ref值: 使用对应下标$index
		必须在显示input后才去获取input: $nextTick()
		读取input获取焦点: $refs[index].focus()
	注意3: 点击响应区域不能仅仅是文字区域, 而应该是整个框的区域
		span默认的宽度是文字内容
		改为行内块, 并指定宽度100%
从编辑模式 => 查看模式
	给input绑定blur / keyup.enter监听, 将edit变为false
	el-input不处理keyup, 只能绑定原生的   keyup.enter.native
	给每个属性值对象的属性值名称备份到另一个属性上: copyValueName
	注意1: 输入数据为空
		变为原来值
	注意2: 输入数据重复了
		如何判断: 判断数组是否有2个属性值对象的属性值名称与valueName相同
		变为原来值
bug: 属性值名称修改不能取消
	原因: 列表与修改界面共用一个属性对象
	解决: 必须使用深拷贝(修改的对象引入的外部对象中的数据)
```



### 任务22: 平台属性修改/添加--添加属性值

```
向属性值列表中添加一个属性值对象, 且edit默认为true
	{
		valueName: '',
		attrId: attr.id,
		edit: true
	}
如果没有输入或重复了, 直接干掉
```



### 任务23: 平台属性修改/添加--删除属性值

```
PopConfirm气泡确认框
点击确定的事件名onConfirm, 而不是文档中confirm
根据下标直接删除attr.attrValueList就可以, 不需要发请求
```



### 任务24: 平台属性修改/添加--请求完成功能

```
根据收集的attr对象数据, 请求添加/修改属性的接口
通用操作: 在发请求前, 对要提交的数据进行特定处理/整理操作
    1. 把属性值对象中的edit属性删除
```



### 任务25:  限制分类选择器的可操作性

```
效果: 在属性列表页面可操作, 在添加/修改界面不可操作
可能通过disabled属性来控制Select的可操作性
:disabled="!isShowList"
```



## day04

### 任务26 平台属性删除

```
根据ID请求删除对应平台属性
成功后提示并重新获取列表
```



### 任务27: 区别spu与sku

```
spu: 一款产品所有相关信息的集合, 包含: 图片(很多张)/颜色(多种)/内存(多种)等的所有数据信息
sku: 确定了具体信息值的相关信息集合, 确定了图片(多张)/颜色(一种)/内存(一种)
一个spu对应多个sku
```



### 任务28: spu与sku的api串讲

```
一个接口请求函数对应多个接口
携带params与query的区别:
	params参数总是拼在路径中的
	query参数: 配置: {params: {query参数}}
```



### 任务29: spu分页列表

```
设计数据: spuList/page/pageSize/total/category1Id/category2Id/category3Id
elementUI组件: Card / Button / Table / Pagination
动态显示, 处理页码改变和每页数量改变的处理
```



### 任务30:  查看SPU下的SKU列表

```
elementUI: Dialog / table
设计数据: isShowDialog / spu / skuList / isLoading
请求获取sku列表显示
```



### 任务31: spu分页列表/SpuForm/SkuForm的切换显示

```
定义显示谁标识数据: showStatus: 1 / 2 / 3
子组件向父组件通信 ==> SpuForm/SkuForm返回列表页面
	自定义事件
	:showStatus.sync   update:showStatus="showStatus=$event"
```



### 任务32: SpuForm组件--静态界面布局

```
Form / Input / Select / Upload / Button / Table / Tag
```



### 任务33: SpuForm组件--初始化动态请求

```
进入SPU修改界面的请求
	根据spuId获取spu详情: spu.get(id)
	根据spuId获取SPU图片列表: sku.getSpuImageList(spuId)
	获取所有品牌的列表: trademark.getList()
	获取所有销售属性列表: spu.getSaleList()
进入SPU添加界面的请求
	获取所有品牌的列表: trademark.getList()
	获取所有销售属性列表: spu.getSaleList()
	
问题: 父组件如何能调用子组件的方法?  ==> 通过ref得到子组件对象来调用其方法
```



### 任务34: SpuForm组件--动态显示与收集基本数据

```
要收集的SpuInfo的数据结构:
	spuInfo: { // spu的详情信息
        category3Id: null,  // 添加进入由 父组件传入
        spuName: '',
        description: '',
        tmId: null,
        spuImageList: []
        spuSaleAttrList: [],
        
      },
添加进入时, 输入传入并保存category3Id
使用v-model来动态显示并收集数据    ==> v-model双向数据绑定效果
```



### 任务35: SpuForm组件--动态显示与收集图片数据

```
请求得到的数据很可能不能直接用于显示, 需要先处理, 再保存到data用于显示
spuImageList
	原来 : {imgName, imgUrl}
	需要: {name, url}
	利用数组的map方法处理

<el-upload
        multiple
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :file-list="spuImageList"   // 已上传的图片列表, 初始就会显示出来
        :on-preview="handlePictureCardPreview" // 图片预览
        :on-remove="handleRemove" // 删除图片
        :on-success="handleSuccess"> // 上传成功
        <i class="el-icon-plus"></i>
      </el-upload>
```

### 任务36: SpuForm组件--动态显示spu销售属性列表

```
区别销售属性列表与Spu销售属性列表
	销售属性列表: 
        [
          {
            "id": 1,
            "name": "选择颜色"
          },
          {
            "id": 2,
            "name": "选择版本"
          },
          {
            "id": 3,
            "name": "选择套装"
          }
        ]
    Spu销售属性列表: 在spuInfo内部
    	 "spuSaleAttrList": [
            {
              "id": 133,
              "spuId": 26,
              "baseSaleAttrId": 2,
              "saleAttrName": "选择版本",
              "spuSaleAttrValueList": [
                {
                  "id": 225,
                  "spuId": 26,
                  "baseSaleAttrId": 2,
                  "saleAttrValueName": "aa",
                  "saleAttrName": "选择版本",
                  "isChecked": null
                }
              ]
            }
          ],
    	
```



### 任务37: SpuForm组件--动态显示销售属性下拉列表

```
遍历saleAttrList显示
[
  {
    "id": 1,
    "name": "选择颜色"
  },
  {
    "id": 2,
    "name": "选择版本"
  },
  {
    "id": 3,
    "name": "选择套装"
  }
]
定义未使用销售属性列表计算属性: filter() / some()
定义提示文本计算属性
```



## day05

### 任务38: SpuForm组件--添加spu销售属性值

```
设计标识属性: edit, 保存到每个spu销售属性对象, 显示时根据edit来判断是显示input还是显示button

查看模式 => 编辑模式
	给spuSaleAttr指定edit属性为true
	如果还没有edit属性 => 使用$set添加  => 数据才是响应式的 => input才会自动显示
	自动获取焦点: $nextTick() + ref + focus()  / atuofocus
	
编辑模式 => 查看模式
	绑定监听: blur / keyup.enter.native
	row.edit = false ==> 显示buton
	添加一个属性值对象: row.spuSaleAttrValueList添加
		{
          "saleAttrValueName": "a", // 输入的名称
          "baseSaleAttrId": "1", // row.baseSaleAttrId
        }
  注意: Form中有input, 按下enter时会自动提交表单
  		Input不支持自定义的keydown事件, 我们只能去绑定原生的
  		给input绑定keydown.enter.native.prevent监听
    
```



### 任务39: SpuForm组件--添加spu销售属性

```
添加的spu销售属性对象的结构:
	{
      "baseSaleAttrId": "1",
      "saleAttrName": "选择颜色",
      "spuSaleAttrValueList": []
    }
 选择销售属性时, 收集数据:
 	要收集id和name, option的value: item.id + ':' + item.name"
 	
```



### 任务40: SpuForm组件--删除spu销售属性值

```
@close="row.spuSaleAttrValueList.splice(index, 1)"
```



### 任务41: SpuForm组件--请求保存/更新spu

```
发请求前要对收集数据进行处理
	处理1: spuImageList    map()
        目标: 
          {
            "imgName": "下载 (1).jpg",
            "imgUrl": "http://47.93.148.192:8080/xxx.jpg"
          }
        原本有的:
          {
            name: '',
            url: ''
          }
        新上传的:
          {
            name: '',
            response: {data: url值}
          }
     处理2: 删除一些不必要提交的数据
        没有一个属性值的属性  spuSaleAttrValueList数组是空的   ==> 过滤掉    filter
        edit属性  删除属性
        attrValueName属性 删除
发送请求提交spuInfo
```



### 任务42: SpuForm组件--请求保存/更新spu成功后重新显示spu列表

```
子组件
	提示成功
	通知父组件
	清除数据    ==> 返回时也需要处理
父组件
	接收到通知做相应  ==> 重新获取分页列表 
如何区别是更新返回还是添加返回?
	在点击更新的回调中保存spuId: this.spuId = spu.id
	判断: if (this.spuId) 更新, 否则是添加
```



```
1. 静态界面
2. 请求获取数据
3. 对数据进行特定处理来满足界面显示的要求
4. 动态显示数据
5. 收集数据: v-model / 父组件传入 / 绑定特定监听, 在回调中手动收集数据
6. 对要提交的数据(前面收集的)进行特定处理, 来满足接口的要求
7. 发请求提交数据
8. 在请求成功后, 做特定界面响应后续处理

```



## day06

### 任务43: SkuForm组件--静态布局

```
Card / Form / FormItem / Input / Select / Table / Button / Tag / Image
```



### 任务44: SkuForm组件--初始化动态显示请求

```
1. 获取平台属性列表: attr.getList(category1Id, category2Id, category3Id)
2. 获取Spu销售属性列表: sku.getSpuSaleAttrList(spuId) 
3. 获取spu图片列表: sku.getSpuImageList(spuId)
```



### 任务45: SkuForm组件--基本数据动态显示与收集

```
skuInfo: {
     // 从父组件传入
     "category3Id": null,
     "spuId": null,
     "tmId": null,
     
     // 通过v-model收集
     "skuName": null,
     "skuDesc": null,
     "price": null,
     "weight": null,
}
```



### 任务46: SkuForm组件--平台属性动态显示与收集

```
一个平台属性
{                       // FormItem
    "id": 1,
    "attrName": "价格",  // FormItem的label
    "categoryId": 61,
    "categoryLevel": 3,
    "attrValueList": [  // select
      {                 // option
        "id": 207,
        "valueName": "500-999",
        "attrId": 1
      }
    ]
    valueId: 207  // 通过v-model="item.valueId"来收集
 }
```



### 任务47: SkuForm组件--销售属性动态显示与收集

```
一个销售属性
  {                           // FormItem
    "id": 136,
    "spuId": 30,
    "baseSaleAttrId": 1,
    "saleAttrName": "选择颜色",   // FormItem的label
    "spuSaleAttrValueList": [    // Select
      {							// Option
        "id": 258,
        "spuId": 30,
        "baseSaleAttrId": 1,
        "saleAttrValueName": "a",
        "saleAttrName": "选择颜色",
        "isChecked": null
      }
    ],
    valueId: 258                 // 通过v-model="item.valueId"来收集
  }
```



### 任务48: SkuForm组件--图片列表动态显示与收集

```
显示: imageList
    [
      {
        "id": 333,
        "spuId": 26,
        "imgName": "rBHu8l6UcKyAfzDsAAAPN5YrVxw870.jpg",
        "imgUrl": "http://47.93.148.192:8080/xxx.jpg"
        
        // isDefault : "1" / "0", // '1'代表默认, '0'非默认
      }
    ]

收集:
	点击设置默认按钮
		请求得到数据后: 给每个图片对象添加一个isDefault属性, 值为'0'  
				==> 方便后面可以直接修改isDefault属性值, 而不需要使用$set
		根据isDefault来动态显示<button> / <tag>
		点击设置按钮:
			先将所有image对象的isDefault变为'0', 再将当前的变为'1'
			将当前图片的imgUrl保存到skuInfo.skuDefaultImg
	多选操作
		绑定选中状态发生改变的监听: @selection-change
		设计一个数据存储所有选中的: selectedImageList
```



### 任务49: SkuForm组件--sku添加请求

```
处理skuAttrValueList
	目标:skuInfo.skuAttrValueList
		{
            "attrId": "2",
            "valueId": "9"
        }
    现有: attrList
    	{
    		id: "2",
    		valueId: "9"
    	}

处理skuSaleAttrValueList
	目标:skuInfo.skuSaleAttrValueList
		{
           "saleAttrValueId": 258
        }
    现有: saleAttrList
    	{
    		valueId: "9"
    	}

处理skuImageList
	目标:skuInfo.skuImageList
		{
           "imgName": "下载 (1).jpg",
            "imgUrl": "http://47.93.148.192:8080/xxx.jpg",
            "spuImgId": 337, // 当前Spu图片的id
            "isDefault": "1"   // 默认为"1", 非默认为"0"
        }
    现有: selectedImageList
    	{
    		id:1
            imgName:"2ff0882c9607e57c.jpg"
            imgUrl:"http://47.93.148.192:8080/group1.jpg"
            isDefault:"0"
            spuId:1
    	}

请求添加skuInfo
```



### 任务50: SkuForm组件--sku添加请求成功后处理

```
保存成功
	提示成功了
	重置数据
	分发.sync对应的事件 ==> 显示spu列表
	分发保存成功的事件通知父组件
取消
	重置数据
	分发.sync对应的事件 ==> 显示spu列表
	分发取消的事件通知父组件
```



### 任务51: Sku列表组件--分页列表和删除功能实现代码说明

```
Card / Table / Image / Pagination
请求获取sku的分页列表: sku.getList (page, limit)
```



### 任务52: Sku列表组件--sku上下架处理

```
根据isSale来动态显示: 0代表已下架, 1代表在售(已上架)
点击下架按钮: 请求下架的接口
点击上架按钮: 请求上架的接口
```



### 任务53: Sku列表组件--动态显示sku详情界面

```
Drawer / Col / Row / Carousel / Tag
根据skuId获取sku详情信息: sku.get(skuId)
设计data数据: isShowDrawer / skuInfo
```



### 任务54: Sku列表组件--作用域样式与深度作用域选择器的作用和原理  (面试常问)

```
结论: 
    不使用scoped: 可以修改外部/子组件(第三方组件)内部的任意标签样式 (全局)
    scoped样式: 
      不准确: 让样式只能作用于当前组件, 不能作用于其它组件(子组件/外部组件) 
      准确: 只能作用于当前组件和子组件内的根标签
    深度作用域选择器(::v-deep): 可以修改子组件(第三方组件)内部的样式
    
scoped的作用和原理
	作用: scoped样式只能影响当前组件和子组件的根标签
    原理: 加了scoped后产生了哪些变化
		标签: 当前组件的所有原生标签和子组件的根标签都添加了同一个且唯一的data自定义属性
        	<div data-v-6777eaa2>
		选择器: 在选择器的最右边加上了当前data自定义属性的选择器 
			==> 只有可能匹配上当前组件和子组件的根标签(子组件的子标签没有这个属性)
			.box .title[data-v-6777eaa2] {
               color: red;
             }
deep的作用和原理
	deep的作用: 让我们的样式在scoped下也可以影响子组件内部子标签的样式
    使用:
        原生css: >>>
        css预编译器: /deep/ (vue-cli3之前) 或 ::v-deep (vue-cli3及之后)
    原理:
        data自定义属性选择器就会从最右侧转移到deep声明的位置
        ==> 对子组件的内部子标签没有当前data属性的条件限制 ==> 那就可以匹配了
        .box[data-v-6777eaa2] .title {
        	color: red;
        }

总结:
	1. 如何修改第三方组件内部样式
		方式1: 将修改样式定义在没有scoped的style中  ==> 注意外层要写上根标签的选择器
		方式2: 在scoped的style中使用deep语法
	2. 作用域样式(scoped)的作用和原理
	3. 深度作用域选择器(deep)的作用和原理
```



### 任务55: Sku列表组件--修改element-ui的抽屉和轮播组件的样式

```
/* 方式一: 不使用scoped样式 */
<style lang="scss">
  .sku-list {
    .el-carousel__container {
      width: 400px;
    }
  }
</style>

/* 方式二: 使用深度作用域选择器 */
<style lang="scss" scoped>
  .sku-list {
  	//不用加deep, 因为我们修改的子组件根标签的样式
    .el-row {
      margin-top: 10px;
      .el-col-5 {
        text-align: right;
        margin-right: 20px;
      }
    }
    /* 方式二: 使用深度作用域选择器 */
    ::v-deep .el-drawer__body { /* 自动形成滚动, 但默认会显示滚动条 */
      overflow: auto;

      &::-webkit-scrollbar { /* 隐藏滚动条 */
        display: none;
      }

      .el-carousel__indicator {  // is-active
        .el-carousel__button { // 指定所有非选中的指示器样式
          background-color: pink;
        }
        &.is-active { // 指定选中的指示器的样式  // & 父级引用
          .el-carousel__button {
            background-color: hotpink;
          }
        }
      }
    }
  }
</style>
```



## day07

### 任务56: 权限管理--分析

```
1. 权限管理由2部分组成
	权限相关数据(权限/角色/用户)的CRUD
		一个角色对应多个权限
		一个用户对应多个角色
	权限控制: 控制登陆用户只能看到有权限的路由页面和按钮
	
	我们实现的权限控制是基于后台权限相关数据的实现
	
2. 有2个后台用户
	admin/111111: 超级管理员 ==> 有所有路由和按钮的权限
	sh2107182/111111: 普通用户 ==> 只有部分路由和按钮的权限

3. 权限控制的级别
	路由(页面)权限: 只能看到有权限的路由页面 ==> 粗粒度
	按钮: 只能看到有权限的按钮 ==> 细粒度
	
4. 当前项目的导航菜单路由
	首页: 所有用户都可见 ==> 不用进行权限控制
	商品管理: 只有有权限的用户才可风  ==> 需要进行权限控制

5. 获取用户的权限数据?
	哪个请求: 根据token获取用户信息的请求中返回权限相关数据(roles/routes/buttons)
	什么时候请求: 登陆请求成功后 / 刷新页面(前面登陆了, 浏览器中保存了token)
	在哪里发的请求: 在全局前置守卫中中: 有token但没有用户(前面登陆过, 但当前还没有登陆)
	
6. 用户权限相关数据结构?
	roles: ["一般管理员", "aaa"]
	routes: ["RoleAuth", "Role", "User"]
	buttons: ["btn.User.add", "btn.Role.assgin"]
	
7. 注册路由的2种方式
	静态注册: 项目初化时, 创建路由器时通过routes配置注册上   ==> Login/DashBoard
		routes: [路由1, 路由2]
	动态注册: 用户登陆后获取得到用户的权限数据后才去
		router.addRoutes([路由3, 路由4])
	
8. 路由分类
	常量路由(constantRoutes): 静态注册的所有路由 => 不登陆或所有用户登陆都可以
	异步/权限路由(asyncRoutes): 得到用户的权限数据后确定并注册的路由  => 登陆用户有权限的部分路由
	通配路由(anyRoute): 匹配任何常量与权限路由都不匹配的路由跳转 => 必须在最后才注册
	
9. 使权限路由生效
	动态注册权限路由和通配路由: router.addRoutes([...asyncRoutes, anyRoute])
	根据常量路由和权限路由生成导航菜单: constantRoutes + asyncRoutes
	
10. 路由权限控制编码的基本流程
	1. 将所有的路由拆分成3类: router/routes.js
		constantRoutes / allAsyncRoutes / anyRoute
	2. 初始化注册常量路由: router/index.js
	3. 发请求获取用户权限相关数据(roles/routes/buttons): store/modules/user.js
	4. 根据路由权限数据(routes)从所有异步路由数组(allAsyncRoutes)中过滤出当前用户的权限路由数组(asyncRoutes)
	5. 将用户的权限路由(asyncRoutes)进行动态注册
	6. 根据常量路由和权限路由生成导航菜单
```



### 任务57: 权限控制: 编码实现

```
1. 将所有的路由拆分成3类: router/routes.js
	constantRoutes
	allAsyncRoutes
	anyRoute
	
2. 初始化注册常量路由: router/index.js
	import {constantRoutes} from './routes'
	new VueRoute({routes: constantRoutes})
	
3. 发请求获取用户权限相关数据(roles/routes/buttons): store/modules/user.js
	const result = await getInfo()
    const { name, avatar, roles, routes, buttons } = result.data
    console.log(roles, routes, buttons)
	
4. 根据路由权限数据(routes)从所有异步路由数组(allAsyncRoutes)中过滤出当前用户的权限路由数组(asyncRoutes)
	function getAsyncRoutes(allAsyncRoutes, routeNames) {
      return allAsyncRoutes.filter(route => {

        // 如果有子路由, 先对子路由进行过滤处理
        if (route.children && route.children.length>0) {
          // 递归调用得到有权限的子路由的数组, 并赋给children
          route.children = getAsyncRoutes(route.children, routeNames)
        }

        // 如果当前路由的标识在路由权限数组中, 当前路由就是当前用户的权限路由
        return routeNames.includes(route.name)
      })
    }
	
5. 将用户的权限路由(asyncRoutes)进行动态注册: store/modules/user.js
	router.addRoutes([...asyncRoutes, anyRoute])
	
6. 根据常量路由和权限路由生成导航菜单
	store/modules/user.js:
		commit('SET_USER', {name, avatar, roles, buttons, routes: [...constantRoutes, ...asyncRoutes]})
	store/getters.js
		{routes: state => state.user.routes,}
	layout/compoents/siderbar/index.vue
		...mapGetters([
          'sidebar',
          'routes'
        ]),
        /* routes() {
          return this.$router.options.routes
        }, */
```



### 任务58:  解决路由权限控制的2个bug   面试要说

```
bug1: 在任意权限路由下刷新, 页面空白   ==> 模板项目本身的问题
            动态添加的路由在当前路由跳转看不见, 只有后面的跳转才可见
            next(): 放行路由跳转, 最终就会访问到目标路由  ==> 不能访问权限路由
            next(to.path): 中断当次跳转, 重新跳转路由到目标路由, 会丢失原有携带的参数 
            				=> 可以访问权限路由, 但会丢失参数
            next({...to}): 中断当次跳转, 重新跳转路由到目标路由, 会携带原有的携带的参数 
            				=> 可以访问权限路由, 不会丢失参数
bug2: 切换用户登陆, 只能看到有权限的部分路由
	原因: 根据路由权限对总的异步路由进行过滤时, 直接改变的总的路由数组(干掉了部分子路由)
	解决: 不要改变总的异步路由数组, 而是会深拷贝一个新的总异步路由数组, 对它进行过滤改变都没有问题
		使用loadsh的cloneDeep, 不能使用JSON的方法(内部包含了方法)
```



### 任务59: 实现按钮的权限控制

```
1. 按钮权限数据
	buttons: ["btn.User.add", "btn.Role.assgin"]
	vuex use的state中
	映射到getters中
2. 判断是否有指定按钮的权限
	定义判断函数: utils/hasBP.js
		export default function hasBP (button) {
          return store.getters.buttons.includes(button)
        }
    将hasBP函数挂载到vue原型上: main.js
    在组件中通过v-if调用hasBP来判断是否显示
    	v-if="$hasBP('btn.Trademark.add')"
```



### 任务60: 添加新的功能菜单路由测试权限控制

```
添加后台数据:
    创建新的路由权限和按钮权限
        测试管理   Test
            测试1管理 Test1
                添加
                修改
            测试2管理 Test2
                添加
                删除
    创建角色分配权限
        测试员 ==> 测试1管理 Test1/添加 ==> 测试2管理 Test2/删除
    创建用户分配角色
        test911 => 测试员
	
定义测试管理的路由组件
	Test
		Test1.vue  ==> 定义添加/修改按钮, 并使用v-if来判断是否显示
		Test2.vue  ==> 定义添加/删除按钮, 并使用v-if来判断是否显示
配置路由
    {
      name: 'Test', // 标识名称  ==> 后面要做的路由权限控制
      path: '/test', // 路由路径
      component: Layout, // 一级路由组件, 总是layout, 就是管理界面的整体布局
      redirect: '/test/test1', // 自动重定向显示分类管理界面
      meta: { 
        title: '测试管理',  // 菜单项的标题
        icon: 'el-icon-shopping-cart-2'  // 菜单项的图标
      },
      children: [ // 配置子路由
        {
          name: 'Test1', // 标识名称  ==> 后面要做的路由权限控制
          path: 'test1', // 路由路径
          component: () => import('@/views/Test/Test1.vue'), 
          meta: { 
            title: '测试1管理' // 菜单项的标题 
          },
        },
        {
          name: 'Test2', // 标识名称  ==> 后面要做的路由权限控制
          path: 'test2', // 路由路径
          component: () => import('@/views/Test/Test2.vue'), 
          meta: { 
            title: '测试2管理' // 菜单项的标题 
          },
        },
      ]
    },
```



### 任务61: 总结一下permission.js的整体流程

```
读取local中的token, 判断是否有token?
	=> 有: 判断是否是要去Login?
		=> 是: 强制重新跳转去首页
		=> 否: 判断是否有用户信息?
			=> 有: 直接放行
			=> 没有: 请求获取用户信息/权限数据 (注册权限路由)
				=> 成功了: 重新跳转到目标路由
				=> 失败了: 删除token/用户信息, 重新跳转到login
	=> 没有: 判断目标路由是否需要token?
		=> 需要: 强制重新跳转到login
		=> 不需要: 直接放行
```



## day08

### 任务62: 重置路由的2个问题

```
问题1: 退出登陆为什么要重置路由?
	重置路由: 将路由器中注册的路由从"常量路由+异步路由+any路由"变为"常量路由"
	不重置: 切换用户登陆(从A退出到B登陆), 能访问B没有但A有权限的路由
	重置了: 退出就不再有A的权限路由,  就不能访问A有权限的路由, 只能B有权限的路由
问题2: 如何重置路由?
	// 创建一个只注册了常量路由的新路由器
    const newRouter = createRouter()
    // 将新路由器的machter替换掉原本路由器的macher (路由是保存在matcher中的)
    router.matcher = newRouter.matcher // reset router
```



### 任务62: 权限数据管理的3个数据结构

```
路由权限数据
	id: 123,
	name: "权限管理", // 权限名称
	code: "Acl", // 权限值   路由配置的name需要与此一致
	type: 1, // 类型标识: 1代表路由权限, 2代表按钮权限

按钮权限数据
	id: "1333330741791866881",
	name: "添加用户", // 权限名称
	code: "btn.User.add",  // 权限值
	type: 2, // 类型标识: 1代表路由权限, 2代表按钮权限
	toCode: 'RoleAuth' // 点击跳转的路由权限值
	
角色数据
	id: 1,
	roleName: "管理员"
	permissionIds: ['路由权限id1', '路由权限id2', '按钮权限id1', '按钮权限id2']
	
用户数据
	id: 2,
	username: '测试管理员',
	roleIds: ['角色id1', '角色id2']
```



### 任务63: 实现elementUI按需要引入,并解决bug

```
下载按需引入打包的置babel插件包: npm install babel-plugin-component -D
配置babel插件: babel.config.js
	"plugins": [
        [
          "component",
          {
            "libraryName": "element-ui",
            "styleLibraryName": "theme-chalk"
          }
        ]
      ],
对elementUI中的组件进行按需引入并注册
	import {Pagination,Dialog, Message } from 'element-ui'
	Vue.use(Pagination)  // <el-pagination>
	Vue.component(Dialog.name, Dialog) // <el-dialog>
	Vue.prototype.$message = Message
	
按需引入的bug: 显示PopConfirm组件的背景是透明的(不是白色)
		原因: 白色背景的样式是PopOver组件提供, 而我们没有对PopOver进行按需引入打包,
				最终就没有它的样式, 那背景就是透明的
		解决: 引入并注册PopOver
	
	
```



### 任务64:  打包项目并使用nginx部署项目

