/**
 *@fileoverview  the ua plugin for detecting the browser version
 *@author ginano
 *@website http://www.ginano.net
 *@date 20130228 
 */
define('mod/useragent',function(){
    var win=window,
        nav=win.navigator,
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
        
});