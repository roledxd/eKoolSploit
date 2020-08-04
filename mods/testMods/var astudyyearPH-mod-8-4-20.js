var astudyyearPH = {
    foldername: "a/schoolyear",
    studyYearsList: new Array(),
    toDivId: "appCol1",
    activeYearId: null,
    selInstId: null,
    autoCalculationStatus: null,
    initThis: function(a) {
        ccachePH.studyYearsList(guserPH.user.selectedGroupId, function(b) {
            if (astudyyearPH.selInstId != null && astudyyearPH.selInstId != guserPH.user.selectedGroupId) {
                astudyyearPH.activeYearId = null;
            }
            astudyyearPH.selInstId = guserPH.user.selectedGroupId;
            astudyyearPH.studyYearsList = b;
            astudyyearPH.studyYearsList.sort(astudyyearPH.sortStudyYear);
            if (astudyyearPH.activeYearId == null) {
                if (astudyyearPH.studyYearsList.size() > 0) {
                    astudyyearPH.activeYearId = astudyyearPH.studyYearsList[0].id;
                }
                for (var c = 0; c < astudyyearPH.studyYearsList.size(); c++) {
                    if (chelperPH.dateWithin2(astudyyearPH.studyYearsList[c].startDate, astudyyearPH.studyYearsList[c].endDate, new Date())) {
                        astudyyearPH.activeYearId = astudyyearPH.studyYearsList[c].id;
                    }
                }
            }
            chelperPH.callcode(a);
            curriculumManager.checkAutomaticCalculation({
                callback: function(d) {
                    astudyyearPH.autoCalculationStatus = d.returnObject.status;
                }
            });
        });
    },
    getActiveYear: function() {
        if (astudyyearPH.activeYearId != null) {
            return ccachePH.byId.get(astudyyearPH.activeYearId);
        } else {
            return null;
        }
    },
    getHtmlForView: function(a) {
        if (astudyyearPH.activeYearId == null) {
            return null;
        }
        var b = TemplateEngine.parseById("hidden_a_schoolyear_manage", {
            "yearList": a,
            "activeYear": astudyyearPH.getActiveYear()
        });
        return b;
    },
    cloneJournals: function() {
        if (!astudyyearPH.checkStudyYearModifiable()) {
            return false;
        }
        var a = astudyyearPH.getActiveYear();
        if (!confirm("Вы действительно хотите клонировать все заблокированные и не клонированные журналы:" + a.name + "?")) {
            return false;
        }
        schoolyearManager.cloneJournals(dwrNumber(a.id), {
            callback: function(b) {
                aschoolyearPH.show();
            }
        });
    },
    startArchiving: function() {
        if (!astudyyearPH.checkStudyYearModifiable()) {
            return false;
        }
        var a = astudyyearPH.getActiveYear();
        if (!confirm("Вы действительно хотите начать архивирование учебного года:" + a.name + "?")) {
            return false;
        }
        schoolyearManager.startArchiving(dwrNumber(a.id), {
            callback: function(b) {
                ccachePH.studyYearsListEmpty(guserPH.user.selectedGroupId);
                ccachePH.studyYearsList(guserPH.user.selectedGroupId, function(c) {
                    aschoolyearPH.show();
                });
            }
        });
    },
    checkStudyYearModifiable: function() {
        return true;
    },
    show: function() {
        ccachePH.studyYearsList(guserPH.user.selectedGroupId, function(a) {
            var b = astudyyearPH.getHtmlForView(a);
            if ($("a_schoolyear_manage")) {
                $("a_schoolyear_manage").replace(b);
            } else {
                $(astudyyearPH.toDivId).insert({
                    "top": b
                });
            }
        });
    },
    selectAnother: function(a) {
        if ($("a_schoolyear_manage_another")) {
            $("a_schoolyear_manage_another").update();
            if ($("a_schoolyear_manage_another").visible()) {
                $("a_schoolyear_manage_another").hide();
                return;
            }
        }
        ccachePH.studyYearsList(guserPH.user.selectedGroupId, function(b) {
            var c = TemplateEngine.parseById("hidden_a_schoolyear_manage_submenu", {
                "yearList": b
            });
            if ($("a_schoolyear_manage_another")) {
                $("a_schoolyear_manage_another").update(c).toggle();
            }
        });
    },
    showActionsForYear: function(b, a) {
        if ($("a_schoolyear_manage_another")) {
            $("a_schoolyear_manage_another").hide();
        }
        if ($("a_schoolyear_manage_othermenu") && $("a_schoolyear_manage_othermenu").visible()) {
            $("a_schoolyear_manage_othermenu").hide();
            if (a) {
                return;
            }
        }
        ccachePH.studyYearsListEmpty(guserPH.user.selectedGroupId);
        ccachePH.studyYearsList(guserPH.user.selectedGroupId, function(c) {
            c.sort(astudyyearPH.sortStudyYear);
            astudyyearPH.studyYearsList = c;
            if (astudyyearPH.activeYearId != b || !a) {
                astudyyearPH.activeYearId = ccachePH.byId.get(b).id;
                astudyyearPH.show();
                aschoolyearPH.onYearChange(astudyyearPH.getActiveYear());
            }
            if (aschoolyearjPH.journalList != null && aschoolyearjPH.journalList.size() > 0) {
                var e = astudyyearPH.getActiveYear();
                var d = {
                    "journalsCount": 0,
                    "lockedJournalsCount": 0,
                    "lockedNotClonedJournalsCount": 0
                };
                if (e != null) {
                    jCount = aschoolyearjPH.journalList.length;
                    if (aschoolyearjPH.journalList.length > 0) {
                        aschoolyearjPH.journalList.each(function(f) {
                            d.journalsCount++;
                            if (f.locked === true) {
                                d.lockedJournalsCount++;
                            }
                            if (f.cloneStatus === JOURNAL_CLONE_STATUSES.NOT_CLONED && f.locked) {
                                d.lockedNotClonedJournalsCount++;
                            }
                        });
                    }
                }
                astudyyearPH.drawActionMenu(e, d, a);
            } else {
                var e = astudyyearPH.getActiveYear();
                if (e != null) {
                    journalManager.getJournalsCounts(dwrNumber(guserPH.user.selectedGroupId), dwrNumber(e.id), {
                        callback: function(f) {
                            var g = f.returnObject;
                            astudyyearPH.drawActionMenu(e, g, a);
                        }
                    });
                } else {
                    var d = {
                        "journalsCount": 0,
                        "lockedJournalsCount": 0,
                        "lockedNotClonedJournalsCount": 0
                    };
                    astudyyearPH.drawActionMenu(e, d, a);
                }
            }
        });
    },
    drawActionMenu: function(d, c, a) {
        var b = TemplateEngine.parseById("hidden_a_schoolyear_manage_othermenu", {
            "selectedStudyYear": d,
            "journalsCountsObj": c
        });
        if ($("a_schoolyear_manage_othermenu")) {
            $("a_schoolyear_manage_othermenu").update(b);
            if (a === true) {
                $("a_schoolyear_manage_othermenu").show();
            }
        }
    },
    add: function() {
        astudyyearPH.studyYearForm(new Object());
    },
    modify: function() {
        astudyyearPH.studyYearForm(astudyyearPH.getActiveYear());
    },
    studyYearForm: function(a) {
        cappPH.setCols(false);
        showLoadingIndicator("appContent");
        chelperPH.loadTemplateHidd(chelperPH.resourcedir + astudyyearPH.foldername + "/tpl/studyyear_tpl.html", function() {
            ccachePH.classLevelListForInst(guserPH.user.selectedGroupId, function(b) {
                ccachePH.getInstitutionPreferences(guserPH.user.selectedGroupId, function(g) {
                    var d = new Object();
                    if (a != null && a.id != null) {
                        for (var f = 0; f < astudyyearPH.studyYearsList.size(); f++) {
                            if (astudyyearPH.studyYearsList[f].id == a.id) {
                                d = astudyyearPH.studyYearsList[f];
                                break;
                            }
                        }
                    }
                    if (d != null && d.periodsGroups != null && d.periodsGroups.size() > 0) {
                        d.isTerms = true;
                    }
                    var c = false;
                    if (g.overlappingPeriods) {
                        c = true;
                    }
                    var e = TemplateEngine.parseById("formAddNewStudyYear_edit_tpl", {
                        "formData": d,
                        "multiple": c
                    });
                    $("appContent").update(e);
                    var j = $("formAddNewStudyYear_edit");
                    j.addDataHelper("classLevels", b);
                    j.setDataObj(d);
                    j.setEditValues();
                    var h = astudyyearPH.getPeriodsGroupClassesMap(d);
                    astudyyearPH.disablePeriodsGroupClassLevels(h);
                    hideLoadingIndicator("appContent");
                });
            });
        });
    },
    studyYearFormCancel: function() {
        ccachePH.studyYearsList(guserPH.user.selectedGroupId, function(a) {
            if (a == null || a.length == 0) {
                astudyyearPH.showNoContent();
            } else {
                aschoolyearPH.show();
            }
        });
    },
    studyYearFormSave: function(c) {
        var a = $("formAddNewStudyYear_edit");
        var b = a.getData();
        b.id = c;
        getFormName = function() {
            return a.id;
        };
        if (astudyyearPH.checkData(b, a)) {
            showLoadingIndicator("appContent");
            console.log(b);
            studyYearManager.saveStudyYearNoTrans(b, {
                callback: function(e, d) {
                    if (astudyyearPH.studyYearsList == null || astudyyearPH.studyYearsList.size() == 0) {
                        cappPH.doGroupRefresh();
                    }
                    ccachePH.studyYearsListEmpty(guserPH.user.selectedGroupId);
                    ccachePH.clearStudyYearsCachedData(guserPH.user.selectedGroupId, b.id);
                    ccachePH.studyYearsList(guserPH.user.selectedGroupId, function(f) {
                        astudyyearPH.studyYearsList = f;
                        hideLoadingIndicator("appContent");
                        aschoolyearPH.show();
                    });
                }
            });
        }
    },
    showNoContent: function() {
        clayoutPH.nocontent("appContent", {
            "title": "У Вас нет ни одного учебного года.",
            "description": "Нажмите сюда, чтобы добавить первый учебный год.",
            "descriptionLink": "astudyyearPH.studyYearForm(); return false;"
        });
    },
    checkData: function(d, c) {
        c.clearErrors();
        if (d.name == null || d.name.strip().length == 0) {
            c.showError("name", "");
        }
        if (d.startDate == null || d.endDate == null) {
            c.showError("startDate", "Введите дату.");
        } else {
            if (!astudyyearPH.checkStudyYear(d.startDate, d.endDate, d.id, c)) {
                c.showError("startDate", "");
            }
        }
        if (d.isTerms) {
            if (d.periodsGroups != null) {
                for (var a = 0; a < d.periodsGroups.size(); a++) {
                    if (d.periodsGroups[a].name != "") {
                        if (d.periodsGroups[a].terms != null) {
                            for (var b = 0; b < d.periodsGroups[a].terms.size(); b++) {
                                if (d.periodsGroups[a].terms[b].name == null || d.periodsGroups[a].terms[b].name.strip().length == 0) {
                                    c.showError("periodsGroups_" + d.periodsGroups[a].id + "_terms_" + d.periodsGroups[a].terms[b].id + "_name", "Пожалуйста, введите название");
                                }
                                if (d.periodsGroups[a].terms[b].startDate == null || d.periodsGroups[a].terms[b].endDate == null) {
                                    c.showError("periodsGroups_" + d.periodsGroups[a].id + "_terms_" + d.periodsGroups[a].terms[b].id + "_startDate", "Введите дату.");
                                } else {
                                    if (!astudyyearPH.checkTerm(d.periodsGroups[a].terms[b].startDate, d.periodsGroups[a].terms[b].endDate, d.periodsGroups[a].terms[b].id, d, c, d.periodsGroups[a].id)) {
                                        c.showError("periodsGroups_" + d.periodsGroups[a].id + "_terms_" + d.periodsGroups[a].terms[b].id + "_startDate", "");
                                    }
                                }
                            }
                        } else {
                            $(c.id).showError("periodsGroups_", "Неправильные данные");
                        }
                    } else {
                        c.showError("periodsGroups_" + d.periodsGroups[a].id + "_name", "Пожалуйста, введите название группы ");
                    }
                }
            } else {
                $(c.id).showError("periodsGroups_", "Неправильные данные");
            }
        } else {
            d.periodsGroups = null;
        }
        if (c.getErrorCount()) {
            return false;
        }
        return true;
    },
    checkStudyYear: function(g, a, c, d) {
        return true;
    },
    checkTerm: function(a, d, l, g, b, k) {
        return true;
    },
    onPeriodsGroupClassLevelClick: function(b, d) {
        var a = $(d).up("form").select(".iOverlappingPeriodsClass_" + b);
        for (var c = 0; c < a.size(); c++) {
            if ($(d).checked) {
                if ($(a[c]).checked) {
                    $(a[c]).enable(true);
                } else {
                    $(a[c]).disable(true);
                }
            } else {
                $(a[c]).enable(true);
            }
        }
    },
    getPeriodsGroupClassesMap: function(b) {
        var e = $H();
        if (b.periodsGroups != null) {
            for (var d = 0; d < b.periodsGroups.size(); d++) {
                var c = b.periodsGroups[d];
                if (c.classLevels != null) {
                    for (var a = 0; a < c.classLevels.length; a++) {
                        e.set(c.classLevels[a].id, c.classLevels[a].id);
                    }
                }
            }
        }
        return e;
    },
    disablePeriodsGroupClassLevels: function(f) {
        if (f == null) {
            var e = $("formAddNewStudyYear_edit");
            var g = e.getData();
            f = astudyyearPH.getPeriodsGroupClassesMap(g);
        }
        var h = f.values();
        if (h != null) {
            for (var c = 0; c < h.length; c++) {
                var b = h[c];
                var a = $("formAddNewStudyYear_edit").select(".iOverlappingPeriodsClass_" + b);
                for (var d = 0; d < a.size(); d++) {
                    if ($(a[d]).checked) {} else {
                        $(a[d]).disable(true);
                    }
                }
            }
        }
        ccachePH.classLevelListForInst(guserPH.user.selectedGroupId, function(j) {
            for (var k = 0; k < j.length; k++) {
                if (f.get(j[k].id) == null) {
                    $("formAddNewStudyYear_edit").select(".iOverlappingPeriodsClass_" + j[k].id).invoke("enable");
                }
            }
        });
    },
    sortStudyYear: function(d, c) {
        return (chelperPH.compareDate(d.startDate, c.startDate) * (-1));
    },
    sortTerm: function(d, c) {
        return (chelperPH.compareDate(d.startDate, c.startDate));
    },
    showAndHide: function(b, a) {
        if ($(b).checked) {
            $(a).show();
        } else {
            $(a).hide();
        }
    }
};