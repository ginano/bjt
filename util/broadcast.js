define('mod/broadcast', function(){
  var Notify=function(){
       this.attachFunctionList={};
   };
   Notify.prototype={
       /**
        * 监听消息 
         * @param {String} notifyName
         * @param {Function} processFunction
         * @param {Object} [options] 选项
         * @param {Object} options.scope 作用域
         * @param {Boolean} options.asynchronous 是否异步执行
        */
       attach:function(notifyName,processFunction,options){
           var _temp,
               opt= options ||{};
           if('string'===typeof notifyName && 'function'===typeof processFunction){
               _temp=this._processFunction(notifyName);
               if(!_temp){
                   this._addNotify(notifyName);
               }
               this._processFunction(notifyName).push({
                   fun:processFunction,
                   scope:opt.scope,
                   isAsync:opt.isAsync
               });
           }
           return this;
       },
       /**
        *解绑时间 
         * @param {Object} notifyName
         * @param {Object} processFunction
        */
       detach:function(notifyName, processFunction){
           if('string' !==typeof notifyName){
               return;
           }
           if('function' === typeof processFunction ){
               this._processFunction(notifyName,processFunction,true);
           }else{
               this._processFunction(notifyName,true);
           }
           return this;
       },
       /**
        *是同步执行消息 
         * @param {Object} notifyName
        */
       notify:function(notifyName){
           var funs=this._processFunction(notifyName)||[],
               i,len,temp,args;
           len=funs.length;
           if(len<1){
               return;
           }
           args=Array.prototype.slice.call(arguments,1);
          // console.log('broadcast: ---------'+notifyName+'----'+args);
           for(i=0;i<len;i++){
               temp=funs[i];
               if(temp.isAsync){
                  (function(t){
                       setTimeout(function(){
                           t.fun.apply(t.scope, args);
                       },0);
                  })(temp);
               }else{
                   temp.fun.apply(temp.scope,args);
               }
           }
           return this;
       },
       /**
        *异步执行消息 
         * @param {Object} notifyName
        */
       notifyAsync:function(notifyName){
           var funs=this._processFunction(notifyName)||[],
               i,len,temp,args;
           len=funs.length;
           if(len<1){
               return;
           }
           args=Array.prototype.slice.call(arguments,1);
           //console.log('broadcast: ---------'+notifyName+'----'+args);
           for(i=0;i<len;i++){
               temp=funs[i];
                (function(t){
                   setTimeout(function(){
                       t.fun.apply(t.scope, args);
                   },0);
              })(temp);
           }
           return this;
       },
       _processFunction:function(notifyName,processFunction,isDel){
           var len;
           if('string'===typeof notifyName){
               //如果传递了函数名称
               if('function'==typeof processFunction){
                   len=(this.attachFunctionList[notifyName]||[]).length;
                   while(len--){
                       if(this.attachFunctionList[notifyName][len].fun===processFunction){
                           //如果是删除
                           if(isDel===true){
                               this.attachFunctionList[notifyName].splice(len,1);
                           }else{
                               //如果是获取
                              return this.attachFunctionList[notifyName][len]; 
                           }
                       }
                   }
               }else{//如果没有传递函数名称
                   isDel = !!processFunction;
                   //如果传递了删除值，则删除
                   if(isDel===true){
                       delete this.attachFunctionList[notifyName];
                   }else{
                       //否则直接返回对应的绑定函数列表
                      return this.attachFunctionList[notifyName];
                   }
                   
               }
           }
           return null;
       },
      _addNotify:function(notifyName){
           this.attachFunctionList[notifyName]=[];
       },
       createInstance:function(){
           return new Notify();
       }
   };
   
   return new Notify();
});