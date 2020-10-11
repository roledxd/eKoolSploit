pmainPH.isHeadmaster = function(){return true;};
pmainPH.isSocialWorkerProfile = function(){return true;};
pmainPH.isStudentProfile = function(){return true;};
pmainPH.isFormFormmasterForStudent = function(){return true;};
pmainPH.isFormmasterForStudent = function(){return true;};
pmainPH.rights = {"isAdmin":true,"isHeadMaster":true,"isTeacherRole":true,"isFormMaster":true}
pmainPH.showDash = function(d, f, g, b, e, a, c) {
    if (typeof c == "undefined") {
        c = {};
    }
    $LAB.script(chelperPH.resourcedir + "p/prof/js/rolesPH.js").wait(function() {
        if (e) {
            pmainPH.viewMode = e;
        } else {
            pmainPH.viewMode = 0;
        }
        if (e == 0) {
            chelperPH.loadTemplateHidd(chelperPH.resourcedir + "p/main/tpl/dashboard.html", function() {});
            chelperPH.loadTemplateHidd(chelperPH.resourcedir + "p/grades/tpl/pgrades_tpl.html", function() {});
            chelperPH.loadTemplateHidd(chelperPH.resourcedir + "p/tasks/tpl/task_tmpl.html", function() {});
            $LAB.script(chelperPH.resourcedir + "p/tasks/js/ptasksPH.js").wait(function() {});
            $LAB.script(chelperPH.resourcedir + "p/grades/js/pgradesPH.js").wait(function() {});
            $LAB.script(chelperPH.resourcedir + "p/main/js/feedPH.js").wait(function() {});
            $LAB.script(chelperPH.resourcedir + "p/main/js/dashJournalMessage.js").wait(function() {});
        }
        pmainPH.instId = b;
        pmainPH.person = d;
        pmainPH.context = f;
        pmainPH.rights = {"isAdmin":true,"isHeadMaster":true,"isTeacherRole":true,"isFormMaster":true};
        var l = true;
        if (guserPH.userGroupHash != null) {
            var j = guserPH.userGroupHash.values();
            for (var k = 0; k < j.length; k++) {
                ccachePH.absenceTypeList(j[k].id, function(i) {});
            }
        }
        if (pmainPH.context == CONTEXT.ME) {
            rolesPH.currentRoles = [];
        } else {
            if (pmainPH.context == CONTEXT.SCHOOL) {
                rolesPH.setRoles(pmainPH.person.roles);
                rolesPH.initRolesData(true, pmainPH.person.id, pmainPH.onProfileSaveFunc);
            }
        }
        chelperPH.loadTemplateHidd(chelperPH.resourcedir + "p/main/tpl/main_tpl.html", function() {
            $LAB.script(chelperPH.resourcedir + "p/main/js/pmaindashPH.js").wait(function() {
                $LAB.script(chelperPH.resourcedir + "p/prof/js/pprofPH.js").wait(function() {
                    $LAB.script(chelperPH.resourcedir + "p/prof/js/pprofilePH.js").wait(function() {
                        $LAB.script(chelperPH.resourcedir + "p/prof/js/registerPersonDataPH.js").wait(function() {
                            var D = null;
                            var A = false;
                            if (pmainPH.context == CONTEXT.ME || pmainPH.context == CONTEXT.THIRD) {
                                A = true;
                                $("maincontainer").addClassName("PR320");
                            } else {
                                $("maincontainer").removeClassName("PR320");
                            }
                            if (pmainPH.viewMode == 1) {
                                D = "hidden_stpl_1";
                            } else {
                                D = "hidden_stpl_3";
                            }
                            var w = TemplateEngine.parseById(D, {
                                "idPrefix": "personData",
                                "isAsideDiv": A
                            });
                            var v = "";
                            if (pmainPH.isDummy(pmainPH.person) && !(guserPH.userIsParent(pmainPH.person.id) && pmainPH.context == CONTEXT.THIRD)) {
                                v = '<div class="dummy">';
                                if ($("maincontainer") && g == "maincontainer") {
                                    $("maincontainer").addClassName("dummy");
                                }
                            } else {
                                v = '<div class="wrapper">';
                                if ($("maincontainer") && g == "maincontainer" && $("maincontainer").hasClassName("dummy")) {
                                    $("maincontainer").removeClassName("dummy");
                                }
                            }
                            v += w + "</div>";
                            $(g).update(v);
                            pmainPH.allowModify = true;
                            pmainPH.showSettingsBtn = true;
                            if (pmainPH.viewMode == 0) {
                                pmainPH.showSettingsBtn = true;
                            }
                            w = TemplateEngine.parseById("hidden_pmain_header", {
                                "person": d,
                                "showSettingsBtn": true,
                                "context": f,
                                "allowModify": true,
                                "user": guserPH.user
                            });
                            $("personDataheader").update(w);
                            if (pmainPH.context == CONTEXT.SCHOOL && $("personDatatoolbar")) {
                                var q = $$(".appactive").length > 0;
                                var m = q;
                                var C = q;
                                var t = !q;
                                var x = false;
                                if (pmainPH.journalId == null && !pmainPH.isGradesJournal && !pmainPH.isAttJournal) {
                                    x = true;
                                }
                                var r = false;
                                if (pmainPH.viewMode == 0) {
                                    var p = guserPH.userGroupHash.get(pmainPH.getCurrInst());
                                    if (p != null && p.interviewEnabled) {
                                        r = true;
                                    }
                                }
                                var n = false;
                                if (c.isActiveFormativeAssessment != null) {
                                    n = c.isActiveFormativeAssessment;
                                } else {
                                    if (typeof gmainv2PH != "undefined" && gmainv2PH.groupObj != null) {
                                        n = gmainv2PH.groupObj.isAllowedFormativeAssesment;
                                    }
                                }
                                var y = false;
                                if (pmainPH.viewMode == 0) {
                                    y = true;
                                }
                                w = TemplateEngine.parseById("hidden_p_main_toolbar_school", {
                                    "rights": {"isAdmin":true,"isHeadMaster":true,"isTeacherRole":true,"isFormMaster":true},
                                    "isStudent": true,
                                    "showSettingsBtn": true,
                                    "allowModify": true,
                                    "isAvailableMoreMenuItem": true,
                                    "isInterviewVisible": true,
                                    "isActiveFormativeAssessment": true,
                                    "isFormativeAssessmentVisible": true,
                                    "isStudyBookVisible": true,
                                    "isDocumentsVisible": true,
                                    "isSchoolNotesVisible": true,
                                    "isAnalyticsVisible": true,
                                    "studentId": c.studentId
                                });
                                $("personDatatoolbar").update(w);
                            } else {
                                if (guserPH.userIsParent(pmainPH.person.id) && pmainPH.context == CONTEXT.THIRD) {
                                    var r = true;
                                    var u = guserPH.userGetChildRolesByPerson(pmainPH.person.id);
                                    clayoutPH.initMainMenu(NAV_PARENT_SET);
                                }
                            }
                            if (typeof cmenuPH.screenId != "undefined" && cmenuPH.screenId == "g.person.show") {
                                clayoutPH.backBtnShow("#", function() {
                                    $(history).back();
                                });
                            }
                            if (pmainPH.viewMode == 0 || pmainPH.viewMode == 2) {
                                w = TemplateEngine.parseById("hidden_pmain_content", {
                                    "isAsideDiv": A,
                                    "isActiveFormativeAssessment": c.isActiveFormativeAssessment
                                });
                                $("personDatamaincontent").update(w);
                                pmaindashPH.show(d.id, pmainPH.dashFilter, f, b, pmainPH.journalId);
                            }
                            var z = null;
                            if (pmainPH.viewMode == 1) {
                                z = "personDatamaincontent";
                            } else {
                                z = "personDatainsert";
                            }
                            if (((SWFAddress.getParameter("showsettings")) && (SWFAddress.getParameter("showsettings") == 1)) || (pmainPH.viewMode == 1)) {
                                pmainPH.showsettings(z, pmainPH.viewMode);
                            }
                            if (navActive) {
                                navigateHash(NAV_PERSON_SET);
                            }
                            if (SWFAddress.getParameter("showrequest")) {
                                $LAB.script(chelperPH.resourcedir + "g/joinv2/js/gjoinv2PH.js").wait(function() {
                                    gjoinv2PH.requestConfirm();
                                });
                            }
                            var o = (window.location.host === "chucknorris.ekool.eu" || window.location.host === "vandamme.ekool.eu") ? "https://messaging-staging.ekool.eu/popup/popup-chat.js" : "https://cdn-messaging.ekool.eu/popup/popup-chat.js";
                            if (!chelperPH.isScriptLoaded(o) && guserPH.userIsStudent()) {
                                var s = document.createElement("script");
                                s.src = o;
                                document.body.appendChild(s);
                            }
                            hideLoadingIndicator("maincontainer");
                            chelperPH.callcode(a);
                        });
                    });
                });
            });
        });
    });
}
