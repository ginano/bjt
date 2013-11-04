define('util/fastboot',function(){
	var fastboot = function(opt) {
		var requiredFields = ["element", "appName"];
		for (var i=0; i<requiredFields.length; ++i){
			if (!opt[requiredFields[i]]){
				console.error(requiredFields[i] + " is missing");
				return;
			}
		}
		// internal data
		var progressCount = 0;

		// dom elements
		var self = opt.element;
		var doms = {
			percents : self.getElementsByClassName("loading-percents")[0],
			progress : self.getElementsByClassName("loading-progress")[0],
			text : self.getElementsByClassName("loading-text")[0]
		};

		// settings
		var settings = {
			storeKey : opt.appName + "_fastboot", // the unique key for cached
			bootUrl : opt.bootUrl || null, // the target webapp url
			slowTimeout : opt.slowTimeout || 5000, // the timeout for single resource network loading
			progress : opt.progress || null, // the callback for progress update
			error : opt.error || null, // the callback for error event
			done : opt.done || null, // the callback after the app cache done
			track : opt.track || false, // the data tracking function, based on google analytics format.
			simulate : opt.simulate || false // whether use simulate progress instead of the real one.
		};

		// string resources
		var strings = {
			startTxt : (opt.strings && opt.strings.startTxt) || '正在更新最新内容，请稍候...',
			progressTxt : (opt.strings && opt.strings.progressTxt) || '精彩即将呈现，正在努力加载中...',
			waitingTxt : (opt.strings && opt.strings.waitingTxt) || '当前网络不给力，可能会需要较长时间...',
			errorTxt : (opt.strings && opt.strings.errorTxt) || '网络加载失败，部分内容可能缺失 :('
		}

		// functions
		var funs = {
			init : function() {
				if (!navigator.onLine || funs.checkCached()) {
					funs.gotoBootUrl();
				} else {
					funs.bindEvent();
				}
			},
			checkCached : function(){
				if(typeof(Storage) !== 'undefined'){
					var curValue = localStorage.getItem(settings.storeKey);
					if(curValue !== "cached"){
						return false;
					}
				}
				// return true to skip fastboot.
				return true;
			},
			bindEvent : function() {
				var appCache = window.applicationCache;
				if (appCache) {
					var startTiming = new Date().getTime();

					funs.showLoading();
					settings.timeout = setTimeout(function() {
						funs.showSlowMessage();
					}, settings.slowTimeout);

					appCache.bindEvent = appCache.addEventListener || appCache.attachEvent;

					//在localStorage的管理下，理论上只有cached事件
					//但保险起见，还是保留了对noupdate和updateready的处理
					appCache.bindEvent('cached', function(e) {
						localStorage.setItem(settings.storeKey, "cached");
						if (settings.track) {
							settings.track("send", "timing", "manifest", "first cache", new Date().getTime() - startTiming);
						}
						//延迟，以便显示进度
						setTimeout(function(){
							funs.gotoBootUrl();
						}, 200);
					});
					appCache.bindEvent('noupdate', function(e) {
						localStorage.setItem(settings.storeKey, "cached");
						funs.updateProgress(100);
						if (settings.track) {
							settings.track("send", "timing", "manifest", "noupdate", new Date().getTime() - startTiming);
						}
						//延迟，以便显示进度
						setTimeout(function(){
							funs.gotoBootUrl();
						}, 200);
					});
					appCache.bindEvent('updateready', function(e) {
						localStorage.setItem(settings.storeKey, "cached");
						if (settings.track) {
							settings.track("send", "timing", "manifest", "refresh cache", new Date().getTime() - startTiming);
						}
						//延迟，以便显示进度
						setTimeout(function(){
							funs.gotoBootUrl();
						}, 200);
					});

					appCache.bindEvent('progress', function(e) {
						if (settings.timeout) {
							clearTimeout(settings.timeout);
						}
						settings.timeout = setTimeout(function() {
							funs.showSlowMessage();
						}, settings.slowTimeout);

						++progressCount;
						var percents;
						if(e.loaded === undefined || settings.simulate){
							//no progess, fake one
							percents = (1 - Math.pow(0.5, progressCount)) * 100;
						}else{
							percents = e.loaded / e.total * 100;
						}
						funs.updateProgress(percents);

						if ( typeof settings.progress == "function") {
							settings.progress.call(self, percents, e);
						}
					});
					appCache.bindEvent('error', function(e) {
						if (doms.text) {
							self.style.display = 'block';
							doms.text.innerHTML = strings.errorTxt;
						}

						if ( typeof settings.error == "function") {
							settings.error.call(self, e);
						}

						if (settings.track) {
							settings.track("send", "event", "fastboot", "error");
						}

						setTimeout(function() {
							funs.gotoBootUrl();
						}, 1000);
					});
				} else {
					if (settings.track) {
						settings.track("send", "event", "fastboot", "unsupport");
					}
					funs.gotoBootUrl();
				}
			},
			showLoading : function() {
				if (doms.text) {
					doms.text.innerHTML = strings.startTxt;
				}
				self.style.display = 'block';

				if (settings.track) {
					settings.track("send", "event", "fastboot", "show loading");
				}
			},
			showSlowMessage : function() {
				if (doms.text) {
					doms.text.innerHTML = strings.waitingTxt;
				}
				if (settings.track) {
					settings.track("send", "event", "fastboot", "slow network");
				}
			},
			updateProgress : function(percent) {
				if (percent > 0) { //避免显示空的进度条
					if (doms.percents) {
						doms.percents.innerHTML = percent.toFixed(2) + '%';
					}
					if (doms.progress) {
						doms.progress.style.width = percent + '%';
					}
				}
				if (doms.text) {
					doms.text.innerHTML = strings.progressTxt;
				}
			},
			gotoBootUrl : function() {
				if (settings.bootUrl) {
					window.location.replace(settings.bootUrl + location.search + location.hash);
				}
				if ( typeof settings.done == "function") {
					settings.done.call(self);
				}
			}
		};

		funs.init();
		return self;
	}

	return fastboot;
});