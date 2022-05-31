<template>
  <div>
    <div class="search-box lb-txt-in">
      <div class="left">
        <div class="form-inline">
          <div class="form-group">
            <span class="form-control-static">서비스</span>
            <select
              v-model="svcCd"
              ref="svcCd"
              class="form-control"
              title="서비스"
            >
              <option
                v-for="(svc, index) in svcCdList"
                :key="`svcCd-${index}`"
                :value="svc.svcCd"
                >{{ svc.svcCdNm }}</option
              >
            </select>
          </div>
          <div class="form-group">
            <span class="form-control-static">{{$t('terminal-type')}}</span>
            <select v-model="devClsCd" class="form-control">
              <option v-for="(devCls, idx) in devClsList" :key="'devCls_' + idx" :value="devCls.devClsCd">{{devCls.devClsNm}}</option>
            </select>
          </div>
          <div class="form-group">
            <button class="btn btn-info" type="button" @click="search">{{$t('search')}}</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 중간 -->
    <div class="grid-container grid-scroll">
      <div v-show="retrieveData.divisionCd === 'SD00000002'" class="row half">
        <div class="col-md-6">
          <div class="tit-wrap mt-3">
            <h4 class="titH4">모델 목록(Conversion) </h4>
          </div>
          <div class="table_style table-wrap overflow_x_scroll">
            <table class="table table-col" style="min-width: 600px;">
              <caption>전문 룰 관리</caption>
              <colgroup>
                <col style="width:150px;">
                <col style="width:150px;">
                <col style="width:60px;">
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" v-for="(colNm, idx) in modelConversionTable.colNameData" :key="'modelConversionTableCol_' + idx">
                    {{ colNm }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in modelConversionTable.data" :key="'modelConversionRow_' + idx" @dblclick="selectModelTable(row.devSeq, row.devMdlCd, row.devClsCdNm, row.devMdlNm)" :class="{'bg_color': row.devSeq === modelConversionTable.selectDevSeq}">
                  <td class="left"><div >{{ row.devClsCdNm }}</div></td>
                  <td class="left">{{ row.devMdlNm }}</td>
                  <td class="left">{{ row.vendorNm }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <pagination
            :currentPage.sync="modelConversionTable.pageInfo.currentPage"
            :rowCount.sync="modelConversionTable.pageInfo.rowCount"
            :totalPage.sync="modelConversionTable.pageInfo.totalPage"
            :onPaging="modelConversionTable.pageInfo.callback"
            :rowCountArray="displayRowCountList"
            ></pagination>
        </div>
        <div class="col-md-6">
          <div class="tit-wrap mt-3">
            <h4 class="titH4">단말별 룰 목록 {{ modelTableText }}</h4>
          </div>
          <div class="table_style table-wrap overflow_x_scroll">
            <table class="table table-col half" style="min-width: 600px;">
              <caption>단말별 룰 관리</caption>
              <colgroup>
                <col style="width:150px;">
                <col style="width:70px;">
                <col style="width:70px;">
                <col style="width:70px;">
                <col style="width:70px;">
<!--                <col style="width:70px;">-->
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" v-for="(colNm, idx) in devConversionTable.colNameData" :key="'devConversionTableCol_' + idx">
                    {{ colNm }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in devConversionTable.data" :key="'devConversionRow_' + idx" @dblclick="selectApiRuleTable(row.apiSeq, row.apiNm, row.serverGubun) " :class="{'bg_color': row.apiSeq === apiTable.selectApiSeq}">
                  <td>{{ row.ruleUri }}</td>
                  <td v-if="row.parsingTcpRule === 'use'">{{ $t('use') }}</td>
                  <td v-else >{{ $t('use-no') }}</td>
                  <td v-if="row.parsingRule === 'use'">{{ $t('use') }}</td>
                  <td v-else >{{ $t('use-no') }}</td>
                  <td v-if="row.validRule === 'use'">{{ $t('use') }}</td>
                  <td v-else >{{ $t('use-no') }}</td>
                  <td v-if="row.mappingRule === 'use'">{{ $t('use') }}</td>
                  <td v-else >{{ $t('use-no') }}</td>
<!--                  <td v-if="row.serviceCall === 'use'">{{ $t('use') }}</td>-->
<!--                  <td v-else >{{ $t('use-no') }}</td>-->
                </tr>
              </tbody>
            </table>
          </div>
          <pagination
            :currentPage.sync="devConversionTable.pageInfo.currentPage"
            :rowCount.sync="devConversionTable.pageInfo.rowCount"
            :totalPage.sync="devConversionTable.pageInfo.totalPage"
            :onPaging="devConversionTable.pageInfo.callback"
            :rowCountArray="displayRowCountList"
            ></pagination>
        </div>
      </div>
      <div v-show="!retrieveData.divisionCd" class="row">
        <div class="col-md-12">
          <div class="tit-wrap mt-3">
            <h4 class="titH4">{{$t('api')}}</h4>
          </div>
          <div class="table_style table-wrap overflow_x_scroll">
            <table class="table table-col" style="min-width:1000px;">
              <caption>전문 룰 관리</caption>
              <colgroup>
                <col style="width:30px">
                <col style="width:80px">
                <col style="width:90px">
                <col style="width:50px">
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" v-for="(colNm, idx) in apiTable.colNameData" :key="'apiTableCol_' + idx">
                    {{ colNm }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row,idx) in apiTable.data" :key="'apiRow_' + idx" @dblclick="selectApiTable(row.apiSeq, row.apiNm)" :class="{'bg_color': row.apiSeq === apiTable.selectApiSeq}">
                  <td class="left">{{ row.apiNm }}</td>
                  <td class="left">{{ row.apiUri }}</td>
                  <td>{{ row.apiDesc }}</td>
                  <td class="left">{{ row.gubun }}</td>
                </tr>
              </tbody>
            </table>

          </div>
          <pagination
            :currentPage.sync="apiTable.pageInfo.currentPage"
            :rowCount.sync="apiTable.pageInfo.rowCount"
            :totalPage.sync="apiTable.pageInfo.totalPage"
            :onPaging="apiTable.pageInfo.callback"
            :rowCountArray="displayRowCountList"
            ></pagination>
        </div>
      </div>
      <br>
      <div v-show="retrieveData.divisionCd === 'SD00000002'" class="row">
        <div class="search-box lb-txt-in">
          <div class="left">
            <div class="form-inline">
              <div class="form-group overflow">
                <span class="form-control-static float-left">{{$t('server-nm')}}</span>
                <select v-model="serverNm" name="" class="form-control float-left input-mt select-h-29" @change="changeTabList('S')">
                  <option v-for="(server, idx) in serverNmList" :key="'server_' + idx" :value="server.cdId">{{ server.cdNm }}</option>
                </select>
              </div>
              <div class="form-group overflow">
                  <span class="form-control-static float-left">TYPE</span>
                  <select v-model="parsingRuleAllTab.type" id="typeSelect" name="typeSelect" class="form-control float-left input-mt select-h-29" @change="changeTypeRadio" :disabled="serverNm === 'GN00000047' && tabInfo.selectedTab !== 'tab1'  && tabInfo.selectedTab !== 'tab2'" >
                    <option v-for="(type, idx) in parsingRuleAllTab.typeList" :key="'type_' + idx" :value="type.cdId" >{{ type.cdNm }}</option>
                  </select>
                  <button class="btn btn-info" type="button" @click="openTypeCopyPopup">{{$t('copy')}}</button>
              </div>
              <div class="form-group overflow">
                <span class="form-control-static float-left">{{$t('api-name')}}</span>
                <input v-model="devApiNm" type="text" class="form-control float-left input-mt" placeholder="" title="검색어 입력" disabled @change="changeTabList('A')">
              </div>
              <div class="form-group">
                <button class="btn btn-info" type="button" @click="openSearchApiPopup">{{$t('search')}}</button>
              </div>
              <div class="form-group overflow" v-if="chkServerType">
                <span class="form-control-static float-left">제어대상서버</span>
                <select v-model="svrMsgType" name="" class="form-control float-left input-mt select-h-29">
                  <option value="none">선택</option>
                  <option v-for="(server, idx) in svrMsgTypeList" :key="'svrMsgType_' + idx" :value="server.cdId">{{ server.cdNm }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 전문룰 -->
      <div class="row col-md-12">
        <div class="tit-wrap">
          <h4 class="titH4" v-if="this.retrieveData.divisionCd !== ''">수집 / 제어 정보설정 {{ tabText }}</h4>
          <h4 class="titH4" v-else>수집 / 제어 정보설정 {{ apiText }}</h4>
        </div>
        <div role="tabpanel" class="rule-wrap">
          <ul class="nav nav-tabs" role="tablist">
            <li v-show="parsingRuleAllTabVisible" :class="getTabNameLiClass('tab1')" @click="selectTab('tab1')" role="presentation"><a aria-controls="tab1" role="tab" data-toggle="tab">파싱룰(전문)</a></li>
            <li v-show="pasingRuleTabVisible" :class="getTabNameLiClass('tab2')" @click="selectTab('tab2')" role="presentation"><a aria-controls="tab2" role="tab" data-toggle="tab">파싱룰</a></li>
            <li v-show="verificationRuleTabVisible" :class="getTabNameLiClass('tab3')" @click="selectTab('tab3')" role="presentation"><a aria-controls="tab3" role="tab" data-toggle="tab">검증룰</a></li>
            <li v-show="mappingRuleTabVisible" :class="getTabNameLiClass('tab4')" @click="selectTab('tab4')" role="presentation"><a aria-controls="tab4" role="tab" data-toggle="tab" >매핑룰</a></li>
            <li v-show="mappingCtlTabVisible" :class="getTabNameLiClass('tab6')" @click="selectTab('tab6')" role="presentation"><a aria-controls="tab6" role="tab" data-toggle="tab" >제어룰</a></li>
            <!-- <li v-show="serviceCallTabVisible" :class="getTabNameLiClass('tab5')" @click="selectTab('tab5')" role="presentation"><a aria-controls="tab5" role="tab" data-toggle="tab" >서비스호출</a></li> -->
          </ul>
          <!-- Tab panes -->
          <div class="tab-content">
            <!-- Tab 01 파싱룰(전문) -->
            <div v-show="isSelectedTab('tab1')" role="tabpanel">
              <div class="row tab_margin_style">
                <div class="col-md-12">
                  <div class="form-inline">
                    <!-- <span class = 'form-control input-mt' v-show="parsingRuleAllTab.isSaveParseHeadList">  {{ parsingRuleAllTab.isSaveParseHeadList }} </span> -->
                    <span v-show="parsingRuleAllTab.isSaveParseHeadList" class="lb-txt w100">설정됨</span>
                    <span v-show="!parsingRuleAllTab.isSaveParseHeadList" class="lb-txt w100">미설정됨</span>
                  </div>
                  <div class="table-wrap auto overflow_x_scroll">
                      <table class="table table-col" style="min-width:1600px;">
                        <caption></caption>
                        <colgroup>
                          <col style="width:200px;">
                          <col style="width:150px;">
                          <col style="width:150px;">
                          <col style="width:150px;">
                          <col style="width:150px;">
                          <col style="width:150px;">
                          <col style="width:100px;">
                          <col style="width:100px;">
                          <col style="width:79px;">
                        </colgroup>
                        <thead>
                          <tr>
                            <th v-for="(colNm, idx) in parsingRuleAllTab.colNameData" :key="'parsingRuleAllTableNm_' + idx">
                              {{ colNm }}
                            </th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(row, idx) in parsingRuleAllTab.parsingRuleAllHeadList" :key="'parsingHead_' + idx">
                            <td>
                              <select class="form-control" v-model="row.ruleRequest" title="전문KEY" :disabled="row.exeFile === '6'">
                                <option v-for="(ruleRequest, idx) in tabDataList.proKeyList" :key="'ruleRequest_' + idx" :value="ruleRequest.cdId">{{ ruleRequest.cdNm }}</option>
                              </select>
                            </td>
                            <td><input class="form-control" v-model="row.ruleSourcekey" type="text" title="" :disabled="row.exeFile === '6'"></td>
                            <td>
                              <select class="form-control" v-model="row.ruleTargetkey" title="목적키" @change="changeHeaderTagetKey(idx)">
                                <option v-for="(ruleTargetkey, idx) in parsingRuleAllTab.headPurposeKeyList" :key="'ruleTargetkey_' + idx" :value="ruleTargetkey.cdId">{{ ruleTargetkey.cdNm }}</option>
                              </select>
                            </td>
                            <td>
                              <select class="form-control" v-model="row.exeFile" title="실행파일" @change="changeExeFile(parsingRuleAllTab.parsingRuleAllHeadList, idx, row.exeFile)">
                                <option v-for="(exe, idx) in tabDataList.exeFileList" :key="'exeFile_' + idx" :value="exe.cdId" >{{ exe.cdNm }}</option>
                              </select>
                            </td>
                            <td><input class="form-control" v-model="row.ruleBytePosi" type="text" title="Byte위치"></td>
                            <td><input class="form-control" v-model="row.ruleBitPosi" type="text" title="Bit위치" :disabled="row.exeFile === '1' || row.exeFile === '4' || row.exeFile === '2' || row.exeFile === '6' || row.exeFile === '9' || row.exeFile === '10'|| row.exeFile === '11'"></td>
                            <td>
                              <select class="form-control" v-model="row.ruleNumber" title="수" :disabled="row.exeFile === '6' || row.exeFile === '9'">
                                <option v-for="(ruleNumber, idx) in tabDataList.numberList" :key="'ruleNumber_' + idx" :value="ruleNumber.cdId" >{{ ruleNumber.cdNm }}</option>
                              </select>
                            </td>
                            <td>
                              <select class="form-control" v-model="row.rulePoint" title="소수점" :disabled="row.exeFile === '6' || row.exeFile === '9'">
                                <option v-for="(rulePoint, idx) in tabDataList.decimalPointList" :key="'rulePoint_' + idx" :value="rulePoint.cdId" >{{ rulePoint.cdNm }}</option>
                              </select>
                            </td>
                            <td>
                              <div class="py-1 text_left">
                                <button v-if="idx === 0 && parsingRuleAllTab.parsingRuleAllHeadList.length === 1" class="btn" type="button" @click="insertRowParsingRuleAllHeadTable"><span class="glyphicon glyphicon-plus" ></span></button>
                                <div v-else-if="idx ===  parsingRuleAllTab.parsingRuleAllHeadList.length - 1">
                                  <button class="btn" type="button" @click="insertRowParsingRuleAllHeadTable"><span class="glyphicon glyphicon-plus" ></span></button>
                                  <button class="btn" type="button" @click="deleteRowParsingRuleAllHeadTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                                </div>
                                <button v-else class="btn" type="button" @click="deleteRowParsingRuleAllHeadTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
              </div>
              <div class="mt-2 text-right">
                <button class="btn btn-info" type="button" :disabled="disabledSaveButtonControl" @click="fnCallInsertApi('parsingRuleAllHead')" >{{$t('save')}}</button>
              </div>
              <div class="row tab_margin_style">
                <div class="col-md-12">
                  <div v-show="retrieveData.devApiNm === 'TCPCollector'"  class="form-inline"> <!-- 타입 세팅 -->
                    <div class="form-group overflow" style="margin-top:5px">
                      <!-- <label v-show="parsingRuleAllTab.isSaveParseBodyList"> {{ parsingRuleAllTab.isSaveParseBodyList }} </label> -->
                      <span v-show="parsingRuleAllTab.isSaveParseBodyList" class="lb-txt w100" style='margin: 7px 0 0 7px'>설정됨</span>
                      <span v-show="!parsingRuleAllTab.isSaveParseBodyList" class="lb-txt w100" style='margin: 7px 0 0 7px'>미설정됨</span>
                    </div>
                  </div>
                  <div class="table-wrap auto overflow_x_scroll">
                    <table class="table table-col" style="min-width: 1500px;">
                      <caption></caption>
                      <colgroup>
                        <col style="width:110px;">
                        <col style="width:140px;">
                        <col style="width:100px;">
                        <col style="width:160px;">
                        <col style="width:120px;">
                        <col style="width:120px;">
                        <col style="width:70px;">
                        <col style="width:70px;">
                        <col style="width:65px;">
                      </colgroup>
                      <thead>
                        <tr>
                          <th v-for="(colNm, idx) in parsingRuleAllTab.colNameData" :key="'parsingRuleAllTableNm_' + idx">
                            {{ colNm }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(row, idx) in parsingRuleAllTab.parsingRuleAllBodyList" :key="'parsingBody_' + idx">
                            <td>
                              <!-- <select class="form-control" v-model="row.ruleRequest" title="전문KEY" :disabled="row.exeFile === '6'"> 임시조치-->
                              <select class="form-control" v-model="row.ruleRequest" title="전문KEY" >
                                <option v-for="(ruleRequest, idx) in tabDataList.proKeyList" :key="'ruleRequest_' + idx" :value="ruleRequest.cdId">{{ ruleRequest.cdNm }}</option>
                              </select>
                            </td>
                            <!-- <td><input class="form-control" v-model="row.ruleSourcekey" type="text" title="KEY" :disabled="row.exeFile === '6'"></td> 임시조치-->
                            <td><input class="form-control" v-model="row.ruleSourcekey" type="text" title="KEY" ></td>
                            <td>
                              <select class="form-control" v-model="row.ruleTargetkey" title="목적키">
                                <option v-for="(ruleTargetkey, idx) in tabDataList.purposeKeyList" :key="'ruleTargetkey_' + idx" :value="ruleTargetkey.cdId">{{ ruleTargetkey.cdNm }}</option>
                              </select>
                            </td>
                            <td>
                              <select class="form-control" v-model="row.exeFile" title="실행파일" @change="changeExeFileParsingRuleAllBody(parsingRuleAllTab.parsingRuleAllBodyList, idx, row.exeFile)">
                                <option v-for="(exe, idx) in tabDataList.exeFileList" :key="'exeFile_' + idx" :value="exe.cdId">{{ exe.cdNm }}</option>
                              </select>
                            </td>
                            <td><input class="form-control" v-model="row.ruleBytePosi" type="text" title="Byte위치"></td>
                            <td><input class="form-control" v-model="row.ruleBitPosi" type="text" title="Bit위치" :disabled="row.exeFile === '1' || row.exeFile === '4' || row.exeFile === '2' || row.exeFile === '6' || row.exeFile === '9'  || row.exeFile === '10'|| row.exeFile === '11'"></td>
                            <td>
                              <select class="form-control" v-model="row.ruleNumber" title="수" :disabled="row.exeFile === '6' || row.exeFile === '9'">
                                <option v-for="(ruleNumber, idx) in tabDataList.numberList" :key="'ruleNumber_' + idx" :value="ruleNumber.cdId">{{ ruleNumber.cdNm }}</option>
                              </select>
                            </td>
                            <td>
                              <select class="form-control" v-model="row.rulePoint" title="소수점" :disabled="row.exeFile === '6'  || row.exeFile === '9'">
                                <option v-for="(rulePoint, idx) in tabDataList.decimalPointList" :key="'rulePoint_' + idx" :value="rulePoint.cdId">{{ rulePoint.cdNm }}</option>
                              </select>
                            </td>
                            <td>
                              <div class="py-1 text_left">
                                <div v-if="idx === 0 && parsingRuleAllTab.parsingRuleAllBodyList.length === 1">
                                  <button class="btn" type="button" @click="insertRowParsingRuleAllBodyTable"><span class="glyphicon glyphicon-plus" ></span></button>
                                  <button class="btn" type="button" @click="deleteRowParsingRuleAllBodyTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                                </div>
                                <div v-else-if="idx ===  parsingRuleAllTab.parsingRuleAllBodyList.length - 1">
                                  <button class="btn" type="button" @click="insertRowParsingRuleAllBodyTable"><span class="glyphicon glyphicon-plus" ></span></button>
                                  <button class="btn" type="button" @click="deleteRowParsingRuleAllBodyTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                                </div>
                                <button v-else class="btn" type="button" @click="deleteRowParsingRuleAllBodyTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                              </div>
                            </td>
                          </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="mt-2 text-right">
                <button class="btn btn-info" type="button" :disabled="disabledSaveButtonControl" @click="fnCallInsertApi('parsingRuleAllBody')" >{{$t('save')}}</button>
              </div>
            </div>
            <!-- Tab 02 파싱룰 -->
            <div v-show="isSelectedTab('tab2')" role="tabpanel" class="tab_margin_style">
              <div class="row tab_margin_style">
                <div class="col-md-12">
                  <div class="form-inline">
                    <!-- <label v-show="parsingRuleTab.isSaveParseList"> {{ parsingRuleTab.isSaveParseList }} </label> -->
                    <span v-show="parsingRuleTab.isSaveParseList" class="lb-txt w100">설정됨</span>
                    <span v-show="!parsingRuleTab.isSaveParseList" class="lb-txt w100">미설정됨</span>
                  </div>
                  <div class="table-wrap overflow_x_scroll">
                    <table class="table table-col" style="min-width: 1600px;">
                      <caption></caption>
                      <colgroup>
                        <col style="width:150px;">
                        <col style="width:150px;">
                        <col style="width:150px;">
                        <col style="width:160px;">
                        <col style="width:150px;">
                        <col style="width:150px;">
                        <col style="width:140px;">
                        <col style="width:140px;">
                        <col style="width:82px;">
                      </colgroup>
                      <thead>
                        <tr>
                          <th v-for="(colNm, idx) in parsingRuleTab.colNameData" :key="'parsingRuleTableNm_' + idx">
                            {{ colNm }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(row, idx) in parsingRuleTab.parsingRuleList" :key="'parsing_' + idx">
                            <td>
                              <!-- <select class="form-control" v-model="row.ruleRequest" title="전문KEY" :disabled="row.exeFile === '6'"> 임시조치-->
                              <select class="form-control" v-model="row.ruleRequest" title="전문KEY" >
                                <option v-for="(ruleRequest, idx) in tabDataList.proKeyList" :key="'ruleRequest_' + idx" :value="ruleRequest.cdId">{{ ruleRequest.cdNm }}</option>
                              </select>
                            </td>
                            <!-- <td><input class="form-control" v-model="row.ruleSourcekey" type="text" title="KEY" :disabled="row.exeFile === '6'"></td> 임시조치-->
                            <td><input class="form-control" v-model="row.ruleSourcekey" type="text" title="KEY" ></td>
                            <td>
                              <select class="form-control" v-model="row.ruleTargetkey" title="목적키">
                                <option v-for="(ruleTargetkey, idx) in tabDataList.purposeKeyList" :key="'ruleTargetkey_' + idx" :value="ruleTargetkey.cdId">{{ ruleTargetkey.cdNm }}</option>
                              </select>
                            </td>
                            <td>
                              <select class="form-control" v-model="row.exeFile" title="실행파일" @change="changeExeFile(parsingRuleTab.parsingRuleList, idx, row.exeFile)">
                                <option v-for="(exe, idx) in tabDataList.exeFileList" :key="'exeFile_' + idx" :value="exe.cdId">{{ exe.cdNm }}</option>
                              </select>
                            </td>
                            <td><input class="form-control" v-model="row.ruleBytePosi" type="text" title="Byte위치" ></td>
                            <td><input class="form-control" v-model="row.ruleBitPosi" type="text" title="Bit위치" :disabled="row.exeFile === '1' || row.exeFile === '4' || row.exeFile === '2' || row.exeFile === '6' || row.exeFile === '9' || row.exeFile === '10'|| row.exeFile === '11'"></td>
                            <td>
                              <select class="form-control" v-model="row.ruleNumber" title="수" :disabled="row.exeFile === '6' || row.exeFile === '9'">
                                <option v-for="(ruleNumber, idx) in tabDataList.numberList" :key="'ruleNumber_' + idx" :value="ruleNumber.cdId">{{ ruleNumber.cdNm }}</option>
                              </select>
                            </td>
                            <td>
                              <select class="form-control" v-model="row.rulePoint" title="소수점" :disabled="row.exeFile === '6' || row.exeFile === '9'">
                                <option v-for="(rulePoint, idx) in tabDataList.decimalPointList" :key="'rulePoint_' + idx" :value="rulePoint.cdId">{{ rulePoint.cdNm }}</option>
                              </select>
                            </td>
                            <td>
                              <div class="py-1 text_left">
                                <div v-if="idx === 0 && parsingRuleTab.parsingRuleList.length === 1">
                                  <button class="btn" type="button" @click="insertRowParsingRuleTable"><span class="glyphicon glyphicon-plus" ></span></button>
                                  <button class="btn" type="button" @click="deleteRowParsingRuleTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                                </div>
                                <!-- <button v-else-if="idx === 0 && parsingRuleTab.parsingRuleList.length > 1" class="btn" type="button" @click="deleteRowParsingRuleTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                                <div v-else>
                                  <button class="btn" type="button" @click="insertRowParsingRuleTable"><span class="glyphicon glyphicon-plus" ></span></button>
                                  <button class="btn" type="button" @click="deleteRowParsingRuleTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                                </div> -->
                                <div v-else-if="idx ===  parsingRuleTab.parsingRuleList.length - 1">
                                  <button class="btn" type="button" @click="insertRowParsingRuleTable"><span class="glyphicon glyphicon-plus" ></span></button>
                                  <button class="btn" type="button" @click="deleteRowParsingRuleTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                                </div>
                                <button v-else class="btn" type="button" @click="deleteRowParsingRuleTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                              </div>
                            </td>
                          </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="mt-2 text-right">
                <button class="btn btn-info" type="button" :disabled="disabledSaveButtonControl" @click="fnCallInsertApi('parsingRule')">{{$t('save')}} </button>
              </div>
            </div>
            <!-- Tab 03 검증룰 -->
            <div v-show="isSelectedTab('tab3')" role="tabpanel" class="tab_margin_style">
              <div class="row tab_margin_style">
                <div class="col-md-12" style="margin-top:5px">
                  <span v-show="retrieveData.devApiNm !== 'TCPCollector' && verificationRuleTab.isSaveValList" class="lb-txt w100">설정됨</span>
                  <span v-show="retrieveData.devApiNm !== 'TCPCollector' && !verificationRuleTab.isSaveValList" class="lb-txt w100">미설정됨</span>
                  <div v-show="retrieveData.devApiNm === 'TCPCollector' && retrieveData.divisionCd === 'SD00000002'" class="form-inline"> <!-- 타입 세팅 -->
                    <div class="form-group overflow">
                      <!-- <span class="form-control-static float-left">TYPE</span>
                      <select v-model="verificationRuleTab.type" name="" class="form-control float-left input-mt select-h-29" @change="changeValTypeSelect" >
                        <option v-for="(type, idx) in verificationRuleTab.typeList" :key="'type_' + idx" :value="type.cdId" >{{ type.cdNm }}</option>
                      </select> -->
                      <span v-show="verificationRuleTab.isSaveValList" class="lb-txt w100" style='margin: 7px 0 0 7px'>설정됨</span>
                      <span v-show="!verificationRuleTab.isSaveValList" class="lb-txt w100" style='margin: 7px 0 0 7px'>미설정됨</span>
                    </div>
                  </div>
                  <div class="table-wrap auto overflow_x_scroll">
                    <table class="table table-col" style="min-width: 1650px;">
                      <caption></caption>
                      <colgroup>
                        <col style="width:150px;">
                        <col style="width:180px;">
                        <col style="width:100px;">
                        <col style="width:100px;">
                        <col style="width:180px;">
                        <col style="width:180px;">
                        <col style="width:180px;">
                        <col style="width:180px;">
                        <col style="width:180px;">
                        <col style="width:100px;">
                        <col v-if="retrieveData.divisionCd === 'SD00000002'" style="width:120px;">
                        <col v-else style="width:0px;">
                      </colgroup>
                      <thead>
                        <tr>
                          <th v-for="(colNm, idx) in verificationRuleTab.colNameData" :key="'parsingRuleTableNm_' + idx">
                            {{ colNm }}
                          </th>
                          <th v-if="retrieveData.divisionCd === ''"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(row, idx) in verificationRuleTab.verificationRuleList" :key="'verificationRuleRow_' + idx">
                          <td v-if="retrieveData.divisionCd === 'SD00000002'">
                              <select class="form-control" v-model="row.ruleRequest" title="전문KEY" disabled>
                                <option v-for="(ruleRequest, idx) in verificationRuleTab.proKeyList" :key="'ruleRequest_' + idx" :value="ruleRequest.cdId">{{ ruleRequest.cdNm }}</option>
                              </select>
                          </td>
                          <td v-else >
                            <select class="form-control" v-model="row.ruleRequest" title="전문KEY">
                                <option v-for="(ruleRequest, idx) in verificationRuleTab.proKeyList" :key="'ruleRequest_' + idx" :value="ruleRequest.cdId">{{ ruleRequest.cdNm }}</option>
                              </select>
                          </td>
                          <td v-if="retrieveData.divisionCd === 'SD00000002'">
                            <select class="form-control" v-model="row.valRuleName" title="KEY" disabled>
                              <option v-for="(key, idx) in verificationRuleTab.valKeyList" :key="'key_' + idx" :value="key.cdId">{{ key.cdNm }}</option>
                            </select>
                          </td>
                          <td v-else><input  class="form-control" v-model="row.valRuleName" type="text" title="KEY"></td>
                          <td>
                            <select class="form-control" v-model="row.defaultYn" title="필수여부">
                              <option v-for="(yn, idx) in tabDataList.ynList" :key="'defaultYn_' + idx" :value="yn.cdId">{{ yn.cdNm }}</option>
                            </select>
                          </td>
                          <td>
                            <select class="form-control" v-model="row.nullYn" title="널여부">
                              <option v-for="(yn, idx) in tabDataList.ynList" :key="'nullYn_' + idx" :value="yn.cdId">{{ yn.cdNm }}</option>
                            </select>
                          </td>
                          <td><input class="form-control" v-model="row.dataSize" type="number" title="길이"></td>
                          <td><input class="form-control" v-model="row.dataMax" type="number" title="최대"></td>
                          <td><input class="form-control" v-model="row.dataMin" type="text" title="최소"></td>
                          <td><input class="form-control" v-model="row.allowRegex" type="text" title="허용정규식"></td>
                          <td><input class="form-control" v-model="row.notallowRegex" type="text" title="비허용정규식"></td>
                          <td>
                            <select class="form-control" v-model="row.emptyYn" title="공백여부">
                              <option v-for="(yn, idx) in tabDataList.ynList" :key="'emptyYn_' + idx" :value="yn.cdId">{{ yn.cdNm }}</option>
                            </select>
                          </td>
                          <td v-if="retrieveData.divisionCd === 'SD00000002'">
                            <div class="py-1 text_left">
                              <div v-if="idx === 0 && verificationRuleTab.verificationRuleList.length === 1">
                                <button class="btn" type="button" @click="insertRowVerificationRuleTable"><span class="glyphicon glyphicon-plus" ></span></button>
                                <button class="btn" type="button" @click="deleteRowVerificationRuleTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                              </div>
                              <!-- <button v-else-if="idx === 0 && verificationRuleTab.verificationRuleList.length > 1" class="btn" type="button" @click="deleteRowVerificationRuleTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                              <div v-else>
                                <button class="btn" type="button" @click="insertRowVerificationRuleTable"><span class="glyphicon glyphicon-plus" ></span></button>
                                <button class="btn" type="button" @click="deleteRowVerificationRuleTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                              </div> -->
                              <div v-else-if="idx ===  verificationRuleTab.verificationRuleList.length - 1">
                                <button class="btn" type="button" @click="insertRowVerificationRuleTable"><span class="glyphicon glyphicon-plus" ></span></button>
                                <button class="btn" type="button" @click="deleteRowVerificationRuleTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                              </div>
                              <button v-else class="btn" type="button" @click="deleteRowVerificationRuleTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="mt-2 text-right">
                <button class="btn btn-info" type="button" :disabled="!this.apiTable.selectApiSeq" @click="fnCallInsertApi('verificationRule')">{{$t('save')}}</button>
              </div>
            </div>
            <!-- Tab 04 매핑룰 -->
            <div v-show="isSelectedTab('tab4')" role="tabpanel" class="tab_margin_style">
              <div class="row tab_margin_style">
                <div class="col-md-12">
                  <div v-show="retrieveData.devApiNm !== 'TCPCollector'" class="form-inline">
                      <span v-show="mappingRuleTab.isSaveMapList" class="lb-txt w100">설정됨</span>
                      <span v-show="!mappingRuleTab.isSaveMapList" class="lb-txt w100"> 미설정됨</span>
                  </div>
                  <div v-show="retrieveData.devApiNm === 'TCPCollector'" class="form-inline" style="margin-top:5px"> <!-- 타입 세팅 -->
                    <div class="form-group overflow">
                      <!-- <span class="form-control-static float-left">TYPE</span>
                      <select v-model="mappingRuleTab.type" name="" class="form-control float-left input-mt select-h-29" @change="changeMapTypeSelect" >
                        <option v-for="(type, idx) in mappingRuleTab.typeList" :key="'type_' + idx" :value="type.cdId" >{{ type.cdNm }}</option>
                      </select> -->
                        <span v-show="mappingRuleTab.isSaveMapList" class="lb-txt w100" style='margin: 7px 0 0 7px'> 설정됨</span>
                        <span v-show="!mappingRuleTab.isSaveMapList" class="lb-txt w100" style='margin: 7px 0 0 7px'> 미설정됨</span>
                    </div>
                  </div>
                  <div class="table-wrap auto overflow_x_scroll">
                    <table class="table table-col" style="min-width: 1480px;">
                      <caption></caption>
                      <colgroup>
                        <col style="width:150px;">
                        <col style="width:170px;">
                        <col style="width:110px;">
                        <col style="width:210px;">
                        <col style="width:170px;">
                        <col style="width:170px;">
                        <col style="width:110px;">
                        <col style="width:110px;">
                        <col style="width:100px;">
                      </colgroup>
                      <thead>
                        <tr>
                          <th v-for="(colNm, idx) in mappingRuleTab.colNameData" :key="'mappingRuleTableNm_' + idx">
                            {{ colNm }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(row, idx) in mappingRuleTab.mappingRuleList" :key="'mapping_' + idx">
                            <td>
                              <select class="form-control" v-model="row.ruleRequest" title="전문KEY" disabled>
                                <option v-for="(ruleRequest, idx) in tabDataList.proKeyList" :key="'ruleRequest_' + idx" :value="ruleRequest.cdId">{{ ruleRequest.cdNm }}</option>
                              </select>
                            </td>
                            <td>
                              <select class="form-control" v-model="row.ruleSourcekey" title="KEY" disabled>
                                <option v-for="(key, idx) in mappingRuleTab.purposeKeyList" :key="'key_' + idx" :value="key.cdId">{{ key.cdNm }}</option>
                              </select>
                            </td>
                            <td>
                              <select class="form-control" v-model="row.ruleTargetkey" title="목적키">
                                <option v-for="(ruleTargetkey, idx) in mappingRuleTab.purposeKeyList" :key="'ruleTargetkey_' + idx" :value="ruleTargetkey.cdId">{{ ruleTargetkey.cdNm }}</option>
                              </select>
                            </td>
                            <td>
                              <select class="form-control" v-model="row.exeFile" title="실행파일" @change="changeExeFileMappingRule(mappingRuleTab.mappingRuleList, idx, row.exeFile)">
                                <option v-for="(exe, idx) in tabDataList.exeFileList" :key="'exeFile_' + idx" :value="exe.cdId">{{ exe.cdNm }}</option>
                              </select>
                            </td>
                            <td><input class="form-control" v-model="row.ruleBytePosi" type="text" title="Byte위치" ></td>
                            <td><input class="form-control" v-model="row.ruleBitPosi" type="text" title="Bit위치" :disabled="row.exeFile === '1' || row.exeFile === '4' || row.exeFile === '2' || row.exeFile === '6' || row.exeFile === '9' || row.exeFile === '10'|| row.exeFile === '11'"></td>
                            <td>
                              <select class="form-control" v-model="row.ruleNumber" title="수" :disabled="row.exeFile === '6' || row.exeFile === '9'">
                                <option v-for="(ruleNumber, idx) in tabDataList.numberList" :key="'ruleNumber_' + idx" :value="ruleNumber.cdId">{{ ruleNumber.cdNm }}</option>
                              </select>
                            </td>
                            <td>
                              <select class="form-control" v-model="row.rulePoint" title="소수점" :disabled="row.exeFile === '6' || row.exeFile === '9'">
                                <option v-for="(rulePoint, idx) in tabDataList.decimalPointList" :key="'rulePoint_' + idx" :value="rulePoint.cdId">{{ rulePoint.cdNm }}</option>
                              </select>
                            </td>
                            <td>
                              <div class="py-1 text_left">
                                <div v-if="idx === 0 && mappingRuleTab.mappingRuleList.length === 1">
                                  <button class="btn" type="button" @click="insertRowMappingRuleTable"><span class="glyphicon glyphicon-plus"></span></button>
                                  <button class="btn" type="button" @click="deleteRowMappingRuleTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                                </div>
                                <!-- <button v-else-if="idx === 0 && mappingRuleTab.mappingRuleList.length > 1" class="btn" type="button" @click="deleteRowMappingRuleTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                                <div v-else>
                                  <button class="btn" type="button" @click="insertRowMappingRuleTable"><span class="glyphicon glyphicon-plus" ></span></button>
                                  <button class="btn" type="button" @click="deleteRowMappingRuleTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                                </div> -->
                                <div v-else-if="idx ===  mappingRuleTab.mappingRuleList.length - 1">
                                  <button class="btn" type="button" @click="insertRowMappingRuleTable"><span class="glyphicon glyphicon-plus" ></span></button>
                                  <button class="btn" type="button" @click="deleteRowMappingRuleTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                                </div>
                                <button v-else class="btn" type="button" @click="deleteRowMappingRuleTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                              </div>
                            </td>
                          </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="mt-2 text-right">
                <button class="btn btn-info" type="button" :disabled="disabledSaveButtonControl" @click="fnCallInsertApi('mappingRule')" >{{$t('save')}}</button>
              </div>
            </div>
            <!-- Tab 06 제어룰 -->
            <div v-show="isSelectedTab('tab6')" role="tabpanel">
              <div class="row tab_margin_style">
                <div class="col-md-12">
                  <div class="form-inline">
                    <span v-show="parsingRuleCtlTab.isSaveParseList" class="lb-txt w100">설정됨</span>
                    <span v-show="!parsingRuleCtlTab.isSaveParseList" class="lb-txt w100">미설정됨</span>
                  </div>
                  <div class="table-wrap auto overflow_x_scroll">
                      <table class="table table-col" style="min-width:1600px;">
                        <caption></caption>
                        <colgroup>
                          <col style="width:200px;">
                          <col style="width:150px;">
                          <col style="width:150px;">
                          <col style="width:150px;">
                          <col style="width:150px;">
                          <col style="width:150px;">
                          <col style="width:150px;">
                          <col style="width:100px;">
                          <col style="width:100px;">
                          <col style="width:100px;">
                        </colgroup>
                        <thead>
                          <tr>
                            <th v-for="(colNm, idx) in parsingRuleCtlTab.colNameData" :key="'parsingRuleCtlTab_' + idx">
                              {{ colNm }}
                            </th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(row, idx) in parsingRuleCtlTab.parsingRuleCtlList" :key="'parsingHead_' + idx">
                            <td>
                              <select class="form-control" v-model="row.ruleRequest" title="전문KEY" :disabled="row.exeFile === '6'">
                                <option v-for="(ruleRequest, idx) in tabDataList.proKeyList" :key="'ruleRequest_' + idx" :value="ruleRequest.cdId">{{ ruleRequest.cdNm }}</option>
                              </select>
                            </td>
                            <td><input class="form-control" v-model="row.ruleSourcekey" type="text" title="" :disabled="row.exeFile === '6'"></td>
                            <td><input class="form-control" v-model="row.ruleDefaultVal" type="text" title="" :disabled="row.exeFile === '6'"></td>
                            <td>
                              <input class="form-control" v-model="row.ruleTargetkey" type="text" title="" :disabled="row.exeFile === '6'">
                            </td>
                            <td>
                              <select class="form-control" v-model="row.exeFile" title="실행파일" @change="changeExeFile(parsingRuleAllTab.parsingRuleAllHeadList, idx, row.exeFile)">
                                <option v-for="(exe, idx) in tabDataList.exeFileList" :key="'exeFile_' + idx" :value="exe.cdId" >{{ exe.cdNm }}</option>
                              </select>
                            </td>
                            <td><input class="form-control" v-model="row.ruleBytePosi" type="text" title="Byte위치"></td>
                            <td><input class="form-control" v-model="row.ruleBitPosi" type="text" title="Bit위치" :disabled="row.exeFile === '1' || row.exeFile === '4' || row.exeFile === '2' || row.exeFile === '6' || row.exeFile === '9' || row.exeFile === '10'|| row.exeFile === '11'"></td>
                            <td>
                              <select class="form-control" v-model="row.ruleNumber" title="수" :disabled="row.exeFile === '6' || row.exeFile === '9'">
                                <option v-for="(ruleNumber, idx) in tabDataList.numberList" :key="'ruleNumber_' + idx" :value="ruleNumber.cdId" >{{ ruleNumber.cdNm }}</option>
                              </select>
                            </td>
                            <td>
                              <select class="form-control" v-model="row.rulePoint" title="소수점" :disabled="row.exeFile === '6' || row.exeFile === '9'">
                                <option v-for="(rulePoint, idx) in tabDataList.decimalPointList" :key="'rulePoint_' + idx" :value="rulePoint.cdId" >{{ rulePoint.cdNm }}</option>
                              </select>
                            </td>
                            <td>
                              <div class="py-1 text_left">
                                <button v-if="idx === 0 && parsingRuleCtlTab.parsingRuleCtlList.length === 1" class="btn" type="button" @click="insertRowCtlTable"><span class="glyphicon glyphicon-plus" ></span></button>
                                <div v-else-if="idx ===  parsingRuleCtlTab.parsingRuleCtlList.length - 1">
                                  <button class="btn" type="button" @click="insertRowCtlTable"><span class="glyphicon glyphicon-plus" ></span></button>
                                  <button class="btn" type="button" @click="deleteRowCtlTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                                </div>
                                <button v-else class="btn" type="button" @click="deleteRowCtlTable(idx)"><span class="glyphicon glyphicon-minus" ></span></button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                </div>
              </div>
              <div class="mt-2 text-right">
                <button class="btn btn-info" type="button" :disabled="disabledSaveButtonControl" @click="fnCallInsertApi('controlRule')" >{{$t('save')}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import Pagination from '@/components/Pagination'
import { getSvcList, getDevClsCdListBySvcCd, getCtlSvrListByParentCdId } from '@/api/common/usrSvcDevice'

export default {
  name: 'DeviceRuleSvc',
  components: {
    Pagination
  },
  props: {
  },
  data () {
    return {
      retrieveData: {
        divisionCd: '', // 조회 후 구분 값
        devClsCd: '', // 조회 후 단말 유형 값
        apiNm: '', // 조회 후 상단 API명
        devApiNm: '', // 조회 후 하단 API명
        serverNm: '' // 조회 후 서버명
      },
      displayRowCountList: [5, 10, 15],
      divisionList: [ // 구분 리스트
        { code: '', name: '서비스(ONLINE)' },
        { code: 'SD00000002', name: '단말유형' }
      ],
      svcCdList: [],
      apiText: '',
      modelTableText: '',
      tabText: '',
      svcCd: '', // 서비스코드
      divisionCd: '', // 구분 초기값
      devClsCd: '', // 단말 유형 값
      devClsList: [], // 단말 유형 리스트
      apiClsCd: '', // 서버 유형
      apiNm: '', // 상단 api명 검색
      devApiNm: '', // 하당 api명 검색
      apiTable: { // API 테이블
        data: [], // 조회 데이터
        colNameData: [this.$t('api-name'), this.$t('url'), this.$t('description'), this.$t('gubun')], // table 명 리스트
        selectApiSeq: '',
        selectApiNm: '',
        pageInfo: {
          currentPage: 1,
          rowCount: 5,
          totalPage: 1,
          callback: this.onPagingApiTable
        }
      },
      modelConversionTable: { // 모델 목록 테이블
        data: [], // 조회 데이터
        colNameData: [this.$t('model-type'), this.$t('dev-mdl-nm'), this.$t('manufacturer')], // table 명 리스트
        selectDevSeq: '',
        selectDevMdlCdNm: '',
        selectDevMdlNm: '',
        selectDevMdlCd: '',
        pageInfo: {
          currentPage: 1,
          rowCount: 5,
          totalPage: 1,
          callback: this.onPagingModelTable
        }
      },
      devConversionTable: { // 단말별 룰 목록 테이블
        data: [], // 조회 데이터
        colNameData: [this.$t('api-name'), this.$t('commuication-rule'), this.$t('parsing-rule'), this.$t('valid-rule'), this.$t('mapping-rule')], // table 명 리스트
        pageInfo: {
          currentPage: 1,
          rowCount: 5,
          totalPage: 1,
          callback: this.onPagingDevTable
        }
      },
      serverNmList: '', // 서버명리스트
      serverNm: '', // 서버명
      tabDataList: {
        proKeyList: [],
        keyList: [],
        purposeKeyList: [],
        exeFileList: [],
        numberList: [],
        decimalPointList: [],
        ynList: [
          { cdId: 'Y', cdNm: 'Y' },
          { cdId: 'N', cdNm: 'N' }
        ]
      },
      parsingRuleAllTab: {
        ruleColTypeHead: '',
        colNameData: [this.$t('commuication-format-key'), this.$t('key-en'), this.$t('purpose-key'), this.$t('exe-file'), this.$t('byte-length'), this.$t('bit-length'), this.$t('number'), this.$t('decimal-point')], // table 명 리스트
        type: '',
        typeList: [],
        headPurposeKeyList: [], // 파싱룰(전문) 헤더 목적키 리스트
        parsingRuleAllHeadList: [],
        isSaveParseHeadList: '',
        parsingRuleAllBodyList: [],
        isSaveParseBodyList: '',
        headDefaultData: [{
          ruleRequest: 'O_REQ_B',
          ruleSourcekey: 'con',
          ruleTargetkey: 'NA',
          exeFile: '7',
          ruleBytePosi: '',
          ruleBitPosi: '',
          ruleNumber: '0',
          rulePoint: '0'
        }],
        bodyDefaultData: [{
          ruleRequest: 'O_REQ_B',
          ruleSourcekey: '',
          ruleTargetkey: '',
          exeFile: '',
          ruleBytePosi: '',
          ruleBitPosi: '',
          ruleNumber: '',
          rulePoint: ''
        }]
      },
      parsingRuleCtlTab: {
        ruleColTypeHead: '',
        colNameData: [this.$t('commuication-format-key'), this.$t('key-en'), this.$t('defulat-key'), this.$t('purpose-key'), this.$t('exe-file'), this.$t('byte-length'), this.$t('bit-length'), this.$t('number'), this.$t('decimal-point')], // table 명 리스트
        type: '',
        typeList: [],
        headPurposeKeyList: [], // 파싱룰(전문) 헤더 목적키 리스트
        parsingRuleCtlList: [],
        isSaveParseHeadList: '',
        parsingRuleAllBodyList: [],
        isSaveParseBodyList: '',
        defaultData: [{
          ruleRequest: '',
          ruleSourcekey: '',
          ruleTargetkey: '',
          exeFile: '',
          ruleBytePosi: '',
          ruleBitPosi: '',
          ruleNumber: '',
          rulePoint: '',
          ruleDefulatVal: ''
        }]
      },
      parsingRuleTab: {
        ruleColType: '',
        colNameData: [this.$t('commuication-format-key'), this.$t('key-en'), this.$t('purpose-key'), this.$t('exe-file'), this.$t('byte-length'), this.$t('bit-length'), this.$t('number'), this.$t('decimal-point'), ''], // table 명 리스트
        parsingRuleList: [],
        isSaveParseList: '',
        defaultData: [{
          ruleRequest: '',
          ruleSourcekey: '',
          ruleTargetkey: '',
          exeFile: '',
          ruleBytePosi: '',
          ruleBitPosi: '',
          ruleNumber: '',
          rulePoint: ''
        }]
      },
      verificationRuleTab: {
        type: '',
        typeList: [],
        ruleColType: '',
        proKeyList: [], // 검증룰 전문키 리스트
        colNameData: [this.$t('commuication-format-key'), this.$t('key-en'), this.$t('default-yn'), this.$t('null-yn'), this.$t('length'), this.$t('min'), this.$t('max'), this.$t('allow-reg'), this.$t('not-allow-reg'), this.$t('empty-yn'), ''], // table 명 리스트
        verificationRuleList: [],
        isSaveValList: '',
        valKeyList: [],
        defaultData: [{
          ruleRequest: 'P_REQ_B',
          ruleSourcekey: '',
          defaultYn: 'Y',
          nullYn: 'Y',
          dataSize: '',
          dataMax: '',
          dataMin: '',
          allowRegex: '',
          notallowRegex: '',
          emptyYn: 'Y'
        }]
      },
      mappingRuleTab: {
        purposeKeyList: [], // 매핑룰 목적키 리스트 조회
        ruleColType: '',
        colNameData: [this.$t('commuication-format-key'), this.$t('key-en'), this.$t('purpose-key'), this.$t('exe-file'), this.$t('byte-length'), this.$t('bit-length'), this.$t('number'), this.$t('decimal-point'), ''], // table 명 리스트
        mappingRuleList: [],
        isSaveMapList: '',
        defaultData: [{
          ruleRequest: null,
          ruleSourcekey: '',
          ruleTargetkey: '',
          exeFile: '6',
          ruleBytePosi: '',
          ruleBitPosi: '',
          ruleNumber: null,
          rulePoint: null
        }]
      },
      serviceCallTab: {
        ruleColType: '',
        colNameData: [this.$t('model-type'), this.$t('dev-mdl-nm'), this.$t('useYn'), this.$t('manufacturer')], // table 명 리스트
        serviceCallDataList: [],
        serviceList: [],
        callApiSeq: '',
        defaultData: [{
          callApiSeq: ''
        }]
      },
      tabInfo: {
        selectedTab: ''
      },
      chkServerType: false,
      svrMsgType: 'none',
      svrMsgTypeList: [],
      xMid: 'P00070'
    }
  },
  created () {
    this.fnGetSvcCdList()
  },
  mounted () {
    this.divisionCd = 'SD00000002'
    this.fnSearchCommon(this.fnAddValProKeyList, '/online/rule/retrieveIotRequestKeyParseList', { parentCdId: 'GN00000173' }) // 검증룰 전문KEY 리스트 조회
    this.fnSearchCommon(this.fnAddProKeyList, '/online/rule/retrieveIotRequestKeyValList', { parentCdId: 'GN00000173' }) // 그 외 전문KEY 리스트 조회

    this.fnSearchCommon(this.fnAddMappingRuleTabPurposeKeyList, '/online/rule/retrieveIotTargetKeyList', {}) // 매핑룰 목적키 리스트 조회
    // this.fnSearchCommon(this.fnAddPurposeKeyList, '/online/rule/retrieveIotTargetKeyParseList', {}) // 그외 목적키 리스트 조회

    this.fnSearchCommon(this.fnAddNumberList, '/online/iotcmcd/retrieveIotByParentCmCdRuntime', { parentCdId: 'GN00000170' }) // 수 리스트 조회
    this.fnSearchCommon(this.fnAddDecimalPointList, '/online/iotcmcd/retrieveIotByParentCmCdRuntime', { parentCdId: 'GN00000171' }) // 소수점 리스트 조회
    this.fnSearchCommon(this.fnAddExeFileList, '/online/rule/retrieveIotRule', { runGubun: '1' }) // 실행파일 리스트 조회
  },
  computed: {
    parsingRuleAllTabVisible () {
      return this.retrieveData.divisionCd === 'SD00000002' && this.retrieveData.serverNm === 'GN00000047' && this.retrieveData.devApiNm === 'TCPCollector' && this.serverNm === 'GN00000047'
    },
    pasingRuleTabVisible () {
      return !(this.retrieveData.divisionCd === 'SD00000002' && this.retrieveData.serverNm === 'GN00000047' && this.retrieveData.devApiNm === 'TCPCollector') && this.retrieveData.divisionCd && this.serverNm === 'GN00000047'
    },
    verificationRuleTabVisible () {
      return this.serverNm === 'GN00000047'
    },
    mappingRuleTabVisible () {
      return this.retrieveData.divisionCd === 'SD00000002' && this.serverNm === 'GN00000047'
    },
    mappingCtlTabVisible () {
      return this.serverNm === 'GN00000048'
    },
    serviceCallTabVisible () {
      return this.retrieveData.divisionCd === 'SD00000002' && this.serverNm === 'GN00000047'
    },
    disabledSaveButtonControl () {
      if (this.divisionCd === 'SD00000002') {
        return !this.devApiNm || !this.serverNm
      } else {
        return false
      }
    }
  },
  watch: {
    // 서비스 코드 변경 시 장비유형 목록 갱신
    svcCd () {
      this.fnGetDevClsList()
    },
    // ApiSeq 변경시마다 검증룰 리스트 재조회
    'apiTable.selectApiSeq' (newVal) {
      console.log('[WATCH HOOK]  apiTable.selectApiSeq  /  ' + newVal)
      // 테이블 리스트 조기화
      this.initedTabTableList()
      this.apiText = ''
      if (newVal) {
        this.retrieveTabTableList()
      }
    },
    'modelConversionTable.selectDevSeq' (newVal) {
      console.log('[WATCH HOOK]  modelConversionTable.selectDevSeq  /  ' + newVal)
      // 테이블 리스트 조기화
      this.initedTabTableList()
      // 값이 있을 때
      if (newVal) {
        // 탭 테이블 리스트 조회
        this.retrieveTabTableList()
      }
    },
    serverNm (newVal) {
      console.log('[WATCH HOOK]  serverNm  /  ' + newVal)
      if (newVal === 'GN00000047') {
        this.chkServerType = false
      } else {
        this.chkServerType = true
      }
    }
  },
  methods: {
    fnGetSvcCdList() {
      getSvcList({ xMid: this.xMid })
        .then((data) => {
          this.svcCdList = data
          if (this.svcCdList.length > 0) {
            this.svcCd = this.svcCdList[0].svcCd
          }
        }).catch((e) => {
          console.error(e)
        })
    },
    fnGetDevClsList() {
      this.devClsCd = ''
      this.devClsList = []
      if (this.svcCd === '') {
        return false
      }
      getDevClsCdListBySvcCd({ xMid: this.xMid, svcCd: this.svcCd })
        .then((data) => {
          this.devClsList = data.devClsList
          if (this.devClsList.length > 0) {
            this.devClsCd = this.devClsList[0].devClsCd
            this.fnGetColSvrList()
          }
        }).catch((e) => {
          console.error(e)
        })
    },
    fnGetColSvrList() {
      getCtlSvrListByParentCdId({ xMid: this.xMid, parentCdId: 'GN00000330' })
        .then((data) => {
          this.svrMsgTypeList = data.reqSvrMsgType
          this.search()
        }).catch((e) => {
          console.error(e)
        })
    },
    fnSearchCommon(callback, requesturl, paramObj) {
      requestApi({
        url: requesturl,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: (res) => {
          if (res.result.status === '200') {
            callback(res.data)
          }
        }
      })
    },
    // 모델 목록 테이블 셋팅
    fnAddModelList (data) {
      this.modelConversionTable.pageInfo.totalPage = data.page.totPage
      this.modelConversionTable.pageInfo.rowCount = data.page.displayRowCount
      this.modelConversionTable.data = data.boardList
      if (data.boardList && data.boardList.length > 0) {
        this.selectModelTable(this.modelConversionTable.data[0].devSeq, this.modelConversionTable.data[0].devMdlCd, this.modelConversionTable.data[0].devClsCdNm, this.modelConversionTable.data[0].devMdlNm)
      } else {
        this.devConversionTable.data = []
        this.tabText = ''
        this.modelTableText = ''
      }
    },
    // 단말별 룰 목록 테이블 셋팅
    fnAddDevRuleList (data) {
      this.devConversionTable.pageInfo.totalPage = data.page.totPage
      this.devConversionTable.pageInfo.rowCount = data.page.displayRowCount
      this.devConversionTable.data = data.dataList
      this.devApiNm = '' // 단말별 룰 목록 초기화를 위해 값을 비운다
      this.apiTable.selectApiSeq = '' // 단말별 룰 목록 초기화를 위해 값을 비운다
      this.apiTable.selectApiNm = ''// 단말별 룰 목록 초기화를 위해 값을 비운다
      if (data.dataList && data.dataList.length > 0) {
        this.apiTable.selectApiSeq = data.dataList[0].apiSeq
        this.selectApiRuleTable(data.dataList[0].apiSeq, data.dataList[0].apiNm, data.dataList[0].serverGubun)
      } else {
        this.tabText = '(' + this.modelConversionTable.selectDevMdlCdNm + '/' + this.modelConversionTable.selectDevMdlNm + ')'
      }
    },
    // API 테이블 셋팅
    fnAddApiList (data) {
      this.apiTable.pageInfo.totalPage = data.page.totPage
      this.apiTable.pageInfo.rowCount = data.page.displayRowCount
      this.apiTable.data = data.dataList
      if (data.dataList && data.dataList.length > 0) {
        this.selectApiTable(data.dataList[0].apiSeq, data.dataList[0].apiNm)
      }
    },
    // 서버 리스트 셋팅
    fnAddServerList (data) {
      if (data && data.length > 0) {
        this.serverNmList = data
        this.serverNm = data[0].cdId
      } else {
        this.serverNmList = []
      }
    },
    // 타입 리스트 retrieveTbIotColValRuleInfo 후 실행되는 callback 함수
    fnAddTypeList (data) {
      this.parsingRuleAllTab.typeList = data
      this.verificationRuleTab.typeList = data
      this.mappingRuleTab.typeList = data
      if (data && data.length > 0) {
        this.parsingRuleAllTab.type = data[0].cdId
        this.verificationRuleTab.type = data[0].cdId
        this.mappingRuleTab.type = data[0].cdId
        this.changeTypeRadio()
        this.changeValTypeSelect()
        this.changeMapTypeSelect()
        this.changeTypeSelect()
        this.changeTabText(data[0].cdNm)
      }
    },
    // 실행파일 리스트 retrieveTbIotColValRuleInfo 후 실행되는 callback 함수
    fnAddExeFileList (data) {
      this.tabDataList.exeFileList = data
      if (data && data.length > 0) {
        this.parsingRuleAllTab.headDefaultData.exeFile = data[0].cdId
        this.parsingRuleAllTab.bodyDefaultData.exeFile = data[0].cdId
        this.parsingRuleTab.defaultData.exeFile = data[0].cdId
        this.mappingRuleTab.defaultData.exeFile = data[0].cdId
      }
    },

    // 파싱룰(전문) head table 목적키 리스트 retrieveTbIotColValRuleInfo 후 실행되는 callback 함수
    fnAddHeadParsingRuleAllTabHeadPurposeKeyList (data) {
      this.parsingRuleAllTab.headPurposeKeyList = data
      if (data && data.length > 0) {
        this.parsingRuleAllTab.headDefaultData.ruleTargetkey = data[0].cdId
      }
    },
    // 매핑룰 목적키 리스트 조회 후 실행되는 callback 함수
    fnAddMappingRuleTabPurposeKeyList (data) {
      this.mappingRuleTab.purposeKeyList = data
      if (data && data.length > 0) {
        this.mappingRuleTab.defaultData.ruleTargetkey = data[0].cdId
      }
    },
    // 그 외 목적키 리스트 조회 후 실행되는 callback 함수
    fnAddPurposeKeyList (data) {
      this.tabDataList.purposeKeyList = data
      if (data && data.length > 0) {
        this.parsingRuleAllTab.bodyDefaultData.ruleTargetkey = data[0].cdId
        this.parsingRuleTab.defaultData.ruleTargetkey = data[0].cdId
        this.verificationRuleTab.defaultData.ruleTargetkey = data[0].cdId
        // this.mappingRuleTab.defaultData.ruleTargetkey = data[0].cdId
      }
    },
    // 키 리스트 retrieveTbIotColValRuleInfo 후 실행되는 callback 함수
    fnAddKeyList (data) {
      this.tabDataList.keyList = data
      if (data && data.length > 0) {
        this.parsingRuleAllTab.headDefaultData.ruleSourcekey = data[0].cdId
        this.parsingRuleAllTab.bodyDefaultData.ruleSourcekey = data[0].cdId
        this.parsingRuleTab.defaultData.ruleSourcekey = data[0].cdId
        this.mappingRuleTab.defaultData.ruleSourcekey = data[0].cdId
        this.verificationRuleTab.defaultData.ruleSourcekey = data[0].cdId
      }
    },
    // 검증룰 전문키 리스트 retrieveTbIotColValRuleInfo 후 실행되는 callback 함수
    fnAddValProKeyList (data) {
      this.verificationRuleTab.proKeyList = data
      if (data && data.length > 0) {
        this.verificationRuleTab.defaultData.ruleRequest = data[0].cdId
      }
    },
    // 전문키 리스트 retrieveTbIotColValRuleInfo 후 실행되는 callback 함수
    fnAddProKeyList (data) {
      this.tabDataList.proKeyList = data
      if (data && data.length > 0) {
        this.parsingRuleAllTab.headDefaultData.ruleRequest = data[0].cdId
        this.parsingRuleAllTab.bodyDefaultData.ruleRequest = data[0].cdId
        this.parsingRuleTab.defaultData.ruleRequest = data[0].cdId
        this.mappingRuleTab.defaultData.ruleRequest = data[0].cdId
      }
    },
    // 수 리스트 retrieveTbIotColValRuleInfo 후 실행되는 callback 함수
    fnAddNumberList (data) {
      this.tabDataList.numberList = data
      if (data && data.length > 0) {
        this.parsingRuleAllTab.headDefaultData.ruleNumber = data[0].cdId
        this.parsingRuleAllTab.bodyDefaultData.ruleNumber = data[0].cdId
        this.parsingRuleTab.defaultData.ruleNumber = data[0].cdId
        this.mappingRuleTab.defaultData.ruleNumber = data[0].cdId
      }
    },
    // 소수점 리스트 retrieveTbIotColValRuleInfo 후 실행되는 callback 함수
    fnAddDecimalPointList (data) {
      this.tabDataList.decimalPointList = data
      if (data && data.length > 0) {
        this.parsingRuleAllTab.headDefaultData.rulePoint = data[0].cdId
        this.parsingRuleAllTab.bodyDefaultData.rulePoint = data[0].cdId
        this.parsingRuleTab.defaultData.rulePoint = data[0].cdId
        this.mappingRuleTab.defaultData.rulePoint = data[0].cdId
      }
    },
    // 서비스 리스트 retrieveTbIotColValRuleInfo 후 실행되는 callback 함수
    fnAddServiceList (data) {
      this.serviceCallTab.serviceList = data.dataList
      if (data.dataList && data.dataList.length > 0) {
        this.serviceCallTab.defaultData.callApiSeq = data.dataList[0].callApiSeq
      }
    },
    // 파싱룰(전문) Head 리스트 retrieveTbIotColValRuleInfo
    retrieveParsingRuleAllHeadList () {
      this.fnSearchCommon(this.fnAddParsingRuleAllHeadList, '/online/rule/retrieveTbIotColValRuleInfo', { ruleColType: 'GN00000183', apiSeq: this.apiTable.selectApiSeq, devSeq: this.modelConversionTable.selectDevSeq, ruleMsgType: 'H' + this.parsingRuleAllTab.type }) // 파싱룰(전문) 헤더 리스트 조회
    },
    // 파싱룰(전문) Body 리스트 조회
    retrieveParsingRuleAllBodyList () {
      this.fnSearchCommon(this.fnAddParsingRuleAllBodyList, '/online/rule/retrieveTbIotColTcpValRuleInfo', { ruleColType: 'GN00000183', apiSeq: this.apiTable.selectApiSeq, devSeq: this.modelConversionTable.selectDevSeq, devMdlCd: this.modelConversionTable.selectDevMdlCd, ruleMsgType: this.parsingRuleAllTab.type }) // 파싱룰(전문) body 리스트 조회
    },
    // 파싱룰 리스트 조회
    retrieveParsingRuleList () {
      this.fnSearchCommon(this.fnAddParsingRuleList, '/online/rule/retrieveTbIotColValRuleInfo', { ruleColType: 'GN00000184', apiSeq: this.apiTable.selectApiSeq, devSeq: this.modelConversionTable.selectDevSeq, ruleMsgType: this.parsingRuleAllTab.type }) // 파싱룰 리스트 조회
    },
    // 매핑룰 리스트 조회
    retrieveMappingRuleList () {
      this.fnSearchCommon(this.fnAddMappingRuleList, '/online/rule/retrieveTbIotColValRuleInfo', { ruleColType: 'GN00000186', apiSeq: this.apiTable.selectApiSeq, devSeq: this.modelConversionTable.selectDevSeq, ruleMsgType: this.parsingRuleAllTab.type }) // 매핑룰 리스트 조회
    },
    // 검증룰 리스트 조회
    retrieveVerificationRuleList () {
      this.fnSearchCommon(this.fnAddVerificationRuleList, '/online/rule/retrieveTbIotValRuleInfoList', { devSeq: this.modelConversionTable.selectDevSeq, apiSeq: this.apiTable.selectApiSeq, ruleMsgType: this.parsingRuleAllTab.type }) // 검증룰 리스트 조회
    },
    // 서비스 호출 리스트 조회
    retrieveServiceCallList () {
      this.fnSearchCommon(this.fnAddServiceCallList, '/online/rule/retrieveTbIotDevApiRule', { ruleColType: this.serviceCallTab.ruleColType, apiSeq: this.apiTable.selectApiSeq, devSeq: this.modelConversionTable.selectDevSeq }) // 서비스 호출 리스트 조회
    },
    // 제어룰 리스트 조회
    retrieveCtlRuleList () {
      this.fnSearchCommon(this.fnAddCtlRuleList, '/online/rule/retrieveTbIotCtlValRuleInfo', { ruleColType: 'GN00000209', apiSeq: this.apiTable.selectApiSeq, devSeq: this.modelConversionTable.selectDevSeq, ruleMsgType: this.parsingRuleAllTab.type }) // 제어룰 리스트 조회
    },
    // 파싱룰(전문) 헤드 테이블 리스트 조회 후 실행되는 callback 함수
    fnAddParsingRuleAllHeadList (data) {
      this.parsingRuleAllTab.parsingRuleAllHeadList = data.dataList
      if (data.dataList.length === 0) {
        this.parsingRuleAllTab.isSaveParseHeadList = ''
        this.insertRowParsingRuleAllHeadTable()
      } else if (this.retrieveData.devApiNm !== 'TCPCollector') {
      }
      if (data.dataList.length > 0) {
        this.parsingRuleAllTab.isSaveParseHeadList = 'saved'
      }
    },
    // 파싱룰(전문) body 테이블 리스트 조회 후 실행되는 callback 함수
    fnAddParsingRuleAllBodyList (data) {
      // this.parsingRuleAllTab.parsingRuleAllBodyList = data.dataList
      this.parsingRuleAllTab.parsingRuleAllBodyList = _.cloneDeep(data.dataList)
      if (data.dataList.length === 0) {
        this.parsingRuleAllTab.isSaveParseBodyList = ''
        this.purposeRowParsingRuleAllBodyTable()
        // this.insertRowParsingRuleAllBodyTable()
        // 데이터가 없을 경우 목적키 갯수 만큼 넣어 줘야된다.
      }
      if (data.dataList.length > 0) {
        this.parsingRuleAllTab.isSaveParseBodyList = 'saved'
      }
    },
    // 파싱룰 테이블 리스트 조회 후 실행되는 callback 함수
    fnAddParsingRuleList (data) {
      // this.parsingRuleTab.parsingRuleList = data.dataList
      this.parsingRuleTab.parsingRuleList = _.cloneDeep(data.dataList)
      this.parsingRuleTab.isSaveParseList = ''
      if (data.dataList.length === 0) {
        // this.insertRowParsingRuleTable()
        let purposeKeyLength = this.tabDataList.purposeKeyList.length
        for (let i = 0; i < purposeKeyLength; i++) {
          let defaultObj = {
            ruleRequest: '',
            ruleSourcekey: '',
            ruleTargetkey: this.tabDataList.purposeKeyList[i].cdId,
            exeFile: '6',
            ruleBytePosi: '',
            ruleBitPosi: '',
            ruleNumber: '',
            rulePoint: ''
          }
          this.parsingRuleTab.parsingRuleList.push(defaultObj)
        }
      }
      if (data.dataList.length > 0) {
        this.parsingRuleTab.isSaveParseList = 'saved'
      }
    },
    // 제어룰 테이블 리스트 조회 후 실행되는 callback 함수
    fnAddCtlRuleList (data) {
      this.parsingRuleCtlTab.parsingRuleCtlList = data.dataList
      this.parsingRuleCtlTab.isSaveParseList = ''
      if (data.dataList.length === 0) {
        let defaultObj = {
          ruleRequest: '',
          ruleSourcekey: '',
          ruleTargetkey: '',
          exeFile: '',
          ruleBytePosi: '',
          ruleBitPosi: '',
          ruleNumber: '',
          rulePoint: ''
        }
        this.parsingRuleCtlTab.parsingRuleCtlList.push(defaultObj)
      }

      if (data.dataList.length > 0) {
        this.parsingRuleCtlTab.isSaveParseList = 'saved'
      }

      if (data.svrMsgType) {
        this.svrMsgType = data.svrMsgType.svrMsgType
      } else {
        this.svrMsgType = 'none'
      }
    },
    // 검증룰 테이블 리스트 조회 후 실행되는 callback 함수
    fnAddVerificationRuleList (data) {
      this.verificationRuleTab.verificationRuleList = _.cloneDeep(data.dataList)
      this.verificationRuleTab.isSaveValList = ''
      if (data.dataList.length === 0 && this.divisionCd === 'SD00000002') {
        for (let i = 0; i < this.verificationRuleTab.valKeyList.length; i++) {
          let defaultObj = {
            ruleRequest: 'P_REQ_B',
            valRuleName: this.verificationRuleTab.valKeyList[i].cdId,
            defaultYn: 'Y',
            nullYn: 'Y',
            dataSize: '',
            dataMax: '',
            dataMin: '',
            allowRegex: '',
            notallowRegex: '',
            emptyYn: 'Y'
          }
          this.verificationRuleTab.verificationRuleList.push(defaultObj)
        }
      } else if (data.dataList.length === 0 && this.divisionCd !== 'SD00000002') {
        this.insertRowVerificationRuleTable()
      }
      if (data.dataList.length > 0) {
        this.verificationRuleTab.isSaveValList = 'saved'
      }
    },
    // 매핑룰 테이블 리스트 조회 후 실행되는 callback 함수
    fnAddMappingRuleList (data) {
      this.mappingRuleTab.mappingRuleList = data.dataList
      this.mappingRuleTab.isSaveMapList = ''
      this.mappingRuleTab.mappingRuleList = _.cloneDeep(data.dataList)
      if (data.dataList.length === 0) {
        // this.insertRowMappingRuleTable()
        for (let i = 0; i < this.mappingRuleTab.purposeKeyList.length; i++) {
          let defaultObj = {
            ruleRequest: 'P_REQ_B',
            ruleSourcekey: this.mappingRuleTab.purposeKeyList[i].cdId,
            ruleTargetkey: this.mappingRuleTab.purposeKeyList[i].cdId,
            exeFile: '6',
            ruleBytePosi: '',
            ruleBitPosi: '',
            ruleNumber: '',
            rulePoint: ''
          }
          this.mappingRuleTab.mappingRuleList.push(defaultObj)
        }
      }
      if (data.dataList.length > 0) {
        this.mappingRuleTab.isSaveMapList = 'saved'
      }
    },
    // 서비스 호출 테이블 리스트 조회 후 실행되는 callback 함수
    fnAddServiceCallList (data) {
      this.serviceCallTab.serviceCallDataList = data.dataList
      if (data.dataList.length === 0) {
        this.insertRowServiceCallTable()
      }
    },
    fnValKeyList (data) {
      this.tabDataList.keyList = data
      this.verificationRuleTab.valKeyList = data
      this.mappingRuleTab.purposeKeyList = data
    },
    // 파싱룰(전문) head 테이블 row 추가
    insertRowParsingRuleAllHeadTable () {
      this.parsingRuleAllTab.parsingRuleAllHeadList = _.cloneDeep(this.parsingRuleAllTab.parsingRuleAllHeadList.concat(this.parsingRuleAllTab.headDefaultData))
    },
    // 파싱룰(전문) body 테이블 row 추가
    insertRowParsingRuleAllBodyTable () {
      this.parsingRuleAllTab.parsingRuleAllBodyList = _.cloneDeep(this.parsingRuleAllTab.parsingRuleAllBodyList.concat(this.parsingRuleAllTab.bodyDefaultData))
    },
    // 파싱룰(전문) 목적키 갯수만큼 row 추가
    purposeRowParsingRuleAllBodyTable () {
      let purposeKeyLength = this.tabDataList.purposeKeyList.length
      for (let i = 0; i < purposeKeyLength; i++) {
        let objData = {
          ruleRequest: 'O_REQ_B',
          ruleSourcekey: 'con',
          ruleTargetkey: '',
          exeFile: '7',
          ruleBytePosi: '',
          ruleBitPosi: '',
          ruleNumber: '0',
          rulePoint: '0'
        }
        objData.ruleTargetkey = this.tabDataList.purposeKeyList[i].cdId
        this.parsingRuleAllTab.parsingRuleAllBodyList.push(objData)
      }
    },
    // 파싱룰 테이블 row 추가
    insertRowParsingRuleTable () {
      this.parsingRuleTab.parsingRuleList = _.cloneDeep(this.parsingRuleTab.parsingRuleList.concat(this.parsingRuleTab.defaultData))
    },
    // 검증룰 테이블 row 추가
    insertRowVerificationRuleTable () {
      this.verificationRuleTab.verificationRuleList = _.cloneDeep(this.verificationRuleTab.verificationRuleList.concat(this.verificationRuleTab.defaultData))
    },
    // 매핑룰 테이블 row 추가
    insertRowMappingRuleTable () {
      this.mappingRuleTab.mappingRuleList = _.cloneDeep(this.mappingRuleTab.mappingRuleList.concat(this.mappingRuleTab.defaultData))
    },
    // 서비스 호출 테이블 row 추가
    insertRowServiceCallTable () {
      this.serviceCallTab.serviceCallDataList = _.cloneDeep(this.serviceCallTab.serviceCallDataList.concat(this.serviceCallTab.defaultData))
    },
    // 제어룰 테이블 row 추가
    insertRowCtlTable () {
      this.parsingRuleCtlTab.parsingRuleCtlList = _.cloneDeep(this.parsingRuleCtlTab.parsingRuleCtlList.concat(this.parsingRuleCtlTab.defaultData))
    },
    // 제어룰 테이블 row 삭제
    deleteRowCtlTable (idx) {
      this.parsingRuleCtlTab.parsingRuleCtlList.splice(idx, 1)
    },
    // 파싱룰(전문) head 테이블 row 삭제
    deleteRowParsingRuleAllHeadTable (idx) {
      this.parsingRuleAllTab.parsingRuleAllHeadList.splice(idx, 1)
    },
    // 파싱룰(전문) body 테이블 row 삭제
    deleteRowParsingRuleAllBodyTable (idx) {
      this.parsingRuleAllTab.parsingRuleAllBodyList.splice(idx, 1)
    },
    // 파싱룰 테이블 row 삭제
    deleteRowParsingRuleTable (idx) {
      this.parsingRuleTab.parsingRuleList.splice(idx, 1)
    },
    // 검증룰 테이블 row 삭제
    deleteRowVerificationRuleTable (idx) {
      this.verificationRuleTab.verificationRuleList.splice(idx, 1)
    },
    // 매핑룰 테이블 row 삭제
    deleteRowMappingRuleTable (idx) {
      this.mappingRuleTab.mappingRuleList.splice(idx, 1)
    },
    // 서비스 호출 테이블 row 삭제
    deleteRowServiceCallTable (idx) {
      this.serviceCallTab.serviceCallDataList.splice(idx, 1)
    },
    // 파싱룰(전문) head 테이블 저장
    saveParsingRuleAllHeadTable () {
      // this.fnNullValid(this.parsingRuleAllTab.parsingRuleAllHeadList)
      // this.fnSearchCommon(this.retrieveParsingRuleAllHeadList, '/online/rule/insertTbIoTDevColRule', { 'dataList': this.parsingRuleAllTab.parsingRuleAllHeadList, apiSeq: this.apiTable.selectApiSeq, devSeq: this.modelConversionTable.selectDevSeq, ruleColType: 'GN00000183' }) // 파싱룰(전문) head 테이블 저장
      this.fnSearchCommon(this.saveParsingRuleAllHeadList, '/online/rule/insertTbIoTDevColRule', { 'dataList': this.parsingRuleAllTab.parsingRuleAllHeadList, apiSeq: this.apiTable.selectApiSeq, devSeq: this.modelConversionTable.selectDevSeq, ruleColType: 'GN00000183', ruleMsgType: 'H' + this.parsingRuleAllTab.type, ruleDevType: this.devClsCd })
    },
    saveParsingRuleAllHeadList () {
      this.retrieveParsingRuleAllHeadList()
      this.alert('저장되었습니다.', 'success')
    },
    // 파싱룰(전문) body 테이블 저장
    saveParsingRuleAllBodyTable () {
      // this.fnNullValid(this.parsingRuleAllTab.parsingRuleAllBodyList)
      let duplicationCheck = this.checkDuplicateInObject('ruleTargetkey', this.parsingRuleAllTab.parsingRuleAllBodyList)
      if (duplicationCheck) {
        let msg = '같은 목적키 값이 존재 할 수 없습니다.'
        this.alert(msg)
        return
      }
      this.fnSearchCommon(this.saveParsingRuleAllBodyList, '/online/rule/insertTbIoTDevColRule', { 'dataList': this.parsingRuleAllTab.parsingRuleAllBodyList, apiSeq: this.apiTable.selectApiSeq, devSeq: this.modelConversionTable.selectDevSeq, devMdlCd: this.modelConversionTable.selectDevMdlCd, ruleColType: 'GN00000183', ruleMsgType: this.parsingRuleAllTab.type, ruleDevType: this.devClsCd }) // 파싱룰(전문) body 테이블 저장
    },
    // 제어룰 테이블 저장
    saveControlRuleTable () {
      this.fnSearchCommon(this.saveControlRuleList, '/online/rule/insertTbIoTDevCtlRule', { 'dataList': this.parsingRuleCtlTab.parsingRuleCtlList, apiSeq: this.apiTable.selectApiSeq, devSeq: this.modelConversionTable.selectDevSeq, ruleColType: 'GN00000209', ruleMsgType: this.parsingRuleAllTab.type, ruleDevType: this.devClsCd, svrMsgType: this.svrMsgType, devMdlCd: this.modelConversionTable.selectDevMdlCd, devClsCd: this.devClsCd })
    },
    saveControlRuleList () {
      this.retrieveCtlRuleList()
      this.alert('저장되었습니다.', 'success')
    },
    saveParsingRuleAllBodyList () {
      this.retrieveParsingRuleAllBodyList()
      this.alert('저장되었습니다.', 'success')
    },
    // 파싱룰 테이블 저장
    saveParsingRuleTable () {
      this.fnSearchCommon(this.saveParsingRuleList, '/online/rule/insertTbIoTDevColRule', { 'dataList': this.parsingRuleTab.parsingRuleList, apiSeq: this.apiTable.selectApiSeq, devSeq: this.modelConversionTable.selectDevSeq, ruleColType: 'GN00000184', ruleDevType: this.devClsCd, ruleMsgType: this.parsingRuleAllTab.type }) // 파싱룰 테이블 저장
    },
    saveParsingRuleList () {
      this.retrieveParsingRuleList()
      this.alert('저장되었습니다.', 'success')
    },
    // 검증룰 테이블 저장
    saveVerificationRuleTable () {
      let duplicationCheck = this.checkDuplicateInObject('valRuleName', this.verificationRuleTab.verificationRuleList)
      if (duplicationCheck) {
        let msg = '같은 키 값이 존재 할 수 없습니다.'
        this.alert(msg)
        return
      }
      this.fnSearchCommon(this.saveVerificationRuleList, '/online/rule/insertTbIoTValRule', { 'dataList': this.verificationRuleTab.verificationRuleList, apiSeq: this.apiTable.selectApiSeq, devSeq: this.modelConversionTable.selectDevSeq, ruleMsgType: this.parsingRuleAllTab.type }) // 검증룰 테이블 저장
    },
    saveVerificationRuleList () {
      this.retrieveVerificationRuleList()
      this.alert('저장되었습니다.', 'success')
    },
    // 매핑룰 테이블 저장
    saveMappingRuleTable () {
      let mappingCheckRule = this.mappingRuleTab.mappingRuleList.map(item => {
        return item.ruleSourcekey + ' / ' + item.ruleTargetkey
      })
      // 목적키 및 키 값 중복 체크
      for (let i = 0; i < mappingCheckRule.length; i++) {
        for (let j = 0; j < i; j++) {
          if (mappingCheckRule[i] === mappingCheckRule[j]) {
            let msg = mappingCheckRule[i] + '이(가) 중복되었습니다.'
            this.alert(msg)
            return
          }
        }
      }
      // let duplicationKeyCheck = this.checkDuplicateInObject('ruleSourcekey', this.mappingRuleTab.mappingRuleList)
      // if (duplicationKeyCheck) {
      //   alert('같은 키 값이 존재 할 수 없습니다.')
      // }
      // let duplicationTargetKeyCheck = this.checkDuplicateInObject('ruleTargetkey', this.mappingRuleTab.mappingRuleList)
      // if (duplicationTargetKeyCheck) {
      //   alert('같은 목적 키 값이 존재 할 수 없습니다.')
      // }
      this.fnSearchCommon(this.saveMappingRuleList, '/online/rule/insertTbIoTDevColRule', { 'dataList': this.mappingRuleTab.mappingRuleList, apiSeq: this.apiTable.selectApiSeq, devSeq: this.modelConversionTable.selectDevSeq, ruleColType: 'GN00000186', ruleMsgType: this.parsingRuleAllTab.type, ruleDevType: this.devClsCd }) // 매핑룰 테이블 저장
    },
    saveMappingRuleList() {
      this.retrieveMappingRuleList()
      this.alert('저장되었습니다.', 'success')
    },
    // 서비스 호출 테이블 저장
    // saveServiceCallTable () {
    //   let serviceCallCheckRule = this.serviceCallTab.serviceCallDataList.map(item => {
    //     return item.callApiSeq
    //   })
    //   // 목적키 및 키 값 중복 체크
    //   for (let i = 0; i < serviceCallCheckRule.length; i++) {
    //     for (let j = 0; j < i; j++) {
    //       if (serviceCallCheckRule[i] === serviceCallCheckRule[j]) {
    //         let msgName = this.serviceCallTab.serviceList.filter(item => {
    //           return item.callApiSeq === serviceCallCheckRule[i]
    //         })
    //         let msg = msgName[0].callApiNm + '이(가) 중복되었습니다.'
    //         this.alert(msg)
    //         return
    //       }
    //     }
    //   }
    //   this.fnSearchCommon(this.retrieveServiceCallList, '/online/rule/insertTbIotDevApiRule', { 'dataList': this.serviceCallTab.serviceCallDataList, apiSeq: this.apiTable.selectApiSeq, devSeq: this.modelConversionTable.selectDevSeq }) // 서비스 호출 테이블 저장
    //   this.alert('저장되었습니다.', 'success')
    // },
    // 상단 조회 버튼 클릭
    search () {
      this.retrieveTabTableList()
      this.fnSearchCommon(this.fnAddHeadParsingRuleAllTabHeadPurposeKeyList, '/online/rule/retrieveIotTargetKeyParseHeaderList', { paramVal: this.devClsCd }) // 파싱룰(전문) 헤더 목적키 리스트 조회: FIXME: 네트워크 에러
      this.fnSearchCommon(this.fnAddTypeList, '/online/rule/retrieveIotBodyType', { parentCdId: 'CM00000000', devClsCd: this.devClsCd, serverGubun: 'CM00000002' }) // 파싱룰(전문) Type 목록 조회
      this.apiTable.selectApiSeq = ''
      this.apiTable.selectApiNm = ''
      this.verificationRuleTab.type = ''
      this.mappingRuleTab.type = ''
      this.modelConversionTable.selectDevSeq = ''
      this.modelConversionTable.selectDevMdlNm = ''
      this.modelConversionTable.selectDevMdlCd = ''
      this.modelConversionTable.selectDevMdlCdNm = ''
      this.retrieveData.divisionCd = this.divisionCd
      // 구분값이 단말 유형 일 때
      if (this.divisionCd === 'SD00000002') {
        this.modelConversionTable.pageInfo.currentPage = 1 // 검색시 현재 페이지 초기화
        this.fnSearchCommon(this.fnAddModelList, '/online/iotdev/retrieveIotDev', { svcCd: this.svcCd, devClsCd: this.devClsCd, displayRowCount: this.modelConversionTable.pageInfo.rowCount, currentPage: this.modelConversionTable.pageInfo.currentPage }) // 모델 목록 테이블 조회
        this.fnSearchCommon(this.fnAddServerList, '/online/rule/retrieveIotServiceList', {}) // 서버명 리스트 조회
        this.devApiNm = ''
      } else { // 그 외(서비스)
        this.apiTable.pageInfo.currentPage = 1 // 검색시 현재 페이지 초기화
        this.fnSearchCommon(this.fnAddApiList, '/online/com/api/getIotApi', { apiNm: this.apiNm, displayRowCount: this.apiTable.pageInfo.rowCount, currentPage: this.apiTable.pageInfo.currentPage, serverGubun: this.retrieveData.divisionCd === '' ? 'GN00000051' : '' }) // API 테이블 조회
      }
      this.tabActiveSetting()
    },
    // API 테이블 더블 클릭시 호출되는 함수
    selectApiTable (apiSeq, apiNm) {
      this.apiTable.selectApiSeq = apiSeq
      this.apiTable.selectApiNm = apiNm
      this.fnSearchCommon(this.fnAddKeyList, '/online/com/api/retrieveTbIotParamCd', { apiSeq: this.apiTable.selectApiSeq }) // KEY 리스트 조회
      this.retrieveTabTableList()
      // this.insertRowVerificationRuleTable()
    },
    // 모델 테이블 셀 클릭시 호출되는 함수
    selectModelTable (modelDevSeq, modelDevMdlCd, modelDevMdlCdNm, modelDevMdlNm) {
      this.modelTableText = ''
      this.tabText = ''
      this.modelConversionTable.selectDevSeq = modelDevSeq
      this.modelConversionTable.selectDevMdlCd = modelDevMdlCd
      this.modelConversionTable.selectDevMdlNm = modelDevMdlNm
      this.modelConversionTable.selectDevMdlCdNm = modelDevMdlCdNm
      this.modelTableText = '(' + this.modelConversionTable.selectDevMdlCdNm + '/' + this.modelConversionTable.selectDevMdlNm + ')'
      this.devConversionTable.pageInfo.currentPage = 1 // 검색시 현재 페이지 초기화
      if (this.modelConversionTable.selectDevSeq) {
        // devSeq 값에 따른 목적키 값의 개수가 변경 되야 하기 때문에 목적키 재조회
        this.fnSearchCommon(this.fnAddDevRuleList, '/online/rule/devColRuleSettingInfo', { devSeq: this.modelConversionTable.selectDevSeq, displayRowCount: this.devConversionTable.pageInfo.rowCount, currentPage: this.devConversionTable.pageInfo.currentPage }) // 단말별 룰 목록 테이블 조회
        this.fnSearchCommon(this.fnAddPurposeKeyList, '/online/rule/retrieveIotTargetKeyParseList', { devSeq: this.modelConversionTable.selectDevSeq }) // 그외 목적키 리스트 조회
        // this.fnSearchCommon(this.fnAddServiceList, '/online/rule/retrieveTbIotDevApiRuleInputList', { devSeq: this.modelConversionTable.selectDevSeq, apiSeq: this.apiTable.selectApiSeq }) // 서비스 리스트 조회 콤보박스 리스트
        this.fnSearchCommon(this.fnValKeyList, '/online/rule/retrieveIotTargetKeyParseList', { devSeq: this.modelConversionTable.selectDevSeq, apiSeq: this.apiTable.selectApiSeq, isTcp: this.apiTable.apiNm }) // 서버명 리스트 조회
      } else {
        this.serviceCallTab.serviceList = []
        this.devConversionTable.data = []
        this.tabDataList.purposeKeyList = []
        this.tabDataList.keyList = []
        this.verificationRuleTab.valKeyList = []
        this.mappingRuleTab.purposeKeyList = []
      }
      // this.initedTabTableList()
      this.tabActiveSetting()
    },
    // 룰리스트 셀 클릭시 호출되는 함수
    selectApiRuleTable (apiSeq, apiNm, serverGubun) {
      this.retrieveData.devApiNm = ''
      this.devApiNm = apiNm // 팝업에서 선택한 값을 devApiNm 으로 넣어준다.
      this.apiTable.selectApiSeq = apiSeq // 팝업에서 선택한 값을 apiSeq 로 넣어준다 (검증룰 리스트 조회 위해)
      this.retrieveData.devApiNm = this.devApiNm
      this.apiTable.selectApiNm = apiNm
      this.serverNm = serverGubun
      this.changeTabList('S')
      this.retrieveData.serverNm = this.serverNm
      this.changeTabText()
      this.tabActiveSetting()
    },
    retrieveTabTableList () {
      if (!this.retrieveData.divisionCd) {
        this.retrieveVerificationRuleList() // 검증룰 리스트 조회
      } else {
        if (this.modelConversionTable.selectDevSeq && this.apiTable.selectApiSeq) {
          if (this.retrieveData.divisionCd === 'SD00000002' && this.retrieveData.serverNm === 'GN00000047' && this.retrieveData.devApiNm === 'TCPCollector') {
            this.fnSearchCommon(this.fnAddTypeList, '/online/rule/retrieveIotBodyType', { parentCdId: 'CM00000000', devClsCd: this.devClsCd, serverGubun: 'CM00000002' }) // 파싱룰(전문) Type 목록 조회
            this.retrieveParsingRuleAllHeadList() // 파싱룰(전문) 헤드 리스트 조회
            this.retrieveMappingRuleList() // 매핑룰 리스트 조회
            // this.retrieveServiceCallList() // 서비스호출 리스트 조회
            this.retrieveVerificationRuleList() // 검증룰 리스트 조회
          } else if (this.serverNm === 'GN00000048') {
            this.retrieveCtlRuleList() // 파싱룰 리스트 조회
          } else if (!(this.retrieveData.divisionCd === 'SD00000002' && this.retrieveData.serverNm === 'GN00000047' && this.retrieveData.devApiNm === 'TCPCollector') && this.retrieveData.divisionCd) {
            this.retrieveParsingRuleList() // 파싱룰 리스트 조회
            this.retrieveMappingRuleList() // 매핑룰 리스트 조회
            this.retrieveVerificationRuleList() // 검증룰 리스트 조회
            // this.retrieveServiceCallList() // 서비스호출 리스트 조회
          }
        }
      }
    },
    // API 를 조회하는 팝업을 여는 함수
    openSearchApiPopup () {
      this.popup({
        component: () => import('@/views/env/program/apiMgmtSearch'),
        title: this.$t('apiMgmt-retrieve'),
        width: '900',
        height: '500',
        data: {
          url: '/online/com/api/getIotApi',
          xMid: this.xMid,
          serverGubun: this.serverNm
        },
        callback: (obj) => {
          this.devApiNm = obj.apiNm // 팝업에서 선택한 값을 devApiNm 으로 넣어준다.
          this.apiTable.selectApiSeq = obj.apiSeq // 팝업에서 선택한 값을 apiSeq 로 넣어준다 (검증룰 리스트 조회 위해)
          let target = document.getElementById('typeSelect')
          this.changeTabList('A')
          this.changeTabText(target.options[target.selectedIndex].text)
        }
      })
    },
    openTypeCopyPopup () {
      this.popup({
        component: () => import('@/views/env/device/DeviceRuleCopy'),
        title: this.$t('deviceRule-copy'),
        width: '500',
        height: '250',
        data: {
          xMid: this.xMid,
          typeList: this.parsingRuleAllTab.typeList,
          devClsCd: this.devClsCd,
          orgMsgType: this.parsingRuleAllTab.type,
          apiSeq: this.apiTable.selectApiSeq,
          typeNm: $('#typeSelect option:checked').text()
        },
        callback: () => {}
      })
    },
    // 서버명, API명 변경되었을 때 호출되는 이벤트
    changeTabList (gubun) {
      this.retrieveData.devApiNm = this.devApiNm
      this.retrieveData.serverNm = this.serverNm
      this.tabActiveSetting()
      if (this.serverNm === 'GN00000047') {
        this.fnSearchCommon(this.fnAddHeadParsingRuleAllTabHeadPurposeKeyList, '/online/rule/retrieveIotTargetKeyParseHeaderList', { paramVal: this.devClsCd }) // 파싱룰(전문) 헤더 목적키 리스트 조회: FIXME: 네트워크 에러
      }
      if (gubun === 'S') {
        var serverGubunCd = ''
        if (this.serverNm === 'GN00000047') {
          serverGubunCd = 'CM00000002'
        } else {
          serverGubunCd = 'CM00000001'
        }
        this.fnSearchCommon(this.fnAddTypeList, '/online/rule/retrieveIotBodyType', { parentCdId: 'CM00000000', devClsCd: this.devClsCd, serverGubun: serverGubunCd }) // 파싱룰(전문) Type 목록 조회
      }
    },
    tabActiveSetting () {
      if (this.retrieveData.divisionCd === 'SD00000002' && this.retrieveData.serverNm === 'GN00000047' && this.retrieveData.devApiNm === 'TCPCollector') {
        this.selectTab('tab1')
      } else if (this.serverNm === 'GN00000048') {
        this.selectTab('tab6')
      } else if (!(this.retrieveData.divisionCd === 'SD00000002' && this.retrieveData.serverNm === 'GN00000047' && this.retrieveData.devApiNm === 'TCPCollector') && this.retrieveData.divisionCd) {
        this.selectTab('tab2')
      } else if (!this.retrieveData.divisionCd) {
        this.selectTab('tab3')
      }
      // this.fnSearchCommon(this.fnValKeyList, '/online/rule/retriveTbIotColParseData', { devSeq: this.modelConversionTable.selectDevSeq, apiSeq: this.apiTable.selectApiSeq }) // 서버명 리스트 조회
      // this.fnSearchCommon(this.fnAddsvrMsgTypeList, '/online/iotctlsvr/retrieveIotCtlSvr', { parentCdId: 'GN00000330', devMdlCd: this.modelConversionTable.selectDevMdlCd }) // 제어대상서버 리스트 조회
      if (this.modelConversionTable.selectDevSeq) {
        this.fnSearchCommon(this.fnValKeyList, '/online/rule/retrieveIotTargetKeyParseList', { devSeq: this.modelConversionTable.selectDevSeq, apiSeq: this.apiTable.selectApiSeq }) // 서버명 리스트 조회
      }
      this.retrieveTabTableList()
    },
    // 파싱룰(전문) 탭 내 type 테이블 라디오 버튼 변경시 호출되는 함수
    changeTypeRadio () {
      let target = document.getElementById('typeSelect')
      try {
        this.changeTabText(target.options[target.selectedIndex].text)
      } catch (e) {
      }
      if (this.modelConversionTable.selectDevSeq && this.apiTable.selectApiSeq) { // 필수값이 있으면 파싱룰 전문 (바디) 리스트 조회
        this.retrieveParsingRuleAllBodyList()
        this.retrieveParsingRuleAllHeadList()
        this.retrieveParsingRuleList()
        this.retrieveVerificationRuleList()
        this.retrieveMappingRuleList()
        this.retrieveCtlRuleList()
      }
    },
    // 검증룰 type 변경시 호출되는 함수
    changeValTypeSelect () {
      if (this.modelConversionTable.selectDevSeq && this.apiTable.selectApiSeq) { // 필수값이 있으면 파싱룰 전문 (바디) 리스트 조회
        this.retrieveVerificationRuleList()
      }
    },
    // 매핑룰 type 변경시 호출되는 함수
    changeMapTypeSelect () {
      if (this.modelConversionTable.selectDevSeq && this.apiTable.selectApiSeq) { // 필수값이 있으면 파싱룰 전문 (바디) 리스트 조회
        this.retrieveMappingRuleList()
      }
    },
    changeTypeSelect () {
      if (this.modelConversionTable.selectDevSeq && this.apiTable.selectApiSeq) { // 필수값이 있으면 제어 리스트 조회
        this.retrieveCtlRuleList()
      }
    },
    // API 테이블 페이징 이벤트
    onPagingApiTable () {
      this.fnSearchCommon(this.fnAddApiList, '/online/com/api/getIotApi', { apiNm: this.apiNm, displayRowCount: this.apiTable.pageInfo.rowCount, currentPage: this.apiTable.pageInfo.currentPage }) // API 테이블 조회
    },
    // 모델 테이블 페이징 이벤트
    onPagingModelTable () {
      this.fnSearchCommon(this.fnAddModelList, '/online/iotdev/retrieveIotDev', { svcCd: this.svcCd, devClsCd: this.devClsCd, displayRowCount: this.modelConversionTable.pageInfo.rowCount, currentPage: this.modelConversionTable.pageInfo.currentPage }) // 모델 목록 테이블 조회
    },
    // 단말별 룰 목록 테이블 페이징 이벤트
    onPagingDevTable () {
      this.fnSearchCommon(this.fnAddDevRuleList, '/online/rule/devColRuleSettingInfo', { devSeq: this.modelConversionTable.selectDevSeq, displayRowCount: this.devConversionTable.pageInfo.rowCount, currentPage: this.devConversionTable.pageInfo.currentPage }) // 단말별 룰 목록 테이블 조회
    },
    // 탭 선택 이벤트
    selectTab(tabName) {
      this.tabInfo.selectedTab = tabName
    },
    // 현재 선택된 탭에 따라 탭 내용 v-show 처리하는 함수
    isSelectedTab(tabName) {
      return this.tabInfo.selectedTab === tabName
    },
    // 선택된 탭에 대해 active 클래스를 넣고, 선택된 탭이 아니면 빈 값 반환
    getTabNameLiClass(tabName) {
      return this.isSelectedTab(tabName) ? 'active' : ''
    },
    // json array 중복체크
    checkDuplicateInObject(propertyName, inputArray) {
      var seenDuplicate = false
      var testObject = {}

      inputArray.map(function(item) {
        var itemPropertyName = item[propertyName]
        if (itemPropertyName in testObject) {
          testObject[itemPropertyName].duplicate = true
          item.duplicate = true
          seenDuplicate = true
        } else {
          testObject[itemPropertyName] = item
          delete item.duplicate
        }
      })
      return seenDuplicate
    },
    // Message Confirm
    fnCallInsertApi (type) {
      let callback = null
      switch (type) {
        case 'parsingRuleAllHead':
          callback = this.saveParsingRuleAllHeadTable
          break
        case 'parsingRuleAllBody':
          callback = this.saveParsingRuleAllBodyTable
          break
        case 'parsingRule':
          callback = this.saveParsingRuleTable
          break
        case 'verificationRule':
          callback = this.saveVerificationRuleTable
          break
        case 'mappingRule':
          callback = this.saveMappingRuleTable
          break
        // case 'serviceCall':
        //   this.saveServiceCallTable()
        //   break
        case 'controlRule':
          callback = this.saveControlRuleTable
          break
      }
      this.confirm('저장 하시겠습니까?', callback)
    },
    // 빈 값 체크
    fnNullValid (arrayObject) {
      for (let i = 0; i < arrayObject.length; i++) {
        let itemObj = arrayObject[i]
        if (!itemObj.ruleSourcekey) {
          let msg = '값이 존재 하면 안됩니다.'
          this.alert(msg)
          return
        }
      }
    },
    changeHeaderTagetKey(idx) {
    },
    initedTabTableList () {
      this.parsingRuleAllTab.parsingRuleAllHeadList = []
      this.parsingRuleAllTab.parsingRuleAllBodyList = []
      this.parsingRuleTab.parsingRuleList = []
      this.verificationRuleTab.verificationRuleList = []
      this.mappingRuleTab.mappingRuleList = []
      this.serviceCallTab.serviceCallDataList = []
    },
    changeExeFile (allData, idx, exe) {
      if (exe === '6') {
        allData[idx].ruleRequest = ''
        allData[idx].ruleSourcekey = ''
        allData[idx].ruleNumber = ''
        allData[idx].rulePoint = ''
        allData[idx].ruleBitPosi = ''
      } else {
        allData[idx].ruleRequest = 'O_REQ_B'
        allData[idx].ruleSourcekey = 'con'
        allData[idx].ruleBytePosi = ''
        allData[idx].ruleBitPosi = ''
        allData[idx].ruleNumber = '0'
        allData[idx].rulePoint = '0'
      }
    },
    changeExeFileParsingRuleAllBody (allData, idx, exe) {
      if (exe === '6') {
        allData[idx].ruleRequest = ''
        allData[idx].ruleSourcekey = ''
        allData[idx].ruleNumber = ''
        allData[idx].rulePoint = ''
        allData[idx].ruleBitPosi = ''
      } else {
        allData[idx].ruleRequest = 'O_REQ_B'
        allData[idx].ruleSourcekey = 'con'
        allData[idx].ruleBytePosi = ''
        allData[idx].ruleBitPosi = ''
        allData[idx].ruleNumber = '0'
        allData[idx].rulePoint = '0'
      }
    },
    changeExeFileMappingRule (allData, idx, exe) {
      if (exe === '6') {
        allData[idx].ruleNumber = null
        allData[idx].rulePoint = null
        allData[idx].ruleBitPosi = ''
      } else {
        allData[idx].ruleNumber = '0'
        allData[idx].rulePoint = '0'
        allData[idx].ruleBitPosi = ''
      }
    },
    changeTabText (nm) {
      if (this.retrieveData.devApiNm) {
        if (nm !== '' && nm !== null) {
          this.tabText = '(' + this.modelConversionTable.selectDevMdlCdNm + '/' + this.modelConversionTable.selectDevMdlNm + '/' + this.retrieveData.devApiNm + '/' + nm + ')'
        } else {
          this.tabText = '(' + this.modelConversionTable.selectDevMdlCdNm + '/' + this.modelConversionTable.selectDevMdlNm + '/' + this.retrieveData.devApiNm + ')'
        }
      } else {
        this.tabText = '(' + this.modelConversionTable.selectDevMdlCdNm + '/' + this.modelConversionTable.selectDevMdlNm + ')'
      }
    }
  }
}
</script>
  <style lang="less" scoped>
  .table_style {
    height: 206px;
  }
  .tab_margin_style {
    margin-top: 20px;
  }
  .bg_color {
    background-color: #EEEEEE;
  }
  .tab_margin_style {
    margin-top: 0px;
  }
</style>
