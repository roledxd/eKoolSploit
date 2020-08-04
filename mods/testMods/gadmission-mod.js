var gadmissionPH = {
    foldername: "g/admission",
    instId: null,
    currClassLevelId: null,
    admissions: null,
    admissionsRequestCountMap: null,
    institutionCountMap: null,
    refListSearchStr: null,
    status: 1,
    studentsRequests: [],
    admissionListShort: [],
    refItem: null,
    selPartnerId: null,
    requeredPlaceStudents: null,
    assignedPlacesMap: null,
    assignedPlacesTotal: 0,
    isStudentsNode: false,
    selPartner: null,
    firstResult: 0,
    SCHOOL_STUD_FILTER: {
        CONFIRMED_SCHOOL: 0,
        WITHOUT_PLACE: 1,
        ALL: 2,
        DESIGNATED: 3,
        CONFIRMED_SG: 4,
        WISH: 5,
        DENIED_CANCELLED: 6
    },
    MENU_ITEMS: {
        SETTINGS: 0,
        SCHOOLS: 1,
        DECISIONS: 2,
        REF_LIST: 3,
        EXEMPT: 4,
        CHANGES: 5,
    },
    SUB_MENU_ITEMS: {
        LANGUAGE: 0,
        GEOLOCATION: 1,
        ADDRESS: 2
    },
    selMenuItem: null,
    selSubMenuItem: null,
    currDistList: null,
    requestInfoMap: null,
    dummy: function() {},
    show: function(c) {
        gadmissionPH.instId = c;
        gadmissionPH.admissions = null;
        gadmissionPH.currClassLevelId = null;
        gadmissionPH.refListSearchStr = null;
        gadmissionPH.isExempt = false;
        gadmissionPH.status = 1;
        gadmissionPH.studentsRequests = [];
        gadmissionPH.admissionListShort = [];
        gadmissionPH.refItem = null;
        gadmissionPH.requeredPlaceStudents = null;
        gadmissionPH.assignedPlacesMap = null;
        gadmissionPH.isStudentsNode = false;
        gadmissionPH.selMenuItem = null;
        gadmissionPH.selSubMenuItem = null;
        gadmissionPH.currDistList = [];
        gadmissionPH.requestInfoMap = $H();
        chelperPH.loadTemplateHidd(chelperPH.resourcedir + gadmissionPH.foldername + "/tpl/year2012_sg.html", function() {});
        $LAB.script(chelperPH.resourcedir + "g/admission/js/sgadmissionPH.js").wait(function() {});
        $LAB.script(chelperPH.resourcedir + "c/app/js/cappPH.js").wait(function() {});
        var e = true;
        var d = true;
        chelperPH.loadTemplateHidd(chelperPH.resourcedir + gadmissionPH.foldername + "/tpl/admission.html", function() {
            chelperPH.loadTemplateHidd(chelperPH.resourcedir + gadmissionPH.foldername + "/tpl/year2012_sg.html", function() {
                $LAB.script(chelperPH.resourcedir + "g/admission/js/sgadmissionPH.js").wait(function() {
                    $LAB.script(chelperPH.resourcedir + "c/app/js/cappPH.js").wait(function() {
                        var f = " Приём учащихся ";
                        cappPH.initAppV2(APP_LAYOUT.TABS, f, {
                            "useButtons": true,
                            "useSearch": true
                        }, function() {
                            cappPH.initTree(1, 0, gadmissionPH.toolbarClick, 0, "Новый", function() {
                                var g = $A();
                                if (e) {
                                    g.push({
                                        "id": 5,
                                        "name": "Настройки",
                                        "instanceClass": "",
                                        "clickCb": sgadmissionPH.settingsClick
                                    });
                                    g.push({
                                        "id": 1,
                                        "name": "Приём учащихся "
                                    });
                                }
                                if (e || d) {
                                    g.push({
                                        "id": 2,
                                        "name": "Ученики"
                                    });
                                }
                                cappPH.treeArrAdd(g, null, null, null, null);
                                g = $A();
                                if (e) {
                                    g.push({
                                        "id": 1,
                                        "name": "Школы"
                                    });
                                    g.push({
                                        "id": 3,
                                        "name": "Решения"
                                    });
                                    cappPH.treeArrAdd(g, 1, gadmissionPH.schoolsClick, null, gadmissionPH.itemDel);
                                }
                                g = $A();
                                if (e || d) {
                                    g.push({
                                        "id": 3,
                                        "name": "Справочный лист"
                                    });
                                    if (e) {
                                        g.push({
                                            "id": 4,
                                            "name": "Исключить из списка"
                                        });
                                        g.push({
                                            "id": 5,
                                            "name": "Изменения в справочном списке"
                                        });
                                    }
                                    cappPH.treeArrAdd(g, 2, gadmissionPH.studentsClick, null, gadmissionPH.itemDel);
                                }
                                cappPH.draw();
                            });
                        });
                    });
                });
            });
        });
    },
    changesClick: function() {
        $LAB.script(chelperPH.resourcedir + "g/admission/js/sgRefItemsChangesPH.js").wait(function() {
            sgRefItemsChangesPH.show();
            hideLoadingIndicator("appContent");
        });
    },
    schoolsClick: function(d) {
        var c = TemplateEngine.parseById("g_admission_struct", {});
        $("appContent").update(c);
        gadmissionPH.refListSearchStr = null;
        gadmissionPH.status = 1;
        gadmissionPH.studentsRequests = [];
        gadmissionPH.refItem = null;
        gadmissionPH.isStudentsNode = false;
        gadmissionPH.assignedPlacesMap = null;
        if (d.id == 2) {
            gadmissionPH.currClassLevelId = null;
            gadmissionPH.admissionList();
        } else {
            if (d.id == 1) {
                gadmissionPH.selMenuItem = gadmissionPH.MENU_ITEMS.SCHOOLS;
                gadmissionPH.schoolsList();
            } else {
                if (d.id == 3) {
                    gadmissionPH.selMenuItem = gadmissionPH.MENU_ITEMS.DECISIONS;
                    showLoadingIndicator("appContent");
                    $LAB.script(chelperPH.resourcedir + "g/admission/js/sgdecisionPH.js").wait(function() {
                        sgdecisionPH.show();
                        hideLoadingIndicator("appContent");
                    });
                } else {
                    alert("Oops.. new tree item element");
                }
            }
        }
    },
    schoolsList: function() {
        ccachePH.partnerList(gadmissionPH.instId, function(f) {
            gadmissionPH.institutionCountMap = $H();
            var c = {};
            c.requestCount = 0;
            c.designatedPlaces = 0;
            c.confirmedPlaces = 0;
            c.totalPlaces = 0;
            c.autoDesignatedPlaces = 0;
            for (var e = 0; e < f.size(); e++) {
                if (f[e].placesAmount != null) {
                    c.totalPlaces += f[e].placesAmount;
                }
                if (f[e].designatedPlaces != null) {
                    c.designatedPlaces += f[e].designatedPlaces;
                }
                if (f[e].confirmedPlaces != null) {
                    c.confirmedPlaces += f[e].confirmedPlaces;
                }
                if (f[e].autodesigcount != null) {
                    c.autoDesignatedPlaces += f[e].autodesigcount;
                }
            }
            var d = TemplateEngine.parseById("g_admission_schools", {
                "partnerList": f,
                "totalObj": c
            });
            $("g_admission_content").update(d);
        });
    },
    schoolsShow: function(c) {
        $("g_admission_content").show();
        $("g_admission_nav").update("");
        gadmissionPH.selPartnerId = c;
        gadmissionPH.firstResult = 0;
        showLoadingIndicator("appContent");
        schoolManager.partnerList(dwrNumber(gadmissionPH.instId), {
            callback: function(e) {
                gadmissionPH.selPartner = chelperPH.arrFindById(c, e.returnObject);
                var f = TemplateEngine.parseById("g_admission_schools_school_show", {
                    "partner": gadmissionPH.selPartner
                });
                $("g_admission_content").update(f);
                var d = $A();
                d.push({
                    "id": gadmissionPH.SCHOOL_STUD_FILTER.CONFIRMED_SG,
                    "name": "Имеет место в данной школе(школьная группа)"
                });
                d.push({
                    "id": gadmissionPH.SCHOOL_STUD_FILTER.DESIGNATED,
                    "name": "Назначенный"
                });
                d.push({
                    "id": gadmissionPH.SCHOOL_STUD_FILTER.WITHOUT_PLACE,
                    "name": "Нет места в школе"
                });
                d.push({
                    "id": gadmissionPH.SCHOOL_STUD_FILTER.WISH,
                    "name": "Желает поступить"
                });
                d.push({
                    "id": gadmissionPH.SCHOOL_STUD_FILTER.ALL,
                    "name": "Справочный лист"
                });
                d.push({
                    "id": gadmissionPH.SCHOOL_STUD_FILTER.CONFIRMED_SCHOOL,
                    "name": "Родители подтвердили"
                });
                d.push({
                    "id": gadmissionPH.SCHOOL_STUD_FILTER.DENIED_CANCELLED,
                    "name": "Отказано/Аннулировано"
                });
                var h = $A();
                h.push({
                    "id": "",
                    "name": "-"
                });
                h.push({
                    "id": "et",
                    "name": "эстонский язык"
                });
                h.push({
                    "id": "ru",
                    "name": "русский язык"
                });
                var g = null;
                if (gadmissionPH.selPartner.child.language) {
                    g = gadmissionPH.selPartner.child.language;
                }
                gadmissionPH.cfilterPH = new cfilterPH(d, false, false, gadmissionPH.schoolsShowFilter, gadmissionPH.SCHOOL_STUD_FILTER.DESIGNATED, null, "g_admission_schools_school_persons_filter", h, null, null, g);
                gadmissionPH.schoolsShowPersonsListDesignated(c, g);
                hideLoadingIndicator("appContent");
            }
        });
    },
    schoolsShowPersonsListSchool: function(d, c) {
        showLoadingIndicator("appContent");
        admissionManager.refListItemDistListSchool(dwrNumber(d), c, {
            callback: function(f) {
                var e = f.returnObject.refListItems;
                var g = $H(f.returnObject.requestInfoMap);
                if (!e || e.size() == 0) {
                    gadmissionPH.schoolsShowPersonsListNoContent();
                } else {
                    gadmissionPH.schoolsShowPersonsListDraw(d, e, "school", g);
                }
                hideLoadingIndicator("appContent");
            }
        });
    },
    schoolsShowPersonsListDeniedOrCancelled: function(d, c) {
        showLoadingIndicator("appContent");
        admissionManager.refListItemDistListDeniedOrCancelled(dwrNumber(d), c, {
            callback: function(f) {
                var e = f.returnObject.refListItems;
                var g = $H(f.returnObject.requestInfoMap);
                if (!e || e.size() == 0) {
                    gadmissionPH.schoolsShowPersonsListNoContent();
                } else {
                    gadmissionPH.schoolsShowPersonsListDraw(d, e, "school", g);
                }
                hideLoadingIndicator("appContent");
            }
        });
    },
    schoolsShowPersonsListNoplacePrev: function() {
        var c = 0;
        if (gadmissionPH.firstResult) {
            c = gadmissionPH.firstResult;
        }
        c = c - 50;
        if (c < 0) {
            c = 0;
        }
        gadmissionPH.schoolsShowPersonsListNoplace(gadmissionPH.partnerId, gadmissionPH.lang, c);
    },
    schoolsShowPersonsListNoplaceNext: function() {
        var c = 0;
        if (gadmissionPH.firstResult) {
            c = gadmissionPH.firstResult;
        }
        c = c + 50;
        gadmissionPH.schoolsShowPersonsListNoplace(gadmissionPH.partnerId, gadmissionPH.lang, c);
    },
    schoolsShowPersonsListNoplace: function(e, d, c) {
        showLoadingIndicator("appContent");
        gadmissionPH.partnerId = e;
        gadmissionPH.lang = d;
        gadmissionPH.firstResult = c;
        if (!gadmissionPH.firstResult) {
            gadmissionPH.firstResult = 0;
        }
        refListItemManager.getRefListItemDistListNoplace(dwrNumber(gadmissionPH.partnerId), gadmissionPH.lang, dwrNumber(gadmissionPH.firstResult), {
            callback: function(g) {
                var f = g.returnObject.refListItems;
                var h = $H(g.returnObject.requestInfoMap);
                if (!f || f.size() == 0) {
                    gadmissionPH.schoolsShowPersonsListNoContent();
                } else {
                    gadmissionPH.schoolsShowPersonsListDraw(e, f, "noplace", h);
                }
                hideLoadingIndicator("appContent");
            }
        });
    },
    schoolsShowPersonsListAllPrev: function() {
        var c = 0;
        if (gadmissionPH.firstResult) {
            c = gadmissionPH.firstResult;
        }
        c = c - 50;
        if (c < 0) {
            c = 0;
        }
        gadmissionPH.schoolsShowPersonsListAll(gadmissionPH.partnerId, gadmissionPH.lang, c);
    },
    schoolsShowPersonsListAllNext: function() {
        var c = 0;
        if (gadmissionPH.firstResult) {
            c = gadmissionPH.firstResult;
        }
        c = c + 50;
        gadmissionPH.schoolsShowPersonsListAll(gadmissionPH.partnerId, gadmissionPH.lang, c);
    },
    schoolsShowPersonsListAll: function(e, d, c) {
        showLoadingIndicator("appContent");
        gadmissionPH.partnerId = e;
        gadmissionPH.lang = d;
        gadmissionPH.firstResult = c;
        if (!gadmissionPH.firstResult) {
            gadmissionPH.firstResult = 0;
        }
        refListItemManager.getRefListItemDistListAll(dwrNumber(gadmissionPH.partnerId), gadmissionPH.lang, dwrNumber(gadmissionPH.firstResult), {
            callback: function(g) {
                var f = g.returnObject.refListItems;
                var h = $H(g.returnObject.requestInfoMap);
                if (!f || f.size() == 0) {
                    gadmissionPH.schoolsShowPersonsListNoContent();
                } else {
                    gadmissionPH.schoolsShowPersonsListDraw(e, f, "all", h);
                }
                hideLoadingIndicator("appContent");
            }
        });
    },
    schoolsShowPersonsListWishPrev: function() {
        var c = 0;
        if (gadmissionPH.firstResult) {
            c = gadmissionPH.firstResult;
        }
        c = c - 50;
        if (c < 0) {
            c = 0;
        }
        gadmissionPH.schoolsShowPersonsListWish(gadmissionPH.partnerId, gadmissionPH.lang, c);
    },
    schoolsShowPersonsListWishNext: function() {
        var c = 0;
        if (gadmissionPH.firstResult) {
            c = gadmissionPH.firstResult;
        }
        c = c + 50;
        gadmissionPH.schoolsShowPersonsListWish(gadmissionPH.partnerId, gadmissionPH.lang, c);
    },
    schoolsShowPersonsListWish: function(e, d, c) {
        showLoadingIndicator("appContent");
        gadmissionPH.partnerId = e;
        gadmissionPH.lang = d;
        gadmissionPH.firstResult = c;
        if (!gadmissionPH.firstResult) {
            gadmissionPH.firstResult = 0;
        }
        refListItemManager.getRefListItemDistListWishAttend(dwrNumber(gadmissionPH.partnerId), gadmissionPH.lang, dwrNumber(gadmissionPH.firstResult), {
            callback: function(g) {
                var f = g.returnObject.refListItems;
                var h = $H(g.returnObject.requestInfoMap);
                if (!f || f.size() == 0) {
                    gadmissionPH.schoolsShowPersonsListNoContent();
                } else {
                    gadmissionPH.schoolsShowPersonsListDraw(e, f, "wish", h);
                }
                hideLoadingIndicator("appContent");
            }
        });
    },
    schoolsShowPersonsListDesignated: function(d, c) {
        showLoadingIndicator("appContent");
        gadmissionPH.partnerId = d;
        gadmissionPH.lang = c;
        refListItemManager.getRefListItemDistListDesignated(dwrNumber(gadmissionPH.partnerId), gadmissionPH.lang, {
            callback: function(f) {
                var e = f.returnObject.refListItems;
                var g = $H(f.returnObject.requestInfoMap);
                if (!e || e.size() == 0) {
                    gadmissionPH.schoolsShowPersonsListNoContent();
                } else {
                    gadmissionPH.schoolsShowPersonsListDraw(d, e, "designated", g);
                }
                hideLoadingIndicator("appContent");
            }
        });
    },
    schoolsShowPersonsListConfirmed: function(d, c) {
        showLoadingIndicator("appContent");
        gadmissionPH.partnerId = d;
        gadmissionPH.lang = c;
        refListItemManager.getRefListItemDistListConfirmed(dwrNumber(gadmissionPH.partnerId), gadmissionPH.lang, {
            callback: function(f) {
                var e = f.returnObject.refListItems;
                var g = $H(f.returnObject.requestInfoMap);
                if (!e || e.size() == 0) {
                    gadmissionPH.schoolsShowPersonsListNoContent();
                } else {
                    gadmissionPH.schoolsShowPersonsListDraw(d, e, "designated", g);
                }
                hideLoadingIndicator("appContent");
            }
        });
    },
    schoolsShowPersonsListNoContent: function() {
        var c = {};
        c.title = "Претенденты не найдены.";
        clayoutPH.nocontent("g_admission_schools_school_persons_list", c);
    },
    schoolsShowPersonsListDraw: function(i, c, e, g) {
        var h = $A();
        c.each(function(j) {
            h.push({
                "idCode": j.referenceListItem.idCode,
                "idIssuedById": j.referenceListItem.idIssuedBy.id
            });
        });
        if (g == null) {
            g = $H();
        }
        gadmissionPH.currDistList = c;
        gadmissionPH.requestInfoMap = g;
        var f = $H();
        var d = TemplateEngine.parseById("g_admission_schools_school_persons_list", {
            "distList": c,
            "countsMap": f,
            "type": e,
            "requestInfoMap": g,
            "partnerId": i
        });
        $("g_admission_schools_school_persons_list").update(d);
    },
    schoolsShowFilter: function(f, d, c, h, e) {
        if (f == gadmissionPH.SCHOOL_STUD_FILTER.CONFIRMED_SG) {
            gadmissionPH.schoolsShowPersonsListConfirmed(gadmissionPH.selPartnerId, h);
        } else {
            if (f == gadmissionPH.SCHOOL_STUD_FILTER.DESIGNATED) {
                gadmissionPH.schoolsShowPersonsListDesignated(gadmissionPH.selPartnerId, h);
            } else {
                if (f == gadmissionPH.SCHOOL_STUD_FILTER.WITHOUT_PLACE) {
                    gadmissionPH.firstResult = 0;
                    gadmissionPH.schoolsShowPersonsListNoplace(gadmissionPH.selPartnerId, h, e);
                } else {
                    if (f == gadmissionPH.SCHOOL_STUD_FILTER.ALL) {
                        gadmissionPH.firstResult = 0;
                        gadmissionPH.schoolsShowPersonsListAll(gadmissionPH.selPartnerId, h, e);
                    } else {
                        if (f == gadmissionPH.SCHOOL_STUD_FILTER.CONFIRMED_SCHOOL) {
                            gadmissionPH.schoolsShowPersonsListSchool(gadmissionPH.selPartnerId, h);
                        } else {
                            if (f == gadmissionPH.SCHOOL_STUD_FILTER.WISH) {
                                gadmissionPH.firstResult = 0;
                                gadmissionPH.schoolsShowPersonsListWish(gadmissionPH.selPartnerId, h, e);
                            } else {
                                if (f == gadmissionPH.SCHOOL_STUD_FILTER.DENIED_CANCELLED) {
                                    gadmissionPH.firstResult = 0;
                                    gadmissionPH.schoolsShowPersonsListDeniedOrCancelled(gadmissionPH.selPartnerId, h);
                                } else {
                                    var g = {};
                                    g.title = "Unknown filter type";
                                    clayoutPH.nocontent("g_admission_schools_school_persons_list", g);
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    schoolsShowPartnerForm: function(c) {
        showLoadingIndicator("appContent");
        schoolManager.partnerList(dwrNumber(gadmissionPH.instId), {
            callback: function(d) {
                var f = chelperPH.arrFindById(c, d.returnObject);
                var e = TemplateEngine.parseById("g_admission_schools_school_show_partner_form", {
                    "partner": f
                });
                $("g_admission_content").update(e);
                hideLoadingIndicator("appContent");
            }
        });
    },
    schoolsShowPartnerFormSubmit: function() {
        showLoadingIndicator("appContent");
        var c = $("g_admission_schools_school_show_partner_form").getData();
        admissionManager.partnerSave(c.partner, {
            callback: function(d) {
                if (!d.isError) {
                    ccachePH.partnerListEmpty(gadmissionPH.instId);
                    gadmissionPH.schoolsShow(c.partner.id);
                    hideLoadingIndicator("appContent");
                }
            }
        });
    },
    schoolsShowPartnerFormCancel: function() {
        var c = $("g_admission_schools_school_show_partner_form").getData();
        gadmissionPH.schoolsShow(c.partner.id);
    },
    showConfirmedImportForm: function(d) {
        var c = TemplateEngine.parseById("g_admission_confirmed_students_import_form", {
            "partnerId": d
        });
        $("g_admission_content").update(c);
    },
    cancelConfirmedImportForm: function(c) {
        gadmissionPH.schoolsShow(c);
    },
    importConfirmedStudents: function(c) {
        showLoadingIndicator("appContent");
        admissionImportExportManager.importConfirmedStudents(dwrNumber(gadmissionPH.instId), dwrNumber(c), $("g_admission_students_import_form_file"), {
            callback: function(d) {
                var e = TemplateEngine.parseById("g_admission_confirmed_students_import_form_done", {
                    "failedList": d.returnObject.failed,
                    "warningList": d.returnObject.warnings,
                    "okCount": d.returnObject.successful,
                    "partnerId": c
                });
                $("g_admission_content").update(e);
                ccachePH.partnerListEmpty(gadmissionPH.instId);
                ccachePH.partnerList(gadmissionPH.instId, function(f) {
                    hideLoadingIndicator("appContent");
                });
            }
        });
    },
    admissionList: function() {
        showLoadingIndicator("appContent");
        ccachePH.classLevelList(function(c) {
            gadmissionPH.getAdmissionList(function(d, e) {
                gadmissionPH.drawAdmissionReport(d, e);
                hideLoadingIndicator("appContent");
            });
        });
    },
    getAdmissionList: function(c) {
        showLoadingIndicator("appContent");
        admissionManager.schoolGroupAdmissionList(dwrNumber(gadmissionPH.instId), {
            callback: function(d) {
                gadmissionPH.admissions = d.returnObject.list.sort(function(f, e) {
                    var g = sortArrObjByName(f.institution, e.institution);
                    if (g == 0) {
                        g = sortClassLevels(f.classLevel, e.classLevel);
                        if (g == 0) {
                            g = sortArrObjByName(f.curriculum, e.curriculum);
                        }
                    }
                    return g;
                });
                gadmissionPH.admissionsRequestCountMap = $H();
                gadmissionPH.requeredPlaceStudents = d.returnObject.requeredPlaceStudents;
                if (d.returnObject.reqCountMap != null) {
                    d.returnObject.reqCountMap.each(function(e) {
                        gadmissionPH.admissionsRequestCountMap.set(e.admissionId, e.count);
                    });
                }
                gadmissionPH.assignedPlacesMap = $H();
                gadmissionPH.assignedPlacesTotal = 0;
                if (d.returnObject.assignedPlacesList != null) {
                    d.returnObject.assignedPlacesList.each(function(e) {
                        gadmissionPH.assignedPlacesMap.set(e.instId, e.count);
                        gadmissionPH.assignedPlacesTotal += e.count;
                    });
                }
                gadmissionPH.institutionCountMap = $H();
                hideLoadingIndicator("appContent");
                chelperPH.applycode(c, [gadmissionPH.admissions, gadmissionPH.admissionsRequestCountMap, gadmissionPH.institutionCountMap]);
            }
        });
    },
    studentsFullList: function() {
        showLoadingIndicator("appContent");
        $("g_admission_content").show();
        $("g_admission_nav").update("");
        var c = true;
        admissionManager.refListSummary(dwrNumber(gadmissionPH.instId), gadmissionPH.status, {
            callback: function(d) {
                var e = TemplateEngine.parseById("g_admission_schools_students", {
                    "summary": d.returnObject,
                    "status": gadmissionPH.status,
                    "isAdmSupervisor": c,
                    "isExempt": gadmissionPH.isExempt
                });
                $("g_admission_content").update(e);
                var f = $("g_admission_schools_ref_list_searchForm");
                f["searchString"].setValue(gadmissionPH.refListSearchStr);
                hideLoadingIndicator("appContent");
                if (gadmissionPH.refListSearchStr != null && gadmissionPH.refListSearchStr.length > 0) {
                    gadmissionPH.searchInRefListItemList();
                }
            }
        });
    },
    onStatusChange: function(c) {
        if (gadmissionPH.status != c) {
            if ($("g_admission_schools_school_persons_filter_find_coords") != null) {
                $("g_admission_schools_school_persons_filter_find_coords").hide();
            }
            gadmissionPH.status = c;
            gadmissionPH.studentsFullList();
        }
    },
    searchInRefListItemList: function() {
        var d = $("g_admission_schools_ref_list_searchForm");
        d.clearErrors();
        var e = d.getData();
        var c = e.searchString;
        gadmissionPH.refListSearchStr = e.searchString;
        if ((c != null && c.length > 0) || (gadmissionPH.status == REFERENCE_LIST_STATUSES.REQUEST)) {
            showLoadingIndicator("appContent");
            admissionManager.refListItemListSearch(dwrNumber(gadmissionPH.instId), c, gadmissionPH.status, {
                callback: function(f) {
                    var h = f.returnObject.sort(sortMemberByLastName);
                    var g = TemplateEngine.parseById("g_admission_schools_students_ref_list", {
                        "list": h
                    });
                    $("g_admission_schools_school_persons_list").update(g);
                    hideLoadingIndicator("appContent");
                }
            });
        } else {
            d.showError("searchString", "Пожалуйста, введите имя или личный код");
        }
    },
    getMissingLanguageRefItems: function() {
        showLoadingIndicator("appContent");
        gadmissionPH.selSubMenuItem = gadmissionPH.SUB_MENU_ITEMS.LANGUAGE;
        if ($("g_admission_schools_school_persons_filter_find_coords") != null) {
            $("g_admission_schools_school_persons_filter_find_coords").hide();
        }
        refListItemManager.getMissingDataRefItems(gadmissionPH.status, true, false, false, {
            callback: function(c) {
                var e = c.returnObject.sort(sortMemberByLastName);
                var d = TemplateEngine.parseById("g_admission_schools_students_ref_list", {
                    "list": e
                });
                $("g_admission_schools_school_persons_list").update(d);
                hideLoadingIndicator("appContent");
            }
        });
    },
    getMissingCoordinatesRefItems: function() {
        showLoadingIndicator("appContent");
        gadmissionPH.selSubMenuItem = gadmissionPH.SUB_MENU_ITEMS.GEOLOCATION;
        if ($("g_admission_schools_school_persons_filter_find_coords") != null) {
            $("g_admission_schools_school_persons_filter_find_coords").show();
        }
        refListItemManager.getMissingDataRefItems(gadmissionPH.status, false, true, false, {
            callback: function(c) {
                var e = c.returnObject.sort(sortMemberByLastName);
                var d = TemplateEngine.parseById("g_admission_schools_students_ref_list", {
                    "list": e
                });
                $("g_admission_schools_school_persons_list").update(d);
                hideLoadingIndicator("appContent");
            }
        });
    },
    getMissingAddressRefItems: function() {
        showLoadingIndicator("appContent");
        gadmissionPH.selSubMenuItem = gadmissionPH.SUB_MENU_ITEMS.ADDRESS;
        if ($("g_admission_schools_school_persons_filter_find_coords") != null) {
            $("g_admission_schools_school_persons_filter_find_coords").hide();
        }
        refListItemManager.getMissingDataRefItems(gadmissionPH.status, false, false, true, {
            callback: function(c) {
                var e = c.returnObject.sort(sortMemberByLastName);
                var d = TemplateEngine.parseById("g_admission_schools_students_ref_list", {
                    "list": e
                });
                $("g_admission_schools_school_persons_list").update(d);
                hideLoadingIndicator("appContent");
            }
        });
    },
    studentsPage: function(d) {
        showLoadingIndicator("appContent");
        gadmissionPH.studentsRequests = [];
        gadmissionPH.refItem = null;
        var c = true;
        admissionManager.refListItemFind(dwrNumber(gadmissionPH.instId), d, {
            callback: function(g) {
                var e = null;
                var f = null;
                if (g.returnObject.refItem == null) {
                    e = {
                        "id": -1,
                        "address": {
                            "id": ""
                        }
                    };
                    shout("refListItem is not found");
                    $("g_admission_nav").update("Error");
                    hideLoadingIndicator("appContent");
                } else {
                    e = g.returnObject.refItem;
                    if (g.returnObject.revocationLogList != null) {
                        f = g.returnObject.revocationLogList.sort(sortByLogTimeAsc);
                    }
                    ccachePH.exemptReasonList(gadmissionPH.instId, function(h) {
                        ccachePH.partnerList(gadmissionPH.instId, function(i) {
                            $LAB.script(chelperPH.resourcedir + "g/admission/js/sgCoordinatesPH.js").wait(function() {
                                $LAB.script(chelperPH.resourcedir + "g/joinv2/js/gjoinv2PH.js").wait(function() {
                                    $LAB.script(chelperPH.resourcedir + "g/admission/js/screquestPH.js").wait(function() {
                                        chelperPH.loadTemplateHidd(chelperPH.resourcedir + "g/admission/tpl/year2012_parent.html", function() {
                                            chelperPH.loadTemplateHidd(chelperPH.resourcedir + "g/joinv2/tpl/join_v2.html", function() {
                                                ccachePH.statesList(function(j) {
                                                    if (g.returnObject.logs != null) {
                                                        g.returnObject.logs.sort(sortByLogTimeDesc);
                                                    }
                                                    var l = TemplateEngine.parseById("hidden_g_admission_student_page", {
                                                        "refItem": e,
                                                        "logs": g.returnObject.logs,
                                                        "nearestPartnerList": g.returnObject.nearestPartnerList
                                                    });
                                                    $("g_admission_nav").update(l);
                                                    $("g_admission_student_page_request_info_ph").hide();
                                                    $("g_admission_content").hide();
                                                    var k = $(document.createElement("form"));
                                                    k.id = "formAdmissionStudent";
                                                    k.setDataObj({
                                                        "refListItem": e
                                                    });
                                                    k.addDataHelper("stateList", j);
                                                    k.addDataHelper("exemptReasonList", h);
                                                    k.addDataHelper("instId", gadmissionPH.instId);
                                                    k.bindSaveAction(gadmissionPH.studentsFormSubmit);
                                                    k.drawViewMode($("g_admission_nav_student_card"));
                                                    gadmissionPH.studentsRequests = g.returnObject.requestList.sort(function(q, r) {
                                                        a = nvl(q.instName).toLocaleLowerCase();
                                                        b = nvl(r.instName).toLocaleLowerCase();
                                                        var s = a.localeCompare(b);
                                                        if (s == 0) {
                                                            if (q.status < r.status) {
                                                                s = -1;
                                                            } else {
                                                                if (q.status > r.status) {
                                                                    s = 1;
                                                                }
                                                            }
                                                        }
                                                        return s;
                                                    });
                                                    hideLoadingIndicator("appContent");
                                                    l = TemplateEngine.parseById("hidden_g_admission_student_page_requests", {
                                                        "schoolGroupRequestList": g.returnObject.schoolGroupRequestList,
                                                        "requestList": gadmissionPH.studentsRequests,
                                                        "refItem": e,
                                                        "status": gadmissionPH.status,
                                                        "isExempt": gadmissionPH.isExempt
                                                    });
                                                    $("g_admission_nav_student_requests").update(l);
                                                    if (g.returnObject.dataChangesList != null && g.returnObject.dataChangesList.size() > 0) {
                                                        g.returnObject.dataChangesList.sort(sortByCreatedAsc);
                                                        l = TemplateEngine.parseById("hidden_g_admission_nav_student_ref_changes_tpl", {
                                                            "changesList": g.returnObject.dataChangesList
                                                        });
                                                        $("g_admission_nav_student_ref_changes").update(l);
                                                    }
                                                    if ($("gadmission_new_schoolGroupRequest_form_ph") != null) {
                                                        screquestPH.schoolGroupId = gadmissionPH.instId;
                                                        var p = $(document.createElement("form"));
                                                        p.id = "formAdmissionSchoolGroupRequest";
                                                        var o = {};
                                                        o.guardian = {
                                                            "idIssuedBy": {
                                                                id: 1
                                                            }
                                                        };
                                                        p.setDataObj(o);
                                                        p.bindSaveAction(sgadmissionPH.saveSchoolGroupRequest);
                                                        p.drawViewMode($("gadmission_new_schoolGroupRequest_form_ph"));
                                                    }
                                                    if ($("gadmission_designatedSchool_form_ph") != null) {
                                                        screquestPH.schoolGroupId = gadmissionPH.instId;
                                                        var n = e.designatedPartner;
                                                        if (n == null) {
                                                            n = {};
                                                        }
                                                        var p = $(document.createElement("form"));
                                                        p.id = "formAdmissionDesignatedSchool";
                                                        p.setDataObj(n);
                                                        p.addDataHelper("partnerList", i);
                                                        p.addDataHelper("refItem", e);
                                                        p.addDataHelper("revocationLogList", f);
                                                        p.addDataHelper("isAllowedEdit", true);
                                                        p.bindSaveAction(sgadmissionPH.designateSchool);
                                                        p.drawViewMode($("gadmission_designatedSchool_form_ph"));
                                                    }
                                                    if ($("gadmission_confirmedSchool_form_ph") != null) {
                                                        screquestPH.schoolGroupId = gadmissionPH.instId;
                                                        var m = e.confirmedPartner;
                                                        if (m == null) {
                                                            m = {};
                                                        }
                                                        var p = $(document.createElement("form"));
                                                        p.id = "formAdmissionConfirmedSchool";
                                                        p.setDataObj(m);
                                                        p.addDataHelper("partnerList", i);
                                                        p.addDataHelper("refItem", e);
                                                        p.addDataHelper("isAllowedEdit", true);
                                                        p.bindSaveAction(sgadmissionPH.setConfirmedSchool);
                                                        p.drawViewMode($("gadmission_confirmedSchool_form_ph"));
                                                    }
                                                    if (e.status == REFERENCE_LIST_STATUSES.ACTIVE && $("g_admission_nav_student_exempt_ph") != null) {
                                                        var p = $(document.createElement("form"));
                                                        p.id = "formAdmissionExemptForm";
                                                        p.setDataObj({
                                                            "exemptReasons": h,
                                                            "refItemId": e.id
                                                        });
                                                        p.bindSaveAction(gadmissionPH.exemptRefListItemForm);
                                                        p.drawViewMode($("g_admission_nav_student_exempt_ph"));
                                                    }
                                                    gadmissionPH.refItem = e;
                                                    hideLoadingIndicator("appContent");
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                }
            }
        });
    },
    studentsForm: function() {
        var c = {
            "id": -1,
            "address": {
                "id": "",
                country: {
                    "id": 1
                }
            }
        };
        $LAB.script(chelperPH.resourcedir + "g/admission/js/sgCoordinatesPH.js").wait(function() {
            $LAB.script(chelperPH.resourcedir + "g/joinv2/js/gjoinv2PH.js").wait(function() {
                chelperPH.loadTemplateHidd(chelperPH.resourcedir + "g/joinv2/tpl/join_v2.html", function() {
                    ccachePH.statesList(function(d) {
                        var f = TemplateEngine.parseById("hidden_g_admission_student_page", {
                            "refItem": c,
                            "logs": []
                        });
                        $("g_admission_nav").update(f);
                        $("g_admission_content").hide();
                        var e = $(document.createElement("form"));
                        e.id = "formAdmissionStudent";
                        e.setDataObj({
                            "refListItem": c
                        });
                        e.addDataHelper("stateList", d);
                        e.addDataHelper("instId", gadmissionPH.instId);
                        e.bindSaveAction(gadmissionPH.studentsFormSubmit);
                        e.drawEditMode($("g_admission_nav_student_card"));
                    });
                });
            });
        });
    },
    studentsFormSubmit: function(e, c, d) {
        e.refListItem.address.addressType = {
            "id": 1
        };
        showLoadingIndicator("appContent");
        admissionManager.refListItemSave(e.refListItem, {
            callback: function(f) {
                if (gadmissionPH.selMenuItem == gadmissionPH.MENU_ITEMS.REF_LIST) {
                    gadmissionPH.studentsFullList();
                } else {
                    if (gadmissionPH.selMenuItem == gadmissionPH.MENU_ITEMS.EXEMPT) {
                        sgExRefItemsPH.onFilterTypeChange(sgExRefItemsPH.filterType);
                    } else {
                        if (gadmissionPH.selMenuItem == gadmissionPH.MENU_ITEMS.SCHOOLS) {
                            gadmissionPH.schoolsShow(gadmissionPH.selPartnerId);
                        } else {
                            if (gadmissionPH.selMenuItem == gadmissionPH.MENU_ITEMS.CHANGES) {
                                sgRefItemsChangesPH.onFilterChange();
                            } else {
                                shout("oops.. error gadmissionPH.selMenuItem = " + gadmissionPH.selMenuItem);
                            }
                        }
                    }
                }
                hideLoadingIndicator("appContent");
            }
        });
    },
    exemptRefListItemForm: function(f, c, e) {
        var d = $("formAdmissionExemptForm")._formData.refItemId;
        var g = null;
        if (f.exemptReason != null && f.exemptReason.id > 0) {
            g = f.exemptReason.id;
        }
        showLoadingIndicator("appContent");
        admissionManager.exemptRefListItems(true, [dwrNumber(d)], dwrNumber(g), {
            callback: function(h) {
                hideLoadingIndicator("appContent");
                ccachePH.partnerListEmpty(gadmissionPH.instId);
                if (gadmissionPH.selMenuItem == gadmissionPH.MENU_ITEMS.REF_LIST) {
                    gadmissionPH.studentsFullList();
                } else {
                    if (gadmissionPH.selMenuItem == gadmissionPH.MENU_ITEMS.EXEMPT) {
                        sgExRefItemsPH.onFilterTypeChange(sgExRefItemsPH.filterType);
                    } else {
                        if (gadmissionPH.selMenuItem == gadmissionPH.MENU_ITEMS.SCHOOLS) {
                            gadmissionPH.schoolsShow(gadmissionPH.selPartnerId);
                        } else {
                            if (gadmissionPH.selMenuItem == gadmissionPH.MENU_ITEMS.CHANGES) {
                                sgRefItemsChangesPH.onFilterChange();
                            } else {
                                shout("oops.. error gadmissionPH.selMenuItem = " + gadmissionPH.selMenuItem);
                            }
                        }
                    }
                }
            }
        });
    },
    exemptRefListItem: function(e, d) {
        var c = confirm("Вы уверены?");
        if (c) {
            showLoadingIndicator("appContent");
            admissionManager.exemptRefListItems(e, [dwrNumber(d)], null, {
                callback: function(f) {
                    hideLoadingIndicator("appContent");
                    ccachePH.partnerListEmpty(gadmissionPH.instId);
                    if (gadmissionPH.selMenuItem == gadmissionPH.MENU_ITEMS.REF_LIST) {
                        gadmissionPH.studentsFullList();
                    } else {
                        if (gadmissionPH.selMenuItem == gadmissionPH.MENU_ITEMS.EXEMPT) {
                            sgExRefItemsPH.onFilterTypeChange(sgExRefItemsPH.filterType);
                        } else {
                            if (gadmissionPH.selMenuItem == gadmissionPH.MENU_ITEMS.SCHOOLS) {
                                gadmissionPH.schoolsShow(gadmissionPH.selPartnerId);
                            } else {
                                if (gadmissionPH.selMenuItem == gadmissionPH.MENU_ITEMS.CHANGES) {
                                    sgRefItemsChangesPH.onFilterChange();
                                } else {
                                    shout("oops.. error gadmissionPH.selMenuItem = " + gadmissionPH.selMenuItem);
                                }
                            }
                        }
                    }
                }
            });
        }
    },
    showRequest: function(c) {
        $("g_admission_student_page_request_info_ph").show();
        $("g_admission_student_page").hide();
        showLoadingIndicator("g_admission_student_page_request_info_ph");
        admissionManager.showRequestInfo(c, {
            callback: function(d) {
                chelperPH.loadTemplateHidd(chelperPH.resourcedir + "a/requests/tpl/requests_tpl.html", function() {
                    var h = TemplateEngine.parseById("g_admission_schools_students_request_ref", {
                        "matchPerson": d.returnObject.refItem,
                        "request": d.returnObject.request
                    });
                    var f = TemplateEngine.parseById("hidden_a_requests_confirm_show", {
                        "request": d.returnObject.request,
                        "matchPerson": d.returnObject.refItem,
                        "actionsEnabled": false,
                        "errors": null
                    });
                    $("g_admission_student_page_request_info").update(f);
                    $("a_requests_confirm_col2").update(h);
                    var g = d.returnObject.logList.sort(sortByEventDatesAsc);
                    var e = TemplateEngine.parseById("hidden_g_admission_student_request_logs", {
                        "list": g
                    });
                    $("g_admission_student_page_request_logs_ph").update(e);
                    hideLoadingIndicator("g_admission_student_page_request_info_ph");
                });
            }
        });
    },
    hideRequest: function() {
        $("g_admission_student_page_request_info_ph").hide();
        $("g_admission_student_page_request_info").update("");
        $("g_admission_student_page").show();
    },
    showNewRequestForm: function(c) {
        showLoadingIndicator("appContent");
        admissionManager.getInfoForNewRequestBySchoolGroup(gadmissionPH.refItem.id, {
            callback: function(d) {
                $(c)._formData.other = d.returnObject.otherInfo;
                $(c).drawEditMode({
                    "cb": function() {
                        gadmissionPH.admissionListShort = d.returnObject.admissionList;
                        var e = null;
                        if (gadmissionPH.selPartner) {
                            e = gadmissionPH.selPartner.child.id;
                        }
                        var f = TemplateEngine.parseById("hidden_formAdmissionNewRequest_school", {
                            "schools": d.returnObject.partnerList,
                            "selInstId": e
                        });
                        $("formAdmissionNewRequest_schools").update(f);
                        gadmissionPH.fillCurricula($("formAdmissionNewRequest_schools"));
                    }
                });
                hideLoadingIndicator("appContent");
            }
        });
    },
    fillCurricula: function(g) {
        showLoadingIndicator("appContent");
        var d = $F(g);
        if (d == -1) {
            $("formAdmissionNewRequest_curric").update("");
            $("formAdmissionNewRequest_curric").up("li").hide();
        } else {
            var c = [];
            for (var f = 0; f < gadmissionPH.admissionListShort.size(); f++) {
                if (gadmissionPH.admissionListShort[f].instId == d) {
                    c.push(gadmissionPH.admissionListShort[f]);
                }
            }
            var e = TemplateEngine.parseById("hidden_formAdmissionNewRequest_curric", {
                "admissions": c
            });
            $("formAdmissionNewRequest_curric").update(e);
            $("formAdmissionNewRequest_curric").up("li").show();
        }
        hideLoadingIndicator("appContent");
    },
    saveNewRequest: function(e, c, d) {
        $(d).clearErrors();
        if (e.toInstitution == null || e.toInstitution.id == null || e.toInstitution.id <= 0) {
            d.showError("toInstitution_id", "Пожалуйста, выберите школу");
        }
        if (e.admission == null || e.admission.id == null || e.admission.id <= 0) {
            d.showError("admission_id", "Пожалуйста, выберите учебную программу");
        }
        if (e.other != null && e.other.length > 3999) {
            d.showError("other", "Слишком длинный текст");
        }
        if (d.getErrorCount()) {} else {
            showLoadingIndicator("appContent");
            e.requestType = {};
            e.acceptTerms = true;
            e.requestType.id = REQUEST_TYPES.I_ATTEND;
            e.author = {};
            e.author.name1 = gadmissionPH.refItem.name1;
            e.author.name2 = gadmissionPH.refItem.name2;
            e.author.idCode = gadmissionPH.refItem.idCode;
            e.author.idIssuedBy = gadmissionPH.refItem.idIssuedBy;
            e.author.birthDay = gadmissionPH.refItem.birthDay;
            e.author.gender = gadmissionPH.refItem.gender;
            e.author.emails = [];
            e.author.phones = [];
            e.author.addresses = [];
            e.author.addresses.push(gadmissionPH.refItem.address);
            e.student = {};
            e.student.languages = ccachePH.languagesTrnas.get(gadmissionPH.refItem.lang);
            e.enteredBy = REQUEST_ENTERED_BY.SCHOOLGROUP;
            requestManager.schoolRequestSave(e, null, null, {
                callback: function(f) {
                    gadmissionPH.studentsPage(gadmissionPH.refItem.id);
                    hideLoadingIndicator("appContent");
                }
            });
        }
    },
    moveToPending: function(f) {
        var e = null;
        for (var d = 0; d < gadmissionPH.studentsRequests.size(); d++) {
            if (f == gadmissionPH.studentsRequests[d].id) {
                e = gadmissionPH.studentsRequests[d];
                break;
            }
        }
        if (e == null) {
            alert("Error");
        } else {
            var c = confirm("Are you sure you want to move this request(" + e.curriculumName + " @ " + e.instName + ") to pending list?");
            if (c) {
                showLoadingIndicator("g_admission_student_page");
                admissionManager.moveToPending(f, {
                    callback: function(g) {
                        hideLoadingIndicator("g_admission_student_page");
                        gadmissionPH.studentsPage(g.returnObject.refItem.id);
                    }
                });
            }
        }
    },
    assignPlace: function(f) {
        var e = null;
        for (var d = 0; d < gadmissionPH.studentsRequests.size(); d++) {
            if (f == gadmissionPH.studentsRequests[d].id) {
                e = gadmissionPH.studentsRequests[d];
                break;
            }
        }
        if (e == null) {
            alert("Error");
        } else {
            var c = confirm("Are you sure you want to assign place(" + e.curriculumName + " @ " + e.instName + ")?");
            if (c) {
                showLoadingIndicator("g_admission_student_page");
                admissionManager.assignPlace(f, {
                    callback: function(g) {
                        hideLoadingIndicator("g_admission_student_page");
                        gadmissionPH.studentsPage(g.returnObject.refItem.id);
                    }
                });
            }
        }
    },
    studentsFormCancel: function() {
        $("g_admission_nav").update("");
        $("g_admission_content").show();
    },
    cancelAndRefresh: function() {
        if (screquestPH && screquestPH.request) {
            screquestPH.request = {};
        }
        if (gadmissionPH.selMenuItem === gadmissionPH.MENU_ITEMS.SCHOOLS) {
            var d = gadmissionPH.cfilterPH.filter.type;
            var e = gadmissionPH.lang;
            var c = gadmissionPH.firstResult;
            gadmissionPH.schoolsShowFilter(d, null, null, e, c);
        } else {
            if (gadmissionPH.selMenuItem === gadmissionPH.MENU_ITEMS.REF_LIST) {
                gadmissionPH.studentsFullList();
                switch (gadmissionPH.selSubMenuItem) {
                    case gadmissionPH.SUB_MENU_ITEMS.LANGUAGE:
                        gadmissionPH.getMissingLanguageRefItems();
                        break;
                    case gadmissionPH.SUB_MENU_ITEMS.GEOLOCATION:
                        gadmissionPH.getMissingCoordinatesRefItems();
                        break;
                    case gadmissionPH.SUB_MENU_ITEMS.ADDRESS:
                        gadmissionPH.getMissingAddressRefItems();
                    default:
                        break;
                }
                return;
            }
        }
        $("g_admission_nav").update("");
        $("g_admission_content").show();
    },
    studentsClick: function(d) {
        var c = TemplateEngine.parseById("g_admission_struct", {});
        $("appContent").update(c);
        $("g_admission_nav").update("");
        $("g_admission_content").show();
        gadmissionPH.refListSearchStr = null;
        gadmissionPH.isExempt = false;
        gadmissionPH.status = 1;
        gadmissionPH.studentsRequests = [];
        gadmissionPH.refItem = null;
        gadmissionPH.isStudentsNode = true;
        if (d.id == 3) {
            gadmissionPH.selMenuItem = gadmissionPH.MENU_ITEMS.REF_LIST;
            gadmissionPH.studentsFullList();
        } else {
            if (d.id == 4) {
                gadmissionPH.selMenuItem = gadmissionPH.MENU_ITEMS.EXEMPT;
                gadmissionPH.studentsShowExempt();
            } else {
                if (d.id == 5) {
                    gadmissionPH.selMenuItem = gadmissionPH.MENU_ITEMS.CHANGES;
                    gadmissionPH.changesClick();
                }
            }
        }
    },
    studentsShowPlaceFree: function() {},
    studentsShowExempt: function() {
        $LAB.script(chelperPH.resourcedir + "g/admission/js/sgExRefItemsPH.js").wait(function() {
            sgExRefItemsPH.show();
        });
    },
    admissionMaxStudentsChange: function(f, d) {
        var e = chelperPH.arrFindById(f, gadmissionPH.admissions);
        var c = TemplateEngine.parseById("g_admission_admissions_maxstudents_form", {
            "admission": e
        });
        d.up().update(c);
    },
    admissionMaxStudentsChangeSubmit: function() {
        showLoadingIndicator("g_admission_content");
        var c = $("g_admission_admissions_maxstudents_form").getData();
        admissionManager.admissionMaxStudentsSave(dwrNumber(c.id), dwrNumber(c.maxStudents), {
            callback: function(d) {
                gadmissionPH.admissionList();
            }
        });
    },
    admissionMaxStudentsChangeCancel: function() {
        gadmissionPH.admissionList();
    },
    admissionCedeToSchoolForm: function(e) {
        var d = chelperPH.arrFindById(e, gadmissionPH.admissions);
        var c = TemplateEngine.parseById("g_admission_admissions_cede_to_school_form", {
            "admission": d
        });
        $("g_admission_content").update(c);
    },
    admissionCedeToSchoolFormSubmit: function() {
        showLoadingIndicator("g_admission_content");
        var c = $("g_admission_admissions_cede_to_school_form").getData();
        admissionManager.admissionCedeToSchool(dwrNumber(c.id), {
            callback: function(d) {
                gadmissionPH.admissionList();
            }
        });
    },
    admissionCedeToSchoolFormCancel: function() {
        gadmissionPH.admissionList();
    },
    studentsImport: function() {
        var c = TemplateEngine.parseById("g_admission_students_import_form", {});
        $("g_admission_content").update(c);
    },
    studentsImportSubmit: function() {
        showLoadingIndicator("g_admission_students_import_form");
        admissionManager.importPeople(dwrNumber(gadmissionPH.instId), $("g_admission_students_import_form_file"), {
            callback: function(c) {
                var d = TemplateEngine.parseById("g_admission_students_import_form_done", {
                    "errorCount": c.returnObject.failed,
                    "okCount": c.returnObject.successful
                });
                $("g_admission_content").update(d);
            }
        });
    },
    studentsImportCancel: function() {
        gadmissionPH.studentsFullList();
    },
    admissionSetupForm: function() {
        ccachePH.groupObj(gadmissionPH.instId, false, function(d) {
            var c = TemplateEngine.parseById("g_admission_admission_setup_form", {
                "inst": d.groupData
            });
            $("g_admission_content").update(c);
        });
    },
    admissionSetupFormSubmit: function() {
        var c = $("g_admission_admission_setup_form").getData();
        admissionManager.saveAdmissionSettings(c, {
            callback: function(d) {
                ccachePH.groupObjEmpty(c.id);
                chelperPH.showNotice("Успешно обновлено", "");
                gadmissionPH.admissionList();
            }
        });
    },
    admissionSetupFormCancel: function() {
        gadmissionPH.admissionList();
    },
    admissionSettingsSave: function(d, c) {
        showLoadingIndicator($("appContent"));
        $(getFormName()).clearErrors();
        d.id = $(getFormName())._formData.id;
        admissionManager.saveAdmissionSettings(d, {
            callback: function(e) {
                ccachePH.groupObjEmpty(d.id);
                ccachePH.groupObj(d.id, false, function(f) {
                    $(getFormName()).setDataObj(f.groupData);
                    $(getFormName()).drawViewMode();
                    hideLoadingIndicator($("appContent"));
                });
            }
        });
    },
    filterAdmissionsByCLassLevel: function(c) {
        gadmissionPH.currClassLevelId = c;
        gadmissionPH.drawAdmissionReport(gadmissionPH.admissions, gadmissionPH.admissionsRequestCountMap);
    },
    drawAdmissionReport: function(c, d) {
        showLoadingIndicator("appContent");
        ccachePH.classLevelList(function(e) {
            var f = TemplateEngine.parseById("g_admission_admissions", {
                "list": c,
                "classLevels": e,
                "currClassLevelId": gadmissionPH.currClassLevelId,
                "countsMap": d
            });
            $("g_admission_content").update(f);
            hideLoadingIndicator("appContent");
        });
    },
    admissionInfoShow: function(d) {
        var c = $(d).up("td").down("div").visible();
        $(d).up("td").down("div").toggle();
        if (c) {
            $(d).removeClassName("open");
            $(d).addClassName("closed");
            return true;
        } else {
            $(d).addClassName("open");
            $(d).removeClassName("closed");
        }
    },
    showSchoolGroupRequest: function() {
        $LAB.script(chelperPH.resourcedir + "g/admission/js/screquestPH.js").wait(function() {
            screquestPH.show();
        });
    },
    sortByDistance: function(e, c, d) {
        if (gadmissionPH.currDistList != null) {
            if (d == "asc") {
                gadmissionPH.currDistList.sort(gadmissionPH._sortByDistanceAsc);
            } else {
                gadmissionPH.currDistList.sort(gadmissionPH._sortByDistanceDesc);
            }
            gadmissionPH.schoolsShowPersonsListDraw(e, gadmissionPH.currDistList, c, gadmissionPH.requestInfoMap);
        }
    },
    sortByRegDate: function(e, c, d) {
        if (gadmissionPH.currDistList != null) {
            if (d == "asc") {
                gadmissionPH.currDistList.sort(gadmissionPH._sortByRegDateAsc);
            } else {
                gadmissionPH.currDistList.sort(gadmissionPH._sortByRegDateDesc);
            }
            gadmissionPH.schoolsShowPersonsListDraw(e, gadmissionPH.currDistList, c, gadmissionPH.requestInfoMap);
        }
    },
    _sortByDistanceAsc: function(d, c) {
        var f = 0;
        var e = 0;
        if (d != null && d.distance != null) {
            f = Math.round(d.distance);
        }
        if (c != null && c.distance != null) {
            e = Math.round(c.distance);
        }
        return sortNumericAsc(f, e);
    },
    _sortByDistanceDesc: function(d, c) {
        return -1 * (gadmissionPH._sortByDistanceAsc(d, c));
    },
    _sortByRegDateDesc: function(d, c) {
        var f = 0;
        var e = 0;
        if (typeof d.referenceListItem.regDate == "undefined" || d.referenceListItem.regDate == null) {
            f = 0;
        } else {
            f = date2Long(d.referenceListItem.regDate);
        }
        if (typeof c.referenceListItem.regDate == "undefined" || c.referenceListItem.regDate == null) {
            e = 0;
        } else {
            e = date2Long(c.referenceListItem.regDate);
        }
        if (f > e) {
            return -1;
        }
        if (f < e) {
            return 1;
        }
        return 0;
    },
    _sortByRegDateAsc: function(d, c) {
        return -1 * (gadmissionPH._sortByRegDateDesc(d, c));
    }
};
