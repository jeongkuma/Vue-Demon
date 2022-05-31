export default class TbIotDevAttrDTO {
  constructor(devAttr) {
    this.selected = devAttr.selected || false
    this.devAttbSeq = devAttr.devAttbSeq || null
    this.devSeq = devAttr.devSeq || null
    this.devAttbCdId = devAttr.devAttbCdId || null
    this.devAttbCdNm = devAttr.devAttbCdNm || null
    this.inputType = devAttr.inputType || null
    this.paramKey = devAttr.paramKey || null
    this.minVal = devAttr.minVal || null
    this.maxVal = devAttr.maxVal || null
    this.colNmCd = devAttr.colNmCd || null
    this.conNmCd = devAttr.conNmCd || null
    this.staAvgNmCd = devAttr.staAvgNmCd || null
    this.staSumNmCd = devAttr.staSumNmCd || null
    this.detNmCd = devAttr.detNmCd || null
    this.mapYn = devAttr.mapYn || null
    this.unit = devAttr.unit || null
    this.orderNo = devAttr.orderNo || null
    this.statusCd = devAttr.statusCd || null
    this.regUsrId = devAttr.regUsrId || null
    this.regDttm = devAttr.regDttm || null
    this.modUsrId = devAttr.modUsrId || null
    this.modDttm = devAttr.modDttm || null
    this.devClsCd = devAttr.devClsCd || null
    this.devClsCdNm = devAttr.devClsCdNm || null
    this.devMdlCd = devAttr.devMdlCd || null
    this.devMdlNm = devAttr.devMdlNm || null
    this.devAttbType = devAttr.devAttbType || null
    this.devMdlVal = devAttr.devMdlVal || null
    this.mode = devAttr.mode || null
    this.svcCd = devAttr.svcCd || null
    this.sdevAttbSeq = devAttr.sdevAttbSeq || null
    this.sDevAttbSeq = devAttr.sDevAttbSeq || null
    this.sdevSeq = devAttr.sdevSeq || null
    this.sDevSeq = devAttr.sDevSeq || null
  }
}
