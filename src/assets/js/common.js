/*! device.js 0.1.55 */
(function(){var a,b,c,d,e,f,g,h,i,j=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};window.device={},b=window.document.documentElement,i=window.navigator.userAgent.toLowerCase(),device.ios=function(){return device.iphone()||device.ipod()||device.ipad()},device.iphone=function(){return c("iphone")},device.ipod=function(){return c("ipod")},device.ipad=function(){return c("ipad")},device.android=function(){return c("android")},device.androidPhone=function(){return device.android()&&c("mobile")},device.androidTablet=function(){return device.android()&&!c("mobile")},device.blackberry=function(){return c("blackberry")||c("bb10")||c("rim")},device.blackberryPhone=function(){return device.blackberry()&&!c("tablet")},device.blackberryTablet=function(){return device.blackberry()&&c("tablet")},device.windows=function(){return c("windows")},device.windowsPhone=function(){return device.windows()&&c("phone")},device.windowsTablet=function(){return device.windows()&&c("touch")},device.mobile=function(){return device.androidPhone()||device.iphone()||device.ipod()||device.windowsPhone()||device.blackberryPhone()},device.tablet=function(){return device.ipad()||device.androidTablet()||device.blackberryTablet()||device.windowsTablet()},device.portrait=function(){return 90!==Math.abs(window.orientation)},device.landscape=function(){return 90===Math.abs(window.orientation)},c=function(a){return-1!==i.indexOf(a)},e=function(a){var c;return c=new RegExp(a,"i"),b.className.match(c)},a=function(a){return e(a)?void 0:b.className+=" "+a},g=function(a){return e(a)?b.className=b.className.replace(a,""):void 0},device.ios()?device.ipad()?a("ios ipad tablet"):device.iphone()?a("ios iphone mobile"):device.ipod()&&a("ios ipod mobile"):device.android()?device.androidTablet()?a("android tablet"):a("android mobile"):device.blackberry()?device.blackberryTablet()?a("blackberry tablet"):a("blackberry mobile"):device.windows()?device.windowsTablet()?a("windows tablet"):device.windowsPhone()?a("windows mobile"):a("desktop"):a("desktop"),d=function(){return device.landscape()?(g("portrait"),a("landscape")):(g("landscape"),a("portrait"))},h=j.call(window,"onorientationchange")>=0,f=h?"orientationchange":"resize",window.addEventListener?window.addEventListener(f,d,!1):window.attachEvent?window.attachEvent(f,d):window[f]=d,d()}).call(this);

$(function($) {
	var $gnb = $('#gnb .groups-wrap');
	var $gnbAnchor = $('#gnb .btn-menu');
	var $gnbDepth2Anchor = $('#gnb .sub-btn');
	var $gnbDepth2 = $('#gnb .cont');
	var $gnbDepth3 = $('#gnb .sub-cont');
	var $gnbBtnOpen = $('#allMenuOpen');
	var $gnbBtnClose = $('#closeAllmap');
	var $gnbBox = $('#gnb');
	var $blackBg = $('#dim');


	 //GNB RemoveClass1
	  var gnbRemoveClass1 = function () {
		$gnbAnchor.removeClass('active');
		$gnbDepth2.removeClass('active');
	  };

	  //GNB RemoveClass2
	  var gnbRemoveClass2 = function () {
		$gnbDepth2Anchor.removeClass('active');
		$gnbDepth3.removeClass('active');
	  };


	// 20190617 수정 : GNB click으로 변경
	//1Dep
	$gnbAnchor.unbind('mouseenter');
	$gnb.unbind('mouseleave');
	$gnbAnchor.unbind('click');
	$gnbAnchor.bind('click', function (e) {
	  if ($(this).siblings('div').hasClass('active')) {
		gnbRemoveClass1();
		$('#headerWrap').css('overflow','hidden');
	  } else {
		gnbRemoveClass1();
		$(this).addClass('active');
		$(this).siblings('div').addClass('active');
		$('#headerWrap').css('overflow','visible');
	  }
	});

	// 20190619 수정 : GNB mouseleave
	var windowSize = $(window).width();
	if (windowSize > 1025) {
		$gnbBox.bind('mouseleave', function () {
			$('#headerWrap').css('overflow','hidden');
			gnbRemoveClass1();
			$gnbAnchor.removeClass('hover');

		});
	}
	//2Dep
	$gnbAnchor.siblings('div').siblings('a').addClass('plus');
	$gnbDepth2Anchor.unbind('click');
	$gnbDepth2Anchor.bind('click', function () {
	  if ($(this).siblings('div').hasClass('active')) {
		gnbRemoveClass2();
	  } else {
		gnbRemoveClass2();
		$(this).addClass('active');
		$(this).siblings('div').addClass('active');
	  }
	});

	//3Dep 있는 2Dep
	$gnbDepth2Anchor.siblings('div').siblings('a').addClass('plus');
	$gnbDepth2Anchor.siblings('div').siblings('a').bind('click', function (e) {
	  var link = $.trim($(this).prop("href"));
	  if (link.indexOf('intro') != -1) {} else {
		e.preventDefault();
	  }
	});

	//Menu Open
	$gnbBtnOpen.bind('click', function () {
	  $gnbBox.addClass('active');
	  $blackBg.addClass('active');
	});

	//Menu Close
	$gnbBtnClose.bind('click', function () {
	  $gnbBox.removeClass('active');
	  $blackBg.removeClass('active');
	});

	$blackBg.bind('click', function () {
	  $gnbBox.removeClass('active');
	  $blackBg.removeClass('active');
	});

	// 20190725 gnb 메뉴 수정
	var menu = $('.groups-wrap')
	,	checkLength = menu.find('.groups').length
	,	maxlength = 5	//  개수분기
	,	activeClass = "maxWidth"	// 활성화 클래스
	if (checkLength > maxlength) {
		menu.addClass(activeClass);
	}

});

$(document).ready(function() {
	// 20190408 모바일 전체메뉴 링크 클릭 시 메뉴 닫음
	$(".mobile .gnb a").click(function(){
		if(!$(this).hasClass('plus')){
			$('#gnb').removeClass('active');
			$('#dim').removeClass('active');
		}
	});

	// size check
	if($('body').outerWidth() > 1280){
		$("html").removeClass("mobile").addClass("web");
	} else if($('body').outerWidth() > 768){
		$("html").removeClass("mobile").addClass("tablet");
	} else {
		$("html").removeClass("web").addClass("mobile");
	};

	// resize
	$(window).resize(function(){
		if($('body').outerWidth() > 1280){
			$("html").removeClass("mobile tablet").addClass("web");
		} else if($('body').outerWidth() > 768){
			$("html").removeClass("web mobile").addClass("tablet");
		} else {
			$("html").removeClass("web tablet").addClass("mobile");
		};
	});

	//modal draggable

	// 20190711 모달 드래그 핸들 수정
	$('.modal-dialog').draggable({
		handle: ".modal-header"
	});

	$('.modal-dialog.non-title').draggable({
		handle: ".modal-content"
	});
	// multi modal
	$(document).on('show.bs.modal', '.modal', function (event) {
		var zIndex = 1040 + (10 * $('.modal:visible').length);
			$(this).css('z-index', zIndex);
		setTimeout(function() {
			 $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
		}, 0);
	});

	// 20190704 모달 스크롤
	$('.modal').on("hidden.bs.modal", function (e) {
		if ($('.modal:visible').length) {
			$('body').addClass('modal-open');
		}
	});

	//화면 고정 스티키 컨텐츠.
	// 20190416 : 스크롤 화면 떨림 현상 수정
	/*window.onscroll = function() {myFunction()};
	var header = document.getElementById("headerWrap");
	var sticky = header.offsetTop;
	function myFunction() {
	  if (window.pageYOffset > sticky) {
		header.classList.add("sticky");
	  } else {
		header.classList.remove("sticky");
	  }
	}*/

	$('.startDate').datetimepicker({
		viewMode: 'days',
		format: 'YYYY-MM-DD',
		allowInputToggle:true
	});
	 $('.endDate').datetimepicker({
		viewMode: 'days',
		format: 'YYYY-MM-DD',
		allowInputToggle:true
	});
	$(".startDate").on("dp.change", function (e) {
		$(this).parent().find('.endDate').data("DateTimePicker").minDate(e.date);
	});
	$(".endDate").on("dp.change", function (e) {
		$(this).parent().find('.startDate').data("DateTimePicker").maxDate(e.date);
	 });

	$(window).on("load",function(){
		$('.scroll-box').mCustomScrollbar({
			theme:"dark-thin",
			scrollbarPosition: "outside"
		});
	});

	// 20190410
	var max_fields = 10;
	var wrapper = $(".input-file");
	var add_button = $(".file-label");
	var x = 0;
	$(add_button).click(function(e){
		e.preventDefault();
		if(x < max_fields){
			x++;
			$(this).parent().append(
				'<div class="form-file">' +
				'<span><input type="file" class="form-control" placeholder=""></span>' +
				'<span><a href="#" class="btn ico-delete remove-field">삭제</a></span>'+
				'</div>'
			);
			// 20190417 : 모달창 dim resize
			$('.modal').data('bs.modal').handleUpdate()
		} else{
			alert("파일은 최대 10개까지 선택 가능합니다.");
		}
	});

	$(wrapper).on("click",".remove-field",function(){
		$(this).parents('.form-file').remove();
		x--;
	});
	// 20190501 scroll table
	$(window).on('resize', function(){
		$(".table-fixed-header-wrap").find('th').each(function(n){
			var $this = $(this);
			var style = {w : $this.outerWidth()};
			$(".table-fixed-header-wrap").find('.fixed-th').eq(n).css({'width':style.w});
		});
	});
	$(".table-fixed-header-wrap").find('th').each(function(n){
		var $this = $(this);
		var style = {w : $this.outerWidth()};
		$(".table-fixed-header-wrap").find('.fixed-th').eq(n).css({'width':style.w});
	});
});

/**
 *  190614
 *  jqGrid가 아닌 일반 그리드에서 y-scroll 클래스 사용 시 해당 스크립트가 구동이 되는데
 *  헤더에 전체체크박스가 있는경우 새로 DOM을 만드므로 이벤트를 걸어도 수행되지 않는다.
 *  해당 페이지를 다른 페이지에서 넘어와서 전체체크박스 수행시 문제가 안되지만
 *  해당 페이지에서 F5를 눌러서 새로고침 시 아래 스크립트가 돌면서 헤더 DOM을 새로 생성하기 때문에
 *  전체체크박스에 걸려있는 change 이벤트바인딩이 없어져 전체체크박스 기능을 수행할 수 없다.
 *  어차피 페이지 새로 로딩시에만 수행되므로 Vue 특성사 해당 기능을 이용할 일이 없어 주석처리함.
 *  History 때문에 코드를 바로 지우지 않았으며, 추후 소스 정리할때
 *  이 설명과 함께 아래 주석처리한 스크립트를 삭제해야 한다.
 * */
/*
$(document).ready(function() {
	// scrollbar
	$(window).on("load",function(){
		// 세로  + 가로 스크롤
		$(".y-scroll").mCustomScrollbar({
			axis:"yx",
			theme:"minimal-dark",
			scrollbarPosition: "outside",
			autoHideScrollbar : true,
			callbacks:{
				whileScrolling:function(){
					var fixedHeader = $(this).find('.fixed-header')
					if (fixedHeader.length){
						fixedHeader.css({
							'transform': 'translate(' + this.mcs.left + 'px, 0)'
						});
					}
					// 20190416 : 고정 tfoot 추가
					var fixedFooter= $(this).find('.fixed-footer')
					if (fixedFooter.length){
						fixedFooter.css({
							'transform': 'translate(' + this.mcs.left + 'px, 0)'
						});
					}
				},
				onUpdate : function(){
					$(this).TableFixedHeader('resizing');
					// 20190416 : 고정 tfoot 추가
					$(this).TableFixedFooter('resizing2');
				}
			}
		});
		// 190403 추가 세로 스크롤
		$(".y-scroll-only").mCustomScrollbar({
			axis:"y",
			theme:"minimal-dark",
			scrollbarPosition: "outside",
			autoHideScrollbar : true,
			callbacks:{
				whileScrolling:function(){
					var fixedHeader = $(this).find('.fixed-header')
					if (fixedHeader.length){
						fixedHeader.css({
							'transform': 'translate(' + this.mcs.left + 'px, 0)'
						});
					}
					// 20190416 : 고정 tfoot 추가
					var fixedFooter= $(this).find('.fixed-footer')
					if (fixedFooter.length){
						fixedFooter.css({
							'transform': 'translate(' + this.mcs.left + 'px, 0)'
						});
					}
				},
				onUpdate : function(){
					$(this).TableFixedHeader('resizing');
					// 20190416 : 고정 tfoot 추가
					$(this).TableFixedFooter('resizing2');
				}
			}
		});
	});
});
*/

/* 스크롤 테이블 헤더 고정 플러그인 */
;(function($, undefined){

	"use strict";
    var TableFixedHeader = function (elem) {
		this.$elem = elem;
		this.init();
	};

	TableFixedHeader.prototype = {
		/*
		 * 초기화
		 * 테이블 헤더 정보 가져와서 복사.
		 */
		init : function(){
			var header = this.thSort();
			var el = $('<div class="fixed-header">');
			this.fixed = $('.fixed-header')
			header.find('th').each(function(){
				var $this = $(this);
				var div = $('<div class="th">');
				var span = $('<span>');
				var childrens = $this[0].childNodes;
				var i;
				for (i = 0 ; i < childrens.length ; i+=1){
					span.append(childrens[i].cloneNode(true));
				}
				if ($this.attr('class')) div.addClass($this.attr('class'));
				div.append(span);
				el.append(div);
			});
			this.$elem.find('.mCustomScrollBox').append(el);
			this.resizing();
			this.posReset();
		},

		/**
		 * thead 객체 반환
		 */
		thSort : function(){
			var target = this.$elem.find('thead');
			return target;
		},

		/**
		 * 리사이징 이벤트
		 */
		posReset : function(){
			var that = this;
			$(window).on('resize', function(){
				that.resizing();
			})
		},

		/**
		 * 고정헤더 위치값 셋팅
		 */
		resizing : function(){
			var header = this.thSort();
			var el = this.$elem.find('.fixed-header');
			header.find('th').each(function(n){
				var $this = $(this);
				var style = {
					w : $this.outerWidth(),
					h : $this.outerHeight(),
					x : $this.position().left
				};
				el.find('div.th').eq(n).css({width:style.w, height:style.h, left:style.x+'px'});

			});
		},

		/**
		 * 고정 헤더 삭제
		 * $(element).TableFixedHeader('distory') 형식으로 호출
		 */
		distory : function(){
			this.$elem.find('.fixed-header').remove();
		},

		/**
		 * 고정 헤더 재 생성
		 * $(element).TableFixedHeader('enable') 형식으로 호출
		 */
		enable : function(){
			this.init();
		}
	}
    function Plugin(method){
        var $this = $(this);
		var data    = $this.data('TableFixedHeader');
		if (!data) $this.data('TableFixedHeader', (data = new TableFixedHeader(this)));
		if (method) data[method]()
    };

    $.fn.TableFixedHeader             = Plugin;
	$.fn.TableFixedHeader.Constructor = TableFixedHeader;
})(jQuery)

//  20190416 : 고정 tfoot 추가
/* 스크롤 테이블 푸터 고정 플러그인 */
;(function($, undefined){

	"use strict";
    var TableFixedFooter = function (elem) {
		this.$elem = elem;
		this.init();
	};

	TableFixedFooter.prototype = {
		init : function(){
			var footer = this.tdSort();
			var el = $('<div class="fixed-footer">');
			this.fixed = $('.fixed-footer')
			footer.find('td').each(function(){
				var $this = $(this);
				var div = $('<div class="td">');
				var span = $('<span>');
				var childrens = $this[0].childNodes;
				var i;
				for (i = 0 ; i < childrens.length ; i+=1){
					span.append(childrens[i].cloneNode(true));
				}
				if ($this.attr('class')) div.addClass($this.attr('class'));
				div.append(span);
				el.append(div);
			});
			this.$elem.find('.mCustomScrollBox').append(el);
			this.resizing2();
			this.posReset2();
		},

		/**
		 * tfoot 객체 반환
		 */
		tdSort : function(){
			var target = this.$elem.find('tfoot');
			return target;
		},

		/**
		 * 리사이징 이벤트
		 */
		posReset2 : function(){
			var that = this;
			$(window).on('resize', function(){
				that.resizing2();
			})
		},

		/**
		 * 고정 tfoot 위치값 셋팅
		 */
		resizing2 : function(){
			var footer = this.tdSort();
			var el = this.$elem.find('.fixed-footer');
			footer.find('td').each(function(n){
				var $this = $(this);
				var style = {
					w : $this.outerWidth(),
					h : $this.outerHeight(),
					x : $this.position().left
				};
				el.find('div.td').eq(n).css({width:style.w, height:style.h, left:style.x+'px'});

			});
		},

		/**
		 * 고정 tfoot 삭제
		 * $(element).TableFixedHeader('distory2') 형식으로 호출
		 */
		distory2 : function(){
			this.$elem.find('.fixed-footer').remove();
		},

		/**
		 * 고정 tfoot 재 생성
		 * $(element).TableFixedFooter('enable2') 형식으로 호출
		 */
		enable2 : function(){
			this.init();
		}
	}
    function Plugin2(method){
        var $this = $(this);
		var data    = $this.data('TableFixedFooter');
		if (!data) $this.data('TableFixedFooter', (data = new TableFixedFooter(this)));
		if (method) data[method]()
    };

    $.fn.TableFixedFooter             = Plugin2;
	$.fn.TableFixedFooter.Constructor = TableFixedFooter;
})(jQuery)

// 20190603 테마 타입 설정
$(document).ready(function() {
	$('.thema-setting .red').click(uplus);
	$('.thema-setting .blue').click(blue);
	$('.thema-setting .green').click(green);
	function uplus() {
	  $('#bodyWrap').attr('class', 'main');
	}
	function blue() {
	  $('#bodyWrap').attr('class', 'main type-blue');
	}
	function green() {
	  $('#bodyWrap').attr('class', 'main type-green');
	}
});
