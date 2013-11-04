/**
 * 本地存储操作模块
 * @return {[type]} [description]
 */
define('util/localstorage', function(){
	return {
		isSupportDolphinStorage: function() {
			return window.dolphinLocalStorage && window.dolphinLocalStorage.setItem && window.dolphinLocalStorage.getItem;
		},
		/**
		* 返回存储对象
		* @private
		* @param  {Boolean} isDolphin 是否优先使用dolphin的存储
		* @return {[type]}			[description]
		*/
		__getStorage: function(isDolphin) {
			return (isDolphin === true && this.isSupportDolphinStorage()) ? window.dolphinLocalStorage : window.localStorage;
		},
		/**
		* 获取localstorage
		* @param  {[type]}  key	[description]
		* @param  {Boolean} isDolphin 是否优先调用dolphin的，默认不
		* @return {[type]}			[description]
		*/
		getLocal: function(key, isDolphin) {
			//获得localStorage里面的值
			var storage = this.__getStorage(isDolphin);
				return storage.getItem(key);
		},
		/**
		* 设置存储的键值
		* @param {[type]}  key	[description]
		* @param {[type]}  value	[description]
		* @param {Boolean} isDolphin 是否优先使用dolphin的存储
		*/
		setLocal: function(key, value, isDolphin) {
			var storage = this.__getStorage(isDolphin);
			this.clearLocal(key, isDolphin);
			try {
				storage.setItem(key, value);
				return "success";
			} catch (e) {
				//打track这里
				return "error";
			}
		},
		/**
		* 清除本地的存储值
		* @param  {[type]} key [description]
		* @return {[type]}	[description]
		*/
		clearLocal: function(key, isDolphin) {
			var storage = this.__getStorage(isDolphin);
			if(storage.removeItem){
				storage.removeItem(key);
			}
		}
	};
});