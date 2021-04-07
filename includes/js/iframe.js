define(['jquery', 'jquery_scorm'], function($) {

    'use strict';

    var iframe = function() {
        var $public = {};
        var $private = {};

        //=============================================================
        // VARIABLES
        //=============================================================

        $public.PATH_CONFIG = "";
        $public.resize = false;
        $public.body = $("body");


        //=============================================================
        // PUBLIC FUNCTIONS
        //=============================================================  

        $public.init = function init(PATH_CONFIG) {

            $public.PATH_CONFIG = PATH_CONFIG;
            $private.initXML();

        };

        $public.preloaderComplete = function preloaderComplete() {
            document.getElementById("loading").style.display = "none";
        }

        //////////////////////////////// 
        //       INIT XML              //
        ////////////////////////////////

        $private.initXML = function initXML() {
            var _pathXML = $public.PATH_CONFIG;

            $.ajax({
                // a url do xml
                url: _pathXML,
                // o tipo de dados que é xml
                dataType: "xml",
                // antes de enviar loga "Enviando"
                beforeSend: function() {
                    //console.log('Enviando');
                },
                // se terminar com sucesso loga o retorno
                success: function(xml) {

                    $(xml).find('info').each(function() {
                        $public.width = Number($(this).find('width').text());
                        $public.height = Number($(this).find('height').text());
                        $public.position = $(this).find('position').text();
                        $public.container = $(this).find('container').text();

                        //
                        $private.initIframe();
                    });

                    $(xml).find('info').find('compilador').each(function() {
                        $public.resize = ($private.filtroResposta($(this).find('resize').text()));

                        if ($public.resize)
                            $private.resizeInit();
                    })

                }
            });

        }


        //////////////////////////////// 
        //       INIT IFRAME          //
        ////////////////////////////////

        $private.initIframe = function initIframe() {


            // $(window).resize(function () {
            //     clearTimeout($.data(this, 'resizeTimer'));
            //     $.data(this, 'resizeTimer', setTimeout(function () {
            //         $private.dataInit();
            //     }, 200));
            // });
        };

        $private.resizeInit = function resizeInit() {
            window.moveTo(0, 0);
            window.resizeTo(screen.width, screen.height);

            top.window.moveTo(0, 0);
            if (document.all) {
                top.window.resizeTo(screen.availWidth, screen.availHeight);
            } else if (document.layers || document.getElementById) {
                if (top.window.outerHeight < screen.availHeight || top.window.outerWidth < screen.availWidth) {
                    top.window.outerHeight = screen.availHeight;
                    top.window.outerWidth = screen.availWidth;
                }
            }
        }

        $private.filtroResposta = function filtroResposta(_resp) {
            var _termo = String(_resp);

            if (_termo == "sim" || _termo == "Sim" || _termo == "SIM" ||
                _termo == "true" || _termo == "True" || _termo == "TRUE" || _termo == true) {
                return true;
            } else {
                return false;
            }

        }

        return $public;
    };

    return iframe();
});