/**
 * Openlayers 3 지도 기본 설정
 */

var map;
var mapUrl = '';

var WGS84 	 = "EPSG:4326";	// transform from WGS 1984
var MERCATOR = "EPSG:900913";	// to Spherical Mercator Projection
var isMonoTone = false;

$(document).ready(function(){
	var view = new ol.View({		
		center: ol.proj.transform([128.001708, 36.6640126], WGS84, MERCATOR), //[977575, 1823685],
		projection: ol.proj.get('EPSG:900913'),
		extent: [13692297.367572648, 3503549.843504374,14471533.803125564, 4865942.279503176],
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
		source: mapSource()
	});
	
	map = new ol.Map({
		view: view,
		renderer: 'canvas',
		layers: [tile],
		target: 'map'	
	});
});

//지도 타일 설정
function mapSource() {
	return new ol.source.XYZ({
		projection: ol.proj.get('EPSG:900913'),
		tileUrlFunction:
			function(coordinate, pixelRatio, projection){
				var z = coordinate[0];
				var x = coordinate[1]
				var y = coordinate[2] * -1;
				
//						return 'http://211.240.36.72:8081/tile/'+ z + "/" + x + "/" + y;
				return 'http://106.103.255.78:8082/gcenmapfe/map/map.jsp?v=2&x='+ x + "&y=" + (y-1) + "&z=" + z + '&gray=' + (isMonoTone ? 1 : 0);
			}
	});
}