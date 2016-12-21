/* global svgPanZoom */

"use strict";

$(function () {

    var input = $('#input'),
            svg = $('#svg'),
            spz,
            updating = false;

    var create_svg = function () {
        svg.html(input.val());
        spz = svgPanZoom(svg[0], {
            zoomEnabled: true,
            controlIconsEnabled: true,
            minZoom: 0.1
        });
    };

    var create_png = function () {
        var parser = new DOMParser();
        var doc = parser.parseFromString(input.val(), "image/svg+xml");
        var svgElement = $('svg', doc);
        console.log(svgElement.attr('width'));

      var svgHead = '<?xml version="1.0" standalone="no"?>'
                + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
                + '<svg height="' + svgElement.attr('height') + '" width="' + svgElement.attr('width') + '" xmlns="http://www.w3.org/2000/svg">'
                + '',
            svgFoot = '</svg>';

        var blob = new Blob([svgHead + svgElement.html() + svgFoot], {type: 'image/svg+xml;charset=utf-8'});
        var url = URL.createObjectURL(blob);

        var image = new Image;
        image.src = url;
        image.onload = function () {
            var canvas = $("<canvas>").get(0);
            var img = $('img#png');
            var width = image.width;
            var height = image.height;
            console.log("w " + width + " h " + height);

            canvas.width = width;
            canvas.height = height;

            var context = canvas.getContext("2d");

            context.drawImage(image, 0, 0);
            var png = canvas.toDataURL('image/png');
            img.attr('width', svgElement.attr('width'));
            img.attr('height', svgElement.attr('height'));
            img.attr('src', png);
        }
    }

    var update_svg = function () {
        updating = false;
        var zoom = spz.getZoom(),
                pan = spz.getPan();
        svgPanZoom(svg[0]).destroy();
        create_svg();
        localStorage.setItem('svgSource', input.val());
        create_png();
        spz.zoom(zoom);
        spz.pan(pan);
    };

    var onChange = function () {
        if (!updating) {
            updating = true;
            window.setTimeout(update_svg, 100);
        }
    };

    input.change(onChange);
    input.keyup(onChange);

    var storedSvg = localStorage.getItem('svgSource');
    if (storedSvg !== null) {
        input.val(storedSvg);
    }
    create_svg();
    create_png();

});