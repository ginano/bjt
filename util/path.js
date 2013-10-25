define('mod/path', [
		'bjt'
	],	function(BJT){
	var Util = BJT.Util;
	/**
	 * 是否是url地址
	 * @param  {[type]}  url [description]
	 * @return {Boolean}     [description]
	 */
	function isUrl(url){
		return /^(\S+:)?\/\/\S+$/i.test(url);
	}
	/**
	 * 是不是相对路径
	 * @param  {[type]}  path [description]
	 * @return {Boolean}      [description]
	 */
	function isRelativePath(path){
		return /^(?:\/\S+|\.\/\S+|\.\.\/\S+|\S+\/)/i.test(path);
	}
	/**
	 * 获取url的相关信息
	 * @param  {[type]} url [description]
	 * @return {[type]}     [description]
	 */
	function getPathInfo(url){
		var pathInfo={
			origin:'',
			pathName:'',
			fileName:'',
			search:'',
			hash:''
		},
		matches;
		matches = url.match(/^((?:\w+:)?\/\/[a-z0-9\-]+(?:\.[a-z0-9\-]+)*)((?:\/[^\/]+)*\/)([^?#\.]+(?:\.[^?#\.]+)*)?(\?[^#]+)?(#\S+)?/i);
		if(matches && matches.length){
			pathInfo.origin = matches[1] || '';
			pathInfo.pathName = matches[2] || '/';
			pathInfo.fileName =matches[3] || '';
			pathInfo.search = matches[4] || '';
			pathInfo.hash = matches[5] || '';
			pathInfo.href = url;
		}
		return pathInfo;
	}
	/**
	 * 计算path2相对于path1的相对路径
	 * @param  {[type]} path1 [description]
	 * @param  {[type]} path2 [description]
	 * @return {[type]}       [description]
	 */
	function getRelativePath(path1, path2){
		var pathInfo1, pathInfo2, local = location.href;
		var a1, a2, i, len, j, k, result=[];
		if(isUrl(path1)){
			pathInfo1 = getPathInfo(path1);
			path1 = pathInfo1.pathName;
		}
		if(isUrl(path2)){
			pathInfo2 = getPathInfo(path2);
			path2 = pathInfo2.pathName;
		}
		if(pathInfo2 && pathInfo1 && pathInfo1.origin != pathInfo2.origin){
			return pathInfo2.href;
		}
		//处理成绝对路径了再对比
		if(!/^\//.test(path1)){
			path1 = getAbsolutePath(local, path1);
		}
		if(!/^\//.test(path2)){
			path2 = getAbsolutePath(local, path2);
		}
		a1 = path1.split('/');
		//最后一级多余的
		if(a1[a1.length-1]==''){
			a1.pop();
		}
		a2 = path2.split('/');
		for(i =0, len= a2.length; i<len; i++){
			/**
			 * 如果不相同
			 */
			if(a2[i]!=a1[i]){
				break;
			}
		}
		result = a2.slice(i);
		j = a1.length -i;
		if(j>0){
			while(j--){
				result.unshift('..');
			}
		}else{
			result.unshift('.');
		}
		return result.join('/');
	}
	/**
	 * 通过相对basePath的相对路径path计算出其绝对路径
	 * @param  {[type]} baseUrl [description]
	 * @param  {[type]} path    [description]
	 * @return {[type]}         [description]
	 */
	function getAbsolutePath(basePath, path){
		var baseInfo,
			a1, a2;
		if(isUrl(basePath)){
			baseInfo = getPathInfo(basePath);
			basePath = baseInfo.pathName;
		}
		if(!/^\//.test(basePath)){
			Util.log(basePath +'is not an absolute path', 'error');
			return path;
		}
		if(/^\//.test(path)){
			return path;
		}
		a1 = basePath.split('/');
		a2 = path.split('/');
		//最后一级多余的
		if(a1[a1.length-1]==''){
			a1.pop();
		}
		for(var i=0, len = a2.length; i<len; i++){
			switch(a2[i]){
				case '.':
					break;
				case '..':
					a1.pop();
					break;
				default:
					a1.push(a2[i]);
					break;
			}
		}
		return (baseInfo?baseInfo.origin:'')+a1.join('/');
	}
	return {
		getAbsolutePath: getAbsolutePath,
		getPathInfo: getPathInfo,
		getRelativePath: getRelativePath,
		isUrl: isUrl,
		isRelativePath: isRelativePath
	};
});