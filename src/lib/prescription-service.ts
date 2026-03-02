import apiClient from "./api-client";
import { Prescription, CreatePrescriptionRequest } from "@/types";

export const prescriptionService = {
    /**
     * Get all prescriptions for the current user
     */
    async getPrescriptions(): Promise<Prescription[]> {
        const { data } = await apiClient.get("/prescriptions");
        return data;
    },

    /**
     * Get a specific prescription by ID
     */
    async getPrescriptionById(id: string): Promise<Prescription> {
        const { data } = await apiClient.get(`/prescriptions/${id}`);
        return data;
    },

    /**
     * Upload a new prescription
     */
    async uploadPrescription(prescriptionData: CreatePrescriptionRequest): Promise<Prescription> {
        const { data } = await apiClient.post("/prescriptions", prescriptionData);
        return data;
    },

    /**
     * Upload prescription image/file
     */
    async uploadPrescriptionFile(file: File, prescriptionId?: string): Promise<{
        url: string;
        prescriptionId: string;
    }> {
        const formData = new FormData();
        formData.append('file', file);
        if (prescriptionId) {
            formData.append('prescriptionId', prescriptionId);
        }

        const { data } = await apiClient.post("/prescriptions/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },

    /**
     * Update prescription status
     */
    async updatePrescriptionStatus(id: string, status: string): Promise<Prescription> {
        const { data } = await apiClient.patch(`/prescriptions/${id}/status`, { status });
        return data;
    },

    /**
     * Delete a prescription
     */
    async deletePrescription(id: string): Promise<void> {
        await apiClient.delete(`/prescriptions/${id}`);
    }
};