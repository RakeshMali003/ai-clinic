// Clinic Service - API implementation for backend
// Uses HTTP requests to backend API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface Clinic {
    id: number;
    clinic_name: string;
    establishment_year?: number;
    tagline?: string;
    description?: string;
    address: string;
    landmark?: string;
    pin_code: string;
    city: string;
    state: string;
    mobile: string;
    email: string;
    website?: string;
    medical_council_reg_no: string;
    bank_account_name?: string;
    bank_account_number?: string;
    ifsc_code?: string;
    pan_number?: string;
    gstin?: string;
    verification_status: string;
    created_at?: string;
    updated_at?: string;
}

class ClinicService {
    private async getAuthHeaders() {
        const token = localStorage.getItem('auth_token');
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    }

    // 1 & 2. Profile Management
    async getProfile(): Promise<Clinic | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/profile`, {
                headers: await this.getAuthHeaders(),
            });

            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data || null;
        } catch (error) {
            console.error('Error fetching clinic profile:', error);
            return null;
        }
    }

    async updateProfile(updates: Partial<Clinic>): Promise<Clinic | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/profile`, {
                method: 'PUT',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data || null;
        } catch (error) {
            console.error('Error updating clinic profile:', error);
            throw error;
        }
    }

    // 12. Reports & Analytics
    async getReports(): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/reports`, {
                headers: await this.getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error fetching clinic reports:', error);
            throw error;
        }
    }

    // 3. Patient Management
    async getPatients(type?: 'today' | 'upcoming' | 'completed'): Promise<any[]> {
        try {
            const url = type ? `${API_BASE_URL}/api/clinics/patients/${type}` : `${API_BASE_URL}/api/clinics/patients`;
            const response = await fetch(url, {
                headers: await this.getAuthHeaders(),
            });
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error(`Error fetching patients:`, error);
            return [];
        }
    }

    async getAllPatients(): Promise<any[]> {
        try {
            // Reusing existing endpoint or adding a simpler one if needed
            // For now, we'll fetch today's and filter or just use a dedicated one if we had it.
            // Actually, let's assume getPatients('today') or similar for base access if needed
            // But usually we need all patients. I'll use a generic patients endpoint if it exists.
            const response = await fetch(`${API_BASE_URL}/api/clinics/appointments`, {
                headers: await this.getAuthHeaders(),
            });
            const result = await response.json();
            // Extract unique patients from appointments or use a dedicated patient list if available
            return result.data?.map((a: any) => a.patient) || [];
        } catch (error) {
            console.error('Error fetching all patients:', error);
            return [];
        }
    }

    // 5. Queue Management
    async getQueue(): Promise<any[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/queue`, {
                headers: await this.getAuthHeaders(),
            });
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching queue:', error);
            return [];
        }
    }

    // 6. Doctor Management
    async getDoctors(): Promise<any[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/doctors`, {
                headers: await this.getAuthHeaders(),
            });
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching clinic doctors:', error);
            return [];
        }
    }

    async registerDoctor(doctorData: any): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/doctors`, {
                method: 'POST',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(doctorData),
            });
            return response.ok;
        } catch (error) {
            console.error('Error registering doctor:', error);
            return false;
        }
    }

    async addDoctor(doctorId: number | string): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/doctors`, {
                method: 'POST',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify({ doctor_id: doctorId }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error adding doctor to clinic:', error);
            return false;
        }
    }

    async removeDoctor(doctorId: number | string): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/doctors/${doctorId}`, {
                method: 'DELETE',
                headers: await this.getAuthHeaders(),
            });
            return response.ok;
        } catch (error) {
            console.error('Error removing doctor from clinic:', error);
            return false;
        }
    }

    // 7. Staff Management
    async getStaff(): Promise<any[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/staff`, {
                headers: await this.getAuthHeaders(),
            });
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching clinic staff:', error);
            return [];
        }
    }

    async addStaff(staffData: any): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/staff`, {
                method: 'POST',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(staffData),
            });
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error adding staff member:', error);
            throw error;
        }
    }

    async updateStaff(staffId: number | string, updates: any): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/staff/${staffId}`, {
                method: 'PUT',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(updates),
            });
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error updating staff member:', error);
            throw error;
        }
    }

    async deleteStaff(staffId: number | string): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/staff/${staffId}`, {
                method: 'DELETE',
                headers: await this.getAuthHeaders(),
            });
            return response.ok;
        } catch (error) {
            console.error('Error deleting staff member:', error);
            return false;
        }
    }

    // 8. Prescription & Medical Records
    async getPrescriptions(): Promise<any[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/prescriptions`, {
                headers: await this.getAuthHeaders(),
            });
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            return [];
        }
    }

    // 9. Lab & Diagnostics
    async getLabs(): Promise<any[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/labs`, {
                headers: await this.getAuthHeaders(),
            });
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching labs:', error);
            return [];
        }
    }

    async getLabOrders(): Promise<any[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/labs/orders`, {
                headers: await this.getAuthHeaders(),
            });
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching lab orders:', error);
            return [];
        }
    }

    async createLabOrder(orderData: any): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/labs/orders`, {
                method: 'POST',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(orderData),
            });
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error creating lab order:', error);
            throw error;
        }
    }

    async addLab(labData: any): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/labs`, {
                method: 'POST',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(labData),
            });
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error adding lab test:', error);
            throw error;
        }
    }

    // 10. Billing & Payments
    async getBilling(): Promise<any[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/billing`, {
                headers: await this.getAuthHeaders(),
            });
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching billing data:', error);
            return [];
        }
    }

    async createInvoice(invoiceData: any): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/billing`, {
                method: 'POST',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(invoiceData),
            });
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error creating invoice:', error);
            throw error;
        }
    }

    async updateInvoiceStatus(invoiceId: string, updates: any): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/billing/${invoiceId}`, {
                method: 'PUT',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(updates),
            });
            return response.ok;
        } catch (error) {
            console.error('Error updating invoice status:', error);
            return false;
        }
    }

    // Legacy support for older components
    async getClinics(): Promise<Clinic[]> {
        const profile = await this.getProfile();
        return profile ? [profile] : [];
    }

    async updateClinic(_id: any, updates: Partial<Clinic>): Promise<Clinic | null> {
        return this.updateProfile(updates);
    }

    // 13. Notifications
    async getNotifications(): Promise<any[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/notifications`, {
                headers: await this.getAuthHeaders(),
            });
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching clinic notifications:', error);
            return [];
        }
    }

    // 14. Settings
    async getSettings(): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/settings`, {
                headers: await this.getAuthHeaders(),
            });
            const result = await response.json();
            return result.data || {};
        } catch (error) {
            console.error('Error fetching clinic settings:', error);
            return {};
        }
    }

    async updateSettings(settings: any): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/settings`, {
                method: 'PUT',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(settings),
            });
            return response.ok;
        } catch (error) {
            console.error('Error updating clinic settings:', error);
            return false;
        }
    }

    // Pharmacy & Inventory (Medicines)
    async getMedicines(mineOnly: boolean = false): Promise<any[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/medicines?mine=${mineOnly}`, {
                headers: await this.getAuthHeaders(),
            });
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching medicines:', error);
            return [];
        }
    }

    async addMedicine(medicineData: any): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/medicines`, {
                method: 'POST',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(medicineData),
            });
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error adding medicine:', error);
            throw error;
        }
    }

    // 4. Appointment Management
    async getAppointments(): Promise<any[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/appointments`, {
                headers: await this.getAuthHeaders(),
            });
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching appointments:', error);
            return [];
        }
    }

    async createAppointment(appointmentData: any): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/appointments`, {
                method: 'POST',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(appointmentData),
            });
            return response.ok;
        } catch (error) {
            console.error('Error creating appointment:', error);
            return false;
        }
    }
    async updateAppointment(appointmentId: string | number, updates: any): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/appointments/${appointmentId}`, {
                method: 'PUT',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(updates),
            });
            return response.ok;
        } catch (error) {
            console.error('Error updating appointment:', error);
            return false;
        }
    }

    async deleteAppointment(appointmentId: string | number): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/appointments/${appointmentId}`, {
                method: 'DELETE',
                headers: await this.getAuthHeaders(),
            });
            return response.ok;
        } catch (error) {
            console.error('Error deleting appointment:', error);
            return false;
        }
    }
}

export const clinicService = new ClinicService();
