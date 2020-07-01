//These lines gives you access to admin-buttons on the school page:
gmainv2PH.getMenuItemsPermissions = function() {
  var a = {
    "requests": true,"timetable": true"timetableAdmin": true,
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
}



