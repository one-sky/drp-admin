import Vue from 'vue';
import Router from 'vue-router';

import Login from '../views/login';
import Center from '../views/center';
import Distributor from '../views/distributor';
import BrandDetail from '../views/brand/brandDetail';
import AgentBrand from '../views/brand/agentBrand';
import CategoryList from '../views/category/categoryList';
import AttrList from '../views/category/attrList';
import Product from '../views/product/product';
import SkuList from '../views/product/skuList';
import OrderList from '../views/order/orderList';
import Promotion from '../views/promotion/promotion';
import UpdatePromotion from '../views/promotion/update';
import ProductPromotion from '../views/promotion/product';
import Resource from '../views/resource';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      component: Login,
    },

    {
      path: '/center',
      component: Center,
      children: [
        {
          path: 'distributor',
          component: Distributor
        },
        {
          path: 'brandDetail',
          component: BrandDetail
        },
        {
          path: 'agentBrand',
          component: AgentBrand
        },
        {
          path: 'categoryList',
          component: CategoryList
        },
        {
          path: 'attrList',
          component: AttrList
        },
        {
          path: 'product',
          component: Product
        },
        {
          path: 'skuList',
          component: SkuList
        },
        {
          path: 'orderList',
          component: OrderList
        },
        {
          path: 'promotion/index',
          component: Promotion
        },
        {
          path: 'promotion/update',
          component: UpdatePromotion
        },
        {
          path: 'promotion/product',
          component: ProductPromotion
        },
        {
          path: 'resource',
          component: Resource
        }
      ]
    }
    
  ],
});
