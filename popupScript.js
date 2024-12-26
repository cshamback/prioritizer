// PAGE CONTENT ---------

// make sure button is fully loaded before the onclick method is added 
document.addEventListener("DOMContentLoaded", () => {

    // open new popup window
    // popup window handles itself  
    function openWindow() {
        console.log("Clicked the button.");
        chrome.windows.create({
            url: chrome.runtime.getURL("window.html"),
            type: "popup", // no address bar
            height: 700,
            width: 700
        });
    }

    // set all onclick methods 
    document.getElementById("createButton").onclick = openWindow;
});