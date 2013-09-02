(function ($) {
    $.fn.drawLine = function (x1, y1, x2, y2, canvasType, color, width) {
        this.each(function () {
            if ($(this).canvas_compatible) {
                var ctx = $(this).getCanvas(canvasType);
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineWidth = width;
                ctx.strokeStyle = color;
                ctx.stroke();
            } else {
                $(this).append('<v:line style="position:absolute; z-index:2; top:' + Math.min(y1, y2) + 'px; left:' + Math.min(x1, x2) + 'px; width:' + $(this).width() + 'px; height:' + $(this).height() + 'px;" width="' + $(this).width() + '" height="' + $(this).height() + '" from="' + x1 + ',' + y1 + '" to="' + x2 + ',' + y2 + '"></v:line>');
            }
        });

        return this;
    }

    $.fn.clearLine = function (canvasType) {
        $("#menuItemCanvas").remove();
    }


    $.fn.getCanvas = function (canvasType) {

        if (canvasType == "menuItem") {

            if ($("#menuItemCanvas").length > 0) {
                $("#menuItemCanvas").remove();
            }

            height = $(this).height() - 6 + 3;
            $(this).append('<canvas id="menuItemCanvas" class="j-draw-unit" style="position:absolute;left:0px; top:' + height + 'px;" width="' + $(this).width() + '" height="' + ($(this).height() + 3) + '" ></canvas>');

        }
        else {
            if (canvasType == "splittingLine") {
                if ($(this).children("canvas.j-draw-unit").length < 1) {
                    $(this).append('<canvas class="j-draw-unit" style="position:relative; left:0px; top:0px;" width="' + $(this).width() + '" height="' + $(this).height() + '" ></canvas>');
                }
            }
            else {
                if ($(this).children("canvas.j-draw-unit").length < 1) {
                    $(this).append('<canvas class="j-draw-unit" style="position:absolute; left:0px; top:0px;" width="' + $(this).width() + '" height="' + 3 + '" ></canvas>');
                }
            }
        }

        return $(this).children("canvas.j-draw-unit")[0].getContext('2d');
    }

    $.fn.canvas_compatible = false;
    try {
        $.fn.canvas_compatible = !!(document.createElement('canvas').getContext('2d')); // S60
    } catch (e) {
        $.fn.canvas_compatible = !!(document.createElement('canvas').getContext); // IE
    }
})(jQuery);
