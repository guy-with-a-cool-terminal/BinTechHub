let focusTimer = 0;
let timerInterval;
let focusActive = false;
let isStrictMode = false;
let countdownActive = false;
let countdownEndTime = null;
let extensionEnabled = true;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        focusTimer: 0,
        focusActive: false,
        isStrictMode: false,
        countdownActive: false,
        countdownEndTime: null,
        extensionEnabled: true,
        blacklist: ["youtube.com", "instagram.com", "whatsapp.com"],
        whitelist: ["chatgpt.com", "docs.google.com"]
    });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    switch (msg.action) {
        case "toggleStrictMode":
            isStrictMode = !isStrictMode;
            chrome.storage.local.set({ isStrictMode });
            break;

        case "startFocus":
            startFocusTimer();
            break;

        case "stopFocus":
            stopFocusTimer();
            break;

        case "startCountdown":
            if (msg.minutes) startCountdown(msg.minutes);
            break;

        case "resetTimer":
            if (!countdownActive) resetFocusTimer();
            break;

        case "disableExtension":
            extensionEnabled = false;
            chrome.storage.local.set({ extensionEnabled: false });
            break;

        case "enableExtension":
            extensionEnabled = true;
            chrome.storage.local.set({ extensionEnabled: true });
            break;
    }
});

chrome.storage.local.get(
    ["focusTimer", "focusActive", "countdownActive", "countdownEndTime", "extensionEnabled"],
    (data) => {
        focusTimer = data.focusTimer || 0;
        extensionEnabled = data.extensionEnabled !== false;
        if (data.focusActive) startFocusTimer();
        if (data.countdownActive && data.countdownEndTime) {
            resumeCountdown(data.countdownEndTime);
        }
    }
);

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

function resetFocusTimer() {
    clearInterval(timerInterval);
    focusTimer = 0;
    focusActive = false;
    chrome.storage.local.set({ focusTimer: 0, focusActive: false });
}

function startCountdown(minutes) {
    clearInterval(timerInterval);
    countdownActive = true;
    countdownEndTime = Date.now() + minutes * 60 * 1000;

    chrome.storage.local.set({
        countdownActive: true,
        countdownEndTime: countdownEndTime
    });

    timerInterval = setInterval(() => {
        const timeLeft = countdownEndTime - Date.now();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            countdownActive = false;
            chrome.storage.local.set({
                focusTimer: 0,
                focusActive: false,
                countdownActive: false,
                countdownEndTime: null
            });
        } else {
            chrome.storage.local.set({ focusTimer: Math.floor(timeLeft / 1000) });
        }
    }, 1000);
}

function resumeCountdown(endTime) {
    countdownActive = true;
    countdownEndTime = endTime;

    timerInterval = setInterval(() => {
        const timeLeft = countdownEndTime - Date.now();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            countdownActive = false;
            chrome.storage.local.set({
                focusTimer: 0,
                focusActive: false,
                countdownActive: false,
                countdownEndTime: null
            });
        } else {
            chrome.storage.local.set({ focusTimer: Math.floor(timeLeft / 1000) });
        }
    }, 1000);
}

// 🔒 Tab Activation & Update
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

// 🔍 Block logic
function checkUrlAndBlock(tab) {
    if (!extensionEnabled) return;

    if (countdownActive) {
        chrome.tabs.executeScript(tab.id, {
            code: '(' + blockSite.toString() + ')();'
        });
        return;
    }

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
    document.body.innerHTML = "<h1 style='font-size:2rem;text-align:center;margin-top:20%'>You have work to do! Focus mate! Focus!!</h1>";
}
