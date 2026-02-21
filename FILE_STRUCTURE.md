# 📁 E-Clinic Healthcare System - Complete File Structure

## 🎯 **Overview**
This document outlines the complete file and folder structure for the E-Clinic healthcare management system, including modules for Patients, Doctors, Clinics, and integrated Unique ID + QR-based data sharing.

---

## 📂 **Root Directory Structure**

```
/eclinic_system/
│
├── /app/                           # Next.js App Router (if using Next.js 13+)
│   ├── /patient/
│   │   ├── /view/[id]/page.tsx    # Patient view page (accessed via QR)
│   │   ├── /dashboard/page.tsx    # Patient dashboard
│   │   └── /profile/page.tsx      # Patient profile management
│   │
│   ├── /doctor/
│   │   ├── /dashboard/page.tsx    # Doctor dashboard
│   │   ├── /appointments/page.tsx # Appointment management
│   │   └── /scan/page.tsx         # QR scanner page
│   │
│   ├── /clinic/
│   │   ├── /dashboard/page.tsx    # Clinic admin dashboard
│   │   ├── /staff/page.tsx        # Staff management
│   │   └── /billing/page.tsx      # Billing system
│   │
│   └── /api/                       # API Routes
│       ├── /auth/                  # Authentication endpoints
│       ├── /patients/              # Patient CRUD operations
│       ├── /doctors/               # Doctor CRUD operations
│       ├── /appointments/          # Appointment management
│       ├── /qr/                    # QR code generation & validation
│       └── /health/                # Health records access
│
├── /components/                    # React Components
│   ├── /ui/                        # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   └── ... (all Shadcn components)
│   │
│   ├── /patient/
│   │   ├── PatientDashboard.tsx
│   │   ├── PatientDashboardNew.tsx
│   │   ├── PatientRegistration.tsx
│   │   ├── PatientQRCard.tsx       # ✅ NEW - QR code display
│   │   └── PatientProfile.tsx
│   │
│   ├── /doctor/
│   │   ├── DoctorDashboard.tsx
│   │   ├── DoctorRegistration.tsx
│   │   ├── QRScanner.tsx           # ✅ NEW - QR scanner
│   │   └── PatientSummaryView.tsx
│   │
│   ├── /clinic/
│   │   ├── ClinicDashboard.tsx
│   │   ├── ClinicDashboardTabs.tsx
│   │   ├── ClinicDashboardModules.tsx
│   │   ├── ClinicDashboardComplete.tsx
│   │   └── ClinicRegistration.tsx
│   │
│   ├── /shared/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   └── LoadingSpinner.tsx
│   │
│   └── /auth/
│       ├── LoginWithOTP.tsx
│       ├── GoogleLogin.tsx
│       └── AuthGuard.tsx
│
├── /utils/                         # Utility Functions
│   ├── uniqueIdGenerator.ts        # ✅ NEW - ID generation system
│   ├── qrCodeGenerator.ts          # ✅ NEW - QR code utilities
│   ├── dateFormatter.ts
│   ├── validators.ts
│   ├── apiHelpers.ts
│   └── constants.ts
│
├── /lib/                           # Core Libraries
│   ├── /database/
│   │   ├── schema.ts               # Database schema definitions
│   │   ├── models.ts               # Data models
│   │   ├── migrations/             # Database migrations
│   │   └── seeders/                # Test data seeders
│   │
│   ├── /api/
│   │   ├── client.ts               # API client configuration
│   │   ├── endpoints.ts            # API endpoint definitions
│   │   └── interceptors.ts         # Request/Response interceptors
│   │
│   └── /auth/
│       ├── firebase.ts             # Firebase configuration
│       ├── session.ts              # Session management
│       └── permissions.ts          # Role-based access control
│
├── /data/                          # Data Storage (File-based for demo)
│   ├── /patients/
│   │   ├── /profiles/              # Patient personal details (JSON)
│   │   │   └── PAT-XXXXXXXX.json
│   │   │
│   │   ├── /medical_records/       # Medical history, reports
│   │   │   ├── /prescriptions/
│   │   │   ├── /lab_reports/
│   │   │   └── /diagnostic_images/
│   │   │
│   │   ├── /appointments/          # Appointment data
│   │   │   └── appointments.json
│   │   │
│   │   ├── /uploads/               # Patient uploaded documents
│   │   │   ├── /prescriptions/
│   │   │   ├── /reports/
│   │   │   └── /images/
│   │   │
│   │   └── /qr_codes/              # Generated QR images
│   │       └── qr_PAT-XXXXXXXX.png
│   │
│   ├── /doctors/
│   │   ├── /profiles/              # Doctor details, specializations
│   │   │   └── DOC-XXXXXXXX.json
│   │   │
│   │   ├── /appointments/          # Doctor's appointments
│   │   │   └── appointments.json
│   │   │
│   │   ├── /prescriptions/         # Generated prescriptions
│   │   │   └── RX-XXXXXXXX.pdf
│   │   │
│   │   └── /ai_assist/             # AI-based diagnosis helpers
│   │       ├── /summaries/
│   │       └── /recommendations/
│   │
│   ├── /clinics/
│   │   ├── /profiles/              # Clinic/hospital data
│   │   │   └── CLN-XXXXXXXX.json
│   │   │
│   │   ├── /patient_visits/        # All visit data
│   │   │   └── visits.json
│   │   │
│   │   ├── /billing/               # Invoices & payments
│   │   │   ├── /invoices/
│   │   │   └── /receipts/
│   │   │
│   │   └── /inventory/             # Medicine/equipment inventory
│   │       └── inventory.json
│   │
│   └── /common/
│       ├── /audit_logs/            # System audit logs
│       ├── /qr_scan_logs/          # QR code scan tracking
│       └── /notifications/         # Notification queue
│
├── /public/                        # Static Assets
│   ├── /images/
│   │   ├── logo.png
│   │   ├── hero-image.jpg
│   │   └── /avatars/
│   │
│   ├── /icons/
│   │   ├── favicon.ico
│   │   └── /medical-icons/
│   │
│   └── /documents/
│       ├── privacy-policy.pdf
│       └── terms-of-service.pdf
│
├── /styles/                        # Global Styles
│   ├── globals.css                 # Global CSS + Tailwind
│   ├── variables.css               # CSS variables
│   └── themes.css                  # Theme configurations
│
├── /hooks/                         # Custom React Hooks
│   ├── useAuth.ts                  # Authentication hook
│   ├── usePatientData.ts           # Patient data hook
│   ├── useQRScanner.ts             # QR scanner hook
│   └── useNotification.ts          # Notification hook
│
├── /types/                         # TypeScript Type Definitions
│   ├── patient.ts
│   ├── doctor.ts
│   ├── clinic.ts
│   ├── appointment.ts
│   ├── prescription.ts
│   └── index.ts
│
├── /config/                        # Configuration Files
│   ├── database.config.ts
│   ├── api.config.ts
│   ├── firebase.config.ts
│   └── qr.config.ts
│
├── /tests/                         # Testing
│   ├── /unit/
│   ├── /integration/
│   └── /e2e/
│
├── /scripts/                       # Utility Scripts
│   ├── generateIds.ts              # Bulk ID generation
│   ├── migrateData.ts              # Data migration
│   └── seedDatabase.ts             # Database seeding
│
├── /docs/                          # Documentation
│   ├── API.md                      # API documentation
│   ├── SETUP.md                    # Setup instructions
│   ├── DEPLOYMENT.md               # Deployment guide
│   ├── QR_SYSTEM.md                # QR system guide
│   └── FILE_STRUCTURE.md           # This file
│
├── .env.local                      # Environment variables (local)
├── .env.production                 # Production environment
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── next.config.js                  # Next.js configuration
└── README.md                       # Project README

```

---

## 🔐 **Unique ID System Files**

### Generated IDs Format:

| User Type | Format | Example |
|-----------|--------|---------|
| **Patient** | `PAT-YYYYMMDD-XXXXXX-RRRR` | `PAT-20250113-000123-4567` |
| **Doctor** | `DOC-YYYYMMDD-XXXXX-RRRR` | `DOC-20250113-00045-8901` |
| **Clinic** | `CLN-YYYYMMDD-XXXXX-RRRR` | `CLN-20250113-00012-2345` |
| **ABHA** | `XX-XXXX-XXXX-XXXX` | `12-3456-7890-1234` |
| **Appointment** | `APT-YYYYMMDD-HHMM-XXXX` | `APT-20250113-1030-4567` |
| **Prescription** | `RX-YYYYMMDD-DOCID-XXXX` | `RX-20250113-00045-8901` |
| **Invoice** | `INV-YYYYMMDD-XXXX` | `INV-20250113-4567` |
| **Lab Test** | `LAB-YYYYMMDD-TYPE-XXXX` | `LAB-20250113-CBC-4567` |

### ID Generation Functions:

```typescript
/utils/uniqueIdGenerator.ts
├── generateUniqueHealthID()      // Main ID generator
├── validateHealthID()            // ID validation
├── parseHealthID()               // Extract info from ID
├── generateABHAID()              // ABHA ID generator
├── generateAppointmentID()       // Appointment ID
├── generatePrescriptionID()      // Prescription ID
├── generateInvoiceID()           // Invoice ID
└── generateLabTestID()           // Lab test ID
```

---

## 📱 **QR Code System Files**

### QR Code Types:

1. **Patient Health QR** - Full health record access
2. **Emergency QR** - Critical info only (blood, allergies, contact)
3. **Appointment QR** - Appointment verification
4. **Prescription QR** - Pharmacy verification
5. **Lab Report QR** - Report access

### QR Generation Functions:

```typescript
/utils/qrCodeGenerator.ts
├── generatePatientQRURL()        // Create patient QR URL
├── createPatientQRPayload()      // Prepare QR data
├── prepareQRCodeData()           // Format for QR library
├── validateScannedQR()           // Validate scanned data
├── extractPatientIDFromQR()      // Get ID from QR
├── generateEmergencyQR()         // Emergency card QR
├── generateAppointmentQR()       // Appointment QR
├── generatePrescriptionQR()      // Prescription QR
├── generateLabReportQR()         // Lab report QR
└── logQRScan()                   // Audit trail logging
```

### QR Components:

```typescript
/components/
├── PatientQRCard.tsx             // Display patient QR
│   ├── QR Code Display
│   ├── Download/Print/Share
│   ├── Patient Info
│   └── Usage Instructions
│
└── QRScanner.tsx                 // Scan QR codes
    ├── Camera Integration
    ├── Manual ID Input
    ├── QR Validation
    ├── Patient Data Display
    └── Access Logging
```

---

## 🗄️ **Database Schema Structure**

### Core Tables:

```sql
-- Users Table (Common for all user types)
users
├── id (Primary Key)
├── unique_health_id (Unique)
├── user_type (patient/doctor/clinic)
├── email
├── phone
├── password_hash
├── firebase_uid
├── verified
├── created_at
└── updated_at

-- Patients Table
patients
├── id (Primary Key)
├── user_id (Foreign Key -> users.id)
├── unique_id (e.g., PAT-20250113-000123-4567)
├── abha_id
├── name
├── age
├── gender
├── blood_group
├── emergency_contact
├── allergies (JSON)
├── chronic_conditions (JSON)
├── qr_code_url
└── profile_data (JSON)

-- Doctors Table
doctors
├── id (Primary Key)
├── user_id (Foreign Key -> users.id)
├── unique_id (e.g., DOC-20250113-00045-8901)
├── mci_number
├── specialization
├── qualifications (JSON)
├── experience_years
├── consultation_fee
└── profile_data (JSON)

-- Clinics Table
clinics
├── id (Primary Key)
├── user_id (Foreign Key -> users.id)
├── unique_id (e.g., CLN-20250113-00012-2345)
├── name
├── registration_number
├── gst_number
├── address (JSON)
├── departments (JSON)
├── facilities (JSON)
└── profile_data (JSON)

-- QR Codes Table
qr_codes
├── id (Primary Key)
├── qr_type (patient/appointment/prescription/lab)
├── entity_id (Patient/Appointment/etc ID)
├── unique_id (Health ID)
├── qr_data (Encoded data)
├── qr_url (Generated QR image URL)
├── is_active
├── expires_at
├── created_at
└── updated_at

-- QR Scan Logs (Audit Trail)
qr_scan_logs
├── id (Primary Key)
├── qr_id (Foreign Key -> qr_codes.id)
├── scanned_by_id (User ID who scanned)
├── scanned_by_type (doctor/clinic/pharmacy)
├── scan_timestamp
├── location (JSON - lat/lng)
├── device_info
└── access_granted (boolean)

-- Appointments Table
appointments
├── id (Primary Key)
├── appointment_id (e.g., APT-20250113-1030-4567)
├── patient_id (Foreign Key)
├── doctor_id (Foreign Key)
├── clinic_id (Foreign Key)
├── appointment_date
├── appointment_time
├── token_number
├── status
├── qr_code_id (Foreign Key -> qr_codes.id)
└── notes (JSON)

-- Medical Records Table
medical_records
├── id (Primary Key)
├── patient_id (Foreign Key)
├── doctor_id (Foreign Key)
├── visit_date
├── diagnosis
├── symptoms (JSON)
├── vitals (JSON)
├── prescription_id
├── lab_reports (JSON)
└── notes

-- Prescriptions Table
prescriptions
├── id (Primary Key)
├── prescription_id (e.g., RX-20250113-00045-8901)
├── patient_id (Foreign Key)
├── doctor_id (Foreign Key)
├── medicines (JSON)
├── diagnosis
├── instructions
├── valid_until
├── qr_code_id (Foreign Key)
└── created_at

-- Lab Reports Table
lab_reports
├── id (Primary Key)
├── report_id (e.g., LAB-20250113-CBC-4567)
├── patient_id (Foreign Key)
├── test_type
├── results (JSON)
├── file_url
├── report_date
├── qr_code_id (Foreign Key)
└── notes
```

---

## 🔄 **Data Flow Architecture**

### Patient Registration → QR Generation:

```
1. Patient Registers
   ↓
2. System generates Unique ID (PAT-XXXXXXXX-XXXXXX-XXXX)
   ↓
3. System generates ABHA ID (if not provided)
   ↓
4. Patient data stored in database
   ↓
5. QR Code generated with Unique ID
   ↓
6. QR image saved to /data/patients/qr_codes/
   ↓
7. QR URL stored in patient record
   ↓
8. Patient can view/download/print QR from dashboard
```

### QR Scan → Data Access:

```
1. Doctor scans Patient QR Code
   ↓
2. System validates QR data
   ↓
3. Extract Patient Unique ID from QR
   ↓
4. Log scan event (who, when, where)
   ↓
5. Check scanner permissions (RBAC)
   ↓
6. Fetch patient data from database
   ↓
7. Display patient summary to doctor
   ↓
8. Doctor can view:
   - Personal info
   - Medical history
   - Current medications
   - Allergies & conditions
   - Recent reports
```

---

## 🔒 **Security & Privacy**

### Access Control:

```
/lib/auth/permissions.ts

Roles:
├── Patient
│   ├── View own data
│   ├── Download own QR
│   └── Share QR with doctors
│
├── Doctor
│   ├── Scan patient QR
│   ├── View patient data (after scan)
│   ├── Create prescriptions
│   └── Update medical records
│
├── Clinic Admin
│   ├── Manage clinic data
│   ├── View all patients (clinic)
│   ├── Manage doctors & staff
│   └── Access billing & reports
│
└── System Admin
    └── Full access
```

### Data Encryption:

- Patient data encrypted at rest
- QR codes use HTTPS URLs
- API calls use JWT tokens
- Scan logs encrypted

---

## 📊 **API Endpoints Structure**

```
/api/
│
├── /auth/
│   ├── POST /login              # User login
│   ├── POST /register           # User registration
│   ├── POST /verify-otp         # OTP verification
│   └── POST /logout             # User logout
│
├── /patients/
│   ├── GET  /patients/:id       # Get patient data
│   ├── POST /patients           # Create patient
│   ├── PUT  /patients/:id       # Update patient
│   ├── GET  /patients/:id/qr    # Get patient QR
│   └── GET  /patients/:id/records # Medical records
│
├── /doctors/
│   ├── GET  /doctors/:id        # Get doctor data
│   ├── POST /doctors            # Create doctor
│   └── GET  /doctors/:id/patients # Doctor's patients
│
├── /qr/
│   ├── POST /qr/generate        # Generate QR code
│   ├── POST /qr/validate        # Validate scanned QR
│   ├── GET  /qr/:id             # Get QR data
│   └── POST /qr/log-scan        # Log QR scan
│
├── /appointments/
│   ├── GET  /appointments       # List appointments
│   ├── POST /appointments       # Create appointment
│   ├── PUT  /appointments/:id   # Update appointment
│   └── GET  /appointments/:id/qr # Appointment QR
│
└── /prescriptions/
    ├── POST /prescriptions      # Create prescription
    ├── GET  /prescriptions/:id  # Get prescription
    └── GET  /prescriptions/:id/qr # Prescription QR
```

---

## 🚀 **Deployment Structure**

```
Production Environment:
├── Frontend (Vercel/Netlify)
├── Backend API (Node.js/Django on AWS/GCP)
├── Database (PostgreSQL/MongoDB)
├── File Storage (AWS S3/Google Cloud Storage)
│   └── QR Code Images
├── CDN (CloudFlare)
└── Monitoring (Sentry/LogRocket)
```

---

## 📝 **Key Files Summary**

| File | Purpose | Location |
|------|---------|----------|
| `uniqueIdGenerator.ts` | Generate all unique IDs | `/utils/` |
| `qrCodeGenerator.ts` | QR code generation & validation | `/utils/` |
| `PatientQRCard.tsx` | Display patient QR code | `/components/` |
| `QRScanner.tsx` | Scan QR codes | `/components/` |
| `schema.ts` | Database schema | `/lib/database/` |
| `FILE_STRUCTURE.md` | This documentation | `/docs/` |

---

## ✅ **Implementation Checklist**

- [x] Unique ID generation system
- [x] QR code generation utilities
- [x] Patient QR card component
- [x] QR scanner component
- [x] File structure documentation
- [ ] Database migration scripts
- [ ] API endpoint implementation
- [ ] Authentication system
- [ ] Role-based access control
- [ ] File upload system
- [ ] QR scan audit logging
- [ ] Production deployment

---

**Built with ❤️ for E-Clinic Healthcare Platform**
