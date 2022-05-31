import Vue from 'vue'
import Router from 'vue-router'
import RouterSection from '@/Layout/components/RouterSection'

// 내부 router들 정의
// 게시판 라우터 정의
import sampleList from './modules/sampleList'

// Dashboard 라우터
import dashboardRouter from './modules/dashboardRouter'

// 위치관제 라우터
import locationRouter from './modules/locationRouter'

// 게시판 라우터 정의
import boardRouter from './modules/boardRouter'

// 설비관리 라우터 정의
import equipmentRouter from './modules/equipmentRouter'

// 이상징후 라우터 정의
import detectionRouter from './modules/detectionRouter'

// 현황 및 통계 라우터 정의
import reportRouter from './modules/reportRouter'

// 환경 설정 라우터 정의
import custusrRouter from './modules/custusrRouter'

// 관리 라우터 정의
import manageRouter from './modules/manageRouter'

// 외부서버전문설정 라우터 정의
import outsvrmsgRouter from './modules/outsvrmsgRouter'

// 환경 설정 라우터 정의
import configRouter from './modules/configRouter'

import loginRouter from './modules/loginRouter'

// 외부 서버 연동 리포트 라우터 정의
import outsvrRouter from './modules/outsvrRouter'

import intrnsvrRouter from './modules/intrnsvrRouter'

// 지능화모듈 라우터
import smartRouter from './modules/smartRouter'

// 솔루션관리 라우터 정의
import solSvrRouter from './modules/solsvrRouter'

// 솔루션버전문설정 라우터 정의
import solsvrmsgRouter from './modules/solsvrmsgRouter'

// 영상플랫폼관리 라우터 정의
import vpRouter from './modules/vpRouter'

// 퍼블리싱 라우터 정의
import pubRouter from './modules/pubRouter'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: RouterSection,
      redirect: '/dashboard',
      // redirect: { name: home },
      children: [
        {
          path: '404',
          name: 'NotFound',
          component: () => import('@/views/NotFound.vue')
        },
        {
          path: 'blank',
          name: 'blank',
          component: () => import('@/views/Blank.vue')
        }
      ]
    },
    sampleList,
    dashboardRouter,
    locationRouter,
    equipmentRouter,
    detectionRouter,
    reportRouter,
    boardRouter,
    custusrRouter,
    configRouter,
    loginRouter,
    manageRouter,
    outsvrmsgRouter,
    outsvrRouter,
    intrnsvrRouter,
    smartRouter,
    solSvrRouter,
    solsvrmsgRouter,
    vpRouter,
    pubRouter
  ]
})

export default router
