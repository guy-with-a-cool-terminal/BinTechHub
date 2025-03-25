import time
import random
import os
from fake_useragent import UserAgent
from instagrapi import Client
from instagrapi.exceptions import LoginRequired, ChallengeRequired
from proxies import ProxyScraper  # Import the ProxyScraper module

class InstagramBot:
    def __init__(self, username, password, target_account):
        self.username = username
        self.password = password
        self.target_account = target_account
        self.session_file = f"{username}_session.json"
        self.client = Client()
        self.ua = UserAgent()
        self.proxy_scraper = ProxyScraper()  # Initialize the ProxyScraper

        # Action Limits (Randomized)
        self.follow_limit_per_burst = random.randint(5, 10)
        self.unfollow_limit_per_burst = random.randint(5, 10)
        self.like_limit_per_burst = random.randint(10, 20)
        self.comment_limit_per_burst = random.randint(3, 7)

        # Cooldowns (Randomized)
        self.follow_cooldown = (30, 90)
        self.unfollow_cooldown = (30, 90)
        self.like_cooldown = (10, 30)
        self.comment_cooldown = (30, 90)
        self.burst_pause = (300, 600)
        self.unfollow_after_days = 7

    # 🔥 Get a working proxy
    def get_random_proxy(self):
        proxy = self.proxy_scraper.get_random_proxy()
        if proxy:
            print(f"✅ Using Proxy: {proxy}")
            return proxy
        print("⚠️ No working proxies available!")
        exit()

    # 🔥 Check if a proxy works
    def check_proxy(self, proxy):
        proxies = {"http": proxy, "https": proxy}
        try:
            response = requests.get("https://api.ipify.org", proxies=proxies, timeout=5)
            if response.status_code == 200:
                print(f"✅ Proxy IP: {response.text}")
                return True
        except requests.RequestException as e:
            print(f"❌ Proxy check failed: {e}")
        return False

    # 🔥 Setup Client with Proxy & User-Agent
    def setup_client(self):
        proxy = self.get_random_proxy()
        self.client.set_proxy(proxy)
        self.client.private.headers["User-Agent"] = self.ua.random
        print(f"🔄 Using Proxy: {proxy} | User-Agent: {self.client.private.headers['User-Agent']}")

    # 🔥 Load session if available
    def load_session(self):
        if os.path.exists(self.session_file):
            try:
                self.client.load_settings(self.session_file)
                self.client.relogin()
                print("✅ Loaded session successfully.")
                return True
            except Exception as e:
                print(f"⚠️ Session expired: {e}")
                os.remove(self.session_file)
        return False

    # 🔥 Save session after login
    def save_session(self):
        self.client.dump_settings(self.session_file)
        print("✅ Session saved successfully.")

    # 🔥 Login to Instagram
    def login(self):
        if self.load_session():
            return

        try:
            self.client.login(self.username, self.password)
            self.save_session()
            print("✅ Logged in successfully.")
        except ChallengeRequired as e:
            print("⚠️ Challenge required! Please manually resolve the challenge.")
            print(f"Error: {e}")
            exit()
        except LoginRequired as e:
            print(f"⚠️ Login failed: {e}")
            exit()
        except Exception as e:
            print(f"⚠️ Error during login: {e}")
            if hasattr(self.client, "last_response"):
                print(f"Instagram Response: {self.client.last_response}")
            exit()

    # 🔥 Get target users (followers of a niche account)
    def get_target_users(self, count=50):
        try:
            user_id = self.client.user_id_from_username(self.target_account)
            print(f"✅ Fetched user ID for {self.target_account}: {user_id}")
            followers = self.client.user_followers(user_id, amount=count)
            print(f"✅ Fetched {len(followers)} followers.")
            return list(followers.values())
        except Exception as e:
            print(f"⚠️ Error getting target users: {e}")
            if hasattr(self.client, "last_response"):
                print(f"Instagram Response: {self.client.last_response.text}")
            return []

    # 🔥 Like recent posts before following
    def like_recent_posts(self, target_users):
        liked_count = 0
        for user in target_users:
            if liked_count >= self.like_limit_per_burst:
                break
            try:
                posts = self.client.user_medias(user.pk, amount=3)
                for post in posts:
                    self.client.media_like(post.id)
                    print(f"❤️ Liked post from {user.username}")
                    liked_count += 1
                    time.sleep(random.randint(*self.like_cooldown))
            except Exception as e:
                print(f"⚠️ Error liking posts of {user.username}: {e}")
                time.sleep(30)

    # 🔥 Follow users in bursts
    def follow_users(self, target_users):
        followed_count = 0
        for user in target_users:
            if followed_count >= self.follow_limit_per_burst:
                print("⏸️ Follow burst complete. Pausing...")
                time.sleep(random.randint(*self.burst_pause))
                break

            try:
                self.client.user_follow(user.pk)
                print(f"✅ Followed: {user.username}")
                followed_count += 1
                time.sleep(random.randint(*self.follow_cooldown))
            except Exception as e:
                print(f"⚠️ Error following {user.username}: {e}")
                time.sleep(60)

    # 🔥 Unfollow non-followers in bursts
    def unfollow_non_followers(self):
        unfollowed_count = 0
        followers = self.client.user_followers(self.client.user_id)
        following = self.client.user_following(self.client.user_id)

        for user in following:
            if unfollowed_count >= self.unfollow_limit_per_burst:
                print("⏸️ Unfollow burst complete. Pausing...")
                time.sleep(random.randint(*self.burst_pause))
                break

            if user.pk not in followers:
                try:
                    self.client.user_unfollow(user.pk)
                    print(f"👋 Unfollowed: {user.username}")
                    unfollowed_count += 1
                    time.sleep(random.randint(*self.unfollow_cooldown))
                except Exception as e:
                    print(f"⚠️ Error unfollowing {user.username}: {e}")
                    time.sleep(60)

    # 🔥 Main Execution Flow
    def run(self):
        self.setup_client()
        self.login()

        # Get target users
        target_users = self.get_target_users(count=50)
        if not target_users:
            print("⚠️ No target users found.")
            return

        # Like posts before following
        self.like_recent_posts(target_users)

        # Follow in bursts
        self.follow_users(target_users)

        # Wait before unfollowing
        print(f"⏳ Waiting {self.unfollow_after_days} days before unfollowing...")
        time.sleep(self.unfollow_after_days * 24 * 60 * 60)

        # Unfollow non-followers
        self.unfollow_non_followers()


# 🔥 Run the Bot
if __name__ == "__main__":
    USERNAME = ""
    PASSWORD = ""
    TARGET_ACCOUNT = "instagram"

    bot = InstagramBot(USERNAME, PASSWORD, TARGET_ACCOUNT)
    bot.run()