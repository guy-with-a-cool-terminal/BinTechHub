document.getElementById("connectBtn").addEventListener("click", function() {
    var proxy = document.getElementById("proxyList").value;
    activateProxy(proxy);
  });
  
  function activateProxy(proxy) {
    chrome.runtime.sendMessage({ action: "activateProxy", proxy: proxy });
  }