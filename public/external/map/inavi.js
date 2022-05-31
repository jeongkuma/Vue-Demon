// var inaviUrl = 'https://openapi.testmap.uplus.co.kr:18000/mapinfra'
// var inaviUrl = 'http://106.103.230.130:19000/mapinfra'
// var authKey = '58cc22a0beb6435298d2938544d17e7a'
// var svcId = 'af50235e882442288295f81f09d1dea5'
var inaviUrl = 'https://s.openapi.ssmapinfra.uplus.co.kr:18000/mapinfra'
var authKey = '336629ea1c5f445fb263c9b4d4d15f13'
var svcId = '3d8b1a201167410ebddadbbe4bea15b8'
var scriptUrl = inaviUrl + '/api/map/jsMapDownload?authKey=' + authKey + '&svcId=' + svcId
document.write('<script src="' + scriptUrl + '"></script>')