define('mod/path', [
		'bjt'
	],	function(BJT){
	var Util = BJT.Util;
	return {
		getAbsolutePath: Util.getAbsolutePath,
		getPathInfo: Util.getPathInfo,
		getRelativePath: Util.getRelativePath,
		isUrl: Util.isUrl,
		isRelativePath: Util.isRelativePath
	};
});