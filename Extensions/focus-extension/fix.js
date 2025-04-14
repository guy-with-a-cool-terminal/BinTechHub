let focusTimer = 0;
let timerInterval;
let focusActive = false;
let isStrictMode = false;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        focusTimer: 0,
        focusActive: false,
        isStrictMode: false,
        blacklist: ["youtube.com", "instagram.com", "whatsapp.com", "tryhackme.com"],
        whitelist: ["chatgpt.com", "docs.google.com"]
    });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "toggleStrictMode") {
        isStrictMode = !isStrictMode;
        chrome.storage.local.set({ isStrictMode });
    }
    if (msg.action === "startFocus") {
        startFocusTimer();
    } else if (msg.action === "stopFocus") {
        stopFocusTimer();
    }
});

chrome.storage.local.get(["focusTimer", "focusActive"], (data) => {
    focusTimer = data.focusTimer || 0;
    if (data.focusActive) startFocusTimer();
});

function startFocusTimer() {
    focusActive = true;
    chrome.storage.local.set({ focusActive: true });

    timerInterval = setInterval(() => {
        focusTimer++;
        chrome.storage.local.set({ focusTimer });
    }, 1000);
}

function stopFocusTimer() {
    clearInterval(timerInterval);
    focusActive = false;
    chrome.storage.local.set({ focusActive: false });
}

chrome.tabs.onActivated.addListener(({ tabId }) => {
    chrome.tabs.get(tabId, (tab) => {
        if (tab && tab.url) checkUrlAndBlock(tab);
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        checkUrlAndBlock(tab);
    }
});

function checkUrlAndBlock(tab) {
    const url = tab.url.toLowerCase();
    chrome.storage.local.get(["blacklist", "whitelist"], (data) => {
        const blacklist = data.blacklist || [];
        const whitelist = data.whitelist || [];

        const isWhitelisted = whitelist.some(site => url.includes(site));
        const isBlacklisted = blacklist.some(site => url.includes(site));

        if (!isWhitelisted && isBlacklisted) {
            chrome.tabs.executeScript(tab.id, {
                code: '(' + blockSite.toString() + ')();'
            });
        }
    });
}

function blockSite() {
    document.body.innerHTML = "<h1 style='font-size:2rem;text-align:center;margin-top:20%'>Blocked! Focus mate! Focus!!</h1>";
}
