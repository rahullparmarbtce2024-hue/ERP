from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.student import Student
from app.middleware.rbac import require_roles
import qrcode, io, cloudinary.uploader

router = APIRouter(prefix="/api/students", tags=["Students"])

@router.get("/")
async def get_students(
    page: int = 1, limit: int = 20,
    department: str = None, semester: int = None,
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin","super_admin","faculty","mentor"))
):
    query = db.query(Student)
    if department: query = query.filter(Student.department == department)
    if semester: query = query.filter(Student.semester == semester)
    total = query.count()
    students = query.offset((page-1)*limit).limit(limit).all()
    return {"total": total, "page": page, "data": students}

@router.get("/{student_id}")
async def get_student(student_id: str, db: Session = Depends(get_db),
    user=Depends(require_roles("admin","super_admin","faculty","student","parent"))):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.post("/{student_id}/generate-qr")
async def generate_qr(student_id: str, db: Session = Depends(get_db),
    user=Depends(require_roles("admin","super_admin"))):
    student = db.query(Student).filter(Student.id == student_id).first()
    qr_data = f"STUDENT:{student.enrollment_number}:{student.full_name}"
    qr_img = qrcode.make(qr_data)
    buf = io.BytesIO()
    qr_img.save(buf, format="PNG")
    buf.seek(0)
    result = cloudinary.uploader.upload(buf, folder="qr_codes")
    student.qr_code_url = result["secure_url"]
    db.commit()
    return {"qr_code_url": result["secure_url"]}

@router.post("/{student_id}/upload-photo")
async def upload_photo(student_id: str, file: UploadFile = File(...),
    db: Session = Depends(get_db), user=Depends(require_roles("admin","super_admin","student"))):
    student = db.query(Student).filter(Student.id == student_id).first()
    result = cloudinary.uploader.upload(await file.read(), folder="profile_photos")
    student.profile_photo_url = result["secure_url"]
    db.commit()
    return {"photo_url": result["secure_url"]}
