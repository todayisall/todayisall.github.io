
var fs = require("fs");

console.info("************** start *****************");

var useFullProperties = [ 'type',
  'features',
  'id',
  'geometry',
  'coordinates',
  'encodeOffsets',
  'properties',
  'cp',
  'name',
  'childNum',
  'UTF8Encoding' ];

/** ***************** 根据 echarts 的geoJson 生成需要的属性数组. start*********  */
// odl - 根据 echarts 的geoJson 生成需要的属性数组.
// fs.readFile('./data/echarts_china.json', (error, data) => {
// 	var result = JSON.parse(data);
// 	forInObj(result);
// 	console.info(useFullProperties);
// });

// function forInObj(obj) {
// 	for(var key in obj) {
// 		if(!isExitPro(key)) {
// 			useFullProperties.push(key);
// 		}

// 		if(typeof obj[key] == 'object') forInObj(obj[key]);
// 	}
// }
/** ***************** 根据 echarts 的geoJson 生成需要的属性数组. end *********  */

function isExitPro(proName) {
	for(var i in useFullProperties) {
		if(/^[\d]+$/.test(proName)|| proName === useFullProperties[i]) return true;
	}
	return false;
}

var fileName = 'geo_china_s.json';

fs.readFile('./data/'+fileName, (error, data) => {
	var result = JSON.parse(data);
	// 1. 去掉无用的属性.
	deleteNotExitPro(result);

	fs.writeFile('./data/target/'+fileName, JSON.stringify(result), (err) => {
		if (err) throw err;
	    console.log('The file has been saved!');
	});
	// 2. 压缩文件
});

/**
 * [deleteNotExitPro 删除echarts不需要的属性]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function deleteNotExitPro(obj) {
	for(var key in obj) {
		// 删除不存在的属性,或者属性值为空
		if(!isExitPro(key)|| !obj[key]) {
			delete obj[key];
		}
		// 如果对象，继续执行删除方法
		if(typeof obj[key] == 'object') deleteNotExitPro(obj[key]);

		// 如果是数字,则保留6位小数 -279319769991446
		if(/^\d+.\d+$/.test(obj[key])) {
			obj[key] = keepDecimal(obj[key]);
		}

	}
}

/**
* 保留小数位数函数.
*/
function keepDecimal(value, len) {
	var decimal = len?len:6;   // 取得实际保留的位数
	return Math.round(value * Math.pow(10, decimal))/Math.pow(10, decimal);
}
console.info("************** end *****************");