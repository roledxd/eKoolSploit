var pmainPH = {
    foldername: "u",
    personId: null,
    person: null,
    rights: {},
    context: null,
    viewMode: 0,
    rightPlaceHolder: "person_rightcontent",
    mainPlaceHolder: null,
    dashFilter: 0,
    onProfileSaveFunc: null,
    journalId: null,
    instId: null,
    isAttJournal: false,
    isGradesJournal: false,
    isDevCardsOpenFromJournal: false,
    loadProfile: function(k, b, c, l, f, a, h, e, i, d, g, j) {
        if (a == null) {
            a = DASH_FILTER.ALL;
        }
        pmainPH.instId = c;
        if (e != null) {
            e = dwrNumber(e);
        }
        pmainPH.journalId = e;
        if (i == null) {
            i = false;
        }
        if (d == null) {
            d = false;
        }
        pmainPH.isAttJournal = i;
        pmainPH.isGradesJournal = d;
        pmainPH.onProfileSaveFunc = h;
        pmainPH.dashFilter = a;
        if (f) {
            pmainPH.viewMode = f;
        } else {
            pmainPH.viewMode = 0;
        }
        if (b == null) {
            b = CONTEXT.ME;
        }
        pmainPH.mainPlaceHolder = l;
        pmainPH.context = b;
        ccachePH.personProfile(k, b, c, function(m) {
            guserPH.isSocialWorkerForStudent(c, k, function(n) {
                var o = m.person;
                o.roles = m.roles;
                o.allRoles = m.allRoles;
                o.parents = m.parents;
                o.registerPersonList = [];
                if (b != CONTEXT.KOV) {
                    o.registerPersonList = m.registerPersonList;
                }
                pmainPH.rights.isSocialWorkerForStudent = n;
                pmainPH.showDash(m.person, b, l, c, pmainPH.viewMode, g, j);
            });
        });
    },
    show: function(a) {
        showLoadingIndicator("maincontainer");
        this.onProfileSaveFunc = null;
        pmainPH.dashFilter = null;
        pmainPH.isAttJournal = false;
        pmainPH.isGradesJournal = false;
        pmainPH.journalId = null;
        pmainPH.showDash(guserPH.user, CONTEXT.ME, "maincontainer", null, null, a);
        hideLoadingIndicator("maincontainer");
    },
    showDash: function(d, f, g, b, e, a, c) {
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
            pmainPH.rights.isAdmin = false;
            pmainPH.rights.isHeadMaster = false;
            pmainPH.rights.isTeacherRole = false;
            pmainPH.rights.isFormMaster = false;
            var l = false;
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
                    rolesPH.initRolesData(pmainPH.rights.isAdmin, pmainPH.person.id, pmainPH.onProfileSaveFunc);
                    if (rolesPH.accountTypes.indexOf(ROLES.STUDENT) != -1) {
                        l = true;
                    }
                }
            }
            if (f == CONTEXT.SCHOOL) {
                var h = guserPH.userAccountTypes(pmainPH.getCurrInst());
                if (h.indexOf(ROLES.ADMINISTRATOR) != -1) {
                    pmainPH.rights.isAdmin = true;
                }
                if (h.indexOf(ROLES.HEADMASTER) != -1) {
                    pmainPH.rights.isHeadMaster = true;
                }
                if (h.indexOf(ROLES.TEACHER) != -1) {
                    pmainPH.rights.isTeacherRole = true;
                }
                if (h.indexOf(ROLES.FORMMASTER) != -1) {
                    pmainPH.rights.isFormMaster = false;
                    pmainPH.person.roles.each(function(i) {
                        if ((i.institution.id == pmainPH.instId) && (i instanceof ee.ekool.model.roles.Student)) {
                            if (guserPH.isFormMasterForStudent(i) == true) {
                                pmainPH.rights.isFormMaster = true;
                            }
                        }
                    });
                }
                if (h.indexOf(ROLES.SOCIAL_WORKER) !== -1) {
                    pmainPH.rights.isSocialWorker = true;
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
                                pmainPH.allowModify = pprofPH.isAllowModifyContact(d, f);
                                pmainPH.showSettingsBtn = false;
                                if (pmainPH.viewMode == 0) {
                                    pmainPH.showSettingsBtn = true;
                                }
                                w = TemplateEngine.parseById("hidden_pmain_header", {
                                    "person": d,
                                    "showSettingsBtn": pmainPH.showSettingsBtn,
                                    "context": f,
                                    "allowModify": pmainPH.allowModify,
                                    "user": guserPH.user,
                                    "rights": pmainPH.rights,
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
                                        "rights": pmainPH.rights,
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
                                        var r = false;
                                        var u = guserPH.userGetChildRolesByPerson(pmainPH.person.id);
                                        if (u != null) {
                                            for (var B = 0; B < u.size(); B++) {
                                                if (u[B].institution.interviewEnabled) {
                                                    r = true;
                                                }
                                            }
                                        }
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
    },
    showPersonProfile: function() {
        if ($(pmainPH.rightPlaceHolder)) {
            $(pmainPH.rightPlaceHolder).update("");
        }
        chelperPH.loadTemplateHidd(chelperPH.resourcedir + "c/tpl/forms/formPersonProfileContacts.html", function() {
            ccachePH.statesList(function() {
                ccachePH.getEmailTypesList(function(a) {
                    ccachePH.getPhoneTypesList(function() {
                        ccachePH.getAddressTypesList(function() {
                            chelperPH.loadTemplateHidd(chelperPH.resourcedir + "p/prof/tpl/roles_tmpl.html", function() {
                                var b = $H();
                                b.set("isShowEdit", false);
                            });
                        });
                    });
                });
            });
        });
    },
    onProfileChanged: function(a) {
        pmainPH.person = a.person;
        pmainPH.person.roles = a.roles;
        pmainPH.person.parents = a.parents;
        pmainPH.person.registerPersonList = a.registerPersonList;
        if (pmainPH.context == CONTEXT.ME) {
            if (pmainPH.person.id == guserPH.user.id) {
                guserPH.user.name1 = pmainPH.person.name1;
                guserPH.user.firstname = pmainPH.person.name1;
                guserPH.user.name2 = pmainPH.person.name2;
                guserPH.user.lastname = pmainPH.person.name2;
            }
        } else {
            if (pmainPH.context == CONTEXT.SCHOOL) {
                pmainPH.showPersonProfile();
            }
        }
    },
    toggleSettings: function(b, a) {
        if ($("personDatainsert")) {
            if ($("personDatainsert").visible()) {
                if (a) {
                    var d = SWFAddress.getParameter("showsettings");
                    var c = SWFAddress.getParameter("screenId");
                    if (d == "1" && c == "p.main.show") {
                        SWFAddress.setValue("?screenId=p.main.show&nav=dash_page_menu_profile");
                    }
                }
                if (pmainPH.context == CONTEXT.ME) {
                    $("personDataheader").show();
                }
            } else {
                $("personDatainsert").show();
                $("personDatamaincontent").hide();
                $("dash_page_menu_dashboard").removeClassName("selected");
                $("dash_page_menu_profile").addClassName("selected");
                pmainPH.showsettings("personDatainsert", pmainPH.viewMode);
            }
        }
    },
    showusersettings: function() {
        pmainPH.context = CONTEXT.ME;
        chelperPH.hideNotificationArea();
        $LAB.script(chelperPH.resourcedir + "p/premium/js/ppremiumSettingsPH.js").wait(function() {
            $LAB.script(chelperPH.resourcedir + "p/prof/js/pprofPH.js").wait(function() {
                pprofPH.showServicesSubmenu = false;
                pprofPH.show(guserPH.user.id, pmainPH.context, "maincontainer", null);
                clayoutPH.makePageMenuPretty();
            });
        });
    },
    showsettings: function(a, b) {
        if (pmainPH.context == CONTEXT.ME) {
            SWFAddress.setValue("?screenId=p.main.showusersettings&nav=dash_page_menu_profile");
        } else {
            if (a == null) {
                a = "personDatainsert";
            }
            if (b == null) {
                b = pmainPH.viewMode;
            }
            chelperPH.loadTemplateHidd(chelperPH.resourcedir + "p/prof/tpl/profile_tpl.html", function() {
                var c = TemplateEngine.parseById("hidden_prof_layout_common");
                $(a).update(c);
                $LAB.script(chelperPH.resourcedir + "p/prof/js/pprofPH.js").wait(function() {
                    pprofPH.show(pmainPH.person.id, pmainPH.context, a, pmainPH.onProfileSaveFunc);
                });
                if (pmainPH.context == CONTEXT.SCHOOL) {
                    ccachePH.currentYear(rolesPH.instId, function(d) {
                        if (d == null) {
                            d = {};
                        }
                        ccachePH.studyYearsListWithoutTerms(rolesPH.instId, function(e) {
                            $LAB.script(chelperPH.resourcedir + "p/prof/js/tagsPH.js").wait(function() {
                                $LAB.script(chelperPH.resourcedir + "p/prof/js/rolesPH.js").wait(function() {
                                    chelperPH.loadTemplateHidd(chelperPH.resourcedir + "p/prof/tpl/roles_tmpl.html", function() {
                                        rolesPH.showRoles(pmainPH.person.roles, pmainPH.rights.isAdmin, pmainPH.person.id, pmainPH.isDummy(pmainPH.person), pmainPH.onProfileSaveFunc, d.id);
                                    });
                                });
                                if (pmainPH.context == CONTEXT.SCHOOL && pmainPH.rights.isAdmin) {
                                    tagsPH.tpl = null;
                                    tagsPH.cssClass = null;
                                    $("p_prof_block_usertags").show();
                                    $("p_prof_block_tags").show();
                                    tagsPH.showUserTags(pmainPH.person.id);
                                }
                            });
                        });
                    });
                }
                $("personDatainsert").show();
            });
        }
    },
    initProfileInfo: function(a) {
        var b = "personDatamaincontent";
        a = clayoutPH.initSubMenu(window[a]);
        chelperPH.loadTemplateHidd(chelperPH.resourcedir + "p/prof/tpl/profile_new_tpl.html", function() {
            var c = TemplateEngine.parseById("hidden_prof_layout_new");
            $(b).update(a + c);
        });
    },
    showProfileInfoBlock: function(a, b, d) {
        var a = a || "personDatamaincontent";
        var c = d ? clayoutPH.initSubMenu(window[d]) : "";
        chelperPH.loadTemplateHidd(chelperPH.resourcedir + "p/prof/tpl/profile_new_tpl.html", function() {
            var f = TemplateEngine.parseById("hidden_prof_layout_new");
            $(a).update(c + f);
            pprofilePH.init(pmainPH.person.id, pmainPH.context, a, pmainPH.onProfileSaveFunc, pprofilePH.showProfile);
            $$(".toolbar2 li").invoke("removeClassName", "selected");
            var e = $("dash_page_menu_profile");
            if (e) {
                e.addClassName("selected");
            }
            if (true) {
                var g = clayoutPH.initSubMenu(NAV_SCHOOL_USER_SET);
                $("personDatainsert").update(g).show();
                $$(".submenu li").invoke("removeClassName", "selected");
                $("student_personal_data").addClassName("selected");
            } else {
                if (pmainPH.context === CONTEXT.THIRD) {
                    $("child_settings_main").addClassName("selected");
                    $("child_settings").addClassName("selected");
                }
            }
        });
    },
    showSchoolInfo: function() {
        $$(".submenu li").invoke("removeClassName", "selected");
        $("school_student_tags_and_roles").addClassName("selected");
        pprofilePH.showRolesTagsJournals();
    },
    showstatistics: function(c, a, b) {
        showLoadingIndicator();
        if (!c) {
            c = guserPH.user.id;
            a = null;
            b = CONTEXT.ME;
        }
        userAccountManager.updateXAuthCookie(c, a, b, function(d) {
            premiumManager.getPremiumRecurrings(false, false, "PREMIUM", function(e) {
                premiumManager.hasPremium(function(g) {
                    hideLoadingIndicator();
                    clayoutPH.toggleAside(true);
                    var f = false;
                    if (b && b === CONTEXT.SCHOOL) {
                        if (true) {
                            f = true;
                        }
                    } else {
                        f = g.returnObject;
                    }
                    $("personDatamaincontent").update(TemplateEngine.parseById("hidden_dash_statistics", {
                        "trialAvailable": e.returnObject.trialAvailable,
                        "hasPremium": f
                    }));
                });
            });
        });
    },
    showStatisticsDecorator: function(c, a, b) {
        userAccountManager.updateXAuthCookie(c, a, b, function(d) {
            pmainPH.showstatistics();
        });
    },
    showRegisterPersonDataDocumentsSens: function(c, d) {
        var a;
        var c = c || CONTEXT.SCHOOL;
        var b = c === CONTEXT.SCHOOL ? "school_student_studentdata_documents_sens" : "home_student_studentdata_documents_sens";
        if (d) {
            a = Number(d.value);
        }
        pmainPH.handleSubmenu(b);
        pprofilePH.init(pmainPH.person.id, pmainPH.context, null, pmainPH.onProfileSaveFunc, pprofilePH.showRegisterPersonDataDocumentsSens, pmainPH.getInstFromRoles(a));
    },
    showRegisterPersonDataDevelopmentCards: function(f, c, e) {
        pmainPH.isDevCardsOpenFromJournal = e ? e : false;
        var a = pprofilePH.instId;
        var c = c || CONTEXT.SCHOOL;
        var b = c === CONTEXT.SCHOOL ? "school_student_studentdata_development_cards" : "home_student_studentdata_development_cards";
        pmainPH.handleSubmenu(b);
        pprofilePH.init(f, c, null, pmainPH.onProfileSaveFunc, pprofilePH.showRegisterPersonDataDevelopmentCards);
        if (c === CONTEXT.SCHOOL && e) {
            var d = document.getElementById("personDatatoolbar");
            d.scrollIntoView({
                block: "start",
                behavior: "smooth"
            });
        }
    },
    showRegisterPersonDataNotes: function(c, d) {
        var a;
        var c = c || CONTEXT.SCHOOL;
        var b = c === CONTEXT.SCHOOL ? "school_student_studentdata_notes" : "home_student_studentdata_notes";
        if (d) {
            a = Number(d.value);
        }
        pmainPH.handleSubmenu(b);
        pprofilePH.init(pmainPH.person.id, pmainPH.context, null, pmainPH.onProfileSaveFunc, pprofilePH.showRegisterPersonDataNotes, pmainPH.getInstFromRoles(a));
    },
    showGuardians: function(b) {
        var a = b === CONTEXT.SCHOOL ? "school_student_guardians" : "home_student_guardians";
        pmainPH.handleSubmenu(a);
        pprofilePH.showGuardiansSubMenu(b);
    },
    handleSubmenu: function(a) {
        var b = $(a);
        $$("#submenu li").invoke("removeClassName", "selected");
        if (b) {
            b.addClassName("selected");
        }
    },
    getInstFromRoles: function(a) {
        var c = pmainPH.person.roles;
        var b;
        if (c.length) {
            if (a) {
                c.each(function(d) {
                    if (d.id === a) {
                        b = d.institution.id;
                    }
                });
            } else {
                b = c[0].institution.id;
            }
        }
        return b;
    },
    showCouncilDecisionForm: function(a) {
        if ($("c_membercardrole_add_role_form")) {
            rolesPH.showNewRoleForm(false);
        }
        clayoutPH.initMMModalDialog({
            hasCloseButton: true,
            innerPadding: 0
        });
        showLoadingIndicator("modaldialog_content");
        var c = $(document.createElement("form"));
        c.id = "formCouncilDecisionFM";
        var b = {};
        b.type = COUNCIL_DEC_TYPES.OTHER;
        b.student = {};
        b.student.id = a;
        c.setDataObj(b);
        c.drawEditMode($("modaldialog_content"));
        c.bindSaveAction(pmainPH.saveCouncilDecision);
        hideLoadingIndicator("modaldialog_content");
    },
    saveCouncilDecision: function(e, a, d) {
        var b = null;
        var c = $(getFormName());
        c.clearErrors();
        e.id = c._formData.id;
        if (c._formData.student != null && c._formData.student.id != null) {
            b = c._formData.student.id;
        } else {
            var f = guserPH.getStudents(pmainPH.getCurrInst(), pmainPH.person.roles);
            if (f != null && f.size() > 0) {
                b = f[0].id;
            }
        }
        if (b) {
            showLoadingIndicator("modaldialog_content");
            councilDecisionManager.addCouncilDecision(e, dwrNumber(b), dwrNumber(pmainPH.getCurrInst()), {
                callback: function(h, g) {
                    if (h.isError) {
                        chelperPH.parseErrors(h.errors);
                        hideLoadingIndicator("modaldialog_content");
                    } else {
                        hideLoadingIndicator("modaldialog_content");
                        clayoutPH.closeMMModalDialog();
                        chelperPH.showNotice("Решение пед. совета добавлено.");
                        if (pmainPH.viewMode != 1) {
                            pmaindashPH.refreshDash();
                        }
                    }
                }
            });
        }
    },
    isDummy: function(a) {
        var b = false;
        if (a.institution != null && a.institution.id != null) {
            b = true;
        }
        return b;
    },
    unsetProfile: function(b) {
        var a = null;
        if (pmainPH.context == CONTEXT.SCHOOL) {
            a = pmainPH.getCurrInst();
        }
        ccachePH.personProfileEmpty(b, pmainPH.context, a);
        ccachePH.getPersonPersonalDataEmpty(b, pmainPH.context, a);
    },
    onProfileChanged: function() {
        if (pmainPH.onProfileSaveFunc != null) {
            chelperPH.callcode(pmainPH.onProfileSaveFunc);
        }
        if (pmainPH.context == CONTEXT.SCHOOL) {
            var b = null;
            b = pmainPH.getCurrInst();
            ccachePH.emptyOnNameChange(b);
        } else {
            if (pmainPH.context == CONTEXT.ME) {
                var a = guserPH.userGetGroups();
                if (a != null) {
                    for (var c = 0; c < a.size(); c++) {
                        ccachePH.emptyOnNameChange(a[c].id);
                    }
                }
            }
        }
    },
    getParentsForStudentFromAllSchools: function(c, a) {
        var d = [];
        var b = [];
        c.each(function(e) {
            if (e.instanceClass === "Student") {
                if (e.parents && e.parents.length) {
                    b.push(e.parents);
                } else {
                    d.push(e);
                }
            }
        });
        if (d.length) {
            d.each(function(e) {
                peopleResourceManager.getParentsForStudent(e.id, e.institution.id, function(f) {
                    b = b.concat(f.returnObject.parents);
                    a(b);
                });
            });
        } else {
            a(b);
        }
    },
    getCurrInst: function() {
        if (pmainPH.instId == null) {
            shout("pmainPH.instId IS NULL!!!");
        }
        return pmainPH.instId;
    },
    showAdPage: function() {
        alert("showAdPage");
    },
    redrawPersonPage: function() {
        pmainPH.loadProfile(pmainPH.person.id, pmainPH.context, pmainPH.getCurrInst(), pmainPH.mainPlaceHolder, pmainPH.viewMode, pmainPH.dashFilter, pmainPH.onProfileSaveFunc, pmainPH.journalId, pmainPH.isAttJournal, pmainPH.isGradesJournal);
    },
    isFormmasterForStudent: function() {
        var a = false;
        try {
            $LAB.script(chelperPH.resourcedir + "p/prof/js/pprofPH.js").wait(function() {
                $LAB.script(chelperPH.resourcedir + "p/prof/js/pprofilePH.js").wait(function() {
                    a = guserPH.isFormmasterForStudent(pmainPH.instId, pmainPH.person.roles);
                });
            });
        } catch (c) {}
        return a;
    },
    isFormFormmasterForStudent: function() {
        var a = false;
        return a = guserPH.isFormmasterForStudent(pmainPH.instId, pmainPH.person.allRoles);
    },
    isHeadmaster: function() {
        var a = false;
        try {
            $LAB.script(chelperPH.resourcedir + "p/prof/js/pprofPH.js").wait(function() {
                $LAB.script(chelperPH.resourcedir + "p/prof/js/pprofilePH.js").wait(function() {
                    a = guserPH.isHeadmaster(pmainPH.instId);
                });
            });
        } catch (c) {}
        return a;
    },
    isStudentProfile: function() {
        var a = false;
        try {
            $LAB.script(chelperPH.resourcedir + "p/prof/js/pprofPH.js").wait(function() {
                $LAB.script(chelperPH.resourcedir + "p/prof/js/pprofilePH.js").wait(function() {
                    a = guserPH.isStudentProfile(pmainPH.instId, pmainPH.person.roles);
                });
            });
        } catch (c) {}
        return a;
    },
    hasActiveRole: function() {
        var a = false;
        if (pmainPH.context == CONTEXT.SCHOOL) {
            this.person.roles.forEach(function(b) {
                if (b.institution.id == pmainPH.instId && b.status === ROLE_STATUSES.ACTIVE) {
                    return a = true;
                }
            });
        } else {
            return a = true;
        }
        return a;
    },
    isSocialWorkerProfile: function() {
        var a = false;
        this.person.roles.forEach(function(b) {
            if (b instanceof ee.ekool.model.roles.SocialWorker && b.institution.id == pmainPH.instId) {
                a = true;
            }
        });
        return a;
    },
    showSocialWorkerStudents: function() {
        var b = "school_social_worker_students";
        pmainPH.handleSubmenu(b);
        var a = null;
        this.person.roles.forEach(function(c) {
            if (c instanceof ee.ekool.model.roles.SocialWorker && c.institution.id == pmainPH.instId) {
                a = c.id;
            }
        });
        pprofilePH.showSocialWorkerStudentsSubMenu(a);
    }
};