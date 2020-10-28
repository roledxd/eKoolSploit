var u = guserPH.user;
var allroles = [1, 2, 3, 4, 5, 6, 7, 10, 11, 20, 21, 22, 23];
var srr = new ee.ekool.model.roles.Staff;
srr.id = u.id;
var trr = new ee.ekool.model.roles.Teacher;
trr.id = u.id;
guserPH.userAccountTypes = function(){return allroles;}
guserPH.getAccountType = function(){return ROLES.ADMIN}
guserPH.isStaffRole = function(){return true;}
guserPH.isFormMaster = function(){return true;}
guserPH.isHeadmaster = function(){return true;}
guserPH.getRoles = function(){return allroles}
guserPH.getActiveTeacherRoles = function(){return [trr]}
guserPH.getActiveStaffRoles = function(){return [srr]}
/*if(wpRep){
  guserPH.getMasteredClasses = function(){return wpRep.masteredClasses;}
}*/
