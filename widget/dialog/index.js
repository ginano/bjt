define('widget/dialog', [
		'util/zepto',
		'bjt',
		'./template',
		'./style.css'
	],	function($, BJT, Template){
	var Util = BJT.Util;
	var zindex =2000;
	var defaultTemplate ='<div class="hide"></div>',
		defaultOptions ={
			isShim:false,
			isCenter:true
		};
	function Dialog(el, options){
		this.init.apply(this, arguments);
	}
	Dialog.prototype= {
		/**
		 * 初始化节点和选项
		 * @param  {[type]} el      [description]
		 * @param  {[type]} options [description]
		 * @return {[type]}         [description]
		 */
		init:function(el, options){
			var etype = typeof el;
			switch(etype){
				case 'string':
					//如果是html文本或者选择器
					el = el.replace(/^\s+|\s+$/,'');
					this.$el = $(el);
					break;
				case 'object':
					if(el instanceof $){
						this.$el = el;
					}else if(el.nodeType === 1){
						this.$el = $(el);
					}else{
						this.$el = $(defaultTemplate).appendTo($('body'));
						if(options === undefined){
							options = el;
						}
					}
					break;
				default:
					this.$el = $(defaultTemplate).appendTo($('body'));
					break;
			}
			this.setOption(options);
			this.cacheValues={};
		},
		/**
		 * 展示对话框，提供展示前和展示后的回调函数
		 * @return {[type]} [description]
		 */
		show:function(){
			var opt = this.options;
			zindex ++;
			Util.executeFunction(opt.beforeShow, this);
			this.$el.css('z-index', zindex).removeClass('hide');
			Util.executeFunction(opt.afterShow, this);
			this.__isShow = true;
		},
		/**
		 * 隐藏对话框，提供隐藏前和隐藏后的回调函数
		 * @return {[type]} [description]
		 */
		hide:function(){
			Util.executeFunction(opt.beforeHide, this);
			this.$el.addClass('hide');
			Util.executeFunction(opt.afterHide, this);
			this.__isShow = false;
		},
		bindEvent:function(){

		},
		/**
		 * 查找对话框下的节点
		 * @return {[type]} [description]
		 */
		find:function(){
			return this.$el.find.apply(this.$el, arguments);
		},
		/**
		 * 提供该对话框对象的数据缓存
		 * @param  {[type]} key   [description]
		 * @param  {[type]} [value] [description]
		 * @return {[type]}       [description]
		 */
		data:function(key, value){
			if(value === undefined){
				return this.cacheValues[key];
			}else{
				this.cacheValues[key]= value;
			}
		},
		/**
		 * 提供当前对话框是否展示的接口
		 * @return {Boolean} [description]
		 */
		isShow:function(){
			return this.__isShow || false;
		},
		/**
		 * 设置当前对话框的选项
		 * @param {[type]} opt [description]
		 */
		setOption:function(opt){
			this.options = $.extend({}, defaultOptions, opt);
		},
		/**
		 * 居中展示对话框
		 */
		setCenter:function(){
			var self=this,
                win=$(window),
                $body = $('body'),
                w = win.width(),
                h = win.height(),
                dom=self.$el;
            dom.css({
                left: (w - dom.width()) / 2,
                top: $body.scrollTop() + (h - dom.height()) / 2
            });
            return self;
		},
		/**
		 * 设定对话框的位置
		 * @param {[type]} pos [description]
		 */
		setPosition:function(pos){
			var dom = this.$el,
				width, height, temp,
				$win = $(window),
				bodySize={
					width:$win.width(),
					height:$win.height()
				};
			//需要限制一下拖动范围
			width = dom.width();
			height = dom.height();
			//检查最上面
			pos.top = pos.top <0 ? 0 : pos.top;
			//检查最右边
			temp = bodySize.width - width;
			pos.left = pos.left>temp? temp:pos.left;
			//最下面
			temp = bodySize.height-height;
			pos.top = pos.top > temp? temp:pos.top;
			//最左边
			pos.left = pos.left<0?0 :pos.left;
            this.dom.css(pos);
            return this;
		},
		/**
		 * 销毁对话框对象
		 * @return {[type]} [description]
		 */
		destory:function(){

		}
	};
	return Dialog;
});