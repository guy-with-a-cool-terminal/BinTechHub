import requests

proxies = {
    "http": "socks5h://brian_proxy:12248326@127.0.0.1:1080",
    "https": "socks5h://brian_proxy:12248326@127.0.0.1:1080",
}

try:
    response = requests.get("https://api.ipify.org", proxies=proxies, timeout=10)
    print("Proxy is working! Your IP:", response.text)
except Exception as e:
    print("Proxy test failed:", e)
