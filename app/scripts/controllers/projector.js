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

    ProjectorController.$inject = ['$q', '$filter', /*'AuthenticationService', 'SessionService',*/ '$location', '$rootScope', "EventService"];
    function ProjectorController($q, $filter, /*AuthenticationService, SessionService,*/ $location, $rootScope, EventService) {

    	var projectorCtrl = this;

        projectorCtrl.acertar = acertar;

        console.log("--->ProjectorController init");

        $("body").removeClass("bodyLogin");
        $(".header").hide();
        $("body").css("overflow-y", "hidden");
        $(".content").css("top", "0px");

        projectorCtrl.classes = [
            [
                {
                    ppg: "ppg-first",
                    parent: "parent-group-first",
                    pin: "one-yellow"
                },
                {
                    ppg: "ppg-first",
                    parent: "parent-group-first active-first",
                    pin: "one-yellow"
                },
                {
                    ppg: "ppg-second",
                    parent: "parent-group-second",
                    pin: "two-yellow"
                },
                {
                    ppg: "ppg-second",
                    parent: "parent-group-second active-second",
                    pin: "two-yellow"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third",
                    pin: "three-blue"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third",
                    pin: "three-blue"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third-two",
                    pin: "three-blue"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third-three",
                    pin: "three-blue"
                },
                {
                    ppg: "ppg-fourth",
                    parent: "parent-group-fourth",
                    pin: "four-yellow"
                }
            ],
            [
                {
                    ppg: "ppg-first",
                    parent: "parent-group-first",
                    pin: "one-blue"
                },
                {
                    ppg: "ppg-first",
                    parent: "parent-group-first active-first",
                    pin: "one-blue"
                },
                {
                    ppg: "ppg-second",
                    parent: "parent-group-second",
                    pin: "two-blue"
                },
                {
                    ppg: "ppg-second",
                    parent: "parent-group-second active-second",
                    pin: "two-blue"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third",
                    pin: "three-red"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third",
                    pin: "three-red"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third-two",
                    pin: "three-red"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third-three",
                    pin: "three-red"
                },
                {
                    ppg: "ppg-fourth",
                    parent: "parent-group-fourth",
                    pin: "four-blue"
                }

            ],
            [
                {
                    ppg: "ppg-first",
                    parent: "parent-group-first",
                    pin: "one-red"
                },
                {
                    ppg: "ppg-first",
                    parent: "parent-group-first active-first",
                    pin: "one-red"
                },
                {
                    ppg: "ppg-second",
                    parent: "parent-group-second",
                    pin: "two-red"
                },
                {
                    ppg: "ppg-second",
                    parent: "parent-group-second active-second",
                    pin: "two-red"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third",
                    pin: "three-green"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third",
                    pin: "three-green"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third-two",
                    pin: "three-green"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third-three",
                    pin: "three-green"
                },
                {
                    ppg: "ppg-fourth",
                    parent: "parent-group-fourth",
                    pin: "four-red"
                }

            ],
            [
                {
                    ppg: "ppg-first",
                    parent: "parent-group-first",
                    pin: "one-green"
                },
                {
                    ppg: "ppg-first",
                    parent: "parent-group-first active-first",
                    pin: "one-green"
                },
                {
                    ppg: "ppg-second",
                    parent: "parent-group-second",
                    pin: "two-green"
                },
                {
                    ppg: "ppg-second",
                    parent: "parent-group-second active-second",
                    pin: "two-green"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third",
                    pin: "three-yellow"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third",
                    pin: "three-yellow"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third-two",
                    pin: "three-yellow"
                },
                {
                    ppg: "ppg-third",
                    parent: "parent-group-third active-third-three",
                    pin: "three-yellow"
                },
                {
                    ppg: "ppg-fourth",
                    parent: "parent-group-fourth",
                    pin: "four-green"
                }

            ]
        ];

        var boardMap = [];

        var codEvento = 10;

        $rootScope.dataLoading = true;

        $q.all([
            EventService.getEventGroups(codEvento).then(getEventGroupsSuccess, getEventGroupsFailure),
            EventService.getEventSubjects(codEvento).then(getEventSubjectsSuccess, getEventSubjectsFailure)
        ]).then(function(response){
            console.log(response);
        }).finally(function(){
            // Close dataLoading after all requests are finished
            $rootScope.dataLoading = false;
        });

        function getEventGroupsSuccess(response){
            console.log("Grupos do evento: " + codEvento);
            console.log(response);

            angular.forEach(response, function(group, key){
                group.Grupo.codAssunto = group.Assunto.codAssunto;
                group.Grupo.hit = key + 1;

                positionGroup(group);
                // if(key == 0){
                // }
            });

            projectorCtrl.groups = response;
        }

        function getEventGroupsFailure(response){
            console.log("Grupos do evento: " + codEvento);
            console.log(response);
        }

        function getEventSubjectsSuccess(response){
            console.log("Assuntos do evento: " + codEvento);
            console.log(response);

            //Ordenação dos assuntos pelo id
            projectorCtrl.subjects = $filter('orderBy')(response, 'codAssunto');

            console.log("Assuntos ordenados:", projectorCtrl.subjects);

            angular.forEach(projectorCtrl.subjects, function(subject, key){
                boardMap[subject.codAssunto.toString()] = projectorCtrl.classes[key];
            });

            console.log(boardMap);

            // projectorCtrl.groups = response;
        }

        function getEventSubjectsFailure(response){
            console.log("Assuntos do evento: " + codEvento);
            console.log(response);
        }

        function positionGroup(group){

            // console.log("Tentativa: ", boardMap[group.Grupo.codAssunto.toString()][group.Grupo.hit].ppg);

            var group = '<div id="ppg-group' + group.Grupo.codGrupo + '" class="easy '+ boardMap[group.Grupo.codAssunto.toString()][group.Grupo.hit].ppg +'">' +
                            '<div id="parent-group' + group.Grupo.codGrupo + '" class="easy '+ boardMap[group.Grupo.codAssunto.toString()][group.Grupo.hit].parent +'">' +
                                '<div id="pin-group' + group.Grupo.codGrupo + '" class="easy '+ boardMap[group.Grupo.codAssunto.toString()][group.Grupo.hit].pin +'">' +
                                    '<img class="pino" src="images/pino.png" alt="Pino">' +
                                ' </div>' +
                            ' </div>' +
                        ' </div>';

            $(".svg").append(group);
        }

        function acertar(codGrupo){
            angular.forEach(projectorCtrl.groups, function(group, key){
               if (group.Grupo.codGrupo == codGrupo){
                    console.log("Clicou para acertar no grupo: ", group.Grupo.codGrupo);
                    if(group.Grupo.hit < 8){
                        group.Grupo.hit++;
                        positionGroupOnHit(codGrupo);                        
                    }
               } 
            });
        }

        function positionGroupOnHit(codGrupo){
            angular.forEach(projectorCtrl.groups, function(group, key){
               if (group.Grupo.codGrupo == codGrupo){
                    $("#ppg-group" + codGrupo).removeClass(boardMap[group.Grupo.codAssunto.toString()][group.Grupo.hit - 1].ppg);
                    $("#parent-group" + codGrupo).removeClass(boardMap[group.Grupo.codAssunto.toString()][group.Grupo.hit - 1].parent);
                    $("#pin-group" + codGrupo).removeClass(boardMap[group.Grupo.codAssunto.toString()][group.Grupo.hit - 1].pin);

                    $("#ppg-group" + codGrupo).addClass(boardMap[group.Grupo.codAssunto.toString()][group.Grupo.hit].ppg);
                    $("#parent-group" + codGrupo).addClass(boardMap[group.Grupo.codAssunto.toString()][group.Grupo.hit].parent);
                    $("#pin-group" + codGrupo).addClass(boardMap[group.Grupo.codAssunto.toString()][group.Grupo.hit].pin);

                    // // $("#ppg-group" + codGrupo).toggleClass(boardMap[group.Grupo.codAssunto.toString()][group.Grupo.hit - 1].ppg, 4000, "easeOutSine");
                    // // $("#parent-group" + codGrupo).toggleClass(boardMap[group.Grupo.codAssunto.toString()][group.Grupo.hit - 1].parent, 4000, "easeOutSine");
                    // $("#pin-group" + codGrupo).toggleClass(boardMap[group.Grupo.codAssunto.toString()][group.Grupo.hit - 1].pin, 4000, "easeOutSine");
               } 
            });            
        }

    }