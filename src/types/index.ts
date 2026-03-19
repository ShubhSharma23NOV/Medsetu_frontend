export interface Medicine {
    id: string | number;
    name: string;
    brand?: string;
    category?: string;
    healthCondition?: string;
    price: number;
    description?: string;
    image?: string;
    imageUrl?: string;
    rating?: number;
    stock?: number;
    inStock: boolean;
    rxRequired: boolean;
    requiresPrescription?: boolean; // Alias for rxRequired
    dosage?: string;
    sideEffects?: string[];
    expiryDate?: string;
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
    addressId?: number; // New field for structured addresses
    type: "DELIVERY" | "PICKUP";
    createdAt: string;
    orderItems?: OrderItem[]; // Changed from OrderItems to orderItems
    deliveryAddress?: {
        id: number;
        title: string;
        fullName: string;
        phone: string;
        addressLine: string;
        landmark?: string;
        city: string;
        state: string;
        pincode: string;
        isDefault: boolean;
    };
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
    address?: string;   // Made optional since we can use addressId
    addressId?: number; // New field for structured addresses
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

// Wishlist types
export interface WishlistItem {
    id: number;
    userId: number;
    medicineId: number;
    createdAt: string;
    medicine: Medicine;
}

// Notification types
export interface Notification {
    id: number;
    userId: number;
    type: 'ORDER' | 'PRESCRIPTION' | 'OFFER' | 'SYSTEM';
    title: string;
    message: string;
    orderId?: number;
    prescriptionId?: number;
    isRead: boolean;
    createdAt: string;
    order?: {
        id: number;
        status: string;
        amount: number;
    };
    prescription?: {
        id: number;
        status: string;
    };
}

// User preferences types
export interface UserPreferences {
    id: number;
    userId: number;
    theme: 'light' | 'dark' | 'system';
    language: string;
    orderNotifications: boolean;
    prescriptionNotifications: boolean;
    offerNotifications: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    createdAt: string;
    updatedAt: string;
}

// Order tracking types
export interface OrderTracking {
    id: number;
    orderId: number;
    status: string;
    currentLocation?: { lat: number; lng: number };
    deliveryPartnerName?: string;
    deliveryPartnerPhone?: string;
    vehicleNumber?: string;
    estimatedDeliveryTime?: string;
    timeline: Array<{
        status: string;
        timestamp: string;
        location: string;
    }>;
    createdAt: string;
    updatedAt: string;
    order: {
        id: number;
        status: string;
        type: string;
        address?: string;
        createdAt: string;
    };
}

// Store types
export interface Store {
    id: number;
    userId: number;
    storeName: string;
    ownerName: string;
    storeAddress: string;
    storePhone: string;
    licenseNumber: string;
    storeStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
    priority: number;
    serviceablePincodes: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface StoreOrder extends Order {
    storeId: number;
}

export interface StoreStats {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    totalMedicines: number;
    lowStockCount: number;
}
