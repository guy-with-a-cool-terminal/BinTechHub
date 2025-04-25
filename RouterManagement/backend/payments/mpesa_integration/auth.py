import base64
import requests
from decouple import config
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

# generate auth token for the mpesa API
def generate_oauth_token():
    
    # mpesa API endpoint and keys from .env
    url = config("MPESA_API_URL")
    consumer_key = config("MPESA_CONSUMER_KEY")
    consumer_secret = config("MPESA_CONSUMER_SECRET")
    
    # combine consumer key and secret key
    auth = base64.b64encode(f"{consumer_key}:{consumer_secret}".encode("utf-8")).decode("utf-8")
    headers ={
        "Authorization": f"Basic {auth}",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    try:
        # make the request
        response = requests.get(url,headers=headers)
        # confirm if it was successful
        if response.status_code == 200:
            # extract access token from response
            token = response.json().get("access_token")
            if not token:
                logger.error("Token generation failed: No token found in response")
                raise Exception("Token generation failed: No token in response")
            logger.info("MPESA OAuth Token generated successfully.")
            return token
        else:
            logger.error(f"Error generating OAuth token. Status code: {response.status_code}, Response: {response.text}")
            raise Exception(f"error generating oauth token:( {response.text}")
    
    except requests.exceptions.RequestException as e:
        logger.error(f"Error during request to generate OAuth token: {str(e)}")
        raise Exception(f"Error during request: {str(e)}")
    