define('util/string', ['bjt'], function (BJT) {
	/**
	 * 将中文转换为unicode
	 * @param  {[type]} str [description]
	 * @return {[type]}     [description]
	 */
	function cn2unicode(str){
		return escape(str).toLocaleLowerCase().replace(/%u/gi,'\\u');
	}
	/**
	 * unicode转换为中文
	 * @param  {[type]} str [description]
	 * @return {[type]}     [description]
	 */
	function unicode2cn(str){
		return unescape(str.replace(/\\u/gi,'%u'));
	}
	 /**
	  * 限制输入长度
	  * @param {Object} str 原始字符串
	  * @param {Int} length 长度
	  * @param {String} [option] appendix 当长度超出时的省略符  ,默认无
	  * @param {Boolean} [option] isChinese 是否对中文特殊处理成2个字符,默认false不对中文进行特殊处理
	  */
	function limitLength(str,length,appendix,isChinese){
         var apptype=typeof appendix,
             len,i,j,temp;
         if('string'==apptype){
             isChinese=!!isChinese;
         }else if('boolean'==apptype){
             isChinese=appendix;
             appendix='';
         }else{
             appendix=''
             isChinese=!!isChinese;
         }
         str=str+'';
         len=str.length;
         ///[\u4E00-\u9FA5]/
         if(isChinese){
             for(i=0,j=0;i<len;i++){
                 if(length<j){
                     break;
                 }
                 temp=str.charCodeAt(i);
                 if(temp>=0x4E00&&temp<=0x9FA5){
                     j+=2;
                 }else{
                     j+=1;
                 }
             }
             if(len>i){
                 return str.substr(0,i-1)+appendix;
             }else{
                 return str;
             }
         }else{
             if(len>length){
                 return str.substr(0,length)+appendix;
             }else{
                 return str;
             }
         }
     }
     /**
     *全角转换为半角
     * 全角空格为12288，半角空格为32
     * 其他字符半角(33-126)与全角(65281-65374)的对应关系是：均相差65248 
     * @method toDBC
     */
    function toDBC(str) {
        var i,
            len=str.length,
            code,
            result = '';
        for (i = 0; i < len; i++) {
            code = str.charCodeAt(i);
            if (code > 65280 && code < 65375) {
                result += String.fromCharCode(str.charCodeAt(i) - 65248);
            } else if(code==12288){
                 result += String.fromCharCode(32);   
            }   else {
                result += str.charAt(i);
            }
        }
        return result;
    }
    /**
     *半角转全角
     * 全角空格为12288，半角空格为32
     * 其他字符半角(33-126)与全角(65281-65374)的对应关系是：均相差65248 
     * @method toSBC
     */
    function toSBC(str) {
        var i,
            len=str.length,
            code,
            result = '';
        for (i = 0; i < len; i++) {
            code = str.charCodeAt(i);
            if (code > 32 && code < 127) {
                result += String.fromCharCode(str.charCodeAt(i) + 65248);
            } else if(code==32){
                 result += String.fromCharCode(12288);   
            }   else {
                result += str.charAt(i);
            }
        }
        return result;
    }
    /**
      *检查是否有脚本 
      */
    function checkScript(val){
         if(/<\/?script\s*>/i.test(val)){
             return false;
         }else{
             return true;
         }
     }
     /**
      *检查是否有html结构标签 
      */
    function checkHTML(val){
         if(/<\/?[^>]+>/i.test(val)){
             return false;
         }else{
             return true;
         }
     }
     /**
      *将转义后的字符串转换成html标签 
      */
     function string2HTML(val){
        return val.replace(/&lt;/g,'<').replace(/&quot;/g,'"').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&nbsp;/g,' '); 
     }
     /**&quot;
      *将html代码过滤替换成字符串展示 
      */
     function HTML2String(val){
         return val.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
     }
     function clearHtmlTag(str){
        return  str.replace(/<\/?[^>]+>/i, '');
     }
     /**
      *整个入口进行校验的 
      * @param {Object} el
      * @return {Boolean} 
      */
     function checkFilter(val){
         return this.checkScript(val)&&this.checkHTML(val);
     }
     /**
      * [getJSONValue description]
      * @param  {[type]} val [description]
      * @return {[type]}     [description]
      */
     function getJSONValue(val){
         return val.replace(/\t|\r\n|\n/g,' ');
     }  
	return {
        getJsonString: getJSONValue,
        hasHtmlTag: checkFilter,
        hasScript: checkScript,
        clearHtmlTag: clearHtmlTag,
        escapeHtml: HTML2String,
        unescapeHtml: string2HTML,
        toDBC: toDBC,
        toSBC: toSBC,
        limitLength: limitLength,
        unicode2Cn: unicode2cn,
        cn2Unicode: cn2unicode
	};
});