define('widget/tab/index', [
		'util/zepto'
	],	function($){
    var defaultOption={
            el:null,
            isAutoPlay: false,               // 是否自动进行切换 
            timeDelay: 3,                   // 自动切换的时间间隔 (单位：秒)
            torpid:200,                     // 时间触发tab切换时，迟钝化处理时间(单位：毫秒)，只在双事件驱动时触发，如mouseover/mouseout
            events: 'mouseover',    // 切换的事件触发类型 
            currentClass: 'current',        // 当前tab的触点样式 
            titleSelector: '.tab-title',      // 触点元素集
            titleDisabledClass: 'tab-title-disabled',      // 触点元素无效时
            boxSelector: '.tab-content',        // 内容元素集 
            selected: 0,
            onSelected:null,
            firstDisabledEvent:true, //默认第一次选中不触发自定义事件
            onShow:null         
         },
        Tab=function( options ){
            if(! options || (! options.el instanceof $)){
                return;
            }
            this.options=$.extend({},defaultOption, options );
            this.dom= $(this.options.el);
            this.init();
        };
        
    Tab.prototype={
        /**
         * init entry 
         */      
        init:function(){
            //reset the dom node
            this.resetDomNode();
            this._create();
        },
        _create: function() {
            var self = this,
                o = this.options,
                stopAutoPlaySelector=[o.boxSelector],
                defaultIdx = o.selected;
           
            self.tHandle = null;
            //如果是小于0，则为随机展示    
            if (defaultIdx < 0) { // tabs第一页随机选择 added by shiwei.dengsw 2012.07.18
                // 产生一个随机整数，这个随机整数的范围为：[min, max]
                defaultIdx = Math.floor(Math.random() * (self.getLength())) ;
            }
            self._setTab(defaultIdx, o.firstDisabledEvent);
            //自动播放
            self.startAutoPlay();
            
            //如果是鼠标移上去的时候触发切换tab的话，这个时候也是需要停止动画的
            if(/hover|mouseover/.test(o.events)){
                stopAutoPlaySelector.push(o.titleSelector);
            }
            //titles事件监听
            self.dom.on(o.events, o.titleSelector, function(e){
               var $this=$(this),
                    idx = self.titles.index($this);
               if(o.titleDisabledClass && $this.hasClass(o.titleDisabledClass)) {
                   return;
               }
               if(idx === self.index){
                   return;
               }
               self._setTab(idx);
               self.startAutoPlay();
            })
            .on('mouseenter mouseleave', stopAutoPlaySelector.join(','), function(e){
                var $this=$(this);
                if(o.titleDisabledClass && $this.hasClass(o.titleDisabledClass)) {
                   return;
               }
                if(e.type=='mouseenter'){
                    self.stopAutoPlay();
                }else{
                    self.startAutoPlay();
                }
            });
        },
        /**
         * @methed reset 重置
         */
        resetDomNode: function(){
            var self=this,
                 o=self.options,
                  i, l, n;
            self.titles = self.dom.find(o.titleSelector);
            self.boxes = self.dom.find(o.boxSelector);
            
            l=self.titles.length;
            n=self.boxes.length;
            //如果titles比boxes多,则隐藏掉后面的
            if ( l > n ) {
                for ( i=n; i<l; i++) {
                    self.titles.eq(i).addClass(o.titleDisabledClass);
                }
                self.titles = self.titles.slice(0, n );
            }
        },
        /**
         * @methed _setTab 设置tab
         * @param {num} index 需要显示的title序号
         * @param {Boolean} firstDisabledEvent 第一次执行的时候是否执行
         */
        _setTab: function(index, firstDisabledEvent) {
            var     self = this,
                    o=self.options,
                    idx =  self._getIndex(index), 
                    box = self.boxes.eq(index);
            //自定义事件 select
            if( !firstDisabledEvent && 'function' === typeof o.onSelected){
                o.onSelected(idx);
            } 
            if (o.effect!=='scroll') {
                self._lazyImg(idx);
                self._lazyHtml(idx);
            }

            self._setSelectedTitle(idx);
            self._setSelectedBox(idx);
            self.index = idx;
            if ( !firstDisabledEvent && !/scroll|fade/.test(o.effect) && 'function' === typeof o.onShow ) {
                //自定义事件 show
                o.onShow(idx);
            }
            self.startAutoPlay();
        },
       stopAutoPlay: function(){
           var self=this,
                o= self.options;
           if(self.tHandle){
               clearTimeout(self.tHandle);
           }
       },
        /**
         * @methed _autoPlay 自动播放
         */
        startAutoPlay: function() {
            var self = this;
            if(!self.options.isAutoPlay){
                return;
            }
            if (self.tHandle){
                clearTimeout(self.tHandle);
            }
            self.tHandle = setTimeout(function(){
                self._setTab(self.index+1);
            }, self.options.timeDelay*1000);
        },
        
        /**
         * @methed _setSelectedTitle  title的设置
         * @param {num} idx
         */
        _setSelectedTitle: function(idx) {
            var self=this,
                  oldIndex=self.index,
                  currentClass= self.options.currentClass,
                  $titles=self.titles;
            if ($titles.length>0) {
                $titles.eq(oldIndex).removeClass(currentClass);
                $titles.eq(idx).addClass(currentClass);
            }
        },
        /**
         * @methed _effectNone  无动画效果的box设置
         * @param {num} idx
         */
        _setSelectedBox: function(idx) {
            this.boxes.hide();
            this.boxes.eq(idx).show();
        },
        _setOption: function(options) {
            this.options=$.extend( this.options, options);
        },
        /**
         * @methed _lazyLoad 懒加载图片
         * @param {num} idx
         */
        _lazyImg: $.noop,
       
        /**
         * @methed _lazyHtml 懒加载HTML
         * @param {Object} idx
         */ 
        _lazyHtml: $.noop,
        
        /**
         * @methed _lazyScrollLoad 滚动-懒加载图片
         */
        _lazyScrollImg: $.noop,
       
        /**
         * @methed _lazyScrollHtml 滚动-懒加载HTML
         */ 
        _lazyScrollHtml: $.noop,
        
        /**
         * @methed _setEffectStyle 设置滚动时需要的STYLE
         */
        _setEffectStyle: $.noop,
        /**
         * @methed _getIndex 获取index
         * @param {num} idx
         */
        _getIndex: function(idx) {
            var l = this.boxes.length;
            if (idx<0) {
                return (idx+l);
            } else if (idx>=l) {
                return (idx-l);
            } else {
                return idx;
            }
        },
        /** 
         * @methed getPrev   显示上一个tab
         */
        prev: function(n) {
            n = n || 1;
            this._setTab(this.index-n);
            this.startAutoPlay();
            return this;
        },
        
        /**
         * @methed getNext   显示下一个
         */
        next: function(n) {
            n = n || 1;
            this._setTab(this.index+n);
            this.startAutoPlay();
            return this;
        },
        
        /**
         * @methed length  返回tab数
         */
        getLength: function() {
            return this.boxes.length;
        },
        getCurrentBox:function(){
          return this.boxes.eq(this.getCurrentIndex());  
        },
        getCurrentTitle:function(){
            return this.titles.eq(this.getCurrentIndex());
        },
        getTitles:function(){
          return this.titles;  
        },
        getBoxes:function(){
          return this.boxes;  
        },
        /**
         * @methed idx 返回当前index
         */
        getCurrentIndex: function() {
            return this.index;
        },
        
        /**
         * @param {num} index  允许负数，如果负数都从最后一个开始算
         */
        setCurrentIndex: function(index) {
            if (index!==this.index) {
                this._setTab(index);
            }
            return this;
        }  
    };
    return Tab;
});