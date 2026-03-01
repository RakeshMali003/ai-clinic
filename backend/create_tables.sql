CREATE TABLE IF NOT EXISTS public.patient_documents (
  id serial NOT NULL,
  patient_id character varying NULL,
  document_type character varying NULL,
  file_url text NULL,
  file_name character varying NULL,
  uploaded_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT patient_documents_pkey PRIMARY KEY (id),
  CONSTRAINT fk_patient_documents_patient FOREIGN KEY (patient_id) REFERENCES patients (patient_id)
);

CREATE INDEX IF NOT EXISTS idx_patient_documents_patient ON public.patient_documents USING btree (patient_id);

CREATE TABLE IF NOT EXISTS public.prescriptions (
  prescription_id character varying NOT NULL,
  patient_id character varying NULL,
  doctor_id integer NULL,
  appointment_id character varying NULL,
  diagnosis text NULL,
  follow_up_date date NULL,
  notes text NULL,
  created_at date NULL DEFAULT CURRENT_DATE,
  clinic_id integer NULL,
  CONSTRAINT prescriptions_pkey PRIMARY KEY (prescription_id),
  CONSTRAINT fk_prescriptions_patient FOREIGN KEY (patient_id) REFERENCES patients (patient_id)
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON public.prescriptions USING btree (patient_id);

CREATE TABLE IF NOT EXISTS public.orders (
  id serial NOT NULL,
  patient_id character varying NULL,
  order_type character varying NULL DEFAULT 'medicine',
  items jsonb NULL DEFAULT '[]',
  total_amount numeric NULL DEFAULT 0,
  status character varying NULL DEFAULT 'pending',
  delivery_address text NULL,
  created_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT fk_orders_patient FOREIGN KEY (patient_id) REFERENCES patients (patient_id)
);

CREATE INDEX IF NOT EXISTS idx_orders_patient ON public.orders USING btree (patient_id);
