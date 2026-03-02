export interface Medicine {
    id: string | number;
    name: string;
    brand?: string;
    category?: string;
    price: number;
    description?: string;
    image?: string;
    rating?: number;
    stock?: number;
    inStock: boolean;
    rxRequired: boolean;
    requiresPrescription?: boolean; // Alias for rxRequired
    dosage?: string;
    sideEffects?: string[];
}

export type Category = "Pain Relief" | "Antibiotic" | "Vitamins" | "Digestive" | "Allergy" | "Cold & Cough" | "Diabetes Care" | "Heart Care" | "Skin Care" | "Women Care" | "Men Care" | "Fever" | "General";

// Order related types
export interface OrderItem {
    id: number;
    medicineId: number;
    name: string;
    price: number;
    quantity: number;
    rxRequired: boolean;
    createdAt: string;
}

export interface Order {
    id: number;
    customerName: string;
    items: number;
    amount: number;
    status: "NEW" | "PACKING" | "READY" | "DELIVERED" | "CANCELLED";
    address?: string;
    type: "DELIVERY" | "PICKUP";
    createdAt: string;
    OrderItems?: OrderItem[];
    store?: {
        id: number;
        name: string;
    };
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: "USER" | "STORE" | "PLATFORM_ADMIN";
    avatar?: string;
    phone?: string;
    address?: string;
    city?: string;
    pincode?: string;
    dateOfBirth?: string;
    gender?: string;
}

export interface CartItem extends Medicine {
    quantity: number;
}

export interface CreateOrderRequest {
    customerName: string;
    items: CartItem[];  // Changed from number to CartItem[]
    amount: number;
    address: string;    // Made required
    type: "DELIVERY" | "PICKUP";
    storeId?: number;
    prescriptionId?: string;
    paymentMethod?: 'CASH' | 'ONLINE' | 'PENDING';
}

export interface UpdateOrderRequest {
    status?: Order['status'];
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
}

// Prescription related types
export interface Prescription {
    id: string;
    userId: string;
    doctorName: string;
    doctorLicense: string;
    patientName: string;
    medications: PrescriptionMedication[];
    imageUrl?: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    issuedDate: string;
    expiryDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface PrescriptionMedication {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
}

export interface CreatePrescriptionRequest {
    doctorName: string;
    doctorLicense: string;
    patientName: string;
    medications: PrescriptionMedication[];
    issuedDate: string;
    expiryDate: string;
    imageUrl?: string;
}

// Admin related types
export interface AdminDashboardStats {
    totalOrders: number;
    totalRevenue: number;
    totalUsers: number;
    totalMedicines: number;
    pendingOrders: number;
    completedOrders: number;
    monthlyRevenue: number[];
    topMedicines: { medicine: Medicine; sales: number }[];
}

export interface AdminOrder extends Order {
    user: User;
    store?: Store;
}

export interface AdminUser extends User {
    createdAt: string;
    lastLogin?: string;
    isActive: boolean;
    totalOrders: number;
    totalSpent: number;
}

export interface AdminMedicine extends Medicine {
    createdAt: string;
    updatedAt: string;
    totalSales: number;
    lowStockAlert: boolean;
}

// Store related types
export interface Store {
    id: string;
    name: string;
    description: string;
    address: Address;
    phone: string;
    email: string;
    license: string;
    ownerId: string;
    isActive: boolean;
    rating: number;
    totalOrders: number;
    createdAt: string;
    updatedAt: string;
}

export interface StoreOrder extends Order {
    store: Store;
}

export interface StoreStats {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    averageOrderValue: number;
    monthlyRevenue: number[];
    topMedicines: { medicine: Medicine; sales: number }[];
}
