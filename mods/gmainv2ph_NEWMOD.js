var u = guserPH.user;
var allroles = [1, 2, 3, 4, 5, 6, 7, 10, 11, 20, 21, 22, 23];
var srr = new ee.ekool.model.roles.Staff;
srr.id = u.id;
srr.person = u.person;
srr.institution = u.institution;
srr.instanceClass = u.instanceClass;
var trr = new ee.ekool.model.roles.Teacher;
trr.id = u.id;
trr.person = u.person;
trr.institution = u.institution;
trr.instanceClass = u.instanceClass;
guserPH.userAccountTypes = function(){return allroles;}
guserPH.user.allAvailableRoles.push(srr);
guserPH.user.allAvailableRoles.push(trr);
guserPH.getAccountType = function(){return ROLES.ADMIN}
guserPH.isStaffRole = function(){return true;}
guserPH.isFormMaster = function(){return true;}
guserPH.isHeadmaster = function(){return true;}
guserPH.getRoles = function(){return allroles}
guserPH.getActiveTeacherRoles = function(){return [trr]}
guserPH.getActiveStaffRoles = function(){return [srr]}
gmainv2PH.getMenuItemsPermissions = function() {
    var a = {"requests": true,"timetable": true"timetableAdmin": true,"reports": true,"fa": true,"recordBook": true,"interview": true,"interviewDemo": true,"descisions": true,"schoolyear": true,"recources": true,"curriculum": true,"gradesTransfer": true,"classificators": true,"addmission": true,"discipline": true,"fullDiscipline": true,"gradesTransferAdmin": true,"superAdminTool": true,"ads": true,"cafeteria": true,"devCardsTemplates": true,};
    gmainv2PH.permissions = a;
    return a;
}
//rolesPH.isAdmin = true;
//rolesPH.accountTypes = allroles;
/*if(wpRep){
  guserPH.getMasteredClasses = function(){return wpRep.masteredClasses;}
}*/
