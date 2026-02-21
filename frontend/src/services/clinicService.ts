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

    async getClinics(): Promise<Clinic[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics`, {
                headers: await this.getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching clinics:', error);
            throw error;
        }
    }

    async getClinicById(id: number | string): Promise<Clinic | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/${id}`, {
                headers: await this.getAuthHeaders(),
            });

            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data || null;
        } catch (error) {
            console.error('Error fetching clinic:', error);
            return null;
        }
    }

    async createClinic(clinic: any): Promise<Clinic> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics`, {
                method: 'POST',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(clinic),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error creating clinic:', error);
            throw error;
        }
    }

    async updateClinic(id: number | string, updates: Partial<Clinic>): Promise<Clinic | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/${id}`, {
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
            console.error('Error updating clinic:', error);
            throw error;
        }
    }

    async deleteClinic(id: number | string): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/clinics/${id}`, {
                method: 'DELETE',
                headers: await this.getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Error deleting clinic:', error);
            return false;
        }
    }
}

export const clinicService = new ClinicService();
