(function (win, undefined) {
	var moduleList={},
		moduleIndex=0,
		BJT = win.BJT,
		Util = BJT.Util,
        pathSetting={
            mod:'../',
            core:'core/',
            page:'../',
            widget:'../',
            util:'../'
        },
        alias={

        };

	function Module(moduleName, dependences, factory){
		this.init.apply(this, arguments);
	}
	Module.prototype={
		init:function(moduleName, dependences, factory){
			var idtype=typeof moduleName;
            switch(idtype){
                case 'string':
                    if('function'=== typeof dependences){
                        factory=dependences;
                        dependences=[];
                    }else if(!dependences instanceof Array){
                        Util.log('module '+moduleName+' init faild,becaseof the invalid argument:"req".', 'error');
                        return;
                    }
                    break;
                case 'object':
                    if(moduleName instanceof Array){
                        factory=dependences;
                        dependences=moduleName;
                        moduleName ='';
                    }else{
                        Util.log('module '+moduleName+' init faild, becaseof the invalid arguments:"req".', 'error');
                        return;
                    }
                    break;
                case 'function':
                    factory=moduleName;
                    dependences=[];
                    moduleName='';
                    break;
                default:
                    JDK.Util.log('module '+moduleName+' init faild, becaseof the invalid arguments.', 'error');
                    return;
                    break;
            }
            this.dependences=dependences;
            this.factory=factory;
            this.moduleName=moduleName || 'anonymous_'+(moduleIndex++);
            return this;
        },
        getPathByModuleName:function(mn){
            var moduleName = /\S+\.\S+$/i.test(mn)?mn:(mn+'.js');
            if(/^util\//i.test(moduleName)){
                return pathSetting.util + moduleName;
            }else if(/^page\/[^\/]+/i.test(moduleName)){
                return pathSetting.page + moduleName;
            }else if(/^widget\/[^\/]+/i.test(moduleName)){
                return pathSetting.widget + moduleName;
            }else if(/^mod\/[^\/]+/i.test(moduleName)){
                return pathSetting.mod + moduleName;
            }else{
                return moduleName+'.js';
            }
        },
        /**
         * 获取绝对的模块名，把./以及../格式的模块转化为/xxx/xxx的形式
         * @param  {[type]} dep      [description]
         * @param  {[type]} relative [description]
         * @return {[type]}          [description]
         */
        getRealModuleName:function(dep, relative){
            if(/^(\.\/|\.\.\/)\S+/i.test(relative)){
                return Util.getAbsolutePath(dep+'.js', relative, true);
            }
            return relative;
        },
        /**
         * 遍历所有的依赖，包括层层依赖，并且下载所有的文件
         * @param  {[type]} list [description]
         * @return {[type]}      [description]
         */
        getAllDependences:function(module, callback){
            var unload=[],
                list = module.dependences,
                moduleName = module.moduleName,
                doneList={}, allList=[],
                hasdone=false,
                self = this,
                i,len,temp, realModuleName;

            function allDone(){
                if(hasdone){
                    return;
                }
                for(var p in doneList){
                    if(!doneList[p]){
                        return;
                    }
                }
                hasdone = true;
                Util.excuteFunction(callback, module);
            }
            if(list instanceof Array && (len = list.length)){
                i = len;
                while(i--){
                    temp = self.getRealModuleName(moduleName,list[i]);
                    allList.unshift(temp);
                    doneList[temp]=false;
                }
                for( i=0;i<len;i++){
                    temp=moduleList[allList[i]];
                    if(/\S+\.css$/i.test(allList[i])){
                        (function(modname){
                            var _url = self.getPathByModuleName(modname);
                            Util.asyncLoad( _url, function(){
                                define(modname,function(){
                                    return {
                                        url:_url
                                    };
                                });
                                doneList[modname] = true;
                                allDone();
                            });
                        })(allList[i]);
                    }else if(temp){
                        self.getAllDependences(temp, function(mod){
                            doneList[mod.moduleName] = true;
                            allDone();
                        });
                    }else{
                        //如果没有找到就去下载
                        (function(modname){
                            var _url = self.getPathByModuleName(modname);
                            Util.asyncLoad(_url, function(){
                                var mod= moduleList[modname];
                                self.getAllDependences(mod, function(m){
                                    doneList[modname] = true;
                                    allDone();
                                });
                            });
                        })(allList[i]);
                    }
                }
            }else{
                allDone();
            }
        },
        getRequireList:function(){
            var _out=[],
                i,len,temp,
                self=this,
                moduleName = self.moduleName,
                list = self.dependences;
            if(list instanceof Array){
                for( i=0,len=list.length;i<len;i++){
                    temp=moduleList[self.getRealModuleName(moduleName,list[i])];
                    if(temp){
                        _out.push(temp.getExports());
                    }else{
                        Util.log('module "'+list[i]+'" not exist when it been required in module:'+this.moduleName, 'warn');
                        _out.push({});
                    }
                }
            }
            return _out;
        },
        getExports:function(){
            if(!this.exports){
                this.excuteit(true);
            }
            return this.exports;
        },
        excuteit:function(isByDependce){
           var self= this;
           function _excute(){
               var args=self.getRequireList();
               self.exports=self.factory.apply(self,args);
               Util.log('[excute]: module "'+self.moduleName+'" excute success!');
           }
           try{
               if(!isByDependce){
                    this.getAllDependences(this, function(){
                        _excute();
                    });
               }else{
                _excute();
               }
               return self;
           }catch(e){
               Util.log('[excute]: module "'+this.moduleName+'" excute failed!\n \t becase of that:\n\t\t'+e, 'error');
           }
        }
	};
	// body...
	function define(moduleName, dependces, factory){
		try{
            var module=new Module(moduleName, dependces, factory);
            moduleList[module.moduleName] = module;
            Util.log('[register]: module "'+('string'===typeof moduleName?moduleName:'anonymous '+module.moduleName)+'" register success!');
            return module;
        }catch(e){
            Util.log('[register]: module "'+('string'===typeof moduleName?moduleName:'anonymous '+moduleName)+'" register faild!\n\t becase of that:\n\t\t'+e, 'error');
        }
	}
	function require(moduleName){
		try{
			var module = moduleList[moduleName];
			Util.log('[require]: module "'+moduleName+'" required success!');
			return module.getExports();
		}catch(e){
			Util.log('[require]: module "'+moduleName+'" required failed!\n \t becase of that:\n\t\t'+e, 'error');
		}
	}
    /**
     * 设置框架的目录结构
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    function settingPath(obj){
        Util.extend(pathSetting, obj);
    }
	/**
	 * return the core
	 * @return {[type]} [description]
	 */
	define('bjt', function(){
		return win.BJT;
	});
	win.define = win.BJT.define = define;
	win.require = win.BJT.require = require;

})(window);