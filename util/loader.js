/**
 * 加载器
 * @return {[type]} [description]
 */
define('util/loader', [
	'bjt',
	], function(BJT){
	var Util = BJT.Util;
   return {
   		loadJS: Util.loadJS,
   		loadCSS: Util.loadCSS,
   		asyncLoad: Util.asyncLoad
   };
});