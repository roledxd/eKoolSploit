var pmaindashPH = {
    allElements: [],
    foldername: "p",
    filterSelectedType: null,
    currentFilterId: 0,
    context: null,
    isFormMaster: true,
    hasBeenStudent: true,
    consolidatedGradesList: $A(),
    schoolGroupRequestList: null,
    requestMenuBlocks: {
        contact: 1,
        admission: 2,
        join: 3
    },
    prevSelectedRequestEl: null,
    show: function(c, d, b, a, e) {
        if (d == null) {
            d = 0;
        }
        if (b == null) {
            b = CONTEXT.ME;
        }
        pmaindashPH.context = b;
        pmaindashPH.personId = c;
        pmaindashPH.currentFilterId = 0;
        pmaindashPH.instId = a;
        pmaindashPH.journalId = e;
        showLoadingIndicator("personDatamaincontent");
        chelperPH.loadTemplateHidd(chelperPH.resourcedir + pmaindashPH.foldername + "/main/tpl/dashboard.html", function() {
            chelperPH.loadTemplateHidd(chelperPH.resourcedir + "p/grades/tpl/pgrades_tpl.html", function() {
                chelperPH.loadTemplateHidd(chelperPH.resourcedir + "p/tasks/tpl/task_tmpl.html", function() {
                    $LAB.script(chelperPH.resourcedir + "p/tasks/js/ptasksPH.js").wait(function() {
                        $LAB.script(chelperPH.resourcedir + "p/grades/js/pgradesPH.js").wait(function() {
                            $LAB.script(chelperPH.resourcedir + "p/main/js/feedPH.js").wait(function() {
                                ccachePH.dashData(c, b, a, e, pmainPH.isAttJournal, pmainPH.isGradesJournal, function(g) {
                                    pmaindashPH.checkIfHarIDuserHasNewRoles();
                                    if (pmainPH.isAttJournal) {
                                        pmaindashPH.dashRetObj = g;
                                        pmaindashPH.isFormMaster = g.isFormMaster;
                                        if (d == null) {
                                            d = DASH_FILTER.ALL;
                                        }
                                        pmaindashPH.loadDashCallback(g, null, d, function(h) {
                                            pmaindashPH.dashRightContent();
                                            pmaindashPH.showFilter(d);
                                            pmaindashPH.currentFilterId = d;
                                            pmaindashPH.drawDiscipline(h);
                                            hideLoadingIndicator("personDatamaincontent");
                                        });
                                    } else {
                                        if (pmainPH.isGradesJournal) {
                                            pmaindashPH.dashRetObj = g;
                                            if (d == null) {
                                                d = DASH_FILTER.GRADES;
                                            }
                                            pmaindashPH.loadDashCallback(g, null, d, function(h) {
                                                pmaindashPH.dashRightContent();
                                                pmaindashPH.showFilter(d);
                                                pmaindashPH.currentFilterId = d;
                                                pmaindashPH.drawDiscipline(h);
                                                hideLoadingIndicator("personDatamaincontent");
                                            });
                                        } else {
                                            if (pmaindashPH.journalId != null) {
                                                pmaindashPH.dashRetObj = g;
                                                if (d == null) {
                                                    d = DASH_FILTER.ALL;
                                                }
                                                if ($J().journal.individual) {
                                                    var f = pmaindashPH.dashRetObj.studentList[0].id;
                                                    pmaindashPH.dashRetObj.lessons = pmaindashPH.getLessonsForDashData(f);
                                                }
                                                pmaindashPH.loadDashCallback(g, null, d, function(h) {
                                                    pmaindashPH.dashRightContent();
                                                    pmaindashPH.showFilter(d);
                                                    pmaindashPH.currentFilterId = d;
                                                    pmaindashPH.drawDiscipline(h);
                                                    hideLoadingIndicator("personDatamaincontent");
                                                });
                                            } else {
                                                pmaindashPH.currentFilterId = d;
                                                pmaindashPH.getDashData(c, b, d, a, e);
                                            }
                                        }
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
        hideLoadingIndicator("personDatamaincontent");
    },
    getLessonsForDashData: function(a) {
        var c = $J().journal.rootEventsHash.toArray();
        if (c.size() == 0) {
            return c;
        }
        var b = [];
        c.forEach(function(d) {
            if (pmaindashPH.studentWasInvitedToLesson(d.value, a)) {
                b.push(d.value);
                $J().initRootEventChildrenDetails(d.value.id);
            }
        });
        return b;
    },
    studentWasInvitedToLesson: function(b, a) {
        if (!b.individualLesson) {
            return true;
        }
        if (b.individualLessonStudents == null) {
            return false;
        }
        var c = false;
        b.individualLessonStudents.forEach(function(d) {
            if (d.student.id === a) {
                c = true;
            }
        });
        return c;
    },
    showFilter: function(a) {
        var f = new Array();
        f.push({
            "id": DASH_FILTER.ALL,
            "name": "Все"
        });
        var k = false;
        if (pmainPH.context == CONTEXT.ME) {
            var h = guserPH.getStudents();
            if (h != null && h.size() > 0) {
                k = true;
            }
        } else {
            if (pmainPH.context == CONTEXT.SCHOOL) {
                if (pmainPH.rights.isHeadMaster || pmainPH.rights.isTeacherRole || pmainPH.rights.isFormMaster) {
                    var h = guserPH.getStudents(pmainPH.getCurrInst(), pmainPH.person.roles);
                    if (h != null && h.size() > 0) {
                        k = true;
                    }
                }
            } else {
                if (pmainPH.context == CONTEXT.THIRD) {
                    var h = guserPH.getStudents(null, pmainPH.person.roles);
                    var b = guserPH.userGetChildren();
                    for (var e = 0; e < h.size(); e++) {
                        for (var d = 0; d < b.size(); d++) {
                            if (b[d].id == h[e].id) {
                                k = true;
                                break;
                            }
                        }
                        if (k) {
                            break;
                        }
                    }
                }
            }
        }
        if (k) {
            if (!pmainPH.isAttJournal) {
                f.push({
                    "id": DASH_FILTER.GRADES,
                    "name": "Оценки"
                });
                f.push({
                    "id": DASH_FILTER.DISCIPLINE,
                    "name": "Дисциплина"
                });
                if (typeof $J !== "undefined" && $J().journal.individual) {
                    f.push({
                        "id": DASH_FILTER.EVENTS,
                        "name": "Уроки"
                    });
                }
            }
        }
        if (pmaindashPH.dashRetObj.isBlogPost) {
            if (!pmainPH.isAttJournal && !pmainPH.isGradesJournal && pmainPH.journalId == null) {
                f.push({
                    "id": DASH_FILTER.BLOG,
                    "name": "Блог"
                });
            }
        }
        var g = false;
        if (pmainPH.context == CONTEXT.ME) {
            var c = guserPH.getActiveTeacherRoles(null);
            if (c != null && c.size() > 0) {
                g = true;
            }
        } else {
            if (pmainPH.context == CONTEXT.SCHOOL && pmainPH.rights.isHeadMaster) {
                var c = guserPH.getActiveTeacherRoles(pmainPH.getCurrInst(), pmainPH.person.roles);
                if (c != null && c.size() > 0) {
                    g = true;
                }
            }
        }
        if (!pmainPH.isAttJournal && !pmainPH.isGradesJournal && pmainPH.journalId == null) {
            f.push({
                "id": DASH_FILTER.EVENTS,
                "name": "События"
            });
        }
        if (pmainPH.journalId != null || pmainPH.isAttJournal || pmainPH.isGradesJournal) {
            pmaindashPH.cfilterPH = new cfilterPH(f, true, false, pmaindashPH.filterHandlerOld, a, ["Поиск по имени или предмету &nbsp"], "person_filter");
        } else {
            pmaindashPH.cfilterPH = new cfilterPH(f, false, false, pmaindashPH.filterHandler, a, null, "person_filter");
        }
    },
    filterHandlerOld: function(c, b) {
        var a = null;
        if (c != DASH_FILTER.GRADES) {
            $$(".iGradesFilter").invoke("remove");
        }
        if (c != DASH_FILTER.TASK) {
            $$(".iTasksFilter").invoke("remove");
        }
        if (c != DASH_FILTER.BLOG) {
            $$(".iBlogFilter").invoke("remove");
        }
        if (c != DASH_FILTER.DISCIPLINE) {
            $$(".iDisciplineFilter").invoke("remove");
        }
        if (c != DASH_FILTER.WORKLOAD) {
            $$(".iWorkFilter").invoke("remove");
        }
        if ($$(".iTodofeed")) {
            $$(".iTodofeed").invoke("remove");
        }
        if ($$(".iAbsencefeed")) {
            $$(".iAbsencefeed").invoke("remove");
        }
        var d = pmaindashPH.currentFilterId;
        pmaindashPH.currentFilterId = c;
        pmaindashPH.searchStr = b;
        if (c == DASH_FILTER.BLOG) {
            if (d == c) {
                pblogPH.filterHandler(null, b);
            } else {
                pmaindashPH.showBlog();
            }
        } else {
            if (c == DASH_FILTER.GRADES) {
                pmaindashPH.loadDashCallback(pmaindashPH.dashRetObj, b, c, function(e) {
                    pmaindashPH.drawDash(e);
                });
            } else {
                if (c == DASH_FILTER.DISCIPLINE) {
                    pmaindashPH.loadDashCallback(pmaindashPH.dashRetObj, b, [2, 3], function(e) {
                        pmaindashPH.drawDash(e);
                    });
                } else {
                    if (c == DASH_FILTER.ALL) {
                        pmaindashPH.loadDashCallback(pmaindashPH.dashRetObj, b, c, function(e) {
                            pmaindashPH.drawDash(e);
                        });
                    } else {
                        if (c == DASH_FILTER.EVENTS) {
                            pmaindashPH.loadDashCallback(pmaindashPH.dashRetObj, b, c, function(e) {
                                pmaindashPH.drawDash(e);
                            });
                        }
                    }
                }
            }
        }
    },
    filterHandler: function(c, b) {
        var a = null;
        if (c != DASH_FILTER.GRADES) {
            $$(".iGradesFilter").invoke("remove");
        }
        if (c != DASH_FILTER.BLOG) {
            $$(".iBlogFilter").invoke("remove");
        }
        if (c != DASH_FILTER.DISCIPLINE) {
            $$(".iDisciplineFilter").invoke("remove");
        }
        var d = pmaindashPH.currentFilterId;
        pmaindashPH.currentFilterId = c;
        pmaindashPH.searchStr = b;
        pmaindashPH.drawDashData(pmaindashPH.dashRetObj, c, b);
    },
    mkDateArr: function(g, b, e) {
        if (g != null && pmaindashPH.dateArr.indexOf(g.substring(0, 10)) < 0) {
            var f = {};
            var a = g.substring(0, 10).split(".");
            var c = a[2] + a[1] + a[0];
            f.dateCompStr = c;
            f.dateStr = g.substring(0, 10);
            f.dateField = g.substring(0, 10);
            if (f.dateField == b) {
                f.isToday = true;
            } else {
                f.isToday = false;
            }
            e.push(f);
            pmaindashPH.dateArr.push(g.substring(0, 10));
        }
        return e;
    },
    parseEventListIsType: function(b, c) {
        var a = false;
        if (chelperPH.isArray(b)) {
            if (b.indexOf(c) > -1) {
                a = true;
            } else {
                a = false;
            }
        } else {
            if (b == 0 || (b != 0 && b == c)) {
                a = true;
            } else {
                a = false;
            }
        }
        return a;
    },
    parseEventList: function(h, n, a) {
        var v = $A();
        pmaindashPH.dateArr = $A();
        var u = $A();
        if (h != null) {
            var b = false;
            if (h.counsilList) {
                h.counsilList.each(function(c) {
                    v = pmaindashPH.mkDateArr(c.created, h.today, v);
                });
            } else {
                h.counsilList = [];
            }
            if (h.gradeList) {
                h.gradeList.each(function(i) {
                    var c = i.eventDate;
                    if (c == null) {
                        c = i.created;
                    }
                    v = pmaindashPH.mkDateArr(c, h.today, v);
                });
            } else {
                h.gradeList = [];
            }
            if (b == true) {
                v = pmaindashPH.mkDateArr(h.today, h.today, v);
            }
            if (h.blogHeadingList == null) {
                h.blogHeadingList = [];
            }
            h.blogHeadingList.each(function(c) {
                v = pmaindashPH.mkDateArr(c.created, h.today, v);
            });
            if (h.remarkList == null) {
                h.remarkList = [];
            }
            h.remarkList.each(function(c) {
                v = pmaindashPH.mkDateArr(c.remark.created, h.today, v);
            });
            if (h.absenceEventList == null) {
                h.absenceEventList = [];
            }
            h.absenceEventList.each(function(c) {
                if (c.lessonEvent != null && c.lessonEvent.eventDate != null) {
                    v = pmaindashPH.mkDateArr(c.lessonEvent.eventDate, h.today, v);
                } else {
                    v = pmaindashPH.mkDateArr(c.eventDate, h.today, v);
                }
            });
            if (h.lateEventList == null) {
                h.lateEventList = [];
            }
            h.lateEventList.each(function(c) {
                if (c.lessonEvent != null) {
                    v = pmaindashPH.mkDateArr(c.lessonEvent.eventDate, h.today, v);
                } else {
                    v = pmaindashPH.mkDateArr(c.eventDate, h.today, v);
                }
            });
            if (h.parentAbsenceNoteList == null) {
                h.parentAbsenceNoteList = [];
            }
            if (h.absenceReasonList == null) {
                h.absenceReasonList = [];
            }
            if (h.parentAbsenceNoteList) {
                h.parentAbsenceNoteList.each(function(c) {
                    v = pmaindashPH.mkDateArr(c.created, h.today, v);
                });
            }
            if (h.absenceReasonList) {
                h.absenceReasonList.each(function(c) {
                    v = pmaindashPH.mkDateArr(c.startDate, h.today, v);
                });
            }
            for (var x = 0; x < v.length; x = x + 1) {
                var y = v[x];
                var j = $A();
                for (var t = 0; t < h.studentList.length; t = t + 1) {
                    var s = h.studentList[t];
                    var g = $A();
                    var m = $A();
                    var r = $A();
                    var l = $A();
                    var f = $A();
                    h.remarkList.each(function(c) {
                        if (c.remark.created.substring(0, 10) == y.dateStr && c.remark.targetRole.id == s.id) {
                            if (pmaindashPH.parseEventListIsType(a, DASH_FILTER.DISCIPLINE) && (n == null || (n != null && (chelperPH.matchBySearchStr(c.remark.targetRole.name1, n) || chelperPH.matchBySearchStr(c.remark.targetRole.name2, n))))) {
                                g.push(c);
                            }
                        }
                    });
                    g.sort(sortByCreatedDesc);
                    h.absenceReasonList.each(function(c) {
                        if (c.startDate.substring(0, 10) == y.dateStr && c.student.id == s.id) {
                            if (pmaindashPH.parseEventListIsType(a, DASH_FILTER.DISCIPLINE)) {
                                f.push(c);
                            }
                        }
                    });
                    if (h.parentAbsenceNoteList) {
                        h.parentAbsenceNoteList.each(function(c) {
                            if (c.created.substring(0, 10) == y.dateStr && c.targetRole.id == s.id) {
                                if (pmaindashPH.parseEventListIsType(a, DASH_FILTER.DISCIPLINE) && (n == null || (n != null && (chelperPH.matchBySearchStr(c.targetRole.name1, n) || chelperPH.matchBySearchStr(c.targetRole.name2, n))))) {
                                    l.push(c);
                                }
                            }
                        });
                        l.sort(sortByCreatedDesc);
                    }
                    h.absenceEventList.each(function(c) {
                        if (c.lessonEvent != null) {
                            if (c.lessonEvent.eventDate.substring(0, 10) == y.dateStr && c.student.id == s.id) {
                                if (false == c.absenceType.isLateness && pmaindashPH.parseEventListIsType(a, DASH_FILTER.DISCIPLINE) && (n == null || (n != null && (chelperPH.matchBySearchStr(c.student.name1, n) || chelperPH.matchBySearchStr(c.student.name2, n) || chelperPH.matchBySearchStr(c.lessonEvent.journal.course.subject.type.name, n))))) {
                                    m.push(c);
                                }
                            }
                        } else {
                            if (c.eventDate.substring(0, 10) == y.dateStr && c.studentId == s.id) {
                                if (false == c.isLateness && pmaindashPH.parseEventListIsType(a, DASH_FILTER.DISCIPLINE) && (n == null || (n != null && (chelperPH.matchBySearchStr(c.studentName1, n) || chelperPH.matchBySearchStr(c.studentName2, n) || chelperPH.matchBySearchStr(c.subjectName, n))))) {
                                    m.push(c);
                                }
                            }
                        }
                    });
                    h.lateEventList.each(function(c) {
                        if (c.lessonEvent != null) {
                            if (c.lessonEvent.eventDate.substring(0, 10) == y.dateStr && c.student.id == s.id) {
                                if (true == c.absenceType.isLateness && pmaindashPH.parseEventListIsType(a, DASH_FILTER.DISCIPLINE) && (n == null || (n != null && (chelperPH.matchBySearchStr(c.student.name1, n) || chelperPH.matchBySearchStr(c.student.name2, n) || chelperPH.matchBySearchStr(c.lessonEvent.journal.course.subject.type.name, n))))) {
                                    r.push(c);
                                }
                            }
                        } else {
                            if (c.eventDate.substring(0, 10) == y.dateStr && c.studentId == s.id) {
                                if (true == c.isLateness && pmaindashPH.parseEventListIsType(a, DASH_FILTER.DISCIPLINE) && (n == null || (n != null && (chelperPH.matchBySearchStr(c.studentName1, n) || chelperPH.matchBySearchStr(c.studentName2, n) || chelperPH.matchBySearchStr(c.subjectName, n))))) {
                                    r.push(c);
                                }
                            }
                        }
                    });
                    r.sort(function(i, c) {
                        if (i.lessonEvent != null) {
                            return i.lessonEvent.lessonNumber - c.lessonEvent.lessonNumber;
                        } else {
                            return i.lessonNumber - c.lessonNumber;
                        }
                    });
                    m.sort(function(i, c) {
                        if (i.lessonEvent != null) {
                            return i.lessonEvent.lessonNumber - c.lessonEvent.lessonNumber;
                        } else {
                            return i.lessonNumber - c.lessonNumber;
                        }
                    });
                    var e = $A();
                    var o = false;
                    for (var p = 0; p < h.gradeList.length; p = p + 1) {
                        var q = h.gradeList[p];
                        var d = q.eventDate;
                        if (d == null) {
                            d = q.created;
                        }
                        if ((s.id == q.studentId) && (y.dateField == d.substring(0, 10)) && pmaindashPH.parseEventListIsType(a, DASH_FILTER.GRADES) && pgradesPH.isSearcingGrade(n, q, null)) {
                            o = true;
                            e.push(q);
                        }
                    }
                    if (o || g.length > 0 || m.length > 0 || r.length > 0 || l.length > 0 || f.length > 0) {
                        var w = j.length;
                        j[w] = {};
                        j[w].studentData = s;
                        j[w].studentData.person = {};
                        if (h.personHash && h.personHash[s.id]) {
                            j[w].studentData.person = h.personHash[s.id];
                        }
                        e.sort(sortGradesByEventDateDesc);
                        j[w].gradeList = e;
                        j[w].remarkList = g;
                        j[w].parentAbsenceNoteList = l;
                        j[w].absenceList = m;
                        j[w].lateList = r;
                        j[w].absenceReasonList = f;
                    }
                    v[x].dateStudentList = j;
                }
                if ((v[x].dateStudentList && v[x].dateStudentList.length > 0)) {
                    u.push(v[x]);
                }
            }
            if (a === DASH_FILTER.EVENTS || a === DASH_FILTER.ALL) {
                if (typeof h.lessons !== "undefined") {
                    h.lessons.forEach(function(c) {
                        u.push(c);
                    });
                }
            }
            u = u.sortBy(function(c) {
                return 0 - c.dateCompStr;
            });
        }
        return u;
    },
    loadDashCallback: function(e, b, c, a) {
        if (!b) {
            b = null;
        }
        if (!c) {
            c = 0;
        }
        var d = pmaindashPH.parseEventList(e, b, c);
        chelperPH.callcode(a, d);
    },
    drawDash: function(a) {
        ccachePH.getToday(function(f) {
            if (a.length > 0) {
                var g = guserPH.userGetChildren();
                var b = [];
                if (g != null && g.size() > 0) {
                    for (var e = 0; e < g.size(); e++) {
                        b.push(g[e].id);
                    }
                }
                ccachePH.homeworkPriorityList(function(h) {
                    ptasksPH.homeworkPriorityMap = h;
                    var i = TemplateEngine.parseById("hidden_dash_template_date_feeds_v2_content", {
                        "dateList": a,
                        "priorityList": h,
                        "childrenStudentMemberIdList": b,
                        "isFormMaster": pmaindashPH.isFormMaster,
                        "currentFilterId": pmaindashPH.currentFilterId,
                        "instId": pmaindashPH.instId,
                        "personId": pmaindashPH.personId,
                        "strToday": f,
                        "context": pmaindashPH.context
                    });
                    $("person_leftcontent").update(i);
                });
            } else {
                var d = TemplateEngine.parseById("hidden_dash_template_date_feeds_v2_nocontent", null);
                $("person_leftcontent").update(d);
            }
            if ($$(".iTodofeed")) {
                $$(".iTodofeed").invoke("remove");
            }
            if ($$(".iAbsencefeed")) {
                $$(".iAbsencefeed").invoke("remove");
            }
            if (pmaindashPH.currentFilterId != null && pmaindashPH.currentFilterId != DASH_FILTER.ALL) {} else {
                var c = TemplateEngine.parseById("hidden_dash_template_todo_summary", {
                    "todoSummaryList": pmaindashPH.dashRetObj.todoSummaryList,
                    "context": pmaindashPH.context,
                    "pagePersonId": pmaindashPH.personId
                });
                $("person_leftcontent").insert({
                    before: c
                });
            }
            hideLoadingIndicator("maincontent");
        });
    },
    dashRightContent: function(b) {
        if ($(pmainPH.rightPlaceHolder)) {
            $(pmainPH.rightPlaceHolder).update("");
        }
        if (this.context == CONTEXT.ME) {
            var u = guserPH.userGetGroups();
            var g = guserPH.userIsStudent();
            var x = guserPH.isParent();
            if ($("personDatatoolbar")) {
                $A($("personDatatoolbar").select(".iDashToolbar")).invoke("remove");
            } else {
                b = $(b) || $("maincontent") || $("maincontainer");
                var l = TemplateEngine.parseById("hidden_stpl_4", {
                    "toolbarId": "personDatatoolbar"
                });
                b.insert({
                    top: l
                });
            }
            var e = false;
            if (u != null) {
                for (var r = 0; r < u.size(); r++) {
                    if (u[r].interviewEnabled) {
                        e = true;
                    }
                }
            }
            var p = guserPH.isStaffRole();
            var f = guserPH.user.courseRegistrationUrl;
            var n = guserPH.user.courseRegistrationEnabled;
            var s = guserPH.user.firstname;
            var j = guserPH.user.lastname;
            var t = guserPH.user.idCode;
            var d = guserPH.user.languageCode;
            var h = guserPH.user.phone;
            var q = guserPH.user.email;
            var v = "";
            v = f + "#?lang=" + d;
            v = f + "#/landing?view=course_list" + "&lang=" + d + "&firstname=" + encodeURIComponent(s) + "&lastname=" + encodeURIComponent(j) + "&code=" + encodeURIComponent(t) + "&email=" + encodeURIComponent(q) + "&phone=" + encodeURIComponent(h);
            var a = TemplateEngine.parseById("hidden_dash_tools", {
                "isStudent": g,
                "isVisibleInterview": e,
                "isStaff": p,
                "isParent": x,
                "courseRegistrationEnabled": n,
                "courseRegistrationUrlFull": v
            });
            if (!$("schoolDatatoolbar")) {
                $("personDatatoolbar").insert(a);
                clayoutPH.initMainMenu(NAV_PERSON_SET_MINI);
            }
            var m = guserPH.userGetChildren();
            var w = $A();
            var k = $A();
            var c = $H();
            m.sort(sortMemberByFirstName).each(function(i) {
                if (i.person != null && !c.get(i.person.id)) {
                    k.push(i);
                    w.push(i.name1);
                    c.set(i.person.id, true);
                }
            });
            m.each(function(i) {
                if ((i.person == null) && (w.indexOf(i.name1) < 0)) {
                    k.push(i);
                    w.push(i.name1);
                }
            });
            if ($(pmainPH.rightPlaceHolder)) {
                if (k.length > 0) {
                    var o = TemplateEngine.parseById("hidden_dash_children", {
                        "childArr": k
                    });
                    $(pmainPH.rightPlaceHolder).insert(o);
                }
            }
        } else {
            pmainPH.showPersonProfile();
        }
        this.groupsShow();
    },
    requests: function(a) {
        chelperPH.loadTemplateHidd(chelperPH.resourcedir + pmaindashPH.foldername + "/main/tpl/dashboard.html", function() {
            $LAB.script(chelperPH.resourcedir + "c/app/js/cappPH.js").wait(function() {
                cappPH.initAppV2(APP_LAYOUT.SIMPLE, "", {
                    "onCloseCb": chelperPH.refreshMyCounts
                }, function() {
                    showLoadingIndicator("appContent");
                    dashboardManager.getRequests({
                        callback: function(j) {
                            pmaindashPH.prevSelectedRequestEl = null;
                            pmaindashPH.requestList = j.returnObject.requestList;
                            pmaindashPH.unreadRequestsList = j.returnObject.unreadRequestsList;
                            pmaindashPH.schoolGroupRequestList = j.returnObject.schoolGroupRequestList;
                            pmaindashPH.exemptRequestList = j.returnObject.exemptedRequests;
                            pmaindashPH.messageList = j.returnObject.messageList;
                            pmaindashPH.messageList.sort(sortByCreatedDesc);
                            var f = 0;
                            var k = 0;
                            var d = pmaindashPH.messageList.length;
                            var l = 0;
                            var c = 0;
                            var h = 0;
                            var m = pmaindashPH.schoolGroupRequestList.size();
                            pmaindashPH.requestList.each(function(i) {
                                if (i.requestTypeId == 5 || i.requestTypeId == 9) {
                                    d++;
                                } else {
                                    if (i.requestTypeId == 1 || i.requestTypeId == 3 || i.requestTypeId == 8 || i.requestTypeId == 11) {
                                        k++;
                                    } else {
                                        f++;
                                    }
                                }
                            });
                            pmaindashPH.schoolGroupRequestList.each(function(i) {
                                i.isSchoolGroupRequest = true;
                                pmaindashPH.requestList.push(i);
                            });
                            pmaindashPH.exemptRequestList.each(function(i) {
                                i.isExemptRequest = true;
                                pmaindashPH.requestList.push(i);
                            });
                            pmaindashPH.requestList.sort(sortByCreatedDesc);
                            f += m;
                            var b = null;
                            if (pmaindashPH.unreadRequestsList != null) {
                                for (var e = 0; e < pmaindashPH.unreadRequestsList.length; e++) {
                                    if (pmaindashPH.unreadRequestsList[e].requestBlock == pmaindashPH.requestMenuBlocks.contact) {
                                        h++;
                                    } else {
                                        if (pmaindashPH.unreadRequestsList[e].requestBlock == pmaindashPH.requestMenuBlocks.admission) {
                                            l++;
                                        } else {
                                            if (pmaindashPH.unreadRequestsList[e].requestBlock == pmaindashPH.requestMenuBlocks.join) {
                                                c++;
                                            }
                                        }
                                    }
                                }
                            }
                            if (k > 0) {
                                b = 2;
                            }
                            if (f > 0 || m > 0) {
                                b = 1;
                            }
                            if (d > 0) {
                                b = 0;
                            }
                            if (a != null && a == 0 && d > 0) {
                                b = 0;
                            }
                            if (a != null && a == 1 && f > 0) {
                                b = 1;
                            }
                            if (a != null && a == 2 && k > 0) {
                                b = 2;
                            }
                            var g = TemplateEngine.parseById("hidden_dash_requests", {
                                "contactReqCount": d,
                                "admRequestCount": f,
                                "joinRequestCount": k,
                                "contactReqUnreadCount": h,
                                "admRequestUnreadCount": l,
                                "joinRequestUnreadCount": c,
                                "sel": b
                            });
                            $("appContent").update(g);
                            hideLoadingIndicator("appContent");
                            pmaindashPH.requestsClick(null, b);
                        }
                    });
                });
            });
        });
    },
    requestsClick: function(b, h) {
        if ($(pmaindashPH.prevSelectedRequestEl) != null && $(pmaindashPH.prevSelectedRequestEl).previous(".unread") != null) {
            $(pmaindashPH.prevSelectedRequestEl).previous(".unread").remove();
        }
        pmaindashPH.requestsCurrType = h;
        var d = 0;
        if (b) {
            $("dash_requests_tabs").select("a.selected").invoke("removeClassName", "selected");
            $(b).addClassName("selected");
        }
        var g = null;
        var c = $H();
        for (var e = 0; e < pmaindashPH.unreadRequestsList.length; e++) {
            c.set(pmaindashPH.unreadRequestsList[e].notificationObjId, true);
        }
        if (h == 3) {
            g = TemplateEngine.parseById("hidden_dash_requests_searchschools", null);
            $("hidden_dash_requests_content").update(g);
            var j = {
                "title": "Для поступления в школу или получения доступа к своим (или ребенка) школьным данным Вам необходимо найти школу и заполнить форму.",
                "description": "Поиск школ",
                "descriptionLink": "cappPH.closeApp(); SWFAddress.setValue('?screenId=e.main.index&searchStr=');; return false;"
            };
            clayoutPH.nocontent("dash_requests_searchschools_content", j);
        } else {
            if (h == 2) {
                g = TemplateEngine.parseById("hidden_dash_requests_join", {
                    "requestList": pmaindashPH.requestList,
                    "unreadRequestsListMap": c,
                    "requestTypeIdArr": [1, 3, 8, 11]
                });
                $("hidden_dash_requests_content").update(g);
                d = pmaindashPH.requestMenuBlocks.join;
            } else {
                if (h == 1) {
                    d = pmaindashPH.requestMenuBlocks.admission;
                    pmaindashPH.requestsShowAdmission();
                } else {
                    var a = $A();
                    pmaindashPH.requestList.each(function(i) {
                        if (i.requestTypeId > 4 && i.requestTypeId < 11) {
                            a.push(i);
                        }
                    });
                    var f = $A();
                    pmaindashPH.messageList.each(function(i) {
                        f.push(i);
                    });
                    g = TemplateEngine.parseById("hidden_dash_requests_contacts", {
                        "unreadRequestsListMap": c,
                        "messageList": f,
                        "requestList": a
                    });
                    $("hidden_dash_requests_content").update(g);
                    d = pmaindashPH.requestMenuBlocks.contact;
                    if ($(b) == null) {
                        b = $("dash_requests_tab_contact");
                    }
                }
            }
        }
        if (d > 0 && pmaindashPH.unreadRequestsList.size() > 0) {
            dashboardManager.removeRequestBlockNotification(d, {
                callback: function(k) {
                    for (var l = pmaindashPH.unreadRequestsList.length - 1; l >= 0; l--) {
                        if (pmaindashPH.unreadRequestsList[l].requestBlock == d) {
                            pmaindashPH.unreadRequestsList.splice(l, 1);
                        }
                    }
                }
            });
        }
        pmaindashPH.prevSelectedRequestEl = b;
    },
    requestsShowAdmission: function() {
        var c = $H();
        for (var b = 0; b < pmaindashPH.unreadRequestsList.length; b++) {
            c.set(pmaindashPH.unreadRequestsList[b].notificationObjId, true);
        }
        var a = TemplateEngine.parseById("hidden_dash_requests_admission", {
            "requestList": pmaindashPH.requestList,
            "unreadRequestsListMap": c,
            "requestTypeIdArr": [2, 4]
        });
        $("hidden_dash_requests_content").update(a);
    },
    groupsShow: function() {
        var c = "";
        if (guserPH.user.allAvailableRoles.length > 0) {
            var b = guserPH.userGetGroups();
            c = TemplateEngine.parseById("hidden_dash_groups", {
                "userGroups": b
            });
        }
        if ($("g_user_chooseaccount")) {
            $("g_user_chooseaccount").remove();
        }
        if ($("dashboard_pendingrequests")) {
            $("dashboard_pendingrequests").insert({
                "before": c
            });
        } else {
            if ($(pmainPH.rightPlaceHolder) != "undefined" && $(pmainPH.rightPlaceHolder) != null) {
                $(pmainPH.rightPlaceHolder).insert(c);
            }
        }
        if (typeof googletag.destroySlots === "function") {
            googletag.destroySlots();
        }
        var d = TemplateEngine.parseById("dash_person_rightcontent_adverts", null);
        var a = $("person_rightcontent");
        if (a && d != null) {
            a.insert({
                bottom: d
            });
        }
        clayoutPH.makePageMenuPretty();
    },
    instRequestClick: function(a) {
        guserPH.activateGroup(a, function() {
            SWFAddress.setValue("?screenId=a.requests.show&groupId=" + a);
        });
    },
    requestMessDelete: function(b) {
        var c = confirm("Удалить это сообщение?");
        if (c) {
            var a = chelperPH.getIndexOfObjById({
                "id": b
            }, pmaindashPH.messageList);
            var d = pmaindashPH.messageList[a];
            if (d.messageType.id == 11 || d.messageType.id == 6) {
                messagingManager.threadMarkRemoved(dwrNumber(b), {
                    callback: function(e) {
                        pmaindashPH.requestMessDeleteSaved(e, d);
                    }
                });
            } else {
                messagingManager.threadDelete(dwrNumber(b), {
                    callback: function(e) {
                        pmaindashPH.requestMessDeleteSaved(e, d);
                    }
                });
            }
        }
    },
    requestMessDeleteSaved: function(b, c) {
        if (b.isError) {
            chelperPH.showNotice("Удаление не удалось");
        } else {
            if ($("person_leftcontent_request_" + c.id)) {
                $("person_leftcontent_request_" + c.id).remove();
            }
            var a = chelperPH.getIndexOfObjById({
                "id": c.id
            }, pmaindashPH.messageList);
            pmaindashPH.messageList.splice(a, 1);
            pmaindashPH.requests(0);
        }
    },
    requestDelete: function(b) {
        var a = confirm("Удалить это ходатайство?");
        if (a) {
            messagingManager.requestDelete(dwrNumber(b), {
                callback: function(d) {
                    var c = chelperPH.getIndexOfObjById({
                        "id": b
                    }, pmaindashPH.requestList);
                    pmaindashPH.requestList.splice(c, 1);
                    pmaindashPH.requestsClick(null, 2);
                }
            });
        }
    },
    requestConfirmAdmin: function(a, b) {
        messagingManager.processAdminInvite(dwrNumber(a), dwrBoolean(b), {
            callback: function(d) {
                if (b) {
                    userAccountManager.setAuthParam({
                        callback: function(e) {
                            showLoadingIndicator();
                            chelperPH.goToHomePageDelay();
                        }
                    });
                } else {
                    var c = chelperPH.getIndexOfObjById({
                        "id": a
                    }, pmaindashPH.messageList);
                    pmaindashPH.messageList.splice(c, 1);
                    pmaindashPH.requests(0);
                }
            }
        });
    },
    requestConfirmStaff: function(b, a) {
        messagingManager.processStaffInvite(dwrNumber(b), dwrBoolean(a), {
            callback: function(d) {
                if (a) {
                    userAccountManager.setAuthParam({
                        callback: function(e) {
                            showLoadingIndicator();
                            chelperPH.goToHomePageDelay();
                        }
                    });
                } else {
                    var c = chelperPH.getIndexOfObjById({
                        "id": b
                    }, pmaindashPH.requestList);
                    pmaindashPH.requestList.splice(c, 1);
                    pmaindashPH.requests(0);
                }
            }
        });
    },
    showRequestStatusInfo: function(b, a, d, f, c) {
        var e = TemplateEngine.parseById("hidden_dash_template_request_status_info", {
            "status": a,
            "requestTypeId": d,
            "isSchoolGroupRequest": f,
            "isDesignated": c
        });
        clayoutPH.popupShow(b.up(), null, e, {
            forceLeft: false,
            destroyOnMouseLeave: false,
            removeOnContentClick: false,
            forceRight: true,
            bgColorEQInfobackground: true
        });
        $("c_popup").removeClassName("rightup").removeClassName("rightdown").removeClassName("leftup").removeClassName("leftdown");
    },
    showpost: function(b, a) {
        $LAB.script(chelperPH.resourcedir + "p/blog/js/pblogPH.js").wait(function() {
            $LAB.script(chelperPH.resourcedir + "c/blog/js/cblogPH.js").wait(function() {
                if (a == null) {
                    pblogPH.personId = pmainPH.person.id;
                } else {
                    pblogPH.personId = a;
                }
                pblogPH.getBlogPost(b, a);
            });
        });
    },
    showBlog: function(a) {
        $LAB.script(chelperPH.resourcedir + "p/blog/js/pblogPH.js").wait(function() {
            $LAB.script(chelperPH.resourcedir + "c/app/js/cappPH.js").wait(function() {
                cappPH.initAppV2(APP_LAYOUT.SIMPLE, "", {}, function() {
                    var b = TemplateEngine.parseById("hidden_blog_sheet_view", {
                        "personId": a
                    });
                    $("appContent").update(b);
                    pblogPH.blogDiv = "dash_blog_sheet_view_data_ph";
                    pblogPH.show();
                });
            });
        });
    },
    insertPost: function() {
        $LAB.script(chelperPH.resourcedir + "p/blog/js/pblogPH.js").wait(function() {
            pblogPH.initNewPostForm();
        });
    },
    showTasks: function(d, b, a, e, c) {
        $LAB.script(chelperPH.resourcedir + "p/tasks/js/ptasksPH.js").wait(function() {
            ptasksPH.show(d, b, a, e, c);
        });
    },
    insertNewTask: function() {
        $LAB.script(chelperPH.resourcedir + "p/tasks/js/ptasksPH.js").wait(function() {
            ptasksPH.showInsertForm();
        });
    },
    showCalendar: function() {
        $LAB.script(chelperPH.resourcedir + "p/cal/js/pcalPH.js").wait(function() {
            pcalPH.show(pmainPH.person.id);
        });
    },
    showReportCard: function(c, a, b) {
        $LAB.script(chelperPH.resourcedir + "p/grades/js/pgradesPH.js").wait(function() {
            pgradesPH.showReportCard(c, a, b);
        });
    },
    emptyDash: function() {
        ccachePH.dashDataEmpty(pmainPH.person.id, pmainPH.context, pmaindashPH.instId, pmaindashPH.journalId);
    },
    refreshDash: function() {
        pmaindashPH.emptyDash();
        pmaindashPH.show(pmainPH.person.id, pmaindashPH.cfilterPH.filter.type, pmaindashPH.context, pmaindashPH.instId, pmaindashPH.journalId);
    },
    dashRefresh: function(b, a) {
        if (pmaindashPH.cfilterPH != null && pmaindashPH.cfilterPH.filter != null) {
            b = pmaindashPH.cfilterPH.filter.type;
        } else {
            b = DASH_FILTER.ALL;
        }
        ccachePH.dashDataEmpty(pmaindashPH.personId, pmaindashPH.context, pmaindashPH.instId, pmaindashPH.journalId);
        pmaindashPH.show(pmaindashPH.personId, b, pmaindashPH.context, pmaindashPH.instId, pmaindashPH.journalId);
    },
    admissionRequestConfirmOrAccept: function(d, c) {
        clayoutPH.initModalBox();
        showLoadingIndicator("modalbox_content");
        var a = null;
        if (c) {
            a = "admission_request_confirm_or_accept_confirmer_accept";
        } else {
            a = "admission_request_confirm_or_accept_confirmer_cancel";
        }
        var b = TemplateEngine.parseById(a, {
            "id": d,
            "accept": c
        });
        $("modalbox_content").update(b);
        hideLoadingIndicator("modalbox_content");
    },
    admissionRequestConfirmOrAcceptCancel: function(b, a) {
        clayoutPH.closeModalBox();
    },
    admissionRequestConfirmOrAcceptSubmit: function(c, a) {
        if ($("admission_request_confirm_or_accept_confirmer_ck")) {
            if ($("admission_request_confirm_or_accept_confirmer_ck").checked) {
                var b = null;
                if (!a) {
                    b = $F("admission_request_confirm_or_accept_confirmer_finalMsgText");
                    $("admission_request_confirm_or_accept_confirmer_cancel_form").clearErrors();
                }
                if (!a && (b == null || b.length == 0)) {
                    $("admission_request_confirm_or_accept_confirmer_cancel_form").showError("finalMsgText", "Пожалуйста, укажите причину");
                } else {
                    schoolyearManager.admissionRequestConfirmOrAccept(dwrNumber(c), dwrBoolean(a), b, {
                        callback: function(e) {
                            if (e.isError) {
                                shout("pmaindashPH.admissionRequestConfirmOrAccept: error");
                            } else {
                                var d = chelperPH.getIndexOfObjById({
                                    "id": c
                                }, pmaindashPH.requestList);
                                if (a == true) {
                                    pmaindashPH.requestList[d] = e.returnObject;
                                } else {
                                    pmaindashPH.requestList.splice(d, 1);
                                }
                                pmaindashPH.requests(1);
                                clayoutPH.closeModalBox();
                            }
                        }
                    });
                }
            } else {
                if (!a) {
                    $("admission_request_confirm_or_accept_confirmer_cancel_form").clearErrors();
                    $("admission_request_confirm_or_accept_confirmer_cancel_form").showError("finalMsgText", "Пожалуйста, укажите причину");
                    $("admission_request_confirm_or_accept_confirmer_cancel_form").showError("isSure", "");
                }
            }
        }
    },
    admissionRequestCancel: function() {
        clayoutPH.popupRemove();
    },
    dashRefreshCurrent: function(b) {
        var a = null;
        if (pmaindashPH.currentFilterId == 2) {
            a = [2, 3];
        } else {
            a = pmaindashPH.currentFilterId;
        }
        pmaindashPH.dashRefresh(a, b);
    },
    disciplineRefresh: function() {
        pmaindashPH.dashRefresh([2, 3]);
    },
    disciplineAbsenceReasonForm: function(d, h, c, g, a, f) {
        var b = {};
        b.person = pmainPH.person;
        if (d > 0) {
            b = chelperPH.arrFindById(d, pmaindashPH.dashRetObj.absenceReasonList);
        } else {
            if (h > 0) {
                var e = chelperPH.arrFindById(h, pmaindashPH.dashRetObj.parentAbsenceNoteList);
                b.startDate = e.startDate;
                b.endDate = e.endDate;
                b.textContent = e.textContent;
            } else {
                if (c && c > "") {
                    b.startDate = c;
                }
                if (g && g > "") {
                    b.endDate = g;
                }
                if (a && a > "") {
                    b.startLessonNo = a;
                }
                if (f && f > "") {
                    b.endLessonNo = f;
                }
            }
        }
        $LAB.script(chelperPH.resourcedir + "p/prof/js/disciplineSchoolPH.js").wait(function() {
            disciplineSchoolPH.disciplineAbsenceReasonForm(pmaindashPH.personId, pmaindashPH.instId, b);
        });
    },
    disciplineAbsenceNoticeDiscard: function(a) {
        var b = chelperPH.arrFindById(a, pmaindashPH.dashRetObj.parentAbsenceNoteList);
        $LAB.script(chelperPH.resourcedir + "p/prof/js/disciplineSchoolPH.js").wait(function() {
            disciplineSchoolPH.showAbsenceNoticeDiscardForm(b);
        });
    },
    disciplineAbsenceNoticeDelete: function(a) {
        $LAB.script(chelperPH.resourcedir + "p/prof/js/disciplineSchoolPH.js").wait(function() {
            disciplineSchoolPH.disciplineAbsenceNoticeDelete(a);
        });
    },
    disciplineAbsenceReasonDel: function(a) {
        $LAB.script(chelperPH.resourcedir + "p/prof/js/disciplineSchoolPH.js").wait(function() {
            disciplineSchoolPH.disciplineAbsenceReasonDel(pmaindashPH.personId, pmaindashPH.instId, a);
        });
    },
    attendanceNoticeForm: function() {
        $LAB.script(chelperPH.resourcedir + "p/prof/js/disciplineParentPH.js").wait(function() {
            disciplineParentPH.attendanceNoticeForm(pmaindashPH.personId);
        });
    },
    disciplineDetails: function(a, d, c, b) {
        $LAB.script(chelperPH.resourcedir + "p/prof/js/disciplineCommonPH.js").wait(function() {
            var e = null;
            if (d == 0) {
                e = pmaindashPH.dashRetObj.absenceEventList;
            } else {
                if (d == 1) {
                    e = pmaindashPH.dashRetObj.lateEventList;
                }
            }
            disciplineCommonPH.disciplineDetails(a, d, c, e, b);
        });
    },
    dashRetObjGetAbsenceEventList: function() {
        return pmaindashPH.dashRetObj.absenceEventList;
    },
    dashRetObjSetAbsenceEventList: function(a) {
        pmaindashPH.dashRetObj.absenceEventList = a;
    },
    dashRetObjGetLateEventList: function() {
        return pmaindashPH.dashRetObj.lateEventList;
    },
    dashRetObjSetLateEventList: function(a) {
        pmaindashPH.dashRetObj.lateEventList = a;
    },
    dashRetObjSetRemarkList: function(a) {
        pmaindashPH.dashRetObj.remarkList = a;
    },
    dashRetObjSetParentAbsenceNoteList: function(a) {
        pmaindashPH.dashRetObj.parentAbsenceNoteList = a;
    },
    latenessForm: function(c, d, a, b, e) {
        $LAB.script(chelperPH.resourcedir + "p/prof/js/disciplineSchoolPH.js").wait(function() {
            disciplineSchoolPH.latenessForm(c, d, a, b, e);
        });
    },
    absenceReasonDetails: function(b, a) {
        var c = false;
        if (pmaindashPH.isFormMaster == true && (pmaindashPH.currentFilterId == 2 || $("discipline_sheet_view_data_ph") != null)) {
            c = true;
        }
        $LAB.script(chelperPH.resourcedir + "p/prof/js/disciplineCommonPH.js").wait(function() {
            disciplineCommonPH.absenceReasonDetails(b, a, c);
        });
    },
    showReports: function(a) {
        $LAB.script(chelperPH.resourcedir + "p/reports/js/preportsPH.js").wait(function() {
            preportsPH.show(pmaindashPH.personId, pmaindashPH.context, a);
        });
    },
    showLearning: function(a) {
        $LAB.script(chelperPH.resourcedir + "p/reports/js/learningPH.js").wait(function() {
            learningPH.show(pmaindashPH.context, LEARNING_VIEWNAME.WEEK, null, null, null, null, null, a);
        });
    },
    toggleDashTodo: function(b, a) {
        if ($(b).up("li").down(a)) {
            $A($(b).up("li").select(a)).invoke("toggle");
        }
    },
    toggleDashSubTodo: function(b, a) {
        if ($(b).up("ul").down(a)) {
            $A($(b).up("ul").select(a)).invoke("toggle");
        }
    },
    toggleDashSubAbs: function(b, a) {
        pmaindashPH.toggleDashSubTodo(b, a);
    },
    editCD: function(e) {
        var d = null;
        var c = [];
        if ($("dash_events_sheet_view_data_ph") != null) {
            c = feedPH.counsilList;
        } else {
            c = pmaindashPH.dashRetObj.feedList;
        }
        if (c != null) {
            for (var a = 0; a < c.size(); a++) {
                if (c[a].id == e) {
                    d = c[a];
                    break;
                }
            }
            if (d != null) {
                clayoutPH.initMMModalDialog({
                    hasCloseButton: true,
                    innerPadding: 0
                });
                showLoadingIndicator("modaldialog_content");
                var b = $(document.createElement("form"));
                b.id = "formCouncilDecisionFM";
                b.setDataObj(d);
                b.drawEditMode($("modaldialog_content"));
                b.bindSaveAction(pmaindashPH.saveCouncilDecision);
                hideLoadingIndicator("modaldialog_content");
            } else {
                shout("Council Decision is null");
            }
        } else {
            shout("Council Decision List is null");
        }
    },
    saveCouncilDecision: function(d, a, c) {
        showLoadingIndicator("modaldialog_content");
        var b = $(getFormName());
        b.clearErrors();
        d.id = b._formData.id;
        councilDecisionManager.editCouncilDecision(d, {
            callback: function(f, e) {
                if (f.isError) {
                    chelperPH.parseErrors(f.errors);
                    hideLoadingIndicator("modaldialog_content");
                } else {
                    hideLoadingIndicator("modaldialog_content");
                    clayoutPH.closeMMModalDialog();
                    chelperPH.showNotice("Решение пед. совета изменено.");
                    pmaindashPH.refreshDash();
                }
            }
        });
    },
    getHtmlForPersonName: function(d) {
        if (pmaindashPH.context == CONTEXT.ME || pmaindashPH.context == CONTEXT.THIRD) {
            if (d.id == guserPH.user.id) {
                return guserPH.user.name1;
            }
            for (var c = 0; c < guserPH.user.allAvailableRoles.size(); c++) {
                var e = guserPH.user.allAvailableRoles[c];
                if (e instanceof ee.ekool.model.roles.Student && d.id == e.id) {
                    return guserPH.user.name1;
                } else {
                    if (e instanceof ee.ekool.model.roles.Parent && e.student.person != null && e.student.person.id != null && (d.id == e.student.id || d.id == e.student.person.id)) {
                        var b = null;
                        if (pmaindashPH.context == CONTEXT.ME) {
                            b = '<a href="#/?screenId=u.main.showperson&personId=' + e.student.person.id + '">' + e.student.name1 + "</a>";
                        } else {
                            if (pmaindashPH.context == CONTEXT.THIRD) {
                                b = e.student.name1;
                            }
                        }
                        return b;
                    }
                }
            }
        } else {
            if (d.name1 != null) {
                return d.name1;
            }
            if (pmainPH != null && pmainPH.person != null && d.id == pmainPH.person.id) {
                return pmainPH.person.name1;
            }
            if (pmaindashPH.dashRetObj != null && pmaindashPH.dashRetObj.studentList != null) {
                for (var c = 0; c < pmaindashPH.dashRetObj.studentList.size(); c++) {
                    var a = pmaindashPH.dashRetObj.studentList[c];
                    if (a.id == d.id) {
                        return a.name1;
                    }
                }
            }
        }
        return d.name1;
    },
    disciplineRemarkForm: function(a) {
        $LAB.script(chelperPH.resourcedir + "p/prof/js/disciplineSchoolPH.js").wait(function() {
            var b = null;
            if (a > 0) {
                b = pmaindashPH.dashRetObj.remarkList.filter(function(c) {
                    return c.remark.id == a;
                });
                b = b[0].remark;
                b.person = pmainPH.person;
            }
            disciplineSchoolPH.remForm(pmaindashPH.personId, pmaindashPH.instId, b);
        });
    },
    getDashData: function(c, b, d, a, e) {
        chelperPH.hideNotificationArea();
        if (d == null) {
            d = 0;
        }
        if (b == null) {
            b = CONTEXT.ME;
        }
        pmaindashPH.context = b;
        pmaindashPH.personId = c;
        pmaindashPH.currentFilterId = 0;
        pmaindashPH.instId = a;
        pmaindashPH.journalId = e;
        ccachePH.getToday(function(f) {
            chelperPH.loadTemplateHidd(chelperPH.resourcedir + pmaindashPH.foldername + "/main/tpl/dashboard.html", function() {
                chelperPH.loadTemplateHidd(chelperPH.resourcedir + "p/grades/tpl/pgrades_tpl.html", function() {
                    chelperPH.loadTemplateHidd(chelperPH.resourcedir + "p/tasks/tpl/task_tmpl.html", function() {
                        $LAB.script(chelperPH.resourcedir + "p/tasks/js/ptasksPH.js").wait(function() {
                            $LAB.script(chelperPH.resourcedir + "p/grades/js/pgradesPH.js").wait(function() {
                                $LAB.script(chelperPH.resourcedir + "p/main/js/feedPH.js").wait(function() {
                                    $LAB.script(chelperPH.resourcedir + "p/main/js/dashJournalMessage.js").wait(function() {
                                        ccachePH.dashData(c, b, a, e, pmainPH.isAttJournal, pmainPH.isGradesJournal, function(g) {
                                            userAccountManager.getServerTimeStamp(function(s) {
                                                pmaindashPH.dashArr = [];
                                                g.jmList.each(function(i) {
                                                    g.studentList.each(function(F) {
                                                        if (i.sendTo.indexOf(parseInt(F.id)) > -1) {
                                                            var E = new DashJournalMessage(i, F.id);
                                                            pmaindashPH.dashArr.push(E);
                                                        }
                                                    });
                                                });
                                                if (!pmainPH.person.registerPersonList || pmainPH.person.registerPersonList.size() === 0) {
                                                    pmainPH.person.registerPersonList = [];
                                                    for (var y = 0; y < g.registerPersonList.size(); y++) {
                                                        try {
                                                            pmainPH.person.registerPersonList.push(g.registerPersonList[y]);
                                                            pmaindashPH.hasBeenStudent = true;
                                                        } catch (o) {
                                                            log("JSON PARSE ERROR");
                                                        }
                                                    }
                                                }
                                                var t = {};
                                                var x = g.todayTimeLimit;
                                                for (var y = 0; y < g.grades.size(); y++) {
                                                    try {
                                                        t = g.grades[y];
                                                        if (x <= t.eventTime) {
                                                            if (typeof t.gradeReleaseDate === "undefined" || t.gradeReleaseDate <= s) {
                                                                t.eventType = "grade";
                                                                t.isMine = false;
                                                                if (pmaindashPH.context == CONTEXT.ME) {
                                                                    if (guserPH.userGetRoleById(t.studentId)) {
                                                                        t.isMine = true;
                                                                    } else {
                                                                        t.isMine = false;
                                                                    }
                                                                }
                                                                pmaindashPH.dashArr.push(t);
                                                            }
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.remarks.size(); y++) {
                                                    try {
                                                        t = g.remarks[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "remark";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.absReasons.size(); y++) {
                                                    try {
                                                        t = g.absReasons[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "absReason";
                                                            t.absences = [];
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.absNotes.size(); y++) {
                                                    try {
                                                        t = g.absNotes[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "absNote";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.councilDecisions.size(); y++) {
                                                    try {
                                                        t = g.councilDecisions[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "councilDecision";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.studentInterviews.size(); y++) {
                                                    try {
                                                        t = g.studentInterviews[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "studentInterview";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.studentInterTodoNotifList.size(); y++) {
                                                    try {
                                                        t = g.studentInterTodoNotifList[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "interTodoNotification";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.personInterTodoNotifList.size(); y++) {
                                                    try {
                                                        t = g.personInterTodoNotifList[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "interTodoNotification";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.studentInterviewProtocols.size(); y++) {
                                                    try {
                                                        t = g.studentInterviewProtocols[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "studentInterviewProtocol";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.studentFANotifList.size(); y++) {
                                                    try {
                                                        t = g.studentFANotifList[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "faStudentNotification";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.personFANotifList.size(); y++) {
                                                    try {
                                                        t = g.personFANotifList[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "faPersonNotification";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.personSocialWorkerNotifList.size(); y++) {
                                                    try {
                                                        t = g.personSocialWorkerNotifList[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "personSocialWorkerNotification";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.personSocialWorkerNotifRemoveList.size(); y++) {
                                                    try {
                                                        t = g.personSocialWorkerNotifRemoveList[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "personSocialWorkerRemovedNotification";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.blogHeadingList.size(); y++) {
                                                    try {
                                                        t = g.blogHeadingList[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "blog";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.teacherFANotifList.size(); y++) {
                                                    try {
                                                        t = g.teacherFANotifList[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "faTeacherNotification";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.socialWorkerSocialWorkerNotifList.size(); y++) {
                                                    try {
                                                        t = g.socialWorkerSocialWorkerNotifList[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "socialWorkerSocialWorkerNotification";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.socialWorkerSocialWorkerNotifRemoveList.size(); y++) {
                                                    try {
                                                        t = g.socialWorkerSocialWorkerNotifRemoveList[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "socialWorkerSocialWorkerRemovedNotification";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.personDiscNoteList.size(); y++) {
                                                    try {
                                                        t = g.personDiscNoteList[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "personDiscNote";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.personDocList.size(); y++) {
                                                    try {
                                                        t = g.personDocList[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "personDoc";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.devCardList.size(); y++) {
                                                    try {
                                                        t = g.devCardList[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "devCard";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.personRemoveDocList.size(); y++) {
                                                    try {
                                                        t = g.personRemoveDocList[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "personRemoveDoc";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.personRemoveNoteList.size(); y++) {
                                                    try {
                                                        t = g.personRemoveNoteList[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "personRemoveNote";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.schoolEvents.size(); y++) {
                                                    try {
                                                        t = g.schoolEvents[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "schoolEvent";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.instBlogPosts.size(); y++) {
                                                    try {
                                                        t = g.instBlogPosts[y];
                                                        if (x <= t.eventTime) {
                                                            t.eventType = "instBlogPost";
                                                            pmaindashPH.dashArr.push(t);
                                                        }
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                var q = guserPH.getAllStudentsIdCodes();
                                                for (var y = 0; y < g.hobbyActivityList.size(); y++) {
                                                    try {
                                                        t = g.hobbyActivityList[y];
                                                        t.eventType = "hobbyActivity";
                                                        var n = q.get(t.entry.idCode);
                                                        if (n != null) {
                                                            t.studentId = n.studentId;
                                                            t.personId = n.personId;
                                                        }
                                                        pmaindashPH.dashArr.push(t);
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.hobbyEventList.size(); y++) {
                                                    try {
                                                        t = g.hobbyEventList[y];
                                                        t.eventType = "hobbyEvent";
                                                        var n = q.get(t.entry.idCode);
                                                        if (n != null) {
                                                            t.studentId = n.studentId;
                                                            t.personId = n.personId;
                                                        }
                                                        pmaindashPH.dashArr.push(t);
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                for (var y = 0; y < g.hobbyMessageList.size(); y++) {
                                                    try {
                                                        t = g.hobbyMessageList[y];
                                                        t.eventType = "hobbyMessage";
                                                        var n = q.get(t.entry.idCode);
                                                        if (n != null) {
                                                            t.studentId = n.studentId;
                                                            t.personId = n.personId;
                                                        }
                                                        pmaindashPH.dashArr.push(t);
                                                    } catch (o) {
                                                        log("JSON PARSE ERROR");
                                                    }
                                                }
                                                pmaindashPH.dashArr.sort(pmaindashPH.byEventTimeSort);
                                                var u = $H();
                                                if (guserPH.userGroupHash != null) {
                                                    var h = guserPH.userGroupHash.values();
                                                    for (var y = 0; y < h.length; y++) {
                                                        ccachePH.absenceTypeList(h[y].id, function(E) {
                                                            for (var i = 0; i < E.length; i++) {
                                                                u.set(E[i].id, E[i].name);
                                                            }
                                                        });
                                                    }
                                                }
                                                var D = $H(g.absenceFeedNames);
                                                var v = $H(g.absenceFeedMap);
                                                var B = [];
                                                v.each(function(J) {
                                                    var N = {
                                                        "unauthLate": [],
                                                        "authLate": []
                                                    };
                                                    var O = {
                                                        "unauthAbsences": [],
                                                        "authAbsences": []
                                                    };
                                                    var L = {
                                                        id: J.key,
                                                        "name1": D.get(J.key)
                                                    };
                                                    var E = pmaindashPH.getHtmlForPersonName(L);
                                                    var H = false;
                                                    if (J.key == guserPH.user.id) {
                                                        H = true;
                                                    }
                                                    var G = {
                                                        "name": E,
                                                        "isMine": H,
                                                        "person": L
                                                    };
                                                    var M = $A(J.value);
                                                    var F = [];
                                                    if (M.size() > 0) {
                                                        for (var K = 0; K < M.size(); K++) {
                                                            try {
                                                                t = M[K];
                                                                if (x <= t.eventTime) {
                                                                    t.eventDate = t.lessonDate;
                                                                    if (t.absenceTypeId != null) {
                                                                        t.absTypeName = u.get(t.absenceTypeId);
                                                                    }
                                                                    if (t.isLateness) {
                                                                        t.eventType = "lateness";
                                                                        if (t.isReason) {
                                                                            t.cssClass = "iAuthLate";
                                                                            N.authLate.push(t);
                                                                        } else {
                                                                            t.cssClass = "iUnauthLate";
                                                                            N.unauthLate.push(t);
                                                                        }
                                                                    } else {
                                                                        t.eventType = "absence";
                                                                        if (t.isReason) {
                                                                            t.cssClass = "iAuthAbsences";
                                                                            O.authAbsences.push(t);
                                                                        } else {
                                                                            t.cssClass = "iUnauthAbsences";
                                                                            O.unauthAbsences.push(t);
                                                                        }
                                                                    }
                                                                    F.push(t);
                                                                }
                                                            } catch (I) {
                                                                log("JSON PARSE ERROR");
                                                            }
                                                        }
                                                        G.absencesObj = O;
                                                        G.latenessesObj = N;
                                                        if (G.absencesObj != null && G.absencesObj.unauthAbsences != null) {
                                                            G.absencesObj.unauthAbsences.sort(sortByEventDatesDesc);
                                                        }
                                                        if (G.absencesObj != null && G.absencesObj.authAbsences != null) {
                                                            G.absencesObj.authAbsences.sort(sortByEventDatesDesc);
                                                        }
                                                        if (G.latenessesObj != null && G.latenessesObj.unauthLate != null) {
                                                            G.latenessesObj.unauthLate.sort(sortByEventDatesDesc);
                                                        }
                                                        if (G.latenessesObj != null && G.latenessesObj.authLate != null) {
                                                            G.latenessesObj.authLate.sort(sortByEventDatesDesc);
                                                        }
                                                        G.absenceFeedListEvents = F;
                                                        G.absenceFeedListEvents.sort(sortByEventDatesDesc);
                                                        B.push(G);
                                                    }
                                                });
                                                pmaindashPH.dashRetObj = g;
                                                var m = pmaindashPH.dashRetObj;
                                                if (m.todoSummaryMap != null) {
                                                    m.todoSummaryList = [];
                                                    var C = chelperPH.getDate(f);
                                                    var p = chelperPH.getDate(f);
                                                    var w = 1;
                                                    if (C.getDay() == 5) {
                                                        w = 4;
                                                    } else {
                                                        if (C.getDay() == 6) {
                                                            w = 3;
                                                        } else {
                                                            if (C.getDay() == 0) {}
                                                        }
                                                    }
                                                    p.setDate(C.getDate() + w);
                                                    var z = $H();
                                                    var k = null;
                                                    var j = $H(m.todoInstTrpMap);
                                                    $H(m.todoSummaryMap).each(function(F) {
                                                        var E = false;
                                                        var G = null;
                                                        if (G == null && (b == CONTEXT.ME || b == CONTEXT.THIRD)) {
                                                            if (guserPH.user.id == F.key) {
                                                                G = {};
                                                                G.id = guserPH.user.id;
                                                                G.name1 = guserPH.user.name1;
                                                                G.person = {
                                                                    "id": guserPH.user.id
                                                                };
                                                                E = true;
                                                            } else {
                                                                G = guserPH.userGetRoleById(F.key);
                                                                if (G == null) {
                                                                    var K = guserPH.userGetChildren(F.key);
                                                                    if (K.size() > 0) {
                                                                        G = K[0];
                                                                    }
                                                                } else {
                                                                    E = true;
                                                                }
                                                            }
                                                        }
                                                        if (G == null) {
                                                            var K = guserPH.getStudents(a, pmainPH.person.roles);
                                                            if (K != null && K.size() > 0) {
                                                                K.each(function(i) {
                                                                    if (F.key == i.id) {
                                                                        G = i;
                                                                    }
                                                                });
                                                            }
                                                        }
                                                        if (G != null) {
                                                            var L = j.get(G.id);
                                                            var I = $H();
                                                            if (L != null) {
                                                                for (var H = 0; H < L.size(); H++) {
                                                                    I.set(L[H].todoInstitutionId, L[H]);
                                                                }
                                                            }
                                                            var M = $H();
                                                            $A(F.value).each(function(P) {
                                                                var O = null;
                                                                if (P.todoPerson != null) {
                                                                    O = P.todoPerson;
                                                                    O.isDone = P.isDone;
                                                                    O.isPersonal = true;
                                                                    O.trpId = P.id;
                                                                } else {
                                                                    if (P.todoInterview != null) {
                                                                        O = P.todoInterview;
                                                                        O.isDone = P.isDone;
                                                                        O.isInterview = true;
                                                                        O.trpId = P.id;
                                                                    } else {
                                                                        O = P;
                                                                        var N = I.get(O.id);
                                                                        O.isDone = (N != null) ? N.isDone : false;
                                                                        O.trpId = (N != null) ? N.id : null;
                                                                    }
                                                                }
                                                                if (O.deadline != null && C.getTime() <= date2Long(O.deadline)) {
                                                                    var Q = O.deadline;
                                                                    if (f == O.deadline) {
                                                                        Q = "today";
                                                                    } else {
                                                                        if (p.getTime() >= date2Long(O.deadline)) {
                                                                            Q = "soon";
                                                                        } else {
                                                                            if (p.getTime() < date2Long(O.deadline)) {
                                                                                Q = "future";
                                                                            }
                                                                        }
                                                                    }
                                                                    var i = M.get(Q);
                                                                    if (i != null) {
                                                                        i.push(O);
                                                                    } else {
                                                                        i = [O];
                                                                    }
                                                                    M.set(Q, i);
                                                                }
                                                            });
                                                            var J = {};
                                                            J.personName = pmaindashPH.getHtmlForPersonName(G);
                                                            J.personData = G.person;
                                                            J.isMine = E;
                                                            M.each(function(O) {
                                                                var N = {};
                                                                N.todoCount = 0;
                                                                N.testCount = 0;
                                                                N.personalCount = 0;
                                                                N.interviewCount = 0;
                                                                N.isMine = E;
                                                                N.roleId = G.id;
                                                                N.todos = O.value.sort(sortByEventDatesAsc);
                                                                O.value.each(function(P) {
                                                                    if (P.isTest) {
                                                                        N.testCount++;
                                                                    } else {
                                                                        if (P.isPersonal) {
                                                                            if (!P.isDone) {
                                                                                N.personalCount++;
                                                                            }
                                                                        } else {
                                                                            if (P.isInterview) {
                                                                                if (P.isDone) {
                                                                                    N.interviewCount++;
                                                                                }
                                                                            } else {
                                                                                N.todoCount++;
                                                                            }
                                                                        }
                                                                    }
                                                                });
                                                                var i = pmaindashPH.getHtmlForPersonName(G);
                                                                N.name = "";
                                                                if (O.key == "today") {
                                                                    N.deadline = O.key;
                                                                    N.isFuture = false;
                                                                    J.todayObj = N;
                                                                } else {
                                                                    if (O.key == "soon") {
                                                                        N.deadline = O.key;
                                                                        N.isFuture = false;
                                                                        J.soonObj = N;
                                                                    } else {
                                                                        if (O.key == "future") {
                                                                            N.deadline = O.key;
                                                                            N.isFuture = true;
                                                                            J.futureObj = N;
                                                                        }
                                                                    }
                                                                }
                                                            });
                                                            if (J.isMine) {
                                                                k = J;
                                                            } else {}
                                                            if (J.futureObj != null || J.soonObj != null || J.todayObj != null) {
                                                                m.todoSummaryList.push(J);
                                                            }
                                                        }
                                                    });
                                                }
                                                if (b == CONTEXT.SCHOOL) {
                                                    pmaindashPH.isFormMaster = m.isFormMaster;
                                                }
                                                pmaindashPH.dashRightContent();
                                                pmaindashPH.showFilter(d);
                                                if (d == null) {
                                                    d = DASH_FILTER.ALL;
                                                }
                                                hideLoadingIndicator("personDatamaincontent");
                                                pmaindashPH.dashRetObj.feedList = pmaindashPH.dashArr;
                                                pmaindashPH.dashRetObj.absenceFeedList = B;
                                                pmaindashPH.dashRetObj.absenceFeedNames = D;
                                                pmaindashPH.drawDashData(pmaindashPH.dashRetObj, d, null);
                                                if ($$(".iTodofeed")) {
                                                    $$(".iTodofeed").invoke("remove");
                                                }
                                                if ($$(".iAbsencefeed")) {
                                                    $$(".iAbsencefeed").invoke("remove");
                                                }
                                                var r = TemplateEngine.parseById("hidden_dash_template_todo_summary", {
                                                    "todoSummaryList": pmaindashPH.dashRetObj.todoSummaryList,
                                                    "context": pmaindashPH.context,
                                                    "pagePersonId": pmaindashPH.personId
                                                });
                                                if ($("person_quick_ref_section_ph")) {
                                                    $("person_quick_ref_section_ph").insert({
                                                        before: r
                                                    });
                                                } else {
                                                    $("person_filter").insert({
                                                        before: r
                                                    });
                                                }
                                                var l = false;
                                                if (pmaindashPH.dashRetObj.todoSummaryList != null && pmaindashPH.dashRetObj.todoSummaryList.size() > 0) {
                                                    l = true;
                                                }
                                                var r = TemplateEngine.parseById("hidden_dash_template_absences_summary", {
                                                    "absenceFeedList": pmaindashPH.dashRetObj.absenceFeedList,
                                                    "absenceFeedNames": pmaindashPH.dashRetObj.absenceFeedNames
                                                });
                                                if ($("person_quick_ref_section_ph")) {
                                                    $("person_quick_ref_section_ph").insert({
                                                        before: r
                                                    });
                                                } else {
                                                    $("person_filter").insert({
                                                        before: r
                                                    });
                                                }
                                                var A = $("person_quick_ref_section");
                                                if (!l) {
                                                    if ((pmaindashPH.dashRetObj.absenceFeedList != null && pmaindashPH.dashRetObj.absenceFeedList.size() > 0) || (pmaindashPH.dashRetObj.absenceFeedNames != null && pmaindashPH.dashRetObj.absenceFeedNames.keys() != null && pmaindashPH.dashRetObj.absenceFeedNames.keys().size() > 0)) {
                                                        l = true;
                                                    }
                                                }
                                                if ($("person_quick_ref_section") != null) {
                                                    if (l) {
                                                        A.show();
                                                    } else {
                                                        A.show();
                                                        var r = '<ul class="feed">' + '<li><div class="nocontent"><p>Данные отсутствуют</p></div></li>' + "</ul>";
                                                        $("person_quick_ref_section_ph").insert(r);
                                                    }
                                                }
                                                if (pmaindashPH.context == CONTEXT.ME || pmaindashPH.context == CONTEXT.THIRD) {
                                                    pmaindashPH.getQRStates();
                                                }
                                            });
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
    drawDashData: function(c, a, b) {
        ccachePH.getToday(function(e) {
            var d = TemplateEngine.parseById("hidden_dash_template_feed", {
                "arr": c.feedList,
                "isFormMaster": false,
                "currentFilterId": a,
                "instId": 0,
                "context": pmaindashPH.context
            });
            $("person_leftcontent").update(d);
            if (a == DASH_FILTER.GRADES) {
                pgradesPH.initGradesData(pmainPH.context, pmainPH.person, pmainPH.journalId);
                feedPH.displayGradesFilter(pmainPH.context, pgradesPH.students);
            } else {
                if ($$(".iGradesFilter")) {
                    $$(".iGradesFilter").invoke("remove");
                }
            }
            if (a == DASH_FILTER.EVENTS) {
                feedPH.showEventFeedFilter(pmainPH.context, null, null);
            } else {
                if ($$(".iEventsFilter")) {
                    $$(".iEventsFilter").invoke("remove");
                }
            }
            if (a == DASH_FILTER.BLOG) {
                feedPH.showBlogFeedFilter(pmainPH.context);
            } else {
                if ($$(".iBlogFeedFilter")) {
                    $$(".iBlogFeedFilter").invoke("remove");
                }
            }
            if ($("discipline_sheet_view_data_ph")) {
                pmaindashPH.showPersonDisciplineApp(pmaindashPH.currDisciplineAppPersonId);
            }
            if ($("dash_events_sheet_view_data_ph")) {
                feedPH.showPersonEventsApp(pmaindashPH.currEventsAppStudentId);
            }
        });
    },
    showPersonDisciplineApp: function(a) {
        pmaindashPH.currDisciplineAppPersonId = a;
        disciplineManager.getDiscipline(pmainPH.context, a, {
            callback: function(b) {
                $LAB.script(chelperPH.resourcedir + "c/app/js/cappPH.js").wait(function() {
                    cappPH.initAppV2(APP_LAYOUT.SIMPLE, "", {}, function() {
                        pmaindashPH.initPersonDisciplineData(b.returnObject);
                        pmaindashPH.loadDashCallback(b.returnObject, null, DASH_FILTER.ALL, function(d) {
                            var c = TemplateEngine.parseById("hidden_dash_discipline_sheet_view", null);
                            $("appContent").update(c);
                            pmaindashPH.drawDiscipline(d);
                            hideLoadingIndicator("personDatamaincontent");
                        });
                    });
                });
            }
        });
    },
    initPersonDisciplineData: function(a) {
        if (pmaindashPH.dashRetObj == null) {
            pmaindashPH.dashRetObj = {};
        }
        pmaindashPH.dashRetObj.remarkList = a.remarkList;
        pmaindashPH.dashRetObj.absenceEventList = a.absenceEventList;
        pmaindashPH.dashRetObj.lateEventList = a.lateEventList;
        pmaindashPH.dashRetObj.parentAbsenceNoteList = a.parentAbsenceNoteList;
        pmaindashPH.dashRetObj.absenceReasonList = a.absenceReasonList;
    },
    drawDiscipline: function(a) {
        ccachePH.getToday(function(e) {
            if (a.length > 0) {
                var f = guserPH.userGetChildren();
                var b = [];
                if (f != null && f.size() > 0) {
                    for (var d = 0; d < f.size(); d++) {
                        b.push(f[d].id);
                    }
                }
                var g = false;
                if (pmainPH.context == CONTEXT.SCHOOL) {
                    g = pmaindashPH.isFormMaster;
                }
                ccachePH.homeworkPriorityList(function(h) {
                    ptasksPH.homeworkPriorityMap = h;
                    var i = TemplateEngine.parseById("hidden_dash_template_date_feeds_v2_content", {
                        "dateList": a,
                        "priorityList": h,
                        "childrenStudentMemberIdList": b,
                        "isFormMaster": g,
                        "currentFilterId": DASH_FILTER.DISCIPLINE,
                        "instId": pmaindashPH.instId,
                        "personId": pmaindashPH.personId,
                        "strToday": e,
                        "context": pmaindashPH.context
                    });
                    if ($("discipline_sheet_view_data_ph") != null) {
                        $("discipline_sheet_view_data_ph").update(i);
                    } else {
                        $("person_leftcontent").update(i);
                    }
                });
            } else {
                var c = TemplateEngine.parseById("hidden_dash_template_date_feeds_v2_nocontent", null);
                if ($("discipline_sheet_view_data_ph") != null) {
                    $("discipline_sheet_view_data_ph").update(c);
                } else {
                    $("person_leftcontent").update(c);
                }
            }
        });
    },
    byEventTimeSort: function(d, c) {
        var f = parseInt(d.eventTime);
        var e = parseInt(c.eventTime);
        if (!f) {
            f = 0;
        }
        if (!e) {
            e = 0;
        }
        if (f < e) {
            return 1;
        } else {
            if (f > e) {
                return -1;
            }
        }
        return 0;
    },
    toggleElement: function(b, a) {
        if (a) {
            $(b).removeClassName("open");
            $(b).addClassName("close");
            return true;
        } else {
            $(b).addClassName("open");
            $(b).removeClassName("close");
        }
        return false;
    },
    showFileManager: function(a) {
        showLoadingIndicator();
        var b = pmaindashPH.context ? pmaindashPH.context : CONTEXT.ME;
        $LAB.script(chelperPH.resourcedir + "p/fileManager/js/fileManagerPH.js").wait(function() {
            fileManagerPH.show(b, FILEMANAGER_FILTERNAME.DASH);
        });
    },
    showInterview: function() {
        showLoadingIndicator();
        $LAB.script(chelperPH.resourcedir + "p/inter/js/pinterPH.js").wait(function() {
            pinterPH.show();
            hideLoadingIndicator();
        });
    },
    showPersonStudyBook: function() {
        $("personDatainsert").update("");
        showLoadingIndicator();
        $LAB.script(chelperPH.resourcedir + "p/main/js/personStudyBookPH.js").wait(function() {
            personStudyBookPH.show();
            hideLoadingIndicator();
        });
    },
    showPopipatrull: function() {
        showLoadingIndicator();
        $LAB.script(chelperPH.resourcedir + "p/popiss/js/popissPH.js").wait(function() {
            popissPH.show();
            hideLoadingIndicator();
        });
    },
    showTasks: function() {
        showLoadingIndicator();
        $LAB.script(chelperPH.resourcedir + "p/tasks/js/ptasksPH.js").wait(function() {
            ptasksPH.show(TASKS_VIEWNAME.WEEK, null, null, null, TASKS_FILTERNAME.DASH_STUDENT);
            hideLoadingIndicator();
        });
    },
    redirectToGradeReport: function(b, f) {
        var e = null;
        if (pmaindashPH.context == CONTEXT.ME) {
            for (var c = 0; c < guserPH.user.allAvailableRoles.size(); c++) {
                var d = guserPH.user.allAvailableRoles[c];
                if (d instanceof ee.ekool.model.roles.Student && b == d.id) {
                    e = (d.person != null) ? d.person.id : null;
                } else {
                    if (d instanceof ee.ekool.model.roles.Parent && d.student.person != null && d.student.person.id != null && (b == d.student.id || b == d.student.person.id)) {
                        e = d.student.person.id;
                    }
                }
            }
        } else {
            if (pmaindashPH.context == CONTEXT.THIRD) {
                pmaindashPH.showReports(f);
            }
        }
        if (e != null) {
            var a = "?screenId=u.main.showperson&personId=" + e + "&gradesreport=true";
            if (f != null) {
                a += "&activereportid=" + f;
            }
            SWFAddress.setValue(a);
        } else {
            return false;
        }
    },
    getQRStates: function() {
        var b = pmaindashPH.dashRetObj.todoSummaryList,
            a = pmaindashPH.dashRetObj.absenceFeedList;
        userUiPreferencesManager.getUserPrefs(function(e) {
            var c = e.returnObject.qrStates;
            if (c !== null) {
                if (a.size() > 0) {
                    if (c.absenceBlock) {
                        var d = $("absBlock");
                        if (d) {
                            d.select("ul").invoke("show");
                            d.up("li").removeClassName("closed");
                            $("absenceBtn").writeAttribute("open", String(c.absenceBlock));
                        }
                    }
                }
                if (b.size() > 0 && c.todoBlock) {
                    c.todoBlock.each(function(f) {
                        if (f.state) {
                            var g = $("todo" + f.personId);
                            if (g) {
                                g.select("ul").invoke("show");
                                g.up("li").removeClassName("closed");
                                $("todoBtn" + f.personId).writeAttribute("open", String(f.state));
                            }
                        }
                    });
                }
            }
        });
    },
    updateQRStates: function(b, d, e) {
        var c = (b.readAttribute("open") === "true") ? true : false,
            a = e || pmaindashPH.personId;
        b.writeAttribute("open", String(!c));
        userUiPreferencesManager.updateQRStates(Number(a), d, !c, function(f) {});
    },
    checkIfHarIDuserHasNewRoles: function() {
        var c = getCookie("harIDcheck");
        if (typeof c === "undefined" || c != "checked") {
            var b = guserPH.user.personId;
            var e = null;
            var d = null;
            var a = null;
            userAccountManager.getHarIDRoles(b, {
                callback: function(h) {
                    var g = h.returnObject;
                    setSessionCookie("harIDcheck", "checked");
                    if (g && g.length > 0) {
                        for (var i = 0; i < g.length; i++) {
                            var f = g[i];
                            if (f.roleType == "student") {
                                f.reqTypeId = REQUEST_TYPES.LEARNING;
                                f.harIdState = HAR_ID_STATES.REQUEST_ACCESS;
                                f.ekoolRole = ROLES.STUDENT;
                            } else {
                                if (f.roleType == "faculty") {
                                    f.reqTypeId = REQUEST_TYPES.STAFF_REG;
                                    f.harIdState = HAR_ID_STATES.REQUEST_ACCESS;
                                    f.ekoolRole = ROLES.TEACHER;
                                }
                            }
                        }
                        pmaindashPH.showHarIdNewRolesModal(g);
                        console.log(g);
                    }
                }
            });
        }
    },
    showHarIdNewRolesModal: function(a) {
        clayoutPH.initMMModalDialog({
            hasCloseButton: true,
            preferredWidth: 620,
            innerPadding: 0
        });
        var b = TemplateEngine.parseById("hidden_dash_harID_roles_modal", {
            "harIDuser": a
        });
        clayoutPH.updateMMModalDialogContent(b);
    },
    directToSchoolAdmissionForm: function(b, a) {
        clayoutPH.closeMMModalDialog();
        showLoadingIndicator();
        if (guserPH.isSufficientProfileForRequest()) {
            SWFAddress.setValue("?screenId=g.mainv2.showJoin&groupId=" + a + "&requestTypeId=" + b);
        } else {
            pmaindashPH.showInsufficientProfileMessage();
        }
        hideLoadingIndicator();
    },
    discardHarIdConnection: function(a) {
        log(a + " loobun rollist");
        userAccountManager.denyFromRequestProposal(a, {
            callback: function(c) {
                var b = $("harID_roles_modal").getElementsByTagName("li");
                var e = true;
                for (var d = 0; d < b.length; d++) {
                    if (b[d].style.display == "block") {
                        e = false;
                    }
                    if (e) {
                        clayoutPH.closeMMModalDialog();
                    }
                }
            }
        });
    },
    showInsufficientProfileMessage: function() {
        $LAB.script(chelperPH.resourcedir + "e/main/js/emainPH.js").wait(function() {
            var b = false;
            var c = false;
            if (guserPH.user.personAddressesCount > 0) {
                c = true;
            }
            if (guserPH.user.name1.length > 0 && guserPH.user.name2.length > 0 && (guserPH.user.gender == 0 || guserPH.user.gender == 1) && guserPH.user.idCode != null && guserPH.user.idCode.length > 0 && guserPH.user.birthDay != null && guserPH.user.birthDay.length > 4 && guserPH.user.idIssuedBy > 0) {
                b = true;
            }
            var a = "";
            var d = "";
            if (!c && !b) {
                a = "Пожалуйста, заполните свой профиль!";
                d = '<a href="#" onclick="emainPH.goToProfile();return false;">' + '<span class="FCred">Личный код, имя, пол, день рождения и адрес должны быть введены! </span>Нажмите сюда, чтобы продолжить.' + "</a>";
            } else {
                if (!c && b) {
                    a = "Пожалуйста, укажите Ваш контактный адрес";
                    d = '<a href="#" onclick="emainPH.goToContacData();return false;">' + '<span class="FCred">Ваш контактный адрес должен быть введен! </span>Нажмите сюда, чтобы продолжить.' + "</a>";
                } else {
                    if (c && !b) {
                        a = "Пожалуйста, заполните свой профиль!";
                        d = '<a href="#" onclick="emainPH.goToProfile();return false;">' + '<span class="FCred">Ваш личный код, имя, пол, день рождения должны быть введены! </span>Нажмите сюда, чтобы продолжить.' + "</a>";
                    }
                }
            }
            hideLoadingIndicator();
            chelperPH.showProfileNotReadyError(a, d);
        });
    }
};