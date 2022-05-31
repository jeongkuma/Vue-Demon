const data = [
  {
    seq: 0,
    title: '배전단 - 장비 모델별 이상현황',
    componentType: 'TableChart',
    search: [{ TYPE: 'ORG', OPTION: '', KEY: 'orgSeq' }],
    option: [],
    form: [
      { TITLE: '식별명', COLUMN_VALUE: 'devUname', WIDTH: '80' },
      { TITLE: '과열', COLUMN_VALUE: 'overheat', WIDTH: '50' },
      { TITLE: '방전', COLUMN_VALUE: 'elDischarge', WIDTH: '50' },
      { TITLE: '디바이스', COLUMN_VALUE: 'device', WIDTH: '80' }
    ],
    data: [
      {
        devUname: '배전면1',
        overheat: '정상',
        elDischarge: '정상',
        device: '정상'
      },
      {
        devUname: '배전면2',
        overheat: '이상',
        elDischarge: '정상',
        device: '정상'
      },
      {
        devUname: '배전면3',
        overheat: '정상',
        elDischarge: '이상',
        device: '정상'
      },
      {
        devUname: '배전면4',
        overheat: '이상',
        elDischarge: '이상',
        device: '정상'
      },
      {
        devUname: '배전면5',
        overheat: '이상',
        elDischarge: '이상',
        device: '이상'
      }
    ],
    w: 1,
    h: 1,
    x: 0,
    y: 0,
    i: 1
  },
  {
    seq: 1,
    title: '배전단 - 수집 정보 추이',
    componentType: 'DynamicLineChart',
    search: [
      { TYPE: 'CTN', OPTION: 'EQ', KEY: 'ctn' },
      {
        TYPE: 'COMBO',
        OPTION: { apiUri: '/bAttb', nameKey: 'name', valueKey: 'value' },
        KEY: 'attb'
      }
    ],
    option: [],
    form: [{ TITLE: '', X_AXIS: 'colDate', Y_AXIS: 'attb01' }],
    data: [
      {
        colDate: '2021-07-30 13:05:00',
        attb01: 1
      },
      {
        colDate: '2021-07-30 13:06:00',
        attb01: 2
      },
      {
        colDate: '2021-07-30 13:07:00',
        attb01: 3
      },
      {
        colDate: '2021-07-30 13:08:00',
        attb01: 8
      },
      {
        colDate: '2021-07-30 13:09:00',
        attb01: 5
      }
    ],
    w: 1,
    h: 1,
    x: 1,
    y: 0,
    i: 2
  },
  {
    seq: 2,
    title: '배전단 - 불량 유형별 비중',
    componentType: 'RowTableChart',
    search: [{ TYPE: 'CTN', OPTION: 'EQ', KEY: 'ctn' }],
    option: [],
    form: [
      { TITLE: 'PD1.MaxValue', TAG_VALUE: 'attb1' },
      { TITLE: 'PD2.MaxValue', TAG_VALUE: 'attb2' },
      { TITLE: 'PD3.MaxValue', TAG_VALUE: 'attb3' },
      { TITLE: 'PD4.MaxValue', TAG_VALUE: 'attb4' },
      { TITLE: 'Thermal1.Zone1.Max', TAG_VALUE: 'attb5' },
      { TITLE: 'Thermal1.Zone2.Max', TAG_VALUE: 'attb6' },
      { TITLE: 'Thermal1.Zone3.Max', TAG_VALUE: 'attb7' },
      { TITLE: 'Thermal1.Zone4.Max', TAG_VALUE: 'attb8' },
      { TITLE: 'Thermal1.Zone5.Max', TAG_VALUE: 'attb9' },
      { TITLE: 'Thermal1.Zone6.Max', TAG_VALUE: 'attb10' },
      { TITLE: 'Thermal1.Zone7.Max', TAG_VALUE: 'attb11' },
      { TITLE: 'Thermal1.Zone8.Max', TAG_VALUE: 'attb12' },
      { TITLE: 'Thermal1.Zone9.Max', TAG_VALUE: 'attb12' },
      { TITLE: 'Thermal2.Zone1.Max', TAG_VALUE: 'attb5' },
      { TITLE: 'Thermal2.Zone2.Max', TAG_VALUE: 'attb6' },
      { TITLE: 'Thermal2.Zone3.Max', TAG_VALUE: 'attb7' },
      { TITLE: 'Thermal2.Zone4.Max', TAG_VALUE: 'attb8' },
      { TITLE: 'Thermal2.Zone5.Max', TAG_VALUE: 'attb9' },
      { TITLE: 'Thermal2.Zone6.Max', TAG_VALUE: 'attb10' },
      { TITLE: 'Thermal2.Zone7.Max', TAG_VALUE: 'attb11' },
      { TITLE: 'Thermal2.Zone8.Max', TAG_VALUE: 'attb12' },
      { TITLE: 'Thermal2.Zone9.Max', TAG_VALUE: 'attb12' }
    ],
    data: {
      attb1: '1.23',
      attb2: '2.23',
      attb3: '3.23',
      attb4: '3',
      attb5: '50.12',
      attb6: '50.23',
      attb7: '50.1',
      attb8: '50.13',
      attb9: '50.34',
      attb10: '50.12',
      attb11: '50.23',
      attb12: '50.23'
    },
    w: 1,
    h: 2,
    x: 2,
    y: 0,
    i: 3
  }
]
export default data
