from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, students, faculty, attendance, fees, hostel, exams, events, notifications, admin, feedback, timetable

app = FastAPI(title="College ERP API", version="1.0.0", docs_url="/api/docs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://yourdomain.com"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

for router in [auth.router, students.router, faculty.router, attendance.router,
               fees.router, hostel.router, exams.router, events.router,
               notifications.router, admin.router, feedback.router, timetable.router]:
    app.include_router(router)

@app.get("/api/health")
def health(): return {"status": "ok", "version": "1.0.0"}
  # Run backend
uvicorn app.main:app --reload --port 8000
# Visit: http://localhost:8000/api/docs  (auto Swagger UI)
from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def root():
    return {"status": "ok"}
