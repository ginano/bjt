define('util/url', [
		'bjt'
	],	function(BJT){
	return {
		/**
		* 获取参数列表，优先从query字符串获取，如果没有就取hash值里面的，根据需求调整
		* @return {Object} [description]
		*/
		getMatchParams: function() { //用于获取app_id或者subject_id等
			var _hash = this.getHashParams(),
				_query = this.getQueryParams();
			return $.extend(_query, _hash);
		},
		lhash: function() {
			var lhashText = window.location.hash;
			return lhashText ? lhashText.slice(1) : "";
		},
		/**
		* 获取查询参数
		* @return {[type]} [description]
		*/
		getQueryParams: function() {
			var queryStr = window.location.search.slice(1);
			return this.getStringParams(queryStr);
		},
		/**
		* 获取hash值的对象
		* @return {Object}
		*/
		getHashParams: function() {
			return this.getStringParams(this.lhash());
		},
		/**
		* 序列化字符串值
		* @param {String} str 需要序列号的值
		* @return {Object} hash对象
		*/
		getStringParams: function(str) {
			if (!str) {
				return {};
			}
			var _input = "string" === typeof str ? str : '',
				_paras = _input.split('&'),
				result = {};
			var i, l, tmp;
			for (i = 0, l = _paras.length; i < l; i++) {
				tmp = _paras[i].split('=');
				result[tmp[0]] = tmp[1] || '';
			}
			return result;
		},
		joinQueryStr : function(obj){
			var queryAry = [],
				temp;
			for(var i in obj){
				temp = obj[i];
				if(temp || temp===0){
					queryAry.push(i+"="+obj[i]);
				}else{
					queryAry.push(i);
				}
			}
			var queryStr = queryAry.join("&");
			return queryStr;
		}
	};
});