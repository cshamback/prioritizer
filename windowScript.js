// PURPOSE: handle all interactivity and other stuff in the large popup window 
// this includes creating and handling list items, calling Subjective Sort to shuffle them, and showing results as a checklist 

let items = []; // dynamically sized array of strings to hold to-do list items 
let windowOpened = false;

// divs containing elements of different pages 
let listCreation;
let sorting;
let finalList;

document.title = "Prioritizer";

// TEMPLATES ---------

const inputTemplate = document.createElement("template"); // string input must be a type of HTML element ie. template, div, p
inputTemplate.innerHTML = `
    <div class id="inputBox">
        <input class="text-input" type="text" placeholder="Item description here...">
    </div>
`;

const itemTemplate = document.createElement("template");
itemTemplate.innerHTML = `
    <div class="listItem" id="textBox" style="display: flex;">
        <input type="checkbox">
        <span class="checkmark"></span> 
        <label id="todoLabel"> This is a finished to-do list item.</label>
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

    // set label text -> every to-do list item has a label component with the item's text 
    const labelElement = clone.querySelector('#todoLabel');
    labelElement.textContent = itemText;

    listDiv.appendChild(clone);

    // get text from input, append to items
    items.push(itemText)

    // clear input box 
    inputElement.value = "";

    let checkBox = document.querySelectorAll(".checkmark");
    console.log("Found checkmarks: ", checkBox);
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

//TODO: add a "re-sort" button that calls this method 
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

    // TODO: SAVE CHECKBOX DATA 

    for (let i = list.length - 1; i >= 0; i--) {
        // get div to append to 
        const listDiv = document.getElementById("todoList");

        // create a clone of the template and set its properties
        const clone = itemTemplate.content.cloneNode(true);

        const checkBox = clone.firstElementChild.querySelector("input");
        const textBox = clone.childNodes[1].querySelector("label");

        textBox.textContent = list[i];
        textBox.for = "listItem" + i;
        checkBox.name = "listItem" + i;

        // append newly created clone to the bottom
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