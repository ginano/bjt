define('util/lazyload', ['util/zepto'], function($){
	var lazyload = function(els, callback) {
        /* default behavior is preload */
        var loadfunc = preload;
                
        /* Fire one scroll event per scroll. Not one scroll event per image. */
        var elements = $(els);

        var handleScroll = function(event) {
            var counter = 0;
            elements.each(function(e) {
                if (abovethetop(this) ||
                    leftofbegin(this)) {
                        /* Nothing. */
                } else if (!belowthefold(this) &&
                    !rightoffold(this)) {
                        $(this).trigger("appear");
                }
            });

            /* Remove image from array so it is not looped next time. */
            var temp = [];
            for ( var i = 0, length = elements.length; i < length; i++ ) {
                if ( !elements[ i ].loaded) {
                    temp.push( elements[ i ] );
                }
            }
            elements = $(temp);
        };
        
        window.addEventListener('scroll', handleScroll);
        
        elements.each(function(e, item) {
            var self = item;
            self.loaded = false;
            
            /* When appear is triggered load original image. */
            $(self).bind("appear", function() {
                if (!e.loaded) {
                    loadfunc(self, callback);
                }
            });
        });
        
        /* Force initial check if images should appear. */
        var event = document.createEvent("Events");
        event.initEvent("scroll", true, false);
        window.dispatchEvent(event);
        return elements;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */
    function belowthefold(element) {
        var fold = window.innerHeight + window.scrollY;
        return fold <= $(element).offset().top;
    }
    
    function rightoffold (element) {
        var fold = window.innerWidth + window.scrollX;
        return fold <= $(element).offset().left;
    };
        
    function abovethetop(element) {
        var fold = window.scrollY;
        return fold >= $(element).offset().top  + $(element).height();
    };
    
    function leftofbegin(element) {
        var fold = window.scrollX;
        return fold >= $(element).offset().left + $(element).width();
    };
    
    function preload(element, callback) {
        var img = document.createElement('img');
        $(img)
            .bind("load", function() {
               var cb = callback || load;
               cb(element);
            })
            .attr("src", $(element).attr('data-original'));     
    };

    function load(element) {
        $(element).attr("src", $(element).attr('data-original'));
        element.loaded = true;
    };

    return lazyload;
});