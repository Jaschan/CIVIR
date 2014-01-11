function hacerClick(){
  $('input').click();
}
function closeMe(){
  chrome.runtime.sendMessage({command: "close_me"});
}
$(document).ready(function(){
  chrome.runtime.sendMessage({command: "ask_enable"},function(response) {
    if(response.enable){
      var xhr = new XMLHttpRequest();
      xhr.open("GET", 'http://news.google.com/?output=rss', true);
      xhr.onload = function(e){
        var doc = xhr.responseXML;
        if (!doc) {
          hacerClick();
        }else{
          closeMe();
        }
      }
      xhr.onerror = function(e){
        closeMe();
      }
      xhr.timeout = 650;
      xhr.ontimeout = function (e) {
        closeMe();
      }
      xhr.send(null);
    }
  });
});