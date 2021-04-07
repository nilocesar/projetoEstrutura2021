var course = course || {};
var PATH_CONFIG = "./data.xml";
(function(doc, undefined) {
    'use strict';
    //
    require.config({
        baseUrl: './includes/js',
        paths: {
            jquery: 'vendor/jquery-1.11.2.min',
            imagesloaded: "vendor/imagesloaded.pkgd.min",
            nicescroll: "vendor/jquery.nicescroll.min",
            velocity: "vendor/velocity.min",
            detectmobilebrowser: "vendor/detectmobilebrowser",
            transit_jquery: "vendor/jquery.transit.min",
            easing_jquery: "vendor/jquery.easing.min",
            componentes_jquery: "vendor/componentes.jquery",
            print: "vendor/jQuery.print.min",
            course: 'course'
        },
        shim: {
            jquery: {
                exports: '$'
            },
            imagesloaded: {
                deps: ['jquery']
            },
            nicescroll: {
                deps: ['jquery']
            }
        }
    });

    require(['jquery'], function($) {
        require(['course'], function(_course) {
            $(function() {
                course = _course;
                course.setCourse('PATH_CONFIG', PATH_CONFIG).init();
            });
        });
    });

})(document);