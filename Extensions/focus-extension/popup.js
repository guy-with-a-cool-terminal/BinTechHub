// Initialize UI elements and setup event listeners
document.getElementById("startFocus").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "startFocus" });
});

document.getElementById("stopFocus").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "stopFocus" });
});

// Toggle Strict Mode
document.getElementById("strictMode").addEventListener("change", () => {
    chrome.runtime.sendMessage({ action: "toggleStrictMode" });
});

// Add to blacklist
document.getElementById("addBlacklistBtn").addEventListener("click", () => {
    const site = document.getElementById("addBlacklist").value;
    if (site) {
        chrome.storage.local.get("blacklist", (data) => {
            let blacklist = data.blacklist || [];
            blacklist.push(site);
            chrome.storage.local.set({ blacklist });
            displayBlacklist();
        });
    }
});

// Add to whitelist
document.getElementById("addWhitelistBtn").addEventListener("click", () => {
    const site = document.getElementById("addWhitelist").value;
    if (site) {
        chrome.storage.local.get("whitelist", (data) => {
            let whitelist = data.whitelist || [];
            whitelist.push(site);
            chrome.storage.local.set({ whitelist });
            displayWhitelist();
        });
    }
});

// Display current focus time
chrome.storage.local.get("focusTimer", (data) => {
    document.getElementById("time").textContent = data.focusTimer || 0;
});

// Set UI based on focus active state
chrome.storage.local.get("focusActive", (data) => {
    const focusActive = data.focusActive || false;
    document.getElementById("startFocus").disabled = focusActive;
    document.getElementById("stopFocus").disabled = !focusActive;
});

// Update strict mode state
chrome.storage.local.get("isStrictMode", (data) => {
    document.getElementById("strictMode").checked = data.isStrictMode || false;
});

// Display current blacklist
function displayBlacklist() {
    chrome.storage.local.get("blacklist", (data) => {
        const blacklist = data.blacklist || [];
        const blacklistDisplay = document.getElementById("blacklistDisplay");
        blacklistDisplay.innerHTML = blacklist.map(site => `<li>${site}</li>`).join("");
    });
}

// Display current whitelist
function displayWhitelist() {
    chrome.storage.local.get("whitelist", (data) => {
        const whitelist = data.whitelist || [];
        const whitelistDisplay = document.getElementById("whitelistDisplay");
        whitelistDisplay.innerHTML = whitelist.map(site => `<li>${site}</li>`).join("");
    });
}
// Reset focus timer
document.getElementById("resetTimer").addEventListener("click", () => {
    chrome.storage.local.set({ focusTimer: 0 }, () => {
        document.getElementById("time").textContent = 0;
    });
});

// Start countdown (strict session)
document.getElementById("startCountdownBtn").addEventListener("click", () => {
    const minutes = parseInt(document.getElementById("countdownInput").value);
    if (!isNaN(minutes) && minutes > 0) {
        const seconds = minutes * 60;
        chrome.runtime.sendMessage({ action: "startCountdown", duration: seconds });
        document.getElementById("startFocus").disabled = true;
        document.getElementById("stopFocus").disabled = true;
    }
});

// Extension toggle (soft disable)
document.getElementById("extensionToggle").addEventListener("change", (e) => {
    chrome.storage.local.set({ extensionEnabled: e.target.checked });
});

// Keep time display updated every second
setInterval(() => {
    chrome.storage.local.get("focusTimer", (data) => {
        document.getElementById("time").textContent = data.focusTimer || 0;
    });
}, 1000);


// Initialize display for blacklist and whitelist
displayBlacklist();
displayWhitelist();
