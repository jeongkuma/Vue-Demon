const data = [
  {
    title: '장비 이상 현황 - 장비 유형별',
    componentType: 'TableChart',
    search: [{ TYPE: 'ORG', OPTION: '', KEY: 'orgSeq' }],
    option: [],
    form: [
      { TITLE: '장비유형', COLUMN_VALUE: 'devClsCdNm', WIDTH: '' },
      { TITLE: '이상', COLUMN_VALUE: 'DS4', WIDTH: '' },
      { TITLE: '주의', COLUMN_VALUE: 'DS5', WIDTH: '' },
      { TITLE: '경미', COLUMN_VALUE: 'DS6', WIDTH: '' }
    ],
    data: [
      { devClsCdNm: '취수펌프', DS4: 2, DS5: 5, DS6: 4 },
      { devClsCdNm: '배출펌프', DS4: 0, DS5: 2, DS6: 1 }
    ],
    w: 1,
    h: 1,
    x: 0,
    y: 0,
    i: 1
  },
  {
    title: '장비 이상 현황 - 전체',
    componentType: 'PieDatasetChart',
    search: [{ TYPE: 'ORG', OPTION: '', KEY: 'orgSeq' }],
    option: [],
    form: [
      { TITLE: '이상', COLUMN_VALUE: 'DS4' },
      { TITLE: '주의', COLUMN_VALUE: 'DS5' },
      { TITLE: '경미', COLUMN_VALUE: 'DS6' }
    ],
    data: {
      DS4: 6,
      DS5: 8,
      DS6: 10
    },
    w: 1,
    h: 1,
    x: 1,
    y: 0,
    i: 2
  },
  {
    title: '장비 이상 현황 - 장비 모델별',
    componentType: 'TableChart',
    search: [{ TYPE: 'ORG', OPTION: '', KEY: 'orgSeq' }],
    option: [],
    form: [
      { TITLE: '장비유형', COLUMN_VALUE: 'devClsCdNm', WIDTH: '80' },
      { TITLE: '장비모델', COLUMN_VALUE: 'devMdlNm', WIDTH: '100' },
      { TITLE: '이상', COLUMN_VALUE: 'DS4', WIDTH: '' },
      { TITLE: '주의', COLUMN_VALUE: 'DS5', WIDTH: '' },
      { TITLE: '경미', COLUMN_VALUE: 'DS6', WIDTH: '' }
    ],
    data: [
      {
        devClsCdNm: '취수펌프',
        devMdlNm: '취수_베어링1',
        DS4: 0,
        DS5: 1,
        DS6: 0
      },
      {
        devClsCdNm: '취수펌프',
        devMdlNm: '취수_베어링1',
        DS4: 1,
        DS5: 0,
        DS6: 0
      },
      {
        devClsCdNm: '취수펌프',
        devMdlNm: '취수_베어링1',
        DS4: 0,
        DS5: 0,
        DS6: 1
      },
      {
        devClsCdNm: '취수펌프',
        devMdlNm: '취수_베어링1',
        DS4: 0,
        DS5: 1,
        DS6: 0
      },
      { devClsCdNm: '취수펌프', devMdlNm: '취수_모터', DS4: 0, DS5: 0, DS6: 0 },
      {
        devClsCdNm: '배출펌프',
        devMdlNm: '배출_베어링1',
        DS4: 0,
        DS5: 0,
        DS6: 0
      },
      {
        devClsCdNm: '배출펌프',
        devMdlNm: '배출_베어링2',
        DS4: 0,
        DS5: 0,
        DS6: 0
      },
      {
        devClsCdNm: '배출펌프',
        devMdlNm: '배출_베어링3',
        DS4: 0,
        DS5: 0,
        DS6: 0
      },
      {
        devClsCdNm: '배출펌프',
        devMdlNm: '배출_베어링4',
        DS4: 0,
        DS5: 0,
        DS6: 0
      },
      { devClsCdNm: '배출펌프', devMdlNm: '배출_모터', DS4: 0, DS5: 0, DS6: 0 }
    ],
    w: 1,
    h: 1,
    x: 2,
    y: 0,
    i: 3
  },
  {
    title: '장비 이상 현황 - 장비 진단항목별',
    componentType: 'TableChart',
    search: [{ TYPE: 'ORG', OPTION: '', KEY: 'orgSeq' }],
    option: [],
    form: [
      { TITLE: '장비모델', COLUMN_VALUE: 'devMdlNm', WIDTH: '100' },
      { TITLE: '식별명', COLUMN_VALUE: 'devUname', WIDTH: '180' },
      { TITLE: '진단항목', COLUMN_VALUE: 'attb', WIDTH: '100' },
      { TITLE: '이상', COLUMN_VALUE: 'DS4', WIDTH: '50' },
      { TITLE: '주의', COLUMN_VALUE: 'DS5', WIDTH: '50' },
      { TITLE: '경미', COLUMN_VALUE: 'DS6', WIDTH: '50' }
    ],
    data: [
      {
        devMdlNm: '취수_베어링1',
        devUname: '취수_베어링1_진동센서',
        attb: '진동값',
        DS4: 0,
        DS5: 1,
        DS6: 0
      },
      {
        devMdlNm: '취수_베어링1',
        devUname: '취수_베어링1_진동센서',
        attb: '내륜_건전성',
        DS4: 0,
        DS5: 0,
        DS6: 1
      },
      {
        devMdlNm: '취수_베어링1',
        devUname: '취수_베어링1_진동센서',
        attb: '외륜_건전성',
        DS4: 0,
        DS5: 0,
        DS6: 0
      },
      {
        devMdlNm: '취수_베어링1',
        devUname: '취수_베어링1_진동센서',
        attb: '볼_건전성',
        DS4: 0,
        DS5: 1,
        DS6: 0
      },
      {
        devMdlNm: '취수_베어링1',
        devUname: '취수_베어링1_진동센서',
        attb: '전반적_건전성',
        DS4: 0,
        DS5: 0,
        DS6: 0
      },
      {
        devMdlNm: '취수_베어링2',
        devUname: '취수_베어링2_진동센서',
        attb: '진동값',
        DS4: 0,
        DS5: 1,
        DS6: 0
      },
      {
        devMdlNm: '취수_베어링2',
        devUname: '취수_베어링2_진동센서',
        attb: '내륜_건전성',
        DS4: 0,
        DS5: 0,
        DS6: 1
      },
      {
        devMdlNm: '취수_베어링2',
        devUname: '취수_베어링2_진동센서',
        attb: '외륜_건전성',
        DS4: 0,
        DS5: 0,
        DS6: 0
      },
      {
        devMdlNm: '취수_베어링2',
        devUname: '취수_베어링2_진동센서',
        attb: '볼_건전성',
        DS4: 0,
        DS5: 1,
        DS6: 0
      },
      {
        devMdlNm: '취수_베어링2',
        devUname: '취수_베어링2_진동센서',
        attb: '전반적_건전성',
        DS4: 0,
        DS5: 0,
        DS6: 0
      }
    ],
    w: 1,
    h: 1,
    x: 3,
    y: 0,
    i: 4
  },
  {
    title: '장비 이상 현황 - 펌프 이상 현황',
    componentType: 'PumpDetStatus',
    search: [{ TYPE: 'ORG', OPTION: '', KEY: 'orgSeq' }],
    option: [],
    form: [],
    data: [],
    w: 1,
    h: 1,
    x: 0,
    y: 1,
    i: 5
  },
  {
    title: '장비 이상 현황 - 최신 알람 이력',
    componentType: 'TableChart',
    search: [{ TYPE: 'ORG', OPTION: '', KEY: 'orgSeq' }],
    option: [],
    form: [
      { TITLE: '알람 시기', COLUMN_VALUE: 'date', WIDTH: '90' },
      { TITLE: '식별명', COLUMN_VALUE: 'name', WIDTH: '180' },
      { TITLE: '진단항목', COLUMN_VALUE: 'attb', WIDTH: '120' },
      { TITLE: '상태', COLUMN_VALUE: 'sts', WIDTH: '50' },
      { TITLE: '값', COLUMN_VALUE: 'val', WIDTH: '50' }
    ],
    data: [
      {
        date: '2021.06.30 12:15:12',
        name: '취수펌프_모터_전류센서1',
        attb: '전반적_건전성',
        sts: '주의',
        val: '0.5'
      },
      {
        date: '2021.06.30 12:14:13',
        name: '취수펌프_모터_전류센서1',
        attb: '전반적_건전성',
        sts: '주의',
        val: '0.5'
      },
      {
        date: '2021.06.30 12:12:17',
        name: '취수펌프_모터_전류센서1',
        attb: '전반적_건전성',
        sts: '주의',
        val: '0.5'
      },
      {
        date: '2021.06.30 12:02:12',
        name: '취수펌프_모터_전류센서1',
        attb: '전반적_건전성',
        sts: '주의',
        val: '0.5'
      },
      {
        date: '2021.06.30 12:01:12',
        name: '취수펌프_모터_전류센서1',
        attb: '전반적_건전성',
        sts: '주의',
        val: '0.5'
      }
    ],
    w: 1,
    h: 1,
    x: 1,
    y: 1,
    i: 6
  },
  {
    title: '장비 이상 현황 - 장비 상세 정보',
    componentType: 'RowTableChart',
    search: [{ TYPE: 'CTN', OPTION: '', KEY: 'ctn' }],
    option: [],
    form: [
      { TITLE: '진단시간', COLUMN_VALUE: 'a' },
      { TITLE: '운행여부', COLUMN_VALUE: 'b' },
      { TITLE: '진동값', COLUMN_VALUE: 'c' },
      { TITLE: '잔존수명', COLUMN_VALUE: 'd' },
      { TITLE: '내륜_건전성', COLUMN_VALUE: 'e' },
      { TITLE: '외륜_건전성', COLUMN_VALUE: 'f' },
      { TITLE: '볼_건전성', COLUMN_VALUE: 'g' },
      { TITLE: '전반적_건전성', COLUMN_VALUE: 'h' }
    ],
    data: {
      a: '2021.06.30 12:13:14',
      b: 'True',
      c: '0.1234',
      d: '20d 15h',
      e: '0.12',
      f: '0.22',
      g: '0.22',
      h: '0.33'
    },
    w: 1,
    h: 1,
    x: 2,
    y: 1,
    i: 7
  },
  {
    title: '장비 이상 현황 - 장비 상세 정보',
    componentType: 'RowTableChart',
    search: [{ TYPE: 'ORG', OPTION: '', KEY: 'orgSeq' }],
    option: [],
    form: [
      { TITLE: '진단시간', COLUMN_VALUE: 'a' },
      { TITLE: '운행여부', COLUMN_VALUE: 'b' },
      { TITLE: 'RMS_U', COLUMN_VALUE: 'c' },
      { TITLE: 'RMS_V', COLUMN_VALUE: 'd' },
      { TITLE: 'RMS_W', COLUMN_VALUE: 'e' },
      { TITLE: 'THD_U', COLUMN_VALUE: 'f' },
      { TITLE: 'THD_V', COLUMN_VALUE: 'g' },
      { TITLE: 'THD_W', COLUMN_VALUE: 'h' }
    ],
    data: {
      a: '2021.06.30 12:13:14',
      b: 'True',
      c: '0.32',
      d: '0.26',
      e: '0.17',
      f: '0.51',
      g: '0.48',
      h: '0.23'
    },
    w: 1,
    h: 1,
    x: 3,
    y: 1,
    i: 8
  },
  {
    title: '장비 이상 현황 - 장비 모델별',
    componentType: 'TableChart',
    search: [{ TYPE: 'ORG', OPTION: '', KEY: 'orgSeq' }],
    option: [],
    form: [
      { TITLE: '식별명', COLUMN_VALUE: 'a', WIDTH: '200' },
      { TITLE: '전반적 건전성', COLUMN_VALUE: 'b', WIDTH: '' },
      { TITLE: '기계적 건전성', COLUMN_VALUE: 'c', WIDTH: '' },
      { TITLE: '전기적 건전성', COLUMN_VALUE: 'd', WIDTH: '' },
      { TITLE: 'RMS_U', COLUMN_VALUE: 'e', WIDTH: '' },
      { TITLE: 'RMS_V', COLUMN_VALUE: 'f', WIDTH: '' },
      { TITLE: 'RMS_W', COLUMN_VALUE: 'g', WIDTH: '' },
      { TITLE: 'THD_U', COLUMN_VALUE: 'h', WIDTH: '' },
      { TITLE: 'THD_V', COLUMN_VALUE: 'i', WIDTH: '' },
      { TITLE: 'THD_W', COLUMN_VALUE: 'j', WIDTH: '' },
      { TITLE: '전류 불평행율', COLUMN_VALUE: 'k', WIDTH: '' }
    ],
    data: [
      {
        a: '취수펌프_모터_전류센서1',
        b: '0.8',
        c: '0.32',
        d: '0.26',
        e: '0.17',
        f: '0.51',
        g: '0.48',
        h: '0.23',
        i: '0.51',
        j: '0.48',
        k: '0.23'
      },
      {
        a: '취수펌프_모터_전류센서2',
        b: '0.1',
        c: '0.05',
        d: '0.05',
        e: '0.1',
        f: '0.1',
        g: '0.05',
        h: '0.05',
        i: '0.1',
        j: '0.1',
        k: '0.1'
      }
    ],
    w: 2,
    h: 1,
    x: 0,
    y: 2,
    i: 9
  },
  {
    title: '장비 이상 현황 - 장비 모델별',
    componentType: 'TableChart',
    search: [{ TYPE: 'ORG', OPTION: '', KEY: 'orgSeq' }],
    option: [],
    form: [
      { TITLE: '식별명', COLUMN_VALUE: 'a', WIDTH: '200' },
      { TITLE: '잔존수명', COLUMN_VALUE: 'b', WIDTH: '' },
      { TITLE: '진동값', COLUMN_VALUE: 'c', WIDTH: '' },
      { TITLE: '전반적 건전성', COLUMN_VALUE: 'd', WIDTH: '65' },
      { TITLE: '내륜', COLUMN_VALUE: 'e', WIDTH: '' },
      { TITLE: '외륜', COLUMN_VALUE: 'f', WIDTH: '' },
      { TITLE: '볼', COLUMN_VALUE: 'g', WIDTH: '' },
      { TITLE: '언밸런스', COLUMN_VALUE: 'h', WIDTH: '' },
      { TITLE: '축', COLUMN_VALUE: 'i', WIDTH: '' }
    ],
    data: [
      {
        a: '취수펌프_베어링1_전류센서1',
        b: '20d 15h',
        c: '0.4',
        d: '0.6',
        e: '0.3',
        f: '0.1',
        g: '0.1',
        h: '0.1',
        i: '0'
      },
      {
        a: '취수펌프_베어링2_전류센서2',
        b: '-',
        c: '0.1',
        d: '0.6',
        e: '0.3',
        f: '0.1',
        g: '0.1',
        h: '0.1',
        i: '0'
      },
      {
        a: '취수펌프_베어링3_전류센서3',
        b: '-',
        c: '0.1',
        d: '0.6',
        e: '0.3',
        f: '0.1',
        g: '0.1',
        h: '0.1',
        i: '0'
      },
      {
        a: '취수펌프_베어링4_전류센서4',
        b: '-',
        c: '0.1',
        d: '0.6',
        e: '0.3',
        f: '0.1',
        g: '0.1',
        h: '0.1',
        i: '0'
      },
      {
        a: '취수펌프_베어링1_전류센서5',
        b: '-',
        c: '0.1',
        d: '0.6',
        e: '0.3',
        f: '0.1',
        g: '0.1',
        h: '0.1',
        i: '0'
      },
      {
        a: '취수펌프_베어링2_전류센서6',
        b: '-',
        c: '0.1',
        d: '0.6',
        e: '0.3',
        f: '0.1',
        g: '0.1',
        h: '0.1',
        i: '0'
      }
    ],
    w: 2,
    h: 1,
    x: 0,
    y: 3,
    i: 10
  },
  {
    title: '장비 상세 정보',
    componentType: 'TableChart',
    search: [{ TYPE: 'CTN', OPTION: '', KEY: 'ctn' }],
    option: [],
    form: [
      { TITLE: '장비모델', COLUMN_VALUE: 'a', WIDTH: '' },
      { TITLE: '식별명', COLUMN_VALUE: 'b', WIDTH: '200' },
      { TITLE: '항목', COLUMN_VALUE: 'c', WIDTH: '' },
      { TITLE: '값', COLUMN_VALUE: 'd', WIDTH: '' }
    ],
    data: [
      {
        a: '취수_베어링1',
        b: '취수_베어링1_진동센서1',
        c: '진단시간',
        d: '2021-06-30'
      },
      {
        a: '취수_베어링1',
        b: '취수_베어링1_진동센서1',
        c: '운행여부',
        d: 'True'
      },
      {
        a: '취수_베어링1',
        b: '취수_베어링1_진동센서1',
        c: '진동값',
        d: '0.1234'
      },
      {
        a: '취수_베어링1',
        b: '취수_베어링1_진동센서1',
        c: '잔존수명',
        d: '20d 15h'
      },
      {
        a: '취수_베어링1',
        b: '취수_베어링1_진동센서1',
        c: '내륜_건전성',
        d: '0.12'
      },
      {
        a: '취수_베어링1',
        b: '취수_베어링1_진동센서1',
        c: '외륜_건전성',
        d: '0.22'
      },
      {
        a: '취수_베어링1',
        b: '취수_베어링1_진동센서1',
        c: '볼_건전성',
        d: '0.22'
      },
      {
        a: '취수_베어링1',
        b: '취수_베어링1_진동센서1',
        c: '전반적_건전성',
        d: '0.33'
      },
      {
        a: '취수_베어링2',
        b: '취수_베어링2_진동센서2',
        c: '진단시간',
        d: '2021-06-30'
      },
      {
        a: '취수_베어링2',
        b: '취수_베어링2_진동센서2',
        c: '운행여부',
        d: 'True'
      },
      {
        a: '취수_베어링2',
        b: '취수_베어링2_진동센서2',
        c: '진동값',
        d: '0.1234'
      },
      {
        a: '취수_베어링2',
        b: '취수_베어링2_진동센서2',
        c: '잔존수명',
        d: '20d 15h'
      },
      {
        a: '취수_베어링2',
        b: '취수_베어링2_진동센서2',
        c: '내륜_건전성',
        d: '0.12'
      },
      {
        a: '취수_베어링2',
        b: '취수_베어링2_진동센서2',
        c: '외륜_건전성',
        d: '0.22'
      },
      {
        a: '취수_베어링2',
        b: '취수_베어링2_진동센서2',
        c: '볼_건전성',
        d: '0.22'
      },
      {
        a: '취수_베어링2',
        b: '취수_베어링2_진동센서2',
        c: '전반적_건전성',
        d: '0.33'
      }
    ],
    w: 2,
    h: 2,
    x: 2,
    y: 2,
    i: 11
  },
  {
    title: '진동량 추이',
    componentType: 'DynamicLineChart',
    search: [{ TYPE: 'CTN', OPTION: '', KEY: 'ctn' }],
    option: [],
    form: [
      { TITLE: '임계치', X_AXIS: 'date', Y_AXIS: 'l' },
      { TITLE: '진동량', X_AXIS: 'date', Y_AXIS: 'a' }
    ],
    data: [
      { date: '2021-07-30 12:03:14', l: '0.5', a: '0.12' },
      { date: '2021-07-30 12:13:14', l: '0.5', a: '0.22' },
      { date: '2021-07-30 12:23:14', l: '0.5', a: '0.27' },
      { date: '2021-07-30 12:33:14', l: '0.5', a: '0.3' },
      { date: '2021-07-30 12:43:14', l: '0.5', a: '0.27' },
      { date: '2021-07-30 12:53:14', l: '0.5', a: '0.3' }
    ],
    w: 1,
    h: 1,
    x: 0,
    y: 4,
    i: 12
  },
  {
    title: '건정성 추이',
    componentType: 'DynamicLineChart',
    search: [{ TYPE: 'CTN', OPTION: '', KEY: 'ctn' }],
    option: [],
    form: [
      { TITLE: '임계치', X_AXIS: 'date', Y_AXIS: 'l' },
      { TITLE: '건전성', X_AXIS: 'date', Y_AXIS: 'a' }
    ],
    data: [
      { date: '2021-07-30 12:03:14', l: '0.5', a: '0.12' },
      { date: '2021-07-30 12:13:14', l: '0.5', a: '0.22' },
      { date: '2021-07-30 12:23:14', l: '0.5', a: '0.27' },
      { date: '2021-07-30 12:33:14', l: '0.5', a: '0.32' },
      { date: '2021-07-30 12:43:14', l: '0.5', a: '0.30' },
      { date: '2021-07-30 12:53:14', l: '0.5', a: '0.27' }
    ],
    w: 1,
    h: 1,
    x: 1,
    y: 4,
    i: 13
  },
  {
    title: '전류 RMS 추이',
    componentType: 'DynamicLineChart',
    search: [{ TYPE: 'CTN', OPTION: '', KEY: 'ctn' }],
    option: [],
    form: [
      { TITLE: '임계치', X_AXIS: 'date', Y_AXIS: 'l' },
      { TITLE: 'RMS_U', X_AXIS: 'date', Y_AXIS: 'a' },
      { TITLE: 'RMS_V', X_AXIS: 'date', Y_AXIS: 'b' },
      { TITLE: 'RMS_W', X_AXIS: 'date', Y_AXIS: 'c' }
    ],
    data: [
      { date: '2021-07-30 12:03:14', l: '0.5', a: '0.12', b: '0.1', c: '0.2' },
      { date: '2021-07-30 12:13:14', l: '0.5', a: '0.22', b: '0.05', c: '0.3' },
      {
        date: '2021-07-30 12:23:14',
        l: '0.5',
        a: '0.27',
        b: '0.06',
        c: '0.25'
      },
      {
        date: '2021-07-30 12:33:14',
        l: '0.5',
        a: '0.32',
        b: '0.08',
        c: '0.31'
      },
      { date: '2021-07-30 12:43:14', l: '0.5', a: '0.30', b: '0.1', c: '0.23' },
      { date: '2021-07-30 12:53:14', l: '0.5', a: '0.27', b: '0.08', c: '0.2' }
    ],
    w: 1,
    h: 1,
    x: 2,
    y: 4,
    i: 14
  },
  {
    title: '전류 THD 추이',
    componentType: 'DynamicLineChart',
    search: [{ TYPE: 'CTN', OPTION: '', KEY: 'ctn' }],
    option: [],
    form: [
      { TITLE: '임계치', X_AXIS: 'date', Y_AXIS: 'l' },
      { TITLE: 'THD_U', X_AXIS: 'date', Y_AXIS: 'a' },
      { TITLE: 'THD_V', X_AXIS: 'date', Y_AXIS: 'b' },
      { TITLE: 'THD_W', X_AXIS: 'date', Y_AXIS: 'c' }
    ],
    data: [
      { date: '2021-07-30 12:03:14', l: '0.5', a: '0.12', b: '0.1', c: '0.2' },
      { date: '2021-07-30 12:13:14', l: '0.5', a: '0.22', b: '0.05', c: '0.3' },
      {
        date: '2021-07-30 12:23:14',
        l: '0.5',
        a: '0.27',
        b: '0.06',
        c: '0.25'
      },
      {
        date: '2021-07-30 12:33:14',
        l: '0.5',
        a: '0.32',
        b: '0.08',
        c: '0.31'
      },
      { date: '2021-07-30 12:43:14', l: '0.5', a: '0.30', b: '0.1', c: '0.23' },
      { date: '2021-07-30 12:53:14', l: '0.5', a: '0.27', b: '0.08', c: '0.2' }
    ],
    w: 1,
    h: 1,
    x: 3,
    y: 4,
    i: 15
  }
]
export default data
