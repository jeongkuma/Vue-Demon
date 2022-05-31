let envs = {
  // 해당 프레임워크가 사용될 시스템 이름
  // 특정 타입 템플릿에서 상단에 출력됨
  name: 'IoT통합관제시스템',
  // 위치관제 지도 초기 위도, 경도, 지도 레벨 지정
  // 위도
  gLat: 37.566627,
  // 경도
  gLon: 126.978403,
  // Openlayers 기준 지도 확대 레벨
  gZoomLevel: 8,
  // local 개발환경에서 작업 시, restful mockup 서버 url 정보
  devUrl: '/scp',
  // devUrl: 'http://192.168.50.253:7001/scp',
  // 서버 (개발, 운영) 환경에 build하여 업로드 할 경우, 기본 api base url
  buildUrl: '/scp', // 개발서버(www2)
  // buildUrl: 'http://localhost:8090/ccp', // 개발서버(www2)
  framework: {
    // local 개발환경(development) 에서도 서버의 API를 무조건 사용한다.
    useRestful: true,
    // 빌드된 이후에도 mockup을 사용할 경우 true로 셋팅
    // useRestful 보다 더 상위. useRestfulMockup값이 true여도 이 값이 true 면 무시된다.
    onlyMockup: false,
    // framework에서는 지원하는 locale형식을 작성해야 한다.
    // 이 값을 각 Locale의 ID로 하며, 서버 조회 및 분기를 한다.
    supportLocales: [
      {
        id: 'ko',
        name: '한국어'
      },
      {
        id: 'en',
        name: 'English'
      }
    ],
    // 로딩바 딜레이시간 (Request 후 아래의 시간내에 Response 받으면 로딩바가 보여지지 않는다.)
    loadingDelay: 200, // ms
    // 기본 locale값을 지정한다. default는 Browser 기본이다.
    // 사용자가 직접 변경한 이후 부터는 local에 셋팅값이 저장되어 그 셋팅 값으로만 사용된다. (차후, localStorage로 저장되어 개인화 됨)
    locale: 'ko',
    // 서버에서 i18n 데이터를 가져와 적용할 것인가 설정하는 부분
    // true일 경우 서버를 조회하는 로직이 수행되고, false일 경우 서버를 조회하지 않고 local의 기본 값을 사용한다.
    getI18nDataFromServer: false,
    template: {
      // 테마 사용 시, 사용될 기본 값 (차후, localStorage로 저장되어 개인화 됨)
      pc: 'default',
      mobile: 'default',
      // mobile 테마를 사용할 여부. 사용하지 않으면 PC만 동작한다.
      useMobile: true,
      // 기본 화면으로 사용될 1depth 메뉴 ID
      home: 'dashboard'
    },
    // login 하지 않아도 접근이 가능한 URL 항목 리스트
    whiteList: [
      '/login/loginPage',
      '/404',
      '/pub/mec/b',
      '/pub/mec/a',
      '/pub/mec/p',
      '/sample',
      '/sample/jqgrid',
      '/sample/form',
      '/sample/olmap'
    ],
    // login 상태에서 메뉴 권한이 없어도 접근 가능한 URL 항목 리스트
    whiteListWithLogin: ['/custusr/user/user']
  },
  websocket: {
    url: process.env.VUE_APP_WEBSOCKET_URL
  }
}

export const realtime = {
  accessTokenKey: 'REALTIME_VIDEO_ACCESSTOKEN',
  refreshTokenKey: 'REALTIME_VIDEO_REFRESHTOKEN'
}

export const intelligent = {
  accessTokenKey: 'ITELLIGENT_VIDEO_ACCESSTOKEN',
  refreshTokenKey: 'ITELLIGENT_VIDEO_REFRESHTOKEN'
}

// 기존 api target server
envs.baseUrl = envs.buildUrl
if (process.env.NODE_ENV === 'development') {
  // 개발 환경일 경우 API위치를 셋팅한 곳으로 정의한다.
  envs.baseUrl = envs.devUrl
}

export default envs
