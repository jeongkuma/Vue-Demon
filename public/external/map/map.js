/**
 * Openlayers 3 지도 기본 설정
 */

var map;
var mapUrl = '';

var WGS84 	 = "EPSG:4326";	// transform from WGS 1984
var MERCATOR = "EPSG:900913";	// to Spherical Mercator Projection
var isMonoTone = false;

/*
// TODO
// 211.240.36.72:8081 (?? 모름) - 접속 불가
//구주소(개발기) : 222.231.13.102:8082
//구주소(검수기) : 106.103.255.78:8082
//구주소(상용기) : 106.103.255.78:8082 (헬멧하고 같이 사용)
//구주소(상용기) : 192.168.140.159:8082 (보안클라우드)
//-----------------
//신주소(개발기)   : 없음
//신주소(검수기)   : 222.231.13.102:6003
//신주소(상용기)   : 106.103.255.78:6003 (VIP)
//신주소(상용기)   : 106.103.255.79:6003 (server-1)
//신주소(상용기)   : 106.103.255.80:6003 (server-2)
*/
var tmp_gcen_ip = "106.103.255.78:6003";


$(document).ready(function(){
	var view = new ol.View({		
		center: ol.proj.transform([128.001708, 36.6640126], WGS84, MERCATOR), //[977575, 1823685],
		projection: ol.proj.get(MERCATOR),
		//extent: [13692297.367572648, 3503549.843504374,14471533.803125564, 4865942.279503176],
		extent: [13692297.367572648, 3503549.843504374, 14805492.275505386, 4865942.279503176],
		maxZoom: 18,
		minZoom: 7,
		enableRotation: false,
//		maxResolution: 1222.99245256282,
//		minResolution: 0.597164,
		zoom: 8
	});
	
	var tile = new ol.layer.Tile({
		extent: [-20037508.3427892,-20037508.3427892,20037508.3427892,20037508.3427892],
		minResolution : 0.5,
		maxResolution : 8192,
		source: mapSource(),
		visible:true
	});
	
	/*
	var tile = new ol.layer.Tile({
		extent: [-20037508.3427892,-20037508.3427892,20037508.3427892,20037508.3427892],
		maxResolution: 4891.969810,
		minResolution: 0.59716428,
		source: mapSource()
	});

	var tile2 = new ol.layer.Tile({
		extent: [-20037508.3427892,-20037508.3427892,20037508.3427892,20037508.3427892],
		minResolution : 0.5,
		maxResolution : 8192,
		source: mapSourceFromSatelite(),
		visible:false
	});
	*/
	
	map = new ol.Map({
		view: view,
		renderer: 'canvas',
		layers: [tile],
		target: 'map'	
	});
	
	$(".ol-logo-only a").remove();
	
	addControlScaleBar(); // add scale bar
});

//  스케일바 추가
function addControlScaleBar() {
	
	//스케일바 타켓을 컨트롤할 DIV로 지정 - div CSS를 변경하여 스케일바 위치 수정
	var scaleLineControl = new ol.control.ScaleLine({target: document.getElementById('scale-line')});
	//var scaleLineControl = new ol.control.ScaleLine();
	
	map.addControl(scaleLineControl);
	
	scaleLineControl.setUnits('metric'); // 단위 : metric = km
}

//지도 타일 설정
function mapSource(ip) {
	return new ol.source.XYZ({
		
		crossOrigin: 'anonymous',
		projection: ol.proj.get(MERCATOR),
		tileUrlFunction:
			function(coordinate, pixelRatio, projection){
				var z = coordinate[0];
				var x = coordinate[1]
				var y = coordinate[2] * -1;
				
//						return 'http://211.240.36.72:8081/tile/'+ z + "/" + x + "/" + y;
				if($.isEmptyObject(ip)) {
					//ip = "106.103.255.78:8082"
					ip = "106.103.255.78:6003";
				}
				
				//  구주소
				//return 'http://' + ip + '/gcenmapfe/map/map.jsp?v=2&x='+ x + "&y=" + (y-1) + "&z=" + z + '&gray=' + (isMonoTone ? 1 : 0);
				var oldAddr = 'http://' + ip + '/gcenmapfe/map/map.jsp?v=2&x='+ x + "&y=" + (y-1) + "&z=" + z + '&gray=' + (isMonoTone ? 1 : 0);
				
				ip = tmp_gcen_ip;
				
				var mapset = 'vt_maplabel'; // 기본 지도
				
				// 신주소
				var address = 'http://' + ip + '/gcenmap/map/tile?tx='+ x + "&ty=" + (y-1) + "&tz=" + z + '&mapset=' + mapset;
				
				//console.log("mapset-1 [" + mapset);
				//console.log("oldAddr-1 [" + oldAddr);
				//console.log("newAddr-1 [" + address);
				
				return address;
			}
	});
}

function mapSourceFromMap() {

	return new ol.source.XYZ({
		
		crossOrigin: 'anonymous',
		projection: ol.proj.get(MERCATOR),
		tileUrlFunction:
			function(coordinate, pixelRatio, projection){
				var z = coordinate[0];
				var x = coordinate[1]
				var y = coordinate[2] * -1;
				
				ip = tmp_gcen_ip;
				
				var mapset = 'vt_maplabel';
				
				var address = 'http://' + ip + '/gcenmap/map/tile?tx='+ x + "&ty=" + (y-1) + "&tz=" + z + '&mapset=' + mapset;
				
				//console.log("mapset:" + mapset);
				
				return address;
			}
	});
}

function mapSourceFromSatelite() {

	return new ol.source.XYZ({
		
		crossOrigin: 'anonymous',
		projection: ol.proj.get(MERCATOR),
		tileUrlFunction:
			function(coordinate, pixelRatio, projection){
				var z = coordinate[0];
				var x = coordinate[1]
				var y = coordinate[2] * -1;
				
				ip = tmp_gcen_ip;
				
				var mapset = 'st_bmng,st_map';
				
				var address = 'http://' + ip + '/gcenmap/map/tile?tx='+ x + "&ty=" + (y-1) + "&tz=" + z + '&mapset=' + mapset;
				
				//console.log("mapset:" + mapset);
				
				return address;
			}
	});
}

function mapSourceFromTerrain() {

	return new ol.source.XYZ({
		
		crossOrigin: 'anonymous',
		projection: ol.proj.get(MERCATOR),
		tileUrlFunction:
			function(coordinate, pixelRatio, projection){
				var z = coordinate[0];
				var x = coordinate[1]
				var y = coordinate[2] * -1;
				
				ip = tmp_gcen_ip;
				
				var mapset = 'vt_maplabel,st_terrain';
				
				var address = 'http://' + ip + '/gcenmap/map/tile?tx='+ x + "&ty=" + (y-1) + "&tz=" + z + '&mapset=' + mapset;
				
				//console.log("mapset:" + mapset);
				
				return address;
			}
	});
}

function mapSourceFromLabel() {

	return new ol.source.XYZ({
		
		crossOrigin: 'anonymous',
		projection: ol.proj.get(MERCATOR),
		tileUrlFunction:
			function(coordinate, pixelRatio, projection){
				var z = coordinate[0];
				var x = coordinate[1]
				var y = coordinate[2] * -1;
				
				ip = tmp_gcen_ip;
				
				var mapset = 'st_bmng,st_map,st_roadlabel';
				
				var address = 'http://' + ip + '/gcenmap/map/tile?tx='+ x + "&ty=" + (y-1) + "&tz=" + z + '&mapset=' + mapset;
				
				//console.log("mapset:" + mapset);
				
				return address;
			}
	});
}

function Map(target, ip) {
	this.target = target;
	this.getMap(ip);
}

Map.prototype.getMap = function(ip) {
	var view = new ol.View({		
		center: ol.proj.transform([128.001708, 36.6640126], WGS84, MERCATOR), //[977575, 1823685],
		projection: ol.proj.get(MERCATOR),
		//extent: [13692297.367572648, 3503549.843504374,14471533.803125564, 4865942.279503176],
		extent: [13692297.367572648, 3503549.843504374, 14805492.275505386, 4865942.279503176],
		maxZoom: 18,
		minZoom: 7,
//		maxResolution: 1222.99245256282,
//		minResolution: 0.597164,
		zoom: 8
	});
	
	var tile = new ol.layer.Tile({
		extent: [-20037508.3427892,-20037508.3427892,20037508.3427892,20037508.3427892],
		maxResolution: 4891.969810,
		minResolution: 0.59716428,
		source: mapSource(ip)
	});
	
	this.map = new ol.Map({
		view: view,
		renderer: 'canvas',
		layers: [tile],
		target: this.target	
	});
	
	return map; 
}

Map.prototype.refresh = function() {
	this.map.updateSize();
}

Map.prototype.getCenter = function() {
	return ol.proj.transform(this.map.getView().getCenter(), MERCATOR, WGS84);
}

Map.prototype.setCenter = function(long, lat) {
	this.map.getView().setCenter(ol.proj.transform([long, lat], WGS84, MERCATOR));
}

Map.prototype.getZoom = function() {
	return this.map.getView().getZoom();
}

Map.prototype.setZoom = function(lv) {
	this.map.getView().setZoom(lv);
}

Map.prototype.destroy = function() {
	$("#" + this.target).children().remove();
}