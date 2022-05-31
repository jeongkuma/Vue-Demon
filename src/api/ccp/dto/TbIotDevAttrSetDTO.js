export default class TbIotDevAttrSetDTO {
  constructor(devAttrSet) {
    this.selected = devAttrSet.selected || false
    this.devAttbSetCdId = devAttrSet.devAttbSetCdId || null
    this.devAttbSetCdNm = devAttrSet.devAttbSetCdNm || null
    this.modUserId = devAttrSet.modUserId || null
    this.statusCd = devAttrSet.statusCd || null
    this.devAttbSetSeq = devAttrSet.devAttbSetSeq || null
    this.regUsrId = devAttrSet.regUsrId || null
    this.devAttbSeq = devAttrSet.devAttbSeq || null
    this.devAttbSetVal = devAttrSet.devAttbSetVal || null
    this.setParentCdId = devAttrSet.setParentCdId || null
    this.mode = devAttrSet.mode || null
    this.sdevAttbSetSeq = devAttrSet.sdevAttbSetSeq || null
    this.sDevAttbSetSeq = devAttrSet.sDevAttbSetSeq || null
    this.sdevAttbSeq = devAttrSet.sdevAttbSeq || null
    this.sDevAttbSeq = devAttrSet.sDevAttbSeq || null
  }
}
