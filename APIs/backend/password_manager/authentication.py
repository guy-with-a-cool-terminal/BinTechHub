from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from firebase_admin import auth as firebase_auth
from firebase_admin.auth import InvalidIdTokenError, ExpiredIdTokenError, RevokedIdTokenError
from django.contrib.auth import get_user_model

User = get_user_model()

class FirebaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None  # No token provided, unauthenticated

        try:
            token_type, id_token = auth_header.split(' ')
        except ValueError:
            raise exceptions.AuthenticationFailed('Invalid Authorization header format')

        if token_type != 'Bearer' or not id_token:
            raise exceptions.AuthenticationFailed('Invalid Authorization header format')

        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
        except ExpiredIdTokenError:
            raise exceptions.AuthenticationFailed('Firebase token has expired')
        except RevokedIdTokenError:
            raise exceptions.AuthenticationFailed('Firebase token has been revoked')
        except InvalidIdTokenError:
            raise exceptions.AuthenticationFailed('Invalid Firebase token')
        except Exception:
            raise exceptions.AuthenticationFailed('Failed to authenticate token')

        expected_aud = 'bintechauth'
        expected_iss = f'https://securetoken.google.com/{expected_aud}'

        if decoded_token.get('aud') != expected_aud or decoded_token.get('iss') != expected_iss:
            raise exceptions.AuthenticationFailed('Firebase token audience or issuer invalid')

        uid = decoded_token.get('uid')
        email = decoded_token.get('email')

        if not uid:
            raise exceptions.AuthenticationFailed('UID missing from token')

        user, created = User.objects.get_or_create(firebase_uid=uid)
        if email and user.email != email:
            user.email = email
            user.save(update_fields=['email'])

        return (user, decoded_token)
