// PURPOSE: handle all interactivity and other stuff in the large popup window 
// this includes creating and handling list items, calling Subjective Sort to shuffle them, and showing results as a checklist 

let items = []; // dynamically sized array of strings to hold to-do list items 
let windowOpened = false;

// divs containing elements of different pages 
let listCreation;
let sorting;
let finalList;

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
// adds a FINISHED to-do list item (itemTemplate) to the list 
function addItem(inputElement) {
    // convert this input to an itemTemplate (finished item)

    let itemText = inputElement.value;

    // get div to append to 
    const listDiv = document.getElementById("todoListContainer");

    // create a clone of the template, THEN append it (preserves structure)
    const clone = itemTemplate.content.cloneNode(true);
    clone.firstElementChild.textContent = itemText;
    listDiv.appendChild(clone);

    // get text from input, append to items
    items.push(itemText)

    // clear input box 
    inputElement.value = "";
}

// called after addItem -> creates a new textbox (InputTemplate) below the finished ones
// also called once when the popup opens 
function newTextBox() {

    // get div to append to 
    const listDiv = document.getElementById("newItemsContainer");

    // create a clone of the template, THEN append it (preserves structure)
    const clone = inputTemplate.content.cloneNode(true);

    // add event listener for ENTER key
    const inputBox = clone.firstElementChild.querySelector("input");
    inputBox.addEventListener("keydown", function (e) {
        if (e.code === "Enter") {
            addItem(inputBox);
        }
    });
    listDiv.appendChild(clone);
}

async function doneButton() { // triggers the sort and the results page 
    console.log(items);

    listCreation.style.display = "none";
    sorting.style.display = "block";

    sortedList = await mergeInsertionSort(items);
    console.log(sortedList);

    // display the sorted list 
    sorting.style.display = "none";
    finalList.style.display = "block";

    populateList(sortedList);
}

function populateList(list) {
    console.log("populateList triggered! List used: " + list);

    for (let i = 0; i < list.length; i++) {
        // get div to append to 
        const listDiv = document.getElementById("todoList");

        // create a clone of the template, set its text content, THEN append it (preserves structure)
        const clone = itemTemplate.content.cloneNode(true);
        const textBox = clone.firstElementChild.querySelector("p");
        textBox.textContent = list[i];

        listDiv.appendChild(clone);
    }
}

// document.addEventListener applies to things that happen within the HTML document (window.html)
// window.addEventListener applies to the outer window, and can listen for events like resizing. 

// handle everything that happens immediately after the window opens, only once 
window.addEventListener('load', function () {
    if (!windowOpened) {
        // hide all HTML except listCreation div 
        listCreation = document.getElementById("listCreation");
        sorting = document.getElementById("sorting");
        finalList = document.getElementById("finalList");

        listCreation.style.display = "block";
        sorting.style.display = "none";
        finalList.style.display = "none";

        newTextBox();
        windowOpened = true;
    }
});

// make sure button is fully loaded before the onclick method is added 
document.addEventListener("DOMContentLoaded", () => {

    // set all onclick methods 
    document.getElementById("doneButton").onclick = doneButton;
});