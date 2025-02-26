import requests
from bs4 import BeautifulSoup
import random
import json
from concurrent.futures import ThreadPoolExecutor
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

class ProxyScraper:
    def __init__(self):
        self.proxy_sources = [
            "https://free-proxy-list.net/",
            "https://www.sslproxies.org/",
            "https://www.us-proxy.org/",
        ]
        self.working_proxies = []
        self.proxy_file = "working_proxies.json"
        self.session = self._create_session()

    def _create_session(self):
        """Create a requests session with retry logic."""
        session = requests.Session()
        retries = Retry(
            total=3,  # Maximum number of retries
            backoff_factor=1,  # Delay between retries
            status_forcelist=[500, 502, 503, 504],  # Retry on these status codes
        )
        adapter = HTTPAdapter(max_retries=retries)
        session.mount("http://", adapter)
        session.mount("https://", adapter)
        return session

    def scrape_proxies(self):
        """Scrape proxies from multiple sources."""
        proxies = []
        for url in self.proxy_sources:
            try:
                response = self.session.get(url, timeout=10)
                soup = BeautifulSoup(response.text, "html.parser")
                table = soup.find("table", class_="table table-striped table-bordered")
                for row in table.find_all("tr")[1:]:  # Skip header row
                    columns = row.find_all("td")
                    ip = columns[0].text
                    port = columns[1].text
                    proxy_type = "https" if columns[6].text == "yes" else "http"
                    proxies.append(f"{proxy_type}://{ip}:{port}")
            except Exception as e:
                print(f"⚠️ Error scraping {url}: {e}")
        return proxies

    def validate_proxy(self, proxy):
        """Check if a proxy is working."""
        try:
            response = self.session.get(
                "https://api.ipify.org",
                proxies={"http": proxy, "https": proxy},
                timeout=10,
            )
            if response.status_code == 200:
                print(f"✅ Working Proxy: {proxy} | IP: {response.text}")
                return proxy
        except requests.RequestException as e:
            print(f"❌ Failed Proxy: {proxy} | Error: {e}")
        return None

    def validate_proxies(self, proxies):
        """Validate a list of proxies using multithreading."""
        with ThreadPoolExecutor(max_workers=10) as executor:
            results = executor.map(self.validate_proxy, proxies)
        self.working_proxies = [proxy for proxy in results if proxy is not None]

    def save_proxies(self):
        """Save working proxies to a file."""
        with open(self.proxy_file, "w") as f:
            json.dump(self.working_proxies, f)
        print(f"✅ Saved {len(self.working_proxies)} proxies to {self.proxy_file}")

    def load_proxies(self):
        """Load working proxies from a file."""
        try:
            with open(self.proxy_file, "r") as f:
                self.working_proxies = json.load(f)
            print(f"✅ Loaded {len(self.working_proxies)} proxies from {self.proxy_file}")
        except FileNotFoundError:
            print("⚠️ No proxy file found. Please scrape and validate proxies first.")

    def get_random_proxy(self):
        """Get a random working proxy."""
        if not self.working_proxies:
            self.load_proxies()
        return random.choice(self.working_proxies) if self.working_proxies else None

    def run(self):
        """Run the proxy scraper and validator."""
        print("🚀 Scraping proxies...")
        proxies = self.scrape_proxies()
        print(f"🔍 Found {len(proxies)} proxies. Validating...")
        self.validate_proxies(proxies)
        self.save_proxies()


# Example Usage
if __name__ == "__main__":
    scraper = ProxyScraper()
    scraper.run()  # Scrape and validate proxies
    print("Random Proxy:", scraper.get_random_proxy())