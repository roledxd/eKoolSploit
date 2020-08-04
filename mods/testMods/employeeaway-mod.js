var employeeAwayPH = {
    absenteeId: null,
    allSubstitutesForJournals: $H(),
    substituteTeachers: null,
    startDateTime: null,
    endDateTime: null,
    openAbsenceModalExtension: function(c) {
        var b = $("modaldialog_content");
        var a = $("absenceModalExtensionContainer");
        if (c.checked) {
            showLoadingIndicator(b);
            employeeAwayPH.getTeacherAwayDateTimes();
            employeeAwayPH.getJournalsAndPotentialSubstitutes(function(e) {
                if (e.journals && e.journals.length) {
                    e.journals.sort(sortArrObjByName);
                    var d = TemplateEngine.parseById("hidden_c_calendar_add_absence_substitute", {
                        "journals": e.journals,
                        "substitutesForJournals": e.substitutesForJournals
                    });
                    a.update(d);
                    a.show();
                    e.journals.each(function(f) {
                        f.teachers.each(function(i) {
                            var h = false;
                            var g = false;
                            employeeAwayPH.makeTeacherTagForJournal(i.teacherId, i.name1, i.name2, i.primaryTeacher, f.id, h, g);
                        });
                    });
                    hideLoadingIndicator(b);
                } else {
                    chelperPH.showError("У этого человека нет журналов для замены");
                }
            });
        } else {
            a.hide();
        }
    },
    getAbsenteeId: function(a) {
        employeeAwayPH.absenteeId = a;
        employeeAwayPH.showSubstitutesCheckbox(a);
    },
    showSubstitutesCheckbox: function(b) {
        if (true) {
            var a = $("absenceAssignSubstitutionCheckboxContainer");
            if (a) {
                a.style.display = "table-cell";
            }
        } else {
            if (a) {
                a.style.display = "none";
            }
        }
    },
    checkIfIsTraining: function(b) {
        var e = b.getValue();
        var d = gmainv2PH.groupObj.groupData.substitutionReasons;
        for (var c = 0; c < d.length; c++) {
            if (d[c].id == e && d[c].isTraining) {
                var a = {};
                employeeAwayPH.openTrainingDataForm(a);
                break;
            } else {
                $("trainingFormContainer").hide();
                $("absence_modal_disclaimer").innerHTML = "Отсутствие информация будет видна персоналу школы";
            }
        }
    },
    openTrainingDataForm: function(a) {
        var b = $("trainingFormContainer");
        var c = TemplateEngine.parseById("hidden_c_calendar_add_absence_training", {
            "training": a
        });
        b.update(c);
        b.show();
        $("absence_modal_disclaimer").innerHTML = "Отсутствие информация будет видна персоналу школы, информация об обучении будет видна только руководству школы.";
    },
    hasTeacherRole: function(c) {
        return true;
    },
    getJournalsAndPotentialSubstitutes: function(a) {
        var b = employeeAwayPH.absenteeId;
        employeeAwayPH.substituteTeachers = [];
        if (b) {
            journalManager.getJournalsAndPotentialSubstitutes(b, {
                callback: function(c) {
                    if (c.returnObject != null) {
                        var d = c.returnObject;
                        if (a) {
                            a(d);
                        }
                    } else {
                        chelperPH.showError("Извините, у вас нет прав назначать замены для этого человека");
                        hideLoadingIndicator($("modaldialog_content"));
                    }
                }
            });
        } else {
            chelperPH.showError("Пожалуйста, введите отсутствующий");
        }
    },
    toggleSubstituteTeacherDropdownUl: function(a) {
        if ($("addSubstituteTeacherDropdownUl_" + a)) {
            $("addSubstituteTeacherDropdownUl_" + a).toggle();
        }
    },
    refreshSubsTeacherSearchForm: function(d) {
        var a = $("subsTeacherSearch_" + d).value;
        var c = chelperPH.arrFindBySearchStr(a, $H(employeeAwayPH.allSubstitutesForJournals).get(d));
        var b = TemplateEngine.parseById("addSubstituteTeacherDropdownTemplate", {
            "substitutesForJournal": c,
            "journalId": d
        });
        $("addSubstituteTeacherDropdownUlContainer_" + d).update(b);
        $("addSubstituteTeacherDropdownUl_" + d).show();
    },
    makeTeacherTagForJournal: function(f, k, l, i, a, c, e) {
        var b = k + " " + l;
        var j = "subTeacherSelected_" + a;
        var h = (e) ? '<a class="close OP1 NOBG" style="text-indent:0;" onclick="employeeAwayPH.deleteSubTeacher(' + f + ", " + a + ", " + c + ', $(this)); event.stopPropagation();"><i class="ico ico-x_close" style="font-size: 10px;color: white!important"></i></a>' : "";
        var g = (i) ? "tag greenTag primary" : "tag greenTag";
        var d = '<div class="' + g + '" id="' + j + '"><span>' + b + "</span>" + h + "</div>";
        $("absenceFormAddSubstitute_" + a).innerHTML += d;
        if (c) {
            employeeAwayPH.saveSubTeacherToGlobalVar(f, a);
        }
    },
    saveSubTeacherToGlobalVar: function(a, c) {
        var b = {};
        b.journal = {
            id: c
        };
        b.person = {
            id: a
        };
        employeeAwayPH.substituteTeachers.push(b);
    },
    sortSubstituteTeachers: function(f, e) {
        var d = f.person;
        var c = e.person;
        if (d.name1 != null && d.name2 != null && c.name1 != null && c.name2 != null) {
            return sortMemberByLastName(d, c);
        } else {
            return 0;
        }
    },
    checkIfIsAlreadyInJournal: function(b, a) {
        b.each(function(d) {
            for (var c = 0; c < a.teachers.length; c++) {
                var e = a.teachers[c];
                if (d.teacher && d.teacher.id == e.teacherId) {
                    d.isAlreadyJournalTeacher = true;
                    break;
                }
            }
        });
        return b;
    },
    deleteSubTeacher: function(a, f, e, c) {
        if (e) {
            for (var b = 0; b < employeeAwayPH.substituteTeachers.length; b++) {
                var d = employeeAwayPH.substituteTeachers[b];
                if (d.person.id == a && d.journal.id == f) {
                    employeeAwayPH.substituteTeachers.splice(b, 1);
                    $(c).up().remove();
                }
            }
        } else {
            journalManager.journalTeacherRelRemove(dwrNumber(a), dwrNumber(f), dwrNumber(gmainv2PH.groupId), function(g) {
                if (g.returnObject && !g.isError) {
                    $(c).up().remove();
                } else {
                    chelperPH.showError("Удаление не удалось");
                }
            });
        }
    },
    getNewAbsence: function(a) {
        $LAB.script(chelperPH.resourcedir + "c/cal/js/ccalPH.js").wait(function() {
            var b = $("hidden_c_calendar_add_absence_form");
            b.clearErrors();
            var c = b.getData();
            if (a != null && (typeof a != "undefined")) {
                c.id = a;
            }
            c = ccalPH.eventFormSaveParseTime(c);
            employeeAwayPH.parseAbsenceForm(b, c);
        });
    },
    parseAbsenceForm: function(a, b) {
        if (employeeAwayPH.absenteeId == null) {
            a.showError("person", "Пожалуйста выберите отсутствующий");
        } else {
            b.person = {
                id: employeeAwayPH.absenteeId
            };
        }
        if (!b.eventDate) {
            a.showError("eventDate", "Пожалуйста, введите время начала");
        }
        if (!b.eventDateEnd) {
            a.showError("eventDateEnd", "Пожалуйста, введите время окончания");
        }
        if (b.absenceReason == "-1") {
            a.showError("absenceReason", "Пожалуйста, введите причину отсутствия");
        } else {
            b.absenceReason = {
                id: b.absenceReason
            };
        }
        if (b.trainingInformation) {
            b = employeeAwayPH.parseTraining(b);
        }
        if (a.getErrorCount() === 0) {
            employeeAwayPH.parseSubstitutions(b);
        }
    },
    parseTraining: function(a) {
        a.training = true;
        a.trainingInformation.id = employeeAwayPH.trainingInformationId;
        if (a.trainingInformation.cost) {
            parseInt(a.trainingInformation.cost);
        }
        if (a.trainingInformation.volume) {
            parseInt(a.trainingInformation.volume);
        }
        return a;
    },
    parseSubstitutions: function(a) {
        a.substitutions = [];
        a.substitutions = employeeAwayPH.substituteTeachers;
        if (a.substitutions && a.substitutions.length) {
            if (!a.emailStudents) {
                a.substitutions.each(function(b) {
                    b.sendNotificationToJournal = false;
                });
            }
            if (!a.emailSubstitutes) {
                a.substitutions.each(function(b) {
                    b.sendMailToSubstitu = false;
                });
            }
        }
        employeeAwayPH.saveNewOrEditAbsence(a);
    },
    saveNewOrEditAbsence: function(b) {
        var a = $("modaldialog_content");
        showLoadingIndicator(a);
        calendarManager.saveEmployeeAwayCalendarEvent(b, {
            callback: function(c) {
                clayoutPH.closeModalBox();
                hideLoadingIndicator(a);
                chelperPH.callcode(gmainv2PH.eventsFormSaveDone.bind(gmainv2PH), c.returnObject);
            }.bind(this)
        });
    },
    hasRightsToEdit: function() {
        return true;
    },
    hasRightsToSeeTraining: function() {
        return true;
    },
    deleteAbsence: function(a) {
        if (confirm("Вы уверены, что желаете удалить отсутствие?")) {
            var b = {
                id: a,
                person: {
                    id: employeeAwayPH.absenteeId
                }
            };
            calendarManager.deleteEmployeeAwayCalendarEvent(b, {
                callback: function(c) {
                    chelperPH.showNotice("Отсутствие удалено");
                    clayoutPH.closeModalBox();
                    chelperPH.callcode(gmainv2PH.eventsFormSaveDone.bind(gmainv2PH), c.returnObject);
                }.bind(this)
            });
        }
    },
    getIsOccupied: function(a) {
        var b = false;
        if (a.length) {
            a.each(function(c) {
                var e = employeeAwayPH.getDateObjFromString(c.eventDate, c.beginHour, c.beginHourMins);
                if (c.endHour == null && c.endHourMins == null) {
                    c.endHour = "23";
                    c.endHourMins = "59";
                }
                var d = employeeAwayPH.getDateObjFromString(c.eventDateEnd, c.endHour, c.endHourMins);
                if (employeeAwayPH.startDateTime != null && employeeAwayPH.endDateTime != null) {
                    if ((employeeAwayPH.startDateTime >= e && employeeAwayPH.startDateTime <= d) && (employeeAwayPH.endDateTime >= e && employeeAwayPH.endDateTime <= d)) {
                        b = true;
                    }
                }
            });
            return b;
        }
    },
    getTeacherAwayDateTimes: function() {
        var a = $("eventDate").getValue();
        var b = $("c_calendar_v2_event_form_btimeh").getValue();
        var f = $("c_calendar_v2_event_form_btimem").getValue();
        employeeAwayPH.startDateTime = employeeAwayPH.getDateObjFromString(a, b, f);
        var e = $("eventDateEnd").getValue();
        var d = $("c_calendar_v2_event_form_etimeh").getValue();
        var c = $("c_calendar_v2_event_form_etimem").getValue();
        if (d.length == 0 && c.length == 0) {
            d = "23";
            c = "59";
        }
        employeeAwayPH.endDateTime = employeeAwayPH.getDateObjFromString(e, d, c);
    },
    getDateObjFromString: function(b, a, c) {
        a = a ? a : "";
        if (a <= 9 && a.length == 1) {
            a = "0" + a;
        }
        c = c ? c : "";
        b = chelperPH.getDateStringWithZeros(b);
        b += " " + a;
        if (c.length) {
            b += (":") + c;
        }
        b = chelperPH.getDate(b, true);
        return b;
    }
};