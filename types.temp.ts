
interface Order {
    id: string;
    serviceId: string;
    serviceTitle: string;
    serviceImage: string;
    price: number;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
    date: string;
    clientName?: string;
    deliverables?: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar: string;
    role: 'client' | 'admin';
    token?: string; // Add token to User type
    password?: string;
    isVerified?: boolean;
    verificationCode?: string;
}

// ... other types as needed
