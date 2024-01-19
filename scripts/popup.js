const saveSaveDirectory = () => {
    document.getElementById("saveDirectorySettingError").style.display = 'none';

    const inputPath = document.getElementById("saveDirectoryInput").value;
    if(isValidPath(inputPath)) {
        chrome.storage.sync.set({"saveLocation": inputPath});
    } else {
        document.getElementById("saveDirectorySettingError").style.display = 'inline-block';
    }
}
/*
regex not fully tested (not on windows), but should work on mac at least
https://regex101.com/r/
*/
const isValidPath = (path) => {
    if(path.length ===  0) return true;
    const mac = new RegExp("^(\.\/)?([a-zA-Z0-9_\-]+(\/[a-zA-Z0-9_\-]+)*(\/)?)?$")
    const windows = new RegExp("^(\.\\\\)?([a-zA-Z0-9_\-]+(\\[a-zA-Z0-9_\-]+)*(\\\\)?)?$") //to keep consistent slash direction
    return mac.test(path) || windows.test(path);
}

const init = () => {
    document.getElementById("saveSaveDirectoryBtn").addEventListener('click', saveSaveDirectory);
    chrome.storage.sync.get({'saveLocation': './CodeForces/'}, (items) => {
        if(items && items.hasOwnProperty('saveLocation')) {
            document.getElementById("saveDirectoryInput").value = items.saveLocation
        } else {
            document.getElementById("saveDirectoryInput").value = ""
        }
    })
}

init();
