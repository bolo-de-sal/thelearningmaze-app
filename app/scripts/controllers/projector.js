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

    ProjectorController.$inject = ['$scope', '$routeParams', '$q', '$filter', /*'AuthenticationService', 'SessionService',*/ '$location', '$rootScope', "EventService", "GroupService", "$timeout"];
    function ProjectorController($scope, $routeParams, $q, $filter, /*AuthenticationService, SessionService,*/ $location, $rootScope, EventService, GroupService, $timeout){


        var projectorCtrl = this;

        // projectorCtrl.acertar = acertar;

        projectorCtrl.Questao = {
            textoQuestao: "Sem pergunta no momento"
        }
        projectorCtrl.Assunto = {
            descricao: "Sem assunto no momento"
        }
        projectorCtrl.alternativas = "";

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

        // $(".bar").click(function(){
        //     if($(".question-content").hasClass("question-open")){
        //         $(".question-content").removeClass("question-open");
        //         $(".question-content").addClass("question-close");
        //     }
        //     else{
        //         $(".question-content").removeClass("question-close");
        //         $(".question-content").addClass("question-open");
        //     }
        // });

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
            EventService.getEventCurrentGroupInfo(eventId).then(getEventCurrentGroupInfoSuccess, getEventCurrentGroupInfoFailure),
            GroupService.getGroupsByEventId(eventId)
        ]).then(function(response){
            console.log(response);
            projectorCtrl.groupsInfo = response[3];
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

        // function acertar(codGrupo){
        //     angular.forEach(projectorCtrl.groups, function(group, key){
        //        if (group.Grupo.codGrupo == codGrupo){
        //             console.log("Clicou para acertar no grupo: ", group.Grupo.codGrupo);
        //             if(group.Acertos < 8){
        //                 group.Acertos++;
        //                 positionGroupOnHit(codGrupo);                        
        //             }
        //        } 
        //     });
        // }

        function positionGroupOnHit(codGrupo, acertos){
            angular.forEach(projectorCtrl.groups, function(group, key){
                // console.log("Antes do if positionGroupOnHit.");
                // console.log("Grupo: ", group.Grupo.codGrupo);
                // console.log("codGroup: ", codGrupo);
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
                        // alert(qtdInPos + " grupos na posição: " + projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos].pos);                        
                    }

                    // // $("#ppg-group" + codGrupo).toggleClass(projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos - 1].ppg, 4000, "easeOutSine");
                    // // $("#parent-group" + codGrupo).toggleClass(projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos - 1].parent, 4000, "easeOutSine");
                    // $("#pin-group" + codGrupo).toggleClass(projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos - 1].pin, 4000, "easeOutSine");
               } 
            });            
        }

        function focusCurrentElement(){
            var codCurrentGroup = null;

            if(projectorCtrl.currentGroupInfo != undefined){
                codCurrentGroup = projectorCtrl.currentGroupInfo.Grupo.codGrupo;
            }

            angular.forEach(projectorCtrl.groups, function(group, key){
                // console.log("Antes do if.");
                // console.log("Grupo: ", group.Grupo.codGrupo);
                // console.log("codCurrentGroup: ", codCurrentGroup);
                if(group.Grupo.codGrupo == codCurrentGroup){

                    var pos = projectorCtrl.boardMap[group.Grupo.codAssunto.toString()][group.Acertos].pos;

                    $(".svg .color").removeClass("active");
                    $("." + pos).addClass("active");

                    // console.log("Entrou if currentElement");
                    // console.log("Posição: ", pos);
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

        function adjustHits(codGrupo, hits){
            angular.forEach(projectorCtrl.groups, function(group, key){
                if(group.Grupo.codGrupo == codGrupo){
                    group.Acertos = hits;
                }
            });
        }

        function callbackOnQuestionResponse(result){

            $rootScope.dataLoading = true;

            $(".question-content").removeClass("question-open");
            $(".question-content").addClass("question-close"); 

            EventService.getEventCurrentGroupInfo(eventId).then(function(response){

                $rootScope.dataLoading = false;

                var currentGroup = response;
                
                var codGrupo = projectorCtrl.currentGroupInfo.Grupo.codGrupo;
                var codAssunto = projectorCtrl.currentGroupInfo.Grupo.codAssunto;

                if(result.acertou){
                    adjustHits(codGrupo, result.acertos);
                    if(!result.campeao){
                        // $('.modal-question.hit').removeClass('modal-hide');
                        // $('.modal-question.hit').addClass('modal-show');

                        projectorCtrl.hitShow = true;

                        var audio = new Audio('sounds/success.mp3');
                        audio.play();

                        $timeout(function(){
                            positionGroupOnHit(codGrupo, result.acertos);
                            // focusCurrentElement();
                        }, 3000);                  
                    }
                    else{
                        // $('.modal-winner').removeClass('modal-hide');                        
                        // $('.modal-winner').addClass('modal-show');

                        projectorCtrl.winnerShow = true;

                        EventService.CloseEvent(eventId).then(function(response){
                            cnosole.log('Response closeEvent: ', response);
                        }, function(err){
                            cnosole.log('Error closeEvent: ', err);
                        });
                    }
                }
                else{
                    // $('.modal-question.error').removeClass('modal.hide');
                    // $('.modal-question.error').addClass('modal-show');

                    projectorCtrl.errorShow = true;

                    var audio = new Audio('sounds/error.mp3');
                    audio.play();
                }

                $timeout(function(){
                    // $('.modal-question').removeClass('modal-show').addClass('modal-hide');
                    projectorCtrl.hitShow = false;
                    projectorCtrl.errorShow = false;
                
                    // positionGroupOnHit(codGrupo);

                    projectorCtrl.currentGroupInfo = currentGroup;

                    if(!result.campeao){                        
                        focusCurrentElement();
                    }

                }, 3000);

                // var oldPosition = projectorCtrl.boardMap[codAssunto][result.acertos].pos;

            });
        }

        // projectorCtrl.timerFinished = function(){
        //     if(studentCtrl.enabledSendAnsawer){
        //         studentCtrl.sendSelectedAnsawer('', 0, false, true);
        //     }
        // }

        $rootScope.evento.client.joinEvento = function (group) {

        }

        $rootScope.evento.client.iniciarJogo = function () {
          console.log("## JOGO INICIADO ##");
          // updateStudentInfo(function(){
          //   studentCtrl.gameStarted = true;
          // });
        }

        $rootScope.evento.client.lancarPergunta = function(response){
            console.log("Perugnta lançada: ", response);

            projectorCtrl.Questao = response.Questao;
            projectorCtrl.Assunto = response.Assunto;
            projectorCtrl.Alternativas = response.Alternativas;
            $scope.$apply();

            console.log("Chamou lancarPergunta");
            // alert('Chamou o lancarPergunta');
            
            $(".question-content").removeClass("question-close");
            $(".question-content").addClass("question-open");
        }

        projectorCtrl.timerRunning = true;
        projectorCtrl.timerConsole = '';
        projectorCtrl.timerType = '';

        $rootScope.evento.client.responderPergunta = function(acertou, campeao, codGrupoCampeao, acertos){

            var response = {
                acertou: acertou,
                campeao: campeao,
                codGrupoCampeao: codGrupoCampeao,
                acertos: acertos
            }

            console.log("Chamou responderPergunta", response);

            $scope.$broadcast('timer-stop');

            var timer = document.getElementById('timer-question');

            $timeout(function() {
               projectorCtrl.countdown = 0;
               $scope.$apply();
               timer.stop();
               timer.reset();
               projectorCtrl.timerRunning = true;
            });

            // alert('Chamou o responderPergunta');

            callbackOnQuestionResponse(response);
        }

        $rootScope.evento.client.ativarTimer = function (time) {
            console.log("## TIMER ATIVADO ##");

            console.log("time: ", time);

            $scope.$broadcast('timer-start');

            projectorCtrl.countdown = time;

            if(!$scope.$$phase){
                $scope.$apply();
            }

            var timer = document.getElementById('timer-question');
            timer.reset();

            $timeout(function(){
                timer.start();

                $scope.$on('timer-tick', function (event, args) {
                    projectorCtrl.timerConsole += projectorCtrl.timerType  + ' - event.name = '+ event.name + ', timeoutId = ' + args.timeoutId + ', millis = ' + args.millis +'\n';
                });
            }, 200);
        }

        $.connection.hub.stop();

        // Abre conexão com o servidor
        $.connection.hub.start().done(function (response) {
            $rootScope.evento.server.joinEventoProfessor(eventId);
            console.log("SignalR connection success", response);
        }).fail(function (reason) {
            console.log("SignalR connection failed: " + reason);
        });

    }