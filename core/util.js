/**
 * the basic functions for coding
 */
(function (win, undefined) {
	var hasOwn=Object.prototype.hasOwnProperty,
		slice = [].slice;

    var LoadedList={},
       headEl=document.getElementsByTagName("head")[0],
       isFunction=function(f){
            return f instanceof Function;
       },
       UA = getUserAgent();
	/**
	 * 扩展对象元素
	 * @param {Object} originObj 原始对像
	 * @param {Object} newObj   新对象
	 * @param {Boolean} isOverride  [option][default=true]是否覆盖已有对象
	 * @param {Array} selectedProperty [option]覆盖列表
	 */
	function extend(originObj, newObj, isOverride,selectedProperty){
	    var p,item;
	    originObj=originObj||{};
	    if(!newObj){
	        return;
	    }
	    
	    if(isOverride instanceof Array){
	        selectedProperty=isOverride;
	        isOverride=true;
	    }
	    if(isOverride===undefined){
	        isOverride=true;
	    }
	    if(selectedProperty && (p=selectedProperty.length)){
	        while(p--){
	            item=selectedProperty[p];
	            //类继承的时候就不用检查了
	            if(hasOwn.call(newObj,item)){
	                (isOverride||!originObj[item]) && (originObj[item]= cloneObject(newObj[item]));
	            }
	        }
	    }else{
	        for ( p in newObj) {
	            item=newObj[p];
	            if (hasOwn.call(newObj, p)) {
	                (isOverride||!originObj[p]) && (originObj[p]= cloneObject(item));
	            }
	        }
	    }
	    return originObj;
	}
    /**
     *深度copy一个对象 
     * @param {Object} o
     * @param {Boolean} isCloneFunction 是否复制函数
     * @param {Boolean} isClonePrototype 是否复制函数的扩展属性
     */
    function cloneObject(o,isCloneFunction,isClonePrototype){
        function copyObject(obj,isCopyFunction,isCopyPrototype){
            var objClone,
                con,
                prop;
            if(obj===undefined||obj===null){
                    return objClone=obj;
            }
            con=obj.constructor;
            if (con == Object){
                objClone = new con(); 
            }else if(con==Function){
                if(isCopyFunction){
                        objClone=eval('['+obj.toString()+']')[0];
                }else{
                        return objClone=obj;
                }
            }else{
                objClone = new con(obj.valueOf()); 
            }
            for(var key in obj){
                if ( objClone[key] != obj[key] ){ 
                    if ( typeof(obj[key]) == 'object' ){ 
                        objClone[key] = copyObject(obj[key],isCopyFunction);
                    }else{
                        objClone[key] = obj[key];
                    }
                }
            }
            /**
             *当且仅当是深度复制函数，并且需要复制当且的扩展属性的时候才执行 
             */
            if(con==Function&&isCopyFunction&&isCopyPrototype){
                prop=obj.prototype;
                for(var key in prop){
                if ( typeof(prop[key]) == 'object' ){ 
                    objClone.prototype[key] = copyObject(prop[key],isCopyFunction,isCopyPrototype);
                }else{
                    objClone.prototype[key] = prop[key];
                }
                }
            }
            objClone.toString = obj.toString;
            objClone.valueOf = obj.valueOf;
            return objClone; 
        }
        return copyObject(o,isCloneFunction,isClonePrototype);
    }
    /**
     *遍历所有的成员 
     */
    function eachProp(obj,callback){
        var i,len;
        if(obj instanceof Array){
            for(i=0,len=obj.length;i<len;i++){
                callback&&callback(i,obj);
                excuteFunction(callback, i, obj[i]);
            }
            return;
        }
        if(obj instanceof Object){
            for(i in obj){
                if(hasOwn.call(obj,i)){
                    excuteFunction(callback, i, obj[i]);
                }
            }
            return;
        }
    }
    /**
     * [excuteFunction description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function excuteFunction( callback ){
    	var args;
    	if(isFunction(callback)){
    		args = slice.call(arguments,1);
    		callback.apply(null, args);
    	}
    }
    /**
     * [log description]
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
    function log(str, type){
    	switch(type){
    		case 'error':
    		case 'warn':
    		case 'info':
    			console[type](str);
    			break;
    		default:
    			console.log(str);
    			break;
    	}
    }
    /**
     * [generateUID description]
     * @param  {[type]} header [description]
     * @return {[type]}        [description]
     */
    function generateUID(header){
		header = header? header+'-' : '';
		return header+Math.ceil(Math.random()*1000)+'-'+Math.ceil(Math.random()*1000)+'-'+Math.ceil(Math.random()*1000)+'-'+Math.ceil(Math.random()*1000);
	}
    /**
     * 获取ua
     * @return {[type]} [description]
     */
    function getUserAgent(){
        var nav=win.navigator,
            ua=nav.userAgent.toLowerCase(),
            pt=nav.platform.toLowerCase(),
            temp,t1,t2,
            Browser={};
        
        if(/msie/.test(ua)){
            Browser.browser='ie';
            Browser.version= ua.match(/msie\s*(\d+(?:\.\d+)?)/)[1]; 
        } else if(/firefox/.test(ua)){
            Browser.browser='firefox';
            Browser.version= ua.match(/firefox\/(\d+(?:\.\d+)?)/)[1]; 
        } else if(/opera/.test(ua)){
            Browser.browser='opera';
            Browser.version= ua.match(/version\/(\d+(?:\.\d+)?)/)[1]; 
        } else if(/chrome/.test(ua)){
            Browser.browser='chrome';
            Browser.version= ua.match(/chrome\/(\d+(?:\.\d+)?)/)[1]; 
        } else if(/safari/.test(ua)){
            Browser.browser='safari';
            Browser.version= ua.match(/version\/(\d+(?:\.\d+)?)/)[1]; 
        } else {
            Browser.browser='unkown';
            Browser.version= '0.0'; 
        }
        //如果是android手机
        if(/android/.test(ua)){
            Browser.os = ua.match(/android\s+(\d+(?:\.\d+)*)/)[0]; 
            Browser.bit = '32';
        }else if(/iphone/.test(ua)){
            Browser.os = ua.match(/iphone\s+os\s+\d/)[0]; 
            Browser.bit = '32';
        }else if(/ipad/.test(ua)){
            Browser.os = ua.match(/os\s+\d/)[0]; 
            Browser.bit = '32';
        }else if(/hpwos/.test(ua)){
            Browser.os = ua.match(/hpwos\/(\d+(?:\.\d+)*)/)[0]; 
            Browser.bit = '32';
        }else if(/windows\s+phone/.test(ua)){
            Browser.os = 'wp'+ua.match(/windows\s+phone\s+(?:os\s+)?(\d+(?:\.\d+)*)/)[1]; 
            Browser.bit = '32';
        }else if(/series40/.test(ua)){
            Browser.os = 'symbian series40'; 
            Browser.bit = '32';
        }else if(/symbianos/.test(ua)){
            Browser.os = 'symbian series60'; 
            Browser.bit = '32';
        }else if(/blackberry/.test(ua)){
            Browser.os = 'blackberry'; 
            Browser.bit = '32';
        //手机端平台监测
        }else if(/win/.test(pt)){
            t1={
                '6.2':'windows 8',
                '6.1':'windows 7',
                '6.0':'windows vista',
                '5.2':'windows 2003',
                '5.1':'windows xp',
                '5.0':'windows 2000'
            };
            temp=ua.match(/windows\s+nt\s+(\d\.\d)/);
            temp=temp && temp[1];
            //操作系统
            Browser.os=t1[temp]||'windows';
            //操作系统位数
            Browser.bit=/wow64|win64/.test(ua)?'64':'32';
        }else if(/mac/.test(pt)){
            //操作系统
            Browser.os='macos';
            //操作系统位数不准确，仅作参考
            Browser.bit=/wow64|win64/.test(ua)?'64':'32';
        }else if(/linux/.test(pt)){
            //操作系统
            Browser.os='linux';
            //操作系统位数不准确，仅作参考
            Browser.bit=/x86_64|i686/.test(ua)?'64':'32';
        }else if(/x11/.test(pt)){
            //操作系统
            Browser.os='unix';
            //操作系统位数不准确，仅作参考
            Browser.bit=/x86_64|i686/.test(ua)?'64':'32';
        }else{
            //操作系统
            Browser.os='unkown';
            //操作系统位数不准确，仅作参考
            Browser.bit='';
        }
        return Browser;
    }
      /** 判断是否已经加载过此资源 */
      function isLoadedResource(url){
        var styleSheets, scripts,
            len;
        if(LoadedList[url]){
          return true;
        }
        if(/\S+\.css/i.test(url)){
          stylesheet = document.styleSheets;
          len = stylesheet.length;
          while(len--){
            LoadedList[stylesheet[len].href] = true;
          }
        }
        if(LoadedList[url]){
          return true;
        }
        if(/\S+\.js/i.test(url)){
          scripts = document.scripts;
          len = scripts.length;
          while(len--){
            LoadedList[scripts[len].href] = true;
          }
        }
        if(LoadedList[url]){
          return true;
        }else{
          return false;
        }
      }
        
       /**
       *加载js文件 
       * @param {Object} url
       */
      function loadJS(url,callback){
        var head ,
            script,
            //成功之后做的事情
            wellDone=function(){
                LoadedList[url]=true;
                clear();
                log('load js file success:'+url);
                excuteFunction(callback);
            },
            clear=function(){
               script.onload=script.onreadystatechange=script.onerror=null;
               head.removeChild(script);
               head=script=null;
            };
        
        if(isLoadedResource(url)){
            excuteFunction(callback);
            return;
        }
        head = headEl;
        script = document.createElement("script");
        script.type = "text/javascript";
        
       
       script.onerror=function(){
           clear();
           log('load js file error:'+url, 'error');
       }; 
        
        
        if(isFunction(callback)){
            //如果是IE6-IE8
            if(UA.browser=='ie' && UA.version<9){
                script.onreadystatechange=function(){
                    //当第一次访问的时候是loaded，第二次缓存访问是complete
                    if(/loaded|complete/.test(script.readyState)){
                        wellDone();
                    }
                }
            }else{
                script.onload=function(){
                   wellDone();
                }
            }
        }
        
        script.src = url;
        head.appendChild(script);
    }
      /**
       *加载css文件 
       * @param {Object} url
       */
      function loadCSS(url,callback){
        var head,
            link,
            img,
            firefox,
            opera,
            chrome,
            poll,
            //成功之后做的事情
            wellDone=function(){
                LoadedList[url]=true;
                clear();
                log('load css file success:'+url);
                excuteFunction(callback);
            },
            clear=function(){
                timer=null;
                link.onload=link.onerror=null;
                head=null;
            };
        if(isLoadedResource(url)){
            excuteFunction(callback);
            return;
        }
        head = headEl;
        link = document.createElement("link");
        link.rel="stylesheet";
        link.type = "text/css";
        link.href=url;
        
        link.onerror=function(){
           clear();
           log('load css file error:'+url, 'error');
        }; 
        if(isFunction(callback)){
            //如果是IE系列,直接load事件
            if(UA.browser=='ie' 
                || (UA.browser=='firefox' && UA.version>8.9) 
                || UA.browser=='opera'
                || (UA.browser=='chrome' && UA.version>19) 
                || (UA.browser=='safari' && UA.version>5.9)
                
            ){
            
               //IE和opera浏览器用img实现
                link.onload=function(){
                    wellDone();
                };
                head.appendChild(link);
                
            }else if(
               (UA.browser=='chrome' && UA.version>9)
               || (UA.browser=='safari' && UA.version>4.9) 
               || UA.browser=='firefox' 
            ){
            
                head.appendChild(link);
                //如果是非IE系列
                img=document.createElement('img');
                img.onerror=function(){
                    img.onerror=null;
                    img=null;
                    wellDone();
                };
                img.src=url;
                
            }else{//轮询实现
                head.appendChild(link);
                poll=function(){
                    if(link.sheet && link.sheet.cssRules){
                        wellDone();
                    }else{
                        setTimeout(poll,300);
                    }
                };
                poll();
            }
        }else{
            head.appendChild(link);
        }
      }
      /**
       *异步加载所需的文件 
       * @param {Array} urls
       * @param {Function} callback
       * @param {Boolean} [option=true] isOrdered 是否需要按序加载，默认是需要按序加载
       */
      function asyncLoad(urls,callback,isOrdered){
          var _self=this,
              isOrder=!(isOrdered===false),
              isAllDone=false,
              now,
              i,
              urls= ('string'===typeof urls)?[urls]:urls;
              len=(urls instanceof Array) && urls.length,
              /**
               *根据后缀判断是js还是css文件 
               * @param {Object} url
               * @param {Object} done
               */
              load=function(url, done){
                  if(/\.js(?:\?\S+|#\S+)?$/.test(url)){
                      loadJS(url,done);
                  }else{
                      loadCSS(url,done);
                  }
              },
              orderLoad=function(){
                  now=urls.shift();
                  if(now){
                     load(now,orderLoad);
                  }else{
                     excuteFunction(callback);
                  }
              };
          if(!len || len<1){
              return;
          }
          //如果有顺序
          if(isOrder){
              orderLoad();
          }else{
             //如果没有顺序加载   
             for(i=0,now=0;i<len;i++){
                 load(urls[i],function(){
                     now+=1;
                     if(now==len){
                        excuteFunction(callback);
                     }
                 });
             }
          }
      }
      /**
   * 是否是url地址
   * @param  {[type]}  url [description]
   * @return {Boolean}     [description]
   */
  function isUrl(url){
    return /^(\S+:)?\/\/\S+$/i.test(url);
  }
  /**
   * 是不是相对路径
   * @param  {[type]}  path [description]
   * @return {Boolean}      [description]
   */
  function isRelativePath(path){
    return /^(?:\/\S+|\.\/\S+|\.\.\/\S+|\S+\/)/i.test(path);
  }
  /**
   * 获取url的相关信息
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  function getPathInfo(url){
    var pathInfo={
      origin:'',
      pathName:'',
      fileName:'',
      search:'',
      hash:''
    },
    matches;
    matches = url.match(/^((?:\w+:)?\/\/[a-z0-9\-]+(?:\.[a-z0-9\-]+)*)((?:\/[^\/]+)*\/)([^?#\.]+(?:\.[^?#\.]+)*)?(\?[^#]+)?(#\S+)?/i);
    if(matches && matches.length){
      pathInfo.origin = matches[1] || '';
      pathInfo.pathName = matches[2] || '/';
      pathInfo.fileName =matches[3] || '';
      pathInfo.search = matches[4] || '';
      pathInfo.hash = matches[5] || '';
      pathInfo.href = url;
    }
    return pathInfo;
  }
  /**
   * 计算path2相对于path1的相对路径
   * @param  {[type]} path1 [description]
   * @param  {[type]} path2 [description]
   * @return {[type]}       [description]
   */
  function getRelativePath(path1, path2){
      var pathInfo1, pathInfo2, local = location.href;
      var a1, a2, i, len, j, k, result=[];
      if(isUrl(path1)){
        pathInfo1 = getPathInfo(path1);
        path1 = pathInfo1.pathName;
      }
      if(isUrl(path2)){
        pathInfo2 = getPathInfo(path2);
        path2 = pathInfo2.pathName;
      }
      if(pathInfo2 && pathInfo1 && pathInfo1.origin != pathInfo2.origin){
        return pathInfo2.href;
      }
      //处理成绝对路径了再对比
      if(!/^\//.test(path1)){
        path1 = getAbsolutePath(local, path1);
      }
      if(!/^\//.test(path2)){
        path2 = getAbsolutePath(local, path2);
      }
      a1 = path1.split('/');
      //最后一级多余的
      if(a1[a1.length-1]==''){
        a1.pop();
      }
      a2 = path2.split('/');
      for(i =0, len= a2.length; i<len; i++){
        /**
         * 如果不相同
         */
        if(a2[i]!=a1[i]){
          break;
        }
      }
      result = a2.slice(i);
      j = a1.length -i;
      if(j>0){
        while(j--){
          result.unshift('..');
        }
      }else{
        result.unshift('.');
      }
      return result.join('/');
    }
    /**
     * 通过相对basePath的相对路径path计算出其绝对路径
     * @param  {[type]} baseUrl [description]
     * @param  {[type]} path    [description]
     * @return {[type]}         [description]
     */
    function getAbsolutePath(basePath, path, ignoreBasePathCheck){
      var baseInfo,
        a1, a2;
      if(isUrl(basePath)){
        baseInfo = getPathInfo(basePath);
        basePath = baseInfo.pathName;
      }
      if(!ignoreBasePathCheck && !/^\//.test(basePath)){
        log(basePath +'is not an absolute path', 'error');
        return path;
      }
      if(/^\//.test(path)){
        return path;
      }
      a1 = basePath.split('/');
      a2 = path.split('/');
      //最后一级多余的
      //if(a1[a1.length-1]==''){
        a1.pop();
     // }
      for(var i=0, len = a2.length; i<len; i++){
        switch(a2[i]){
          case '.':
            break;
          case '..':
            a1.pop();
            break;
          default:
            a1.push(a2[i]);
            break;
        }
      }
      return (baseInfo?baseInfo.origin:'')+a1.join('/');
    } 

	win.BJT ={
		Util:{
      UA:UA,
			hasOwn:hasOwn,
			extend: extend,
			cloneObject: cloneObject,
			eachProp:eachProp,
			excuteFunction: excuteFunction,
			log: log,
			GUID: generateUID,
      loadJS: loadJS,
      loadCSS: loadCSS,
      asyncLoad: asyncLoad,
      getAbsolutePath: getAbsolutePath,
      getPathInfo: getPathInfo,
      getRelativePath: getRelativePath,
      isUrl: isUrl,
      isRelativePath: isRelativePath
		}
	};
})(window);