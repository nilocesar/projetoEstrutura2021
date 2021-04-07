define(['jquery', 'imagesloaded', 'velocity', 'componentes_jquery',
    "transit_jquery", "easing_jquery", 'detectmobilebrowser', 'print'
], function($) {

    'use strict';
    var course = function() {
        var $public = {};
        var $private = {};

        //=============================================================
        // VARIABLES
        //=============================================================

        $private.projectData = {};
        $private.componenteData = {};

        $public.pathTelas = "views/telas/";
        $public.ajudaIndice = 0;
        $public.indice = 0;
        $public.indiceOLD = 0;
        $public.idTela = 'aa1';
        $public.containerAtual = null;
        $public.config = [];
        $public.liberado = false;
        $public.block = true;
        $public.navBlock = false;
        $public.navBlockNext = false;
        $public.navBlockPrev = false;
        $public.debug = false;
        $public.retornar = false;
        $public.cache = false;
        $public.log = true;
        $public.resize = false;
        $public.body = $("body");
        $public.bodyIframe = window.parent.iframe;
        $public.IE = (navigator.userAgent.indexOf("Edge") > -1 || navigator.userAgent.indexOf("Trident/7.0") > -1) ? true : false;
        $public.MOBILE = SmartPhone.isAny();
        $public.ieOLD = SmartPhone.ieOLD();


        $public.pageLoaderInit = 3; /// carrega 3 página inicialmente 
        $public.telasExce = [{
                "t": "aa1",
                "a": 0
            },
            {
                "t": "aa2",
                "a": 0
            },
            {
                "t": "aa3",
                "a": 0
            },
        ]; /// telas exceção de carregamento - elas já são carregadas na primeira remessa



        //=============================================================
        // PUBLIC FUNCTIONS
        //=============================================================  

        $public.init = function init() {

            $private.initXML();

        };

        $public.setComponente = function setComponente(pathName, pathData) {
            $private.componenteData[pathName] = pathData;
        };

        $public.getComponente = function getComponente(pathName) {
            return $private.componenteData[pathName];
        };

        $public.setCourse = function setCourse(pathName, pathData) {
            $private.projectData[pathName] = pathData;
            return $public;
        };

        $public.getCourse = function getCourse(pathName) {
            return $private.projectData[pathName];
        };

        ///Função chamada em carregamento.js
        $public.carregamentoCompleto = function carregamentoCompleto() {
            $private.carregamentoInitComplete();
        }

        $public.createBase = function createBase(complete) {
            $public.getComponente("base").create(complete);
        }

        $public.liberarNavegacao = function liberarNavegacao() {
            $public.getComponente("base").liberarNavegacao();
        }

        $public.callModal = function callModal(url, _containerTela) {
            $public.getComponente("base").callModal(url, _containerTela);
        }

        $public.carregamento = function carregamento() {
            $public.getComponente("carregamento").carregar();
        }

        $public.motion = function motion(_status) {
            $public.getComponente("motion").call(_status);
        }

        $public.scorm_get_suspendData = function scorm_get_suspendData(variable) {
            return $public.getComponente("scorm").getSuspendata(variable);
        }

        $public.scorm_set_suspendData = function scorm_set_suspendData(variable, value) {
            $public.getComponente("scorm").setSuspendata(variable, value);
        }

        $public.scorm_get_lessonLocation = function scorm_get_lessonLocation(variable) {
            return $public.getComponente("scorm").getLessonLocation(variable);
        }

        $public.scorm_set_lessonLocation = function scorm_set_lessonLocation(variable, value) {
            $public.getComponente("scorm").setLessonLocation(variable, value);
        }

        $public.scorm_set_score = function scorm_set_score(raw) {
            $public.getComponente("scorm").setScore(raw);
        }

        $public.scorm_get_score = function scorm_get_score() {
            return $public.getComponente("scorm").getScore();
        }

        $public.scorm_set_interactions = function scorm_set_interactions(indice, correto, resposta, tipo, tempoGasto, pesoDado) {
            $public.getComponente("scorm").setInteractions(indice, correto, resposta, tipo, tempoGasto, pesoDado); //_indice, correto, resposta, _tipo, _tempoGasto, _pesoDado
        }

        $public.scorm_set_status_lesson = function scorm_set_status_lesson(_status) {
            $public.getComponente("scorm").setStatusLesson(_status)
        }

        $public.scorm_get_status_lesson = function scorm_get_status_lesson() {
            return $public.getComponente("scorm").getStatusLesson()
        }

        $public.getInteractionsCount = function getInteractionsCount() {
            return $public.getComponente("scorm").getInteractionsCount();
        }

        $public.sairScorm = function sairScorm() {
            $public.getComponente("scorm").sairScorm();
        }

        $public.completeScorm = function completeScorm() {
            $public.getComponente("scorm").completeScorm();
        }

        $public.resetSuspendata = function resetSuspendata() {
            $public.getComponente("scorm").resetSuspendata();
        }

        $public.resetLessonLocation = function resetLessonLocation() {

            $.each($public.config, function(indice, item) {
                item.visivel = false;
                if (item.avancar == 0.1) {
                    item.avancar = -1;
                }
                var page = item;
                var id = String(page.id).toUpperCase();
                var _container = $(".container" + id);
                _container.find(".setaDirBase").css("display", "none");
                _container.find(".setaDirBase").removeClass("Ativada");
                var element = _container.find(".setaDirBase .icoSet");
                element.addClass("fadeIn");
            });


            $public.getComponente("scorm").resetLessonLocation();
        }


        $public.resetAll = function resetAll() {
            $public.getComponente("scorm").resetAll();
        }

        $public.sair = function sair() {
            $public.getComponente("base").sair();
        }

        $public.telaEvent = function telaEvent(telaCurrent, call) {
            var param = { id: telaCurrent }
            if (call.screenInit)
                call.screenInit(param);

            $("body").on('navegacaoComplete', function() {

                $public.idTela = $public.config[$public.indice].id;
                var id = String($public.idTela).toUpperCase();
                var _containerTela = $(".container" + id);

                var param = {
                    id: $public.idTela,
                    init: (_containerTela.attr("statusTela")) ? false : true,
                    container: _containerTela
                };

                if (call.screenSwitch)
                    call.screenSwitch(param);

                if (($public.config[$public.indice].id).toUpperCase() == (telaCurrent).toUpperCase()) {

                    param.init = (_containerTela.attr("statusTela")) ? false : true; // Verifica se foi a primmeiro vez
                    _containerTela.attr("statusTela", true); /// avisa que foi a primeira vez.

                    if (call.screenCurrent)
                        call.screenCurrent(param);

                }
            })
        }



        //=============================================================
        // CONTROLES
        //=============================================================    

        //////////////////////////////// 
        //       INIT XML             //
        ////////////////////////////////

        $private.initXML = function initXML() {
            require(["utils/xml/xmlLoader"], function(module) {
                module.init($public);
                module.create(function() {
                    $private.initScorm();
                });
            });
        };

        //////////////////////////////// 
        //       SCORM                //
        ////////////////////////////////


        $private.initScorm = function initScorm() {
            require(["utils/scorm/scorm"], function(module) {
                module.init($public);
                module.create(function() {
                    $private.initBase();
                    $private.initSpeed();
                });

                $public.setComponente("scorm", module);
            });
        }

        //////////////////////////////// 
        //       SPEED                //
        ////////////////////////////////

        $private.initSpeed = function initSpeed() {
            if ($public.speed) {
                require(["componentes/speed"], function(module) {
                    module.init($public);
                });
            }
        }


        //////////////////////////////// 
        //       NAVEGACAO            //
        ////////////////////////////////

        $private.initBase = function initBase() {
            require(["componentes/base"], function(module) {
                module.init($public);
                $public.setComponente("base", module);
                $private.initNav();
            });
        }

        $private.initNav = function initNav() {

            require(["utils/navegacao/carregamento"], function(module) {
                module.init($public);
                $public.setComponente("carregamento", module);
            });

            require(["utils/navegacao/motion"], function(module) {
                module.init($public);
                $public.setComponente("motion", module);
            });

            require(["utils/navegacao/navegacao"], function(module) {
                module.init($public);
                module.create();
                $public.setComponente("navegacao", module);
            });

            require(["componentes/info"], function(module) {
                module.init($public);
                module.create();
                $public.setComponente("info", module);
            });


        }


        $private.carregamentoInitComplete = function carregamentoInitComplete() {
            $("#loading").css("display", "none");
            $public.bodyIframe.preloaderComplete();

            //Iniciar após o carregamento inicial
            $("body").attr("nav", "init");
            $("body").trigger("navegacao");

        }


        return $public;
    };

    return course();
});