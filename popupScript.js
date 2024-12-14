let items = []; // dynamically sized array of strings to hold to-do list items 

// PAGE CONTENT ---------

// make sure button is fully loaded before the onclick method is added 
document.addEventListener("DOMContentLoaded", () => {

    // open new popup window
    // popup window handles itself  
    function openWindow() {
        console.log("Clicked the button.");
        chrome.windows.create({
            url: chrome.runtime.getURL("window.html"),
            type: "popup" // no address bar 
        });
    }

    // set all onclick methods 
    document.getElementById("createButton").onclick = openWindow;
});