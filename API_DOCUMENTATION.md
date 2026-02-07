# CoursePilot API Endpoints

## Quick Setup (Backend)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Add firebase-service-account.json (get from team)
# Create .env with: FIREBASE_CREDENTIALS_PATH=./firebase-service-account.json
uvicorn app.main:app --reload
```

Server runs at `http://localhost:8000`

---

**Base URL:** `http://localhost:8000` (dev) | TBD (prod)

**Auth:** All endpoints except `/health` require header: `Authorization: Bearer <firebase_jwt_token>`

**Interactive Docs:** `http://localhost:8000/docs`

---

## Endpoints

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | API info |
| GET | `/health` | No | Health check |

---

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/users/me` | Yes | Get current user profile |
| PATCH | `/api/v1/users/me` | Yes | Update current user profile |
| DELETE | `/api/v1/users/me` | Yes | Delete account (permanent) |

**GET /api/v1/users/me**
- Returns user profile from Firestore
- Auto-creates user on first request

**PATCH /api/v1/users/me**
- Partial update - only send fields you want to change
- Updateable: `display_name`, `phone_number`, `preferences`, `is_onboarded`

**DELETE /api/v1/users/me**
- Deletes Firestore document + Firebase Auth user
- Irreversible

---

## Planned Endpoints (Not Yet Built)

| Method | Endpoint | Description | Owner |
|--------|----------|-------------|-------|
| POST | `/api/v1/syllabi/upload` | Upload syllabus | AI Team |
| GET | `/api/v1/events` | Get calendar events | Events Team |
| PATCH | `/api/v1/events/{id}` | Update event | Events Team |
