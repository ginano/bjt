bjt
===

Baina javascript toolkit

设计目的

	基于模块化的设计方式来构建web应用的页面模板系统。就是每个模板页面由各种规格的模块构成，每个模块可以包含js和css，以及html标签。

目录结构
	
	+core 核心文件夹
		util.js  整个工具箱js的基本方法集合
		bjt.js   模块化管理实现
	+mod  基本的功能独立单元，一般由一个以上的widget构成。
		+header 顶部模块
			index.js js模块
			index.css 样式文件
			template.js  模板文件
		+footer  底部模块
			index.js js模块
			index.css 样式文件
			template.js  模板文件
		...
	+page 页面模板单元，一些具有基本布局样式和交互功能的template
		+list 列表页模板
			index.js js模块
			index.css 样式文件
			template.js  模板文件
		+detail 详情页模板
			index.js js模块
			index.css 样式文件
			template.js  模板文件
		...
	+test 测试用例页面
		...
	+util 纯js逻辑的模块，提供一些特定api
		cookie.js 操作cookie
		path.js 路径处理
		...
	+widget 最小复用单元
		+tab tab切换模块
			index.js js模块
			index.css 样式文件
			template.js  模板文件
		+dialog 对话框模块
			index.js js模块
			index.css 样式文件
			template.js  模板文件
		...

