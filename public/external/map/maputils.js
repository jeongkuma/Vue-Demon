/**
 * Openlayers 3 지도 공통 함수
 */

// 지도 확대
function zoomIn() {
	
	if(!isMaxLevel()){
		this.setZoomLevel(this.getZoomLevel() + 1);
	}
	
	return this.getZoomLevel();
}

// 지도 축소
function zoomOut() {
	
	if(!isMinLevel()){
		this.setZoomLevel(this.getZoomLevel() - 1);
	}
	
	return this.getZoomLevel();
}

// 현재 지도 레벨 확인
function getZoomLevel() {
	return this.map.getView().getZoom();
}

// 지도 레벨 변경
function setZoomLevel(lv) {
	this.map.getView().setZoom(lv);
}

//하드코딩 부분
function isMaxLevel(){
	return map.getView().getResolution() == map.getView().getMinResolution() ? true : false;
}

function isMinLevel(){
	return map.getView().getResolution() == map.getView().getMaxResolution() ? true : false;
}

//Id로 레이어 찾기
function getLayerFromId(id) {
	
	if(id == undefined || id == null){
		return null;
	}
	
	var layers = map.getLayerGroup().getLayers();
	
	for(var i = 0; i < layers.get("length"); i++){
		if(layers.item(i).get("id") == id){
			return map.getLayers().item(i);
		}
	}
}

