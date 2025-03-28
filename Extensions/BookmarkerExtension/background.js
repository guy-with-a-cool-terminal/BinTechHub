chrome.tabs.onUpdated.addListener((tabId, tab) => { // fires whenever a tab's url changes/reloads
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      const queryParameters = tab.url.split("?")[1]; // split the url at ? and take query parameters
      const urlParameters = new URLSearchParams(queryParameters);
  
      // send message to contentScript in same tab   
      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        videoId: urlParameters.get("v"),
      });
    }
  });
  