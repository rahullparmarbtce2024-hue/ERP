from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.attendance import Attendance
from app.middleware.rbac import require_roles
from datetime import date

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])

@router.post("/mark")
async def mark_attendance(records: list[dict], db: Session = Depends(get_db),
    user=Depends(require_roles("faculty","admin","warden"))):
    created = []
    for r in records:
        record = Attendance(**r, faculty_id=str(user.id))
        db.add(record)
        created.append(record)
    db.commit()
    return {"marked": len(created)}

@router.get("/student/{student_id}/summary")
async def student_attendance_summary(student_id: str, db: Session = Depends(get_db)):
    total = db.query(Attendance).filter(Attendance.student_id == student_id).count()
    present = db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.status == "present"
    ).count()
    percentage = round((present / total * 100), 2) if total > 0 else 0
    return {"total_classes": total, "present": present, "percentage": percentage,
            "low_attendance": percentage < 75}

@router.get("/low-attendance")
async def get_low_attendance_students(threshold: int = 75, db: Session = Depends(get_db),
    user=Depends(require_roles("admin","super_admin","faculty"))):
    # Returns students with < threshold% attendance
    subquery = db.query(
        Attendance.student_id,
        (func.sum(func.case((Attendance.status == 'present', 1), else_=0)) * 100.0 /
         func.count(Attendance.id)).label('percentage')
    ).group_by(Attendance.student_id).subquery()

    low = db.query(subquery).filter(subquery.c.percentage < threshold).all()
    return {"students": [{"student_id": r.student_id, "percentage": round(r.percentage, 2)} for r in low]}
