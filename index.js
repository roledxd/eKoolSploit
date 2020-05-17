var user = guserPH.user;
var lang = chelperPH.langId;
//Setting up with ekool language
if(lang == "ru"){
    var hello1 = `Привет,`;
    var hello2 = `eKoolSploit был успешно запущен! Для отключения скрипта обновите страницу.`;
    var msgtitle1 = "Сообщение";
    var settstitle1 = "Настройки eKoolSploit";
    var plslogintxt = "Пожалуйста авторизуйтесь на сайте, чтобы начать использование eKoolSploit"  
}
else if(lang == "en"){
    var hello1 = `Hi,`;
    var hello2 = `eKoolSploit has been successfully launched! To disable the script, refresh the page.`;
    var msgtitle1 = "Message";
    var settstitle1 = "eKoolSploit Settings";
    var plslogintxt = "Please log in to start using eKoolSploit"  
}
else if(lang == "et"){
    var hello1 = `Tere,`;
    var hello2 = `eKoolSploit on edukalt käivitatud! Skripti keelamiseks värskendage lehte.`;
    var msgtitle1 = "Teade";
    var settstitle1 = "eKoolSploiti seaded";
    var plslogintxt = "eKoolSploiti kasutamise alustamiseks logige sisse"  
}
else {
    var hello1 = `Hi,`;
    var hello2 = `eKoolSploit has been successfully launched! To disable the script, refresh the page.`;
    var msgtitle1 = "Message";
    var settstitle1 = "Settings Settings";
    var plslogintxt = "Please log in to start using eKoolSploit"    


}



if(guserPH.user != null){
    chelperPH.showClickableNotice(`${hello1} ${user.name1} ${user.name2}!`, `${hello2}`);
    var eKoolSploit={
        addJournalNotice: function(txt){
            if(!txt){
                addjrnlntc("No Content.");
            }
            else{
                addjrnlntc(txt);
            }
        },
        addJournalMark: function(mark, lesson, teacher, comment){
            var markq = 0;
            var lessonq = "Unknown Lesson";
            var teacherq = "Unknown Teacher";
            var commentq = "Unknown Comment";
            if(mark){
                markq = mark;
            }
            if(lessonq){
                lessonq = lesson;
            }
            if(teacherq){
                teacherq = teacher;
            }
            if(commentq){
                commentq = comment;
            }
            addjrnlmrk(markq, lessonq, teacherq, commentq);
        },
        getDate: function(){
            return getEkoolFormatedDate();
        },
        schoolYearScreen: function(){
            var groupId = guserPH.userGetGroups()[0].id;
        }
    
    }
}
else{
    chelperPH.showError("eKoolSploit", plslogintxt);
}




/*var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://code.jquery.com/jquery-1.11.3.min.js';    
document.head.appendChild(script);*/

cmenuPH.sidebarcollapseHandler();

document.getElementsByClassName("feed")[2].setAttribute("id", "feedPanel");

var html = `<li class="learning" id="dash_page_menu_learning" style=""><a onclick='chelperPH.showError("eKoolSploit","This function is unavaliable yet.");'><span class="ico ico-settings" style="display: none;"></span><br>eKoolSploit</a></li>`;
document.getElementById("dash_page_menu").insertAdjacentHTML("afterbegin", html);


console.log(`
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▄▄▄ .▄ •▄             ▄▄▌  .▄▄ ·  ▄▄▄·▄▄▌        ▪  ▄▄▄▄▄
▀▄.▀·█▌▄▌▪▪     ▪     ██•  ▐█ ▀. ▐█ ▄███•  ▪     ██ •██  
▐▀▀▪▄▐▀▀▄· ▄█▀▄  ▄█▀▄ ██▪  ▄▀▀▀█▄ ██▀·██▪   ▄█▀▄ ▐█· ▐█.▪
▐█▄▄▌▐█.█▌▐█▌.▐▌▐█▌.▐▌▐█▌▐▌▐█▄▪▐█▐█▪·•▐█▌▐▌▐█▌.▐▌▐█▌ ▐█▌·
 ▀▀▀ ·▀  ▀ ▀█▄▀▪ ▀█▄▀▪.▀▀▀  ▀▀▀▀ .▀   .▀▀▀  ▀█▄▀▪▀▀▀ ▀▀▀ 
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
GitHub: https://github.com/roledxd/eKoolSploit

Current User: ${user.name1} ${user.name2}.
eKool langId: "${chelperPH.langId}".
eKool resourceDir: ${chelperPH.resourcedir}
 `);


function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}
//Adding elements to the sidebar
document.getElementById("sideData").insertAdjacentHTML("beforeend", `<a class="heading">eKoolSploit</a>`); 
document.getElementById("sideData").insertAdjacentHTML("beforeend", `<span class="group set school ">
<a class="link" onclick='showSettings();'>
    <span class="avatar hasico ico-settings requestButton color-set07"><img src="https://github.com/roledxd/eKoolSploit/blob/master/BGBGeKoolSploit.png?raw=true" alt="eKoolSploit on GitHub"></span>
    <span class="i noScreen">
        <span class="b requestText">${settstitle1}</span>
    </span>
</a>
</span>`); 
/*document.getElementById("sideData").insertAdjacentHTML("beforeend", `<span class="group set school ">
<a class="link" onclick='chelperPH.showNotice("eKoolSploit","Это тестовая пажилая кнопочка так сказатб");'>
    <span class="avatar hasico ico-settings requestButton color-set03"></span>
    <span class="i noScreen">
        <span class="b requestText">eKoolSploit Settings</span>
    </span>
</a>
</span>`);*/ 
document.getElementById("sideData").insertAdjacentHTML("beforeend", `<span class="group set school ">
<a class="link" onclick='openInNewTab("https://github.com/roledxd/eKoolSploit");'>
    <span class="avatar hasico ico-settings requestButton color-set07"><img src="https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/15221874341530102002-256.png" alt="eKoolSploit on GitHub"></span>
    <span class="i noScreen">
        <span class="b requestText">View eKoolSploit on GitHub</span>
    </span>
</a>
</span>`); 

function showSettings(){
    clayoutPH.initModalBox();
    $("modalbox_content").update(`
    <div class="identity MT5" id="personDataheader">
        <h2 class="h1" id="person_name">
            <img src="https://github.com/roledxd/eKoolSploit/blob/master/BGBGeKoolSploit.png?raw=true" class="avatar iPersonLogoImg prof MR10 POSREL" style="width:74px;height:74px;top:0px;left:0px;">
            <span class="iProfileName">${settstitle1}</span>
        </h2>
    </div>
    <hr>
    <div id="eKoolSploitData">

        <h3>Current User:</h3>
        <h4>Name: ${user.name1} ${user.name2}</h4>
        <h4>userId: ${user.userId}</h4>
        <h4>email: ${user.email}</h4>
        <h4>phone number: ${user.phone}</h4>
        <hr>
        <h3>Добавление Оценки:</h3>
        <h4>Локальная функция (при обновлении страницы изменения не сохраняются)<h4>
        <input type="text" placeholder="Оценка" id="markInput">
        <br>
        <input type="text" placeholder="Имя учителя" id="teacherInput">
        <br>
        <input type="text" placeholder="Название урока" id="lessonInput">
        <br>
        <input type="text" placeholder="Комментарий к оценке" id="commentInput">
        <br>
        <h4>Тип Оценки:<h4>
        <select id="courseGradeInput">
            <option value="coursegrade">Курсовая</option>
            <option value="grade" selected="selected">Обычная</option>
        </select>
        <br>
        <button type="button" onclick="addMarkappmethod();">Добавить Оценку</button>
        <hr>
        <h3>Добавление Сообщения:</h3>
        <h4>Локальная функция (при обновлении страницы изменения не сохраняются)<h4>
        <input type="text" placeholder="Текст сообщения" id="messageTextInput">
        <br>
        <button type="button" onclick="">Добавить Оценку</button>
        <hr>
    </div>
    `);
}

function addMarkappmethod(){
    var markInput = document.getElementById("markInput").value;
    var teacherInput = document.getElementById("teacherInput").value;
    var lessonInput = document.getElementById("lessonInput").value;
    var commentInput = document.getElementById("commentInput").value;
    var e = document.getElementById("courseGradeInput");
    var gradeTypeInput = e.options[e.selectedIndex].value;

    document.getElementById("markInput").value = null;
    document.getElementById("teacherInput").value = null;
    document.getElementById("lessonInput").value = null;
    document.getElementById("commentInput").value = null;



    addjrnlmrk(markInput, lessonInput, teacherInput, commentInput, gradeTypeInput);
    clayoutPH.closeModalBox();
}

function addjrnlntc(journalNoticeContent){
    var date = new Date();
    var html = `<li class="journalnotice" id="0_0">
    <div class="type ico ico-message"></div>
    <div class="eventinfo">
        <div class="created"><b>${user.name1} - ${msgtitle1}</b></div>
        <div class="description">
            <p>${journalNoticeContent}</p>
        </div>
        <span class="name">eKoolSploit</span> <span class="date FR">${getEkoolFormatedDate()}</span>
    </div>
    </li>`;
    document.getElementById("feedPanel").insertAdjacentHTML("afterbegin", html);
}

function getEkoolFormatedDate(){

    var dateq = new Date();

    var day = 00;
    var month = 00;
    var year = date.getFullYear();
    var hours = 00;
    var minutes = 00;

    //Formating Day
    if(dateq.getDate() <= 9){
        day = `0${dateq.getDate()}`;
    }
    else{
        day = date.getDate();
    }
    //Formating Month
    if(dateq.getMonth()+1 <= 9){
        month = `0${dateq.getMonth()+1}`;
    }
    else{
        month = dateq.getMonth()+1;
    }
    //Formating Hours
    if(dateq.getHours() <= 9){
        hours = `0${dateq.getHours()}`;
    }
    else{
        hours = dateq.getHours();
    }
    //Formating Minutes
    if(dateq.getMinutes() <= 9){
        minutes = `0${dateq.getMinutes()}`;
    }
    else{
        minutes = dateq.getMinutes();
    }

    var output = `${day}.${month}.${year} ${hours}:${minutes}`;
    return output;

}

function addjrnlmrk(mark, lesson, teacher, comment, type){

var html = `<li class="grade" id="0">
	<div class="type ico"> 
		<div class="${type}">
			<span class="">${mark}</span>
		</div>
	</div>
	<div class="eventinfo">
		<div class="created">
			${user.name1} : Оценка за урок
			<strong>${lesson}</strong>
			<span class="miniNav"><span class="FR">
				
				</span>
			</span>
		</div>

	<div class="comments">
		<div class="info">
			<p class="limiter" onclick="return (instrumented_with_plumbr(function(event){this.removeClassName('limiter');})).apply(this, arguments /*instrumented_with_plumbr*/);">${comment}</p>
		</div>
	</div>
		<div>
			<a class="close close ico ico-x_arrow_up" onclick='chelperPH.showError("eKoolSploit","This function is unavaliable yet.");'>описание урока </a>
		</div>
		<span class="name">${teacher}</span>
		<span class="date FR">${getEkoolFormatedDate()}</span>
		<div>
		</div>
	</div>
    </li>`
    try {
        document.getElementById("feedPanel").insertAdjacentHTML("afterbegin", html);
      }
      catch(err) {
        chelperPH.showClickableError(`eKoolSploit ${err.name}`,`${err}`);
      }

}
