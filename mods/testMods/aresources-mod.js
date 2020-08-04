var aresourcespPH = {
    foldername: "a/resources",
    groupId: null,
    allMembers: null,
    allTags: null,
    isAdmin: true,
    isParent: true,
    isLearning: true,
    currentMember: null,
    currentMemberIndx: null,
    currentParentIndx: null,
    currentPageMember: null,
    studentGrades: null,
    courseList: null,
    periodsList: null,
    currentPeriodIndx: -1,
    currentTermId: -1,
    selectedChildId: null,
    selectedCurrId: null,
    searchUserList: null,
    tempEmails: null,
    show: function() {
        showLoadingIndicator();
        cappPH.addButtonShow(null);
        $LAB.script(chelperPH.resourcedir + "p/prof/js/pprofPH.js").wait(function() {
            $LAB.script(chelperPH.resourcedir + "p/main/js/pmainPH.js").wait(function() {
                $LAB.script(chelperPH.resourcedir + "g/person/js/gpersonPH.js").wait(function() {
                    cappPH.initTree(1, 0, aresourcespPH.onAddInvClick, 0, "Новое приглашение", function() {
                        ccachePH.institutionObj(guserPH.user.selectedGroupId, function(a) {
                            ccachePH.shortAdminPersonList(guserPH.user.selectedGroupId, function(b) {
                                ccachePH.shortStaffPersonList(guserPH.user.selectedGroupId, function(c) {
                                    aresourcespPH.isAdmin = true;
                                    if (c != null && c.size() == 1) {
                                        c[0].instanceClass = "Person";
                                    }
                                    aresourcespPH.allMembers = c;
                                    ccachePH.adminInvitationList(guserPH.user.selectedGroupId, function(d) {
                                        ccachePH.staffInvitationList(guserPH.user.selectedGroupId, function(f) {
                                            var e = $A();
                                            if (f.size() > 0 || d.size() > 0) {
                                                e.push({
                                                    "id": 3,
                                                    "name": "Приглашения",
                                                    "instanceClass": "",
                                                    "clickCb": aresourcespPH.treeClick
                                                });
                                            }
                                            e.push({
                                                "id": 0,
                                                "name": "Персонал"
                                            });
                                            e.push({
                                                "id": 6,
                                                "name": "Администраторы"
                                            });
                                            cappPH.treeArrAdd(e);
                                            cappPH.treeArrAdd(aresourcespPH.allMembers, 0, aresourcespPH.memberClick, null, aresourcespPH.deleteMember);
                                            cappPH.treeArrAdd(b, 6, aresourcespPH.memberClick, null, aresourcespPH.deleteMember);
                                            cappPH.draw(1);
                                            if (aresourcespPH.allMembers.size() == 0 && b.size() == 0) {
                                                aresourcespPH.showInvitations();
                                            }
                                            hideLoadingIndicator();
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
    treeClick: function(a) {
        if (a.id == 3) {
            aresourcespPH.showInvitations();
        } else {
            if (a.id == 4) {
                aresourcespPH.showAdmins();
            }
        }
    },
    showInvitations: function(b, a) {
        showLoadingIndicator();
        chelperPH.loadTemplateHidd(chelperPH.resourcedir + "a/resources/tpl/resources_tpl.html", function() {
            ccachePH.staffInvitationList(guserPH.user.selectedGroupId, function(c) {
                ccachePH.adminInvitationList(guserPH.user.selectedGroupId, function(d) {
                    var e = null;
                    if (aresourcespPH.allMembers.size() == 0 && c.size() == 0 && d.size() == 0) {
                        e = true;
                    } else {
                        if (c.size() > 0 || d.size() > 0) {
                            e = false;
                        }
                    }
                    aresourcesPH.inviteDraw(b, a, c, "hidden_aresource_invitation", e, null, d, function() {
                        var f = $(document.createElement("form"));
                        f.id = "formAdminSchoolSettingsAdministrators";
                        f.setDataObj({});
                        f.drawViewMode($("aresource_invitation_form_admin"));
                        f.bindSaveAction(aresourcespPH.inviteAdmin);
                    });
                });
            });
        });
    },
    inviteForm: function() {
        ccachePH.staffInvitationList(guserPH.user.selectedGroupId, function(b) {
            var a = null;
            if (aresourcespPH.allMembers.size() == 0 && b.size() == 0) {
                a = true;
            } else {
                if (b.size() > 0) {
                    a = false;
                }
            }
            aresourcesPH.inviteFormDraw(a, "hidden_aresource_invitation_form");
        });
    },
    onAddInvClick: function() {
        aresourcespPH.showInvitations(null, true);
    },
    invitePeople: function() {
        showLoadingIndicator();
        var d = $("aresource_invitation_form");
        var c = d["emails"].getValue();
        c = c.sub(" ", "");
        var b = c.split(",");
        if (b != null && b.size() > 0) {
            aresourcespPH.tempEmails = b;
            var a = false;
            aresourcespPH.invitePeopleWithEmails(b, a);
        } else {
            hideLoadingIndicator();
        }
    },
    invitePeopleWithEmails: function(b, a) {
        peopleResourceManager.invite(b, false, a, {
            callback: function(c) {
                var d = c.returnObject;
                if (typeof d !== "undefined" && typeof d.passed !== "undefined" && d.passed === false) {
                    aresourcespPH.notifyAboutCheck(d, b);
                }
                if (c.isError) {
                    chelperPH.parseErrors(c.errors);
                } else {
                    aresourcespPH.inviteCallBack(c, true);
                }
            }
        });
    },
    notifyAboutCheck: function(b, c) {
        var a = TemplateEngine.parseById("staffInvitationCheckResults", {
            "emails": c,
            "invalidEmails": b.invalidEmails,
            "notFoundEmails": b.notFoundEmails
        });
        clayoutPH.initMMModalDialog({
            preferredWidth: 650,
            innerPadding: 15,
            hasCloseButton: true
        });
        clayoutPH.updateMMModalDialogContent(a);
    },
    invitePeopleWithWarnings: function() {
        var a = true;
        aresourcespPH.invitePeopleWithEmails(aresourcespPH.tempEmails, a);
        clayoutPH.closeMMModalDialog();
        aresourcespPH.tempEmails = null;
    },
    inviteCallBack: function(b, a) {
        if (a) {
            ccachePH.staffInvitationListEmpty(guserPH.user.selectedGroupId);
        } else {
            if (a == false) {
                ccachePH.adminInvitationListEmpty(guserPH.user.selectedGroupId);
            } else {
                ccachePH.adminInvitationListEmpty(guserPH.user.selectedGroupId);
                ccachePH.staffInvitationListEmpty(guserPH.user.selectedGroupId);
            }
        }
        var c = [];
        if (b != null && b.returnObject != null && b.returnObject.errors != null) {
            c = b.returnObject.errors;
        }
        aresourcespPH.showInvitations(c);
        hideLoadingIndicator();
    },
    goBackToInvitation: function() {
        clayoutPH.closeMMModalDialog();
        $("aresource_invitation_form").show();
        document.getElementById("arecourse_invite_link").hide();
        var a = "";
        var b = true;
        aresourcespPH.tempEmails.forEach(function(c) {
            if (!b) {
                a += ",";
            }
            a += c;
            b = false;
        });
        aresourcespPH.tempEmails = null;
        document.getElementById("emails").innerHTML = a;
    },
    delStaffInvitePerson: function(a) {
        showLoadingIndicator();
        var b = confirm("Вы действительно хотите удалить?");
        if (b) {
            roleInvitationManager.removeStaffInvitation(dwrNumber(a), {
                callback: function(c) {
                    if (c.isError) {
                        chelperPH.parseErrors(c.errors);
                    } else {
                        aresourcespPH.inviteCallBack(c, true);
                    }
                }
            });
        }
    },
    delStaffRequestPerson: function(a) {
        aresourcesPH.inviteDel(a, aresourcespPH.inviteCallBack);
    },
    searchPersons: function(a) {
        if (a.recipient_id && a.recipient_id.checked) {
            return;
        }
        if ($("adminSchoolSettingsAdministrators_editResultList")) {
            $("adminSchoolSettingsAdministrators_editResultList").remove();
        }
        if (nvl($F(a.searchText)).length == 0) {
            return;
        }
        getFormName = function() {
            return a.id;
        };
        showLoadingIndicator(a.up("div").identify());
        ccachePH.shortAdminPersonList(guserPH.user.selectedGroupId, function(b) {
            ccachePH.adminInvitationList(guserPH.user.selectedGroupId, function(c) {
                messagingManager.personSearch($F(a.searchText), {
                    callback: function(f, e) {
                        var g = [];
                        f.returnObject.each(function(h) {
                            var j = false;
                            b.each(function(i) {
                                if ((i.person != null) && (i.person.id == h.id)) {
                                    j = true;
                                }
                            });
                            if (!j) {
                                c.each(function(i) {
                                    $A(i.messageTos).each(function(k) {
                                        if (k.person.id == h.id) {
                                            j = true;
                                        }
                                    });
                                });
                            }
                            if (!j) {
                                g.push(h);
                            }
                        });
                        aresourcespPH.searchUserList = g;
                        var d = TemplateEngine.parseById("formAdminSchoolSettingsAdministrators_editResultList", {
                            formData: g
                        });
                        if ($("dminSchoolSettingsAdministrators_resId") != null) {
                            $("dminSchoolSettingsAdministrators_resId").remove();
                        }
                        if ($("adminSchoolSettingsAdministrators_editResultList")) {
                            $("adminSchoolSettingsAdministrators_editResultList").remove();
                        }
                        $("adminSchoolSettingsAdministrators_editResultListPH").insert({
                            after: d
                        });
                        hideLoadingIndicator(a.up("div").identify());
                    }
                });
            });
        });
    },
    handlePersonListCheckboxClick: function(a) {
        if (a.checked) {
            $(a.up("form")["recipient_id"]).setValue(a.getValue());
            a.up("li").siblings().invoke("hide");
            a.up("form").select(".iInviteAdmin").invoke("show");
        } else {
            $(a.up("form")["recipient_id"]).setValue("");
            a.up("li").siblings().invoke("show");
            a.up("form").select(".iInviteAdmin").invoke("hide");
        }
    },
    inviteAdmin: function(b, a) {
        roleInvitationManager.inviteAdmin(dwrNumber(guserPH.user.selectedGroupId), b, {
            callback: function(c) {
                if (c.isError) {
                    chelperPH.showError(c.errors);
                } else {
                    chelperPH.showNotice("Successfully Invited", c);
                }
            }
        });
    },
    delAdminInvitePerson: function(a, b) {
        if (!_confirm()) {
            return;
        }
        getFormName = function() {
            return b;
        };
        showLoadingIndicator(getFormName());
        roleInvitationManager.removeAdminInvitation(dwrNumber(a), {
            callback: function(c) {
                if (c.isError) {
                    chelperPH.parseErrors(c.errors);
                } else {
                    aresourcespPH.inviteCallBack(c, false);
                }
            }
        });
    },
    memberClick: function(b, a) {
        if (!a) {
            pmainPH.loadProfile(b.id, CONTEXT.SCHOOL, guserPH.user.selectedGroupId, "appContent", 1, null, null, null, false, false);
        }
    },
    checkMemberData: function(b, a) {
        a.clearErrors();
        if (!b.name1) {
            a.showError("name1", "Пожалуйста, введите имя");
        } else {
            if (b.name1.length < 2) {
                a.showError("name1", "Пожалуйста, введите имя");
            }
        }
        if (!b.name2) {
            a.showError("name2", "Пожалуйста, введите фамилию");
        } else {
            if (b.name2.length < 2) {
                a.showError("name2", "Пожалуйста, введите фамилию");
            }
        }
        if (b.idCode) {
            if (b.idIssuedBy.id < 1) {
                a.showError("idIssuedBy_id", "Пожалуйста, выберите кем выдано");
            }
        }
        if (b.birthDay) {
            if (!chelperPH.isDate(b.birthDay)) {
                a.showError("birthDay", "Ошибка в дне рождении");
            }
        }
        chelperPH.checkEmailsData(b.emails, a);
        chelperPH.checkPhonesData(b.phones, a);
        if (a.getErrorCount()) {
            return false;
        }
        return true;
    }
};