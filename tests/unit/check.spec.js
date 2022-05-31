import { isNumber, isAlphaHyphenUnderscore, isIncludeKorean } from '@/utils/check'

describe('Check Validation', () => {
  it('isNumber', () => {
    expect(isNumber('124j12421421kkdsf1231')).toBeFalsy()
    expect(isNumber('346843513543131354')).toBeTruthy()
  })
  it('isAlphaHyphenUnderscore', () => {
    expect(isAlphaHyphenUnderscore('asdl@fkj1_dslfk-lsdkfj1241')).toBeFalsy()
    expect(isAlphaHyphenUnderscore('asdl한글fkj1_dslfk-lsdkfj1241')).toBeFalsy()
    expect(isAlphaHyphenUnderscore('asdl+fkj1_dslfk-lsdkfj1241')).toBeFalsy()
    expect(isAlphaHyphenUnderscore('asdl=fkj1_dslfk-lsdkfj1241')).toBeFalsy()
    expect(isAlphaHyphenUnderscore('asdl#fkj1_dslfk-lsdkfj1241')).toBeFalsy()
    expect(isAlphaHyphenUnderscore('asdl$fkj1_dslfk-lsdkfj1241')).toBeFalsy()
    expect(isAlphaHyphenUnderscore('asdl%fkj1_dslfk-lsdkfj1241')).toBeFalsy()
    expect(isAlphaHyphenUnderscore('asdl^fkj1_dslfk-lsdkfj1241')).toBeFalsy()
    expect(isAlphaHyphenUnderscore('asdl/fkj1_dslfk-lsdkfj1241')).toBeFalsy()
    expect(isAlphaHyphenUnderscore('asdl\fkj1_dslfk-lsdkfj1241')).toBeFalsy()
    expect(isAlphaHyphenUnderscore('asdlfkj1_dslfk-lsdkfj1241')).toBeTruthy()
  })
  it('isNotIncludeKorean', () => {
    expect(isIncludeKorean('asdl$fkj1_dsㄱlfk-lsdkfj1241')).toBeTruthy()
    expect(isIncludeKorean('asdl$fkj1_dsㅏlfk-lsdkfj1241')).toBeTruthy()
    expect(isIncludeKorean('asdl$fkj1_ds야lfk-lsdkfj1241')).toBeTruthy()
    expect(isIncludeKorean('asdl$fkj1_ds한글lfk-lsdkfj1241')).toBeTruthy()
    expect(isIncludeKorean('asdl$fkj1_dslfk-lsdkfj1241')).toBeFalsy()
  })
})
