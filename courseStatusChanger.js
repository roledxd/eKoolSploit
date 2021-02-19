//status
var enabled = true;
//curriculum id
var currId = 250114398;
//classLevel
var classLevelFilter = true;
var classLevel = 7;
//DWR session randomizer
setInterval(function(){ dwr.engine._scriptSessionId=Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); }, 500);
//acurriculaPH modification to prevent dialogs from splashing
acurriculaPH.changeCourseActiveStatus=function(c,u){null!=c?(showLoadingIndicator("appContent"),curriculumManager.setCourseActive(c,u,{callback:function(c){cappPH.doGroupRefresh();var u=!1;null==acurriculaPH.course.id&&(u=!0),acurriculaPH.course=c.returnObject,ccachePH.courseListUpdate(acurriculaPH.curricula.id,acurriculaPH.course),ccachePH.cache.unset("courseFind"+acurriculaPH.course.id),ccachePH.cache.unset("subjectList"+acurriculaPH.curricula.id),ccachePH.getCurriculumShortEmpty(acurriculaPH.curricula.id),ccachePH.subjectList(acurriculaPH.curricula.id,function(c){acurriculaPH.subjectList=c,acurriculaPH.subject=chelperPH.arrFindById(acurriculaPH.subject.id,acurriculaPH.subjectList),u?acurriculaPH.courseList(acurriculaPH.subject.id):ccachePH.courseFind(acurriculaPH.course.id,function(c){acurriculaPH.courseShow(acurriculaPH.course.id,!1)})})}})):shout("curriculumId is null")};
//course status changer
curriculumManager.courseList(currId, function(a){
    a.returnObject.forEach(c => 
        if(classLevelFilter){
            if(c.classLevel.classLevel == classLevel){
                acurriculaPH.changeCourseActiveStatus(c.id, enabled);
            }
        }
        else{
            acurriculaPH.changeCourseActiveStatus(c.id, enabled);
        }
    );
});
