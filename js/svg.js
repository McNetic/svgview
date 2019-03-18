/* global svgPanZoom */

"use strict";

$(function () {
    var parser = new DOMParser();

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

    var create_pngs = function() {
        create_png('png24', 24);
        create_png('png36', 36);
        create_png('png48', 48);
        create_png('png72', 72);
        create_png('png96', 96);
        create_png('png144', 144);
        create_png('png192', 192);
    };

    var create_png = function(imgId, size) {
        var doc = parser.parseFromString(input.val(), "image/svg+xml");
        var svgElement = $('svg', doc);
        var orgWidth = svgElement.get(0).width.baseVal.value;
        var orgHeight = svgElement.get(0).height.baseVal.value;

        var width = size;
        var height = size;
        var factor = (orgWidth > orgHeight) ? width / orgWidth : height / orgHeight;

        var svgHead = '<?xml version="1.0" standalone="no"?>'
                + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
                + '<svg height="' + height + '" width="' + width + '" xmlns="http://www.w3.org/2000/svg">'
                + '<g transform="scale(' + factor + ')">',
            svgFoot = '</g></svg>';

        var blob = new Blob([svgHead + svgElement.html() + svgFoot], {type: 'image/svg+xml;charset=utf-8'});
        var url = URL.createObjectURL(blob);

        var image = new Image;
        image.src = url;
        image.onload = function () {
            var canvas = $("<canvas>").get(0);
            var img = $('img#' + imgId);
            var w = image.width;
            var h = image.height;
            console.log("w " + w + " h " + h);

            canvas.width = width;
            canvas.height = height;

            var context = canvas.getContext("2d");

            context.drawImage(image, 0, 0);
            var png = canvas.toDataURL('image/png');
            img.attr('width', width);
            img.attr('height', height);
            img.attr('src', png);
        }
    }

    var update_svg = function() {
        updating = false;
        var zoom = spz.getZoom(),
                pan = spz.getPan();
        svgPanZoom(svg[0]).destroy();
        create_svg();
        localStorage.setItem('svgSource', input.val());
        create_pngs();
        spz.zoom(zoom);
        spz.pan(pan);
    };

    var onChange = function() {
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
    create_pngs();

});
