

const statusElement = document.createElement("div");
const parseButton = document.createElement('button');
const parseAllButton = document.createElement('button');
init()

function init() {
    // chrome.storage.sync.clear(); 

    if(getFirstElementOfClass(document, "sample-tests")) {
        addProblemElements(getFirstElementOfClass(document, "sample-tests"))
    }

    if(getFirstElementOfClass(document, "problems")) {
        if(getFirstElementOfClass(document, "second-level-menu")) {
            addContestElements(getFirstElementOfClass(document, "second-level-menu"))
        }
    }
}

function getFirstElementOfClass(wrapper, className) {
    const elements = wrapper.getElementsByClassName(className);
    if(elements && elements.length > 0) {
        return elements[0];
    }
    return null;
}

function addProblemElements(wrapperElement) {

    parseButton.textContent = "Parse All Test Cases";
    parseButton.className = "parseButton";
    parseButton.onclick = function(){
        parseCases(wrapperElement)
    };
    const exampleCasesTitle = wrapperElement.getElementsByClassName("section-title");
    if(!exampleCasesTitle || exampleCasesTitle.length < 1) {
        return;
    }
    exampleCasesTitle[0].insertAdjacentElement("afterend", parseButton);
    
    statusElement.textContent = "Hello";
    statusElement.className = "statusText";
    parseButton.insertAdjacentElement("afterend", statusElement);
}

function addContestElements(placeAfterElement) {
    parseAllButton.textContent = "Parse All Problems";
    parseAllButton.className = "parseButton";
    parseAllButton.onclick = () => {}
    placeAfterElement.insertAdjacentElement("afterend", parseAllButton)
}

function parseCases(wrapperElement) {
    const innerWrapper = getFirstElementOfClass(wrapperElement, "sample-test");
    if(!innerWrapper) {
        displayStatusMessage("Could Not Parse: No Test Cases Found", "ERROR");
        return;
    }
    const inputs = innerWrapper.getElementsByClassName("input");
    const outputs = innerWrapper.getElementsByClassName("output");

    if(inputs && outputs) {
        var parsedIO = [[], []];
        var ioHoldingArray = [[...inputs], [...outputs]];
        for(var i = 0; i < 2; ++i) {
            ioHoldingArray[i].forEach(testCase => {
                const preElement = testCase.querySelector("pre");
                if(!preElement) 
                    return;
                var testCaseText = "";
                [...preElement.childNodes].forEach(testCaseLine => {
                    testCaseText += (testCaseLine.textContent.length > 0 ? (testCaseLine.textContent + '\n') : "");
                })
                if(testCaseText.length > 0) {
                    parsedIO[i].push(testCaseText);
                }
            });
        }
        if(parsedIO[0].length != parsedIO[1].length) {
            displayStatusMessage("Could Not Parse: IO Size Mismatch", "ERROR");
        } else {
            for(var i = 0; i < parsedIO[0].length; ++i) {
                exportAndDownloadTestCase("in" + (i+1) + ".txt", parsedIO[0][i]);
                exportAndDownloadTestCase("ans" + (i+1) + ".txt", parsedIO[1][i]);
            }
            displayStatusMessage("Successfully Parsed [" + (parsedIO[0].length) + "] test cases.", "SUCCESS");
        }
    } else {
        displayStatusMessage("Could Not Parse: No IO Found", "ERROR");
    }

}

function exportAndDownloadTestCase(name, rawData) {
    const location = getProblemFileLocation();
    if(location) {
        downloadFile(name, location, exportDataToFile(rawData));
    }
}

function exportDataToFile(data) {
    const file = new Blob([data], {type: 'text/plain'});
    window.URL = window.URL || window.webkitURL;
    const link = window.URL.createObjectURL(file);
    return link;

}

function downloadFile(name, saveLocation, link) {
    getProblemFileLocation()
    // window.URL.revokeObjectURL(link);
    var param = { link, name, saveLocation};
    chrome.runtime.sendMessage(param);
}

function getProblemFileLocation() {
    const url = getPage();
    if(url.includes("contest") || url.includes("problemset")) {
        const URLParts = url.split("/").slice(3);
        const contest = URLParts[(url.includes("contest") ? 1 : 2)], problem = URLParts[3];
        return contest + "/" + problem.toLowerCase() + "/";
    } else if(url.includes("gym")) {
        const URLParts = url.split("/").slice(3);
        const contest = URLParts[1], problem = URLParts[3];
        return "gym" + "/" + contest + "/" + problem.toLowerCase() + "/";
    } else {
        displayStatusMessage("Unknown Problem Type", "ERROR");
        return null;
    }
}

function getPage() {
    return window.location.toString()
}

function displayStatusMessage(text, type) {
    statusElement.classList.remove("statusText");
    statusElement.classList.remove("statusSuccess");
    statusElement.classList.remove("statusError");

    if(type === "ERROR") {
        statusElement.textContent = text;
        statusElement.classList.add("statusTextError");
    }
    if(type == "SUCCESS") {
        statusElement.textContent = text;
        statusElement.classList.add("statusTextSuccess");
    }
}