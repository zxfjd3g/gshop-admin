/* 
包含 3类路由的模块
1. 常量路由的数组: 常量路由不需要权限判断, 未登陆或登陆的任意用户都可以看到 ==> 初始化时路由器静态注册
2. 所有异步路由的数组: 用户登陆后根据得到的权限数据从中过滤得到自己的权限路由的数组 ==> 由路由器动态添加注册
3. 任意路由: 用于匹配任意与常量和异步路由都不匹配的路由跳转, 自动重定向到404路由页面 ==> 只能在最后注册
*/

import Layout from '@/layout'

// 权限管理
// const User = () => import('@/views/acl/user/list')
// const Role = () => import('@/views/acl/role/list')
// const RoleAuth = () => import('@/views/acl/role/roleAuth')
// const Permission = () => import('@/views/acl/permission/list')

// 商品管理
const Category = () => import('@/views/product/category/list')
const Attr = () => import('@/views/product/attr/list')
const Trademark = () => import('@/views/product/trademark/list')
const Spu = () => import('@/views/product/spu/list')
const Sku = () => import('@/views/product/sku/list')

// 优惠管理
const Activity = () => import('@/views/discount/activity/list')
const ActivityForm = () => import('@/views/discount/activity/form')
const ActivityRule = () => import('@/views/discount/activity/rule')
const Coupon = () => import('@/views/discount/coupon/list')
const CouponForm = () => import('@/views/discount/coupon/form')
const CouponRule = () => import('@/views/discount/coupon/rule')

// 订单管理
const Order = () => import('@/views/order/orderInfo/list')
const OrderShow = () => import('@/views/order/orderInfo/show')
const Refund = () => import('@/views/order/refund/list')

// 客户管理
const ClientUser = () => import('@/views/clientUser')

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/* 
常量路由
包括登陆/404/首页
*/
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard'),
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  },
]

/* 所有异步路由 */
export const allAsyncRoutes = [
 
  /* 权限管理 */
  {
    name: 'Acl',
    path: '/acl',
    component: Layout,
    redirect: '/acl/user/list',
    meta: { 
      title: '权限管理', 
      icon: 'el-icon-lock' 
    },
    children: [
      {
        name: 'User',
        path: 'user/list',
        component: () => import('@/views/acl/user/list'),
        meta: { 
          title: '用户管理', 
        },
      },
      {
        name: 'Role',
        path: 'role/list',
        component: () => import('@/views/acl/role/list'),
        meta: { 
          title: '角色管理', 
        },
      },
      {
        name: 'RoleAuth',
        path: 'role/auth/:id',
        component: () => import('@/views/acl/role/roleAuth'),
        meta: {
          activeMenu: '/acl/role/list',
          title: '角色授权',
        },
        hidden: true,
      },
      {
        name: 'Permission',
        path: 'permission/list',
        component: () => import('@/views/acl/permission/list'),
        meta: { 
          title: '菜单管理',
        },
      },
    ]
  },

  /* 商品管理 */
  {
    name: 'Product',  // Goods
    path: '/product',
    component: Layout,
    redirect: '/product/category/list',
    meta: { 
      title: '商品管理', 
      icon: 'shop' 
    },
    children: [
      {
        name: 'Category',
        path: 'category/list',
        component: Category,
        meta: { 
          title: '分类管理', 
        },
      },
      {
        name: 'Trademark',
        path: 'trademark/list',
        component: Trademark,
        meta: { 
          title: '品牌管理', 
        },
      },
      {
        name: 'Attr',
        path: 'attr/list',
        component: Attr,
        meta: { 
          title: '平台属性管理', 
        },
      },
      {
        name: 'Spu',
        path: 'spu/list',
        component: Spu,
        meta: { 
          title: 'SPU管理', 
        },
      },
      {
        name: 'Sku',
        path: 'sku/list',
        component: Sku,
        meta: { 
          title: 'SKU管理', 
        },
      }
    ]
  },

  /* 优惠管理 */
  {
    name: 'Discount',
    path: '/discount',
    component: Layout,
    redirect: '/discount/activity/list',
    meta: { 
      title: '优惠管理', 
      icon: 'star' 
    },
    children: [
      /* 优惠活动 */
      {
        name: 'Activity',
        path: 'activity/list',
        component: Activity,
        meta: { 
          title: '优惠活动管理', 
        },
      },
      {
        path: 'activity/add',
        name: 'ActivityAdd',
        component: ActivityForm,
        meta: { 
          title: '添加活动', 
          activeMenu: '/discount/activity/list',
        },
        hidden: true, // 不显示在菜单中
      },

      {
        path: 'activity/edit/:id',
        name: 'ActivityEdit',
        component: ActivityForm,
        meta: {
          title: '修改活动', 
          activeMenu: '/discount/activity/list',
        },
        hidden: true, // 不显示在菜单中
      },

      {
        path: 'activity/rule/:id',
        name: 'ActivityRule',
        component: ActivityRule,
        meta: {
          title: '活动规则',
          activeMenu: '/discount/activity/list',
        },
        hidden: true, // 不显示在菜单中
      },

      /* 优惠券 */
      {
        name: 'Coupon',
        path: 'coupon/list',
        component: Coupon,
        meta: { 
          title: '优惠券管理', 
        },
      },

      {
        path: 'coupon/add',
        name: 'CouponAdd',
        component: CouponForm,
        meta: { 
          title: '添加优惠券', 
          activeMenu: '/discount/coupon/list',
        },
        hidden: true, // 不显示在菜单中
      },

      {
        path: 'coupon/edit/:id',
        name: 'CouponEdit',
        component: CouponForm,
        meta: {
          title: '修改优惠券',
          activeMenu: '/discount/coupon/list',
        },
        hidden: true, // 不显示在菜单中
      },

      {
        path: 'coupon/rule/:id',
        name: 'CouponRule',
        component: CouponRule,
        meta: {
          title: '优惠券规则',
          activeMenu: '/discount/coupon/list',
        },
        hidden: true, // 不显示在菜单中
      },
    ]
  },
  
  /* 订单管理 */
  {
    name: 'Order',
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    meta: { 
      title: '订单管理', 
      icon: 'el-icon-s-order' 
    },
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: Order,
        meta: { 
          title: '订单列表', 
        },
      },
      {
        path: 'show/:id',
        name: 'OrderShow',
        component: OrderShow,
        meta: { 
          title: '订单详情', 
          activeMenu: '/order/list',
        },
        hidden: true, // 不显示在菜单中
      },
      {
        path: 'refund',
        name: 'Refund',
        component: Refund,
        meta: { 
          title: '退款管理', 
        },
      },
    ]
  },

  /* 客户管理 */
  {
    name: 'ClientUser',
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: ClientUser,
        meta: {
          title: '客户管理', 
          icon: 'qq'
        },
      },
    ]
  },
]

/* 匹配任意的路由 必须最后注册 */
export const anyRoute = { path: '*', redirect: '/404', hidden: true }
