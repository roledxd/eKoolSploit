cmenuPH.sidebarcollapseHandler();
var user = guserPH.user;
var lang = chelperPH.langId;
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
//Intro with ekool languages
if(lang == "ru"){
    chelperPH.showClickableNotice(`Привет, ${user.name1} ${user.name2}!`, `eKoolSploit был успешно запущен! Для отключения скрипта обновите страницу.`);
}
else if(lang == "en"){
    chelperPH.showClickableNotice(`Hi, ${user.name1} ${user.name2}!`, `eKoolSploit has been successfully launched! To disable the script, refresh the page.`);
}
else if(lang == "et"){
    chelperPH.showClickableNotice(`Tere, ${user.name1} ${user.name2}!`, `eKoolSploit on edukalt käivitatud! Skripti keelamiseks värskendage lehte.`);
}
else {
    chelperPH.showClickableNotice(`Hi, ${user.name1} ${user.name2}!`, `eKoolSploit has been successfully launched! To disable the script, refresh the page.`);
}
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
        <span class="b requestText">eKoolSploit Settings</span>
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
        <span class="iProfileName">
            eKoolSploit Settings
        </span>
    </h2>
</div>`);
}
