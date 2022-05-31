export default class TbIotDevDTO {
  constructor(dev) {
    this.sdevSeq = dev.sdevSeq || null
    this.sDevSeq = dev.sDevSeq || null
    this.svcDevSeq = dev.svcDevSeq || null
    this.devSeq = dev.devSeq || null
    this.devClsCd = dev.devClsCd || null
    this.devClsCdNm = dev.devClsCdNm || null
    this.devMdlCd = dev.devMdlCd || null
    this.devMdlNm = dev.devMdlNm || null
    this.useYn = dev.useYn || null
    this.parentDevSeq = dev.parentDevSeq || null
    this.vendorNm = dev.vendorNm || null
    this.stateCd = dev.stateCd || null
    this.regUsrId = dev.regUsrId || null
    this.modUsrId = dev.modUsrId || null
    this.normalIconFile = dev.normalIconFile || null
    this.abnormalIconFile = dev.abnormalIconFile || null
    this.abnormalIconFile2 = dev.abnormalIconFile2 || null
    this.orgDevSeq = dev.orgDevSeq || null
    this.displayRowCount = dev.displayRowCount || null
    this.currentPage = dev.currentPage || null
    this.startPage = dev.startPage || null
    this.isParent = dev.isParent || null
    this.svcCd = dev.svcCd || null
  }
}
