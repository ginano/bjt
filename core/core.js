(function (win, undefined) {
	var moduleList={}, //所有的模块存储对象
		moduleIndex=0,    //模块对应的个数
		BJT = win.BJT,    //引用核心文件定义的对象
		Util = BJT.Util,
        log = Util.log,     
        //对于不同的模块名称中的路径，设定的路径不一样，
        //比如对应mod/xxx和core/xxx可能放置在不同的url都可能，需要设置一下
        pathSetting={
            mod:'../',
            core:'../',
            page:'../',
            widget:'../',
            util:'../'
        },
        //模块对应的别名，比如缩写什么的，目前暂不开放支持
        alias={

        };
    /**
     * 模块定义构造函数
     * @param {[String]} [moduleName]  模块名
     * @param {[Array]} [dependences] 依赖列表
     * @param {[Function]} factory     模块对应的方法体
     */
	function Module(moduleName, dependences, factory){
		this.init.apply(this, arguments);
	}
    /**
     * 根据模块名称获取实际的路径
     * @static
     * @param  {[type]} mn [description]
     * @return {[type]}    [description]
     */
    Module.getPathByModuleName= function(mn){
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
    };
    /**
     * 获取绝对的模块名，把./以及../格式的模块转化为/xxx/xxx的形式
     * @static
     * @param  {[type]} dep      [description]
     * @param  {[type]} relative [description]
     * @return {[type]}          [description]
     */
    Module.getRealModuleName= function(dep, relative){
        if(/^(\.\/|\.\.\/)\S+/i.test(relative)){
            return Util.getAbsolutePath(dep+'.js', relative, true);
        }
        return relative;
    };
    /**
     * 遍历所有的依赖，包括层层依赖，并且下载所有的文件
     * @static
     * @param  {[type]} list [description]
     * @return {[type]}      [description]
     */
    Module.getAllDependences= function(module, callback){
        var unload=[],
            list = module.dependences,
            moduleName = module.moduleName,
            doneList={}, allList=[],
            hasdone=false,
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
                temp = Module.getRealModuleName(moduleName,list[i]);
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
                            var _url = Module.getPathByModuleName(modname);
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
                    Module.getAllDependences(temp, function(mod){
                        doneList[mod.moduleName] = true;
                        allDone();
                    });
                }else{
                    //如果没有找到就去下载
                    (function(modname){
                        var _url = Module.getPathByModuleName(modname);
                        Util.asyncLoad(_url, function(){
                            var mod= moduleList[modname];
                            Module.getAllDependences(mod, function(m){
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
    };
	Module.prototype={
        /**
         * 获取真实的url路径
         * @return {[type]} [description]
         */
        getPathByModuleName:function(){
            return Module.getPathByModuleName(this.moduleName);
        },
        /**
         * 获取所有的依赖之后执行回调
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        getAllDependences:function(callback){
            return Module.getAllDependences(this, callback);
        },
        /**
         * 声明该模块对象，仅仅完成模块的声明，并未开始执行模块的方法体
         * @param {[String]} [moduleName]  模块名
         * @param {[Array]} [dependences] 依赖列表
         * @param {[Function]} factory     模块对应的方法体
         * @return {[Module]}             [description]
         */
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
        /**
         * 获取当前模块的依赖列表，
         * 此方法只有在所有依赖的模块文件都下载完成之后才会执行的，
         * 所以是同步执行的
         * @return {[Array]} 所有的依赖模块输出的API
         */
        getRequireList:function(){
            var _out=[],
                i,len,temp,
                self=this,
                moduleName = self.moduleName,
                list = self.dependences;
            if(list instanceof Array){
                for( i=0,len=list.length;i<len;i++){
                    temp=moduleList[Module.getRealModuleName(moduleName,list[i])];
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
        /**
         * 输出对外的api
         * 如果已经执行过方法体，就直接返回对应的api即可
         * @return {[type]} [description]
         */
        getExports:function(){
            if(!this.exports){
                this.executeit('___doit___');
            }
            return this.exports;
        },
        /**
         * 执行当前的模块的方法体
         * @param  {Boolean|String} isByDependce 如果传入了domready字符串就是表示在domready之后开始执行;
         *                                       如果传入了___doit___（只有内部才会这么用）就直接执行，否则就需要判断是否加载了所有的依赖
         * @return {[type]}               [description]
         */
        executeit:function(isByDependce){
           var self= this;
           //如果是domready之后
           if(/domready/i.test(isByDependce)){
                Util.afterDomReady(function(){
                    self.executeit();
                });
                return;
           }
           /**
            * 执行方法体，返回对应的api
            * @return {[type]} [description]
            */
           function _execute(){
               var args=self.getRequireList();
               self.exports=self.factory.apply(self,args);
               log('[execute]: module "'+self.moduleName+'" execute success!');
           }
           try{
               if(isByDependce!=='___doit___'){
                    self.getAllDependences( function(){
                        _execute();
                    });
               }else{
                _execute();
               }
               return self;
           }catch(e){
               log('[execute]: module "'+self.moduleName+'" execute failed!\n \t becase of that:\n\t\t'+e, 'error');
           }
        }
	};
	/**
     * 声明模块，如果该模块已经存在则会覆盖声明，并且输出警告日志
     * @param {[String]} [moduleName]  模块名
     * @param {[Array]} [dependences] 依赖列表
     * @param {[Function]} factory     模块对应的方法体
     * @return {[Module]}             [description]
     */
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
    /**
     * 动态增加对某个模块的依赖
     * 如果该模块已经存在，就直接执行返回对应的API
     * 如果该模块不存在，则会去异步加载该文件然后以回调方法的形式执行，并传入对应的API
     * @param  {[type]}   moduleName [description]
     * @param  {Function} callback   如果传入该回调，则将会以回调的形式执行结果
     * @return {[type]}              [description]
     */
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
                Util.asyncLoad(Module.getPathByModuleName(moduleName), function(){
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
	 * 声明已有的全局核心模块，对外输出Util内部的方法和api
	 */
	define('bjt', function(){
		return win.BJT;
	});
    /**
     * 声明全局设定API，对外输出设定相关的API用于开发者配置信息
     * @return {[type]} [description]
     */
    define('globalSetting', function(){
        return {
            setPath:settingPath,
            setStatus:setDebugStatus
        };
    });
    /**
     * 输出全局的define方法
     * @type {[type]}
     */
	win.define = win.BJT.define = define;
    /**
     * 输出全局的require方法
     * @type {[type]}
     */
	win.require = win.BJT.require = require;
    //这句话还可以用于核心文件的检查
    log('core_file_load_success');
})(window);