/**
 * the basic functions for coding
 */
(function (win, undefined) {
	var hasOwn=Object.prototype.hasOwnProperty,
		  slice = [].slice;

    var LoadedList={},         //存储已经下载过的文件列表
        DownloadingList ={},   //存储正在下载的文件列表
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
     * @param {Boolean} isCloneFunction [default=false]是否复制函数
     * @param {Boolean} isClonePrototype [default=false] 是否复制函数的扩展属性
     */
    function cloneObject(o,isCloneFunction,isClonePrototype){
        function copyObject(obj,isCopyFunction,isCopyPrototype){
            var objClone,
                con,
                prop;
            if(
              obj===undefined
              ||obj===null 
              || 'string' === typeof obj 
              || 'boolean' === typeof obj 
              || 'number' === typeof obj
              ){
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
     * 遍历所有的成员 
     * @param  {[type]}   obj      对象或者数组
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function eachProp(obj,callback){
        var i,len;
        if(obj instanceof Array){
            for(i=0,len=obj.length;i<len;i++){
                callback&&callback(i,obj);
                executeFunction(callback, i, obj[i]);
            }
            return;
        }
        if(obj instanceof Object){
            for(i in obj){
                if(hasOwn.call(obj,i)){
                    executeFunction(callback, i, obj[i]);
                }
            }
            return;
        }
    }
    /**
     * 执行方法，如果传递了方法，并将后面的参数传递给该方法
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function executeFunction( callback ){
    	var args;
    	if(isFunction(callback)){
    		args = slice.call(arguments,1);
    		callback.apply(null, args);
    	}
    }
    /**
     * 打印输出日志
     * @param  {[type]} str [description]
     * @return {[type]}  [option=info]   输出类型有error、wran、info，默认为普通的info
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
     * 生成随机的唯一标示
     * @param  {[type]} [header] id前缀
     * @return {[type]}        [description]
     */
    function generateUID(header){
		header = header? header+'-' : '';
		return header+Math.ceil(Math.random()*1000)+'-'+Math.ceil(Math.random()*1000)+'-'+Math.ceil(Math.random()*1000)+'-'+Math.ceil(Math.random()*1000);
	}
    /**
     * 获取客户端的ua信息ua
     * @return {[type]} {
     *         browser:浏览器名称
     *         version:版本号
     *         webkit: 如果是webkit就返回对应的内核版本号
     *         os:操作系统
     *         bit:操作系统位数
     * }
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
         //如果是webkit设置webkit版本
        temp = ua.match(/webkit\/(\d+(?:\.\d+)?)/);
        if(temp && temp[1]){
          Browser.webkit = temp[1];
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
      /**
       * 判断是否已经加载过此资源 
       * @param  {[type]}  url [description]
       * @return {Boolean}     [description]
       */
      function isLoadedResource(url){
        var styleSheets, scripts,
            len;
        if(LoadedList[url]){
          return true;
        }
        if(checkFileExtension('css', url)){
          stylesheet = document.styleSheets;
          len = stylesheet.length;
          while(len--){
            LoadedList[stylesheet[len].href] = true;
          }
        }
        if(LoadedList[url]){
          return true;
        }
        if(checkFileExtension('js', url)){
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
       * 获取/设置是否正在下载
       * @param  {[type]}  url [description]
       * @param  {[type]}  isDownloading [description]
       * @return {Boolean}     [description]
       */
      function isDownloading(url, isDownloading){
        if(undefined === isDownloading){
          return DownloadingList[url] ===true;
        }
        //下载完毕等状态
        if(!isDownloading){
          delete DownloadingList[url];
        }else{
          DownloadingList[url] =true;
        }
      }

      /**
       * 加载js文件 
       * @param  {[String]}   url      [description]
       * @param  {Function} [callback] [description]
       * @return {[type]}            [description]
       */
      function loadJS(url,callback){
        var head ,
            script,
            //成功之后做的事情
            wellDone=function(){
                LoadedList[url]=true;
                clear();
                log('load js file success:'+url);
                executeFunction(callback);
            },
            //无论成功与否都需要执行清除标签及其相关事件。
            //防止内存泄露等，因为js一旦加载执行都会常驻内存，除非刷新页面
            clear=function(){
               isDownloading(url, false); //设置正在下载状态为false
               script.onload=script.onreadystatechange=script.onerror=null;
               head.removeChild(script);
               head=script=null;
            },
            //如果正在下载就必须去轮询检查是否下载完成
            //但是如果长久都为下载完成，就得退出循环
            //所以设置一个限制次数，目前设置为10次，
            //并且每次轮询等待时间随着次数增加而增加
            retryTimes = 1,
            //轮询等待函数
            waitForSuccess = function(){
              //如果没有正在下载了（但有可能失败了)，并且已下载列表中也存在了，说明已经下载完毕了
              if(!isDownloading(url) && isLoadedResource(url)){
                executeFunction(callback);
              }else if(retryTimes>10){  //如果重试次数已经到了，说明已经下载挂了
                alert('js file ['+url+'] download faild!');
                log('js file ['+url+'] download faild!', 'error');
                return;
              }else{
                //重试
                setTimeout(waitForSuccess, (retryTimes++)*200);
              }
            };

        //如果已经下载，直接执行成功回调
        if(isLoadedResource(url)){
            executeFunction(callback);
            return;
        }
        //如果正在加载，就轮询等待
        if(isDownloading(url)){
          setTimeout(waitForSuccess, 200);
          return;
        }
        head = headEl;
        script = document.createElement("script");
        script.type = "text/javascript";
        
       //加载失败
       script.onerror=function(){
           clear();
           alert('load js file error:'+url, 'error');
           log('load js file error:'+url, 'error');
       }; 
        
        //如果设置了成功回调函数，需要增加onload事件
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
        //设置正在加载中
        isDownloading(url, true);
        script.src = url;
        head.appendChild(script);
    }
     /**
      * 加载css文件 
      * @param  {[type]}   url      [description]
      * @param  {Function} callback [description]
      * @return {[type]}            [description]
      */
      function loadCSS(url,callback){
        var head,
            link,
            img,
            firefox,
            opera,
            chrome,
            poll,
            retryTimes =1,
            webkit = (UA.webkit || 0)-0,
            //成功之后做的事情
            wellDone=function(){
                LoadedList[url]=true;
                clear();
                log('load css file success:'+url);
                executeFunction(callback);
            },
            //加载完成（包括失败和成功）
            //都需要把标签的事件清除，减少内存占用，并设置正在加载状态为false
            clear=function(){
                isDownloading(url, false);
                timer=null;
                link.onload=link.onerror=null;
                head=null;
            },
            //轮询等待正在加载中的文件加载完成
            waitForSuccess = function(){
              //如果没有下载中，并且已经下载完了
              if(!isDownloading(url) && isLoadedResource(url)){
                executeFunction(callback);
              }else if(retryTimes>10){  //如果超过10此重试仍然未下载完成，定义为下载失败了
                alert('css file ['+url+'] download faild!');
                log('css file ['+url+'] download faild!', 'error');
                return;
              }else{
                //继续轮询，每次轮询时间间隔增加200ms
                setTimeout(waitForSuccess, (retryTimes++)*200);
              }
            };
        //如果已经加载过了，就直接执行成功回调
        if(isLoadedResource(url)){
            executeFunction(callback);
            return;
        }
        //如果正在加载，开始轮询
        if(isDownloading(url)){
          setTimeout(waitForSuccess, 200);
          return;
        }
        head = headEl;
        link = document.createElement("link");
        link.rel="stylesheet";
        link.type = "text/css";
        link.href=url;
        //如果支持就加上
        link.onerror=function(){
           clear();
           log('load css file error:'+url, 'error');
        }; 
        //设置正在加载中的状态为true
        isDownloading(url, true);
        if(isFunction(callback)){
            //如果是IE系列,或者对应的某种浏览器的版本号
            //另外手机端的浏览器大豆是webkit内核，所以在这个版本号以上就直接load事件
            if(UA.browser=='ie' 
                || (UA.browser=='firefox' && UA.version>8.9) 
                || UA.browser=='opera'
                || (UA.browser=='chrome' && UA.version>19) 
                || (UA.browser=='safari' && UA.version>5.9)
                || webkit > 536.10
                
            ){
            
               //IE和opera浏览器用img实现
                link.onload=function(){
                    wellDone();
                };
                head.appendChild(link);
                
            }else if(
              //如果介于某个版本之间，可以用img的src设置为css文件来模拟事件，
              //但是有个不足就是没办法知道真正的onerror，所以这个真没办法解决
               (UA.browser=='chrome' && UA.version>9)
               || (UA.browser=='safari' && UA.version>4.9) 
               || UA.browser=='firefox' 
               || webkit > 534.14
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
                
            }else{//对于没有办法模拟的话，只能通过轮询实现
                head.appendChild(link);
                poll=function(){
                    var _fun =function (){
                          var isD = false;
                          //如果是webkit的，此处引用于yui3的get模块，以及参考了seajs的改进
                          if(webkit>0 && document.stylesheet){
                            isD = isLoadedResource(url);
                          }else{
                            try{
                              isD = !!link.sheet.cssRules;
                              isD = true;
                            }catch(ex){
                              if (ex.name === "NS_ERROR_DOM_SECURITY_ERR") {
                                isD = true;
                              }
                            }
                          }
                          return isD;
                        };
                    //如果都已经有10此了还没有成功就定义为失败了
                    if(retryTimes>10){
                      alert('css file' + url +' download faild!');
                      log('css file' + url +' download faild!', 'error');
                      wellDone();
                      return;
                    }else if(_fun()){
                      wellDone();
                    }else{
                      setTimeout(poll, (++retryTimes)*200);
                    }
                };
                setTimeout(poll, 200);
            }
        }else{
            head.appendChild(link);
        }
      }
      /**
       *异步加载所需的文件 
       * @param {Array|String} urls
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
                  if(checkFileExtension('js', url)){
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
                     executeFunction(callback);
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
                        executeFunction(callback);
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
   * 是不是相对路径,通过/xxx,./xxx,../xxx来判断
   * @param  {[type]}  path [description]
   * @return {Boolean}      [description]
   */
  function isRelativePath(path){
    return /^(?:\/\S+|\.\/\S+|\.\.\/\S+|\S+\/)/i.test(path);
  }
  /**
   * 判断文件名或者路径是不是某个扩展名的文件或链接，支持http://x.com/x.js?fsfsf=fsf#dfsfsf=fsf
   * @param  {[type]} ext [description]
   * @param  {[type]} str [description]
   * @return {[Boolean]}     [description]
   */
  function checkFileExtension(ext, str){
    var reg = new RegExp('\\.'+ext+'([\\?#]\\S+)?$', 'i');
    return reg.test(str);
  }
  /**
   * 获取url的相关信息，模拟location相对应的参数
   * @param  {[type]} url [description]
   * @return {[type]}     {
   *         origin:
   *         pathName:
   *         fileName:
   *         search:
   *         hash:
   *         href:
   * }
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
    var ISDOMREADY=false; //标记当前的状态是不是已经domready了
    /** 
     * [afterDomReady description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function afterDomReady(callback){
      var doc = document;
      //如果此时文档已经加载完毕的状态，直接执行回调函数
      if(ISDOMREADY || /complete/i.test(doc.readyState)){
        ISDOMREADY = true;
        executeFunction(callback);
      }else if(doc.addEventListener){
        //如果浏览器支持dom contentloaded，就用这个
        doc.addEventListener('DOMContentLoaded', function(){
            if(ISDOMREADY){
              return;
            }
            ISDOMREADY = true;
            executeFunction(callback);
         }, false);
      }else if(doc.attachEvent){
          //如果支持此方法就用onreadystatechange
          doc.attachEvent('onreadystatechange', function(){
            if(ISDOMREADY){
              return;
            }
            ISDOMREADY = true;
            executeFunction(callback);
         }, false);
      }
    }
  //对外输出此全局对象，所有的API输出到Util下
	win.BJT ={
    version:'0.0.1',  //核心文件版本号
    status:'dev',     //当前的状态是开发版本，当通过grunt编译工具打包之后会将此值设定为online模式，用于区别线上线下环境
		Util:{
      UA:UA,
			hasOwn:hasOwn,
			extend: extend,
			cloneObject: cloneObject,
			eachProp:eachProp,
			executeFunction: executeFunction,
			log: log,
			GUID: generateUID,
      loadJS: loadJS,
      loadCSS: loadCSS,
      asyncLoad: asyncLoad,
      getAbsolutePath: getAbsolutePath,
      getPathInfo: getPathInfo,
      getRelativePath: getRelativePath,
      isUrl: isUrl,
      isRelativePath: isRelativePath,
      afterDomReady: afterDomReady,
      checkFileExtension:checkFileExtension
		}
	};
})(window);