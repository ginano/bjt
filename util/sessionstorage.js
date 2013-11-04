/**
 * 本地存储操作模块
 * @return {[type]} [description]
 */
define('util/sessionstorage', function(){
	return {
		/**
		* 获取会话本地存储
		* @param  {[type]} key [description]
		* @return {[type]}	[description]
		*/
		getSession: function(key) {
			//获得sessionStorage里面的值
			var storage = window.sessionStorage;
			if (storage.getItem(key)) {
				return storage.getItem(key);
			} else {
				return null;
			}
		},
		setSession: function(key, value) {
			var storage = window.sessionStorage;
			storage.removeItem(key);
			try {
				storage.setItem(key, value);
				return "";
			} catch (e) {
				return "error";
			}
		}
	};
});