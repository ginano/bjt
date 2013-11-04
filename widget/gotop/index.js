define('widget/gotop/index', [
	'bjt',
	'util/zepto',
    './style.css'
	], function(BJT, $){
	var  html = '<div class="widget-gotop hide"></div>',
		 win = window,
		 Util = BJT.Util,
		 $win = $(win),
		 $doc = $('body');
	var isSupportFixed = (function(){
        var div = document.createElement('div'),
            result;
        div.style.position='fixed';
        document.body.appendChild(div);
        result =win.getComputedStyle(div).getPropertyValue('position');
        document.body.removeChild(div);
        return result == 'fixed';
    })();

    function GoTop(options){
        //记录上次的值
        this.prevTop =0;
        this.nowTop=0;
        this.dom = $(html);
        this.options = $.extend({}, options);
        this.timer =null;
        this.initDom();
        this.bindEvent();
    }
    GoTop.prototype = {
       //初始化dom结构
        initDom:function(){
            this.dom.appendTo($doc);
        },
        bindEvent:function(){
            var self = this;
            this.dom.on('click', function(e) {
                  e.preventDefault();
                 document.body.scrollTop=0;
                 Util.executeFunction(self.options.after);
                  return false;
            });
           $win.on('scroll',  function(e) {
                var direction,
                    winHeight;
                //记录上一次的结果
                self.prevTop = self.nowTop;
                //记录每次滚动的位置
                self.nowTop =$win.scrollTop();
                direction = self.nowTop- self.prevTop;
                winHeight = $win.height();
                //当屏幕至少还处于两屏外，并且用户是在往上滑动时才出现
                if(self.nowTop > 2* winHeight && direction<0){
                    self.dom.removeClass('hide');
                }else{
                   self.dom.addClass('hide');
                }
            });
        }
    };
    return GoTop;
});