import time
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from fake_useragent import UserAgent
import undetected_chromedriver as uc  # Avoid bot detection

class TikTokBot:
    def __init__(self, username, password):
        self.username = username
        self.password = password

        # Generate random user agent
        ua = UserAgent()
        options = webdriver.ChromeOptions()
        options.add_argument(f"user-agent={ua.random}")
        options.add_argument("--disable-blink-features=AutomationControlled")  # Hide bot detection
        # options.add_argument("--headless")  # Run in background (remove if you want to see it)
        
        self.driver = uc.Chrome(options=options)  # Undetected Chrome driver
        self.driver.get("https://www.tiktok.com/login")
        time.sleep(random.uniform(5, 8))

    def login(self):
        print("[*] Logging in...")

        try:
            # Dynamically find login elements using XPATH
            username_input = self.driver.find_element(By.XPATH, "//input[@type='text']")
            password_input = self.driver.find_element(By.XPATH, "//input[@type='password']")
            
            username_input.send_keys(self.username)
            password_input.send_keys(self.password)
            time.sleep(random.uniform(2, 4))  # Random pause
            password_input.send_keys(Keys.RETURN)  # Press Enter
            
            time.sleep(random.uniform(8, 12))  # Wait for login
            print("[+] Login successful!")
        except Exception as e:
            print("[X] Login failed:", e)

    def like_videos(self, hashtag):
        print(f"[*] Liking videos under #{hashtag}...")

        self.driver.get(f"https://www.tiktok.com/tag/{hashtag}")
        time.sleep(random.uniform(5, 8))

        videos = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'video-card')]")  # Dynamic selection
        for video in videos[:random.randint(3, 6)]:  # Like a random number of videos
            try:
                video.click()
                time.sleep(random.uniform(2, 5))

                like_button = self.driver.find_element(By.XPATH, "//button[contains(@aria-label, 'Like')]")
                like_button.click()

                time.sleep(random.uniform(5, 10))
                self.driver.find_element(By.XPATH, "//button[contains(@class, 'close')]").click()
            except Exception as e:
                print("[!] Skipping video:", e)

    def comment_on_videos(self, hashtag, comments):
        print(f"[*] Commenting on videos under #{hashtag}...")

        self.driver.get(f"https://www.tiktok.com/tag/{hashtag}")
        time.sleep(random.uniform(5, 8))

        videos = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'video-card')]")  # Dynamic selection
        for video in videos[:random.randint(2, 5)]:  # Comment on a few videos
            try:
                video.click()
                time.sleep(random.uniform(2, 5))

                comment_box = self.driver.find_element(By.XPATH, "//textarea[contains(@placeholder, 'Add comment')]")
                comment_box.click()
                time.sleep(1)

                comment_text = random.choice(comments)  # Pick a random comment
                comment_box.send_keys(comment_text)
                time.sleep(random.uniform(2, 5))
                comment_box.send_keys(Keys.RETURN)

                print(f"[+] Commented: {comment_text}")
                time.sleep(random.uniform(10, 20))  # Delay before next action
                self.driver.find_element(By.XPATH, "//button[contains(@class, 'close')]").click()
            except Exception as e:
                print("[!] Skipping comment:", e)

    def send_messages(self, user_list, messages):
        print("[*] Sending messages...")

        for user in user_list:
            try:
                self.driver.get(f"https://www.tiktok.com/@{user}")
                time.sleep(random.uniform(5, 8))

                message_button = self.driver.find_element(By.XPATH, "//button[contains(@aria-label, 'Message')]")
                message_button.click()
                time.sleep(2)

                message_box = self.driver.find_element(By.XPATH, "//textarea[contains(@placeholder, 'Message')]")
                message_text = random.choice(messages)  # Pick a random message
                message_box.send_keys(message_text)
                time.sleep(random.uniform(2, 5))
                message_box.send_keys(Keys.RETURN)

                print(f"[+] Messaged @{user}: {message_text}")
                time.sleep(random.uniform(10, 20))
            except Exception as e:
                print(f"[!] Skipping user {user}:", e)

    def close(self):
        print("[*] Closing bot...")
        self.driver.quit()

# Example Usage
bot = TikTokBot("your_username", "your_password")
bot.login()

bot.like_videos("fyp")  # Likes videos under #fyp

comments = ["🔥🔥🔥", "This is amazing!", "Wow! 🤯", "So cool!"]
bot.comment_on_videos("funny", comments)  # Comments on random videos

users_to_message = ["random_user1", "random_user2"]
messages = ["Hey! Love your content!", "Keep up the great work! 💯"]
bot.send_messages(users_to_message, messages)  # Sends random messages

bot.close()


