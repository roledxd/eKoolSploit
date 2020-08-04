var institutionProfilePH = {
    foldername: "a",
    institution: null,
    contactData: null,
    isAdmin: true,
    isHeadmaster: true,
    INST_MENU_NAMES: {
        GENERAL: "general",
        CONTACT: "contact",
        SERVICES: "services",
        FILEMANAGERADM: "filemanageradm"
    },
    show: function(b, a) {
        institutionProfilePH.isAdmin = true;
        institutionProfilePH.isHeadmaster = true;
        ccachePH.groupTypesList(function() {
            ccachePH.statesList(function() {
                chelperPH.loadTemplateHidd(chelperPH.resourcedir + institutionProfilePH.foldername + "/profile/tpl/institution_profile_tpl.html", function() {
                    ccachePH.institutionObj(a, function(c) {
                        institutionProfilePH.institution = c;
                        institutionProfilePH.showInstitutionProfile();
                    });
                });
            });
        });
    },
    showInstitutionProfile: function() {
        var a = TemplateEngine.parseById("hidden_a_institution_profile_menu", {
            "isAdmin": institutionProfilePH.isAdmin,
            "isHeadmaster": institutionProfilePH.isHeadmaster,
            institution: institutionProfilePH.institution
        });
        $("schoolDatainsert").update(a).show();
        institutionProfilePH.onInstitutionProfileMenuClick(institutionProfilePH.INST_MENU_NAMES.GENERAL);
    },
    showFileManagerAdmModule: function() {
        $LAB.script(chelperPH.resourcedir + "g/fileManager/js/fileManagerAdmPH.js").wait(function() {
            fileManagerAdmPH.show();
        });
    },
    onInstitutionProfileMenuClick: function(a) {
        if (a == institutionProfilePH.INST_MENU_NAMES.GENERAL) {
            institutionProfilePH.showGeneralSettings();
        } else {
            if (a == institutionProfilePH.INST_MENU_NAMES.CONTACT) {
                institutionProfilePH.showContactData();
            } else {
                if (a == institutionProfilePH.INST_MENU_NAMES.SERVICES) {
                    institutionProfilePH.showServices();
                } else {
                    if (a == institutionProfilePH.INST_MENU_NAMES.FILEMANAGERADM) {
                        institutionProfilePH.showFileManagerAdm();
                    } else {
                        shout("unhandled menu name");
                    }
                }
            }
        }
    },
    _showProfileMainData: function(a, b) {
        if (b == null) {
            b = $("a_institution_profile_mainData_ph");
        }
        if ($(b)) {
            b.style.opacity = 0;
            $(b).update(a);
            Effect.Appear(b, {
                duration: 0.5
            });
        }
    },
    showGeneralSettings: function() {
        $A($("a_institution_menu_general_item").up(".settingsMenuContainer").select("li")).invoke("removeClassName", "selected");
        $("a_institution_menu_general_item").addClassName("selected");
        var e = TemplateEngine.parseById("hidden_a_institution_general_data", {
            institution: institutionProfilePH.institution
        });
        institutionProfilePH._showProfileMainData(e);
        var g = institutionProfilePH.isAdmin;
        var a = $(document.createElement("form"));
        a.id = "formAdminSchoolSettingsSchoolName";
        ccachePH.cache.get("institution" + institutionProfilePH.institution.id);
        a.setDataObj(ccachePH.cache.get("institution" + institutionProfilePH.institution.id), null);
        a.addDataHelper("isShowEdit", g);
        a.bindSaveAction(institutionProfilePH.saveSchoolName);
        a.onsubmit = function() {
            this.commit();
        };
        a.bindPostLoadDataAction(clayoutPH.formPostRenderPrettifierFunction);
        a.drawViewMode($("a_formAdminSchoolSettingsSchoolName"));
        a = $(document.createElement("form"));
        a.id = "formAdminSchoolSettingsLang";
        a.setDataObj(ccachePH.cache.get("institution" + institutionProfilePH.institution.id), null);
        a.addDataHelper("isShowEdit", g);
        a.bindSaveAction(institutionProfilePH.saveSchoolLang);
        a.onsubmit = function() {
            this.commit();
        };
        a.bindPostLoadDataAction(clayoutPH.formPostRenderPrettifierFunction);
        a.drawViewMode($("a_formAdminSchoolSettingsLang"));
        if (institutionProfilePH.institution.institutionType.type == INST_TYPE_TYPES.SCHOOL && (this.isAdmin || this.isHeadmaster)) {
            a = $(document.createElement("form"));
            a.id = "formAdminSchoolSettingsEhis";
            a.setDataObj(ccachePH.cache.get("institution" + institutionProfilePH.institution.id), null);
            a.addDataHelper("isShowEdit", g);
            a.bindSaveAction(institutionProfilePH.saveSchoolEhis);
            a.onsubmit = function() {
                this.commit();
            };
            a.bindPostLoadDataAction(clayoutPH.formPostRenderPrettifierFunction);
            a.drawViewMode($("a_formAdminSchoolSettingsEhis"));
        }
        $LAB.script(chelperPH.resourcedir + "c/uploader/js/cuploaderPH.js").wait(function() {
            if (g) {
                cuploaderPH.showAvatar("a_inst_block_photo", institutionProfilePH.institution.logoImgFn, true, "schoolDummy", institutionProfilePH.logoForm, institutionProfilePH.logoDel, institutionProfilePH.logoForm, true);
            } else {
                cuploaderPH.showAvatar("a_inst_block_photo", institutionProfilePH.institution.logoImgFn, false, "schoolDummy", null, null, null, true);
            }
            if ($("a_inst_block_photo")) {
                $("a_inst_block_photo").show();
            }
        });
        var h = $(document.createElement("form"));
        h.id = "formAdminSchoolSettingsAbout";
        h.setDataObj(ccachePH.cache.get("institution" + institutionProfilePH.institution.id), null);
        h.addDataHelper("isShowEdit", g);
        h.bindPostLoadDataAction(clayoutPH.formPostRenderPrettifierFunction);
        h.bindSaveAction(institutionProfilePH.saveAbout);
        h.drawViewMode($("a_inst_block_about"));
        var b = $(document.createElement("form"));
        b.id = "formAdminSchoolSettingsTimetable";
        b.setDataObj(ccachePH.cache.get("institution" + institutionProfilePH.institution.id), null);
        b.addDataHelper("isShowEdit", guserPH.userHasRole(institutionProfilePH.institution.id, ROLES.HEADMASTER) || guserPH.userHasRole(institutionProfilePH.institution.id, ROLES.ADMIN));
        b.bindPostLoadDataAction(clayoutPH.formPostRenderPrettifierFunction);
        b.bindSaveAction(institutionProfilePH.saveTimetableUrl);
        b.drawViewMode($("a_inst_block_timetable"));
        schoolManager.schoolGroupList(dwrNumber(institutionProfilePH.institution.id), {
            callback: function(j) {
                var l = j.returnObject;
                if (l != null && l.length != 0) {
                    var k = $(document.createElement("form"));
                    k.id = "formInstitutionContactGroups";
                    k.setDataObj(l, null);
                    k.addDataHelper("blockDataMap", $H());
                    k.addDataHelper("isShowEdit", g);
                    k.bindPostLoadDataAction(clayoutPH.formPostRenderPrettifierFunction);
                    k.drawViewMode($("a_inst_block_groups"));
                }
            }
        });
        var i = $(document.createElement("form"));
        i.id = "formAdminSchoolSettingsStaffMessaging";
        i.setDataObj(ccachePH.cache.get("institution" + institutionProfilePH.institution.id), null);
        i.addDataHelper("isShowEdit", g);
        i.bindSaveAction(institutionProfilePH.saveWriteToStaff);
        i.bindPostLoadDataAction(clayoutPH.formPostRenderPrettifierFunction);
        i.drawViewMode($("a_inst_block_staff_messaging"));
        var f = $(document.createElement("form"));
        f.id = "formHeadmasterCanSeeInterviewProtocols";
        f.setDataObj(ccachePH.cache.get("institution" + institutionProfilePH.institution.id), null);
        f.addDataHelper("isShowEdit", g);
        f.bindSaveAction(institutionProfilePH.saveHeadmasterCanSeeProtocols);
        f.bindPostLoadDataAction(clayoutPH.formPostRenderPrettifierFunction);
        f.drawViewMode($("a_inst_block_headmaster_protocol_rights"));
        var d = $(document.createElement("form"));
        d.id = "formAdminSchoolSettingsSENTemplate";
        d.setDataObj(ccachePH.cache.get("institution" + institutionProfilePH.institution.id), null);
        d.addDataHelper("isShowEdit", guserPH.userHasRole(institutionProfilePH.institution.id, ROLES.HEADMASTER) || guserPH.userHasRole(institutionProfilePH.institution.id, ROLES.ADMIN));
        d.bindPostLoadDataAction(clayoutPH.formPostRenderPrettifierFunction);
        d.bindSaveAction(institutionProfilePH.saveSENTemplate);
        d.drawViewMode($("a_inst_block_SEN_template"));
        var c = $(document.createElement("form"));
        c.id = "formAdminSchoolSettingsJournalTeacherRights";
        c.setDataObj(ccachePH.cache.get("institution" + institutionProfilePH.institution.id), null);
        c.addDataHelper("isShowEdit", guserPH.userHasRole(institutionProfilePH.institution.id, ROLES.HEADMASTER) || guserPH.userHasRole(institutionProfilePH.institution.id, ROLES.ADMIN));
        c.bindPostLoadDataAction(clayoutPH.formPostRenderPrettifierFunction);
        c.bindSaveAction(institutionProfilePH.saveJournalCanAddTeacher);
        c.drawViewMode($("a_inst_block_teacher_journal"));
    },
    saveJournalCanAddTeacher: function(d, a, c) {
        var b = institutionProfilePH.institution;
        b.teacherCanAddJournal = d.teacherCanAddJournal === "1";
        schoolManager.updateTeacherCanAddJournalRights(b.teacherCanAddJournal, {
            callback: function(e) {
                c.drawViewMode();
            },
            arg: {
                submitterForm: c
            }
        });
    },
    saveHeadmasterCanSeeProtocols: function(d, a, c) {
        var b = institutionProfilePH.institution;
        b.hmCanSeeInterviewProtocols = (d.hmCanSeeInterviewProtocols == "1") ? true : false;
        schoolManager.updateHeadmasterCanSeeInterviewProtocols(b.hmCanSeeInterviewProtocols, {
            callback: function(e) {
                c.drawViewMode();
            },
            arg: {
                submitterForm: c
            }
        });
    },
    saveSchoolEhis: function(c, a, b) {
        if (typeof c.ehisId !== "string") {
            b.showError("name", "Неправильные данные");
        } else {
            schoolManager.updateInstitutionEhisId(c.ehisId, {
                callback: institutionProfilePH.commonInstitutionAttributeSaveCB,
                arg: {
                    submitterForm: b
                }
            });
        }
    },
    saveSchoolLang: function(c, a, b) {
        if (typeof c.language !== "string" || c.language.length != 2) {
            b.showError("name", "Неправильные данные");
        } else {
            schoolManager.updateInstitutionLanguage(c.language, {
                callback: institutionProfilePH.commonInstitutionAttributeSaveCB,
                arg: {
                    submitterForm: b
                }
            });
        }
    },
    saveSchoolName: function(c, a, b) {
        if (typeof c.name !== "string" || c.name.length < 3 || c.name.length > 250) {
            b.showError("name", "Неправильные данные");
        } else {
            schoolManager.updateInstitutionName(c.name, {
                callback: institutionProfilePH.commonInstitutionAttributeSaveCB,
                arg: {
                    submitterForm: b
                }
            });
        }
    },
    saveAbout: function(d, a, c) {
        var b = institutionProfilePH.institution;
        b.descr = d.descr;
        schoolManager.updateInstitutionDescription(b, {
            callback: function(e) {
                c.drawViewMode();
            },
            arg: {
                submitterForm: c
            }
        });
    },
    saveTimetableUrl: function(d, a, c) {
        var b = institutionProfilePH.institution;
        b.timetableUrl = d.timetableUrl;
        schoolManager.updateInstitutionTimetableUrl(b, {
            callback: institutionProfilePH.commonInstitutionAttributeSaveCB,
            arg: {
                submitterForm: c
            }
        });
    },
    saveSENTemplate: function(d, a, c) {
        var b = institutionProfilePH.institution;
        var e = null;
        if ($("document_container_fileUploadFile")) {
            e = $("document_container_fileUploadFile");
        }
        schoolManager.updateInstitutionSENTemplate(b, e, {
            callback: institutionProfilePH.commonInstitutionAttributeSaveCB,
            arg: {
                submitterForm: c
            }
        });
    },
    saveWriteToStaff: function(d, a, c) {
        var b = institutionProfilePH.institution;
        b.writeToStaff = (d.writeToStaff == "1") ? true : false;
        schoolManager.updateCanWriteToStaff(b.writeToStaff, {
            callback: function(e) {
                c.drawViewMode();
            },
            arg: {
                submitterForm: c
            }
        });
    },
    showContactData: function() {
        $A($("a_institution_menu_contact_item").up(".settingsMenuContainer").select("li")).invoke("removeClassName", "selected");
        $("a_institution_menu_contact_item").addClassName("selected");
        var f = institutionProfilePH.isAdmin;
        var e = TemplateEngine.parseById("hidden_a_institution_contact_data", {
            "isShowEdit": f,
            "isAddressPresent": institutionProfilePH.institution.address != null ? true : false,
            longitude: institutionProfilePH.institution.address != null ? institutionProfilePH.institution.address.longitude : null,
            latitude: institutionProfilePH.institution.address != null ? institutionProfilePH.institution.address.latitude : null,
            serviceAreas: institutionProfilePH.institution.serviceAreas,
            institutionId: institutionProfilePH.institution.id
        });
        institutionProfilePH._showProfileMainData(e);
        if (institutionProfilePH.institution.address != null) {
            $("mapSubsectionContacts").down(".jCountry").setValue(institutionProfilePH.institution.country.id);
            $("mapSubsectionContacts").down(".jStreet").setValue(institutionProfilePH.institution.address.street);
            $("mapSubsectionContacts").down(".jZip").setValue(institutionProfilePH.institution.address.postalIndex);
            $("mapSubsectionContacts").down(".jCity").setValue(institutionProfilePH.institution.address.city);
            $("mapSubsectionContacts").down(".jLat").setValue(institutionProfilePH.institution.address.latitude);
            $("mapSubsectionContacts").down(".jLong").setValue(institutionProfilePH.institution.address.longitude);
        }
        var c = $(document.createElement("form"));
        c.id = "formInstitutionContactWeb";
        c.setDataObj(institutionProfilePH.institution);
        c.addDataHelper("isShowEdit", f);
        c.bindPostLoadDataAction(clayoutPH.formPostRenderPrettifierFunction);
        c.drawViewMode($("a_institution_contact_data_web"));
        c.bindSaveAction(institutionProfilePH.saveUrl);
        c.onsubmit = function() {
            this.commit();
        };
        var b = $(document.createElement("form"));
        b.id = "formInstitutionContactPhones";
        b.setDataObj(institutionProfilePH.institution);
        b.addDataHelper("isShowEdit", f);
        b.bindPostLoadDataAction(clayoutPH.formPostRenderPrettifierFunction);
        b.drawViewMode($("a_institution_contact_data_phone"));
        b.bindSaveAction(institutionProfilePH.savePhone);
        b.onsubmit = function() {
            this.commit();
        };
        var d = $(document.createElement("form"));
        d.id = "formInstitutionContactEmails";
        d.setDataObj(institutionProfilePH.institution);
        d.addDataHelper("isShowEdit", f);
        d.bindPostLoadDataAction(clayoutPH.formPostRenderPrettifierFunction);
        d.drawViewMode($("a_institution_contact_data_email"));
        d.bindSaveAction(institutionProfilePH.saveEmail);
        d.onsubmit = function() {
            this.commit();
        };
        var a = $(document.createElement("form"));
        a.id = "formInstitutionContactAddresses";
        a.setDataObj(institutionProfilePH.institution);
        a.addDataHelper("isShowEdit", f);
        a.addDataHelper("countryName", institutionProfilePH.institution.country.name);
        a.bindPostLoadDataAction(clayoutPH.formPostRenderPrettifierFunction);
        a.drawViewMode($("a_institution_contact_data_address"));
        a.bindSaveAction(institutionProfilePH.saveAddress);
        a.onsubmit = function() {
            this.commit();
        };
    },
    showServices: function() {
        $A($("a_institution_menu_services_item").up(".settingsMenuContainer").select("li")).invoke("removeClassName", "selected");
        $("a_institution_menu_services_item").addClassName("selected");
        var a = TemplateEngine.parseById("hidden_a_institution_services_data", null);
        institutionProfilePH._showProfileMainData(a);
        var b = $(document.createElement("form"));
        b.id = "formAdminSchoolSettingsServices";
        b.setDataObj(ccachePH.cache.get("institution" + institutionProfilePH.institution.id));
        b.addDataHelper("blockDataMap", $H());
        b.addDataHelper("isHeadmaster", institutionProfilePH.isHeadmaster);
        b.bindPostLoadDataAction(clayoutPH.formPostRenderPrettifierFunction);
        b.drawViewMode($("a_institution_services_cards"));
    },
    showFileManagerAdm: function() {
        fileManagerAdmManager.getReportForInst(guserPH.user.id, institutionProfilePH.institution.id, {
            callback: function(f) {
                $A($("a_institution_menu_filemanageradm_item").up(".settingsMenuContainer").select("li")).invoke("removeClassName", "selected");
                $("a_institution_menu_filemanageradm_item").addClassName("selected");
                var e = f.returnObject.fileReportStats;
                var i = f.returnObject.usedSize;
                var h = f.returnObject.totalSize;
                var j = f.returnObject.servicePackage;
                var b = "1 Гб - Бесплатно";
                if (j != "undefined" && j != null) {
                    var c = 0;
                    var g = "EUR";
                    var a = "";
                    if (j.name != null) {
                        a = j.name;
                    }
                    if (j.priceMinUnits != null) {
                        c = j.priceMinUnits / 100;
                    }
                    if (j.currency != null) {
                        g = j.currency;
                    }
                    b = a + " - " + c + " " + g + " / " + "месяц";
                }
                var d = TemplateEngine.parseById("hidden_a_institution_filemanageradm_data", {
                    fileReportStats: e,
                    usedSize: i,
                    totalSize: h,
                    storagePlanText: b
                });
                institutionProfilePH._showProfileMainData(d);
            }
        });
    },
    showReturnedFromAdmFull: function() {
        var a = TemplateEngine.parseById("hidden_a_institution_profile_menu", {
            "isAdmin": institutionProfilePH.isAdmin,
            "isHeadmaster": institutionProfilePH.isHeadmaster,
            institution: institutionProfilePH.institution
        });
        $("maincontainer").update(a).show();
        institutionProfilePH.onInstitutionProfileMenuClick(institutionProfilePH.INST_MENU_NAMES.FILEMANAGERADM);
    },
    showFileManagerAdmFull: function() {
        fileManagerAdmManager.getReportForInstWithUserInfo(guserPH.user.id, institutionProfilePH.institution.id, {
            callback: function(a) {
                var c = a.returnObject;
                var b = TemplateEngine.parseById("hidden_a_institution_filemanageradm_data_full", {
                    rows: c
                });
                $("maincontainer").update(b).show();
                clayoutPH.backBtnShow("#", function() {
                    institutionProfilePH.showReturnedFromAdmFull();
                });
            }
        });
    },
    reportCell: function(b) {
        var a;
        if (b != null) {
            a = b;
        } else {
            a = 0;
        }
        return "<td>" + a + "</td>";
    },
    showRequestStorage: function() {
        var a = TemplateEngine.parseById("filemanageradm_request_storage");
        institutionProfilePH._showProfileMainData(a);
        if ($("requestStorageForm")["name"] && guserPH.user && guserPH.user.name1 && guserPH.user.name2) {
            $($("requestStorageForm")["name"]).setValue(guserPH.user.name1 + " " + guserPH.user.name2);
        }
        if ($("requestStorageForm")["email"] && guserPH.user && guserPH.user.emailFromUserName) {
            $($("requestStorageForm")["email"]).setValue(guserPH.user.emailFromUserName);
        }
    },
    commonInstitutionAttributeSaveCB: function(c, b) {
        ccachePH.cache.unset("institution" + c.returnObject);
        ccachePH.cache.unset("group" + c.returnObject);
        ccachePH.cache.unset("timetableUrl" + c.returnObject);
        ccachePH.institutionObj(c.returnObject, function(a) {
            institutionProfilePH.institution = a;
            if (b.unknownForm != true) {
                b.submitterForm.setDataObj(ccachePH.cache.get("institution" + institutionProfilePH.institution.id), null);
            }
            guserPH.userUpdateGroup(a);
            cmenuPH.drawUserMenu();
            clayoutPH.makeFooter();
            if (b.unknownForm == true || b.submitterForm.identify() === "formInstitutionContactAddresses") {
                institutionProfilePH.showContactData();
            } else {
                b.submitterForm.drawViewMode();
            }
        });
    },
    savePhone: function(c, a, b) {
        if (typeof c.phone.phoneNumber === "string" && c.phone.phoneNumber != "" && !chelperPH.isCorrectPhone(c.phone.phoneNumber)) {
            b.showError("phone_phoneNumber", "Неверный номер телефона");
        } else {
            schoolManager.updatePhone(institutionProfilePH.institution, c.phone.phoneNumber, {
                callback: institutionProfilePH.commonInstitutionAttributeSaveCB,
                arg: {
                    submitterForm: b
                }
            });
        }
    },
    saveEmail: function(c, a, b) {
        if (typeof c.email.name === "string" && c.email.name != "" && !chelperPH.isCorrectEmail(c.email.name)) {
            b.showError("email_name", "Некорректный адрес электронной почты");
        } else {
            schoolManager.updateEmail(institutionProfilePH.institution, c.email.name, {
                callback: institutionProfilePH.commonInstitutionAttributeSaveCB,
                arg: {
                    submitterForm: b
                }
            });
        }
    },
    saveUrl: function(c, a, b) {
        schoolManager.updateUrl(c.url, {
            callback: institutionProfilePH.commonInstitutionAttributeSaveCB,
            arg: {
                submitterForm: b
            }
        });
    },
    showSchoolGroups: function() {
        schoolManager.schoolGroupList(dwrNumber(institutionProfilePH.institution.id), {
            callback: function(a) {
                var b = TemplateEngine.parseById("hidden_a_institution_general_schoolgroup", {
                    "partners": a.returnObject
                });
                $("a_institution_groups_list").update(b);
            }
        });
    },
    schoolGroupRemove: function(b) {
        var a = confirm("Вы уверены, что хотите удалить свою школу из списка местного самоуправления?");
        if (a) {
            schoolManager.schoolGroupRemove(dwrNumber(b), {
                callback: function(c) {
                    institutionProfilePH.showSchoolGroups();
                }
            });
        }
    },
    publish: function(b, a) {
        requestManager.institutionPublishRequest(dwrNumber(b), {
            callback: function(c) {
                if (c.isError) {
                    shout("requestManager.institutionPublishRequest error, handling not defined");
                } else {
                    chelperPH.showNotice("Запрос для опубликования отправлен. В скором времени он будет рассмотрен персоналом eKool. Спасибо.");
                    chelperPH.callcode(a);
                }
            }
        });
    },
    logoForm: function() {
        $LAB.script(chelperPH.resourcedir + "c/uploader/js/cuploaderPH.js").wait(function() {
            cuploaderPH.initThis(institutionProfilePH.logoUploaded.bind(institutionProfilePH), 128, 128, true);
        });
    },
    logoUploaded: function(b, a) {
        if (a == null) {
            a = false;
        }
        schoolManager.institutionLogoImgSave(dwrNumber(institutionProfilePH.institution.id), b, dwrBoolean(a), {
            callback: function(c) {
                if (c.isError) {
                    if (c.errors && c.errors[0]) {
                        chelperPH.showError(c.errors[0].message);
                    }
                } else {
                    ccachePH.institutionObjEmpty(c.returnObject.id);
                    ccachePH.groupObjEmpty(c.returnObject.id);
                    var d = "institutionLogoImgFn_" + c.returnObject.id;
                    if (a == true) {} else {
                        cuploaderPH.uploadImgSaveDone();
                    }
                    ccachePH.institutionObj(c.returnObject.id, function(f) {
                        institutionProfilePH.institution = f;
                        if (a == true) {
                            if ($(d)) {
                                $(d).update("");
                            }
                        } else {
                            if ($(d)) {
                                var e = '<img src="' + chelperPH.filesLocHttp + institutionProfilePH.institution.logoImgFn + '" alt="">';
                                $(d).update(e);
                            }
                        }
                        $LAB.script(chelperPH.resourcedir + "c/uploader/js/cuploaderPH.js").wait(function() {
                            cuploaderPH.showAvatar("a_inst_block_photo", institutionProfilePH.institution.logoImgFn, true, "schoolDummy", institutionProfilePH.logoForm, institutionProfilePH.logoDel, institutionProfilePH.logoForm, true);
                        });
                    });
                }
            }
        });
    },
    logoDel: function() {
        institutionProfilePH.logoUploaded({}, true);
    },
    openAddressMap: function() {
        if (typeof institutionProfilePH.institution.address.longitude === "number" && typeof institutionProfilePH.institution.address.latitude === "number") {
            chelperPH.showMapForAddress($("mapSubsectionContacts"), institutionProfilePH.institution.address.latitude.toString(), institutionProfilePH.institution.address.longitude.toString(), MAP_OPEN_MODES.INSTITUTION_ADDRESS_EDIT_SETTINGS);
        } else {
            chelperPH.showMapForAddress($("mapSubsectionContacts"), null, null, MAP_OPEN_MODES.INSTITUTION_ADDRESS_EDIT_SETTINGS);
        }
    },
    submitCoordinates: function() {
        var a = cmapPH.marker.getPosition();
        showLoadingIndicator("a_institution_profile_mainData_ph");
        schoolManager.updateCoordinates(a.lat(), a.lng(), {
            callback: institutionProfilePH.commonInstitutionAttributeSaveCB,
            arg: {
                unknownForm: true
            }
        });
        cmapPH.addressUl.down(".jLat").setValue(a.lat());
        cmapPH.addressUl.down(".jLong").setValue(a.lng());
        if (cmapPH.hideFunc != null) {
            chelperPH.callcode(cmapPH.hideFunc);
        }
    },
    saveAddress: function(c, a, b) {
        if (!c.address.street) {
            b.showError("address_street", "Пожалуйста, введите улицу");
        }
        if (!c.address.city) {
            b.showError("address_city", "Пожалуйста, введите город");
        }
        if (!c.address.postalIndex) {
            b.showError("address_postalIndex", "Пожалуйста, введите почтовый индекс");
        }
        if (b.getErrorCount() == 0) {
            schoolManager.updateAddress(c.address, {
                callback: institutionProfilePH.commonInstitutionAttributeSaveCB,
                arg: {
                    submitterForm: b
                }
            });
        }
    },
    setCoordinates: function(a) {
        if (a != null) {
            institutionProfilePH.institution.address.latitude = a.lat;
            institutionProfilePH.institution.address.longitude = a.lng;
        }
        institutionProfilePH.doSaveAddress();
    },
    showCardUserAgreement: function() {
        clayoutPH.initMMModalDialog({
            preferredWidth: 550
        });
        var a = TemplateEngine.parseById("a_institution_services_cards_user_agreement", null);
        clayoutPH.updateMMModalDialogContent(a);
    },
    schoolGroupRemove: function(b) {
        var a = confirm("Вы уверены, что хотите удалить свою школу из списка местного самоуправления?");
        if (a) {
            schoolManager.schoolGroupRemove(dwrNumber(b), {
                callback: function(c) {
                    institutionProfilePH.showContactData();
                }
            });
        }
    },
    saveActivationCode: function(a, b) {
        if (!b) {
            $("validationError").update("££In order to use our services, you must agree with eKool's Service terms and Privacy policy.££");
        } else {
            schoolManager.updateIdnetActivationCode(a, {
                callback: function(c) {
                    log("inside schoolManager.updateIdnetActivationCode callback");
                    console.dir(c);
                    if (!c.isError) {
                        institutionProfilePH.showCardServiceAsActivated(true);
                    }
                }
            });
            clayoutPH.closeMMModalDialog();
        }
    },
    showCardServiceAsActivated: function(a) {
        if (a) {
            $("activateXorDeactivateStudentcardService").update("Отключить");
            $("studentCardServiceInfoArea").show();
        } else {
            $("activateXorDeactivateStudentcardService").update("Активировать");
            $("studentCardServiceInfoArea").hide();
        }
    },
    requestStorageSend: function() {
        var a = $("requestStorageForm");
        if (a != null) {
            a.clearErrors();
            var b = a.getData();
            if (b.name == null || b.name.strip().length < 2) {
                a.showError("name", "Пожалуйста, введите свое имя");
            }
            if (b.email == null || b.email.strip().length < 4 || !chelperPH.isCorrectEmail(b.email)) {
                a.showError("email", "Пожалуйста, введите свой адрес электронной почты");
            }
            if (b.message == null || b.message.strip().length < 2) {
                a.showError("message", "Напишите сообщение");
            }
            if (a.getErrorCount()) {} else {
                showLoadingIndicator("requestStorageForm");
                getFormName = function() {
                    return "requestStorageForm";
                };
                fileManagerAdmManager.sendRequestStorage(guserPH.user.id, institutionProfilePH.institution.id, b, {
                    callback: function(e, c) {
                        var d = TemplateEngine.parseById("filemanageradm_request_storage_sent");
                        $("requestStorageForm").up().insert(d);
                        $("requestStorageForm").remove();
                        hideLoadingIndicator("requestStorageForm");
                    }.bind(this)
                });
            }
        } else {
            shout("form not found");
        }
    },
    byte2MB: function(b, a, e) {
        if (a == null || a == "undefined") {
            a = 2;
        }
        if (e == null || e == "undefined") {
            e = "ROUND";
        }
        var d;
        var c = e.toUpperCase();
        if (c == "CEIL") {
            d = Math.ceil(Math.pow(10, a) * (b / MB)) / Math.pow(10, a);
        } else {
            if (c == "FLOOR") {
                d = Math.floor(Math.pow(10, a) * (b / MB)) / Math.pow(10, a);
            } else {
                if (c == "ROUND") {
                    d = Math.round(Math.pow(10, a) * (b / MB)) / Math.pow(10, a);
                } else {
                    d = 0;
                }
            }
        }
        return d;
    }
};
