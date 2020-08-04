var cappPH = {
    addMenuArr: $A(),
    searchHandlerCallback: null,
    tree: null,
    targetDivId: "appnav_scroll",
    menuItemAddToParentId: null,
    menuItemAddTxt: null,
    menuItemAddCb: null,
    proccessActive: null,
    _searchActivateCheck: false,
    _toolbarActArr: $A(),
    _toolbarActCb: null,
    _toolbarDDArr: $A(),
    _useButtons: false,
    _toolbarDDActCb: null,
    _appHeadTxt: "",
    _lastSelType: null,
    isRefreshGroupPage: false,
    isRefreshDash: false,
    _submenu: null,
    _onCloseCb: null,
    doGroupRefresh: function() {
        cappPH.isRefreshGroupPage = true;
    },
    doDashRefresh: function() {
        cappPH.isRefreshDash = true;
    },
    initAppV2: function(d, b, c, a) {
        cappPH.isRefreshGroupPage = false;
        cappPH.isRefreshDash = false;
        this.targetDivId = "appnav_scroll";
        this._appLayout = d;
        this._appHeadTxt = b || "";
        this._useButtons = c.useButtons;
        this._useFilter = c.useFilter;
        this._useSearch = c.useSearch;
        if (this._useSearch) {
            this._useFilter = true;
        }
        this._toolbarActCb = c.toolbarActCb;
        this._toolbarActArr = c.toolbarActArr;
        this._toolbarActSel = c.toolbarActSel;
        this._toolbarDDActCb = c.toolbarDDActCb;
        this._toolbarDDArr = c.toolbarDDArr;
        this._toolbarDDSel = c.toolbarDDSel;
        this._filterDDArr = c.filterDDArr;
        this._onCloseCb = c.onCloseCb;
        this._submenu = c.submenu;
        this._insert = c.insert;
        if (this._useSearch == true) {
            this._useFilter = true;
        }
        chelperPH.loadTemplateHidd(chelperPH.resourcedir + "c/app/tpl/app_tpl.html", function() {
            var g = "",
                i = "",
                f = false,
                e = document.body;
            var j = (this._insert) ? this._insert : e;
            var f = (j == e) ? true : false;
            if (this._toolbarActCb != null) {
                g = TemplateEngine.parseById("hidden_c_app_toolbar_act", {
                    "arr": this._toolbarActArr,
                    "sel": this._toolbarActSel,
                });
            }
            if ((g != "") || (i != "")) {
                this._useFilter = true;
            }
            var h = TemplateEngine.parseById("hidden_c_app_two", {
                "appLayout": cappPH._appLayout,
                "appHeadTxt": this._appHeadTxt,
                "useFilter": this._useFilter,
                "useButtons": this._useButtons,
                "useModalView": f
            });
            if ($("overlay")) {
                $("overlay").remove();
            }
            if ($("modal")) {
                $("modal").remove();
            }
            if (f) {
                $(e).addClassName("appactive");
                $(j).insert(h);
            } else {
                $(j).update(h);
            }
            if (f) {
                $(e).removeClassName("v2");
                $(e).addClassName("appactive");
                $("maincontainer").removeClassName("active");
                $("maincontainer").addClassName("passive");
            }
            if (typeof c.makeJournalHeaderSticky !== "undefined") {
                makeJournalHeaderSticky();
            }
            if (typeof c.makeJournalGridObserver !== "undefined") {
                makeJournalGridObserver();
            }
            if ((this._toolbarActCb == null) && (!this._useSearch)) {
                chelperPH.callcode(a);
            } else {
                if (cappPH._toolbarActSel) {
                    cappPH._lastSelType = this._toolbarActSel;
                }
                if (!cappPH._useFilter) {
                    chelperPH.callcode(a);
                } else {
                    cappPH.setCols(true, a);
                }
            }
            Event.observe(document.body, "keydown", clayoutPH.MMModalDialog_handle_keydown);
            if (f) {
                touchscreenModalFix(true);
            }
        }.bind(this));
    },
    initTree: function(f, e, b, d, c, a) {
        $LAB.script(chelperPH.resourcedir + "c/tree/js/ctreev2PH.js").wait(function() {
            this.addMenuArr = $A();
            if (d == null) {
                d = "";
            }
            this.menuItemAddToParentId = d;
            this.menuItemAddTxt = c;
            this.menuItemAddCb = b;
            this.searchHandlerCallback = null;
            this.treeMode = f;
            this.formMode = e;
            ctreev2PH.initTree(this.treeMode, function() {
                chelperPH.callcode(a);
            }.bind(this));
        }.bind(this));
    },
    filterDDShow: function(a, b) {
        this.cfilterPH.filterDDShow(a, b);
    },
    toolbarFilterHandler: function(b, a) {
        if (cappPH.proccessActive != null) {
            cappPH.actionMenuProcessCancel();
        }
        cappPH.searchActivate(a);
    },
    toolbarActHandler: function(c, b, a, e) {
        if (cappPH.proccessActive != null) {
            cappPH.actionMenuProcessCancel();
        }
        var d = chelperPH.arrFindById(c, cappPH._toolbarActArr);
        chelperPH.applycode(cappPH._toolbarActCb, [d, b, a, e]);
        cappPH._lastSelType = c;
    },
    toolbarActClick: function(b) {
        $("c_app_toolbar_act_item_" + b).up("ul").select("a.selected").invoke("removeClassName", "selected");
        $("c_app_toolbar_act_item_" + b).addClassName("selected");
        var a = chelperPH.arrFindById(b, this._toolbarActArr);
        chelperPH.callcode(this._toolbarActCb, a);
    },
    toolbarDDClick: function(b) {
        var a = null;
        if (b == false) {
            a = chelperPH.arrFindById($F($("c_app_toolbar_dd")), this._toolbarDDArr);
        } else {
            a = new Object();
        }
        chelperPH.callcode(this._toolbarDDActCb, a);
    },
    toolbarDDChange: function() {
        var a = chelperPH.arrFindById($F($("c_app_toolbar_dd")), this._toolbarDDArr);
        chelperPH.callcode(this._toolbarDDCb, a);
    },
    toolbarDDUpdate: function(c, b) {
        var a = chelperPH.getIndexOfObjById(c, this._toolbarDDArr);
        if (a < 0) {
            this._toolbarDDArr.push(c);
        }
        if (a >= 0) {
            if (b) {
                this._toolbarDDArr.splice(a, 1);
            } else {
                this._toolbarDDArr.splice(a, 1, c);
            }
        }
        HTMLdd = TemplateEngine.parseById("hidden_c_app_toolbar_dd", {
            "arr": this._toolbarDDArr,
            "sel": c.id
        });
        $("c_app_filtertabs_right").update(HTMLdd);
        this.toolbarDDChange();
    },
    setMenuItemAddFormCb: function(a) {
        this.menuItemAddFormCb = a;
    },
    draw: function(a, b) {
        if (a == null) {
            a = 1;
        }
        this.drawTree(a);
        if (b) {
            ctreev2PH.menuItemClickByObj(b);
        } else {
            ctreev2PH.menuItemClickFirst();
        }
    },
    drawTree: function(a) {
        var c = ctreev2PH.search(null, a);
        var b = (cappPH._appLayout === APP_LAYOUT.INCONTENT) ? "_incontent" : "";
        if ($("appnav_scroll" + b)) {
            $("appnav_scroll" + b).update("");
        }
        $(this.targetDivId).insert(c);
    },
    actionMenuAddItem: function(d, c, b) {
        var a = new Object();
        a.id = this.addMenuArr.length;
        a.cb = d;
        a.name = c;
        a.enabledLevel = b;
        this.addMenuArr.push(a);
    },
    actionMenuAddActivate: function() {
        if (this.proccessActive == null) {
            if ($("appMenuBtns")) {
                $("appMenuBtns").hide();
            }
            ctreev2PH.menuItemAdd(this.menuItemAddToParentId, this.menuItemAddTxt);
            this.proccessActive = 0;
            chelperPH.callcode(this.menuItemAddFormCb);
            if (this.menuItemAddTxt != null) {
                chelperPH.callcode(this.menuItemAddCb);
            }
        } else {
            this.actionMenuProcessCancel();
        }
    },
    actionMenuAddDone: function(a) {
        this.proccessActive = null;
        ctreev2PH.menuItemAddDone(a);
    },
    actionMenuProcessCancel: function() {
        if (this.proccessActive == 0) {
            ctreev2PH.menuItemAddClear();
            $("appContent").update("");
        } else {
            if (this.proccessActive == 1) {
                ctreev2PH.menuItemAddClear();
            }
        }
        ctreev2PH.menuItemClickFirst();
        this.proccessActive = null;
    },
    actionMenuDelActivate: function() {
        if (this.proccessActive == null) {
            if ($("appMenuBtns")) {
                $("appMenuBtns").hide();
            }
            ctreev2PH.menuItemDel();
        } else {
            if (this.proccessActive == 0) {
                this.actionMenuProcessCancel();
            }
        }
    },
    actionMenuChangeActivate: function() {
        if (this.proccessActive == null) {
            if ($("appMenuBtns")) {
                $("appMenuBtns").hide();
            }
            if (this.formMode == 1) {
                ctreev2PH.menuItemChange();
                this.proccessActive = 1;
            } else {
                ctreev2PH.menuItemClickCurrent(true);
            }
        } else {
            this.actionMenuProcessCancel();
        }
    },
    actionMenuChangeNameDone: function(a) {
        this.proccessActive = null;
        ctreev2PH.menuItemChangeDone(a);
    },
    menuItemChangeDoneObj: function(a) {
        this.proccessActive = null;
        ctreev2PH.menuItemChangeDoneObj(a);
    },
    actionMenuDelDone: function() {
        this.proccessActive = null;
        ctreev2PH.menuItemDelDone();
    },
    searchActivate: function(a) {
        if (this.searchHandlerCallback != null) {
            chelperPH.callcode(this.searchHandlerCallback, a);
        } else {
            if ($("c_tree")) {
                $("c_tree").remove();
            }
            $(this.targetDivId).insert(ctreev2PH.search(a));
        }
    },
    searchSetHandler: function(a) {
        this.searchHandlerCallback = a;
    },
    treeArrAdd: function(b, e, c, a, d) {
        ctreev2PH.arrAdd(b, e, c, a, d);
    },
    treeArrClear: function() {
        ctreev2PH.arrClear();
    },
    menuItemClick: function(a) {
        if (this.proccessActive != null) {
            this.actionMenuProcessCancel();
        }
        if ($("appMenuBtns")) {
            $("appMenuBtns").hide();
        }
        ctreev2PH.menuItemClick(a);
    },
    menuItemFormSave: function(a) {
        var b = $("c_tree_app_item_form").getData();
        ctreev2PH.menuItemFormSave(a);
        if (a == "") {
            if (this.menuItemAddCb != null) {
                chelperPH.callcode(this.menuItemAddCb, b.name);
            }
        }
    },
    closeApp: function() {
        if ($("ie_focus_1")) {
            $("ie_focus_1").focus();
        }
        if (cappPH.isRefreshGroupPage) {
            var a = guserPH.getSelectedInstitutionId();
            if (a != null) {
                ccachePH.groupObjEmpty(a);
                guserPH.activateGroup(a);
                gmainv2PH.show(a);
            }
        }
        if (cappPH.isRefreshDash) {
            if (pmaindashPH != null) {
                pmaindashPH.refreshDash();
            }
        }
        cappPH.proccessActive = null;
        if ($("overlay")) {
            $("overlay").remove();
        }
        if ($("modal")) {
            $("modal").remove();
        }
        $(document.body).removeClassName("appactive");
        $(document.body).addClassName("v2");
        $jQ(".toolbar2").removeClass("toolbar");
        clayoutPH.makePageMenuPretty();
        $("maincontainer").removeClassName("passive");
        $("maincontainer").addClassName("active");
        if (cappPH._onCloseCb) {
            chelperPH.callcode(cappPH._onCloseCb);
        }
        touchscreenModalFix();
        clayoutPH.makePageMenuPretty();
        if (typeof googletag.pubads === "function") {
            googletag.pubads().refresh();
        }
    },
    setCols: function(b, a) {
        if ($("appCol2")) {
            $("appCol2").remove();
        }
        if (cappPH._appLayout === APP_LAYOUT.LEFT_THREE_COL || cappPH._appLayout === APP_LAYOUT.LEFT_TWO_COL || cappPH._appLayout === APP_LAYOUT.INCONTENT) {} else {
            if ($("appContent")) {
                $("appContent").remove();
            }
        }
        var d = (cappPH._appLayout === APP_LAYOUT.INCONTENT) ? "_incontent" : "";
        var c = "hidden_c_app_two_cols" + d;
        var e = TemplateEngine.parseById(c, {
            "showCol2": b
        });
        cappPH.targetDivId = "appnav_scroll" + d;
        $("appCol1" + d).insert({
            "bottom": e
        });
        if (cappPH._appLayout === APP_LAYOUT.LEFT_THREE_COL || cappPH._appLayout === APP_LAYOUT.LEFT_TWO_COL || cappPH._appLayout === APP_LAYOUT.INCONTENT) {
            if (cappPH._submenu != null) {
                $("submenu").update(clayoutPH.initSubMenu(cappPH._submenu));
            }
            cappPH.cfilterPH = new cfilterPH(cappPH._toolbarActArr, false, false, cappPH.toolbarActHandler, cappPH._toolbarActSel, null, "appFilters" + d, cappPH._filterDDArr, null, function(f) {
                if ($("appSearch" + d)) {
                    cappPH.cfilterPH = new cfilterPH(null, cappPH._useSearch, false, cappPH.toolbarFilterHandler, cappPH._toolbarActSel, ["Для поиска введи"], "appSearch" + d, null, null, function(g) {
                        if (cappPH._useButtons && $("appSearch" + d)) {
                            cappPH.addButtonShow();
                        }
                        chelperPH.callcode(a);
                    });
                }
            });
        } else {
            cappPH.cfilterPH = new cfilterPH(cappPH._toolbarActArr, cappPH._useSearch, false, cappPH.toolbarActHandler, cappPH._toolbarActSel, ["Для поиска введи"], "appFilters", null, null, function(f) {
                if (cappPH._useButtons && $("appSearch")) {
                    cappPH.addButtonShow();
                }
                chelperPH.callcode(a);
            });
        }
    },
    addButtonShow: function(a) {
        if (typeof a != "undefined") {
            cappPH._submenu = a;
        }
        cappPH.addButtonHide();
        if ($("appSearch")) {
            $("appSearch").insert({
                "top": TemplateEngine.parseById("hidden_c_app_toolbar_add_btn", {
                    "submenu": cappPH._submenu
                })
            });
        }
    },
    addButtonHide: function() {
        if ($("c_app_toolbar_add_btn")) {
            $("c_app_toolbar_add_btn").remove();
        }
    },
    actionMenuSubmenuClick: function(a) {
        $("c_app_toolbar_add_btn_submenu").hide();
        if (cappPH._submenu && cappPH._submenu[a] && cappPH._submenu[a].callback) {
            if (cappPH._submenu[a].newItemParentId > -1) {
                ctreev2PH.menuItemAdd(cappPH._submenu[a].newItemParentId, cappPH._submenu[a].newItemTxt);
            }
            this.proccessActive = 0;
            chelperPH.callcode(cappPH._submenu[a].callback);
        }
    }
};
$EVENT_HANDLERS = $H({
    makeJournalHeaderSticky: [],
    makeJournalGridObserver: []
});
clearEventHandlersForEvent = function(a) {
    if (typeof $EVENT_HANDLERS.get(a) !== "undefined") {
        $EVENT_HANDLERS.get(a).each(function(b) {
            Event.stopObserving(b.target, b.event, b.func);
        });
        $EVENT_HANDLERS.set(a, []);
    }
};
makeJournalHeaderSticky = function() {
    var a = "makeJournalHeaderSticky";
    clearEventHandlersForEvent(a);
    if ($("journalContainerScroll")) {
        $EVENT_HANDLERS.get(a).push({
            target: $("journalContainerScroll"),
            event: "scroll",
            func: makeJournalHeaderStickyEvent
        });
        $EVENT_HANDLERS.get(a).push({
            target: window,
            event: "resize",
            func: makeJournalHeaderStickyEvent
        });
        $EVENT_HANDLERS.get(a).each(function(b) {
            Event.observe(b.target, b.event, b.func);
        });
        makeJournalHeaderStickyEvent();
    }
};
makeJournalHeaderStickyEvent = function() {
    if (!$("journalContainerScroll") || !$("jrnl_prev")) {
        clearEventHandlersForEvent("makeJournalHeaderSticky");
        return;
    }
    var a = $("journalContainerScroll").scrollTop;
    if (a > 0 && $("journalFilterCollapsableDivId").visible()) {
        if (a > $("journalFilterCollapsableDivId").getHeight()) {
            topPosition = a - $("journalFilterCollapsableDivId").getHeight();
        } else {
            topPosition = 0;
        }
    } else {
        topPosition = a;
    }
    if (a > 0) {
        if (a <= $("journalStudentListUl").getHeight()) {
            $("journalHeader").setStyle({
                "top": topPosition + "px"
            });
            $("jrnl_prev").up("div.controls").style.top = ($("journalContainerScroll").getHeight() / 2) + a + "px";
        }
    } else {
        $("jrnl_prev").up("div.controls").style.top = ($("journalContainerScroll").getHeight() / 2) + "px";
        $("journalHeader").writeAttribute("style", "");
    }
};
makeJournalGridObserver = function() {
    var a = "makeJournalGridObserver";
    clearEventHandlersForEvent(a);
    if ($("journalContainerScroll")) {
        $EVENT_HANDLERS.get(a).push({
            target: window,
            event: "resize",
            func: makeJournalGridObserverEvent
        });
        $EVENT_HANDLERS.get(a).each(function(b) {
            Event.observe(b.target, b.event, b.func);
        });
        makeJournalGridObserverEvent();
    }
};
makeJournalGridObserverEvent = function() {
    if (!$("journalContainerScroll")) {
        clearEventHandlersForEvent("makeJournalGridObserver");
        return;
    }
    if ($J().journal && $J().journal.filteredRootEvents && $J().eventData) {
        var a = $J().journal.filteredRootEvents.length;
        for (var c = 0; c < a; c++) {
            var b = $J().journal.filteredRootEvents[c];
            if (typeof($J().eventData.get(b.id)) === "undefined" && $J().isColumnVisible(b.id)) {
                $J().initRootEventChildren(b.id);
            }
        }
    }
};
pupuJukuKeyDownCheck = function(a) {
    if (typeof getCurrentPupuJuku === "function") {
        if (typeof getCurrentPupuJuku() !== "undefined" && getCurrentPupuJuku() != null) {
            getCurrentPupuJuku().keyDownHandler(a);
        } else {
            Event.stopObserving(document, "keydown");
        }
    } else {
        Event.stopObserving(document, "keydown");
    }
};
pupuJukuKeyUpCheck = function(a) {
    if (typeof getCurrentPupuJuku === "function") {
        if (typeof getCurrentPupuJuku() !== "undefined" && getCurrentPupuJuku() != null) {
            getCurrentPupuJuku().modifyListener(a);
        } else {
            Event.stopObserving(document, "keyup");
        }
    } else {
        Event.stopObserving(document, "keyup");
    }
};