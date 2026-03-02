export interface AppConfig {
  business: {
    name: string;
    tagline: string;
    description: string;
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    contact: {
      phone: string;
      whatsapp: string;
      email: string;
      supportHours: string;
    };
    license: {
      number: string;
      authority: string;
    };
  };
  pricing: {
    deliveryFee: number;
    freeDeliveryThreshold: number;
    taxRate: number;
    currency: string;
  };
  delivery: {
    estimatedTime: {
      min: number;
      max: number;
      unit: string;
    };
    sameDayDelivery: boolean;
    serviceAreas: string[];
  };
  defaultStore: {
    id: number;
    name: string;
    address: string;
    phone: string;
  };
}

// Default configuration (fallback values)
const defaultConfig: AppConfig = {
  business: {
    name: 'MedSetu Pharmacy',
    tagline: 'Your Trusted Digital Pharmacy',
    description: 'We deliver verified medicines and wellness products to your doorstep with speed and clinical accuracy.',
    address: {
      street: '123 Healthcare Tower, Vijay Nagar',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '452010',
      country: 'India',
    },
    contact: {
      phone: '9876543210',
      whatsapp: '9238607519',
      email: 'support@medsetu.com',
      supportHours: '24/7',
    },
    license: {
      number: 'FDA/IND/2024/001',
      authority: 'FDA Indore',
    },
  },
  pricing: {
    deliveryFee: 35,
    freeDeliveryThreshold: 500,
    taxRate: 0.18,
    currency: 'INR',
  },
  delivery: {
    estimatedTime: {
      min: 10,
      max: 10,
      unit: 'minutes',
    },
    sameDayDelivery: true,
    serviceAreas: ['Indore', 'Vijay Nagar', 'Scheme 54'],
  },
  defaultStore: {
    id: 1,
    name: 'MedSetu Main Store',
    address: 'Main Branch, Vijay Nagar, Indore - 452010',
    phone: '9876543210',
  },
};

class ConfigService {
  private config: AppConfig = defaultConfig;
  private isLoaded = false;

  async loadConfig(): Promise<AppConfig> {
    if (this.isLoaded) {
      return this.config;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/config/public`);
      if (response.ok) {
        const serverConfig = await response.json();
        this.config = { ...defaultConfig, ...serverConfig };
      }
    } catch (error) {
      console.warn('Failed to load server config, using defaults:', error);
    }

    this.isLoaded = true;
    return this.config;
  }

  getConfig(): AppConfig {
    return this.config;
  }

  // Convenience methods
  getBusinessInfo() {
    return this.config.business;
  }

  getPricingInfo() {
    return this.config.pricing;
  }

  getDeliveryInfo() {
    return this.config.delivery;
  }

  getDefaultStore() {
    return this.config.defaultStore;
  }

  // Formatted helpers
  getWhatsAppUrl(message: string = 'Hi MedSetu') {
    return `https://wa.me/91${this.config.business.contact.whatsapp}?text=${encodeURIComponent(message)}`;
  }

  getFullAddress() {
    const addr = this.config.business.address;
    return `${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
  }

  getDeliveryTimeText() {
    const delivery = this.config.delivery.estimatedTime;
    if (delivery.min === delivery.max) {
      return `Within ${delivery.min} ${delivery.unit}`;
    }
    return `Within ${delivery.min}-${delivery.max} ${delivery.unit}`;
  }

  formatCurrency(amount: number) {
    return `₹${amount.toFixed(0)}`;
  }

  getTaxPercentage() {
    return Math.round(this.config.pricing.taxRate * 100);
  }
}

export const configService = new ConfigService();