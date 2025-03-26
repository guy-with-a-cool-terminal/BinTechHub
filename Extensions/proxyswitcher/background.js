chrome.browserAction.onClicked.addListener(function(tab) {
    // Code to activate a proxy connection when the user clicks the icon
    activateProxy("proxy-server-url");
  });
  
  function activateProxy(proxyUrl) {
    // Set the proxy settings based on the selected proxy
    chrome.proxy.settings.set({
      value: {
        mode: "fixed_servers",
        rules: {
          singleProxy: {
            scheme: "http",
            host: proxyUrl,
            port: 8080
          },
          bypassList: [".google.com", ".facebook.com"]
        }
      }
    }, function() {
  console.log("Proxy activated: " + proxyUrl);
    });
  }