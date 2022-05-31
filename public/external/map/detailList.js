/*
 * 차량 목록 표(하단) JqGrid 부분
 */
var gridData = new Array();
$( window ).resize(function() {
	$("#datailList").setGridWidth($(".chk_car_detail").width(), $(".chk_car_detail").width() >= 1514 ? true : false);
});

$(document).ready(function(){
	
	$("#datailList").jqGrid({
		url: "/tracking/detaillist.do",
		postData: { extent : ExtentToCoordinate(getExtentAtCurrentScreen()).toString() },
		colNames:[
		    "thingId",
			"시동", 
			"조직명",
			"차량번호",
			"현재 위치",
			"경로",
			"현재속도(km/h)",
			"일 운행거리(km)",
			"일 운행시간(분)",
			"운전자명(연락처)",
			"단말번호",
			"전방온도",
			"전방온도위반여부",
			"후방온도",
			"후방온도위반여부"
        ],
		colModel:[
			{
				name:'THING_ID',
				sortable: false,
				hidden: true,
				key: true
			},
			{
				name:'KEY_STATUS',
				sortable: false,
				formatter: keyStatusIcon,
				width: 50,
				resizable: false,
				fixed: true
			},
			{
				name:'ORG_NM',
				sortable: false,
				width: 100
			},
			{
				name:'THING_NM',
				sortable: false,
				width: 100
			},
			{
				name:'GPS_ADDR',
				sortable: false,
				width: $("#tempUseYn").val() === "true" ? 267 : 517 
			},
			{
				sortable: false,
				formatter: traceIcon,
				width: 80,
				fixed: true
			},
			{
				name:'CAR_SPD_NUM',
				sortable: true,
				width: 100
			},
			{
				name:'DAY_DRV_DIST_NUM',
				sortable: true,
				width: 100
			},
			{
				name:'DAY_DRV_SEC_NUM',
				sortable: true,
				width: 100
			},
			{
				name:'USR_INFO',
				width: 150
			},
			{
				name:'MDN',
				width: 150
			},
			{
				name:'TEMP_1_VAL',
				sortable: false,
				formatter: temp1Icon,
				width: 120,
				fixed: true,
				hidden : $("#tempUseYn").val() === "true" ? false : true 
			},
			{
				name:'IS_VIOLATION_1',
				sortable: false,
				hidden : true 
			},
			{
				name:'TEMP_2_VAL',
				sortable: false,
				formatter: temp2Icon,
				width: 120,
				fixed: true,
				hidden : $("#tempUseYn").val() === "true" ? false : true
			},
			{
				name:'IS_VIOLATION_2',
				sortable: false,
				formatter: temp2Icon,
				hidden : true
			}
		],
		width: $(".chk_car_detail").width(),
		shrinkToFit: $(".chk_car_detail").width() > 1514 ? true : false,
		pager: "#pager",
		rowNum: 5,
		sortorder: "ASC",
		sortname: "THING_NM",
	    onCellSelect : function(id, index, contents, event) {
	    	if(index == 3){
	    		var thingId = $(this).jqGrid('getRowData',id).THING_ID;
		    	var tooltip = map.getOverlayById("thingdetail");
		    	
		    	thingDetailTooltip(thingId);
		    	
		    	featureLoc = getFeatureLocation(thingId);
		    	
		    	moveToCenter(featureLoc);
		    	
		    	popupTooltip(tooltip, map.getPixelFromCoordinate(featureLoc));
	    	}
		}
	});
	
	$(document).on("click", "button[class*=cmbtn][class*=search]", detailListTraceBtnClickHandler);
	
	if($("#tempUseYn").val() === "false"){
		$("#datailList").hideCol("TEMP_1_VAL");
		$("#datailList").hideCol("TEMP_2_VAL");
	}
});

function keyStatusIcon(cellval, options, rowdata) {
	if(cellval == 1){
		return "<span align='center' class='ico-car on'></span>";
	}
	else {
		return "<span align='center' class='ico-car'></span>";
	}
}

function traceIcon(cellval, options, rowdata) {
	return "<button type='button' value='" + rowdata.THING_ID + "' class='cmbtn search'><span>상세</span></button>";
}

function temp1Icon(cellval, options, rowdata) {
	
	if(rowdata.IS_VIOLATION_1 == 0) {
		return "<span class='ico-weather2'></span>(" + cellval + ")";
	} else if(rowdata.IS_VIOLATION_1 == 1) {
		return "<span class='ico-weather1'></span>(" + cellval + ")";
	} else {
		return "<span class='ico-noweather'></span>(미사용)";
	}
}

function temp2Icon(cellval, options, rowdata) {
	if(rowdata.IS_VIOLATION_2 == 0) {
		return "<span class='ico-weather2'></span>(" + cellval + ")";
	} else if(rowdata.IS_VIOLATION_2 == 1) {
		return "<span class='ico-weather1'></span>(" + cellval + ")";
	} else {
		return "<span class='ico-noweather'></span>(미사용)";
	}
}

/**
 * 새로고침 할 때 목록 갱신. 현재 화면에 보이는 사물만 나오도록 화면 좌표(Extent) 전달
 */
function viewItemReload() {
	
	$("#datailList").clearGridData();
	
	if(!isTraceMode){
		$("#datailList").setGridParam({
			postData: { extent : ExtentToCoordinate(getExtentAtCurrentScreen()).toString() }
		}).trigger("reloadGrid");
	}
}

/**
 * 차량 목록에서 "상세" 버튼을 눌렀을 때, 당일 경로 자동 검색 후 지도에 표시. (트리거)
 * @returns {Boolean}
 */
function detailListTraceBtnClickHandler(evt) {

	var rowdata = $("#datailList").getRowData($(this).val());
	var thingId = rowdata.THING_ID;
	var thingNm = rowdata.THING_NM;
	
	// 강제로 차량 번호 넣고 검색시키는 JQuery
	$("li[class=sb_stt] a[class=btnsb]").trigger("click");
	$("#vehicleSrch").find("select[name=cond] option:first").prop("selected", true);
	$("#vehicleSrch").find("input[name=keyword]").val(rowdata.THING_NM);
	$("#vehicleSrch").find("input[id=btnsrch02]").trigger("click");
	$("#sb_stt").find("div[class=nBBox]").find("li:first a").trigger("click");
//	$("#sb_stt").find("div[class=nBBox]").find("li:first").find(".car-num:first").trigger("click");
	$("#sbSttTree").find("li[thingId=" + thingId + "]").trigger("click");
	
	isTraceMode = true;

	map.getLayers().item(2).setVisible(false); // 원 레이어 숨기기
	
	traceItem.thingId = thingId;
	traceItem.thingNm = thingNm;
	traceItem.start = moment(new Date()).format("YYYYMMDD").toString() + "000000";
	traceItem.end = moment(new Date()).add(1, "days").format("YYYYMMDD").toString() + "000000";
	
	$("#evtstcd option:selected").removeAttr("selected");
	
	eventList(traceItem.thingId, traceItem.start, traceItem.end);
	drawRoute(traceItem.thingId, false, traceItem.start, traceItem.end, true, true);
	
	return false;
}