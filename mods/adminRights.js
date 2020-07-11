//gives you a blog ability (u can post blog posts on your profile or on a group page (no post deletion ability))
guserPH.isStaffRole = function() {
  return true;
}
pmainPH.isHeadmaster = function() {
  return true;
}
pprofPH.isStaff = true;
pprofPH.isParent = true;
pprofPH.isStudent = true;
pprofPH.isTeacher = true;
pmaindashPH.isFormMaster = true;
guserPH.userHasRole = true;
