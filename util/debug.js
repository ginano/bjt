define('mod/debug', function(){
	var logStack=[],
		startTime = Date.now();
	return {
		init: function(id) {
			var script,
				self = this
				;
			this.log = this.logToStack;
			//记录本次会话都打印了
			this.setSession('debugmode', 'true');
			script = document.createElement('script');
			script.src = "http://jsconsole.com/remote.js?baina-" + (id || 'video');
			script.onload = function() {
				self.log = self.logByJsConsole;
				self.log('load the jsconsole ready');
				self.clearStack();
			};
			document.head.appendChild(script);
			this.init = null;
			delete this.init;
		},
		/**
		* 由远程调试结果，需要时间来判断先后顺序
		* @param  {[type]} str [description]
		* @return {[type]}	[description]
		*/
		logByJsConsole: function(str) {
			var time = Date.now(),
				interval = time - startTime;
			console.log({
				content: str,
				timestamp: time,
				interval: interval
			});
		},
		clearStack: function() {
			this.logByJsConsole('---------------------日志堆栈内容：\n');
			this.logByJsConsole(logStack);
			logStack = null;
		},
		/**
		* 暂时记录到堆栈中然后再输出来
		* @param  {[type]} str [description]
		* @return {[type]}	[description]
		*/
		logToStack: function(str) {
			var time = Date.now(),
				interval = time - startTime;
			logStack.push({
				content: str,
				timestamp: time,
				interval: interval
			});
		}
	};
});