var acurriculaPH = {
    foldername: "a/curricula",
    isEditMode: true,
    toDivId: "appContent",
    appHeadTxt: "Программы обучения",
    appUseButtons: true,
    grpId: null,
    subjectId: null,
    isCourseView: false,
    autoCalculationStatus: false,
    TREE_TYPE: {
        ACTIVE: 0,
        ARCHIVE: 1
    },
    subjectWithDescriptionsMap: null,
    initThis: function(b, a) {
        $LAB.script(chelperPH.resourcedir + "c/app/js/cappPH.js").wait(function() {
            cappPH.initAppV2(APP_LAYOUT.TABS, acurriculaPH.appHeadTxt, {
                useButtons: acurriculaPH.appUseButtons,
                useSearch: false
            }, function() {
                acurriculaPH.initThisPub(function() {
                    cappPH.initTree(1, 0, acurriculaPH.currAdd, 0, "Новая программа обучения", function() {
                        var g = [];
                        var h = [];
                        var d = [];
                        for (var f = 0; f < acurriculaPH.curriculumList.size(); f++) {
                            if (acurriculaPH.curriculumList[f].active) {
                                h.push(acurriculaPH.curriculumList[f]);
                            } else {
                                d.push(acurriculaPH.curriculumList[f]);
                            }
                        }
                        g.push({
                            "id": acurriculaPH.TREE_TYPE.ACTIVE,
                            "name": "Активные"
                        });
                        if (d.size() > 0) {
                            g.push({
                                "id": acurriculaPH.TREE_TYPE.ARCHIVE,
                                "name": "Архив"
                            });
                        }
                        cappPH.treeArrAdd(g);
                        cappPH.treeArrAdd(h, acurriculaPH.TREE_TYPE.ACTIVE, acurriculaPH.currClick, acurriculaPH.currEdit, acurriculaPH.currDel);
                        if (d.size() > 0) {
                            cappPH.treeArrAdd(d, acurriculaPH.TREE_TYPE.ARCHIVE, acurriculaPH.currClick, acurriculaPH.editArchiveCurriculum, acurriculaPH.deleteArchiveCurriculum);
                        }
                        var e = null;
                        if (acurriculaPH.curriculumList != null && b != null) {
                            e = chelperPH.arrFindById(b, acurriculaPH.curriculumList);
                        }
                        var c = 1;
                        if (e != null && e.id != null) {
                            c = 0;
                        }
                        cappPH.draw(c, e);
                        chelperPH.callcode(a);
                    });
                });
            });
        });
        curriculumManager.checkAutomaticCalculation({
            callback: function(c) {
                acurriculaPH.autoCalculationStatus = c.returnObject.status;
            }
        });
    },
    initThisPub: function(a) {
        chelperPH.loadTemplateHidd(chelperPH.resourcedir + acurriculaPH.foldername + "/tpl/curriculav2.html", function() {
            ccachePH.institutionObj(acurriculaPH.grpId, function(b) {
                ccachePH.subjectTypeList(acurriculaPH.grpId, function(c) {
                    acurriculaPH.subjectTypeList = c;
                    ccachePH.curriculumList(acurriculaPH.grpId, function(d) {
                        acurriculaPH.curriculumList = d;
                        ccachePH.getStateCurriculaForInstitution(acurriculaPH.grpId, function(e) {
                            ccachePH.classLevelListForInst(acurriculaPH.grpId, function(f) {
                                acurriculaPH.classLevels = f;
                                ccachePH.gradeTypeList(function(g) {
                                    acurriculaPH.gtList = g;
                                    ccachePH.gradeSchemaList(acurriculaPH.grpId, function(h) {
                                        acurriculaPH.gradeSchemas = h;
                                        ccachePH.curriculumModuleList(acurriculaPH.grpId, function(i) {
                                            acurriculaPH.curriculumModuleList = i;
                                            chelperPH.callcode(a);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    },
    show: function(d, b, e) {
        var a = new Number(SWFAddress.getParameter("groupId"));
        if (a > 0) {
            acurriculaPH.grpId = a;
        } else {
            if (guserPH.user) {
                acurriculaPH.grpId = guserPH.user.selectedGroupId;
            }
        }
        var c = guserPH.userAccountTypes(acurriculaPH.grpId);
        acurriculaPH.isEditMode = false;
        if (true) {
            acurriculaPH.isEditMode = true;
        }
        acurriculaPH.appHeadTxt = "Программы обучения (eKoolSploit MOD)";
        acurriculaPH.appUseButtons = true;
        acurriculaPH.subjectId = null;
        acurriculaPH.curricula = null;
        if (typeof(d) == "undefined") {
            d = null;
        }
        if (typeof(e) == "undefined") {
            e = null;
        }
        acurriculaPH.isCourseView = false;
        if (e != null) {
            acurriculaPH.isCourseView = true;
        }
        acurriculaPH.initThis(d, function() {
            if (acurriculaPH.curriculumList.size() == 0) {
                acurriculaPH.showNoContent();
            } else {
                if (d != null) {
                    ccachePH.subjectList(d, function(f) {
                        acurriculaPH.isCourseView = false;
                        acurriculaPH.currClick({
                            id: d
                        }, false, function() {
                            if (e != null) {
                                acurriculaPH.subjectList = f;
                                acurriculaPH.subject = chelperPH.arrFindById(b, acurriculaPH.subjectList);
                                if (acurriculaPH.subject != null) {
                                    acurriculaPH.subjectId = acurriculaPH.subject.id;
                                    acurriculaPH.subjTypeId = acurriculaPH.subject.type.id;
                                    acurriculaPH.courseShow(e, true);
                                } else {
                                    shout("acurriculaPH.subject is null");
                                }
                            } else {
                                shout("acurriculaPH.course is null");
                            }
                        });
                    });
                }
            }
        });
    },
    showNoContent: function() {
        var a = {};
        if (acurriculaPH.isEditMode == true) {
            a.title = "В Вашей школе еще нет ни одной учебной программы.";
            if (acurriculaPH.classLevels == null || acurriculaPH.classLevels.size() == 0) {
                a.description = "Перед внесением программы обучения внесите основные данные о своей школе";
                a.descriptionLink = "cmenuPH.activateScreenId('a.settings.settings'); return false;";
            } else {
                a.description = "Добавить первую программу обучения в школе";
                a.descriptionLink = "cappPH.actionMenuAddActivate(); return false;";
            }
        } else {
            a.title = "Программа обучения не добавлена";
        }
        clayoutPH.nocontent(acurriculaPH.toDivId, a);
    },
    currPageDraw: function() {
        var a = TemplateEngine.parseById("hidden_a_curricula_v2_main", {});
        if ($(acurriculaPH.toDivId)) {
            $(acurriculaPH.toDivId).update(a);
        }
    },
    currAdd: function() {
        ccachePH.getStateCurriculaForInstitution(acurriculaPH.grpId, function(a) {
            acurriculaPH.currPageDraw();
            var b = $(document.createElement("form"));
            b.id = "formCurriculum";
            if (!acurriculaPH.curricula) {
                acurriculaPH.curricula = {};
            }
            acurriculaPH.curricula.isEditMode = acurriculaPH.isEditMode;
            var d = {};
            d.type = {
                "id": 2
            };
            b.setDataObj(d);
            b.addDataHelper("classLevels", acurriculaPH.classLevels);
            b.addDataHelper("stateCurricula", a);
            b.drawEditMode($("a_curricula_v2_curr_data"));
            b.bindSaveAction(acurriculaPH.currNewSave);
        });
    },
    currEdit: function() {
        acurriculaPH.currShow(true);
    },
    editArchiveCurriculum: function() {
        alert("Для того чтобы редактировать заархивированную учебную программу, прежде ее нужно активировать.");
    },
    currNewSave: function(b, a) {
        acurriculaPH.curricula = {};
        acurriculaPH.curricula.classLevels = $A();
        acurriculaPH.currFormSave(b, a);
    },
    currClick: function(c, b, a) {
        if (!acurriculaPH.isCourseView) {
            acurriculaPH.subjectId = null;
            var d = null;
            if ((c == null) && (acurriculaPH.curriculumList.length > 0)) {
                d = acurriculaPH.curriculumList[0].id;
            } else {
                d = c.id;
            }
            if (d > 0) {
                if (b) {
                    if (acurriculaPH.curricula.active) {
                        acurriculaPH.currEdit();
                        if (a != null) {
                            chelperPH.callcode(a);
                        }
                    } else {
                        acurriculaPH.editArchiveCurriculum();
                    }
                } else {
                    curriculumManager.curriculumFind(dwrNumber(d), dwrNumber(acurriculaPH.grpId), {
                        callback: function(e) {
                            acurriculaPH.curricula = e.returnObject;
                            if (acurriculaPH.curricula.classLevels == null) {
                                acurriculaPH.curricula.classLevels = [];
                            }
                            acurriculaPH.curricula.classLevels = acurriculaPH.curricula.classLevels.sortBy(function(f) {
                                return new Number(f.classLevel);
                            });
                            ccachePH.curriculumList(acurriculaPH.grpId, function(f) {
                                acurriculaPH.currShow(b);
                                if (a != null) {
                                    chelperPH.callcode(a);
                                }
                            });
                        }
                    });
                }
            }
        }
    },
    currShow: function(a) {
        ccachePH.curriculumList(acurriculaPH.grpId, function(b) {
            ccachePH.getStateCurriculaForInstitution(acurriculaPH.grpId, function(c) {
                acurriculaPH.curriculumList = b;
                if (acurriculaPH.curriculumList == null || acurriculaPH.curriculumList.size() == 0) {
                    acurriculaPH.showNoContent();
                } else {
                    acurriculaPH.subjTypeId = null;
                    acurriculaPH.currPageDraw();
                    if (acurriculaPH.curricula.classLevels == null) {
                        acurriculaPH.curricula.classLevels = [];
                    }
                    acurriculaPH.curricula.classLevels = acurriculaPH.curricula.classLevels.sortBy(function(e) {
                        return new Number(e.classLevel);
                    });
                    var d = $(document.createElement("form"));
                    d.id = "formCurriculum";
                    acurriculaPH.curricula.isEditMode = acurriculaPH.isEditMode;
                    d.setDataObj(acurriculaPH.curricula);
                    d.addDataHelper("classLevels", acurriculaPH.classLevels);
                    d.addDataHelper("stateCurricula", c);
                    d.bindSaveAction(acurriculaPH.currFormSave);
                    if (a == true) {
                        d.drawEditMode($("a_curricula_v2_curr_data"));
                    } else {
                        d.drawViewMode($("a_curricula_v2_curr_data"));
                    }
                    if (acurriculaPH.curricula.active) {
                        acurriculaPH.subjList(acurriculaPH.curricula.id);
                    }
                }
            });
        });
    },
    currDel: function(a) {
        var b = confirm("Вы уверены, что желаете удалить эту программу обучения?");
        if (b) {
            showLoadingIndicator("appContent");
            curriculumManager.curriculumSave(a, true, {
                callback: function(c) {
                    cappPH.doGroupRefresh();
                    ccachePH.curriculumListUpdate(acurriculaPH.grpId, a, true);
                    cappPH.actionMenuDelDone();
                    ccachePH.curriculumList(acurriculaPH.grpId, function(d) {
                        acurriculaPH.curriculumList = d;
                        if (acurriculaPH.curriculumList == null || acurriculaPH.curriculumList.size() == 0) {
                            acurriculaPH.showNoContent();
                        }
                        hideLoadingIndicator("appContent");
                    });
                }
            });
        }
    },
    deleteArchiveCurriculum: function() {
        alert("Для того чтобы удалить заархивированную учебную программу, прежде ее нужно активировать.");
    },
    currForm: function() {
        acurriculaPH.currPageDraw();
        acurriculaPH.currFormDraw(acurriculaPH.curricula);
    },
    currFormDraw: function(a) {},
    currFormSave: function(b, a) {
        $(getFormName()).clearErrors();
        showLoadingIndicator("appContent");
        b.id = acurriculaPH.curricula.id;
        curriculumManager.curriculumSave(b, false, {
            callback: function(c) {
                ccachePH.curriculumListUpdate(acurriculaPH.grpId, c.returnObject, false);
                acurriculaPH.saveCurriculumCallback(c);
            }
        });
    },
    toggleStateCurriculum: function(a) {
        a["stateCurriculum_id"].setValue(-1);
        a["stateCurriculum_id"].toggle();
    },
    currFormCancel: function() {
        if (acurriculaPH.curricula.id == null) {
            acurriculaPH.currPageDraw();
            cappPH.actionMenuProcessCancel();
        } else {
            acurriculaPH.currShow();
        }
    },
    changeCurriculumActiveStatus: function(d, b) {
        if (d != null) {
            var a;
            if (b) {
                a = "Вы действительно уверены, что хотите активировать эту учебную программу?";
            } else {
                b = false;
                a = "Вы действительно уверены, что хотите заархивировать эту учебную программу?";
            }
            var c = confirm(a);
            if (c) {
                showLoadingIndicator("appContent");
                curriculumManager.changeCurriculumActiveStatus(d, b, {
                    callback: function(e) {
                        ccachePH.curriculumListEmpty(acurriculaPH.grpId);
                        ccachePH.curriculumList(acurriculaPH.grpId, function(f) {
                            acurriculaPH.saveCurriculumCallback(e);
                        });
                    }
                });
            }
        } else {
            shout("curriculumId is null");
        }
    },
    saveCurriculumCallback: function(a) {
        acurriculaPH.curricula = a.returnObject;
        acurriculaPH.initThis(acurriculaPH.curricula.id, function() {
            cappPH.doGroupRefresh();
            hideLoadingIndicator("appContent");
        });
    },
    saveSubjectCallback: function(a) {
        acurriculaPH.saveCurriculumCallback(a);
    },
    saveCourseCallback: function(a) {
        acurriculaPH.saveCurriculumCallback(a);
    },
    subjList: function(a) {
        showLoadingIndicator("appContent");
        ccachePH.subjectList(a, function(c) {
            acurriculaPH.subjectList = c;
            if ((acurriculaPH.subject == null) && (acurriculaPH.subjectList.size() > 0)) {
                acurriculaPH.subject = acurriculaPH.subjectList[0];
                acurriculaPH.subjectId = acurriculaPH.subjectList[0].id;
            }
            if ((acurriculaPH.subjTypeId == null) && (acurriculaPH.subjectList.size() > 0)) {
                acurriculaPH.subjTypeId = acurriculaPH.subjectList[0].type.id;
            }
            var b = TemplateEngine.parseById("hidden_a_curricula_v2_subject_list", null);
            $("a_curricula_v2_subj_data").update(b);
            acurriculaPH.subjListDraw(acurriculaPH.subjectList);
            if (acurriculaPH.subjectList != null && acurriculaPH.subjectList.size() > 1) {
                acurriculaPH.cfilterPH = new cfilterPH(null, true, false, acurriculaPH.filterSubjects, null, ["Поиск по имени"], "curr_subject_filter");
            }
            hideLoadingIndicator("appContent");
        });
    },
    subjListDraw: function(b) {
        var a = TemplateEngine.parseById("hidden_curricula_subject_table", {
            "subjectList": b,
            "subjTypeId": acurriculaPH.subjTypeId,
            "subjectId": acurriculaPH.subjectId,
            "isEditMode": acurriculaPH.isEditMode
        });
        $("curriculum_subjects_table").update(a);
    },
    subjectShow: function() {
        acurriculaPH.courseList(acurriculaPH.subject.id);
    },
    subjForm: function(a) {
        if (a > 0) {
            curriculumManager.subjectFind(dwrNumber(a), {
                callback: function(b) {
                    acurriculaPH.subject = b.returnObject;
                    acurriculaPH.subjFormDraw(acurriculaPH.subject);
                }
            });
        } else {
            acurriculaPH.subject = {};
            acurriculaPH.subject.type = {};
            acurriculaPH.subjFormDraw(acurriculaPH.subject);
        }
    },
    subjFormDraw: function(a) {
        ccachePH.staffList(guserPH.user.selectedGroupId, function(b) {
            ccachePH.getSubjectsForStateCurriculum(acurriculaPH.curricula.stateCurriculum, function(c) {
                if ($("acurricula_subject_new")) {
                    if ($("acurricula_subject_new").up("tr")) {
                        $("acurricula_subject_new").up("tr").show();
                    }
                }
                acurriculaPH.setSubjectWithDescriptionsMap(c);
                var d = $(document.createElement("form"));
                d.id = "formCurriculumSubject";
                acurriculaPH.subject.isEditMode = acurriculaPH.isEditMode;
                d.setDataObj({});
                d.addDataHelper("curriculum", acurriculaPH.curricula);
                d.addDataHelper("gradeSchemas", acurriculaPH.gradeSchemas);
                d.addDataHelper("subjectTypeList", acurriculaPH.subjectTypeList);
                d.addDataHelper("stateCurriculumSubjectList", c);
                d.drawEditMode($("acurricula_subject_new"));
                d.bindSaveAction(acurriculaPH.subjNewSave);
                if ($("curriculum_subjects_table").down("tr.nocontent")) {
                    $("curriculum_subjects_table").down("tr.nocontent").hide();
                }
                $("curriculum_subjects_table").down("tfoot").hide();
            });
        });
    },
    subjNewSave: function(b, a) {
        acurriculaPH.subject = {};
        acurriculaPH.subjFormSave(b, a);
    },
    subjFormSave: function(c, a) {
        var b = $(getFormName());
        b.clearErrors();
        var c = b.getData();
        if (c.name == null || c.name.length == 0) {
            $(getFormName()).showError("name", "Проверьте имя");
        }
        if (typeof c.subjectSpecification != "undefined" && c.subjectSpecification.id === "-1") {
            $(getFormName()).showError("subjectSpecification_id", "Пожалусйта, добавьте спецификацию");
        }
        if (c.type == null || c.type.id == null) {
            $(getFormName()).showError("type_id", "Проверьте тип");
        }
        if ($(getFormName()).getErrorCount() == 0) {
            c.id = acurriculaPH.subject.id;
            if (c.isSchema == true || c.isSchema == "true") {} else {
                c.graduationGradeSchema = null;
                c.gradePolicy = null;
                c.gradingStaff = null;
            }
            c.curriculum = {
                id: acurriculaPH.curricula.id
            };
            curriculumManager.subjectSave(c, false, {
                callback: function(d) {
                    acurriculaPH.subject = d.returnObject;
                    ccachePH.subjectListEmpty(acurriculaPH.subject.curriculum.id);
                    ccachePH.subjectList(acurriculaPH.subject.curriculum.id, function(e) {
                        acurriculaPH.subjectList = e;
                        acurriculaPH.courseList(acurriculaPH.subject.id);
                    });
                }
            });
        }
    },
    subjFormCancel: function() {
        acurriculaPH.subjList(acurriculaPH.curricula.id);
    },
    subjDel: function(c) {
        var b = confirm("Вы уверены, что желаете удалить этот учебный предмет?");
        if (b) {
            showLoadingIndicator("formCurriculumSubject");
            var a = null;
            acurriculaPH.subjectList.each(function(d) {
                if (d.id == c) {
                    a = {
                        "id": c
                    };
                    a.type = {
                        "id": d.type.id
                    };
                }
            });
            curriculumManager.subjectSave(a, true, {
                callback: function(d) {
                    if (!d.isError) {
                        cappPH.doGroupRefresh();
                        ccachePH.subjectListUpdate(acurriculaPH.curricula.id, a, true);
                        acurriculaPH.currShow();
                    } else {
                        chelperPH.showError("Удаление не удалось");
                    }
                    hideLoadingIndicator("formCurriculumSubject");
                }
            });
        }
    },
    changeSubjectActiveStatus: function(d, b) {
        if (d != null) {
            var a;
            if (b) {
                a = "Вы уверены, что хотите активировать предмет учебной программы?";
            } else {
                b = false;
                a = "Вы собираетесь заархивировать этот предмет. Вместе с ним будут заархивированы все предметные курсы. Вы уверены, что хотите продолжить?";
            }
            var c = confirm(a);
            if (c) {
                showLoadingIndicator("appContent");
                curriculumManager.setSubjectActive(d, b, {
                    callback: function(e) {
                        acurriculaPH.subject = e.returnObject;
                        ccachePH.subjectListEmpty(acurriculaPH.subject.curriculum.id);
                        ccachePH.subjectList(acurriculaPH.subject.curriculum.id, function(f) {
                            acurriculaPH.subjectList = f;
                            acurriculaPH.courseList(acurriculaPH.subject.id);
                        });
                    }
                });
            }
        } else {
            shout("subjectId is null");
        }
    },
    courseDel: function(c) {
        var b = confirm("Вы уверены, что желаете удалить этот курс?");
        if (b) {
            var a = null;
            if (acurriculaPH.subject.courses != null) {
                showLoadingIndicator("formCurriculumCourse");
                acurriculaPH.subject.courses.each(function(d) {
                    if (d.id == c) {
                        a = {
                            "id": d.id
                        };
                        a.curriculum = {
                            "id": d.curriculum.id
                        };
                    }
                });
                curriculumManager.courseSave(a, true, {
                    callback: function(d) {
                        if (!d.isError) {
                            cappPH.doGroupRefresh();
                            ccachePH.cache.unset("courseFind" + acurriculaPH.course.id);
                            ccachePH.cache.unset("subjectList" + acurriculaPH.curricula.id);
                            ccachePH.getCurriculumShortEmpty(acurriculaPH.curricula.id);
                            ccachePH.subjectList(acurriculaPH.curricula.id, function(e) {
                                acurriculaPH.subjectList = e;
                                acurriculaPH.subject = chelperPH.arrFindById(acurriculaPH.subject.id, acurriculaPH.subjectList);
                                hideLoadingIndicator("formCurriculumCourse");
                                acurriculaPH.courseList(acurriculaPH.subject.id);
                            });
                        } else {
                            chelperPH.showError("Удаление не удалось");
                        }
                    }
                });
            }
        }
    },
    courseList: function(a) {
        showLoadingIndicator("appContent");
        ccachePH.getSubjectsForStateCurriculum(acurriculaPH.curricula.stateCurriculum, function(b) {
            ccachePH.staffList(guserPH.user.selectedGroupId, function(e) {
                acurriculaPH.subject = chelperPH.arrFindById(a, acurriculaPH.subjectList);
                if (acurriculaPH.subject != null) {
                    acurriculaPH.subjectId = acurriculaPH.subject.id;
                    acurriculaPH.subjTypeId = acurriculaPH.subject.type.id;
                    var c = acurriculaPH.subject.courses;
                    if (c == null) {
                        c = [];
                    }
                    c.sort(coursesSort);
                    acurriculaPH.currPageDraw();
                    acurriculaPH.setSubjectWithDescriptionsMap(b);
                    var f = $(document.createElement("form"));
                    f.id = "formCurriculumSubject";
                    acurriculaPH.subject.isEditMode = acurriculaPH.isEditMode;
                    f.setDataObj(acurriculaPH.subject);
                    f.addDataHelper("curriculum", acurriculaPH.curricula);
                    f.addDataHelper("gradeSchemas", acurriculaPH.gradeSchemas);
                    f.addDataHelper("subjectTypeList", acurriculaPH.subjectTypeList);
                    f.addDataHelper("stateCurriculumSubjectList", b);
                    f.drawViewMode($("a_curricula_v2_curr_data"));
                    f.bindSaveAction(acurriculaPH.subjFormSave);
                    var d = TemplateEngine.parseById("hidden_a_curricula_v2_course_list", null);
                    $("a_curricula_v2_subj_data").update(d);
                    acurriculaPH.courseListDraw(c);
                    if (c != null && c.size() > 1) {
                        acurriculaPH.cfilterPH = new cfilterPH(null, true, false, acurriculaPH.filterCourses, null, ["Поиск по имени"], "acurr_course_filetr");
                    }
                    hideLoadingIndicator("appContent");
                }
            });
        });
    },
    courseListDraw: function(a) {
        var b = TemplateEngine.parseById("hidden_acurricula_courses_table", {
            "courseList": a,
            "subject": acurriculaPH.subject,
            "curriculum": acurriculaPH.curricula,
            "isEditMode": acurriculaPH.isEditMode
        });
        $("a_curricula_v2_course_table").update(b);
    },
    showCourseWeight: function(a) {
        $(a).up("th").select(".iWeightView").invoke("hide");
        $(a).up("th").select(".iWeightEdit").invoke("show");
        if (acurriculaPH.subject.courses != null) {
            var c = "";
            var b = 0;
            acurriculaPH.subject.courses.each(function(d) {
                c = "curriculum_course_weight_" + d.id;
                if (d.weight == null) {
                    b = 0;
                } else {
                    b = d.weight;
                }
                if ($(c)) {
                    $(c).update('<input id= "curr_courseWeight_val_' + d.id + '" type="text" value ="' + b + '" size="5"/>');
                }
            });
        }
    },
    saveCourseWeight: function() {
        var a = [];
        if (acurriculaPH.subject.courses != null) {
            var b = "";
            acurriculaPH.subject.courses.each(function(d) {
                b = "curr_courseWeight_val_" + d.id;
                if ($(b)) {
                    var e = {};
                    e.id = d.id;
                    e.curriculum = {};
                    e.curriculum.id = acurriculaPH.curricula.id;
                    e.weight = $(b).value;
                    if (e.weight == null) {
                        e.weight = 0;
                    }
                    a.push(e);
                }
            });
            if (a != null && a.size() > 0) {
                curriculumManager.coursesWeightSave(a, {
                    callback: function(c) {
                        if (!c.isError) {
                            ccachePH.cache.unset("subjectList" + acurriculaPH.curricula.id);
                            ccachePH.getCurriculumShortEmpty(acurriculaPH.curricula.id);
                            ccachePH.subjectList(acurriculaPH.curricula.id, function(d) {
                                acurriculaPH.subjectList = d;
                                acurriculaPH.subject = chelperPH.arrFindById(acurriculaPH.subject.id, acurriculaPH.subjectList);
                                acurriculaPH.courseList(acurriculaPH.subject.id);
                            });
                        } else {
                            chelperPH.showError("Ошибка");
                        }
                    }
                });
            }
        }
    },
    courseShow: function(c, b) {
        if (acurriculaPH.subject != null) {
            var a = acurriculaPH.subject.courses;
            if (a == null) {
                a = [];
            }
            acurriculaPH.course = chelperPH.arrFindById(c, a);
            if (acurriculaPH.course != null) {
                acurriculaPH.courseDraw(acurriculaPH.course, null, b);
            } else {
                shout("courseShow: course not found");
            }
        } else {
            shout("courseShow: subject is null");
        }
    },
    courseNewSave: function(c, a, b) {
        acurriculaPH.course = {};
        acurriculaPH.courseFormSave(c, a, b);
    },
    courseForm: function(a) {
        ccachePH.shortStaffPersonList(guserPH.user.selectedGroupId, function(d) {
            if ($("acurricula_course_new")) {
                if ($("acurricula_course_new").up("tr")) {
                    $("acurricula_course_new").up("tr").show();
                }
            }
            var e = acurriculaPH.courseGetGradeTypes(acurriculaPH.gtList);
            e.each(function(f) {
                f.checked = null;
            });
            var c = $(document.createElement("form"));
            c.id = "formCurriculumCourse";
            var b = {};
            b.isEditMode = acurriculaPH.isEditMode;
            b.isTeacherMode = false;
            if (!acurriculaPH.isEditMode) {
                if (b.person != null && b.person.id == guserPH.user.id) {
                    b.isEditMode = true;
                    b.isTeacherMode = true;
                }
            }
            c.setDataObj(b);
            c.addDataHelper("curriculumModuleList", acurriculaPH.curriculumModuleList);
            c.addDataHelper("curriculumClassLevels", acurriculaPH.curricula.classLevels);
            c.addDataHelper("gradeTypes", e);
            c.addDataHelper("currTypeId", acurriculaPH.curricula.type.id);
            c.addDataHelper("gradeSchemas", acurriculaPH.gradeSchemas);
            c.addDataHelper("curriculumName", acurriculaPH.curricula.name);
            c.addDataHelper("subjectName", acurriculaPH.subject.name);
            c.addDataHelper("teachers", d);
            c.drawEditMode($("acurricula_course_new"));
            c.bindSaveAction(acurriculaPH.courseNewSave);
            if ($("a_curricula_v2_course_table").down("tr.nocontent")) {
                $("a_curricula_v2_course_table").down("tr.nocontent").hide();
            }
            $("a_curricula_v2_course_table").down("tfoot").hide();
        });
    },
    courseDraw: function(crs, tplDivId, isEditMode) {
        ccachePH.shortStaffPersonList(guserPH.user.selectedGroupId, function(memberList) {
            ccachePH.courseFind(crs.id, function(course) {
                acurriculaPH.course = course;
                var gradeTypes = acurriculaPH.courseGetGradeTypes(acurriculaPH.gtList);
                gradeTypes.each(function(gradeType) {
                    gradeType.checked = null;
                    if (course.id != null) {
                        var x = null;
                        eval("var x = course.gradeSchema" + gradeType.id);
                        if (x != null) {
                            gradeType.checked = true;
                            gradeType.gsId = x.id;
                        } else {
                            gradeType.checked = false;
                        }
                        acurriculaPH.curricula;
                    }
                });
                acurriculaPH.currPageDraw();
                $("a_curricula_v2_curr_course_data").show();
                if ($("a_curricula_v2_curr_data") != null && $("a_curricula_v2_curr_data").up("div")) {
                    $("a_curricula_v2_curr_data").up("div").hide();
                }
                if ($("a_curricula_v2_subj_data") != null) {
                    $("a_curricula_v2_subj_data").hide();
                }
                var myform = $(document.createElement("form"));
                myform.id = "formCurriculumCourse";
                course.isEditMode = acurriculaPH.isEditMode;
                course.isTeacherMode = false;
                if (!acurriculaPH.isEditMode) {
                    if (course.person != null && course.person.id == guserPH.user.id) {
                        course.isEditMode = true;
                        course.isTeacherMode = true;
                    }
                }
                myform.setDataObj(course);
                myform.addDataHelper("curriculumModuleList", acurriculaPH.curriculumModuleList);
                myform.addDataHelper("curriculumClassLevels", acurriculaPH.curricula.classLevels);
                myform.addDataHelper("gradeTypes", gradeTypes);
                myform.addDataHelper("currTypeId", acurriculaPH.curricula.type.id);
                myform.addDataHelper("gradeSchemas", acurriculaPH.gradeSchemas);
                myform.addDataHelper("curriculumName", acurriculaPH.curricula.name);
                myform.addDataHelper("subjectName", acurriculaPH.subject.name);
                myform.addDataHelper("teachers", memberList);
                if (isEditMode) {
                    myform.drawEditMode($("a_curricula_v2_curr_course_data"));
                } else {
                    myform.drawViewMode($("a_curricula_v2_curr_course_data"));
                }
                myform.bindSaveAction(acurriculaPH.courseFormSave);
            });
        });
    },
    courseFormSave: function(e, a, d) {
        if (!acurriculaPH.course) {
            acurriculaPH.course = {};
            acurriculaPH.course.subject = {};
            acurriculaPH.course.subject.id = acurriculaPH.subjectId;
        }
        if (acurriculaPH.course.subject == null) {
            acurriculaPH.course.subject = {};
            acurriculaPH.course.subject.id = acurriculaPH.subject.id;
        }
        if (acurriculaPH.course.subject.id != null) {
            d.clearErrors();
            if (e.purpose != null && e.purpose.length > 4000) {
                d.showError("purpose", "Слишком длинный текст");
            }
            if (e.expect != null && e.expect.length > 4000) {
                d.showError("expect", "Слишком длинный текст");
            }
            if (e.content != null && e.content.length > 4000) {
                $(getFormName()).showError("content", "Слишком длинный текст");
            }
            if (isNaN(e.capacity)) {
                d.showError("capacity", "Должно быть число");
            }
            if (e.integrations != null && e.integrations.size() > 0) {
                for (var c = 0; c < e.integrations.size(); c++) {
                    var b = e.integrations[c];
                    if (b.description != null && b.description.length > 255) {
                        d.showError("integrations_" + b.id + "_description", "Слишком длинный текст");
                    }
                }
            }
            var f = acurriculaPH.courseGetGradeTypes(acurriculaPH.gtList);
            f.each(function(g) {
                var h = null;
                if ($("a_curricula_v2_course_form_gs_ck_" + g.id) != null && $("a_curricula_v2_course_form_gs_ck_" + g.id).checked) {
                    h = {};
                    if (!$F($("a_curricula_v2_course_form_gs_dd_" + g.id))) {
                        d.showError($("a_curricula_v2_course_form_gs_dd_" + g.id).identify());
                    }
                    h.id = $F($("a_curricula_v2_course_form_gs_dd_" + g.id));
                }
                e["gradeSchema" + g.id] = h;
            });
            if ($("autocalculateGrade2") != null && $("autocalculateGrade2").checked) {
                e["autocalculateGrade2"] = true;
            } else {
                e["autocalculateGrade2"] = false;
            }
            if ($("autocalculateGrade4") != null && $("autocalculateGrade4").checked) {
                e["autocalculateGrade4"] = true;
            } else {
                e["autocalculateGrade4"] = false;
            }
            if ($("autocalculateGrade18") != null && $("autocalculateGrade18").checked) {
                e["autocalculateGrade18"] = true;
            } else {
                e["autocalculateGrade18"] = false;
            }
            if (d.getErrorCount()) {} else {
                e.id = acurriculaPH.course.id;
                e.subjectType = {};
                e.subjectType.id = acurriculaPH.subjTypeId;
                e.curriculum = {
                    id: acurriculaPH.curricula.id
                };
                e.subject = {
                    id: acurriculaPH.course.subject.id
                };
                acurriculaPH.course.curriculum = acurriculaPH.curricula;
                curriculumManager.courseSave(e, false, {
                    callback: function(h) {
                        cappPH.doGroupRefresh();
                        var g = false;
                        if (acurriculaPH.course.id == null) {
                            g = true;
                        }
                        acurriculaPH.course = h.returnObject;
                        ccachePH.courseListUpdate(acurriculaPH.curricula.id, acurriculaPH.course);
                        ccachePH.cache.unset("courseFind" + acurriculaPH.course.id);
                        ccachePH.cache.unset("subjectList" + acurriculaPH.curricula.id);
                        ccachePH.getCurriculumShortEmpty(acurriculaPH.curricula.id);
                        ccachePH.subjectList(acurriculaPH.curricula.id, function(i) {
                            acurriculaPH.subjectList = i;
                            acurriculaPH.subject = chelperPH.arrFindById(acurriculaPH.subject.id, acurriculaPH.subjectList);
                            if (g) {
                                acurriculaPH.courseList(acurriculaPH.subject.id);
                            } else {
                                ccachePH.courseFind(acurriculaPH.course.id, function(j) {
                                    acurriculaPH.courseShow(acurriculaPH.course.id, false);
                                });
                            }
                        });
                    }
                });
            }
        } else {
            shout("courseFormSave: acurriculaPH.course.subject.id is null ");
        }
    },
    courseFormCancel: function() {
        acurriculaPH.courseList(acurriculaPH.subject.id);
    },
    changeCourseActiveStatus: function(d, b) {
        if (d != null) {
            var a;
            if (b) {
                a = "Вы уверены, что хотите активировать предметный курс?";
            } else {
                b = false;
                a = "Вы уверены, что хотите заархивировать предметный курс?";
            }
            var c = confirm(a);
            if (c) {
                showLoadingIndicator("appContent");
                curriculumManager.setCourseActive(d, b, {
                    callback: function(f) {
                        cappPH.doGroupRefresh();
                        var e = false;
                        if (acurriculaPH.course.id == null) {
                            e = true;
                        }
                        acurriculaPH.course = f.returnObject;
                        ccachePH.courseListUpdate(acurriculaPH.curricula.id, acurriculaPH.course);
                        ccachePH.cache.unset("courseFind" + acurriculaPH.course.id);
                        ccachePH.cache.unset("subjectList" + acurriculaPH.curricula.id);
                        ccachePH.getCurriculumShortEmpty(acurriculaPH.curricula.id);
                        ccachePH.subjectList(acurriculaPH.curricula.id, function(g) {
                            acurriculaPH.subjectList = g;
                            acurriculaPH.subject = chelperPH.arrFindById(acurriculaPH.subject.id, acurriculaPH.subjectList);
                            if (e) {
                                acurriculaPH.courseList(acurriculaPH.subject.id);
                            } else {
                                ccachePH.courseFind(acurriculaPH.course.id, function(h) {
                                    acurriculaPH.courseShow(acurriculaPH.course.id, false);
                                });
                            }
                        });
                    }
                });
            }
        } else {
            shout("curriculumId is null");
        }
    },
    filterSubjects: function(d, a) {
        if (acurriculaPH.subjectList != null) {
            if (a != null && a.length > 0) {
                var e = [];
                for (var b = 0; b < acurriculaPH.subjectList.size(); b++) {
                    var c = acurriculaPH.subjectList[b];
                    if (c != null) {
                        if (c.name.toLowerCase().include(a) || a.include(c.name.toLowerCase())) {
                            e.push(c);
                        }
                    }
                }
                acurriculaPH.subjListDraw(e);
            } else {
                acurriculaPH.subjListDraw(acurriculaPH.subjectList);
            }
        }
    },
    filterCourses: function(d, a) {
        if (acurriculaPH.subject.courses != null) {
            if (a != null && a.length > 0) {
                var e = [];
                a = a.toLowerCase();
                for (var b = 0; b < acurriculaPH.subject.courses.size(); b++) {
                    var c = acurriculaPH.subject.courses[b];
                    if (c != null) {
                        if (c.name.toLowerCase().include(a) || a.include(c.name.toLowerCase())) {
                            e.push(c);
                        }
                    }
                }
                acurriculaPH.courseListDraw(e);
            } else {
                acurriculaPH.courseListDraw(acurriculaPH.subject.courses);
            }
        }
    },
    getSubjectTypesForIntegr: function() {
        var a = $H();
        if (acurriculaPH.subjectList != null) {
            acurriculaPH.subjectList.each(function(b) {
                if (acurriculaPH.subject.type.id != b.type.id && b.courses != null && b.courses.size() > 0) {
                    a.set(b.type.id, b.type);
                }
            });
        }
        return a.values();
    },
    fillCoursesForIntegr: function(c) {
        var a = $F(c);
        $(c).next().show();
        var b = "";
        if (a != null && a > "") {
            acurriculaPH.subjectList.each(function(d) {
                if (acurriculaPH.subject.id != d.id && d.courses != null && d.courses.size() > 0 && d.type != null && d.type.id == a) {
                    d.courses.each(function(e) {
                        b += '<option value="' + e.id + '">' + e.name + "</option>";
                    });
                }
            });
        } else {}
        $(c).next().next().show();
        $(c).next().update(b);
    },
    courseGetGradeTypes: function(b) {
        var c = $A();
        var a = 0;
        b.each(function(d) {
            if (d.id == GRADE_TYPES.LESSON || d.id == GRADE_TYPES.TERM_EXAM || d.id == GRADE_TYPES.TERM || d.id == GRADE_TYPES.EXAM || d.id == GRADE_TYPES.ANNUAL || d.id == GRADE_TYPES.ASSESSMENT || d.id == GRADE_TYPES.GRADE || d.id == GRADE_TYPES.COURSE) {
                if (d.id == GRADE_TYPES.LESSON) {
                    c[0] = d;
                } else {
                    if (d.id == GRADE_TYPES.TERM_EXAM) {
                        c[1] = d;
                    } else {
                        if (d.id == GRADE_TYPES.TERM) {
                            c[2] = d;
                        } else {
                            if (d.id == GRADE_TYPES.EXAM) {
                                c[3] = d;
                            } else {
                                if (d.id == GRADE_TYPES.ANNUAL) {
                                    c[4] = d;
                                } else {
                                    if (d.id == GRADE_TYPES.ASSESSMENT) {
                                        c[5] = d;
                                    } else {
                                        if (d.id == GRADE_TYPES.GRADE) {
                                            c[6] = d;
                                        } else {
                                            if (d.id == GRADE_TYPES.COURSE) {
                                                c[7] = d;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        return c;
    },
    toggleSpecification: function() {
        var b = document.getElementById("stateCurriculumSubject").value;
        var a = acurriculaPH.subjectWithDescriptionsMap.get(b);
        var d = document.getElementById("specification");
        if (a != null && typeof a !== "undefined") {
            var c = "<select name = 'subjectSpecification_id' ><option value = '-1'>Выбрать</option>";
            a.availableSpecifications.forEach(function(e) {
                c += "<option value=" + e.id + ">" + e.description + "</option>";
            });
            c += " </select>";
            d.innerHTML = c;
        } else {
            d.innerHTML = "";
        }
    },
    setSubjectWithDescriptionsMap: function(b) {
        var a = new Map();
        b.forEach(function(c) {
            if (c.needsSpecification) {
                a.set(c.id.toString(), c);
            }
        });
        acurriculaPH.subjectWithDescriptionsMap = a;
    },
};