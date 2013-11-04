define('widget/dialog/template', function () {
    var template={
            dialog:'<div class="widget-dialog">\
                            <div class="clr header">\
                                <h2>默认标题</h2>\
                                <a class="right close" data-button="close" href="#" title="关闭">x</a>\
                             </div>\
                            <div class="content"></div>\
                            <div class="footer clr">\
                                <div class="left msg"></div>\
                                <div class="right panel">\
                                    <a href="#" class="button" data-button="confirm">确定</a>\
                                    <a href="#" class="button" data-button="cancel">取消</a>\
                                </div>\
                            </div>\
                        </div>',
          shim:'<div class="widget-dialog-shim"></div>'
    };
    return template;
});