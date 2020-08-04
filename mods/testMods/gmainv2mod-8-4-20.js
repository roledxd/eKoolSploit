var gmainv2PH = {
    foldername: "g",
    groupId: null,
    callback: null,
    personellCarousel: null,
    personellCarouselItemsPerPage: 10,
    curriculaCarousel: null,
    toDivId: "maincontainer",
    absenceNoticesNotifMap: $H(),
    journal: {},
    curriculumList: [],
    courseList: [],
    permissions: null,
    employeeList: null,
    initThis: function(a) {
        if ($("e_ekool_schoolloc") != null) {
            $("e_ekool_schoolloc").hide();
        }
        var b = SWFAddress.getParameter("groupId");
        if (b && b > 0) {
            gmainv2PH.groupId = b;
        }
        gmainv2PH.absenceNoticesNotifMap = $H();
        ccachePH.statesList(function(c) {});
        ccachePH.getPhoneTypesList(function(c) {});
        ccachePH.getEmailTypesList(function(c) {});
        chelperPH.loadTemplateHidd(chelperPH.resourcedir + gmainv2PH.foldername + "/mainv2/tpl/main_tpl.html", function() {
            var c = false;

            gmainv2PH.getAbsenceNoticeNotifications();
            ccachePH.groupObj(gmainv2PH.groupId, c, function(d) {
                ccachePH.statesList(function(e) {
                    ccachePH.getPhoneTypesList(function(f) {
                        ccachePH.getEmailTypesList(function(h) {
                            var g = guserPH.userAccountTypes(this.groupId);
                            if ((guserPH.user != null)) {
                                $LAB.script(chelperPH.resourcedir + "g/" + chelperPH.getEffectiveJournalDir() + "/js/gjournalListPH.js?_" + chelperPH.journalRefreshForceString).wait(function() {
                                    this.groupObj = d;
                                    this.jrnlRet = null;
                                    chelperPH.callcode(a);
                                }.bind(this));
                            } else {
                                this.groupObj = d;
                                this.jrnlRet = null;
                                chelperPH.callcode(a);
                            }
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }.bind(this));
    },
    initThisDivs: function(b, a) {
        gmainv2PH.initThis(function() {
            var c = false;
            var d = null;
            if (b) {
                d = TemplateEngine.parseById("hidden_g_main_overview_v2_main", {
                    "mode": 0
                });
                $(gmainv2PH.toDivId).update(d);
            }
            d = TemplateEngine.parseById("hidden_stpl_3", {
                "idPrefix": "schoolData",
                "isAsideDiv": c
            });
            $(gmainv2PH.toDivId).update(d);
            $("maincontainer").removeClassName("PR320");
            chelperPH.callcode(a);
        });
    },
    showJoin: function(a, b) {
        if (!b) {
            b = SWFAddress.getParameter("requestTypeId");
        }
        if (a) {
            gmainv2PH.groupId = a;
        }
        gmainv2PH.initThisDivs(true, function() {
            gmainv2PH.gjoinv2Show(b);
        });
    },
    showAdverts: function() {
        if (typeof googletag.destroySlots === "function") {
            googletag.destroySlots();
        }
        gmainv2PH.showNotificationAd();
        gmainv2PH.showTowerAd();
    },
    showNotificationAd: function() {
        chelperPH.loadTemplateHidd(chelperPH.resourcedir + "p/main/tpl/dashboard.html", function() {
            var b = TemplateEngine.parseById("school_adverts_notification", null);
            var a = $("notification_container");
            if (a && b != null) {
                a.insert({
                    bottom: b
                });
            }
        });
    },
    showTowerAd: function() {
        chelperPH.loadTemplateHidd(chelperPH.resourcedir + "p/main/tpl/dashboard.html", function() {
            var b = TemplateEngine.parseById("school_adverts_tower", null);
            var a = $("tower_ad_container");
            if (a && b != null) {
                a.insert({
                    bottom: b
                });
            }
        });
    },
    show: function(b, a) {
        showLoadingIndicator($("maincontainer"));
        chelperPH.hideNotificationArea();
        if (a == null) {
            a = true;
        }
        if (b) {
            gmainv2PH.groupId = b;
        }
        gmainv2PH.initThisDivs(a, function() {
            getNavigation();
            if (navActive === undefined) {
                gmainv2PH.getCurrentStudyYearAndShowSchoolPage();
            }
            var e = TemplateEngine.parseById("hidden_menu_inst", {
                "inst": gmainv2PH.groupObj.groupData,
                "showSettingsLink": true,
                "curricula": null
            });
            $(gmainv2PH.toDivId).hide();
            $("schoolDataheader").update(e);
            gmainv2PH.showButtons();
            if (guserPH.userIsLoggedIn()) {
                gmainv2PH.groupObj.assignedPlaceCount = 0;
                if (gmainv2PH.groupObj.designatedPlaceList != null) {
                    for (var d = 0; d < gmainv2PH.groupObj.designatedPlaceList.size(); d++) {
                        gmainv2PH.groupObj.assignedPlaceCount += gmainv2PH.groupObj.designatedPlaceList[d].placeCount;
                    }
                }
                if (gmainv2PH.groupObj.confirmedPlaceList != null) {
                    for (var c = 0; c < gmainv2PH.groupObj.confirmedPlaceList.size(); c++) {
                        gmainv2PH.groupObj.assignedPlaceCount += gmainv2PH.groupObj.confirmedPlaceList[c].placeCount;
                    }
                }
                gmainv2PH.showMenu();
            }
            $(gmainv2PH.toDivId).show();
            gmainv2PH.toDivId = "maincontainer";
            navigateHash(NAV_INST_SET);
            hideLoadingIndicator($("maincontainer"));
        });
    },
    showButtons: function() {
        var a = null,
            b = $("schoolDataheader");
        if (gmainv2PH.groupObj.groupData.published != true) {
            if (gmainv2PH.groupObj.publishReqCount && gmainv2PH.groupObj.publishReqCount > 0) {} else {
                if (true) {
                    a = TemplateEngine.parseById("hidden_g_main_publishbutton", {
                        "inst": gmainv2PH.groupObj.groupData
                    });
                    b.up().insert({
                        "top": a
                    });
                    b.addClassName("PT40");
                }
            }
        }
    },
    showMenu: function() {
        var a = gmainv2PH.getMenuItemsPermissions(gmainv2PH.groupObj.groupData);
        var b = TemplateEngine.parseById("hidden_a_settings_fieldlist", {
            "inst": gmainv2PH.groupObj.groupData,
            "menuItemsPermissions": a,
            "joinReqCount": gmainv2PH.groupObj.joinReqCount,
            "threadCountNew": 0,
            "assignedPlaceCount": gmainv2PH.groupObj.assignedPlaceCount,
            "interviewNotifCount": gmainv2PH.groupObj.interviewNotifCount,
            "grdesTransferredExcerptCount": gmainv2PH.groupObj.grdesTransferredExcerptCount,
            "isAllowedTransfer": gmainv2PH.groupObj.isAllowedWholeSchoolGradesTransfer,
            "isAllowedFormativeAssesment": gmainv2PH.groupObj.isAllowedFormativeAssesment
        });
        $("schoolDatatoolbar").update(b);
        setTimeout(function() {
            clayoutPH.makePageMenuPretty();
        }, 200);
    },
    getMenuItemsPermissions: function() {
        var a = {
            "requests": true,
            "timetable": true,
            "timetableAdmin": true,
            "reports": true,
            "fa": true,
            "recordBook": true,
            "interview": true,
            "interviewDemo": true,
            "descisions": true,
            "schoolyear": true,
            "recources": true,
            "curriculum": true,
            "gradesTransfer": true,
            "classificators": true,
            "addmission": true,
            "discipline": true,
            "fullDiscipline": true,
            "gradesTransferAdmin": true,
            "superAdminTool": true,
            "ads": true,
            "cafeteria": true,
            "devCardsTemplates": true,
        };
        gmainv2PH.permissions = a;
        return a;
    },
    getCurrentStudyYearAndShowSchoolPage: function() {
        ccachePH.currentYear(gmainv2PH.groupId, function(a) {
            gmainv2PH.showSchoolPage(a);
        });
    },
    showSchoolPage: function(a) {
        chelperPH.loadTemplateHidd(chelperPH.resourcedir + "p/main/tpl/dashboard.html", function() {
                $LAB.script(chelperPH.resourcedir + "p/main/js/pmaindashPH.js").wait(function() {
                        pmaindashPH.checkIfHarIDuserHasNewRoles();
                        gmainv2PH.showAppPromoToTeacher();
                        var m = false;
                        if (gmainv2PH.groupObj.groupData.status == INST_STATUSES.OVERDUE || gmainv2PH.groupObj.groupData.status == INST_STATUSES.DISABLED) {
                            var o = {};
                            o.title = "Данная школа просрочила оплату и услуги временно приостановлены. Пожалуйста, свяжитесь с администрацией школы для получения дальнейшей информации.";
                            clayoutPH.nocontent("schoolDatamaincontent", o);
                        } else {
                            var e = true;
                            if (true) {
                                m = true;
                            } else {
                                if (true) {
                                    if (a == null) {
                                        e = true;
                                    }
                                }
                            }
                            var n = true;
                            var k = TemplateEngine.parseById("hidden_g_main_overview_v2_main_content", {
                                "showJournals": true,
                                "groupObj": gmainv2PH.groupObj,
                                "showWarningOfCurrentYear": true,
                                "currentYear": a,
                                "isEventsVisible": true,
                                "teacherCanAddJournal": true
                            });
                            $("schoolDatamaincontent").update(k);
                            if (m) {
                                if (true) {
                                    if (typeof guserPH.user.selectedGroupId === "undefined") {
                                        guserPH.activateGroup(gmainv2PH.groupId, gmainv2PH.showJournals());
                                    } else {
                                        gmainv2PH.showJournals();
                                    }
                                }
                            }
                            var d = guserPH.userAccountTypes(gmainv2PH.groupId);
                            if (guserPH.userIsLoggedIn() && d != null && d.size() > 0) {
                                k = TemplateEngine.parseById("hidden_g_main_overview_v2_personell", {
                                    "personellList": $A()
                                });
                                $("g_main_overview_v2_contacts").update(k);
                                var c = 1;
                                var h = [];

                                c = 0;
                                h.push({
                                    "id": 0,
                                    "name": "Учителя"
                                });

                                h.push({
                                    "id": 1,
                                    "name": "Администраторы"
                                });

                                h.push({
                                    "id": 4,
                                    "name": "Школы"
                                });

                                h.push({
                                    "id": 2,
                                    "name": "специалисты по поддержке"
                                });

                                h.push({
                                    "id": 3,
                                    "name": "Ученики"
                                });
                                h.push({
                                    "id": 5,
                                    "name": "Руководство школы"
                                });

                                h.push({
                                    "id": 20,
                                    "name": "Мои ученики"
                                });

                                h.push({
                                    "id": 7,
                                    "name": "Персонал"
                                });
                            
                            
                            }
                            chelperPH.sortMember(gmainv2PH.groupObj.groupAdminList, gmainv2PH.groupObj.groupData);
                            chelperPH.sortMember(gmainv2PH.groupObj.groupTeacherList, gmainv2PH.groupObj.groupData);
                            if (gmainv2PH.cfilterPH && gmainv2PH.cfilterPH.groupId == gmainv2PH.groupId) {
                                gmainv2PH.cfilterPH.filterDrawAndShow();
                                gmainv2PH.cfilterPH.filterAttachCallbacks();
                            } else {
                                gmainv2PH.cfilterPH = new cfilterPH(h, true, false, gmainv2PH.personellFilterHandler.bind(gmainv2PH), c, ["Поиск по имени... (eKoolSploit)"], "g_main_overview_v2_contacts_personell_filter");
                                gmainv2PH.cfilterPH.groupId = gmainv2PH.groupId;
                            }
                            gmainv2PH.personellFilterHandler(gmainv2PH.cfilterPH.getFilterValues().type, gmainv2PH.cfilterPH.getFilterValues().searchCriterion);
                            clayoutPH.makePageMenuPretty();
                    
                        if (gmainv2PH.showCurricula()) {
                            gmainv2PH.curriculaContent();
                        }
                        
                        k = TemplateEngine.parseById("hidden_g_main_overview_v2_events", {
                            "groupObj": gmainv2PH.groupObj,
                            "isAllowedModify": true
                        });
                        $("g_main_overview_v2_events").update(k);
                        gmainv2PH.eventsList();
                        gmainv2PH.showBlog();
                        gmainv2PH.showAdverts();
                    }
                });
        });
},
showCurricula: function() {
    if (gmainv2PH.groupId == 1) {
        return false;
    } else {
        return true;
    }
},
setFirstSectionSelection: function(a) {
    $A($(a).up("div").select("a.selected")).invoke("removeClassName", "selected");
    $(a).addClassName("selected");
},
personellFilterHandler: function(e, c) {
    showLoadingIndicator("g_main_overview_v2_contacts");
    var g = null;
    if (e == 4) {
        ccachePH.partnerList(gmainv2PH.groupId, function(i) {
            var h = $A();
            i.each(function(j) {
                h.push(j.child);
            });
            gmainv2PH.personellFilterHandlerActivate(e, c, h, "hidden_g_main_overview_v2_personell_list_schools_items");
        });
    } else {
        if (e == 2) {
            ccachePH.shortSocialWorkerPersonList(gmainv2PH.groupId, function(h) {
                gmainv2PH.personellFilterHandlerActivate(e, c, h);
            });
        } else {
            if (e == 3) {
                ccachePH.studentListPublic(gmainv2PH.groupId, function(h) {
                    gmainv2PH.personellFilterHandlerActivate(e, c, h);
                });
            } else {
                if (e == 5) {
                    ccachePH.headMasterPersonList(gmainv2PH.groupId, function(h) {
                        gmainv2PH.personellFilterHandlerActivate(e, c, h);
                    });
                } else {
                    if (e == 1 || e == 0) {
                        if (e == 1) {
                            g = this.groupObj.groupAdminList;
                        } else {
                            if (e == 0) {
                                g = this.groupObj.groupTeacherList;
                            }
                        }
                        gmainv2PH.personellFilterHandlerActivate(e, c, g);
                    } else {
                        if (e == 7) {
                            ccachePH.shortStaffPersonList(gmainv2PH.groupId, function(h) {
                                gmainv2PH.personellFilterHandlerActivate(e, c, h);
                            });
                        } else {
                            if (e == ROLES.SOCIAL_WORKER) {
                                ccachePH.getSocialWorkerPersons(dwrNumber(gmainv2PH.groupId), function(h) {
                                    chelperPH.sortMember(h, gmainv2PH.groupObj.groupData);
                                    gmainv2PH.personellFilterHandlerActivate(e, c, h);
                                });
                            } else {
                                var a = guserPH.getMasteredClasses(gmainv2PH.groupId);
                                var f = chelperPH.arrFindById(e, a);
                                if (f != null) {
                                    var b = f.classLevel.id;
                                    var d = null;
                                    if (f.parallelIdentifier != null) {
                                        d = f.parallelIdentifier.id;
                                    }
                                    ccachePH.getRegisterPersonsInClass(gmainv2PH.groupId, dwrNumber(b), dwrNumber(d), function(h) {
                                        chelperPH.sortMember(h, gmainv2PH.groupObj.groupData);
                                        gmainv2PH.personellFilterHandlerActivate(e, c, h);
                                    });
                                } else {
                                    shout("formmaster is null");
                                }
                            }
                        }
                    }
                }
            }
        }
    }
},
personellFilterHandlerActivate: function(i, a, f, d) {
    if (d == null) {
        d = "hidden_g_main_overview_v2_personell_list_items";
    }
    if ((a != null) && (a > "")) {
        f = chelperPH.arrFindBySearchStr(a, f);
    }
    if (f.length > 500) {
        var g = $A();
        for (var h = 0; h < f.length; h = h + 1) {
            g.push(f[h]);
            if (h == 500) {
                break;
            }
        }
        f = g;
    }
    if (f.length > 0) {}
    var e = TemplateEngine.parseById(d, {
        "arr": f,
        "type": i
    });
    $("g_main_overview_v2_personell_list").update(e);
    if (f.length > 0) {
        if (gmainv2PH.personellCarousel != null) {
            gmainv2PH.personellCarousel.purge();
            gmainv2PH.personellCarousel = null;
        }
        var j = $$("a.ig_main_overview_v2_personell_scroller_carousel-jumper");
        j.push($("g_main_overview_v2_personell_scroller_carousel_control_prev"));
        j.push($("g_main_overview_v2_personell_scroller_carousel_control_next"));
        gmainv2PH.personellCarousel = new EkoolCarousel("g_main_overview_v2_personell_scroller", $("g_main_overview_v2_personell_scroller").select(".iscroller_item"), j, {
            "skip": gmainv2PH.personellCarouselItemsPerPage,
            "circular": false,
            "jumperClassName": "ig_main_overview_v2_personell_scroller_carousel-jumper",
            "controlClassName": "icarousel-control"
        });
        var b = $("g_main_overview_v2_personell_scroller");
        if (f.length <= gmainv2PH.personellCarouselItemsPerPage) {
            b.addClassName("BL0 BR0 ML50");
        } else {
            b.removeClassName("BL0 BR0 ML50");
        }
    }
    hideLoadingIndicator("g_main_overview_v2_contacts");
},
showJournals: function() {
    gjournalListPH.showFilter("g_main_overview_v2_tools_filter", function() {
        gjournalListPH.journalListTargetDivId = "g_main_overview_v2_tools_list";
        gjournalListPH.showV2(this.jrnlRet);
    });
},
showRequests: function() {
    $LAB.script(chelperPH.resourcedir + "c/app/js/cappPH.js").wait(function() {
        $LAB.script(chelperPH.resourcedir + "a/requests/js/arequestsPH.js").wait(function() {
            arequestsPH.show(gmainv2PH.groupId, "schoolDatamaincontent");
        }.bind(this));
    });
},
timetables: function() {
    $LAB.script(chelperPH.resourcedir + "c/app/js/cappPH.js").wait(function() {
        cappPH.initAppV2(APP_LAYOUT.SIMPLE, this.appHeadTxt, {
            "useButtons": true,
            "useSearch": true
        }, function() {
            $LAB.script(chelperPH.resourcedir + "g/cal/js/gcalPH.js").wait(function() {
                gcalPH.show(gmainv2PH.groupId);
            });
        });
    });
},
showDevCardsTemplates: function() {
    $LAB.script(chelperPH.resourcedir + "c/app/js/cappPH.js").wait(function() {
        $LAB.script(chelperPH.resourcedir + "g/mainv2/js/devcardsTemplatesPH.js").wait(function() {
            userAccountManager.updateXAuthCookie(guserPH.user.personId, gmainv2PH.groupId, CONTEXT.SCHOOL, function(a) {
                devcardsTemplates.show(gmainv2PH.groupId, "schoolDatamaincontent");
            });
        }.bind(this));
    });
},
showCalendar: function() {
    $LAB.script(chelperPH.resourcedir + "g/cal/js/gcalPH.js").wait(function() {
        gcalPH.show(gmainv2PH.groupId);
    }.bind(this));
},
showBlog: function() {
    $LAB.script(chelperPH.resourcedir + "g/blog/js/gblogPH.js").wait(function() {
        gblogPH.posts(null, "g_main_overview_v2_blog", gmainv2PH.groupId);
    });
},
showReports: function() {
    $LAB.script(chelperPH.resourcedir + "g/reports/js/greportsPH.js").wait(function() {
        greportsPH.show();
    });
},
showAllGradesTranfer: function() {
    $LAB.script(chelperPH.resourcedir + "g/gradestransfer/js/allGradesTransferPH.js").wait(function() {
        allGradesTransferPH.show(gmainv2PH.groupId);
    });
},
showDecisions: function() {
    $LAB.script(chelperPH.resourcedir + "g/mainv2/js/decisionPH.js").wait(function() {
        decisionPH.show();
    });
},
showFileManager: function() {
    $LAB.script(chelperPH.resourcedir + "p/fileManager/js/fileManagerPH.js").wait(function() {
        fileManagerPH.show(CONTEXT.ME, FILEMANAGER_FILTERNAME.SCHOOL_DASH);
    });
},
showAdminTransfer: function() {
    $LAB.script(chelperPH.resourcedir + "a/gradetransfer/js/admintransferPH.js").wait(function() {
        admintransferPH.show();
    });
},
showFormativeAssessment: function() {
    $LAB.script(chelperPH.resourcedir + "g/formass/js/formassPH.js").wait(function() {
        formassPH.show(gmainv2PH.groupId);
    });
},
showFormMasterDashboard: function() {
    $LAB.script(chelperPH.resourcedir + "f/main/js/fmainPH.js").wait(function() {
        fmainPH.show();
    });
},
eventsList: function(b, a) {
    if (b == null) {
        b = 0;
    }
    gmainv2PH.eventsMode = b;
    if (a) {
        $("g_main_overview_v2_events").select("a.selected").invoke("removeClassName", "selected");
        a.addClassName("selected");
    }
    if (b == 1) {
        calendarManager.calendarEventsList(dwrNumber(gmainv2PH.groupId), "past", {
            callback: function(c) {
                gmainv2PH.eventList = c.returnObject;
                gmainv2PH.eventList.sort(sortByEventDatesDesc);
                gmainv2PH.eventsListDraw(gmainv2PH.eventList);
            }
        });
    } else {
        if (b == 2) {
            calendarManager.calendarEventsList(dwrNumber(gmainv2PH.groupId), "all", {
                callback: function(c) {
                    gmainv2PH.eventList = c.returnObject;
                    c.returnObject.sort(sortByEventDatesDesc);
                    gmainv2PH.eventsListDraw(c.returnObject);
                }
            });
        } else {
            if (!gmainv2PH.groupObj.isRecentEventList) {
                gmainv2PH.groupObj.calendarEventList.sort(sortByEventDatesAsc);
                gmainv2PH.eventsListDraw(gmainv2PH.groupObj.calendarEventList);
            } else {
                gmainv2PH.eventsMode = 0;
                gmainv2PH.eventsListDraw([]);
            }
        }
    }
},
eventsListDraw: function(c) {
    if (c.length == 0) {
        var e = {};
        if (gmainv2PH.eventsMode == 1) {
            e = {
                "title": "За последние 30 дней событий не найдено"
            };
        } else {
            if (gmainv2PH.eventsMode == 0) {
                e = {
                    "title": "В следующие 30 дней не запланировано мероприятий."
                };
            } else {
                e = {
                    "title": "В этой школе не внесено ни одного события."
                };
            }
        }
        $("g_main_overview_v2_events_content").update('<li id = "g_main_overview_v2_events_content_linc" class="P20"></li>');
        clayoutPH.nocontent("g_main_overview_v2_events_content_linc", e);
    } else {
        var d = true;
        
        if (!$("g_main_overview_v2_events_content")) {
            var b = TemplateEngine.parseById("hidden_g_main_overview_v2_events", {
                "groupObj": gmainv2PH.groupObj,
                "isAllowedModify": d
            });
            $("g_main_overview_v2_events").update(b);
        }
        var a = TemplateEngine.parseById("hidden_g_main_overview_v2_events_content", {
            "calendarEventList": c,
            "instId": this.groupId,
            "isAllowedModifyEvents": d
        });
        $("g_main_overview_v2_events_content").update(a);
    }
},
journalForm: function() {
    $LAB.script(chelperPH.resourcedir + "a/schoolyear/js/astudyyearPH.js").wait(function() {
        $LAB.script(chelperPH.resourcedir + "a/schoolyear/js/jrnlPreRegCoursePH.js").wait(function() {
            jrnlPreRegCoursePH.getAllPreRegCourses(guserPH.user.selectedGroupId, function(a) {
                ccachePH.curriculumList(guserPH.user.selectedGroupId, function(b) {
                    ccachePH.studyYearsList(guserPH.user.selectedGroupId, function(c) {
                        astudyyearPH.initThis(function() {
                            gmainv2PH.curriculumList = b;
                            gmainv2PH.journal = {
                                name: "",
                                report: true,
                                preRegistrationCourses: []
                            };
                            clayoutPH.initMMModalDialog({
                                hasCloseButton: true,
                                innerPadding: 0,
                                preferredWidth: 650
                            });
                            var e = TemplateEngine.parseById("hidden_g_main_journal_modal", {
                                journal: gmainv2PH.journal,
                                curriculaList: b,
                                preRegCourseList: a,
                                syList: c,
                                activeSyId: astudyyearPH.activeYearId
                            });
                            clayoutPH.updateMMModalDialogContent(e);
                            var d = $("preRegCourseTable");
                            if (d) {
                                addFixedHeaderToTable(d, 400);
                                $("tableWrap").toggle();
                            }
                        });
                    });
                });
            });
        });
    });
},
journalFormMakeCourseDD: function(c, a) {
    var b = $("g_main_journal_modal").getData().journal;
    c = c || $F($("g_main_journal_form_curricula"));
    if (c !== 0) {
        ccachePH.courseList(c, function(d) {
            gmainv2PH.courseList = d;
            var e = TemplateEngine.parseById("g_main_journal_form_courses_dd", {
                "journal": b,
                "courseList": d
            });
            a ? a.next().update(e) : $("g_main_journal_form_course").update(e);
        });
    }
},
journalSave: function() {
    var c = guserPH.getRoles("Staff", guserPH.user.selectedGroupId)[0];
    if (c) {
        var b = $("g_main_journal_modal");
        b.clearErrors();
        var d = b.getData();
        if (d.journal.name === "" || !d.journal.name || !d.journal.primCurricula || d.journal.primCurricula === "0") {
            return;
        }
        if (!d.journal.report) {
            d.journal.report = false;
        }
        if (!d.journal.allowTeacherPickStudents) {
            d.journal.allowTeacherPickStudents = true;
        }
        if (!d.journal.idnetPresenceEnabled) {
            d.journal.idnetPresenceEnabled = false;
        }
        if (d.journal.preRegCourseEnabled) {
            d.journal.preRegCourseEnabled = null;
        } else {
            d.journal.preRegCourseEnabled = null;
            d.journal.preRegistrationCourses = null;
        }
        d.journal.journalTeacherRels = [];
        var a = [{
            id: -1,
            primaryTeacher: true,
            teacher: {
                id: c.id
            },
            capacity: gmainv2PH.getCourseCapacityFromSelectEl("g_main_journal_form_course")
        }];
        if (d.journal.course !== null && d.journal.course.id !== null && d.journal.course.id > "") {
            d.journal.allCourses = [d.journal.course];
        }
        d.journal.studyYear = {
            "id": Number(d.journal.studyYear)
        };
        journalManager.journalSave(d.journal, dwrNumber(d.journal.studyYear.id), a, function(f) {
            var e = f.returnObject.journal;
            e.isMine = true;
            clayoutPH.closeMMModalDialog();
            gjournalListPH.journals.push(e);
            gjournalListPH.drawJournalList(gjournalListPH.journals);
        });
    } else {
        console.log("No active teacher role!!!");
    }
},
getCourseCapacityFromSelectEl: function(b) {
    var a = null;
    if (b) {
        var d = document.getElementById(b);
        var c = d.options[d.selectedIndex];
        a = Number(c.getAttribute("data-capacity"));
    }
    return a;
},
eventsForm: function(a) {
    ccachePH.institutionObj(gmainv2PH.groupId, function(c) {
        clayoutPH.initMMModalDialog({
            hasCloseButton: true,
            innerPadding: 0
        });
        var b = [];
        if (c.institutionType.type != INST_TYPE_TYPES.SCHOOL) {
            ccachePH.blogPostPublishTypes.each(function(d) {
                if (d.key < 4) {
                    b.push(d);
                }
            });
        } else {
            b = ccachePH.blogPostPublishTypes;
        }
        $LAB.script(chelperPH.resourcedir + "c/cal/js/ccalPH.js").wait(function() {
            ccalPH.eventFormSaveDoneCb = gmainv2PH.eventsFormSaveDone.bind(gmainv2PH);
            ccalPH.eventFormClearCb = gmainv2PH.eventsFormCancel.bind(gmainv2PH);
            ccalPH.initThisNotRecurring(gmainv2PH.groupId, function() {
                var e = chelperPH.arrFindById(a, gmainv2PH.groupObj.calendarEventList);
                if (e == null) {
                    e = chelperPH.arrFindById(a, gmainv2PH.eventList);
                }
                var d = ccalPH.eventFormNotRecurring(e, b);
                clayoutPH.updateMMModalDialogContent(d);
                if ($("eventElasticText")) {
                    new EkoolElastic($("eventElasticText"));
                }
            });
        });
    });
},
eventsFormCancel: function() {
    clayoutPH.closeModalBox();
},
eventsFormSaveDone: function() {
    gmainv2PH.eventsFormCancel();
    ccachePH.groupObjEmpty(gmainv2PH.groupId);
    ccachePH.groupObj(gmainv2PH.groupId, false, function(a) {
        gmainv2PH.groupObj = a;
        gmainv2PH.eventsList(gmainv2PH.eventsMode);
    });
},
teacherAbsenceForm: function(a) {
    chelperPH.loadTemplateHidd(chelperPH.resourcedir + "c/cal/tpl/employeeAway_tpl.html", function() {
        $LAB.script(chelperPH.resourcedir + "c/cal/js/employeeAwayPH.js").wait(function() {
            var c = chelperPH.arrFindById(a, gmainv2PH.groupObj.calendarEventList);
            if (c == null) {
                c = chelperPH.arrFindById(a, gmainv2PH.eventList);
            }
            if (c == null) {
                c = {};
            }
            var b = true;
            var d = false;
            if (c && c.person) {
                employeeAwayPH.absenteeId = c.person.id;
                employeeAwayPH.substituteTeachers = [];
                b = employeeAwayPH.hasRightsToEdit();
                d = employeeAwayPH.hasTeacherRole(employeeAwayPH.absenteeId);
            }
            gmainv2PH.getEmployeeListIfRights(function(e) {
                chelperPH.sortMember(e);
                var g = gmainv2PH.groupObj.groupData.substitutionReasons.sort(subjectTypeSort);
                var f = TemplateEngine.parseById("hidden_c_calendar_add_absence", {
                    "reasons": g,
                    "event": c,
                    "employeeList": e,
                    "hasRightsToChange": true,
                    "hasTeacherRole": true
                });
                clayoutPH.initMMModalDialog({
                    hasCloseButton: true,
                    innerPadding: 0,
                    preferredWidth: 600
                });
                clayoutPH.updateMMModalDialogContent(f);
                employeeAwayPH.trainingInformationId = null;
                if (c.training && employeeAwayPH.hasRightsToSeeTraining()) {
                    employeeAwayPH.openTrainingDataForm(c.trainingInformation);
                    employeeAwayPH.trainingInformationId = c.trainingInformation.id;
                }
            });
        });
    });
},
getEmployeeListIfRights: function(a) {
    if (true) {
        peopleResourceManager.getAllActiveEmployeesByInstitutionId(gmainv2PH.groupId, {
            callback: function(b) {
                gmainv2PH.employeeList = b.returnObject;
                if (a) {
                    a(gmainv2PH.employeeList);
                }
            }
        });
    } else {
        gmainv2PH.employeeList = [{
            name1: guserPH.user.name1,
            name2: guserPH.user.name2,
            id: guserPH.user.personId
        }];
        if (a) {
            a(gmainv2PH.employeeList);
        }
    }
},
refreshDropdown: function() {
    var b = $("absenceFormFindTeacher").value;
    var a = chelperPH.arrFindBySearchStr(b, gmainv2PH.employeeList);
    var c = TemplateEngine.parseById("findTeacherDropdownUlTemplate", {
        "employeeList": a
    });
    $("findTeacherDropdownUlContainer").update(c);
    $("findTeacherDropdownUl").show();
},
curriculaContent: function() {
    $LAB.script(chelperPH.resourcedir + "g/journal_2014/js/gjournalPH.js").wait(function() {});
    $LAB.script(chelperPH.resourcedir + "g/journal_2014/js/SubjectJournal.js").wait(function() {});
    if (gmainv2PH.groupObj.groupData.curriculums != null && gmainv2PH.groupObj.groupData.curriculums.size() > 0) {
        var a = TemplateEngine.parseById("hidden_g_main_overview_v2_curricula", {
            "curricula": gmainv2PH.groupObj.groupData.curriculums
        });
        $("g_main_overview_v2_curricula").update(a);
    }
},
curriculumContentShow: function(a) {
    showLoadingIndicator("g_main_overview_v2_curricula");
    curriculumManager.curriculumFind(dwrNumber(a), dwrNumber(this.groupId), {
        callback: function(l) {
            gmainv2PH.curricula = [];
            gmainv2PH.curricula.push(l.returnObject);
            var b = null;
            var f = 0;
            var c = guserPH.userAccountTypes(gmainv2PH.groupId);
            var k = guserPH.getStudents(gmainv2PH.groupId);
            if (c.indexOf(ROLES.STUDENT) != -1) {
                for (var e = 0; e < k.size(); e++) {
                    var m = k[e];
                    if (m != null && m.curriculum != null) {
                        if (m.curriculum.id == a) {
                            b = m.id;
                            f = ROLES.STUDENT;
                            break;
                        }
                    }
                }
            }
            if (b == null && c.indexOf(ROLES.PARENT) != -1) {
                k = guserPH.userGetChildren(null, gmainv2PH.groupId);
                for (var d = 0; d < k.size(); d++) {
                    var h = k[d];
                    if (h != null && h.curriculum != null) {
                        if (h.curriculum.id == a) {
                            b = h.id;
                            f = ROLES.STUDENT;
                            break;
                        }
                    }
                }
            }
            var g = TemplateEngine.parseById("hidden_g_main_overview_v2_curricula_view", {
                "curricula": l.returnObject,
                "viewType": f,
                "subject": null,
                "course": null,
                "studentId": b
            });
            $("g_main_overview_v2_curriculaoverview").update(g);
            gmainv2PH.curriculaStable();
            $jQ("#g_main_overview_v2_curricula a").on("click", function() {
                setTimeout(function() {
                    gmainv2PH.curriculaStable();
                }, 200);
            });
            hideLoadingIndicator("g_main_overview_v2_curricula");
        }
    });
},
showCurriculum: function(d, a, b) {
    if (gmainv2PH.groupObj.groupData.curriculums.size() > 0) {
        showLoadingIndicator("g_main_curriculum_content");
        var c = chelperPH.arrFindById(d, gmainv2PH.curricula);
        if (c != null) {
            gmainv2PH.displayCurriculum(c, a, b);
        } else {
            curriculumManager.curriculumFind(dwrNumber(d), dwrNumber(gmainv2PH.groupId), {
                callback: function(f) {
                    var e = f.returnObject;
                    if (e.courses != null) {
                        e.courses.sort(coursesSort);
                    }
                    if (e.subjects != null) {
                        e.subjects.sort(subjectsSort);
                    }
                    gmainv2PH.curricula.push(e);
                    gmainv2PH.displayCurriculum(e, a, b);
                }
            });
        }
    }
},
displayCurriculum: function(c, a, b) {
    var e = null;
    if (c != null && c.subjects != null && c.subjects.size() > 0) {
        e = c.subjects[0];
    }
    var f = [];
    f.push(c);
    if (b != null) {
        f = c;
    }
    if (e != null) {
        var d = TemplateEngine.parseById("hidden_g_main_curriculum_view", {
            "curricula": f,
            "viewType": a,
            "subject": e,
            "course": null,
            "studentId": b
        });
        $("g_main_curriculum_content").update(d);
    } else {
        var g = {};
        g.title = "Данные отсутствуют";
        clayoutPH.nocontent($("g_main_curriculum_content"), g);
    }
    hideLoadingIndicator("g_main_curriculum_content");
},
getCurriculumHTMLForStudent: function(c, b) {
    var a = TemplateEngine.parseById("hidden_g_main_overview_v2_curricula_view", {
        "curricula": c,
        "viewType": ROLES.STUDENT,
        "subject": null,
        "course": null,
        "studentId": b.id
    });
    return a;
},
getCurriculaHTMLForTeacher: function(e, a) {
    var d = null;
    if (e != null && e.size() > 0) {
        for (var c = 0; c < e.size(); c++) {
            if (e[c].subjects != null && e[c].subjects.size() > 0) {
                d = e[c].subjects[0];
                break;
            }
        }
    }
    var b = TemplateEngine.parseById("hidden_g_main_overview_v2_curricula_view", {
        "curricula": e,
        "viewType": a,
        "subject": d,
        "course": null,
        "studentId": null
    });
    return b;
},
getCurriculaForTeacher: function(r) {
    var d = [];
    var a = $H();
    var m = $H();
    var b = $H();
    for (var f = 0; f < r.size(); f++) {
        for (var e = 0; e < r[f].allCourses.size(); e++) {
            var l = r[f].allCourses[e];
            b.set(l.id, 1);
            m.set(l.subjectType.id, 1);
            var s = l.curriculum;
            if (a.get(s.id) == null) {
                a.set(s.id, s);
            }
        }
    }
    d = a.values();
    var g = [];
    for (var o = 0; o < d.size(); o++) {
        var d = d[o];
        var p = [];
        for (var h = 0; h < d.courses.size(); h++) {
            var l = d.courses[h];
            if (b.get(l.id) != null) {
                p.push(l);
            }
        }
        var q = {
            id: d.id,
            name: d.name
        };
        q.courses = p;
        var k = [];
        for (var e = 0; e < d.subjects.size(); e++) {
            var n = d.subjects[e];
            if (m.get(n.type.id) != null) {
                k.push(n);
            }
        }
        q.subjects = k;
        g.push(q);
    }
    return g;
},
curriculaList: function() {
    if (gmainv2PH.groupObj.groupData.curriculums.length > 0) {
        gmainv2PH.groupObj.activeAdmissionList.each(function(c) {
            gmainv2PH.groupObj.groupData.curriculums.each(function(d) {
                if (typeof d.activeAdmissions == "undefined") {
                    d.activeAdmissions = true;
                }
                if (c.curriculum.id == d.id) {
                    d.activeAdmissions = true;
                }
            });
        });
        var a = TemplateEngine.parseById("hidden_g_main_overview_v2_curricula", {
            "currList": gmainv2PH.groupObj.groupData.curriculums
        });
        $("g_main_overview_v2_contacts").insert({
            "after": a
        });
        if (gmainv2PH.groupObj.groupData.curriculums.length > 1) {
            var b = $A();
            b.push($("g_main_overview_v2_curricula_scroller_carousel_control_prev"));
            b.push($("g_main_overview_v2_curricula_scroller_carousel_control_next"));
            $$("a.ig_main_overview_v2_curricula_scroller_carousel-jumper").each(function(c) {
                b.push(c);
            });
            if (gmainv2PH.curriculaCarousel != null) {
                gmainv2PH.curriculaCarousel.purge();
                gmainv2PH.curriculaCarousel = null;
            }
            gmainv2PH.curriculaCarousel = new EkoolCarousel("g_main_overview_v2_curricula_scroller", $("g_main_overview_v2_curricula_scroller").select(".iscroller_item"), b, {
                "skip": 1,
                "circular": true,
                "jumperClassName": "ig_main_overview_v2_curricula_scroller_carousel-jumper",
                "controlClassName": "icarousel-control"
            });
        }
    }
},
curriculaShow: function(a) {
    curriculumManager.curriculumFind(dwrNumber(a), dwrNumber(this.groupId), {
        callback: function(b) {
            gmainv2PH.curricula.push(b.returnObject);
            clayoutPH.initModalBox();
            var c = TemplateEngine.parseById("hidden_g_main_overview_v2_curricula_view", {
                "curricula": b.returnObject,
                "viewType": 0,
                "subject": null,
                "course": null,
                "studentId": null
            });
            $("modalbox_content").update(c);
        }
    });
},
curriculaSubject: function(d, e, c, a, b) {
    if ($A($(c).up("ul").select("li.closed")) != null) {
        $A($(c).up("ul").select("li.closed")).invoke("removeClassName", "closed");
    }
    if ($(c).up("li.open")) {
        $(c).up("li").addClassName("closed");
        $(c).up("li").removeClassName("open");
        $A($(c).up("div.iSection").select("li.ig_main_overview_v2_curricula_view_course")).invoke("hide");
    } else {
        gmainv2PH.checkRightsForSubjectJournal(d, function(j) {
            $A($(c).up("div.iSection").select("li.ig_main_overview_v2_curricula_view_course")).invoke("remove");
            var g = chelperPH.arrFindById(e, gmainv2PH.curricula);
            if (g != null) {
                var i = chelperPH.arrFindById(d, g.subjects);
                var f = $A();
                if (g.courses != null) {
                    g.courses.each(function(l) {
                        if (l.subject.id == i.id && l.active) {
                            f.push(l);
                        }
                    });
                }
                var k = guserPH.userAccountTypes(gmainv2PH.groupId);
                var h = "";
                if (k != null && k.size() > 0) {
                    h = TemplateEngine.parseById("hidden_g_main_overview_v2_curricula_view_courseul", {
                        "courseList": f,
                        "curriculumId": e,
                        "viewType": a,
                        "studentId": b
                    });
                    $(c).up("li").insert({
                        "after": h
                    });
                }
                h = TemplateEngine.parseById("hidden_g_main_overview_v2_curricula_view_content_subject", {
                    "subject": i,
                    curriculum: g,
                    hasRightsToSeeJournal: j
                });
                $(c).up("div.iSection").down("div.iContent").update(h);
                $A($(c).up("ul").select("a.selected")).invoke("removeClassName", "selected");
                $(c).addClassName("selected");
                if ($A($(c).up("ul").select("li.open")) != null) {
                    $A($(c).up("ul").select("li.open")).invoke("removeClassName", "open");
                }
                $(c).up("li").addClassName("open");
            }
        });
    }
    gmainv2PH.curriculaStable();
},
checkRightsForSubjectJournal: function(c, a) {
    if (false) {
        var b = true;
        a(b);
    } else {
        if (true) {
            b = true;
            a(b);
        } else {
            showLoadingIndicator(g_main_overview_v2_curriculaoverview);
            subjectJournalManager.checkRightsForSubjectJournal(c, {
                callback: function(d) {
                    b = d.returnObject;
                    if (a) {
                        a(b);
                    }
                    hideLoadingIndicator(g_main_overview_v2_curriculaoverview);
                }
            });
        }
    }
},
curriculaCourse: function(g, j, a, d, b) {
    var i = chelperPH.arrFindById(j, gmainv2PH.curricula);
    if (i != null) {
        var h = chelperPH.arrFindById(g, i.courses);
        var c = [];
        var f = [];
        if (true) {
            showLoadingIndicator($(a).up("div.iSection").down("div.iContent"));
            ccachePH.institutionObj(gmainv2PH.groupId, function(k) {
                journalManager.journalListByCourse(dwrNumber(gmainv2PH.groupId), dwrNumber(g), null, {
                    callback: function(m) {
                        c = m.returnObject.journals.sort(function(s, r) {
                            var t = sortArrObjByIdDesc(s.studyYear, r.studyYear);
                            if (t == 0) {
                                t = sortArrObjByName(s, r);
                            }
                            return t;
                        });
                        var q = m.returnObject.countList;
                        if (q != null) {
                            for (var o = 0; o < q.size(); o++) {
                                var p = chelperPH.arrFindById(q[o].journalId, c);
                                if (p != null && p.journalTeacherRels != null) {
                                    for (var l = 0; l < p.journalTeacherRels.size(); l++) {
                                        if (p.journalTeacherRels[l].teacher.id == q[o].teacherId) {
                                            p.journalTeacherRels[l].doneLessons = q[o].count;
                                        }
                                    }
                                }
                            }
                        }
                        var n = TemplateEngine.parseById("hidden_g_main_overview_v2_curricula_view_content_course", {
                            "course": h,
                            "curriculumId": j,
                            "classes": c,
                            "lessons": f
                        });
                        $(a).up("div.iSection").down("div.iContent").update(n);
                        hideLoadingIndicator($(a).up("div.iSection").down("div.iContent"));
                        gmainv2PH.curriculaStable();
                    }
                });
            });
        } else {
            var e = TemplateEngine.parseById("hidden_g_main_overview_v2_curricula_view_content_course", {
                "course": h,
                "curriculumId": j,
                "classes": c,
                "lessons": f
            });
            $(a).up("div.iSection").down("div.iContent").update(e);
        }
        $A($(a).up("ul").select("li.selected")).invoke("removeClassName", "selected");
        $(a).up("li").addClassName("selected");
    }
},
showLessonDescr: function(c, b, a) {
    clayoutPH.initModalBox();
    showLoadingIndicator($("modalbox_content"));
    journalManager.getLessonDescription(dwrNumber(c), dwrNumber(gmainv2PH.groupId), {
        callback: function(d) {
            var f = d.returnObject.lessons;
            var e = TemplateEngine.parseById("hidden_g_main_overview_v2_lessondescription", {
                "descrArr": f,
                "name": b,
                "date": a
            });
            $("modalbox_content").update(e);
            hideLoadingIndicator($("modalbox_content"));
        }
    });
},
courseEdit: function(e, d) {
    var b = chelperPH.arrFindById(d, gmainv2PH.curricula);
    if (b != null) {
        var a = chelperPH.arrFindById(e, b.courses);
        var c = null;
        if (a.subject != null) {
            c = a.subject.id;
        }
        $LAB.script(chelperPH.resourcedir + "a/curricula/js/acurriculaPH.js").wait(function() {
            acurriculaPH.show(d, c, e);
        });
    } else {
        shout("courseEdit : curriculum is null");
    }
},
curriculaAttend: function(b, a) {
    $LAB.script(chelperPH.resourcedir + "g/joinv2/js/gjoinv2PH.js").wait(function() {
        gjoinv2PH.toDivId = "schoolData";
        gjoinv2PH.show(gmainv2PH.groupId, a, b);
    });
},
services: function() {
    showLoadingIndicator("maincontent");
    chelperPH.loadTemplateHidd(chelperPH.resourcedir + gmainv2PH.foldername + "/mainv2/tpl/main_tpl.html", function() {
        var a = TemplateEngine.parseById("hidden_g_main_services", null);
        $(gmainv2PH.toDivId).update(a);
        hideLoadingIndicator("maincontent");
    });
},
gjoinv2Show: function(a) {
    $LAB.script(chelperPH.resourcedir + "g/joinv2/js/gjoinv2PH.js").wait(function() {
        gjoinv2PH.toDivId = "schoolData";
        gjoinv2PH.show(gmainv2PH.groupId, a);
    });
},
showSchoolgroupAdmission: function() {
    $LAB.script(chelperPH.resourcedir + "g/admission/js/gadmissionPH.js").wait(function() {
        gadmissionPH.show(gmainv2PH.groupId);
    });
},
showSchoolgroupDiscipline: function(a) {
    $LAB.script(chelperPH.resourcedir + "g/discipline/js/gdisciplinePH.js").wait(function() {
        gdisciplinePH.show(a);
    });
},
showInterviews: function() {
    $LAB.script(chelperPH.resourcedir + "i/inter/js/iinterPH.js").wait(function() {
        iinterPH.show(gmainv2PH.groupId);
    });
},
showServices: function() {
    $LAB.script(chelperPH.resourcedir + "e/main/js/emainPH.js").wait(function() {
        emainPH.showservicesforschool();
    });
},
toggleInstProfile: function(b, a) {
    $LAB.script(chelperPH.resourcedir + "a/profile/js/institutionProfilePH.js").wait(function() {
        if ($("schoolDatainsert")) {
            if ($("schoolDatainsert").visible()) {} else {
                $("schoolDatainsert").show();
                $("schoolDatamaincontent").hide();
                $("dash_page_menu_dashboard").removeClassName("selected");
                $$(".toolbar2 li").invoke("removeClassName", "selected");
                $("dash_page_menu_profile").addClassName("selected");
                institutionProfilePH.show("schoolDatainsert", gmainv2PH.groupId);
            }
        }
    });
},
publish: function() {
    $LAB.script(chelperPH.resourcedir + "a/profile/js/institutionProfilePH.js").wait(function() {
        institutionProfilePH.publish(gmainv2PH.groupId, function() {
            ccachePH.groupObjEmpty(gmainv2PH.groupId);
            ccachePH.groupObj(gmainv2PH.groupId, false, function(a) {
                gmainv2PH.groupObj = a;
                if ((gmainv2PH.groupObj.publishReqCount && gmainv2PH.groupObj.publishReqCount > 0 || gmainv2PH.groupObj.groupData.published == true)) {
                    if ($("g_main_publishbutton")) {
                        $("g_main_publishbutton").remove();
                    }
                    $("schoolDataheader").removeClassName("PT40");
                }
                gmainv2PH.showButtons();
            });
        });
    });
},
curriculaStable: function() {
    $jQ("#g_main_overview_v2_curriculaoverview .list").removeAttr("style");
    if ($jQ("#g_main_overview_v2_curriculaoverview .list").height() < $jQ("#g_main_overview_v2_curriculaoverview").height()) {
        $jQ("#g_main_overview_v2_curriculaoverview .list").css({
            height: $jQ("#g_main_overview_v2_curriculaoverview").height() + "px"
        });
    }
},
getAbsenceNoticeNotifications: function(a) {
    if (true) {
        schoolManager.getAbsenceNoticesNotifications(dwrNumber(gmainv2PH.groupId), {
            callback: function(b) {
                if (b.returnObject.id == dwrNumber(gmainv2PH.groupId)) {
                    var e = b.returnObject.list;
                    var d = null;
                    for (var c = 0; c < e.length; c++) {
                        d = e[c].studyYearId + "_" + e[c].classLevelId + "_" + e[c].parallelId;
                        gmainv2PH.absenceNoticesNotifMap.set(d, e[c]);
                    }
                    if (a != null) {
                        chelperPH.callcode(a);
                    }
                }
            }
        });
    }
},
drawAbsenceNoticeNotifications: function() {
    if (gmainv2PH.absenceNoticesNotifMap != null) {
        var c = gmainv2PH.absenceNoticesNotifMap.values();
        var a = null;
        for (var b = 0; b < c.length; b++) {
            a = "journal_list_abs_diary_" + c[b].classLevelId + "_" + c[b].parallelId;
            if ($(a) != null) {
                if (c[b].count > 0) {
                    $(a).update(c[b].count);
                    $(a).show();
                } else {
                    $(a).update("");
                    $(a).hide();
                }
            }
        }
    }
},
showResources: function() {
    $LAB.script(chelperPH.resourcedir + "g/resources/js/gresourcesPH.js").wait(function() {
        chelperPH.loadTemplateHidd(chelperPH.resourcedir + "g/resources/tpl/gresources.html", function() {
            gresourcesPH.show(gmainv2PH.groupId);
        });
    });
},
showCafeteriaSummary: function() {
    $LAB.script(chelperPH.resourcedir + "g/cafeteria/js/cafeteriaPH.js").wait(function() {
        cafeteriaPH.show();
    });
},
showAppPromoToTeacher: function() {
    if (true) {
        var a = TemplateEngine.parseById("teacherAppPromo", null);
        $("appPromoContainer").update(a);
    }
},
navigateToAppStore: function() {
    var a = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (a) {
        window.open("https://itunes.apple.com/ee/app/ekool/id1265029469?mt=8&amp;ign-mpt=uo%3D4", "_blank");
    } else {
        window.open("https://play.google.com/store/apps/details?id=eu.ekool.mobile", "_blank");
    }
}
};