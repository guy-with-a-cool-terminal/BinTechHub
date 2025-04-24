import base64
import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

def generate_oauth_token():
    # Mpesa API endpoint for token generation
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    
    # Combine the consumer key and secret key
    auth = base64.b64encode(f"{settings.MPESA_CONSUMER_KEY}:{settings.MPESA_CONSUMER_SECRET}".encode("utf-8")).decode("utf-8")
    
    headers = {
        "Authorization": f"Basic {auth}",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    
    try:
        # Make the request to the MPesa API
        response = requests.get(url, headers=headers)
        
        # Check if the request was successful
        if response.status_code == 200:
            # Extract the access token from the response
            token = response.json().get("access_token")
            if not token:
                logger.error("Token generation failed: No token found in response")
                raise Exception("Token generation failed: No token in response")
            logger.info("MPESA OAuth Token generated successfully.")
            return token
        else:
            logger.error(f"Error generating OAuth token. Status code: {response.status_code}, Response: {response.text}")
            raise Exception(f"Error generating OAuth token: {response.text}")
    
    except requests.exceptions.RequestException as e:
        # Catch any exceptions from the HTTP request
        logger.error(f"Error during request to generate OAuth token: {str(e)}")
        raise Exception(f"Error during request: {str(e)}")
