define(['jquery', 'nicescroll'], function($) {
    'use strict';

    var base = function() {
        var $public = {};
        var $private = {};
        var $parent = {};
        // var $initMenu = false;


        $public.init = function init(_parent) {
            $parent = _parent;
        };

        $public.create = function create(complete) {

            var _config = $parent.config;
            $.each(_config, function(index, value) {
                window[value.id] = {
                    indice: value.id,
                    status: false
                }
            });

            $(".main").append("<div class='base'></div>");
            $(".base").load("views/interface/base/index.html", function() {

                //
                $private.createTelasContainer();
                $private.controleNavBase();
                $private.createSair();
                $private.createRetormar();

                complete();
            });

            $private.reziseModal();
            $(window).resize(function() {
                $(".telaBase").height($(window).height());
                $private.reziseModal();
            });

        };


        $public.liberarNavegacao = function liberarNavegacao() {

            $parent.liberado = true;

            var _indice = $parent.indice;
            var _config = $parent.config;
            $.each(_config, function(index, value) {
                if (_indice == value.indice) {
                    value.visivel = true;
                }
            });


            $private.revisarSetas();
        }


        $public.sair = function sair() {
            //$(".sairContainer").css("display", "block");
            $private.sairCurso();
        }

        $private.createTelasContainer = function createTelasContainer() {
            var _config = $parent.config;

            $.each(_config, function(index, value) {
                $(".telaBase").append("<div indice=" + value.indice + " id=" + value.id + " avancar=" + value.avancar + "  carregado=" + value.carregado + " setas=" + value.setas + " tipo=" + value.tipo + " transicao=" + value.transicao + "  class='telaContainer telaContainer" + value.indice + "'></div>");
            })
        }

        $private.controleNavBase = function controleNavBase() {

            var _config = $parent.config;
            $parent.ajudaIndice = 0;

            $("body").on('navegacaoComplete', function() {
                var _indice = $parent.indice;
                var _config = $parent.config;

                $.each(_config, function(index, value) {
                    if ($parent.indice == value.indice) {

                        //$private.contadorTitulosStatus(index, value, _indice, _config);
                        //$private.destravarStatus(index, value, _indice, _config);
                        $private.createCustom();
                        //$private.resetAnimate();
                        //$private.telaEvent();
                    }
                })



            })

        }

        $private.telaEvent = function telaEvent() {
            $parent.idTela = $parent.config[$parent.indice].id;
            var id = String($parent.idTela).toUpperCase();
            var _containerTela = $(".container" + id);

            var param = {
                id: $parent.idTela,
                init: true,
                container: _containerTela
            };

            if (!_containerTela.attr("statusTela")) {
                _containerTela.attr("statusTela", true);
            } else {
                param.init = false;
            }

            $('body').trigger('telaEvent' + $parent.idTela.toUpperCase(), [param])
        }

        $private.resetAnimate = function resetAnimate() {

            var page = $parent.config[$parent.indice];
            var id = String(page.id).toUpperCase();
            var _containerTela = $(".container" + id);

            if (window[page.id].status) {
                _containerTela.find(".animated").each(function(indice, item) {
                    if ($(item).css("display") == "block" || $(item).css("display") == "flex") {
                        $(item).removeClass("animated");
                    }
                });
            }

        }


        $private.destravarStatus = function destravarStatus(index, value, _indice, _config) {

            if (parseInt(value.avancar) > -1) {
                setTimeout(function() {

                    $public.liberarNavegacao();

                }, 1000 * value.avancar);
            }
        }

        $private.createCustom = function createCustom() {
            var page = $parent.config[$parent.indice];
            var id = String(page.id).toUpperCase();
            var _custom = page.custom;
            var _container = $(".container" + id);

            if (_custom == 0) {

                page.custom = 1;
                _container.find(".containerGeral").prepend("<div class='baseCustom'></div>");
                _container.find(".baseCustom").load("views/interface/custom/index.html", function() {

                    $private.controleCustom();
                    $private.posControleCustom();
                    $private.revisarSetas();
                });
            } else {
                $private.posControleCustom();
                $private.revisarSetas();
            }
        }

        $private.controleCustom = function controleCustom() {

            var page = $parent.config[$parent.indice];
            var id = String(page.id).toUpperCase();
            var _container = $(".container" + id);

            _container.find(".posicionar").positionCSS({
                box: _container.find(".containerGeral"),
                img_H: course.height,
                img_W: course.width
            });

            _container.find(".btnAjudaX").on('click', function() {
                _container.find(".helpBase").css("display", "block");
            })

            _container.find(".btnCloseHelp").on('click', function() {
                _container.find(".helpBase").css("display", "none");
            })

            _container.find(".homeBaseBtn").on('click', function() {
                $parent.indice = 0;
                $("body").attr("nav", "go");
                $("body").trigger("navegacao");
            })

            _container.find(".btnCloseMenu").on('click', function() {
                _container.find(".menuBase").css("display", "none");
            })

            _container.find(".btnClose").on('click', function() {
                $(".sairContainer").css("display", "block");
            })

            _container.find(".setaEsqBase").on('click', function() {
                $("body").attr("nav", "previous");
                $("body").trigger("navegacao");
            })

            _container.find(".setaDirBase").on('click', function() {
                $("body").attr("nav", "next");
                $("body").trigger("navegacao");
            })

            // _container.find(".menuBase .itemM").on('click', function () {

            //     var _tela = $( this ).attr("tela");
            //     var page = $parent.config[$parent.indice];
            //     var id = String(page.id).toUpperCase();

            //     if( _tela != id ){
            //         $.each($parent.config , function(indice, item){

            //             if( (item.id).toUpperCase() == _tela  ){
            //                 // console.log( item.indice );
            //                 _container.find(".menuBase").css("display", "none");
            //                 $parent.indice = item.indice;
            //                 $("body").attr("nav", "go");
            //                 $("body").trigger("navegacao");
            //             }
            //         });
            //     }
            //     else{
            //         //_container.find(".menuBase").css("display", "none");
            //     }
            // });


        }

        $private.posControleCustom = function posControleCustom() {

            var page = $parent.config[$parent.indice];
            var id = String(page.id).toUpperCase();
            var _container = $(".container" + id);
            $(".navInit").css("display", "block");

            // var _titulo1 = page.titulo;
            // $(".titulo1Base").html(_titulo1);

            var _telaAtual = $parent.indice + 1;
            var _telaAll = $parent.config.length;
            var _porcentagem = parseInt((_telaAtual / _telaAll) * 100)

            if (_telaAtual < 10) {
                $(".contadorX").text("0" + _telaAtual + "/" + _telaAll);
            } else {
                $(".contadorX").text(_telaAtual + "/" + _telaAll);
            }

            // if ($parent.scorm_get_suspendData('porcentagemX')) {
            //     var _porcScorm = parseInt($parent.scorm_get_suspendData('porcentagemX'));
            //     if (_porcScorm <= _porcentagem) {
            //         $parent.scorm_set_suspendData('porcentagemX', _porcentagem);
            //     }
            // } else {
            //     $parent.scorm_set_suspendData('porcentagemX', _porcentagem);
            // }

            if ($parent.indice == 0) {
                _porcentagem = 0
            }

            $parent.scorm_set_suspendData('porcentagemX', _porcentagem);
            var _porcScorm = parseInt($parent.scorm_get_suspendData('porcentagemX'));
            $(".porceX").text(_porcScorm + "%");
            $(".carregamentoX .carregamentoInitX").css("width", _porcScorm + "%");

            if ($parent.indice == 0) {
                $(".porceX").text(_porcScorm + "%");
                $(".carregamentoX .carregamentoInitX").css("width", _porcScorm + "%");
            }

        }




        $private.revisarSetas = function revisarSetas() {

            var page = $parent.config[$parent.indice];
            var id = String(page.id).toUpperCase();
            var _container = $(".container" + id);

            _container.find(".setaEsqBase").addClass("btnNavInativo");
            _container.find(".setaDirBase").addClass("btnNavInativo");


            if (page.setas == "direita") {
                $private.ativarSetaNext();
            } else if (page.setas == "esquerda") {
                _container.find(".setaEsqBase").removeClass("btnNavInativo");
            } else if (page.setas == "ambas" || page.setas == "ambos") {
                _container.find(".setaEsqBase").removeClass("btnNavInativo");
                $private.ativarSetaNext();
            }
        }

        $private.ativarSetaNext = function ativarSetaNext() {

            var page = $parent.config[$parent.indice];
            var id = String(page.id).toUpperCase();
            var _container = $(".container" + id);


            if (page.avancar > -1)
                page.visivel = true;

            if (page.visivel) {

                if (page.avancar <= -1)
                    page.avancar = 0.1;

                if (_container.find(".setaDirBase").hasClass("Ativada")) {
                    _container.find(".setaDirBase").removeClass("btnNavInativo");
                    return false
                }

                setTimeout(function() {

                    _container.find(".setaDirBase").removeClass("setaInativa");
                    _container.find(".setaDirBase").addClass("Ativada");
                    _container.find(".setaDirBase").removeClass("btnNavInativo");

                    var element = _container.find(".setaDirBase .icoSet");
                    element.removeClass("fadeIn");


                }, 1000 * page.avancar);

            }

        }

        // $private.contadorTitulosStatus = function contadorTitulosStatus(index, value, _indice, _config) {

        //     var _current = _indice + 1;
        //     if (_current < 10) {
        //         $(".bottonInfoCurrent").text("0" + String(_current));
        //     } else {
        //         $(".bottonInfoCurrent").text(String(_current));
        //     }

        //     var _total = _config.length;
        //     $(".bottonInfoAll").text(_total);

        //     ///titulo
        //     var _titulo1 = value.titulo;
        //     var _titulo2 = value.parentNivel1.titulo;
        //     var _titulo3 = value.parentNivel2.titulo;

        //     $(".titulo1Base").html(_titulo1);
        //     $(".titulo2Base").html(_titulo2);
        //     $(".titulo3Base").html(_titulo3);
        // }

        $private.createRetormar = function createRetormar() {

            if (!$parent.retornar) /// confere se é para ter a tela de retornar de onde parou
                return false

            var _indice = $parent.indice;
            if (_indice != 0) {
                $(".retormar").css("display", "block");

                $(".retormar").find(".naoSair").on("click", function() {

                    $(".retormar").css("display", "none");


                    $parent.indice = 0;
                    $("body").attr("nav", "go");
                    $("body").trigger("navegacao");

                });

                $(".retormar").find(".simSair").on("click", function() {
                    $(".retormar").css("display", "none");
                });

            }
        }

        $private.createSair = function createSair() {

            $(".main").append("<div class='sairContainer'></div>");
            $(".sairContainer").load("views/interface/sair/sair.html", function() {
                $(".sairContainer .naoSair").on('click', function() {
                    $(".sairContainer").css("display", "none");
                })

                $(".sairContainer .simSair").on('click', function() {
                    $private.sairCurso();
                })

            });

            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                $(".iconSairBase").css("display", "block");
            }

            $(".iconSairBase").on('click', function() {
                $(".sairContainer").css("display", "block");
            })
        }

        $private.sairCurso = function sairCurso() {

            var _quit_url = "views/interface/sair/encerrado.html";

            if (top === window) { // IS IFRAME
                var Browser = navigator.appName;
                var indexB = Browser.indexOf('Explorer');

                if (indexB > 0) {
                    var indexV = navigator.userAgent.indexOf('MSIE') + 5;
                    var Version = navigator.userAgent.substring(indexV, indexV + 1);

                    if (Version >= 7) {
                        window.open('', '_self', '');
                        window.close();
                    } else if (Version == 6) {
                        window.opener = null;
                        window.close();
                    } else {
                        window.opener = '';
                        window.close();
                    }

                } else {
                    window.open('', '_parent', '');
                    window.close();
                }
            } else {
                var contentRoot = window;
                var urlBase = $private.GetContentRootUrlBase(contentRoot);
                window.location.href = urlBase + _quit_url;
            }

            $parent.sairScorm();
        }

        $private.GetContentRootUrlBase = function GetContentRootUrlBase(contentRoot) {

            var urlParts = contentRoot.location.href.split("/");
            delete urlParts[urlParts.length - 1];
            contentRoot = urlParts.join("/");
            return contentRoot;
        }

        $private.reziseModal = function reziseModal() {


            // Get screen size (inner/outerWidth, inner / outerHeight)
            var height = $(window).height();
            var width = $(window).width();


            if (width > height) {
                // Landscape
                $(".portrait").css("display", "none");
            } else {

                // Portrait
                setTimeout(function() {
                    $(".portrait").css("display", "block");
                }, 1000 * 0.2);

            }
        }

        return $public;
    };

    return base();
});