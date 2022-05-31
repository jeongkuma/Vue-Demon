/**
 * 실시간관제 UI script, 왼쪽 검색 메뉴
 */

var traceItem = new ThingItem();
var sbOrgTree = $("#sbOrgTree");
var sbSttTree = $("#sbSttTree");

$(window).resize(
	function() {
		var realSize = document.documentElement.clientHeight;
		var headerHeight = $("#header").height();
		var footerHeight = $("#footer").height() + 36;
		var mapdistopHeight = $(".mapdis-top").height() + 26;
		var mapHeight = realSize - headerHeight - footerHeight
				- mapdistopHeight + 37;
		$("#map").height(mapHeight);
		// var sb01_lyrHeight = mapHeight - 40 - 63 - 30 ;

		var chkHeader = $('#sdb_schdiv > .sb01').innerHeight();
		var chkForm = $('#sb_org > form').innerHeight();
		var chkForm2 = $('#sb_ostt > form').innerHeight();
		var chkFooter = 79;
		var chkControl = $('.control_wrap').innerHeight();
		var sb01_lyrHeight = mapHeight - chkHeader - chkForm - chkFooter;
		var sb02_lyrHeight = mapHeight - chkHeader - chkForm2 - chkFooter;

		var sch_lyrHeight = $("#map").height() - 164;//sb01_lyrHeight - 101;
		$("#sb_org").children(".srchrlt").css('height',
				$('#map').height() - 77 - 170 - 31);
		/*
		 * $("#sb_org").children(".srchrlt").css({ "height" : sb01_lyrHeight
		 * });
		 */
		/*
		 * $(".nBBox").css({ "height" : sb02_lyrHeight - 127 });
		 */
		$(".nBBox").css({
			"height" : sb02_lyrHeight - 80 - 50 - 250
		}); // 116

		$("#sdb_lyrdiv").find(".sch_lyr").css({
			"height" : sch_lyrHeight
		});
		$(".dvclist").each(function() {
			var formHeight = $(this).siblings("form").height();
			var thsHeight = sb01_lyrHeight - formHeight;
			$(this).height(thsHeight);
		});
		var ol_viewport_height = $('.ol-viewport').height()-57;
		$('#sb_org, #sb_stt, #sdb_lyrdiv').css('height',ol_viewport_height);
		var map_wsize = $('#map').width() - 342;
	    $('.chk_car_detail.new').css('width',map_wsize);

	    $(".nBCal.strain").height($("#sb_stt").height() - 135 - $("#sb_stt .nBBox").height() - 98);
	    
	    map.updateSize();
	}
);

$(function() {
	var realSize = document.documentElement.clientHeight;
	var headerHeight = $("#header").height();
	var footerHeight = $("#footer").height() + 36;
	var mapdistopHeight = $(".mapdis-top").height() + 26;
	var mapHeight = realSize - headerHeight - footerHeight - mapdistopHeight;
	$("#map").height(mapHeight + 37);
	// var sb01_lyrHeight = mapHeight - 40 - 63 - 30 ;
	
	var chkHeader = $('#sdb_schdiv > .sb01').innerHeight();
	var chkForm = $('#sb_org > form').innerHeight();
	var chkForm2 = $('#sb_stt > form').innerHeight();
	var chkFooter = $("#footer").innerHeight();
	var chkControl = $('.control_wrap').innerHeight();
	var sb01_lyrHeight = mapHeight - chkHeader - chkForm - chkFooter;
	var sb02_lyrHeight = mapHeight - chkHeader - chkForm2 - chkFooter;
	
	var sch_lyrHeight = $("#map").height() - 164;//sb01_lyrHeight - 101;
	
	$("#sb_org").children(".srchrlt").css({
		"height" : sb01_lyrHeight - 9
	});
	
	$(".nBBox").css({
		"height" : sb02_lyrHeight - 127 -250
	}); // 116
	
	$("#sdb_lyrdiv").find(".sch_lyr").css({
		"height" : sch_lyrHeight
	});
	
	/*0526*/
	var ol_viewport_height = $('.ol-viewport').height()-57;
	$('#sb_org, #sb_stt, #sdb_lyrdiv').css('height',ol_viewport_height);
	var map_wsize = $('#map').width() - 342;
    $('.chk_car_detail.new').css('width',map_wsize);
  
  	// reload change
	$(".hsyle").change(function() {
		if ($(this).is(":checked")) {
//			$(this).parent().addClass("on");
			$(this).siblings("select").children("option").removeAttr(
					"disabled");
		} else {
//			$(this).parent().removeClass("on");
			$(this).siblings("select").children("option").attr(
					"disabled", "disabled");
		}
	});

	// 조직검색 서브목록 열고닫기
	$(document).on("click", ".havsublist", function() {
		var thsT = $(this).parent().hasClass("on");
		if (!thsT) {
			var thsL = $(this).attr("href");
			$(this).parent().addClass("on").siblings()
					.removeClass("on");
			var thsS = $(thsL).attr("class");
			$("div[class=" + thsS + "],ul[class=" + thsS + "]").hide();
			var thsLHeight = mapHeight - 50 - 51 - 100; /*  */
			var thsPrntHeight = $(this).parent().parent(".srchrlt.sb_cnd").height();
			thsLHeight = thsLHeight - thsPrntHeight;
			// $(thsL).height(thsLHeight);
			$(thsL).show();
			$('.nBBox .srchrlt > li ').find('.sttsublist').hide();
			$(this).next('.sttsublist').show();
		} else {
			$(this).parent().removeClass("on");
			$(".orgsublist").height("auto");
			$(".orgsublist").hide();
			$('.nBBox .srchrlt > li ').find('.sttsublist').hide();
		}
		return false;
	});

	// 날짜 입력
	$(".datepicker").datepicker();

	// 사이드바 버튼
	$("button.btn_sidebar").on("click", function() {
		var thsT = $(this).hasClass("on");
		if (!thsT) {
			$(this).addClass("on").parent().css({
				"left" : "344px"
			});
			$(".sidebar").show();
			$(this).children().text("open sidebar");
		} else {
			$(this).removeClass("on").parent().css({
				"left" : "0px"
			});
			$(".sidebar").hide();
			$(this).children().text("close sidebar");
		}
	});

	$(".sbbtnspn a").on("click", function() {
		var thsL = $(this).attr("href");
		var thsLvs = thsL.split("#")[1];
		$(this).addClass("on").siblings("a").removeClass("on");
		$(".sdb_lyr").hide();
		$(thsL).show();
		return false;
	});

	// 검색 영역 버튼
	$(".btnsb").click(function() {
		var thsL = $(this).attr("href");
		var thsLvs = thsL.split("#")[1];
		$(this).parent().parent().parent()
				.removeClass("sb_org").removeClass("sb_stt")
				.removeClass("sb_dvc").addClass(thsLvs);
		var thsS = $(thsL).attr("class");
		$("div[class=" + thsS + "]").hide();
		$(thsL).show();

		if (thsL == "#sb_org") {
			initOrgTab();
		} else if (thsL == "#sb_stt") {
			initTraceTab();
		}

		var realSize = document.documentElement.clientHeight;
		var headerHeight = $("#header").height();
		// var mapHeight = realSize - headerHeight;
		// mapHeight = mapHeight - 72 - 51 - 159; /* 상단
		// 오프셋,탭영역,푸터,목록하단설명영역 */
		$(".dvclist").each(function() {
			var realSize = document.documentElement.clientHeight;
			var headerHeight = $("#header").height();
			var footerHeight = $("#footer").height() + 36;
			var mapdistopHeight = $(".mapdis-top").height() + 26;
			var mapHeight = realSize - headerHeight - footerHeight - mapdistopHeight;
			$("#map").height(mapHeight);
			var sb01_lyrHeight = mapHeight - 40 - 63 - 30;

			var formHeight = $(this).siblings("form").height();
			var thsHeight = sb01_lyrHeight- formHeight;
			$(this).height(thsHeight);
		});
		return false;
	});

	// unlock readonly input
	$(".ulro").parent().siblings().children().focus(function() {
		$(this).parent().siblings().children("input[type=text]").attr(
				"readonly", "readonly");
		$(this).parent().siblings().children("input[type=text]")
				.val("");
		$(this).parent().children("input[type=text]").removeAttr(
				"readonly");
	});

	// sidemenu button test
	$("#sidemenu").find("li[class^='lavel_']").each(function() {
		$(this).find("button").click(function() {
			$(this).parent("li")
					.siblings("li[class^='lavel_']")
					.removeClass("on");
			$(this).parent("li").addClass("on");
		});
	});

	$('.nBCal td a').on('click', function() {
		$(this).closest('.nBCal').find($('.nBSlider')).show();
		$(this).closest('.nBCal').find($('.havbtn')).show();
	}) // 캘린더 클릭

	$('.nBtnCarList').on('click', function() {
		if ($('.chk_car_detail').is(':visible')) {
			$('.chk_car_detail').hide();
		} else {
			$('.chk_car_detail').show();
		}
	}) // 차량목록 열기

	$('.chk_car_detail .btn_cls').on('click', function() {
		$('.chk_car_detail').hide();
	}) // 차량목록 닫기

	var chkFlagAlarm = 1;
	$('.nBtnChkStatus').on('click', function() {
		
		$(this).parent().siblings().find("ul").hide();
		
		if ($(this).next('.chk_detail').is(':visible')) {
			$(this).next('.chk_detail').hide();
		} else {
			$(this).next('.chk_detail').show();
			chkFlagAlarm = 1;
		}
	}) // 운행상태 열기

	$('.nBtnChkAlarm').on('click', function() {
		
		$(this).parent().siblings().find("ul").hide();
		
		if ($(this).next('.chk_detail').is(':visible')) {
			$(this).next('.chk_detail').hide();
		} else {
			$(this).next('.chk_detail').show();
			chkFlagAlarm = 2;
		}
	}) // 이상정보 열기

	$('.chk_detail li a').on('click', function() {
		$(this).closest('.chk_detail').find('li').removeClass('on');
		$(this).parent().addClass('on');
		setTimeout(function() {
			if (chkFlagAlarm == 1) {
				$('.chk1 .chk_detail').hide();
			} else {
				$('.chk2 .chk_detail').hide();
			}
		}, 500);
	}) // 알람창 닫기

	// 상태 검색 -> 사용하는지 의문
//	$("form p input[id=btnsrch01]").on("click", function() {
//		getThingList();
//		return false;
//	});
	
	// 현위치 탭에서 검색 기능
	$("form input[id=btnsrch01]").on("click", function(evt) {
		evt.preventDefault();

		$("#sb_org").find(".srchrlt.noline").find("li.nosearch").remove();
		
		// 선택된거 다 취소
		$("#sbOrgTree").jstree().deselect_all()
		// 다 접고 검색
		$("#sbOrgTree").jstree().close_all();
		$("#sbOrgTree").jstree().open_node($("#sbOrgTree").jstree().get_node("#").children[0]);
		$("#sbOrgTree").jstree(true).refresh();

		return false;
	});

	// 경로 > 차량 검색
	$("form input[id=btnsrch02]").on("click", function() {
//		vehicleSearch();
		
		$("#sb_stt").find(".srchrlt.noline").find("li.nosearch").remove();
		
		$("#sbSttTree").jstree().deselect_all()
		
		$("#sbSttTree").jstree().close_all();
		$("#sbSttTree").jstree().open_node($("#sbSttTree").jstree().get_node("#").children[0]);
		$("#sbSttTree").jstree(true).refresh();
		return false;
	});

	var nowDate = new Date();
	nowDate = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();

	var from_DDate;
	var to_DDate;
	var sstitle;
	var fftitle;

	// 시간 Slider
	$("#range").ionRangeSlider({
		type : "double",
		min : +moment(nowDate, [ "YYYY-MM-DD", "YYYY-MM-DD" ]).add(-24, "hours").format("X"),
		max : +moment(nowDate, [ "YYYY-MM-DD", "YYYY-MM-DD" ]).add(24, "hours").format("X"),
		from : +moment(nowDate, [ "YYYY-MM-DD", "YYYY-MM-DD" ]).format("X"),
		to : +moment(nowDate, [ "YYYY-MM-DD", "YYYY-MM-DD" ]).add(24, "hours").format("X"),
		grid : true,
		force_edges : true,
		prettify : function(num) {
			var m = moment(num, "X").locale("ko");
			return m.format("MM/DD HH");
		}
	});

	$(document).on("click", ".orgsublist li div.logistics_wrap .car-num", thingClickHandler);	// 차량 목록 차량선택 -> 차량의 현 위치로 이동
	$(document).on("click", ".orgsublist2 li div.logistics_wrap .car-num", traceThingClickHandler);	// 궤적 목록 차량선택 -> 궤적 달력 표시
//	$(document).on("mouseover", ".car_pop_btn", thingPopupMoveoverHandler);
//	$(document).on("mouseout", ".car_pop_btn", thingPopupMoveoutHandler);
	$(document).on("click", "#btnsrch03", traceSearchBtnClickHandler);
	
	$("#condSearch .closebtn").on("click", searchAreaCloseBtnClickHandler);
	$("#btncancelfav").on("click", favoriteAreaCancelBtnClickHandler);
	$(document).on("click", "#poilist input[name=all]", favoriteAreaAllSelectBtnClickHandler);
	$(document).on("click", "#poilist input[name=lyr]", favoriteAreaSelectBtnClickHandler);

	// 초기화
//	getOrgList();
	// 목록 트리형태로 바꾸기 위해 테스트를 위해 잠시 주석
//	getThingList();
	getOrgListFromOrgId();

	map.updateSize();

	// 궤적 달력
	$("#calendar").calendar({
		locale : "ko",
		// 운행한날짜(선택가능날짜)
		activeDates : []
	});
	
	// 전월/익월 변경에 따른 "당월 검색 결과가 없습니다" 표시를 위한 이벤트 핸들러
	$("#calendar .monthly").on("change", changeMonthHandler);
	
	//시스템관제 팝업
//	$(".car_pop_btn").mouseover(function() {
	$(document).on("mouseover", ".car_pop_btn", function() {
		var offset_val = $(this).offset().top - 90;
		var thsmv = $(this).attr("href");
		var dimmed = $("<div class='dimmed'><\/div>");
		$(thsmv).show();
		if ($(this).is(".sublyr"))		{
			$(this).parents(".layerpopup").css({"z-index":"99997"});
		} else {
			var a = $(this).parents('li');
			//(dimmed).prependTo(a);		
		}
		$(".layerpopup").find(".lp_close").click(function() {
			$(this).parent().parent(".layerpopup").hide();			
			if( $(this).is(".linl") ) {
				$(".layerpopup").css({"z-index":"99999"});				
			} else {
				$(".dimmed").remove();		
			}			
			$("a[href=" + thsmv + "]").focus();		
		});
		$('.car_pop_btn').parents('.logistics_wrap').next('.bg_car').css('display','none');
		$(this).parents('.logistics_wrap').next('.bg_car').css({'display':'block','top':offset_val});
		return false;
	 });
//	 $(".car_pop_btn").mouseout(function() {
	 $(document).on("mouseout", ".car_pop_btn", function() {
		var thsmv = $(this).attr("href");
		$(thsmv).hide();
	 });

});

function getOrgList() {
	$.ajax({
		url : "/tracking/orglist.do",
		type : "post",
		data : {},
		dataType : "json",
		beforeSend : function() {
			$("div[id^=sb_] select[name=org] option").remove();
			$("div[id^=sb_] select[name=org]").append($("<option />", {
				value : 0,
				text : "불러오는 중..."
			}));
		},
		success : function(res) {
			$("div[id^=sb_] select[name=org] option").remove();

			if (res.result) {

				var data = res.data;

				if (data.length > 0) {

					if (true/* 전국 권한이 있다면 */) {
						$("div[id^=sb_] select[name=org]").append(
							$("<option />", {
								value : "0",
								text : "전국"
							})
						);
					}
					for (var i = 0; i < data.length; i++) {
						var org = data[i];
						$("div[id^=sb_] select[name=org]").append(
								$("<option />", {
									value : org.ORG_ID,
									text : org.ORG_NM
								}));
					}
				} else {
					$("div[id^=sb_] select[name=org]").append($("<option />", {
						text : "검색 결과가 없습니다."
					}));
				}
			} else {

				$("div[id^=sb_] select[name=org]").append($("<option />", {
					text : "불러기에 실패했습니다."
				}));
			}
		},
		error : function(err) {

		}
	});

	return false;
}

// 현위치탭 목록 검색. searchForm1.jsp 템플릿 삽입
//function getThingList() {
//	$.ajax({
//		url : "/tracking/thinglist.do",
//		type : "post",
//		data : $("form[name=condSearch]").serialize().replace(/-/gi, ""),
//		dataType : "html",
//		beforeSend : function() {
//			$("div#sb_org ul.sb_cnd li").remove();
//		},
//		success : function(res) {
//			$("#sb_org ul.sb_cnd").html(res);
//		},
//		error : function(data) {
//			console.log("error");
//		}
//	});
//
//	return false;
//}

// 경로탭 목록 검색. searchForm2.jsp 템플릿 삽입 -> 은 옛날것
//function vehicleSearch() {
//	$.ajax({
//		url : "/tracking/vehiclesrch.do",
//		type : "post",
//		data : $("form[name=vehicleSrch]").serialize(),
//		async : false,
//		dataType : "html",
//		beforeSend : function() {
//			$("div#sb_stt ul.sb_cnd li").remove();
//		},
//		success : function(res) {
//			$("div#sb_stt ul.sb_cnd").html(res);
//			$('.nBBox').show();
//		},
//		error : function(err) {
//
//		}
//	});
//
//	return false;
//}

/**
 * 사물 목록 선택. 해당 좌표로 지도 이동
 * @returns {Boolean}
 */
function thingClickHandler() {

	isTraceMode = false;
	
	$("#routeevtdlist .btn_cls").trigger("click");

	$("#sb_org ul[class^=srchrlt]").find("ul").find("li").find("div")
			.removeClass("selectedThing");
	$(this).parent("div").addClass("selectedThing");

	for (var i = 0; i < map.getLayers().get("length"); i++) {
		if (map.getLayers().item(i).get("id") == "traceRoute") {
			map.removeLayer(map.getLayers().item(i));
		}
	}

	map.getLayers().item(2).setVisible(true); // 원 복원

	var thingId = $(this).parents("li").val();
	
	var tooltip = map.getOverlayById("thingdetail");
	
	var featureLoc = getFeatureLocation(thingId);
	
	if(featureLoc == undefined || featureLoc == null || featureLoc[0] == undefined || featureLoc[0] == 0 || featureLoc[1] == undefined || featureLoc[1] == 0){
		alert("좌표가 없습니다");
		return false;
	}
	else{
		thingDetailTooltip(thingId);

		moveToCenter(featureLoc);
		
		popupTooltip(tooltip, featureLoc);
	}
}

/**
 * 경로 탭에서 사물 이름을 클릭했을 때. 경로 탐색 모드로 전환
 * @returns {Boolean}
 */
function traceThingClickHandler(evt, data) {
	
	if(data.event === undefined || data.event.type === undefined || data.event.type === "contextmenu"){
		// 오른쪽 클릭한 것이면 무시한다.
		return false;
	}
	
	if(data.node.li_attr.type === "org"){
		// 조직은 스킵
		if($(this).jstree().is_open(data.node.id)){
			$(this).jstree().close_node(data.node.id);
		}
		else{
			$(this).jstree().open_node(data.node.id);
		}
		
		return false;
	}
	
//	traceItem.thingId = $(this).parents("li").val();
//	traceItem.thingNm = $(this).html();
	
	traceItem.thingId = data.node.li_attr.thingId;
	traceItem.thingNm = data.node.li_attr.thingNm;
	
	// 기존 궤적 정보 초기화
	traceItem.start = null;
	traceItem.end = null;
	removeRoute();
	removeLayerfromId("evtLayer");
	removeLayerfromId("tempEvtLayer");
	$("#routeevtgrid").hide();
	$(".nBCal.strain").hide();
	$("#route_evt .btn_open").hide();
	$("#calendar").clearActiveDates();

	$(this).parents("div[class=nBBox]").find("ul").find("li").find("div")
			.removeClass("selectedThing");
	$(this).parent("div").addClass("selectedThing");
	
	$(".nBCal.strain").height($("#sb_stt").height() - $("#vehicleSrch").height() - $(".nBBox").height() - 80);
	
	$.ajax({
		url : "/tracking/tracehist.do",
		type : "post",
		data : { id : traceItem.thingId },
		dataType : "json",
		beforeSend : function(req) {
			$(".nBCal.strain").show();
			$("#calendar").selectToday();
		},
		success : function(res) {

			if (res.result) {
				var days = [];
				
				if(res.data == null || res.data.length == 0){
					alert("운행경로가 없습니다.");
					$(".nBCal.strain").hide();
					$("#calendar").clearActiveDates();
					$("#routeevtgrid").hide();
				}
				else{
					for (var i = 0; i < res.data.length; i++) {
						days.push(moment(res.data[i].EXTR_YMD, "YYYYMMDD").format("YYYY-MM-DD"));
					}

					$("#calendar").setActiveDates(days);
					changeMonthHandler();
				}
			}
		},
		error : function(err) {
			
		}
	});

	return false;
}

function thingPopupMoveoverHandler(evt) {
	var thsmv = $(this).attr("href");
	var dimmed = $("<div class='dimmed'><\/div>");
	
	var offset_val = $(this).offset().top - 145;
	
	$(thsmv).show();
	if ($(this).is(".sublyr")) {
		$(this).parents(".layerpopup").css({
			"z-index" : "99997"
		});
	} else {
		var a = $(this).parents('li');
		// (dimmed).prependTo(a);
	}
	$(".tooltip.information").find(".lp_close").click(function() {
		$(this).parent().parent(".tooltip.information").hide();
		if ($(this).is(".linl")) {
			$(".tooltip.information").css({
				"z-index" : "99999"
			});
		} else {
			$(".dimmed").remove();
		}
		$("a[href=" + thsmv + "]").focus();
	});
	$('.car_pop_btn').parents('.logistics_wrap').next('.bg_car').css('display','none');
	$(this).parents('.logistics_wrap').next('.bg_car').css({'display':'block','top':offset_val});

	$(this).parent().parent().siblings().css("top",$(this).offset().top + $(this).height() / 2 - $(".layerpopup.infowin.tooltip.bg_car").height() + 22);
	return false;
}

function thingPopupMoveoutHandler() {
	$(this).parent().parent().siblings().hide();
}

function traceSearchBtnClickHandler() {

	isTraceMode = true;

	map.getLayers().item(2).setVisible(false); // 원 레이어 숨기기

	var timeslide = $("#range").val().split(";");


	if(traceItem.thingId == undefined || traceItem.thingId == null){
		traceItem.thingId = $(".selectedThing").parent("li").val();
	}
	
	if(traceItem.thingNm == undefined || traceItem.thingNm == null){
		traceItem.thingNm = $(".selectedThing").find(".car-num").html();
	}
	
	traceItem.start = moment(timeslide[0] * 1000).format("YYYYMMDDHH") + "0000";
	traceItem.end = moment(timeslide[1] * 1000).format("YYYYMMDDHH") + "0000";
	
	routeEventThingNm();
	
	$("#routeevtgrid").show();

	$("#evtstcd option:selected").removeAttr("selected");
	
	eventList(traceItem.thingId, traceItem.start, traceItem.end);
	drawRoute(traceItem.thingId, false, traceItem.start, traceItem.end);
}

/**
 * 관심지역 목록 지도에서 삭제하기
 */
function favoriteAreaCancelBtnClickHandler() {

	$("#poilist").find("input[type=checkbox]").attr("checked", false);

	for (var i = 0; i < map.getLayers().get("length"); i++) {
		if (map.getLayers().item(i).get("id") == "poiLayer") {
			map.removeLayer(map.getLayers().item(i));
		}
	}
}

/**
 * 관심지역 전체 선택하기
 */
function favoriteAreaAllSelectBtnClickHandler(evt) {
	if($("#poilist input[name=all]").prop("checked")){
		$("#poilist input[name=all]").prop("checked", true);
		$("#poilist input[name=lyr]").prop("checked", true);
	}
	else{
		$("#poilist input[name=all]").prop("checked", false);
		$("#poilist input[name=lyr]").prop("checked", false);
	}
}

function favoriteAreaSelectBtnClickHandler(evt) {
	if(!$(this).prop("checked")){
		$("#poilist input[name=all]").prop("checked", false);
	}
} 

function searchAreaCloseBtnClickHandler(evt) {
	if($(".hddfrm.new_hddfrm").is(":visible")){
		$("#sb_org .hddfrm.new_hddfrm").hide();
		$("#condSearch").find(".closebtn").css("background-position", "0px 0px")
		
		$("#sb_org").find(".srchrlt.noline").height($("#sb_org").height() - $("#sb_org .closeline").outerHeight(true) - 10);
	}
	else{
		$("#sb_org .hddfrm.new_hddfrm").show();
		$("#condSearch").find(".closebtn").css("background-position", "0px -20px")
		
		$("#sb_org").find(".srchrlt.noline").height($("#sb_org").height() - $(".hddfrm.new_hddfrm").outerHeight(true) - $("#sb_org .closeline").outerHeight(true) - 10);
	}
	
	return false;
}

function changeMonthHandler(evt) {
	var activeDates = $("#Calendar").getActiveDates();
//	console.log(activeDates);

	var thisMonth = $("#calendar").currentMonth();
	
	var hasTrace = false;
	
	if(activeDates != null && activeDates.length){
		for(var i = 0; i < activeDates.length; i++){
			if(thisMonth == moment(activeDates[i]).month() + 1){
				hasTrace = true;
				break;
			}
		}
	}
	
	if(hasTrace){
//		console.log("has Trace");
		$("#hasTrace").css("visibility", "hidden");
	}
	else{
//		console.log("hasn't Trace");
		$("#hasTrace").css("visibility", "visible");
	}
}

function initOrgTab() {
	$(".mapdis-top.dbhead").find("ul").css("visibility", "");
}

function initTraceTab() {
	$(".mapdis-top.dbhead").find("ul").css("visibility", "hidden");
}

function ThingItem(){
	var thingId;
	var thingNm;
	var start;
	var end;
}

function routeEventThingNm() {
	$("#routeevtgrid_car_num").html("[차량번호 : " + traceItem.thingNm + "] <span id='routeevtgrid_rec_dttm' class='smfont'></span>");
	$("#routeevtgrid_rec_dttm").html(
		moment(traceItem.start, "YYYYMMDDHHmmss").format("MM/DD HH").toString() + "시 ~ " +
		moment(traceItem.end, "YYYYMMDDHHmmss").format("MM/DD HH").toString() + "시"
	);
}

function getOrgListFromOrgId() {
	$("#sbOrgTree").jstree({
		'core' : {
			'data' : {
				'type' : 'post',
				'dataType' : 'json',
				'data' : function(node) {
					var searchOrgNm = $("#sb_org").find("form[name=condSearch]").find("input[name=orgNm]").val();
					var searchKeyStatus = $("#sb_org").find("form[name=condSearch]").find("input[name=rn]:checked").val();
					var searchTempStatus = $("#sb_org").find("form[name=condSearch]").find("input[name=temp]:checked").val();
					var searchType = $("#sb_org").find("form[name=condSearch]").find("select[name=cond] option:selected").val();
					var searchKeyword = $("#sb_org").find("form[name=condSearch]").find("input[name=keyword]").val();
					return {
						'orgId' : node.id === '#' ? 0 : node.id,
						'searchOrgNm' : searchOrgNm,
						'searchKeyStatus' : searchKeyStatus,
						'searchTempStatus' : searchTempStatus === undefined ? '0' : searchTempStatus,
						'searchType' : searchType,
						'searchKeyword' : searchKeyword
					};
				},
				'url' : function(node) {
					return 'tracking/getOrgTree.do';
				},
				'success' : function(node) {
					return node;
				}
			}
		},
		'plugins' : ['contextmenu', 'json_data'],
		'contextmenu' : {
			'items' : function(node){
				return {
					'open' :{
					    'label' : '하위 전체 열기',
					    'action' : function(obj){
					    	$("#sbOrgTree").jstree().open_all(node.id);
					    }
					},
					'close' : {
			            'label' : '하위 전체 닫기',
			            'action' : function(obj){
			            	$("#sbOrgTree").jstree().close_all(node.id);
					    }
					}
				}
			}
		}
	}).on("refresh.jstree", function(evt, data){
		if($("#sbOrgTree").children(".jstree-container-ul.jstree-children").children().size() === 0){
			$("#sb_org").find(".srchrlt.noline").prepend("<li class='nosearch'>검색된 내용이 없습니다.</li>");
		}		
	}).on("select_node.jstree", function(evt, data){
		if(data.event === undefined || data.event.type === undefined || data.event.type === "contextmenu"){
			// 오른쪽 클릭한 것이면 무시한다.
			return false;
		}
		if(data.node.li_attr.type === "org"){
			if($(this).jstree().is_open(data.node.id)){
				$(this).jstree().close_node(data.node.id);
			}
			else{
				$(this).jstree().open_node(data.node.id);
			}
		}
		else if(data.node.li_attr.type === "thing"){
			
			//console.log("sidemenu.js > 001");
			
			isTraceMode = false;
			
			$("#routeevtdlist .btn_cls").trigger("click");

			for (var i = 0; i < map.getLayers().get("length"); i++) {
				if (map.getLayers().item(i).get("id") == "traceRoute") {
					map.removeLayer(map.getLayers().item(i));
				}
			}
			
			map.getLayers().item(2).setVisible(true); // 원 복원
			
			clusterLayerVisibleChangeHandler(); // 20181212 추가

			var thingId = data.node.li_attr.thingId;
			
			var tooltip = map.getOverlayById("thingdetail");
			
			var featureLoc;
			
			if($("#rightsidemenu .chk_detail li.on").size() > 0) {
				// 필터 제거하고 refresh 한 번 실시
				$("#rightsidemenu .chk_detail li").removeClass("on");
				$.ajax({
					url: "/tracking/gpslocation.do",
			    	type: "post",
			    	async: true,
			    	data: {run : 2, evt : 0},
			    	dataType: "json",
			    	success: getlocation,
			    	error: function(err){
			    		clearInterval(timerId);
			    	},
			    	complete: function() {
			    		featureLoc = getFeatureLocation(thingId);
			    		
			    		if(featureLoc == undefined || featureLoc == null || featureLoc[0] == undefined || featureLoc[0] == 0 || featureLoc[1] == undefined || featureLoc[1] == 0){
							alert("좌표가 없습니다");
							return false;
						} else {
							thingDetailTooltip(thingId);

							moveToCenter(featureLoc);
							
							popupTooltip(tooltip, featureLoc);
						}
			    	}
				});
//				reloadFeatures();
			} else {
				featureLoc = getFeatureLocation(thingId);
				
				if(featureLoc == undefined || featureLoc == null || featureLoc[0] == undefined || featureLoc[0] == 0 || featureLoc[1] == undefined || featureLoc[1] == 0){
					alert("좌표가 없습니다");
					return false;
				} else {
					thingDetailTooltip(thingId);

					moveToCenter(featureLoc);
					
					popupTooltip(tooltip, featureLoc);
				}
			}
		} // end else if
	});
	
	$("#sbSttTree").jstree({
		'core' : {
			'data' : {
				'type' : 'post',
				'dataType' : 'json',
				'data' : function(node) {
					var searchOrgNm = $("#sb_stt").find("form[name=vehicleSrch]").find("input[name=orgNm]").val();
					var searchType = $("#sb_stt").find("form[name=vehicleSrch]").find("select[name=cond] option:selected").val();
					var searchKeyword = $("#sb_stt").find("form[name=vehicleSrch]").find("input[name=keyword]").val();
					return {
						'orgId' : node.id === '#' ? 0 : node.id,
						'searchOrgNm' : searchOrgNm,
						'searchKeyStatus' : '2',
						'searchTempStatus' : '0',
						'searchType' : searchType,
						'searchKeyword' : searchKeyword
					};
				},
				'url' : function(node) {
					return 'tracking/getOrgTree.do';
				},
				'success' : function(node) {
					return node;
				}
			}
		},
		'plugins' : ['contextmenu'],
		'contextmenu' : {
			'items' : function(node){
				return {
					'open' :{
					    'label' : '하위 전체 열기',
					    'action' : function(obj){
					    	$("#sbSttTree").jstree().open_all(node.id);
					    }
					},
					'close' : {
			            'label' : '하위 전체 닫기',
			            'action' : function(obj){
			            	$("#sbSttTree").jstree().close_all(node.id);
					    }
					}
				}
			}
		}
	}).on("refresh.jstree", function(evt, data){
		if($("#sbSttTree").children(".jstree-container-ul.jstree-children").children().size() === 0){
			$("#sb_stt").find(".srchrlt.noline").prepend("<li class='nosearch'>검색된 내용이 없습니다.</li>");
		}
	}).on("select_node.jstree", traceThingClickHandler);
}


$(document).ready(function(){
	$(document).on("mouseover", ".orgsublist .weather0, .orgsublist .weather1, .orgsublist .weather2", function(){
		// 온도
		var thingId = $(this).parent().parent().attr("id");
		var temp1Val = $(this).attr("temp1Val");
		var temp2Val = $(this).attr("temp2Val");
		
		$("#org_bg_car").find(".thingNm").html($(this).parent().find(".carNum").html());
		$("#org_bg_car").find(".left_c").html(temp1Val);
		$("#org_bg_car").find(".right_c").html(temp2Val);
		
//		debugger;
		
		var imgPos = $(this).offset();
		var imgWidth = this.clientWidth;
		var imgHeight = this.clientHeight;
		
//		$("#org_bg_car").css("top", imgPos.top + (imgHeight / 2));
//		$("#org_bg_car").css("left", imgPos.left + imgWidth);
		
		$("#org_bg_car").show();
		
		$("#org_bg_car").offset({
			top : imgPos.top + (imgHeight / 2) - ($("#org_bg_car").height() / 2) + 2,
			left : imgPos.left + imgWidth + 5
		});
	});
	
	$(document).on("mouseout", ".orgsublist .weather0, .orgsublist .weather1, .orgsublist .weather2", function(){
		// 온도
		$("#org_bg_car").hide();
	});
});