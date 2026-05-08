from fastapi import Depends, HTTPException, status
from app.middleware.auth_middleware import get_current_user

def require_roles(*roles):
    def dependency(current_user=Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {roles}"
            )
        return current_user
    return dependency

# Usage examples:
# @router.get("/admin") async def admin_only(user=Depends(require_roles("admin","super_admin")))
# @router.get("/student") async def student_view(user=Depends(require_roles("student")))
