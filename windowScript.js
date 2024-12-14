// PURPOSE: handle all interactivity and other stuff in the large popup window 
// this includes creating and handling list items, calling Subjective Sort to shuffle them, and showing results as a checklist 

let windowOpened = false;

console.log("WindowScript.js has been called!!");

// TEMPLATES ---------

const inputTemplate = document.createElement("template"); // string input must be a type of HTML element ie. template, div, p
inputTemplate.innerHTML = `
    <div class id="inputBox">
        <input class="text-input" type="text" placeholder="Item description here...">
    </div>
`;

const itemTemplate = document.createElement("template");
itemTemplate.innerHTML = `
    <div class id="textBox">
        <p>This is a finished to-do list item.</p>
    </div>
`;

// called when the user presses "enter" or otherwise finishes inputting text
function addItem() {
    console.log("Added an item to the list.");
    newTextBox();
}

// called after addItem -> creates a new textbox below the finished one
// also called once when the popup opens 
function newTextBox() {
    console.log("Add a new text box.");

    // create a clone of the template, THEN append it (preserves structure)
    const clone = inputTemplate.content.cloneNode(true);
    document.body.appendChild(clone);

    console.log("Appended new text box: ", clone);
}

// document.addEventListener applies to things that happen within the HTML document (window.html)
// window.addEventListener applies to the outer window, and can listen for events like resizing. 

// handle everything that happens immediately after the window opens, only once 
window.addEventListener('load', function () {
    if (!windowOpened) {
        console.log("Window has been opened. This will not happen again.");
        newTextBox();
        windowOpened = true;
    } else {
        console.log("Load has triggered but windowOpened is false.");
    }
});