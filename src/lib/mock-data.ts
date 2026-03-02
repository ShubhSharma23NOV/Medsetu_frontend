import { Medicine } from "@/types";

export const MOCK_MEDICINES: Medicine[] = [
    {
        id: "1",
        name: "Amoxicillin 500mg",
        brand: "GlaxoSmithKline",
        category: "Antibiotics",
        price: 12.50,
        description: "Broad-spectrum antibiotic used to treat various bacterial infections.",
        inStock: true,
        rxRequired: true,
    },
    {
        id: "2",
        name: "Paracetamol Extra",
        brand: "Panadol",
        category: "Pain Relief",
        price: 5.99,
        description: "Relief from headache, migraine, backache, toothache and rheumatic pain.",
        inStock: true,
        rxRequired: false,
    },
    {
        id: "3",
        name: "Vitamin D3 2000IU",
        brand: "Nature Made",
        category: "Wellness",
        price: 18.25,
        description: "High-potency vitamin D supplement for bone and immune support.",
        inStock: true,
        rxRequired: false,
    },
    {
        id: "4",
        name: "Metformin 500mg",
        brand: "Glucophage",
        category: "Diabetes",
        price: 15.75,
        description: "Medication used to treat type 2 diabetes by controlling blood sugar levels.",
        inStock: true,
        rxRequired: true,
    },
    {
        id: "5",
        name: "Cetirizine 10mg",
        brand: "Zyrtec",
        category: "Allergy",
        price: 9.99,
        description: "Non-drowsy antihistamine for relief of hay fever and allergy symptoms.",
        inStock: true,
        rxRequired: false,
    }
];
