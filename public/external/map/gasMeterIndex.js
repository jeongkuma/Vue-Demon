var schCondition;
var schKeyword;
var schDttm; //전송,수신일시

var md_Tp = "";
var form_Date = "";
var to_Date = "";

$(document).ready(function() {

//    loadgasDashBoardList();
	
	getCmnCd("GAS_METER_TYPE");

    // Enter 키 처리(form submit 방지)
    $("form[id=gasDashBoardList]").keypress(function(e) {
        //Enter key
        if (e.which == 13) {
            return false; // 또는 chkSrchType();
        }
    });
//    
//	// 새로고침 버튼 클릭 이벤트 핸들러
//	$("#mreload").on("click", reloadBtnClickHandler);
//
//    
//	timerId = 0;
//	var time = 0;
//
//	/*
//	 * 대시보드 지표 자동갱신 체크박스
//	 */
//	$(".hsyle").change(function() {
//		if ($(this).is(":checked")) {
//			$(this).parent().addClass("on");
//
//			time = $('#treload').val();
//			time = (time) * 1000;
//			/* time = time * 1000; */
//
//			viewMainChart();
//			timerId = setInterval("viewMainChart()", time);
//		} else {
//			$(this).parent().removeClass("on");
//			clearInterval(timerId);
//		}
//	});
//	
//	// 처음부터 자동 갱신 되도록 클릭
//	$("#mreload").trigger("click");
//	nowTimerId = setInterval("nowTime()", 1000);
    
    
});

$(window).resize(function() {
    $("#grid").setGridWidth($(".rcontents").width(), true);
});


/* 
 * 대시보드 차트 표시
 **/
function viewMainChart(){
	
	
	searchGasDashInfo();
//	reloadBtnClickHandler();
	
	var now = new Date();
	var nowAll = leadingZeros(now.getHours(), 2) + ":" + leadingZeros(now.getMinutes(), 2) + ":" + leadingZeros(now.getSeconds(), 2);
	$('.lastmdate').html(nowAll);					
	
}




/*
 * 대시보드 자동갱신 시간 변경시
 */
function timeChange() {
	if ($('#mreload').is(":checked")) {
		clearInterval(timerId);

		var time = 0;
		time = $('#treload').val();

		time = (time * 60) * 1000;
		/* time = time * 1000; */

		timerId = setInterval("viewMainChart()", time);
	}
}

/*
 * 대시보드 Now 시간 변경(1초마다)
 */
function nowTime() {
	var now = new Date();
	var nowAll = leadingZeros((now.getMonth() + 1), 2) + "-"
			+ leadingZeros(now.getDate(), 2) + " "
			+ leadingZeros(now.getHours(), 2) + ":"
			+ leadingZeros(now.getMinutes(), 2) + ":"
			+ leadingZeros(now.getSeconds(), 2);
	$('.nowdate').html(nowAll);
}

/*
 * 시,분,초 두자리가 아닐 시 앞에 0 붙여줌
 */
function leadingZeros(n, digits) {
	// 1 - > 01 변경
	var zero = "";
	n = n.toString();

	if (n.length < digits) {
		for (var i = 0; i < digits - n.length; i++)
			zero += '0';
	}

	return zero + n;
}



// click시 상세조회 페이지 이동
function goDetailSelect(ide_num){
	if(ide_num == null){ return;} 
//	location.href="/status/gasMeterDashBoard/gasDashBoardDetail";
//	
	$("#gasDetailForm").attr({"method": "post"});
	$("#gasDetailForm").attr("action", "/status/gasDashBoardDetail/_detailView");
	$("#gasDetailForm").submit();	
	  
}

/*
 * 
 * */
function getCmnCd(cd_id){
	var obj;
	if(cd_id == "GAS_METER_TYPE"){
		obj = $("#sel_meter_type"); 
	}
	
	$.ajax({
		type: "post",
		url: "/status/gasMeterInstallationMng/_cdSelect",
		data: {"cd_id":cd_id},
		dataType: "json",
		success: function(data) {
			
			obj.html('');
			var items = data.cdSelect;
			
			if(cd_id == "GAS_METER_TYPE") obj.append('<option value="0">전체</option>');
			for(var i=0; i < items.length; i++){
				obj.append('<option value="'+items[i].cd_Val+'">'+items[i].cd_Nm+'</option>');
			}
			
			obj.selectpicker('refresh');
		},
		error: function(data) {
			// alert("입력이 올바르지 않습니다.");
		}
	});
}

/*
 * 통신현황 검색(적용)
 * */
function goApply1() {

    validateData();
 
    var tSearchType  = $("#selectTransmitSearch").val();
    
    if( tSearchType== "M"){
        startMonth = moment($("#form_tmDate").val(), "YYYY-MM-DD").add(1, 'months').format('YYYY-MM-DD');
        startMonth = $("#form_tmDate").val()+'-01';
    	var date = new Date( $("#to_tmDate").val());
    	endDay = moment(date).endOf("month").format("DD");
    	endMonth = $("#to_tmDate").val()+'-'+endDay;
    	form_Date = startMonth;
    	to_Date = endMonth; 
        $("#form_Date").val(form_Date);
        $("#to_Date").val(to_Date);
    	var f = moment(form_Date), t = moment(to_Date);
    	if (t.diff(f, 'months') > 2) {
    		alert('조회기간은 3개월 이내만 가능합니다.');
    		return;
    	}
    } else if( tSearchType== "D"){
    	form_Date = $("#form_tDDate").val();
    	to_Date = $("#to_tDDate").val();
    	$("#form_Date").val(form_Date);
    	$("#to_Date").val(to_Date);
    	var f = moment(form_Date), t = moment(to_Date);
    	if (t.diff(f, 'days') > 6) {
    		alert('조회기간은 1주일 이내만 가능합니다.');
    		return;
    	}
    } else {
    	form_Date = $("#form_ttDate").val();
    	to_Date = $("#to_ttDate").val();
    	$("#form_Date").val(form_Date);
    	$("#to_Date").val(to_Date);
    	var f = moment(form_Date), t = moment(to_Date);
    	if (t.diff(f, 'days') > 0) {
    		alert('조회기간은 1일 이내만 가능합니다.');
    		return;
    	}
    }
    
    //기간별 조회(통신)
		$("#baseFrom").ajaxSubmit({
			url :  "/status/gasMeterDashBoard/_detailInfoTransmitSumStatus",
			data: {
			      "form_tDate" : $("#form_Date").val() ,
			      "to_tDate"    : $("#to_Date").val() ,
			      "searchType" : $("#selectTransmitSearch").val(),
			      "meter_type"  : $("#sel_meter_type").val(),
			}, 
			type : "post",
			success : function(data) {
				document.getElementById("tableTransmitPop").innerHTML = data;
//				openTransmitPop();
			},
			error : function(data){
				// alert("입력이 올바르지 않습니다.");
			},
			beforeSend: function() {
				$('.apply1').prop('disabled', true);
			},
			complete: function() {
				$('.apply1').prop('disabled', false);
			}
		});
}

function openTransmitPop(data){
	
    var selectTransmitSearch = $("#selectTransmitSearch").val();
	//$('.modal-dialog').draggable();
    
	if(selectTransmitSearch==""){
		$('#datetimepicker1').show(); 
		$('#datetimepicker2').show();
		$('#datetimepicker3').hide(); 
		$('#datetimepicker4').hide();
		$('#datetimepicker5').hide(); 
		$('#datetimepicker6').hide();
       
        $("#form_tDDate").val($("#hidForm_tDDate").val());
        $("#to_tDDate").val($("#hidTo_tDDate").val());
	} else if(selectTransmitSearch=="M"){
		$('#datetimepicker1').hide(); 
		$('#datetimepicker2').hide();
		$('#datetimepicker3').show(); 
		$('#datetimepicker4').show();
		$('#datetimepicker5').hide(); 
		$('#datetimepicker6').hide();
        
        $("#form_tmDate").val($("#hidForm_tmDate").val());
        $("#to_tmDate").val($("#hidTo_tmDate").val());
	} else if(selectTransmitSearch=="D"){
		$('#datetimepicker1').show(); 
		$('#datetimepicker2').show();
		$('#datetimepicker3').hide(); 
		$('#datetimepicker4').hide();
		$('#datetimepicker5').hide(); 
		$('#datetimepicker6').hide();
		
		$("#form_tDDate").val($("#hidForm_tDDate").val());
        $("#to_tDDate").val($("#hidTo_tDDate").val());
	} else if(selectTransmitSearch=="T"){
		$('#datetimepicker1').hide(); 
		$('#datetimepicker2').hide();
		$('#datetimepicker3').hide(); 
		$('#datetimepicker4').hide();
		$('#datetimepicker5').show(); 
		$('#datetimepicker6').show();
		
		$("#form_ttDate").val($("#hidForm_ttDate").val());
        $("#to_ttDate").val($("#hidTo_ttDate").val());
	} 	
	
      $("#myModalTransmit").modal();
}

/*
 * 통신현황 검색(초기화)
 * */
function goInit1() {
	$('#datetimepicker1').hide(); 
	$('#datetimepicker2').hide();
	$('#datetimepicker3').show(); 
	$('#datetimepicker4').show();
	$('#datetimepicker5').hide(); 
	$('#datetimepicker6').hide();
	var fromDate = $("#hidForm_tmDate").val();
	var toDate = $("#hidTo_tmDate").val();
	$("#selectTransmitSearch").val("M");
	$("#selectTransmitSearch").selectpicker('refresh');
	$("#form_tmDate").val(fromDate);
	$("#to_tmDate").val(toDate);
}

/*
 * 장애현황 검색(적용)
 * */
function goApply2() {

    validateData();
 
    var eSearchType  = $("#selectErrorSearch").val();
    
    if( eSearchType== "M"){
        startMonth = moment($("#form_emDate").val(), "YYYY-MM-DD").add(1, 'months').format('YYYY-MM-DD');
        startMonth = $("#form_emDate").val()+'-01';
    	var date = new Date( $("#to_emDate").val());
    	endDay = moment(date).endOf("month").format("DD");
    	endMonth = $("#to_emDate").val()+'-'+endDay;
    	form_Date = startMonth;
    	to_Date = endMonth;
    	
        $("#form_Date").val(form_Date);
        $("#to_Date").val(to_Date);
    	var f = moment(form_Date), t = moment(to_Date);
    	if (t.diff(f, 'months') > 2) {
    		alert('조회기간은 3개월 이내만 가능합니다.');
    		return;
    	}
    } else if( eSearchType== "D"){
    	form_Date = $("#form_eDDate").val();
    	to_Date = $("#to_eDDate").val();
    	$("#form_Date").val(form_Date);
    	$("#to_Date").val(to_Date);
    	var f = moment(form_Date), t = moment(to_Date);
    	if (t.diff(f, 'days') > 6) {
    		alert('조회기간은 1주일 이내만 가능합니다.');
    		return;
    	}
    } else {
    	form_Date = $("#form_etDate").val();
    	to_Date = $("#to_etDate").val();
    	$("#form_Date").val(form_Date);
    	$("#to_Date").val(to_Date);
    	var f = moment(form_Date), t = moment(to_Date);
    	if (t.diff(f, 'days') > 0) {
    		alert('조회기간은 1일 이내만 가능합니다.');
    		return;
    	}
    }
    
    //기간별 조회(장애현황)
	$("#baseFrom").ajaxSubmit({
		url :  "/status/gasMeterDashBoard/_detailInfoErrorSumStatus",
		data: {
		      "form_eDate" : $("#form_Date").val() ,
		      "to_eDate"     : $("#to_Date").val(),
		      "searchType" : $("#selectErrorSearch").val(),
		}, 
		type : "post",
		success : function(data) {
			document.getElementById("tableErrorPop").innerHTML = data;
//			openErrorPop();
		},
		error : function(data){
			// alert("입력이 올바르지 않습니다.");
		},
		beforeSend: function() {
			$('.apply2').prop('disabled', true);
		},
		complete: function() {
			$('.apply2').prop('disabled', false);
		}
	}); 
}



function openErrorPop(){
	
	
    var selectErrorSearch = $("#selectErrorSearch").val();
	//$('.modal-dialog').draggable();
    
	if(selectErrorSearch==""){
		$('#datetimepicker7').show(); 
		$('#datetimepicker8').show();
		$('#datetimepicker9').hide(); 
		$('#datetimepicker10').hide();
		$('#datetimepicker11').hide(); 
		$('#datetimepicker12').hide();
		
		$("#form_eDDate").val($("#hidForm_eDDate").val());
        $("#to_eDDate").val($("#hidTo_eDDate").val());
	} else if(selectErrorSearch=="M"){
		$('#datetimepicker7').hide(); 
		$('#datetimepicker8').hide();
		$('#datetimepicker9').show(); 
		$('#datetimepicker10').show();
		$('#datetimepicker11').hide(); 
		$('#datetimepicker12').hide();
		
        $("#form_emDate").val($("#hidForm_emDate").val());
        $("#to_emDate").val($("#hidTo_emDate").val());
	} else if(selectErrorSearch=="D"){
		$('#datetimepicker7').show(); 
		$('#datetimepicker8').show();
		$('#datetimepicker9').hide(); 
		$('#datetimepicker10').hide();
		$('#datetimepicker11').hide(); 
		$('#datetimepicker12').hide();
		
		$("#form_eDDate").val($("#hidForm_eDDate").val());
        $("#to_eDDate").val($("#hidTo_eDDate").val());
	} else if(selectErrorSearch=="T"){
		$('#datetimepicker7').hide(); 
		$('#datetimepicker8').hide();
		$('#datetimepicker9').hide(); 
		$('#datetimepicker10').hide();
		$('#datetimepicker11').show(); 
		$('#datetimepicker12').show();
		
		$("#form_etDate").val($("#hidForm_etDate").val());
        $("#to_etDate").val($("#hidTo_etDate").val());
	} 
    
	$("#myModalError").modal(); 
}


/*
 * 장애현황 검색(초기화)
 * */
function goInit2() {
	$('#datetimepicker7').hide(); 
	$('#datetimepicker8').hide();
	$('#datetimepicker9').show(); 
	$('#datetimepicker10').show();
	$('#datetimepicker11').hide(); 
	$('#datetimepicker12').hide();
	
	var fromDate = $("#hidForm_emDate").val();
	var toDate = $("#hidTo_emDate").val();
	$("#selectErrorSearch").val("M");
	$("#selectErrorSearch").selectpicker('refresh');
	$("#form_emDate").val(fromDate);
	$("#to_emDate").val(toDate);
}

function validateData() {
    /*	
    	if(sTrim.length == 0){
    		alert("검색어를 입력하여 주십시오.");
    		$("#schKeyword").focus();
    		return;
    	}	
    */
}

/** 최초 화면 로딩 시 조회*/
function searchGasDashInfo(){
	$("#form_Date").val("");
    $("#to_Date").val(""); 
	
	/** 계량기 현황*/
	searchGasDashBoardDashInfo();
	/** 통신 현황*/
	searchGasDashBoardTransmitInfo($("#sel_meter_type").val());
	/** 장애 현황*/
	searchGasDashBoardErrorInfo();
	
}


function searchGasDashBoardDashInfo(){
	$("#baseFrom").ajaxSubmit({
		url :  "/status/gasMeterDashBoard/_detailInfoMeterStatus",
//		data: {"tempGasDashId":$("#tempGasDashId").val()},
		type : "post",
		success : function(data) {
			document.getElementById("tableMeterInfo").innerHTML = data;
		},
		error : function(data){
			// alert("입력이 올바르지 않습니다.");
		}
	});
}


function searchGasDashBoardTransmitInfo(bigSmallflux){
	if(bigSmallflux == null || bigSmallflux == undefined || bigSmallflux == ""){
		bigSmallflux = "0"; 
	}
	
	
	$("#baseFrom").ajaxSubmit({
		url :  "/status/gasMeterDashBoard/_detailInfoTransmitStatus",
		data: {"meter_type": bigSmallflux},
		type : "post",
		success : function(data) {
			document.getElementById("tableTransmitInfo").innerHTML = data;
		},
		error : function(data){
			// alert("입력이 올바르지 않습니다.");
		}
	});
}
 
function searchGasDashBoardErrorInfo(){
	$("#baseFrom").ajaxSubmit({
		url :  "/status/gasMeterDashBoard/_detailInfoErrorStatus",
		type : "post",
		success : function(data) {
			$('#tableErrorInfo').html(data);
			$("#getGasMeterDashBoardPowerOffPop").click(function() {
				$("#myModal").modal();
			});
			$("#getGasMeterDashBoardTransmitErrorPop").click(function() {
				$("#myModal2").modal();
			});
			$("#getGasMeterDashBoardUsedErrorPop").click(function() {
				$("#myModal3").modal();
			});
			$("#getGasMeterDashBoardAlarmPop").click(function() {
				$("#myModal4").modal();
			});
		},
		error : function(data){
			// alert("입력이 올바르지 않습니다.");
		}
	});
}

/** 기간별 검색 보이기/감추기 */
function toggleDisplay(divId) {
	 var div = document.getElementById(divId);
	 div.style.display = (div.style.display=="block" ? "none" : "block");
}

/**
 * 달력
 */
$(function () {
	
		$('.modal-dialog').draggable();
	
        $('#datetimepicker1').datetimepicker({
			   useCurrent: false, //Important! See issue #1075
	           viewMode: 'days',
	           format: 'YYYY-MM-DD',
    	       ignoreReadonly:true,
               showClose: true
	    }).on('dp.show', function(){
	    	  $('#datetimepicker1').data("DateTimePicker").maxDate($("#to_tDDate").val());
	    });
        $('#datetimepicker2').datetimepicker({
			   useCurrent: false, //Important! See issue #1075
	           viewMode: 'days',
	           format: 'YYYY-MM-DD',
    	       ignoreReadonly:true,
               showClose: true
	    }).on('dp.show', function(){
	    	  $('#datetimepicker2').data("DateTimePicker").minDate($("#form_tDDate").val());
	    });
        $('#datetimepicker3').datetimepicker({
        	  useCurrent: false,//Important! See issue #1075
	          viewMode: 'months',
	          format: 'YYYY-MM',
	          ignoreReadonly:true,
              showClose: true
	    }).on('dp.show', function(){
	    	  $('#datetimepicker3').data("DateTimePicker").maxDate($("#to_tmDate").val());
	    });
	     $('#datetimepicker4').datetimepicker({
	    	  useCurrent: false,//Important! See issue #1075
	          viewMode: 'months',
	          format: 'YYYY-MM',
	          ignoreReadonly:true,
              showClose: true
		    }).on('dp.show', function(){
		    	  $('#datetimepicker4').data("DateTimePicker").minDate($("#form_tmDate").val());
		    });
	     $('#datetimepicker5').datetimepicker({
			   useCurrent: false, //Important! See issue #1075
	           format: 'YYYY-MM-DD HH:mm',
		       ignoreReadonly:true,
               showClose: true
	     }).on('dp.show', function(){
	    	  $('#datetimepicker5').data("DateTimePicker").maxDate($("#to_ttDate").val());
		    });
		  $('#datetimepicker6').datetimepicker({
			   useCurrent: false, //Important! See issue #1075
	           format: 'YYYY-MM-DD HH:mm',
		       ignoreReadonly:true,
               showClose: true
		  }).on('dp.show', function(){
	    	  $('#datetimepicker6').data("DateTimePicker").minDate($("#form_ttDate").val());
		    });
        
		  $('#datetimepicker7').datetimepicker({
			   useCurrent: false, //Important! See issue #1075
	           viewMode: 'days',
	           format: 'YYYY-MM-DD',
   	           ignoreReadonly:true,
               showClose: true
	    }).on('dp.show', function(){
	    	  $('#datetimepicker7').data("DateTimePicker").maxDate($("#to_eDDate").val());
	    });
       $('#datetimepicker8').datetimepicker({
			   useCurrent: false, //Important! See issue #1075
	           viewMode: 'days',
	           format: 'YYYY-MM-DD',
	   	       ignoreReadonly:true,
               showClose: true
	    }).on('dp.show', function(){
	    	  $('#datetimepicker8').data("DateTimePicker").minDate($("#form_eDDate").val());
	    });
       $('#datetimepicker9').datetimepicker({
    	   	  useCurrent: false,//Important! See issue #1075
	          viewMode: 'months',
	          format: 'YYYY-MM',
	          ignoreReadonly:true,
              showClose: true
	    }).on('dp.show', function(){
	    	  $('#datetimepicker9').data("DateTimePicker").maxDate($("#to_emDate").val());
	    });
	     $('#datetimepicker10').datetimepicker({
	    	  useCurrent: false,//Important! See issue #1075
	          viewMode: 'months',
	          format: 'YYYY-MM',
	          ignoreReadonly:true,
              showClose: true
		    }).on('dp.show', function(){
		    	  $('#datetimepicker10').data("DateTimePicker").minDate($("#form_emDate").val());
		    });
	     $('#datetimepicker11').datetimepicker({
			   useCurrent: false, //Important! See issue #1075
	           format: 'YYYY-MM-DD HH:mm',
		       ignoreReadonly:true,
               showClose: true
	     }).on('dp.show', function(){
	    	  $('#datetimepicker11').data("DateTimePicker").maxDate($("#to_etDate").val());
		    });
		  $('#datetimepicker12').datetimepicker({
				useCurrent: false, //Important! See issue #1075
				format: 'YYYY-MM-DD HH:mm',
				ignoreReadonly:true,
                showClose: true
		  }).on('dp.show', function(){
	    	  $('#datetimepicker12').data("DateTimePicker").minDate($("#form_etDate").val());
		    });
		  
  		$("#datetimepicker1").on("dp.change", function (e) {
            $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
        });
        $("#datetimepicker2").on("dp.change", function (e) {
            $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
        });
		$("#datetimepicker3").on("dp.change", function (e) {
            $('#datetimepicker4').data("DateTimePicker").minDate(e.date);
        });
        $("#datetimepicker4").on("dp.change", function (e) {
            $('#datetimepicker3').data("DateTimePicker").maxDate(e.date);
        }); 
        $("#datetimepicker5").on("dp.change", function (e) {
            $('#datetimepicker6').data("DateTimePicker").minDate(e.date);
        });
        $("#datetimepicker6").on("dp.change", function (e) {
            $('#datetimepicker5').data("DateTimePicker").maxDate(e.date);
        });
		$("#datetimepicker7").on("dp.change", function (e) {
            $('#datetimepicker8').data("DateTimePicker").minDate(e.date);
        });
        $("#datetimepicker8").on("dp.change", function (e) {
            $('#datetimepicker7').data("DateTimePicker").maxDate(e.date);
        }); 
        $("#datetimepicker9").on("dp.change", function (e) {
            $('#datetimepicker10').data("DateTimePicker").minDate(e.date);
        });
        $("#datetimepicker10").on("dp.change", function (e) {
            $('#datetimepicker9').data("DateTimePicker").maxDate(e.date);
        });
		$("#datetimepicker11").on("dp.change", function (e) {
            $('#datetimepicker12').data("DateTimePicker").minDate(e.date);
        });
        $("#datetimepicker12").on("dp.change", function (e) {
            $('#datetimepicker11').data("DateTimePicker").maxDate(e.date);
        }); 
        
        /**팝업 초기 설정(초기 조회 그리드 삭제)*/ 
		$("#tableTransmitPop >  tbody >tr").remove();
		$("#tableErrorPop  > tbody >tr").remove();
		
		$('#datetimepicker1').show(); 
		$('#datetimepicker2').show();
		$('#datetimepicker3').hide(); 
		$('#datetimepicker4').hide();
		$('#datetimepicker5').hide(); 
		$('#datetimepicker6').hide();
		
		$('#datetimepicker7').show(); 
		$('#datetimepicker8').show();
		$('#datetimepicker9').hide(); 
		$('#datetimepicker10').hide();
		$('#datetimepicker11').hide(); 
		$('#datetimepicker12').hide();
        
		
		//통신 select box change event (popup)
        $("#selectTransmitSearch").change(function(){ 
        	var selectTransmitSearch = $("#selectTransmitSearch").val();
        	$('.modal-dialog').draggable();
        	 
        	if(selectTransmitSearch==""){
        		$('#datetimepicker1').show(); 
				$('#datetimepicker2').show();
				$('#datetimepicker3').hide(); 
				$('#datetimepicker4').hide();
				$('#datetimepicker5').hide(); 
				$('#datetimepicker6').hide();
	           
	            $("#form_tDDate").val($("#hidForm_tDDate").val());
	            $("#to_tDDate").val($("#hidTo_tDDate").val());
        	} else if(selectTransmitSearch=="M"){
				$('#datetimepicker1').hide(); 
				$('#datetimepicker2').hide();
				$('#datetimepicker3').show(); 
				$('#datetimepicker4').show();
				$('#datetimepicker5').hide(); 
				$('#datetimepicker6').hide();
	            
	            $("#form_tmDate").val($("#hidForm_tmDate").val());
	            $("#to_tmDate").val($("#hidTo_tmDate").val());
        	} else if(selectTransmitSearch=="D"){
        		$('#datetimepicker1').show(); 
				$('#datetimepicker2').show();
				$('#datetimepicker3').hide(); 
				$('#datetimepicker4').hide();
				$('#datetimepicker5').hide(); 
				$('#datetimepicker6').hide();
				
				$("#form_tDDate").val($("#hidForm_tDDate").val());
	            $("#to_tDDate").val($("#hidTo_tDDate").val());
        	} else if(selectTransmitSearch=="T"){
        		$('#datetimepicker1').hide(); 
				$('#datetimepicker2').hide();
				$('#datetimepicker3').hide(); 
				$('#datetimepicker4').hide();
				$('#datetimepicker5').show(); 
				$('#datetimepicker6').show();
				
				$("#form_ttDate").val($("#hidForm_ttDate").val());
	            $("#to_ttDate").val($("#hidTo_ttDate").val());
        	} 
        	
        	$('.apply1').focus();
        });
//        
//      //장애 select box change event(popup)
        $("#selectErrorSearch").change(function(){ 
        	var selectErrorSearch = $("#selectErrorSearch").val(); 
        	$('.modal-dialog').draggable();
			if(selectErrorSearch==""){
				$('#datetimepicker7').show(); 
				$('#datetimepicker8').show();
				$('#datetimepicker9').hide(); 
				$('#datetimepicker10').hide();
				$('#datetimepicker11').hide(); 
				$('#datetimepicker12').hide();
				
				$("#form_eDDate").val($("#hidForm_eDDate").val());
	            $("#to_eDDate").val($("#hidTo_eDDate").val());
			} else if(selectErrorSearch=="M"){
				$('#datetimepicker7').hide(); 
				$('#datetimepicker8').hide();
				$('#datetimepicker9').show(); 
				$('#datetimepicker10').show();
				$('#datetimepicker11').hide(); 
				$('#datetimepicker12').hide();
				
	            $("#form_emDate").val($("#hidForm_emDate").val());
	            $("#to_emDate").val($("#hidTo_emDate").val());
			} else if(selectErrorSearch=="D"){
				$('#datetimepicker7').show(); 
				$('#datetimepicker8').show();
				$('#datetimepicker9').hide(); 
				$('#datetimepicker10').hide();
				$('#datetimepicker11').hide(); 
				$('#datetimepicker12').hide();
				
				$("#form_eDDate").val($("#hidForm_eDDate").val());
	            $("#to_eDDate").val($("#hidTo_eDDate").val());
			} else if(selectErrorSearch=="T"){
				$('#datetimepicker7').hide(); 
				$('#datetimepicker8').hide();
				$('#datetimepicker9').hide(); 
				$('#datetimepicker10').hide();
				$('#datetimepicker11').show(); 
				$('#datetimepicker12').show();
				
				$("#form_etDate").val($("#hidForm_etDate").val());
	            $("#to_etDate").val($("#hidTo_etDate").val());
			} 

			$('.apply2').focus();
        }); 
		
		
        //통신 main  select box change event
        $("#sel_meter_type").change(function(){  
        	//selectbox별 통신현황 search
        	$("#meter_type").val($("#sel_meter_type").val());
        	searchGasDashBoardTransmitInfo($("#sel_meter_type").val());
        });
         
        /**통신현황 기간별 검색*/
        $("#searchGasMeterDashBoardTramsmitPop").click(function (e) {
        	openTransmitPop();
        });	
        
        /**장애현황 기간별 검색*/
        $("#searchGasMeterDashBoardErrorStatusPop").click(function (e) {
        	openErrorPop();
        });	
        
        /**팝업 닫을 경우 event*/
        $(".modalClose").click(function() {
			$(".modal").modal("hide");
			$("#tableTransmitPop >  tbody >tr").remove();
			$("#tableErrorPop  > tbody >tr").remove();
			goInit1();
			goInit2();
		});	
        
        /**
         * base info 조회
         * */
        searchGasDashInfo();
        
});