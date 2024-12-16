// only usable up to 10k elements
const jacobsthal = [2, 2, 6, 10, 22, 42, 86, 170, 342, 682, 1366, 2730, 5462, 10922];

let maxSortedList = [];

let numComparisons = 0;

button1 = document.getElementById("left");
button2 = document.getElementById("right");

function updatePercentComplete(sortedList, items) {
    if (sortedList) {
        if (sortedList.length > maxSortedList.length) {
            maxSortedList = sortedList;
        }
        let descendingList = [...maxSortedList].reverse();
        console.log(`sorted list so far:\n${descendingList}`);
    }
    let truePercentage = 100 * (maxSortedList.length / items.length);
    let estimatedPercentage = 100 * (numComparisons / estimateNumComparisons(items.length));
    estimatedPercentage = Math.min(100, estimatedPercentage);
    let percentage = (truePercentage + estimatedPercentage) / 2;
    console.log(`${Math.floor(percentage)}% complete`);
    $("#bar").css('width', percentage + "%");
}

const timeout = async ms => new Promise(res => setTimeout(res, ms));
let next = false; // this is to be changed on user input

let fileContent = false;
async function waitFileUpload() {
    fileContent = false;
    while (fileContent === false) await timeout(50);
    return fileContent;
}

function estimateNumComparisons(n) {
    let logBase237N = Math.log(n) / Math.log(2.35);
    return Math.floor(n * logBase237N);
}

button1.onclick = function () {
    next = button1.textContent;
    console.log("Got click on button1. Next: ", next);
}
button2.onclick = function () {
    next = button2.textContent;
    console.log("Got click on button2. Next: ", next);
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        // Generate random number
        var j = Math.floor(Math.random() * (i + 1));

        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

async function binarySearch(array, item, lowerBound, upperBound) {
    if (lowerBound == upperBound) {
        if ((await compare(array[lowerBound], item) > 0)) {
            return lowerBound;
        }
        else {
            return lowerBound + 1;
        }
    }
    if (lowerBound > upperBound) {
        return lowerBound;
    }

    midpoint = Math.floor((lowerBound + upperBound) / 2);
    midItem = array[midpoint];
    isGreater = (await compare(item, midItem) > 0);
    if (isGreater) {
        return await binarySearch(array, item, midpoint + 1, upperBound);
    }
    else {
        return await binarySearch(array, item, lowerBound, midpoint - 1);
    }
}

function getListCache() {
    return JSON.parse(localStorage.getItem("comparisonListCache")) || [];
}

function getComparsionCache() {
    return JSON.parse(localStorage.getItem("comparisonCache")) || {};
}

function hasComparisonCache() {
    return localStorage.getItem("comparisonCache") !== null
        && JSON.parse(localStorage.getItem("comparisonCache")).length !== 0;
}

function hasListCache() {
    return localStorage.getItem("comparisonListCache") !== null
        && JSON.parse(localStorage.getItem("comparisonListCache")).length !== 0;
}

function setListCache(list) {
    localStorage.setItem("comparisonListCache", JSON.stringify(list));
}

function addToComparisonCache(key, value) {
    const currentCache = getComparsionCache();
    currentCache[key] = value;
    localStorage.setItem("comparisonCache", JSON.stringify(currentCache));
}

function clearBrowserCache() {
    localStorage.setItem("comparisonCache", JSON.stringify({}));
    localStorage.setItem("comparisonListCache", JSON.stringify([]));
}

function getComparisonFromBrowserCache(a, b) {
    // sort a and b
    let first = a < b ? a : b;
    let second = a < b ? b : a;
    const currentCache = JSON.parse(localStorage.getItem("comparisonCache")) || {};
    return currentCache[`${first}_${second}`];
}
function addComparisonToBrowserCache(a, b, result) {
    // sort a and b
    let first = a < b ? a : b;
    let second = a < b ? b : a;

    addToComparisonCache(`${first}_${second}`, result);
}

async function waitUserInput() {
    next = false;
    while (next === false) await timeout(50); // pauses script
    return next;
}

async function compare(a, b) {
    numComparisons += 1;
    console.log(`Comparing ${a} and ${b}, number of comparisons = ${numComparisons}`);
    button1.textContent = a;
    button2.textContent = b;
    let cachedResult = getComparisonFromBrowserCache(a, b);
    if (cachedResult != null) {
        return cachedResult;
    }
    let result = 0;
    pressedButton = await waitUserInput();
    if (pressedButton === a) {
        result = 1;
    } else if (pressedButton === b) {
        result = -1;
    }
    addComparisonToBrowserCache(a, b, result);
    return result;
}

async function mergeInsertionSort(list) {
    if (list.length <= 1) {
        return list;
    }
    if (list.length == 2) {
        item1 = list[0];
        item2 = list[1];
        if (await compare(item1, item2) > 0) {
            return [item2, item1];
        }
        else {
            return [item1, item2];
        }
    }
    shuffle(list);
    let isEven = (list.length % 2 == 0);
    // make pairs
    let extra = false;
    if (!isEven) {
        extra = list[list.length - 1];
    }
    let pairs = {};
    let reversePairs = {};
    for (i = 0; i < list.length - 1; i += 2) {
        a = list[i];
        b = list[i + 1];
        if (await compare(a, b) > 0) {
            pairs[a] = b;
            reversePairs[b] = a;
        }
        else {
            pairs[b] = a;
            reversePairs[a] = b;
        }
    }
    let S = [];
    for (a of Object.keys(pairs)) {
        S.push(a);
    }
    S = await mergeInsertionSort(S);
    first = pairs[S[0]]; // get b to the first a
    S.splice(0, 0, first); // insert at beginning of array
    //updatePercentComplete(S, list);
    let remaining = [];
    for (i = 2; i < S.length; i++) { // skip first two elements of s, they are paired
        remaining.push(pairs[S[i]]);
    }
    if (extra) {
        remaining.push(extra);
    }
    // partition into groups of jacobsthal size
    remainingGroups = []
    jacobsthalIndex = 0
    while (remaining.length > 0) {
        remainingGroups.push([]);
        activeGroup = remainingGroups[remainingGroups.length - 1];
        groupSize = jacobsthal[jacobsthalIndex];
        if (groupSize > remaining.length) {
            groupSize = remaining.length;
        }

        for (i = 0; i < groupSize; i++) {
            activeGroup.splice(0, 0, remaining.shift()); // takes first of remaining and adds it to beginning of group, to create reverse order
        }

        jacobsthalIndex++;
    }
    for (group of remainingGroups) {
        for (b of group) {
            if (b === extra) {
                indexToInsert = await binarySearch(S, b, 0, S.length - 1);
                S.splice(indexToInsert, 0, b);
            }
            else {
                bigSister = reversePairs[b];
                upperBound = S.indexOf(bigSister) - 1;
                indexToInsert = await binarySearch(S, b, 0, upperBound);
                S.splice(indexToInsert, 0, b);
            }
            //updatePercentComplete(S, list);
        }
    }
    return S;
}