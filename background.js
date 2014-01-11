//VARIABLES!
var is_enable = false;
var count = 0;
var xhr = new XMLHttpRequest();
var delay_checking = setTimeout(function(){},1);

//FUNCIONS!
function toggleOnOff(){
  clearTimeout(delay_checking);
  is_enable = !is_enable;
  refreshState();
  if(is_enable){
    console.log("on!");
    checking();
  }else{
    console.log("off!");
  }
}

function refreshState(){
  if(is_enable){
    chrome.browserAction.setBadgeText({text: count.toString()});
    chrome.browserAction.setBadgeBackgroundColor({color: "#00D800"});
  }else{
    count = 0;
    chrome.browserAction.setBadgeText({text: "OFF"});
    chrome.browserAction.setBadgeBackgroundColor({color: "#FF0000"});
  }
}

function openLoginPage(){
  count++;
  chrome.browserAction.setBadgeText({text: count.toString()});
  chrome.tabs.create({index: 0, active: false, pinned: true, url: 'http://192.168.200.1:8002/'});
  setTimeout(function(){checking();}, 1800000); //1 800 000 = 30 mins
}

function handleResponse() {
  var doc = xhr.responseXML;
  console.log("cheking: "+xhr.status+" doc: "+doc);
  if (!doc) {
    openLoginPage();
  }else{
    checking();
  }
}

function checking(){
  if(is_enable){
    //TODO: maybe agregar una variable para identificar este timeout para cancelarlo al apretar el toggle
    delay_checking = setTimeout(function(){
      xhr.open("GET", "http://news.google.com/?output=rss", true);
      xhr.onload = handleResponse;
      xhr.onerror = function(e){
        alert("error: "+xhr.status);
        toggleOnOff();
        checking();
      }
      xhr.timeout = 5000;
      xhr.ontimeout = function (e) {
        alert("timeout: "+xhr.status);
        toggleOnOff();
        checking();
      }
      xhr.send(null);
    },Math.floor((600000)+(Math.random()*4500+500)+(Math.random()*5000)+(Math.random()*4500+500)));//tiempo entre checkeos
  }else{
    console.log("off");
    //setTimeout(function(){checking();console.log("off...");}, 3000);
  }
}

//EVENT LISTENERS!
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.command == "close_me"){
    chrome.tabs.remove(sender.tab.id,function(){});
  }else if(request.command == "ask_enable"){
    sendResponse({enable: is_enable});
  }
});

chrome.browserAction.onClicked.addListener(function(){
  toggleOnOff();
});

//FIRST EXECUTION!
refreshState();
setTimeout(function(){checking();}, 5000);
setInterval(function(){refreshState();},20000);