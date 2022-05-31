/*
 * 지도 기본 Javascript
 */

var clusters;
var currentFeatures;
var features;

var favoriteLayer;
var routeLayer;

var isMonoTone = false;
var isVisibleTime = false;

var isTraceMode = false;

$(document).ajaxStart(function () {
    $('#loading').show();
});

$(document).ajaxStop(function () {
    $('#loading').hide();
});

$(document).ready(function(){

	// 사물 목록 가져와 지도에 표시
	getThingsLocation();

	// 툴팁 초기화
	initTooltip();

	// 이벤트 핸들러
	// 마우스 클릭 이벤트 핸들러
	map.on("click", onClickEvent);
	// 마우스 포인터 이동 이벤트 핸들러
	map.on("pointermove", onPointerMoveEvent);
	// 지도 이동 이벤트 핸들러
	map.on("moveend", onMoveEndEvent);
	// 지도 축척 변경 이벤트 핸들러
	map.getView().on("change:resolution", levelChangeHandler, this);	
	
	// 사물 목록 클릭 이벤트 핸들러
	$(document).on("click", "#thingslist .lp_cont ul li", thingsListClickHandler);
	// "제어" 버튼 클릭 이벤트 핸들러. 제어명령 레이어 팝업 생성
//	$(document).on("click", ".button.buttontypectr", thingCtrlCmdClickHandler);
	
	// 제어명령 레이어 팝업 X 버튼 클릭 이벤트 핸들러. (팝업 닫음)
 	$(document).on("click", ".lp_close", removeAllTooltips);
	// 제어명령 레이어 팝업 닫기 버튼 클릭 이벤트 핸들러. (팝업 닫음)
//	$("#stpodr .button.buttontypecnc").on("click", ctrlCmdcloseClickHandler);
	// 제어명령 전송 버튼 클릭 이벤트 핸들러
//	$("#stpodr .button.buttontypechk").on("click", sendCtrlCmdClickHandler);
	// 새로고침 버튼 클릭 이벤트 핸들러
	
	$("#reload").on("click", reloadBtnClickHandler);
//	$("#mreload").on("click", reloadBtnClickHandler2);
	// 사물 툴팁에 "경로보기" 버튼 클릭 이벤트 핸들러
//	$(document).on("click", "#traceBtn", tooltipTraceBtnClickHandler);
	
	// 불필요 버튼 삭제
//	$(".ol-zoom.ol-unselectable.ol-control").remove();
	
//	$(".ol-rotate-reset").remove();
//	$(".ol-rotate.ol-unselectable.ol-control").append('<button class="ol-zoom-in" type="button" title="Zoom in">+</button>');
//	$(".ol-rotate.ol-unselectable.ol-control").append('<button class="ol-zoom-out" type="button" title="Zoom out">−</button>');
	
//	$(".ol-attribution.ol-unselectable.ol-control.ol-collapsed").remove();	
//	$(".ol-attribution.ol-logo-only").remove();
	$(".ol-attribution img").remove();
	
	

	/*
	 * 시도정보 get
	 * 
	 **/
	
	getArea1();
	
	

	
	
	// 지도 검색에 광역시도 선택 상자 초기화(Ajax)
//	$("#area1 option:first").prop("selected", true);
	
	// 광역시도 선택상자 변경 이벤트 핸들러
	$("#area1").on("change", area1ChangeEventHandler);
	
	// 시군구 선택상자 변경 이벤트 핸들러
	$("#area2").on("change", area2ChangeEventHandler);
	
	// 읍면동 선택상자 변경 이벤트 핸들러
	$("#area3").on("change", area3ChangeEventHandler);
	
	// 지도 선택 선택 상자 초기화
	$("#area1 option:first").prop("selected", true);
	$("#area1").trigger("change");

	
	
	
	
	
	
	
	
	// 자동 새로고침 부분
	timerId = 0;
	var time = 0;
	
//	$(".hsyle").click(function() {
//		if( $(this).is(":checked") ) {
//			$(this).parent().addClass("on");
//			
//			time = $('#treload option:checked').val();
//			if(time == undefined || time == null || isNaN(time)){
//				time = 10;
//			}
//			time = (time * 1) * 1000;
////			time = time * 1000;
//			
////			viewMainChart();
//			
//			timerId = setInterval(function() { $("#reload").trigger("click"); return false; }, time);
////			timerId = setInterval("viewMainChart()", time);
//		} else {
//			$(this).parent().removeClass("on");
//			clearInterval(timerId);
//		}
//	 });
	
	$(".hsyle").change(function() {
		if( $(this).is(":checked") ) {
			$(this).parent().addClass("on");
			
			time = $('#treload option:checked').val();
			if(time == undefined || time == null || isNaN(time)){
				time = 10;
			}
			time = (time * 1) * 1000;
//			time = time * 1000;
			
//			viewMainChart();
			
			timerId = setInterval(function() { $("#reload").trigger("click"); return false; }, time);
//			timerId = setInterval("viewMainChart()", time);
		} else {
			$(this).parent().removeClass("on");
			clearInterval(timerId);
		}
	 });	
	
	$("#treload").change(function(){
		if($('#mreload').is(":checked")){
			clearInterval(timerId);
			
			var time = 0;	
			time = $('#treload option:checked').val();
			
			time = (time * 1) * 1000;
//			time = time * 1000;
			
			timerId = setInterval(function() { $("#reload").trigger("click"); return false; }, time);		
		}
	})
	
	// 시간
	nowTimerId = setInterval("nowTime()", 1000);
	$('.lastmdate').html(moment(new Date).format("HH:mm:ss").toString());
	
	// 처음부터 자동 갱신 되도록 클릭
	$("#mreload").trigger("click");	
	
	
});

$(window).resize(function() {
	$(".ol-attribution img").remove();
});

function getArea1(){
	 
	 $("#area1 option").remove();  
	 $("#area1").append("<option value='0' latitude='0' longitue='0'>시/도</option>");
	 
	 $.ajax({
			url : "/status/gasMeterDashBoard/_getArea1",
			data: {},
			dataType: "json",
			type : "post",
			success : function(data) {
				if(data.result){

					 for(var idx=0; idx<data.area.length; idx++) {
					
						 $("#area1").append("<option longitude='"+data.area[idx].area_Long+"' latitude='"+data.area[idx].area_Lat+"' value='"+data.area[idx].area_Cd+"'>"+data.area[idx].area_Nm+"</option>");
					 
					 }
					 
					 
					 $(".selectpicker").selectpicker('refresh');
//					 getArea2($("#area1 option:selected").val());
				}else{
					
					alert("데이타 조회에 실패 하였습니다");
				}
				
			},
			error : function(data){
				// alert("입력이 올바르지 않습니다.");
			}
		});	
	 
}


//광역시도 선택상자 변경 이벤트 핸들러
function area1ChangeEventHandler() {
	
	$("#gfLat").val($("#area1 option:selected").attr("latitude"));
	$("#gfLong").val($("#area1 option:selected").attr("longitude"));

	
	
	if($("#area1 option:selected").val() == 0){
		// 기존 내용 다 지우고
		$("#area2 option").remove();
		$("#area2").append($("<option />", {
			value: "0",
			latitude: "0",
			longitude: "0",
			text: "시/군/구"
		}));
		$("#area3 option").remove();
		$("#area3").append($("<option />", {
			value: "0",
			latitude: "0",
			longitude: "0",
			text: "읍/면/동"
		}));
		$(".selectpicker").selectpicker('refresh');
	}
	else{
		$.ajax({
			type: "post",
			async: false,
//			url: "/common/getArea2",
			url : "/status/gasMeterDashBoard/_getArea2",
			data: {"area_Cd" : $("#area1 option:selected").val() },
			dataType: "json",
			beforeSend: function(xhr) {
				// 기존 내용 다 지우고
				$("#area2 option").remove();
				$("#area2").append($("<option />", {
					value: "0",
					latitude: "0",
					longitude: "0",
					text: "시/군/구"
				}));
				$("#area3 option").remove();
				$("#area3").append($("<option />", {
					value: "0",
					latitude: "0",
					longitude: "0",
					text: "읍/면/동"
				}));
				
				$(".selectpicker").selectpicker('refresh');
			},
			success: function(res) {
				if(res.result){
					for(var i = 0; i < res.area.length; i++){
						var data = res.area[i];
						$("#area2").append($("<option />", {
							value: data.area_Cd,
							latitude: data.area_Lat,
							longitude: data.area_Long,
							text: data.area_Nm
						}));
					}
					
					$(".selectpicker").selectpicker('refresh');
					
					var latitude = $("#gfLat").val();
					var longitude = $("#gfLong").val();
					
					map.getView().setCenter(ol.proj.transform([longitude / 1000000, latitude / 1000000], WGS84, MERCATOR));
					map.getView().setZoom(8);
					map.updateSize();
					
//					drawIcon(latitude, longitude);
//					coordinateToAddress(latitude, longitude);
				}else{
					
					alert("데이타 조회에 실패 하였습니다");
				}
			},
			error: function(err) {
				
			}
		});
	}
}

// 시군구 선택상자 변경 이벤트 핸들러
function area2ChangeEventHandler() {
	
	$("#gfLat").val($("#area2 option:selected").attr("latitude"));
	$("#gfLong").val($("#area2 option:selected").attr("longitude"));

	if($("#area2 option:selected").val() == 0){
		$("#area3 option").remove();
		$("#area3").append($("<option />", {
			value: "0",
			latitude: "0",
			longitude: "0",
			text: "읍/면/동"
		}));
		$(".selectpicker").selectpicker('refresh');
	}
	else{
		$.ajax({
			type: "post",
			async: false,
//			url: "/common/getArea3",
			url : "/status/gasMeterDashBoard/_getArea3",
			data: {"area_Cd" : $("#area2 option:selected").val() },
			dataType: "json",
			beforeSend: function(xhr) {
				// 기존 내용 다 지우고
				$("#area3 option").remove();
				$("#area3").append($("<option />", {
					value: "0",
					latitude: "0",
					longitude: "0",
					text: "읍/면/동"
				}));
				$(".selectpicker").selectpicker('refresh');
			},
			success: function(res) {
				if(res.result){
					for(var i = 0; i < res.area.length; i++){
						var data = res.area[i];
						$("#area3").append($("<option />", {
							value: data.area_Cd,
							latitude: data.area_Lat,
							longitude: data.area_Long,
							text: data.area_Nm
						}));
					}
					
					$(".selectpicker").selectpicker('refresh');
					var latitude = $("#gfLat").val();
					var longitude = $("#gfLong").val();
					
					map.getView().setCenter(ol.proj.transform([longitude / 1000000, latitude / 1000000], WGS84, MERCATOR));
					map.getView().setZoom(12);
					map.updateSize();
					
//					drawIcon(latitude, longitude);
//					coordinateToAddress(latitude, longitude);
				}else{
					
					alert("데이타 조회에 실패 하였습니다");
				}
			},
			error: function(err) {
				
			}
		});
	}	
}

// 읍면동 선택상자 변경 이벤트 핸들러
function area3ChangeEventHandler() {
	if($("#area3 option:selected").val() != 0){
		$("#gfLat").val($("#area3 option:selected").attr("latitude"));
		$("#gfLong").val($("#area3 option:selected").attr("longitude"));

		var latitude = $("#gfLat").val();
		var longitude = $("#gfLong").val();
		
		map.getView().setCenter(ol.proj.transform([longitude / 1000000, latitude / 1000000], WGS84, MERCATOR));
		map.getView().setZoom(14);
		map.updateSize();
		
	}
	
	
	
//	drawIcon(latitude, longitude);
//	coordinateToAddress(latitude, longitude);
}

function drawIcon(latitutde, longitude, mapMove){
	if(longitude > 0 && latitutde > 0){
		var coordinates = ol.proj.transform([longitude / 1000000, latitutde / 1000000], WGS84, MERCATOR);
//		var markerIcon = "/resources/images/tracking/flags/tack_icon.png";
		var markerIcon = "";
		var id = "alertAreaIcon";
//		var text = "알림지역";
		var text = "";
		
		var layer = getLayerFromId("alertAreaIconLayer");
		
		// layer 있으면 삭제
		if(layer != undefined && layer != null || (layer instanceof ol.layer.Vector)){
			map.removeLayer(layer);
		}
		
		layer = new ol.layer.Vector({id:"alertAreaIconLayer"});
		
		var feature = new ol.Feature({
			geometry: new ol.geom.Point(coordinates),
			name: text,
			id: id,
			icon:markerIcon
		});
		
		var source = new ol.source.Vector({
			features: [feature]
		});
		
		var style = new ol.style.Style({
			image: new ol.style.Icon({
				src: feature.get("icon"),
				anchorOrigin: "bottom-left",
				anchor : [0.0, 0.0]
			}),
			text: new ol.style.Text({
				text: feature.get("name"),
				fill: new ol.style.Fill({color: '#FFFFFF'}),
				textAlign: "center",
				offsetY: "17",
				font: "bold 15px Malgun Gothic",
				stroke: new ol.style.Stroke({
					color: '#000000',
					lineCap: "square",
			        width: "7"
				})
			})						
		});
		
//		var view = map.getView();
//        var projection = view.getProjection();
//        var resolutionAtEquator = view.getResolution();
//        var center = map.getView().getCenter();
//        var pointResolution = projection.getPointResolution(resolutionAtEquator, center);
//        var resolutionFactor = resolutionAtEquator/pointResolution;
//        var radius = ($("#gfRadiusNum option:checked").val() / ol.proj.METERS_PER_UNIT.m) * resolutionFactor;
//		
//		var circleFeature = new ol.Feature(new ol.geom.Circle(coordinates, radius));
//		
//		circleFeature.setStyle(
//			new ol.style.Style({
//				fill: new ol.style.Fill({
//					color: 'rgba(255, 204, 204, 0.3)'
//				}),
//				stroke: new ol.style.Stroke({
//					color: 'rgba(255, 204, 204, 1)',
//					width: 3
//				})
//			})
//		);
		
//		circleFeature.setId("radiusCircle");
		
//		source.addFeatures([circleFeature]);
			
		layer.setSource(source);
		layer.setStyle(style);
		
		map.addLayer(layer);
		
		if(mapMove == undefined || mapMove != false){
			map.getView().setCenter(coordinates);
		}
//		map.getView().setZoom(16);
		map.updateSize();
		
		// 위경도 저장
		$("#gfLat").val(latitutde);
		$("#gfLong").val(longitude);
	}
}

//좌표 -> 주소

function coordinateToAddress(latitude, longitude){
	// 주소 정제 태우기
	$.ajax({
		type: "post",
		url: "/admin/alertAreaMng/getCoordinateToAddress.do",
		data: {gfLat: latitude, gfLong: longitude},
		dataType: "json",
		success: function(res){
			
			// 리턴값이 있는지 확인
			if(res != null){
				// 있으면 attribute에 값이 담겨있을거임
				var data = res.attribute;
				
				// 데이터가 제대로 넘어왔는지 확인
				if(data != null){
					// 지번 주소가 있는지 확인
					if(data.oldAddr == null){
						// 없으면 문구 넣기
						$("#setreg #notiAreaOldAddr").val("주소가 없습니다.");
					}
					else{
						// 있으면 주소 넣기
						$("#setreg #notiAreaOldAddr").val(data.oldAddr);
					}
					
					// 도로명 주소가 있는지 확인
					if(data.newAddr == null){
						// 없으면 문구 넣기
						$("#setreg #notiAreaNewAddr").val("주소가 없습니다.");
					}
					else{
						// 있으면 주소 넣기
						$("#setreg #notiAreaNewAddr").val(data.newAddr);
					}
				}
				else {
					// 둘다 그냥 주소 없음 처리
					$("#setreg #notiAreaOldAddr").val("주소가 없습니다.");
					$("#setreg #notiAreaNewAddr").val("주소가 없습니다.");
				}
			}
		}
	});
}


//tool
function removeAllTooltips() {
	$(".tooltip.information").hide();
}

//지도 클릭 이벤트
function onClickEvent (evt) {
	if($(evt.originalEvent.target).parents(".lp_cont").length == 0){
		removeAllTooltips();
	}
	
	var f = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
		
		switch(layer.get("id")){
			// 클러스터를 클릭했을 때
			case "clusters":
				clickClusters(evt, feature,layer);
				break;
			
			default :
		}
		return feature;
	});
}


// 포인터 이동 이벤트
function onPointerMoveEvent (evt) {
	evt.preventDefault();
	
	if (evt.dragging) {
		return;
	}
	
	map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
		
		switch(layer.get("id")){
			case "traceRoute":
//				console.log("Trace");
				break;

			case "evtLayer":
			case "tempEvtLayer":
				var thingId = feature.get("id");
					
				eventDetailTooltip(thingId);
				
				var featurePixel = feature.getGeometry().getCoordinates();
				var tooltip = map.getOverlayById("evtdetail");
				
				//popupTooltip(tooltip, featurePixel);
				
				break;
			default :
				break;
		}
		
		return feature;
	});
	
}

// 지도 이동 이벤트
function onMoveEndEvent(evt) {
	currentFeatures = getFeaturesAtCurrentScreen();
	if(currentFeatures != undefined){
		viewItemReload(currentFeatures);
	}
//	loadStatusCount();
}

// 클러스터를 클릭했을 때 이벤트
function clickClusters(evt, feature, layer){
	var view = map.getView();
	var f = [];
	var size = 0;
	
//	console.log("clickClusters~~~~~~");
	
	
	// 클러스터링이 아닌 상황이라면 클릭한 위치의 사물 목록을 추출한다. 겹쳐져 있는 사물일 경우
	if(isClusteringStatus() == false){
		map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){
			f.push(feature);
		}, this);
		
		feature.set("features", f);
	}
	
	size = feature.get("features").length;
	
	if(size > 1/*view.getZoom() < 13*/ && view.getZoom() < 18){
		view.setZoom(view.getZoom() + 2);
		view.setCenter(feature.getGeometry().getCoordinates());
	}
	else{
		var popupContents = "";
		var tooltip;
		
		if(size > 0){
			for(var i = 0; i < size; i++){
				popupContents += feature.get("features")[i].get("id") + "<br>";
			}
		}
		else {
			popupContents += "No Contents";
		}
		
		if(size > 1){
			// 다수 사물. 사물 목록을 툴팁에 표시
			moveToCenter(feature.getGeometry().getCoordinates(), false);
			tooltip = map.getOverlayById("thingslist");
			thingsListTooltip(feature.get("features"));
			popupTooltip(tooltip, feature.getGeometry().getCoordinates());
		}
		else{
			// 단일 사물. 사물 정보를 툴팁에 표시
			moveToCenter(feature.get("features")[0].getGeometry().getCoordinates(), false);
			tooltip = map.getOverlayById("thingdetail");
			thingDetailTooltip(feature.get("features")[0].get("id"));
			//popupTooltip(tooltip, feature.get("features")[0].getGeometry().getCoordinates());
//			console.log($("#thingdetail"));
		}
		
//		//popupTooltip(tooltip, evt);
	}
}

//툴팁 초기화
function initTooltip () {
	
//	// 차량 상세정보 툴팁
//	var thingdetailTooltip = new ol.Overlay({
//		id: "thingdetail",
//		offset: [0, -20],
//		element: document.getElementById("thingdetail"),
//		positioning: "bottom-center",
//		stopEvent: false
//	});
	
	
	
	// 차량 리스트 툴팁
	var thingslistTooltip = new ol.Overlay({
		id: "thingslist",
		offset: [0, -20],
		element: document.getElementById("thingslist"),
		positioning: "bottom-center",
		stopEvent: true
	});
	
//	var evtdetailTooltip = new ol.Overlay({
//		id: "evtdetail",
//		offset: [0, -30],
//		element: document.getElementById("evtdetail"),
//		positioning: "bottom-center",
////        autoPan: true,
////        autoPanAnimation: {
////          duration: 250
////        },
//		stopEvent: false
//	});
	
//	map.addOverlay(thingdetailTooltip);
	map.addOverlay(thingslistTooltip);
//	map.addOverlay(evtdetailTooltip);
}



// Source 추출
function getClusterSource(){
	var layers = map.getLayerGroup().getLayers();
		
	for(var i = 0; i < layers.get("length"); i++){
		if(layers.item(i) == clusters){
			if(clusters.getSource() instanceof ol.source.Vector){
				return map.getLayerGroup().getLayers().item(i).getSource()
			}
			else if(clusters.getSource() instanceof ol.source.Cluster){
				return map.getLayerGroup().getLayers().item(i).getSource().getSource();
			}
			else{
				return null;
			}
		}
	}
}

// 클러스터링 상태 체크
function isClusteringStatus(){
	if(clusters.getSource() instanceof ol.source.Cluster){
		// 클러스터링 상태
		return true;
	}
	else if(clusters.getSource() instanceof ol.source.Vector){
		// 클러스터링 상태 아님
		return false;
	}
	else{
		// 형식이 잘못됨
		return null;
	}
}

//현재 화면에 표시된 사물 목록 객체 반환
function getFeaturesAtCurrentScreen() {
	if(clusters != undefined){
		return getClusterSource().getFeaturesInExtent(map.getView().calculateExtent(map.getSize()));
	}
}

// 현재 화면 크기 반환
function getExtentAtCurrentScreen() {
	var extent = map.getView().calculateExtent(map.getSize());
	
	return extent;
}

// Extent를 도분초 형식으로 변경
function ExtentToCoordinate(extent){
	
	if(extent == null || extent.length != 4){
		return false;
	}
	else {
		var resultExtent = [];
		var leftBottom = ol.proj.transform([extent[0], extent[1]], MERCATOR, WGS84);
		var rightTop = ol.proj.transform([extent[2], extent[3]], MERCATOR, WGS84);
		
		resultExtent[0] = Math.round(leftBottom[0] * 1000000);
		resultExtent[1] = Math.round(leftBottom[1] * 1000000);
		resultExtent[2] = Math.round(rightTop[0] * 1000000);
		resultExtent[3] = Math.round(rightTop[1] * 1000000);
		
		return resultExtent;
	}
}

// 현재 화면에 표시된 사물 목록의 Thing Id만 추출해 배열로 반환
function getFeaturesIdAtCurrentScreen() {
	var features = getFeaturesAtCurrentScreen();
	
	var ary = new Array();
	
	if(features != undefined){
		for(var i = 0; i < features.length; i++){
			ary.push(features[i].get("id"));
		}
	}
		
	return ary;
}

/**지도 위에 사물 목록 가져오기
 * run : 시동 상태 (0 : 시동On, 1 : 시동Off, 2 : 전체)
 * evt : 온도상태 (0 : 전체, 1 : 정상, 2 : 위반)
 */
function getThingsLocation(run, evt) {
    
//	if(run == undefined || run == null){
//		run = 2;
//	}
//	
//	if(evt == undefined || evt == null){
//		evt = 0;
//	}
	
    $.ajax({
    	url: "/status/gasMeterDashBoard/gpslocation",
    	type: "post",
    	async: true,
//    	data: {run : run, evt : evt},
    	dataType: "json",
    	success: function(result) {
    		
    		var count = result.length;
    		
    		if(features == undefined || features == null){
    			features = new Array();
    		}
    		else{
    			features.length = 0;
    			features = new Array();
    		}
    		
    		for (var i = 0; i < count; ++i) {
    			var data = result[i];
    			if(data.GPS_LONG == null || data.GPS_LAT == null){
    				continue;
    			}
    			var coordinates = ol.proj.transform([data.GPS_LONG / 1000000, data.GPS_LAT / 1000000], WGS84, MERCATOR);
//    			var coordinates = [14000000 + (Math.random() * 100000),4500000 + (Math.random() * 100000)];
    			features.push(new ol.Feature({
    				geometry: new ol.geom.Point(coordinates),
    				id: data.THING_ID,
    				name: data.THING_NM,
    				icon: data.ICON_PATH_NM + data.ICON_IMG_NM
    			}));
    	    }
   		
    		drawFeatures();
    		
    		clusters.setZIndex(2000);
    		map.addLayer(clusters);
    		
//    		clusters.on("change:visible", clusterLayerVisibleChangeHandler, this);
    		
    		// 지도 로딩 후 오른쪽 필터 수치 다시 한 번 맞춤
//    		loadStatusCount();
    	},
    	error: function(data) {
    		console.log("error");
    	}
    });
}

// Layer 스타일
// Cluster 스타일
function clusterLayerStyle (feature) {
//	console.log(feature);
	var size = feature.get('features').length;
	var clusterImg;

//	alert(size);
//	alert("getZoomLevel() : "+getZoomLevel());

//	console.log(size);
//	console.log("getZoomLevel() : "+getZoomLevel());
	
	if(size == 1){
		clusterImg = new ol.style.Icon({ src: feature.get('features')[0].get("icon") });
	}
	else if(size > 1 && getZoomLevel() == 18){
//		console.log("in!!!!!");
		
		clusterImg = new ol.style.Icon({ src: "/resources/images/tracking/things/gasmeter/Icon_gas02_multi.png" });
	}
	else if(size < 10){
		clusterImg = new ol.style.Icon({ src: "/resources/images/tracking/circles/c_x.png" });
	}
	else if(size >= 10 && size < 100){
		clusterImg = new ol.style.Icon({ src: "/resources/images/tracking/circles/c_xx.png" });
	}
	else if(size >= 100 && size < 1000){
		clusterImg = new ol.style.Icon({ src: "/resources/images/tracking/circles/c_xxx.png" });
	}
	else {
		clusterImg = new ol.style.Icon({ src: "/resources/images/tracking/circles/c_xxxx.png" });
	}
	if(size > 1 && getZoomLevel() >= 18){
		style = new ol.style.Style({
			image: clusterImg,
			text: new ol.style.Text({
				text: feature.get('features')[0].get("name"),
				fill: new ol.style.Fill({color: '#FFFFFF'}),
				textAlign: "center",
				offsetY: "23",
				font: "bold 15px Malgun Gothic",
				stroke: new ol.style.Stroke({
					color: '#000000',
					lineCap: "square",
			        width: "7"
				})
			})						
		});
	}else if(size == 1/* || getZoomLevel() == 18*/){
		style = new ol.style.Style({
			image: clusterImg,
			text: new ol.style.Text({
				text: feature.get('features')[0].get("name"),
				fill: new ol.style.Fill({color: '#FFFFFF'}),
				textAlign: "center",
				offsetY: "23",
				font: "bold 15px Malgun Gothic",
				stroke: new ol.style.Stroke({
					color: '#000000',
					lineCap: "square",
			        width: "7"
				})
			})						
		});
	}
	else{
		
		style = new ol.style.Style({
			image: clusterImg,
			text: new ol.style.Text({
				text: size.toString(),
				fill: new ol.style.Fill({color: '#000000'}),
				textAlign: "center",
				font: "bold 35px Malgun Gothic",
				stroke: new ol.style.Stroke({
					color: '#FFFFFF',
					lineCap: "square",
			        width: "7"
				})
			})
		});
	}
	
	return style;
}

// 단일 차량 Style
function normalLayerStyle (feature) {
	var style = new ol.style.Style({
		image: new ol.style.Icon({ src: feature.get("icon") }),
		text: new ol.style.Text({
			text: feature.get("name"),
			fill: new ol.style.Fill({color: '#FFFFFF'}),
			textAlign: "center",
			offsetY: "23",
			font: "bold 15px Malgun Gothic",
			stroke: new ol.style.Stroke({
				color: '#000000',
				lineCap: "square",
		        width: "7"
			})
		})						
	});
	
	return style;
}

function getThingDetailInfo(thingId) {
	$.ajax({
    	url: "/hmtTracking/thingDetailInfo",
    	type: "post",
    	data: {thingId : thingId},
    	dataType: "json",
    	success: function(result) {
//    		console.log(result);
    	},
    	error: function(data) {
    		console.log("error");
    	}
    });
}

/**
 * 궤적 그리기 함수
 * @param thingId 사물 ID
 * @param start 시작 시간
 * @param end 종료 시간
 * @param moveMap 지도를 중심으로 이동시킬지 여부, default true
 * @param isToday 당일 궤적 요청일 경우 true, default false
 */
function drawRoute(thingId, start, end, moveMap, isToday) {
	
	if(thingId == undefined || thingId == null){
//		thingId = 0;
		return false;
	}
	
	if(start == undefined || start == null){
//		start = 0;
		return false;
	}
	
	if(end == undefined || end == null){
//		end = 0;
		return false;
	}
	
	$.ajax({
    	url: "/hmtTracking/route",
    	type: "post",
    	data: {thingId : thingId, start : start, end : end},
    	dataType: "json",
    	beforeSend: function(xhr) {
    		removeRoute();	// 기존 궤적 삭제
    	},
    	success: function(res) {
    		
    		if(res.result){
    			
    			var data = res.data;
    			
    			if(data == null || data.length <= 0){
    				// 궤적 없음
    				if(isToday){
    					alert("당일 이동한 경로가 없습니다. 왼쪽 하단의 달력에서 날짜를 선택해주세요.");
    				}
    				else{
    					alert("해당 조건에 맞는 이동 기록이 없습니다.");
    				}
    				
    				traceItem.thingId = null;
    				traceItem.thingNm = null;
    				traceItem.start = null;
    				traceItem.end = null;

//    				$("#routeevtgrid").hide();
    				
    				return false;
    			}
    			else{
    				// 궤적 있음
    				var routeInfo = [];
    				var points = [];
    				
    				// 경로를 Feature에 삽입
    				for(var i = 0; i < data.length; i++){
    					
//    					if(i == 0){
//        					$("#routeevtgrid_rec_dttm").html(data[i].MIN_OCCUR_DTTM + " ~ " + data[i].MAX_OCCUR_DTTM);
//    					}
    					
    					points.push(ol.proj.transform([data[i].GPS_LONG / 1000000, data[i].GPS_LAT / 1000000], WGS84, MERCATOR));
    					routeInfo.push({
    						id: i,
    						points: ol.proj.transform([data[i].GPS_LONG / 1000000, data[i].GPS_LAT / 1000000], WGS84, MERCATOR),
    						time : data[i].OCCUR_DTTM
    					});
    				}
            		
            		var featureLine = new ol.Feature({
            			type: "route",
            			geometry: new ol.geom.LineString(routeInfo.map(function(ary) { return ary.points; })),
            			time: "0000:00:00"
            		  });

            		var sourceLine = new ol.source.Vector({
            			features: [featureLine]
            		  });
            		
            		// 선 스타일 정의
            		var styles = {
            			'route': [
            				new ol.style.Style({
	            				stroke: new ol.style.Stroke({
	            					width: 5, color: [0x00, 0x00, 0x00, 1.0]
	            				})
            				})
            			]
            		};

            		routeLayer = new ol.layer.Vector({
            			id: "traceRoute",
            			source: sourceLine,
            			style: function(feature, resolution) {
            				var geometry = feature.getGeometry();
            				
            				styles['route'].length = 0;
            				styles['route'].push(
            					new ol.style.Style({
            						stroke: new ol.style.Stroke({
            							width: 5, color: [0x00, 0x00, 0x00, 1.0]
            						})			
            					})
            				);
            				
            				// 궤적 위 화살표 그리기. 최소 60픽셀 이상마다 하나씩 표시
            				var pivot = [0.0, 0.0];
            				var startIcon = "/resources/images/tracking/flags/flag_start.png";
            				var endIcon = "/resources/images/tracking/flags/flag_arrive.png";
            				var arrowIcon = "/resources/images/tracking/cursors/pink/pink_03.png";
            				
            				var loopCnt = 0;
            				
            				geometry.forEachSegment(function(start, end) {
            					
            					endPixel = map.getPixelFromCoordinate(end);
            					
            					var distance = Math.pow(Math.abs(pivot[0] - endPixel[0]), 2) + Math.pow(Math.abs(pivot[1] - endPixel[1]), 2);
            					
            					var icon;
            					
        						if(loopCnt == routeInfo.length - 2){
        							icon = endIcon;
        						}
        						else{
        							icon = arrowIcon;
        						}
            					
            					if(distance > 3600 || loopCnt == routeInfo.length - 2){
            					
            						pivot = endPixel;
            						
            						var dx = end[0] - start[0];
            						var dy = end[1] - start[1];
            						
            						var rotation = Math.atan2(dy, dx);
            						var iconAnchor = [0.75, 0.5];
            						
            						
            						styles['route'].push(new ol.style.Style({
            							geometry: new ol.geom.Point(end),
            							image: new ol.style.Icon({
            								src: arrowIcon,
            								anchor: [0.75, 0.5],
            								rotateWithView: false,
            								rotation: -rotation
            							}),
            							text: new ol.style.Text({
            								text: isVisibleTime ? routeInfo[loopCnt].time : "",
            								fill: new ol.style.Fill({color: '#FFFFFF'}),
            								textAlign: "center",
            								offsetY: "23",
            								font: "bold 12px Malgun Gothic",
            								stroke: new ol.style.Stroke({
            									color: '#000000',
            									lineCap: "square",
            							        width: "5"
            								})
            							})
            						}));
            						
            						if(loopCnt == 0){
            							// 첫 지점에 출발점 이미지 표시
            							styles['route'].push(new ol.style.Style({
                							geometry: new ol.geom.Point(start),
                							image: new ol.style.Icon({
                								src: startIcon,
                								anchor: [0.5, 1.0],
                								rotateWithView: false,
                								rotation: 0
                							}),
                							text: new ol.style.Text({
                								text: isVisibleTime ? routeInfo[loopCnt].time : "",
                								fill: new ol.style.Fill({color: '#FFFFFF'}),
                								textAlign: "center",
                								offsetY: "23",
                								font: "bold 12px Malgun Gothic",
                								stroke: new ol.style.Stroke({
                									color: '#000000',
                									lineCap: "square",
                							        width: "5"
                								})
                							}),
                							zIndex:5000
                						}));
            						}
            						else if(loopCnt == routeInfo.length - 2){
            							// 마지막 지점에 종료점 이미지 표시
            							styles['route'].push(new ol.style.Style({
                							geometry: new ol.geom.Point(end),
                							image: new ol.style.Icon({
                								src: endIcon,
                								anchor: [0.5, 1.0],
                								rotateWithView: false,
                								rotation: 0
                							}),
                							text: new ol.style.Text({
                								text: isVisibleTime ? routeInfo[loopCnt].time : "",
                								fill: new ol.style.Fill({color: '#FFFFFF'}),
                								textAlign: "center",
                								offsetY: "23",
                								font: "bold 12px Malgun Gothic",
                								stroke: new ol.style.Stroke({
                									color: '#000000',
                									lineCap: "square",
                							        width: "5"
                								})
                							}),
                							zIndex:5000
                						}));
            						}
            					}
            					
            					loopCnt++;
            				});
            				
            				return styles[feature.get('type')];
            			}
            		});
            		
            		map.addLayer(routeLayer);
            		
            		// 지도 Resize 여부 Flag, true 혹은 미 지정 : Resizing, false : 그냥 두기
            		if(moveMap == undefined || moveMap ){
            			fitFeaturestoMap(routeLayer, featureLine);
            		}
    			}
    		}
    		else{
    			// System fail
    		}
    		
    	},
    	error: function(data) {
    		console.log("error");
    	}
    });
}

function removeRoute(){
	for(var i = 0; i < map.getLayers().get("length"); i++){
		if(map.getLayers().item(i).get("id") == "traceRoute"){
			map.removeLayer(map.getLayers().item(i));
		}	
	}
}

function removeLayerfromId(id){
	for(var i = 0; i < map.getLayers().get("length"); i++){
		if(map.getLayers().item(i).get("id") == id){
			map.removeLayer(map.getLayers().item(i));
		}	
	}
}

function findLayerfromId(id){
	for(var i = 0; i < map.getLayers().get("length"); i++){
		if(map.getLayers().item(i).get("id") == id){
			return map.getLayers().item(i);
		}	
	}

	return null;
}

function getFeatureLocation(thingId){
	for(var i = 0; i < features.length; i++){
		if(features[i].get("id") == thingId){
			return features[i].getGeometry().getCoordinates();
		}
	}
	return null;
}

function moveToCenter(coordinates, levelChange) {
	
	if(coordinates == null || isNaN(coordinates[0]) || isNaN(coordinates[1])){
		alert("좌표가 없습니다");
		return false;
	}
	
	map.getView().setCenter(coordinates);
	
	if(levelChange != undefined && levelChange == false){
		// Level 변경 안함
	}
	else{
		setZoomLevel(18);
	}
}

// 뿌릴 것 (ex : 궤적) 에 따라 화면 Resize 및 Zoom Level 변경 함수
function fitFeaturestoMap(layer, features){
	map.getView().fit(layer.getSource().getExtent(), map.getSize());
}

function changeMapColor(){
	this.isMonoTone = this.isMonoTone ? false : true;
	map.getLayerGroup().getLayers().item(0).setSource(mapSource());
}

function changeTimeVisiblity(){
	this.isVisibleTime = this.isVisibleTime ? false : true; 
	for(var i = 0; i < map.getLayers().get("length"); i++){
		if(map.getLayers().item(i).get("id") == "traceRoute"){
			map.getLayers().item(i).changed();
		}
	}
}

function showDim() {
	$("#wrap").prepend($("<div />", { class:"dimmed" }));
}

function removeDim() {
	$("div[class=dimmed]").remove();
}

// Tooltip Ajax
function thingDetailTooltip(thingId) {
	// 단일 기기 선택시 툴팁은 표시 안함
//	$.ajax({
//		url: "/hmtTracking/thingdetail",
//    	type: "post",
//    	data: {thingId : thingId},
//    	dataType: "html",
//    	async: false,
//    	beforeSend: function(xhr) {
////    		$("#thingdetail").html("")
//    	},
//    	success: function(res) {
//    		$("#thingdetail").html($(res).html());
//    		$("#thingdetail").append($("<input />", {id:"id", type:"hidden", value:thingId}));
//    	},
//    	error: function(err) {
//    		
//    	}
//	});
	
	return false;
}

function thingsListTooltip(features) {
	
	var featureList = [];
	
	for(var i = 0; i < features.length; i++){
		featureList.push(features[i].get("id"));
	}
	
	$.ajax({
		url: "/status/gasMeterDashBoard/thingslist",
    	type: "post",
    	data: {thingIds : featureList.toString()},
    	dataType: "html",
//    	async: false,
    	beforeSend: function(xhr) {
    	},
    	success: function(res) {
    		$("#thingslist").html($(res).html());

    	},
    	error: function(err) {
    		
    	}
	});
	
	return false;
}

function eventDetailTooltip(evtId, thingId) {
	$.ajax({
		url: "/hmtTracking/evtdetail",
    	type: "post",
    	data: {evtId : evtId, thingId : thingId},
    	dataType: "html",
    	async: false,
    	beforeSend: function(xhr) {
//    		$("#thingdetail").html("")
    	},
    	success: function(res) {
    		$("#evtdetail").html($(res).html());
    		$("#evtdetail").append($("<input />", {id:"id", type:"hidden", value:thingId}));
    	},
    	error: function(err) {
    		
    	}
	});
	
	return false;
}


// Handler

//지도 축척 바뀌는 것 감지 하는 핸들러
function levelChangeHandler(evt) {
	// 클러스터링 유무에 따라 다시 그리기
	drawFeatures();
}

// 사물 목록 그리기
function drawFeatures(){
	// 최대 확대 Level에서는 클러스터링 해제
	
	// 클러스터 초기화
	if(clusters == undefined || clusters == null){
		clusters = new ol.layer.Vector({id: "clusters"});
	}
	
//	if(getZoomLevel() >= 18) {
//		var source = new ol.source.Vector({
//			features: features
//		});
//		
//		clusters.setSource(source);
//		clusters.setStyle(normalLayerStyle);
//	}
//	else {
		
		var source = new ol.source.Vector({
			features: features
		});

		var clusterSource = new ol.source.Cluster({
			distance: 100,
			source: source
		});
		
		clusters.setSource(clusterSource);
		clusters.setStyle(clusterLayerStyle);
//	}
}

// 여러 사물 목록 툴팁에서 사물이름을 클릭했을 때 동작하는 핸들러
function thingsListClickHandler(evt) {
	evt.preventDefault();
	
	removeAllTooltips();
	
	thingDetailTooltip($(this).val());
	
	var tooltip = map.getOverlayById("thingdetail");	
	
	//popupTooltip(tooltip, getFeatureLocation($(this).val()));
}

function popupTooltip(overlay, evt) {
	
	if(evt.coordinate != undefined){
		overlay.setPosition(evt.coordinate);
	}
	else if(evt instanceof Array){
		overlay.setPosition(evt);
	}
	else{
		overlay.setPosition([evt.clientX, evt.clientY]);
	}

	popup = overlay.getElement();

	$(popup).show();
	//	$(popup).modal();
	 
}

/**
 * 경로보기 <-> 현위치 보기 모드 변경
 */
function clusterLayerVisibleChangeHandler(evt) {
	if(isTraceMode == true){
		removeAllTooltips();
		$("#sb_org .srchrlt.sb_cnd li").remove();
		$("#sb_org .hddfrm.new_hddfrm").find("[name=org] option").removeAttr("selected");
		$("#sb_org .hddfrm.new_hddfrm").find("[name=org] option:first").attr("selected", "selected");
		$("#sb_org .hddfrm.new_hddfrm").find("[name=cond] option").removeAttr("selected");
		$("#sb_org .hddfrm.new_hddfrm").find("[name=cond] option:first").attr("selected", "selected");
		$("#sb_org .hddfrm.new_hddfrm").find("[name=rn]").removeAttr("checked");
		$("#sb_org .hddfrm.new_hddfrm").find("[name=rn]:first").prop("checked", true)
		$("#sb_org .hddfrm.new_hddfrm").find("[name=temp]").removeAttr("checked");
		$("#sb_org .hddfrm.new_hddfrm").find("[name=temp]:first").prop("checked", true)
		$("#sb_org .hddfrm.new_hddfrm").find("[name=keyword]").val("");
		$(".chk_car_result").hide();
		favoriteAreaCancelBtnClickHandler();
		$("#rightsidemenu").hide();
		$("#sidemenu li.act_9.liste button").prop("disabled", false);
		$("#sidemenu li.act_9.liste button").css("cursor", "");
		$("#sidemenu li.act_9.liste button").show()
		$("#thingdtlgrid").hide();
		$("#statusSrch").find(".on").removeClass("on");
//		$("#route_evt .btn_open").show();
//		$("#routeevtgrid").show();
	}
	else{
		$("#sb_stt .srchrlt.sb_cnd li").remove();
		$("#calendar").clearActiveDates();
		$("#calendar").selectToday();
		$(".nBCal.strain").hide();
		$("#sb_stt .hddfrm.new_hddfrm").find("#org option:first").attr("selected", "selected");
		$("#sb_stt .hddfrm.new_hddfrm").find("[name=cond] option:first").attr("selected", "selected");
		$("#sb_stt .hddfrm.new_hddfrm").find("[name=keyword]").val("");
		$(".chk_car_detail").hide();
		$("#rightsidemenu").show();
		$("#sidemenu li.act_9.liste button").prop("disabled", true);
		$("#sidemenu li.act_9.liste button").css("cursor", "not-allowed");
		$("#sidemenu li.act_9.liste button").hide();
		isVisibleTime = false;
		removeLayerfromId("evtLayer");
		removeLayerfromId("tempEvtLayer");
		$(".nBCal.strain").hide();
	}
}

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

/**
 * 새로고침 할 때 목록 갱신. 현재 화면에 보이는 사물만 나오도록 화면 좌표(Extent) 전달
 */
function viewItemReload() {
	
	$("#datailList").clearGrid();
	
	if(!isTraceMode){
		$("#datailList").setGridParam({
			postData: { extent : ExtentToCoordinate(getExtentAtCurrentScreen()).toString() }
		}).trigger("reloadGrid");
	}
}

/**
 * 새로고침 버튼 클릭 이벤트 핸들러
 */
function reloadBtnClickHandler(evt) {
	
	evt.preventDefault();
	
	searchGasDashInfo();
	
	var now = new Date();
	var nowAll = leadingZeros(now.getHours(), 2) + ":" + leadingZeros(now.getMinutes(), 2) + ":" + leadingZeros(now.getSeconds(), 2);
	$('.lastmdate').html(nowAll);					
	
	
//	$('.lastmdate').html(moment(new Date).format("HH:mm:ss").toString());
	
	if(isTraceMode){
		
		removeRoute();
		
//		console.log("Reload Trace " + new Date());
		var timeslide = $("#range").val().split(";");
		
//		var thingId = $(".sb_stt .selectedThing").parent("li").val();
//		var startTime = moment(timeslide[0] * 1000).format("YYYYMMDDHH") + "0000";
//		var endTime = moment(timeslide[1] * 1000).format("YYYYMMDDHH") + "5959";
		var thingId = traceItem.thingId;
		var startTime = traceItem.start;
		var endTime = traceItem.end;
		if(thingId != undefined && thingId != null){
			drawRoute(thingId, startTime, endTime, false);
		}
	}
	else{
//		console.log("Reload Features " + new Date());
		getThingsLocation();
	}
}


/**
 * 새로고침 버튼 클릭 이벤트 핸들러
 */
function reloadBtnClickHandler2(evt) {

	alert('reloadBtnClickHandler2');
	alert('reloadBtnClickHandler2');
	
	if($("#mreload").is(":checked")){
		$("#mreload").prop("checked",false);	
	}else{
		$("#mreload").prop("checked",true);
	}
	
	
	
	
}

function removeAllTooltips() {
	$(".tooltip.information").hide();
}


