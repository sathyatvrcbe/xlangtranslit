document.addEventListener('DOMContentLoaded', function() {
  
function onButtonClick(e) {
    var toLanguage = this.getAttribute("data-toLanguage");
    var fromLanguage = this.getAttribute("data-fromLanguage");

    chrome.tabs.executeScript(null, {
      code : "var toLanguage = '" + toLanguage + "', fromLanguage = '" + fromLanguage + "';"
    }, function() {
      chrome.tabs.executeScript(null, {file: "content_script.js"});  
    });

    window.close();
  }

  var buttons = document.querySelectorAll("button");

function registerClick(button) {
  button.addEventListener("click", onButtonClick);
}


for(var i=0;i<buttons.length;i++) {
  registerClick(buttons[i]);
}

});