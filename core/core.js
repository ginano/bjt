(function (win, undefined) {
	var moduleList={},
		moduleIndex=0,
		BJT = win.BJT,
		Util = BJT.Util,
        log = Util.log,
        pathSetting={
            mod:'../',
            core:'../',
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
                        log('module '+moduleName+' init faild,becaseof the invalid argument:"req".', 'error');
                        return;
                    }
                    break;
                case 'object':
                    if(moduleName instanceof Array){
                        factory=dependences;
                        dependences=moduleName;
                        moduleName ='';
                    }else{
                        log('module '+moduleName+' init faild, becaseof the invalid arguments:"req".', 'error');
                        return;
                    }
                    break;
                case 'function':
                    factory=moduleName;
                    dependences=[];
                    moduleName='';
                    break;
                default:
                    log('module '+moduleName+' init faild, becaseof the invalid arguments.', 'error');
                    return;
                    break;
            }
            this.dependences=dependences;
            this.factory=factory;
            this.moduleName=moduleName || 'anonymous_'+(moduleIndex++);
            return this;
        },
        getPathByModuleName:function(mn){
            var moduleName = /\S+\.\S+$/i.test(mn)?mn:(mn+'.js'),
                tempReg;
            for(var p in pathSetting){
                tempReg= new RegExp('^'+p+'\/[^\/]+','i');
                //如果有配置该路径
                if(tempReg.test(moduleName)){
                    return pathSetting[p]+moduleName;
                }
            }
            return moduleName;
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
                Util.executeFunction(callback, module);
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
                    if(Util.checkFileExtension('css', allList[i])){
                        /**
                         * 如果不是开发模式，说明都是打包好了的，不需要去加载了
                         */
                        if(BJT.status!='dev'){
                            define(allList[i],function(){
                                return {
                                };
                            });
                            doneList[allList[i]] = true;
                            allDone();
                        }else{
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
                        }
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
                        log('module "'+list[i]+'" not exist when it been required in module:'+this.moduleName, 'warn');
                        _out.push({});
                    }
                }
            }
            return _out;
        },
        getExports:function(){
            if(!this.exports){
                this.executeit(true);
            }
            return this.exports;
        },
        executeit:function(isByDependce){
           var self= this;
           //如果是domready之后
           if(/domready/i.test(isByDependce)){
                Util.afterDomReady(function(){
                    self.executeit();
                });
                return;
           }
           function _execute(){
               var args=self.getRequireList();
               self.exports=self.factory.apply(self,args);
               log('[execute]: module "'+self.moduleName+'" execute success!');
           }
           try{
               if(!isByDependce){
                    this.getAllDependences(this, function(){
                        _execute();
                    });
               }else{
                _execute();
               }
               return self;
           }catch(e){
               log('[execute]: module "'+this.moduleName+'" execute failed!\n \t becase of that:\n\t\t'+e, 'error');
           }
        }
	};
	// body...
	function define(moduleName, dependces, factory){
		try{
            var module=new Module(moduleName, dependces, factory),
                old = moduleList[module.moduleName];
            if(old){
                log('[warn]:'+module.moduleName + ' has been defined again!', 'warn');
            }
            moduleList[module.moduleName] = module;
            log('[register]: module "'+('string'===typeof moduleName?moduleName:'anonymous '+module.moduleName)+'" register success!');
            return module;
        }catch(e){
            log('[register]: module "'+('string'===typeof moduleName?moduleName:'anonymous '+moduleName)+'" register faild!\n\t becase of that:\n\t\t'+e, 'error');
        }
	}
	function require(moduleName, callback){
		try{
			var module = moduleList[moduleName],
                exports;
            /**
             * 如果存在
             */
            if(module){
    			log('[require]: module "'+moduleName+'" required success!');
                exports = module.getExports();
                Util.executeFunction(callback, exports);
    			return exports;
            }else{
                Util.asyncLoad(getPathByModuleName(moduleName), function(){
                    var exp = moduleList[moduleName];
                    exp = (exp && exp.getExports) ? exp.getExports() : {};
                    Util.executeFunction(callback, exp);
                });
                return ;
            }
		}catch(e){
			log('[require]: module "'+moduleName+'" required failed!\n \t becase of that:\n\t\t'+e, 'error');
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
     * 设置当前是否处于开发模式，模式的判断有利于处理不同情况
     * @param {[type]} status [description]
     */
    function setDebugStatus(status){
        win.BJT.status = status || 'dev';
    }
	/**
	 * return the core
	 * @return {[type]} [description]
	 */
	define('bjt', function(){
		return win.BJT;
	});
    define('globalSetting', function(){
        return {
            setPath:settingPath,
            setStatus:setDebugStatus
        };
    });
	win.define = win.BJT.define = define;
	win.require = win.BJT.require = require;
    //这句话还可以用于核心文件的检查
    log('core_file_load_success');
})(window);