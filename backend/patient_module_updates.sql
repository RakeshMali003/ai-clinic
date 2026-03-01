-- Database Updates for Patient Module Enhancements

-- 1. Create patient_documents table (if not exists with exact schema requested)
CREATE TABLE IF NOT EXISTS public.patient_documents (
  id serial not null,
  patient_id character varying null,
  document_type character varying null,
  file_url text null,
  uploaded_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint patient_documents_pkey primary key (id),
  constraint fk_patient_documents_patient foreign KEY (patient_id) references patients (patient_id)
) TABLESPACE pg_default;

-- 2. Create prescriptions table (if not exists with exact schema requested)
CREATE TABLE IF NOT EXISTS public.prescriptions (
  prescription_id character varying not null,
  patient_id character varying null,
  doctor_id integer null,
  appointment_id character varying null,
  diagnosis text null,
  follow_up_date date null,
  notes text null,
  created_at date null default CURRENT_DATE,
  clinic_id integer null,
  constraint prescriptions_pkey primary key (prescription_id),
  constraint fk_prescriptions_appointment foreign KEY (appointment_id) references appointments (appointment_id),
  constraint fk_prescriptions_clinic foreign KEY (clinic_id) references clinics (id),
  constraint fk_prescriptions_doctor foreign KEY (doctor_id) references doctors (id),
  constraint fk_prescriptions_patient foreign KEY (patient_id) references patients (patient_id)
) TABLESPACE pg_default;

-- 3. Create index for prescriptions
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient on public.prescriptions using btree (patient_id) TABLESPACE pg_default;

-- 4. Add clinic_id to medicines
ALTER TABLE public.medicines ADD COLUMN IF NOT EXISTS clinic_id integer;
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_medicines_clinic') THEN
    ALTER TABLE public.medicines ADD CONSTRAINT fk_medicines_clinic FOREIGN KEY (clinic_id) REFERENCES public.clinics (id);
  END IF;
END $$;

-- 5. Create cart_items
CREATE TABLE IF NOT EXISTS public.cart_items (
  id serial PRIMARY KEY,
  patient_id character varying REFERENCES public.patients(patient_id),
  medicine_id character varying REFERENCES public.medicines(medicine_id),
  quantity integer DEFAULT 1,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create order_items
CREATE TABLE IF NOT EXISTS public.order_items (
  id serial PRIMARY KEY,
  order_id integer REFERENCES public.orders(id),
  medicine_id character varying REFERENCES public.medicines(medicine_id),
  quantity integer NOT NULL,
  price_at_order numeric NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create bookmarks
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id serial PRIMARY KEY,
  patient_id character varying REFERENCES public.patients(patient_id),
  medicine_id character varying REFERENCES public.medicines(medicine_id),
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_patient_medicine_bookmark UNIQUE(patient_id, medicine_id)
);

-- 8. Create medicine_reminders
CREATE TABLE IF NOT EXISTS public.medicine_reminders (
  id serial PRIMARY KEY,
  patient_id character varying REFERENCES public.patients(patient_id),
  medicine_name character varying NOT NULL,
  dosage character varying,
  reminder_time time without time zone NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
