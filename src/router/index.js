import Vue from 'vue';
import Router from 'vue-router';

import Login from '../views/login';
import Center from '../views/center';
import Distributor from '../views/distributor';
import BrandDetail from '../views/brand/brandDetail';
import Category from '../views/category';
import Product from '../views/product';
import Order from '../views/order';
import Promotion from '../views/promotion';
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
          path: 'category',
          component: Category
        },
        {
          path: 'product',
          component: Product
        },
        {
          path: 'order',
          component: Order
        },
        {
          path: 'promotion',
          component: Promotion
        },
        {
          path: 'resource',
          component: Resource
        }
      ]
    }
    
  ],
});
