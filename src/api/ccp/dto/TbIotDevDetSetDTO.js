export default class TbIotDevDetSetDTO {
  constructor(devDepSet) {
    this.selected = devDepSet.selected || false
    this.devDetSetCdId = devDepSet.devDetSetCdId || null
    this.devDetSetCdNm = devDepSet.devDetSetCdNm || null
    this.detSetCond = devDepSet.detSetCond || null
    this.iconUrl = devDepSet.iconUrl || null
    this.regUsrId = devDepSet.regUsrId || null
    this.modUserId = devDepSet.modUserId || null
    this.devDetSetSeq = devDepSet.devDetSetSeq || null
    this.devAttbSeq = devDepSet.devAttbSeq || null
    this.detSetDesc = devDepSet.detSetDesc || null
    this.statusCd = devDepSet.statusCd || null
    this.mode = devDepSet.mode || null
    this.sdevAttbSeq = devDepSet.sdevAttbSeq || null
    this.sDevAttbSeq = devDepSet.sDevAttbSeq || null
    this.sdevDetSetSeq = devDepSet.sdevDetSetSeq || null
    this.sDevDetSetSeq = devDepSet.sDevDetSetSeq || null
  }
}
