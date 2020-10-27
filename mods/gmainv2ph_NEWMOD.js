var allroles = [1, 2, 3, 4, 5, 6, 7, 10, 11, 20, 21, 22, 23];
guserPH.userAccountTypes = function(){return allroles;}
guserPH.getAccountType = function(){return allroles;}
guserPH.isStaffRole = function(){return true;}
guserPH.isFormMaster = function(){return true;}
guserPH.isHeadmaster = function(){return true;}
guserPH.getRoles = function(){[allroles]}
guserPH.getActiveTeacherRoles = function(){return [gmainv2PH.groupObj]}
guserPH.getActiveStaffRoles = function(){return [gmainv2PH.groupObj]}
/*if(wpRep){
  guserPH.getMasteredClasses = function(){return wpRep.masteredClasses;}
}*/
