import firebase_admin
from firebase_admin import auth, credentials, firestore

from app.config import settings

# Initialize Firebase Admin SDK
cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
firebase_admin.initialize_app(cred)

# Export clients for use in other modules
auth_client = auth
db = firestore.client()
