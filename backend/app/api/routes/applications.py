
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...database import get_db
from ...models.application import Application
from ...schemas.extraction import (
    ApplicationCreate,
    ApplicationOut,
    ApplicationStatusUpdate
)
from ...services.sheets import append_to_sheet

router = APIRouter(prefix="/api/applications", tags=["applications"])


@router.post("", response_model=ApplicationOut)
def create_application(
    payload: ApplicationCreate,
    db: Session = Depends(get_db)
):
    app = Application(
        **payload.model_dump(exclude={"required_skills"}),
        required_skills=payload.required_skills,
        application_date=date.today(),
    )

    db.add(app)
    db.commit()
    db.refresh(app)

    result = ApplicationOut.model_validate(app)

    try:
        append_to_sheet(result.model_dump(mode="json"))
    except Exception as e:
        print(f"[sheets] sync échouée (non bloquant): {e}")

    return result


@router.get("", response_model=list[ApplicationOut])
def list_applications(db: Session = Depends(get_db)):
    apps = (
        db.query(Application)
        .order_by(Application.application_date.desc())
        .all()
    )

    return [ApplicationOut.model_validate(a) for a in apps]

    
@router.patch("/{application_id}/status", response_model=ApplicationOut)
def update_application_status(
    application_id: int,
    payload: ApplicationStatusUpdate,
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(
        Application.id == application_id
    ).first()

    if app is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    app.status = payload.status

    db.commit()
    db.refresh(app)

    try:
        from ...services.sheets import update_status_in_sheet
        update_status_in_sheet(app.id, app.status)
    except Exception as e:
        print(f"Google Sheets status sync failed: {e}")

    return ApplicationOut.model_validate(app)
