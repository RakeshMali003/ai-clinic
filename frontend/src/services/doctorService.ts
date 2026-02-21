// Doctor Service - API implementation for backend
// Uses HTTP requests to backend API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface Doctor {
    id: number;
    full_name: string;
    specialization?: string;
    qualifications?: string;
    experience_years?: number;
    email: string;
    mobile: string;
    rating?: number;
    totalConsultations?: number;
    availableDays?: string[];
    availableTime?: string;
    status: string;
    date_of_birth?: string;
    medical_council_reg_no: string;
    medical_council_name?: string;
    registration_year?: number;
    university_name?: string;
    graduation_year?: number;
    bio?: string;
    bank_account_name?: string;
    bank_account_number?: string;
    ifsc_code?: string;
    pan_number?: string;
    gstin?: string;
    verification_status: string;
    created_at?: string;
    updated_at?: string;
}

class DoctorService {
    private async getAuthHeaders() {
        const token = localStorage.getItem('auth_token');
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    }

    async getDoctors(): Promise<Doctor[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/doctors`, {
                headers: await this.getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data?.doctors || [];
        } catch (error) {
            console.error('Error fetching doctors:', error);
            throw error;
        }
    }

    async getDoctorById(id: number | string): Promise<Doctor | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/doctors/${id}`, {
                headers: await this.getAuthHeaders(),
            });

            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data || null;
        } catch (error) {
            console.error('Error fetching doctor:', error);
            return null;
        }
    }

    async createDoctor(doctor: any): Promise<Doctor> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/doctors`, {
                method: 'POST',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(doctor),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error creating doctor:', error);
            throw error;
        }
    }

    async updateDoctor(id: number | string, updates: Partial<Doctor>): Promise<Doctor | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/doctors/${id}`, {
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
            console.error('Error updating doctor:', error);
            throw error;
        }
    }

    async deleteDoctor(id: number | string): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/doctors/${id}`, {
                method: 'DELETE',
                headers: await this.getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Error deleting doctor:', error);
            return false;
        }
    }
}

export const doctorService = new DoctorService();
