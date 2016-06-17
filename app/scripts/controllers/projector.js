'use strict';

/**
 * @ngdoc function
 * @name thelearningmaze.controller:ProjectorController
 * @description
 * # ProjectorController
 * Controller of the thelearningmaze
 */
angular
    .module('thelearningmaze')
    .controller('ProjectorController', ProjectorController);

    ProjectorController.$inject = ['$routeParams', '$q', '$filter', /*'AuthenticationService', 'SessionService',*/ '$location', '$rootScope', "EventService"];
    function ProjectorController($routeParams, $q, $filter, /*AuthenticationService, SessionService,*/ $location, $rootScope, EventService) {

    	var projectorCtrl = this;

        projectorCtrl.acertar = acertar;

        console.log("--->ProjectorController init");

        $("body").removeClass("bodyLogin");
        $(".header").hide();
        $("body").css("overflow-y", "hidden");
        $(".content").css("top", "0px");
        $(".content").css("padding", "0px");

        //Adaptando tamanho dos elementos do tabuleiro

        $(window).resize(function(){
            setZoom();
        });

        function setZoom(){
            var svg = $(".svg svg").css("width");

            var qtdZoom = svg.replace("px", "") / 600;

            console.log(svg);
            console.log(qtdZoom);
            // console.log(qtdZoom);

            $(".ppg-first, .ppg-second, .ppg-third, .ppg-fourth").css("zoom", qtdZoom);
        }

        //End Adaptando tamanho dos elementos do tabuleiro

        //Toggle question content

        $(".bar").click(function(){
            if($(".question-content").hasClass("question-open")){
                $(".question-content").removeClass("question-open");
                $(".question-content").addClass("question-close");
            }
            else{
                $(".question-content").removeClass("question-close");
                $(".question-content").addClass("question-open");
            }
        });

        //End Toggle question content

        projectorCtrl.classes = [
            [
                {
                    ppg: "ppg-first",
                    parent: "parent-group-first",
                    pin: "one-yellow",
                    pos: "first-one"
                },
                {
                    ppg: "ppg-first",
                    parent: "parent-group-first active-first",
                    pin: "one-yellow",
                    pos: "first-two"
                },
                {
                    ppg: "ppg-second",
                    parent: "parent-group-second move",
                    pin: "two-yellow",
                    pos: "second-two"
                },
                {
                    ppg: "ppg-second",
                    parent: "parent-group-second active-second",
                    pin: "two-yellow",
                    pos: "second-one"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third",
                    pin: "three-blue",
                    pos: "third-one"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third",
                    pin: "three-blue",
                    pos: "third-two"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third-two",
                    pin: "three-blue",
                    pos: "third-three"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third-three",
                    pin: "three-blue",
                    pos: "third-four"
                },
                {
                    ppg: "ppg-fourth",
                    parent: "parent-group-fourth",
                    pin: "four-yellow",
                    pos: "fourth-four"
                }
            ],
            [
                {
                    ppg: "ppg-first",
                    parent: "parent-group-first",
                    pin: "one-blue",
                    pos: "first-three"
                },
                {
                    ppg: "ppg-first",
                    parent: "parent-group-first active-first",
                    pin: "one-blue",
                    pos: "first-four"
                },
                {
                    ppg: "ppg-second",
                    parent: "parent-group-second move",
                    pin: "two-blue",
                    pos: "second-four"
                },
                {
                    ppg: "ppg-second",
                    parent: "parent-group-second active-second",
                    pin: "two-blue",
                    pos: "second-three"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third",
                    pin: "three-red",
                    pos: "third-two"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third",
                    pin: "three-red",
                    pos: "third-three"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third-two",
                    pin: "three-red",
                    pos: "third-four"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third-three",
                    pin: "three-red",
                    pos: "third-one"
                },
                {
                    ppg: "ppg-fourth",
                    parent: "parent-group-fourth",
                    pin: "four-blue",
                    pos: "fourth-one"
                }

            ],
            [
                {
                    ppg: "ppg-first",
                    parent: "parent-group-first",
                    pin: "one-red",
                    pos: "first-five"
                },
                {
                    ppg: "ppg-first",
                    parent: "parent-group-first active-first",
                    pin: "one-red",
                    pos: "first-six"
                },
                {
                    ppg: "ppg-second",
                    parent: "parent-group-second",
                    pin: "two-red",
                    pos: "second-six"
                },
                {
                    ppg: "ppg-second",
                    parent: "parent-group-second active-second",
                    pin: "two-red",
                    pos: "second-five"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third",
                    pin: "three-green",
                    pos: "third-three"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third",
                    pin: "three-green",
                    pos: "third-four"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third-two",
                    pin: "three-green",
                    pos: "third-one"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third-three",
                    pin: "three-green",
                    pos: "third-two"
                },
                {
                    ppg: "ppg-fourth",
                    parent: "parent-group-fourth",
                    pin: "four-red",
                    pos: "fourth-two"
                }

            ],
            [
                {
                    ppg: "ppg-first",
                    parent: "parent-group-first",
                    pin: "one-green",
                    pos: "first-seven"
                },
                {
                    ppg: "ppg-first",
                    parent: "parent-group-first active-first",
                    pin: "one-green",
                    pos: "first-eight"
                },
                {
                    ppg: "ppg-second",
                    parent: "parent-group-second",
                    pin: "two-green",
                    pos: "second-eight"
                },
                {
                    ppg: "ppg-second",
                    parent: "parent-group-second active-second",
                    pin: "two-green",
                    pos: "second-seven"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third",
                    pin: "three-yellow",
                    pos: "third-four"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third",
                    pin: "three-yellow",
                    pos: "third-one"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third-two",
                    pin: "three-yellow",
                    pos: "third-two"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third-three",
                    pin: "three-yellow",
                    pos: "third-three"
                },
                {
                    ppg: "ppg-fourth",
                    parent: "parent-group-fourth",
                    pin: "four-green",
                    pos: "fourth-three"
                }

            ]
        ];

        projectorCtrl.boardMap = [];

        // var codEvento = 10;
        var eventId = $routeParams.eventId;

        $rootScope.dataLoading = true;

        $q.all([
            EventService.getEventGroups(eventId).then(getEventGroupsSuccess, getEventGroupsFailure),
            EventService.getEventThemes(eventId).then(getEventSubjectsSuccess, getEventSubjectsFailure),
            EventService.getEventCurrentGroupInfo(eventId).then(getEventCurrentGroupInfoSuccess, getEventCurrentGroupInfoFailure)            
        ]).then(function(response){
            console.log(response);
        }).finally(function(){
            // Close dataLoading after all requests are finished
            $rootScope.dataLoading = false;
            animateBoard();
            // focusCurrentElement();
        });

        function getEventGroupsSuccess(response){
            console.log("Grupos do evento: " + eventId);
            console.log(response);

            // angular.forEach(response, function(group, key){
            //     group.Grupo.codAssunto = group.Assunto.codAssunto;
            //     // group.Acertos = key + 1;

            //     positionGroup(group);
            //     // if(key == 0){
            //     // }
            // });

            projectorCtrl.groups = response;
        }

        function getEventGroupsFailure(response){
            console.log("Grupos do evento: " + eventId);
            console.log(response);
        }

        function getEventSubjectsSuccess(response){
            console.log("Assuntos do evento: " + eventId);
            console.log(response);

            //Ordenação dos assuntos pelo id
            projectorCtrl.subjects = $filter('orderBy')(response, 'codAssunto');

            console.log("Assuntos ordenados:", projectorCtrl.subjects);

            angular.forEach(projectorCtrl.subjects, function(subject, key){
                projectorCtrl.boardMap[subject.codAssunto.toString()] = projectorCtrl.classes[key];
            });

            console.log(projectorCtrl.boardMap);

            // projectorCtrl.groups = response;
        }

        function getEventSubjectsFailure(response){
            console.log("Assuntos do evento: " + eventId);
            console.log(response);
        }

        function getEventCurrentGroupInfoSuccess(response){
            console.log("Info grupo atual do evento: " + eventId);
            console.log(response);
            projectorCtrl.currentGroupInfo = response;
        }

        function getEventCurrentGroupInfoFailure(response){
            console.log("Info grupo atual do evento: " + eventId);
            console.log(response);
        }

        function positionGroups(){

            angular.forEach(projectorCtrl.groups, function(group, key){
                group.Grupo.codAssunto = group.Assunto.codAssunto;

                    // console.log("Tentativa: ", projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos].ppg);

                    group.pos = projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos].pos;

                    var group = '<div id="ppg-group' + group.Grupo.codGrupo + '" class="easy '+ projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos].ppg +'">' +
                                    '<div id="parent-group' + group.Grupo.codGrupo + '" class="easy '+ projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos].parent +'">' +
                                        '<div id="pin-group' + group.Grupo.codGrupo + '" class="easy '+ projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos].pin +'">' +
                                            '<img class="pino" src="images/pino.png" alt="Pino">' +
                                        ' </div>' +
                                    ' </div>' +
                                ' </div>';

                    $(".svg").append(group);                
                
            });

            setZoom();

        }

        function acertar(codGrupo){
            angular.forEach(projectorCtrl.groups, function(group, key){
               if (group.Grupo.codGrupo == codGrupo){
                    console.log("Clicou para acertar no grupo: ", group.Grupo.codGrupo);
                    if(group.Acertos < 8){
                        group.Acertos++;
                        positionGroupOnHit(codGrupo);                        
                    }
               } 
            });
        }

        function positionGroupOnHit(codGrupo){
            angular.forEach(projectorCtrl.groups, function(group, key){
               if (group.Grupo.codGrupo == codGrupo){
                    var qtdInPos = 1;

                    group.pos = projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos].pos;

                    $("#ppg-group" + codGrupo).removeClass(projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos - 1].ppg);
                    $("#parent-group" + codGrupo).removeClass(projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos - 1].parent);
                    $("#pin-group" + codGrupo).removeClass(projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos - 1].pin);

                    $("#ppg-group" + codGrupo).addClass(projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos].ppg);
                    $("#parent-group" + codGrupo).addClass(projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos].parent);
                    $("#pin-group" + codGrupo).addClass(projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos].pin);

                    angular.forEach(projectorCtrl.groups, function(group2, key2){
                        if(group.Grupo.codGrupo != group2.Grupo.codGrupo){
                            if(group.pos == group2.pos){
                                qtdInPos++;
                                console.log("qtdInPos: ", qtdInPos);
                            }                            
                        }
                    });

                    if(qtdInPos > 1){
                        alert(qtdInPos + " grupos na posição: " + projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos].pos);                        
                    }

                    // // $("#ppg-group" + codGrupo).toggleClass(projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos - 1].ppg, 4000, "easeOutSine");
                    // // $("#parent-group" + codGrupo).toggleClass(projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos - 1].parent, 4000, "easeOutSine");
                    // $("#pin-group" + codGrupo).toggleClass(projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos - 1].pin, 4000, "easeOutSine");
               } 
            });            
        }

        function focusCurrentElement(){
            var codCurrentGroup = projectorCtrl.currentGroupInfo.Grupo.codGrupo;

            angular.forEach(projectorCtrl.groups, function(group, key){
                if(group.Grupo.codGrupo == codCurrentGroup){

                    var pos = projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos].pos;

                    $(".svg .color").removeClass("active");
                    $("." + pos).addClass("active");

                    console.log("Entrou if currentElement");
                    console.log("Posição: ", pos);
                }
            });
        }

        function animateBoard(){
            $("#first-layer").addClass("first-layer");
            $("#second-layer").addClass("second-layer");
            $("#third-layer").addClass("third-layer");
            $("#fourth-layer").addClass("fourth-layer");

            $("#first-layer").bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
                focusCurrentElement();
                positionGroups();
            });
        }

        // Habilita CORS
        jQuery.support.cors = true;

        // // Declara endereço do servidor
        $.connection.hub.url = "http://tlm-api-dev.azurewebsites.net/signalr";

        // // chatHub é o nome do Hub definido no código do server
        var evento = $.connection.eventoHub;
        
        $.connection.hub.logging = true;

        evento.client.joinEvento = function (message) {
            console.log("Chamou joinEvento", message);
            alert('Alguém entrou no lobby. Mensagem SignalR: ');
        }

        // Abre conexão com o servidor
        $.connection.hub.start().done(function (response) {
            evento.server.joinEvento(25, 2);
            console.log("SignalR connection success", response);
        }).fail(function (reason) {
            console.log("SignalR connection failed: " + reason);
        });

        // $(document).ready(function () {
        //     var query = window.location.search;
        //     var toRemove = '?id=';
        //     var gorge = query.replace(toRemove, '');
        //     // Proxy created on the fly
        //     var hub = $.connection.chatHub;
        //     $.connection.hub.qs = "Id=" + gorge;
        //     // Start the connection
        //     $.connection.hub.start(function () {
        //         //chat.server.getAllOnlineStatus();
        //     });
        // });

        // $(document).ready(function () {
        //     var query = window.location.search;
        //     var toRemove = '?id=';
        //     var gorge = query.replace(toRemove, '');
        //     // Proxy created on the fly
        //     var hub = $.connection.chatHub2;
        //     $.connection.hub.qs = "Id=" + gorge;

        //     hub.client.foo = function() {};
        //     // Start the connection
        //     $.connection.hub.start(function () {
        //         //chat.server.getAllOnlineStatus();
        //     });
        // });

    }