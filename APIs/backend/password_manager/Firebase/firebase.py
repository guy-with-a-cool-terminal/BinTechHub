import firebase_admin
import json
import base64
from firebase_admin import credentials
from decouple import config

firebase_cred_b64 = config('FIREBASE_CRED_BASE64')
firebase_cred_json = base64.b64decode(firebase_cred_b64).decode('utf-8')
cred_dict = json.loads(firebase_cred_json)

cred = credentials.Certificate(cred_dict)
firebase_admin.initialize_app(cred)
