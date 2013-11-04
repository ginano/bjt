define('util/apiparams', [
	'util/sessionstorage', 
	'util/url'
	], function(SS, URL){
		return {
			getCommonQueryStr:function(){
				//从session取参数的obj
				var sessionQueryObj = SS.getSession("video-query-obj") || {},
					queryAry, commonQueryAry, combineQueryObj;
				try {
					sessionQueryObj = JSON.parse(sessionQueryObj) || {};
				} catch (e) {
					sessionQueryObj = {};
				}

				queryAry = URL.getMatchParams();
				commonQueryAry = {};
				commonQueryAry.op = queryAry.op;
				commonQueryAry.pn = queryAry.pn;
				commonQueryAry.chn = queryAry.s;
				commonQueryAry.vn = queryAry.v;

				this.saveCommonQuery(commonQueryAry);

				//默认的参数obj
				combineQueryObj = {
					type: "video",
					pn: commonQueryAry.pn || sessionQueryObj.pn || "com.dolphin.browser.xf",
					src: commonQueryAry.chn || sessionQueryObj.chn || "ofw",
					vn: commonQueryAry.vn || sessionQueryObj.vn || "102",
					op: commonQueryAry.op || sessionQueryObj.op || "02"
				};
				return combineQueryObj;
			},
			getAppInfo: function() {
				var appinfo = {},
					deviceInfo;
				if(this.__APPINFO__){
					return this.__APPINFO__;
				}
				if (window.dolphin && window.dolphin.getDeviceInfo) {
					deviceInfo = window.dolphin.getDeviceInfo();
					try {
						deviceInfo = JSON.parse(deviceInfo);
					} catch (e) {
						deviceInfo = {};
					}
					appinfo.pn = deviceInfo.package_name;
					appinfo.chn = deviceInfo.source;
					appinfo.version = deviceInfo.shell_version_text;
					//如果能够拿到设备id
					if (deviceInfo.android_id) {
						appinfo.isu = deviceInfo.android_id.toLowerCase();
						appinfo.app_key = "e7038cf5a7c4447c808796595ee79ad4";
					}

				}
				appinfo.app_key = appinfo.app_key || "186f1f73f86f4bdb9a2a50075e2a2373";
				appinfo.pn = appinfo.pn || "com.dolphin.browser.xf";
				appinfo.chn = appinfo.chn || "ofw";
				appinfo.version = appinfo.version || "1.0";
				this.__APPINFO__ = appinfo;
				return appinfo;
			},
			/**
			* 存储公用参数到session当中
			* @param  {Object} obj 传入的参数
			* @return {undefined}	[description]
			*/
			saveCommonQuery: function(obj) {
				var p, hasSomeValue = false;
				for (p in obj) {
					if (obj[p]) {
						hasSomeValue = true;
						break;
					}
				}
				if (hasSomeValue) {
					SS.setSession("video-query-obj", JSON.stringify(obj));
				}
			}
		};
});