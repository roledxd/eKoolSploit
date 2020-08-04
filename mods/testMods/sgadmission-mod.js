var sgadmissionPH = {
    settingsClick: function() {
        gadmissionPH.selMenuItem = gadmissionPH.MENU_ITEMS.SETTINGS;
        showLoadingIndicator($("appContent"));
        ccachePH.groupObj(gadmissionPH.instId, true, function(a) {
            ccachePH.exemptReasonList(gadmissionPH.instId, function(b) {
                var e = TemplateEngine.parseById("g_admission_admission_setup_ph", null);
                $("appContent").update(e);
                var d = $(document.createElement("form"));
                d.id = "formAdmissionSettings";
                d.setDataObj(a.groupData);
                d.addDataHelper("isAllowModify", true);
                d.drawViewMode($("g_admission_admission_setup_form_ph"));
                d.bindSaveAction(gadmissionPH.admissionSettingsSave);
                var c = $(document.createElement("form"));
                c.id = "formAdmissionExemptReason";
                c.setDataObj({
                    "exemptReasons": b
                });
                c.drawViewMode($("g_admission_admission_exemptReason_list"));
                c.bindSaveAction(sgadmissionPH.saveExemptReasonList);
                hideLoadingIndicator($("appContent"));
            });
        });
    },
    saveExemptReasonList: function(c, a) {
        showLoadingIndicator($("appContent"));
        $(getFormName()).clearErrors();
        var b = c.exemptReasons;
        schoolGroupAdmissionManager.saveExemptReasonList(b, dwrNumber(gadmissionPH.instId), {
            callback: function(d) {
                ccachePH.exemptReasonListEmpty(gadmissionPH.instId);
                sgadmissionPH.settingsClick();
                hideLoadingIndicator($("appContent"));
            }
        });
    },
    showSchoolGroupRequest: function(a) {
        $("g_admission_student_page_request_info_ph").show();
        $("g_admission_student_page").hide();
        showLoadingIndicator("g_admission_student_page_request_info_ph");
        schoolGroupRequestManager.showSchoolGroupRequest(dwrNumber(a), dwrNumber(gadmissionPH.instId), {
            callback: function(b) {
                var d = null;
                if (b.returnObject.schoolDestanceList != null) {
                    d = b.returnObject.schoolDestanceList.sort(function(g, e) {
                        var f = new Number(g.nr);
                        var h = new Number(e.nr);
                        return sortNumericAsc(f, h);
                    });
                }
                var c = TemplateEngine.parseById("hidden_schoolGroup_request_data", {
                    "request": b.returnObject.request,
                    "schoolDestanceList": d,
                    "logs": b.returnObject.logs
                });
                $("g_admission_student_page_request_info").update(c);
                $("g_admission_student_page_request_logs_ph").update("");
                hideLoadingIndicator("g_admission_student_page_request_info_ph");
            }
        });
    },
    activateRefListItem: function(a) {
        showLoadingIndicator($("appContent"));
        refListItemManager.activateRefListItem(dwrNumber(a), {
            callback: function(b) {
                chelperPH.showNotice("Успешно добавлено");
                gadmissionPH.studentsPage(a);
                hideLoadingIndicator($("appContent"));
            }
        });
    },
    rejectRefListItem: function(b) {
        var a = confirm("Вы уверены?");
        if (a) {
            showLoadingIndicator($("appContent"));
            refListItemManager.rejectRefListItem(dwrNumber(b), {
                callback: function(c) {
                    chelperPH.showNotice("Отклонено");
                    ccachePH.partnerListEmpty(gadmissionPH.instId);
                    gadmissionPH.studentsPage(b);
                    hideLoadingIndicator($("appContent"));
                }
            });
        }
    },
    acceptSchoolGroupRequest: function(c, b) {
        var a = confirm("Вы уверены?");
        if (a) {
            showLoadingIndicator($("appContent"));
            schoolGroupRequestManager.acceptSchoolGroupRequest(dwrNumber(c), {
                callback: function(d) {
                    chelperPH.showNotice("Принято");
                    ccachePH.partnerListEmpty(gadmissionPH.instId);
                    gadmissionPH.studentsPage(b);
                    hideLoadingIndicator($("appContent"));
                }
            });
        }
    },
    saveSchoolGroupRequest: function(e, a, d) {
        d.clearErrors();
        var c = {};
        screquestPH.checkSchoolGroupRequest(d);
        if (e.guardian.name1 == null || e.guardian.name1.strip().length == 0) {
            d.showError("guardian_name1", "Пожалуйста, введите имя");
        }
        if (e.guardian.name2 == null || e.guardian.name2.strip().length == 0) {
            d.showError("guardian_name2", "Пожалуйста, введите фамилию");
        }
        if (e.guardian.idCode == null || e.guardian.idCode.length < 1) {
            d.showError("guardian_idCode", "Пожалуйста, введите личный код");
        }
        if (e.guardian.address.street == null || e.guardian.address.street.length < 1) {
            d.showError("guardian_address_street", "Пожалуйста, введите адрес");
        } else {
            if (e.guardian.address.country == null || e.guardian.address.country.id < 0) {
                d.showError("guardian_address_country_id", "Пожалуйста, введите адрес");
            }
        }
        if (e.guardian.email.name == null || e.guardian.email.name.length < 1) {
            e.guardian.email = null;
        }
        if (e.guardian.phone.phoneNumber == null || e.guardian.phone.phoneNumber.length < 1) {
            e.guardian.phone = null;
        }
        if (d.getErrorCount() == 0) {
            var b = null;
            c.lang = e.lang;
            if (e.isSiblings) {
                c.siblings = e.siblings;
            }
            var f = c.siblings;
            c.desiredPartners = e.desiredPartners;
            c.status = SCHOOLGROUP_REQUEST_STATUSES.ACCEPTED;
            showLoadingIndicator("appContent");
            getFormName = function() {
                return d.id;
            };
            schoolGroupRequestManager.saveSchoolGroupRequestBySchoolGroup(c, dwrNumber(gadmissionPH.refItem.id), f, e.guardian, dwrNumber(gadmissionPH.instId), {
                callback: function(g) {
                    gadmissionPH.studentsPage(gadmissionPH.refItem.id);
                    hideLoadingIndicator("appContent");
                }
            });
        }
    },
    verifySiblingBySchoolGroup: function(b, c) {
        var a = confirm("Вы уверены?");
        if (a) {
            showLoadingIndicator("appContent");
            schoolGroupRequestManager.verifySiblingBySchoolGroup(dwrNumber(b), dwrNumber(c), {
                callback: function(d) {
                    chelperPH.showNotice("Подтверждено");
                    sgadmissionPH.showSchoolGroupRequest(c);
                    hideLoadingIndicator("appContent");
                }
            });
        }
    },
    designateSchool: function(d, a, c) {
        c.clearErrors();
        var e = d.partner.id;
        if (e == null || e < 1) {
            c.showError("partner_id", "Пожалуйста, выберите школу");
        }
        if (c.getErrorCount() == 0) {
            var b = d.explanation;
            if (d.explanation != null && d.explanation.length == 0) {
                b = null;
            }
            showLoadingIndicator("appContent");
            schoolGroupAdmissionManager.designateSchool(dwrNumber(e), dwrNumber(gadmissionPH.refItem.id), b, {
                callback: function(f) {
                    ccachePH.partnerListEmpty(gadmissionPH.instId);
                    ccachePH.partnerList(gadmissionPH.instId, function(g) {
                        gadmissionPH.studentsPage(gadmissionPH.refItem.id);
                        hideLoadingIndicator("appContent");
                    });
                }
            });
        }
    },
    removeDesignatedSchool: function() {
        var a = confirm("Вы уверены?");
        if (a) {
            showLoadingIndicator("appContent");
            schoolGroupAdmissionManager.removeDesignateSchool(dwrNumber(gadmissionPH.refItem.id), {
                callback: function(b) {
                    ccachePH.partnerListEmpty(gadmissionPH.instId);
                    ccachePH.partnerList(gadmissionPH.instId, function(c) {
                        gadmissionPH.studentsPage(gadmissionPH.refItem.id);
                        hideLoadingIndicator("appContent");
                    });
                }
            });
        }
    },
    showDesignatedImportForm: function(b) {
        var a = TemplateEngine.parseById("g_admission_designated_places_import_form", null);
        $("g_admission_content").update(a);
    },
    cancelDesignatedImportForm: function(a) {
        gadmissionPH.schoolsList();
    },
    importDesignatedPlaces: function(a) {
        showLoadingIndicator("appContent");
        admissionImportExportManager.importDesignatedPlaces(dwrNumber(gadmissionPH.instId), $("g_admission_designated_import_form_file"), {
            callback: function(b) {
                var c = TemplateEngine.parseById("g_admission_designated_places_import_form_done", {
                    "failedList": b.returnObject.failed,
                    "warningList": b.returnObject.warnings,
                    "okCount": b.returnObject.successful
                });
                $("g_admission_content").update(c);
                ccachePH.partnerListEmpty(gadmissionPH.instId);
                ccachePH.partnerList(gadmissionPH.instId, function(d) {
                    hideLoadingIndicator("appContent");
                });
            }
        });
    },
    setConfirmedSchool: function(c, a, b) {
        b.clearErrors();
        var d = c.partner.id;
        if (d == null || d < 1) {
            b.showError("partner_id", "Пожалуйста, выберите школу");
        }
        if (b.getErrorCount() == 0) {
            showLoadingIndicator("appContent");
            schoolGroupAdmissionManager.setConfirmedSchool(dwrNumber(d), dwrNumber(gadmissionPH.refItem.id), {
                callback: function(e) {
                    ccachePH.partnerListEmpty(gadmissionPH.instId);
                    ccachePH.partnerList(gadmissionPH.instId, function(f) {
                        gadmissionPH.studentsPage(gadmissionPH.refItem.id);
                        hideLoadingIndicator("appContent");
                    });
                }
            });
        }
    },
    removeConfirmedSchool: function() {
        var a = confirm("Вы уверены?");
        if (a) {
            showLoadingIndicator("appContent");
            schoolGroupAdmissionManager.removeConfirmedSchool(dwrNumber(gadmissionPH.refItem.id), {
                callback: function(b) {
                    ccachePH.partnerListEmpty(gadmissionPH.instId);
                    ccachePH.partnerList(gadmissionPH.instId, function(c) {
                        gadmissionPH.studentsPage(gadmissionPH.refItem.id);
                        hideLoadingIndicator("appContent");
                    });
                }
            });
        }
    },
    cedeDesignatedPartner: function(b) {
        var a = confirm("Вы уверены?");
        if (a) {
            showLoadingIndicator("appContent");
            schoolGroupAdmissionManager.cedeDesignatedPartner(dwrNumber(gadmissionPH.refItem.id), {
                callback: function(c) {
                    ccachePH.partnerListEmpty(gadmissionPH.instId);
                    ccachePH.partnerList(gadmissionPH.instId, function(d) {
                        gadmissionPH.studentsPage(gadmissionPH.refItem.id);
                        hideLoadingIndicator("appContent");
                    });
                }
            });
        }
    },
    showRevocationPlaceForm: function() {
        clayoutPH.initMMModalDialog();
        var a = TemplateEngine.parseById("hidden_g_admission_revoke_designated_place_form", {});
        clayoutPH.updateMMModalDialogContent(a);
    },
    revokeDesignatedPartner: function(b) {
        if (b != null) {
            b.clearErrors();
            var c = b.getData();
            if (c.explanation != null && c.explanation.length > 4) {
                var a = confirm("Вы уверены?");
                if (a) {
                    showLoadingIndicator("modaldialog");
                    getFormName = function() {
                        return b.id;
                    };
                    schoolGroupAdmissionManager.revokeDesignatedPartner(dwrNumber(gadmissionPH.refItem.id), c.explanation, {
                        callback: function(d) {
                            ccachePH.partnerListEmpty(gadmissionPH.instId);
                            ccachePH.partnerList(gadmissionPH.instId, function(e) {
                                gadmissionPH.studentsPage(gadmissionPH.refItem.id);
                                hideLoadingIndicator("modaldialog");
                                clayoutPH.closeMMModalDialog();
                            });
                        }
                    });
                }
            } else {
                b.showError("explanation", "Пожалуйста, введите пояснение.");
            }
        }
    },
    cedeConfirmedPartner: function(b) {
        var a = confirm("Вы уверены?");
        if (a) {
            showLoadingIndicator("appContent");
            schoolGroupAdmissionManager.cedeConfirmedPartner(dwrNumber(gadmissionPH.refItem.id), {
                callback: function(c) {
                    ccachePH.partnerListEmpty(gadmissionPH.instId);
                    ccachePH.partnerList(gadmissionPH.instId, function(d) {
                        gadmissionPH.studentsPage(gadmissionPH.refItem.id);
                        hideLoadingIndicator("appContent");
                    });
                }
            });
        }
    },
    showPersonProfileinfo: function(a) {
        if (a != null) {
            schoolGroupAdmissionManager.getPersonProfileBySchoolGroupRequest(dwrNumber(a), {
                callback: function(c) {
                    clayoutPH.initModalBox();
                    if (c.returnObject != null) {
                        var d = $H();
                        d.set("isShowEdit", true);
                        var b = TemplateEngine.parseById("hidden_cmembercard_modal", {
                            "formData": c.returnObject,
                            "formDataHelpers": d
                        });
                        $("modalbox_content").update(b);
                    } else {
                        $("modalbox_content").update("Sorry, person not found :(");
                    }
                }
            });
        }
    },
    showCedeAllDesignatedPlacesConformation: function() {
        var a = TemplateEngine.parseById("g_admission_cede_allDesignated_places_conformation", null);
        $("g_admission_content").update(a);
    },
    cedeAllDesignatedPlaces: function() {
        var a = confirm("Вы уверены?");
        if (a) {
            schoolGroupAdmissionManager.createReportsForCedingDesignatedPlaces({
                callback: function(b) {
                    $("g_admission_content").update("Назначенные места переданы.");
                }
            });
        }
    },
    findCoordinatesForRefListItems: function(b, c) {
        var a = confirm("Вы уверены?");
        if (a) {
            schoolGroupAdmissionManager.fillMissedCoordinates(b, c, {
                callback: function(d) {
                    chelperPH.showNotice("Запрос на получение координат отправлен");
                }
            });
        }
    }
};
