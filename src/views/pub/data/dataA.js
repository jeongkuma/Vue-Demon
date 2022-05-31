const data = [
  {
    seq: 0,
    title: 'AI 비전검사 - 월별 현황',
    componentType: 'TableChart',
    search: [{ TYPE: 'ORG', OPTION: '', KEY: 'orgSeq' }],
    option: [],
    form: [
      { TITLE: '구분', COLUMN_VALUE: 'type', WIDTH: '' },
      { TITLE: '20.11', COLUMN_VALUE: 'col2011', WIDTH: '' },
      { TITLE: '20.12', COLUMN_VALUE: 'col2012', WIDTH: '' },
      { TITLE: '21.01', COLUMN_VALUE: 'col2101', WIDTH: '' },
      { TITLE: '21.02', COLUMN_VALUE: 'col2102', WIDTH: '' },
      { TITLE: '21.03', COLUMN_VALUE: 'col2103', WIDTH: '' },
      { TITLE: '21.04', COLUMN_VALUE: 'col2104', WIDTH: '' },
      { TITLE: '21.05', COLUMN_VALUE: 'col2105', WIDTH: '' },
      { TITLE: '21.06', COLUMN_VALUE: 'col2106', WIDTH: '' }
    ],
    data: [
      {
        type: '생산량',
        col2011: '20,000',
        col2012: '20,000',
        col2101: '20,000',
        col2102: '20,000',
        col2103: '20,000',
        col2104: '20,000',
        col2105: '20,000',
        col2106: '20,000'
      },
      {
        type: '불량',
        col2011: '1,000',
        col2012: '1,000',
        col2101: '1,000',
        col2102: '1,000',
        col2103: '1,000',
        col2104: '1,000',
        col2105: '1,000',
        col2106: '1,000'
      },
      {
        type: '불량률',
        col2011: '5.0%',
        col2012: '5.0%',
        col2101: '5.0%',
        col2102: '5.0%',
        col2103: '5.0%',
        col2104: '5.0%',
        col2105: '5.0%',
        col2106: '5.0%'
      }
    ],
    w: 2,
    h: 1,
    x: 0,
    y: 0,
    i: 1
  },
  {
    seq: 2,
    title: 'AI 비전검사 - 일별 현황',
    componentType: 'TableChart',
    search: [{ TYPE: 'ORG', OPTION: '', KEY: 'orgSeq' }],
    option: [],
    form: [
      { TITLE: '구분', COLUMN_VALUE: 'type', WIDTH: '' },
      { TITLE: '5/5', COLUMN_VALUE: 'col2011', WIDTH: '' },
      { TITLE: '5/6', COLUMN_VALUE: 'col2012', WIDTH: '' },
      { TITLE: '5/7', COLUMN_VALUE: 'col2101', WIDTH: '' },
      { TITLE: '5/8', COLUMN_VALUE: 'col2102', WIDTH: '' },
      { TITLE: '5/9', COLUMN_VALUE: 'col2103', WIDTH: '' },
      { TITLE: '5/10', COLUMN_VALUE: 'col2104', WIDTH: '' },
      { TITLE: '5/11', COLUMN_VALUE: 'col2105', WIDTH: '' }
    ],
    data: [
      {
        type: '생산량',
        col2011: '20,000',
        col2012: '20,000',
        col2101: '20,000',
        col2102: '20,000',
        col2103: '20,000',
        col2104: '20,000',
        col2105: '20,000',
        col2106: '20,000'
      },
      {
        type: '불량',
        col2011: '1,000',
        col2012: '1,000',
        col2101: '1,000',
        col2102: '1,000',
        col2103: '1,000',
        col2104: '1,000',
        col2105: '1,000',
        col2106: '1,000'
      },
      {
        type: '불량률',
        col2011: '5.0%',
        col2012: '5.0%',
        col2101: '5.0%',
        col2102: '5.0%',
        col2103: '5.0%',
        col2104: '5.0%',
        col2105: '5.0%',
        col2106: '5.0%'
      }
    ],
    w: 2,
    h: 1,
    x: 0,
    y: 1,
    i: 2
  },
  {
    seq: 3,
    title: 'AI 비전검사 - 불량유형별 비중',
    componentType: 'PieDatasetChart',
    search: [
      { TYPE: 'ORG', OPTION: '', KEY: 'orgSeq' },
      { TYPE: 'MONTH', OPTION: '', KEY: 'month' }
    ],
    option: [],
    form: [
      { TITLE: '불량A', COLUMN_VALUE: 'a' },
      { TITLE: '불량B', COLUMN_VALUE: 'b' },
      { TITLE: '불량C', COLUMN_VALUE: 'c' },
      { TITLE: '불량D', COLUMN_VALUE: 'd' },
      { TITLE: '불량E', COLUMN_VALUE: 'e' },
      { TITLE: '불량F', COLUMN_VALUE: 'f' },
      { TITLE: '불량G', COLUMN_VALUE: 'g' }
    ],
    data: {
      a: 100,
      b: 80,
      c: 70,
      d: 80,
      e: 90,
      f: 50,
      g: 90
    },
    w: 1,
    h: 1,
    x: 2,
    y: 0,
    i: 3
  },
  {
    seq: 4,
    title: 'AI 비전검사 - 불량 리스트',
    componentType: 'TableChart',
    search: [{ TYPE: 'ORG', OPTION: '', KEY: 'orgSeq' }],
    option: [],
    form: [
      { TITLE: '시간', COLUMN_VALUE: 'colDate', WIDTH: '140' },
      { TITLE: '라인', COLUMN_VALUE: 'line', WIDTH: '50' },
      { TITLE: '제품 S/N', COLUMN_VALUE: 'sn', WIDTH: '100' }
    ],
    data: [
      {
        colDate: '2021.07.01 12:13:10',
        line: 'P8',
        sn: 'P80123010DF'
      },
      {
        colDate: '2021.07.01 12:13:10',
        line: 'P8',
        sn: 'P80123010DF'
      },
      {
        colDate: '2021.07.01 12:13:10',
        line: 'P8',
        sn: 'P80123010DF'
      },
      {
        colDate: '2021.07.01 12:13:10',
        line: 'P8',
        sn: 'P80123010DF'
      },
      {
        colDate: '2021.07.01 12:13:10',
        line: 'P8',
        sn: 'P80123010DF'
      },
      {
        colDate: '2021.07.01 12:13:10',
        line: 'P8',
        sn: 'P80123010DF'
      },
      {
        colDate: '2021.07.01 12:13:10',
        line: 'P8',
        sn: 'P80123010DF'
      },
      {
        colDate: '2021.07.01 12:13:10',
        line: 'P8',
        sn: 'P80123010DF'
      },
      {
        colDate: '2021.07.01 12:13:10',
        line: 'P8',
        sn: 'P80123010DF'
      },
      {
        colDate: '2021.07.01 12:13:10',
        line: 'P8',
        sn: 'P80123010DF'
      },
      {
        colDate: '2021.07.01 12:13:10',
        line: 'P8',
        sn: 'P80123010DF'
      }
    ],
    w: 1,
    h: 1,
    x: 2,
    y: 1,
    i: 4
  },
  {
    seq: 5,
    title: 'AI 비전검사 - 실시간현황',
    componentType: 'AiRealTimeStatus',
    search: [{ TYPE: 'CTN', OPTION: '', KEY: 'ctn' }],
    option: [],
    form: [],
    data: {
      ATTB_VL10: 'skirt',
      devUname: 'VSAI001',
      ATTB_VL01: '2021-05-2516:20:30',
      ATTB_VL12: 'unbalance,scratch,dent',
      ATTB_VL11: 'OK',
      ATTB_VL03: 'dongsuh',
      ATTB_VL14: '/files/2021/07/08/P801283010DF_20210525_162030_result_f.jpg',
      ATTB_VL02: '2021-05-2516:20:30',
      ATTB_VL13: 'assetsdashboardsample.jpg',
      ATTB_VL05: 'P8',
      ATTB_VL16: '/files/2021/07/08/P801283010DF_20210525_162030_result_b.jpg',
      ATTB_VL04: 'ansan-1',
      ATTB_VL15:
        '/files/2021/07/08/P801283010DF_20210525_162030_original_b.jpg',
      svcCd: 'SD00000100',
      ATTB_VL07: 'NUPE',
      ATTB_VL06: 'piston',
      ATTB_VL09: 'P801283010DF',
      ATTB_VL08: 'NUPE81KQ',
      entrDevSeq: 430053,
      devMdlCd: 'LGE',
      ctn: 'VSAI001',
      devClsCd: 'SD00000111'
    },
    w: 1,
    h: 2,
    x: 3,
    y: 0,
    i: 5
  }
]
export default data
