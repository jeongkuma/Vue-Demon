var smartCodeInfo = {}
smartCodeInfo.ko = {} // 한국어
smartCodeInfo.en = {} // 영어

// 연동 서버 관리 - 조회 구분
smartCodeInfo.ko.servMgmtSearchOpt = [
  { optName: '전체', optVal: '' },
  { optName: '서버명', optVal: 'serverNm' },
  { optName: 'URL/IP', optVal: 'urlIp' }
]
smartCodeInfo.en.servMgmtSearchOpt = [
  { optName: '(en)전체', optVal: '' },
  { optName: '(en)서버명', optVal: 'serverNm' },
  { optName: '(en)URL/IP', optVal: 'urlIp' }
]


// 모델 관리 - 조회 구분
smartCodeInfo.ko.mdlMgmtSearchOpt = [
  { optName: '조회 구분', optVal: '' },
  { optName: '모델명', optVal: 'modelNm' },
  { optName: '모델ID', optVal: 'modelId' }
]
smartCodeInfo.en.mdlMgmtSearchOpt = [
  { optName: '(en)조회 구분', optVal: '' },
  { optName: '(en)모델명', optVal: 'mdlNm' },
  { optName: '(en)모델ID', optVal: 'mdlId' }
]

// 모델 관리 - 모델타입 구분
smartCodeInfo.ko.mdlMgmtMdlTypeOpt = [
  { optName: '학습/예측', optVal: '' },
  { optName: '학습', optVal: 'LRN' },
  { optName: '예측', optVal: 'PRD' }
]
smartCodeInfo.en.mdlMgmtMdlTypeOpt = [
  { optName: '(en)학습/예측', optVal: '' },
  { optName: '(en)학습', optVal: 'LRN' },
  { optName: '(en)예측', optVal: 'PRD' }
]

// 모델 관리 - 연동타입 구분
smartCodeInfo.ko.mdlMgmtConTypeOpt = [
  { optName: '테이블/API', optVal: '' },
  { optName: '테이블', optVal: 'TBL' },
  { optName: 'API', optVal: 'API' }
]
smartCodeInfo.en.mdlMgmtConTypeOpt = [
  { optName: '(en)테이블/API', optVal: '' },
  { optName: '(en)테이블', optVal: 'TBL' },
  { optName: '(en)API', optVal: 'API' }
]

// 모델 관리 - 주기 구분
smartCodeInfo.ko.mdlMgmtCycTypeOpt = [
  { optName: '주기/실시간', optVal: '' },
  { optName: '주기', optVal: 'CYL' },
  { optName: '실시간', optVal: 'RTM' }
]
smartCodeInfo.en.mdlMgmtCycTypeOpt = [
  { optName: '(en)주기/실시간', optVal: '' },
  { optName: '(en)주기', optVal: 'CYL' },
  { optName: '(en)실시간', optVal: 'RTM' }
]
// 모델 관리 - 주기 시간 구분
smartCodeInfo.ko.mdlMgmtCycUnitOpt = [
  { optName: '시간 선택', optVal: '' },
  { optName: '일', optVal: 'D' },
  { optName: '시간', optVal: 'H' },
  { optName: '분', optVal: 'M' }
]
smartCodeInfo.en.mdlMgmtCycUnitOpt = [
  { optName: '(en)시간 선택', optVal: '' },
  { optName: '(en)일', optVal: 'D' },
  { optName: '(en)시간', optVal: 'H' },
  { optName: '(en)분', optVal: 'M' }
]
// 모델 관리 - 기간 시간 구분
smartCodeInfo.ko.mdlMgmtPerUnitOpt = [
  { optName: '분/시간/일/최근건', optVal: '' },
  { optName: '분', optVal: 'M' },
  { optName: '시간', optVal: 'H' },
  { optName: '일', optVal: 'D' },
  { optName: '최근건', optVal: 'R' }
]
smartCodeInfo.en.mdlMgmtPerUnitOpt = [
  { optName: '(en)분/시간/일/최근건', optVal: '' },
  { optName: '(en)분', optVal: 'M' },
  { optName: '(en)시간', optVal: 'H' },
  { optName: '(en)일', optVal: 'D' },
  { optName: '(en)최근건', optVal: 'R' }
]
// 모델 관리 - 요청 속성 타입
smartCodeInfo.ko.mdlMgmtReqColTypeOpt = [
  { optName: '요청 속성 타입', optVal: '' },
  { optName: 'STRING', optVal: 'STR' },
  { optName: 'NUMBER', optVal: 'NUM' },
  { optName: 'ARRAY OF STRING', optVal: 'AOS' },
  { optName: 'ARRAY OF NUMBER', optVal: 'AON' }
]
smartCodeInfo.en.mdlMgmtReqColTypeOpt = [
  { optName: '(en)요청 속성 타입', optVal: '' },
  { optName: 'STRING', optVal: 'STR' },
  { optName: 'NUMBER', optVal: 'NUM' },
  { optName: 'ARRAY OF STRING', optVal: 'AOS' },
  { optName: 'ARRAY OF NUMBER', optVal: 'AON' }
]
// 모델 관리 - 결과 속성 타입
smartCodeInfo.ko.mdlMgmtRsltColTypeOpt = [
  { optName: '결과 속성 타입', optVal: '' },
  { optName: 'STRING', optVal: 'STR' },
  { optName: 'NUMBER', optVal: 'NUM' },
  { optName: 'ARRAY OF STRING', optVal: 'AOS' },
  { optName: 'ARRAY OF NUMBER', optVal: 'AON' }
]
smartCodeInfo.en.mdlMgmtRsltColTypeOpt = [
  { optName: '(en)결과 속성 타입', optVal: '' },
  { optName: 'STRING', optVal: 'STR' },
  { optName: 'NUMBER', optVal: 'NUM' },
  { optName: 'ARRAY OF STRING', optVal: 'AOS' },
  { optName: 'ARRAY OF NUMBER', optVal: 'AON' }
]
// 모델 관리 - 결과 수집적용
smartCodeInfo.ko.mdlMgmtColleAplyYNOpt = [
  { optName: '수집적용 Y/N', optVal: '' },
  { optName: '수집적용 Y', optVal: 'Y' },
  { optName: '수집적용 N', optVal: 'N' }
]
smartCodeInfo.en.mdlMgmtColleAplyYNOpt = [
  { optName: '(en)수집적용 Y/N', optVal: '' },
  { optName: '(en)수집적용 Y', optVal: 'Y' },
  { optName: '(en)수집적용 N', optVal: 'N' }
]
// 모델 관리 - 결과 이상징후적용
smartCodeInfo.ko.mdlMgmtAbsyAplyYNOpt = [
  { optName: '이상징후적용 Y/N', optVal: '' },
  { optName: '이상징후적용 Y', optVal: 'Y' },
  { optName: '이상징후적용 N', optVal: 'N' }
]
smartCodeInfo.en.mdlMgmtAbsyAplyYNOpt = [
  { optName: '(en)이상징후적용 Y/N', optVal: '' },
  { optName: '(en)이상징후적용 Y', optVal: 'Y' },
  { optName: '(en)이상징후적용 N', optVal: 'N' }
]
// 모델 관리 - 서버 선택
smartCodeInfo.ko.mdlMgmtServerOpt = [
  { optName: '서버 선택', optVal: '' }
]
smartCodeInfo.en.mdlMgmtServerOpt = [
  { optName: '(en)서버 선택', optVal: '' }
]


// 모델 매핑 관리 - 장비유형 타이틀
smartCodeInfo.ko.mdlMapMgmtSearchMdlOpt = [
  { optName: '장비 유형', optVal: '' }
]
smartCodeInfo.en.mdlMapMgmtSearchMdlOpt = [
  { optName: '(en)장비 유형', optVal: '' }
]
// 모델 매핑 관리 - 조회 구분
smartCodeInfo.ko.mdlMapMgmtSearchOpt = [
  { optName: '조회 구분', optVal: '' },
  { optName: '장비 모델명', optVal: 'devMdlNm' },
  { optName: '학습/예측 모델명', optVal: 'learPreMdlNm' }
]
smartCodeInfo.en.mdlMapMgmtSearchOpt = [
  { optName: '(en)조회 구분', optVal: '' },
  { optName: '(en)장비 모델명', optVal: 'devMdlNm' },
  { optName: '(en)학습/예측 모델명', optVal: 'learPreMdlNm' }
]
// 모델 매핑 관리 - 팝업, 삭제구분
smartCodeInfo.ko.mdlMapMgmtDelTypeOpt = [
  { optName: '학습+예측 모델', optVal: '3' },
  { optName: '학습 모델', optVal: '1' },
  { optName: '예측 모델', optVal: '2' }
]
smartCodeInfo.en.mdlMapMgmtDelTypeOpt = [
  { optName: '(en)학습+예측 모델', optVal: '3' },
  { optName: '(en)학습 모델', optVal: '1' },
  { optName: '(en)예측 모델', optVal: '2' }
]
// 모델 매핑 관리 - 모델 구분
smartCodeInfo.ko.mdlMapMgmtMdlTypeOpt = [
  { optName: '학습', optVal: 'learn' },
  { optName: '예측', optVal: 'pred' }
]
smartCodeInfo.en.mdlMapMgmtMdlTypeOpt = [
  { optName: '(en)학습', optVal: 'learn' },
  { optName: '(en)예측', optVal: 'pred' }
]
// 모델 매핑 관리 - 모델 타이틀
smartCodeInfo.ko.mdlMapMgmtDevMdlTypeOpt = [
  { optName: '선택', optVal: '' }
]
smartCodeInfo.en.mdlMapMgmtDevMdlTypeOpt = [
  { optName: '(en)선택', optVal: '' }
]
// 모델 매핑 관리 - 장비모델 선택
smartCodeInfo.ko.mdlMapMgmtDevMdlOpt = [
  { optName: '장비모델 선택', optVal: '' }
]
smartCodeInfo.en.mdlMapMgmtDevMdlOpt = [
  { optName: '(en)장비모델 선택', optVal: '' }
]


// 요청 이력 관리 - 조회 구분
smartCodeInfo.ko.reqMgmtSearchOpt = [
  { optName: '조회 구분', optVal: '' },
  { optName: '학습/예측 모델명', optVal: 'mdlNm' },
  { optName: '학습/예측 서버명', optVal: 'servNm' },
  { optName: '장비UUID', optVal: 'devUuid' }
]
smartCodeInfo.en.reqMgmtSearchOpt = [
  { optName: '(en)조회 구분', optVal: '' },
  { optName: '(en)학습/예측 모델명', optVal: 'mdlNm' },
  { optName: '(en)학습/예측 서버명', optVal: 'servNm' },
  { optName: '(en)장비UUID', optVal: 'devUuid' }
]
// 요청 이력 관리 - 조회 날짜 구분
smartCodeInfo.ko.reqMgmtSearchOpt2 = [
  { optName: '날짜 구분', optVal: '' },
  { optName: '요청일시', optVal: 'reqDt' },
  { optName: '응답일시', optVal: 'resDt' }
]
smartCodeInfo.en.reqMgmtSearchOpt2 = [
  { optName: '(en)날짜 구분', optVal: '' },
  { optName: '(en)요청일시', optVal: 'reqDt' },
  { optName: '(en)응답일시', optVal: 'resDt' }
]
