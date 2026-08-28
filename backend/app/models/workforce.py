"""
Workforce Management: Shifts, Biometric Attendance, Payroll Runs.
"""
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import uuid


class ShiftType(str, Enum):
    MORNING_OPENING = "MORNING_OPENING"
    AFTERNOON_LUNCH = "AFTERNOON_LUNCH"
    EVENING_DINNER = "EVENING_DINNER"
    LATE_NIGHT_CLOSING = "LATE_NIGHT_CLOSING"
    FULL_DAY_DOUBLE = "FULL_DAY_DOUBLE"


class RestaurantEmployee(Base):
    __tablename__ = "restaurant_employees"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    branch_id: Mapped[str] = mapped_column(String(36), nullable=False)
    employee_code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    full_name: Mapped[str] = mapped_column(String(200), nullable=False)
    job_title: Mapped[str] = mapped_column(String(100), nullable=False)  # Head Chef, Sous Chef, Floor Manager, Waiter, Bartender, Cashier
    department: Mapped[str] = mapped_column(String(100), default="Kitchen")  # Kitchen, Service, Bar, Management
    hourly_rate: Mapped[float] = mapped_column(Float, default=18.50)
    monthly_base_salary: Mapped[float] = mapped_column(Float, default=3200.00)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    joined_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class ShiftAttendanceLog(Base):
    __tablename__ = "shift_attendance_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    employee_id: Mapped[str] = mapped_column(String(36), ForeignKey("restaurant_employees.id"), nullable=False)
    shift_type: Mapped[ShiftType] = mapped_column(SQLEnum(ShiftType), default=ShiftType.EVENING_DINNER)
    clock_in_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    clock_out_time: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    hours_worked: Mapped[float] = mapped_column(Float, default=0.0)
    overtime_hours: Mapped[float] = mapped_column(Float, default=0.0)
    shift_opening_cash_float: Mapped[float] = mapped_column(Float, default=200.00)
    shift_closing_cash_actual: Mapped[float] = mapped_column(Float, default=0.0)
    cash_variance: Mapped[float] = mapped_column(Float, default=0.0)

    employee: Mapped["RestaurantEmployee"] = relationship("RestaurantEmployee")
