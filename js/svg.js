/* global svgPanZoom */

"use strict";

$(function () {

    var input = $('#input'),
            svg = $('#svg'),
            spz,
            updating = false;

    var create_svg = function() {
        svg.html(input.val());
        spz = svgPanZoom(svg[0], {
            zoomEnabled: true,
            controlIconsEnabled: true,
            minZoom: 0.1
        });
    };

    var update_svg = function () {
        updating = false;
        var zoom = spz.getZoom(),
                pan = spz.getPan();
        svgPanZoom(svg[0]).destroy();
        create_svg();
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

    create_svg();

});
