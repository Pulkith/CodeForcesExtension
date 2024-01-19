chrome.runtime.onMessage.addListener(
    function(arg, sender, sendResponse) {
        const {link, name, saveLocation} = arg;
        chrome.storage.sync.get({'saveLocation': './CodeForces/'}, (res) => {
            var location = "";
            if(res.saveLocation) {
                location = res.saveLocation;
                if(location.includes("./") || location.includes(".\\")) {
                    location = location.substring(2);
                }
                if(location.length > 0 && (location.slice(-1) == "/" || location.slice(-1) == "\\")) {
                    location = location.slice(0, -1);
                }
            }
            location = location + (location.length > 0 ? "/" : "") + saveLocation;
             if (navigator.userAgent.indexOf('Windows') > -1) { //windows is 'Windows', for mac use 'Mac'
                location = location.replaceAll('/', "\\")
              }
              console.log(location + name);
            chrome.downloads.download({
                url: link,
                filename: location + name,
            });
        });
  });