import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { prescriptionService } from "@/lib/prescription-service";
import { CreatePrescriptionRequest } from "@/types";

export function usePrescriptions() {
    return useQuery({
        queryKey: ["prescriptions"],
        queryFn: () => prescriptionService.getPrescriptions(),
    });
}

export function usePrescription(id: string) {
    return useQuery({
        queryKey: ["prescription", id],
        queryFn: () => prescriptionService.getPrescriptionById(id),
        enabled: !!id,
    });
}

export function useUploadPrescription() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (prescriptionData: CreatePrescriptionRequest) => 
            prescriptionService.uploadPrescription(prescriptionData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
        },
    });
}

export function useUploadPrescriptionFile() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ file, prescriptionId }: { file: File; prescriptionId?: string }) => 
            prescriptionService.uploadPrescriptionFile(file, prescriptionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
        },
    });
}

export function useUpdatePrescriptionStatus() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => 
            prescriptionService.updatePrescriptionStatus(id, status),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
            queryClient.invalidateQueries({ queryKey: ["prescription", id] });
        },
    });
}

export function useDeletePrescription() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => prescriptionService.deletePrescription(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
        },
    });
}