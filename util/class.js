define('util/class', ['bjt'], function (BJT) {
	var Util = BJT.Util;
	var noop=function(){};
	/**
	 * [Class description]
	 * var Cat = new Class({
	 * 		className:'Cat',
	 * 		private__xxx:xxx,
	 * 		static__xxx:xxx,
	 * 		init:function(){}
	 * });
	 * @constructor
	 * @param {[type]} obj [description]
	 */
	function Class(superClass, obj){
		var klass,
			p,
			privateP={},
			publicP={},
			staticP={};
		if(arguments.length<2){
			obj = superClass;
			superClass = null;
		}
		for(p in obj){
			if(Util.hasOwn.call(obj, p)){
				//私有属性
				if(/^private__/.test(p)){
					privateP[p.replace(/^private__/i,'')]=obj[p];
				}else if(/^static__/.test(p)){
					staticP[p.replace(/^static__/i,'')]=obj[p];
				}else if(/^public__/.test(p)){
					publicP[p.replace(/^public__/i,'')]=obj[p];
				}else{
					publicP[p]=obj[p];
				}
			}
		}
		klass= function(opt){
			var instance={};
			var prop;
			for(prop in privateP){
				this[prop]=privateP[prop];
			}
			this.init(opt);
		};

		klass.className = klass.name = obj.className;
		/**
		 * 继承
		 * @param  {[type]} cl [description]
		 * @return {[type]}    [description]
		 */
		klass.inherit=function(cl){
			if(!cl || 'string' !== typeof cl.className){
				return;
			}
			this.__supperClass__ = cl;
			Util.extend(this.prototype, cl.prototype, false);
		};

		klass.isInheritFromClass = function(cl){
			var supercl = this.__supperClass__;
			while(supercl){
				if(supercl == cl){
					return true;
				}
				supercl = supercl.__supperClass__;
			}
			return false;
		};
		klass.inherit(superClass);
		/**
		 * 静态方法
		 */
		for(p in staticP){
			klass[p] = staticP[p];
		}
		klass.constructor = this;
		/**
		 * 实现接口
		 * @param  {[array]} methodList [description]
		 * @return {[type]}           [description]
		 */
		klass.implementMethods =  function(methodList){
			var len;
			methodList = methodList instanceof Array ? methodList : [methodList];
			len = methodList;
			while(len--){
				if(!this.prototype[methodList[len]]){
					this.prototype[methodList[len]] = noop;
				}
			}
		};
		/**
		 * public 方法
		 */
		for(p in publicP){
			klass.prototype[p] = publicP[p];
		}
		klass.prototype.init = klass.prototype.init || noop;
		return klass;
	}
	return Class;
});