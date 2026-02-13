import firebase_admin
from firebase_admin import auth, credentials, firestore, storage

from app.config import settings

# Initialize Firebase Admin SDK
cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
firebase_admin.initialize_app(
    cred, {"storageBucket": settings.FIREBASE_STORAGE_BUCKET}
)

# Export clients for use in other modules
auth_client = auth
db = firestore.client()
storage_bucket = storage.bucket()
