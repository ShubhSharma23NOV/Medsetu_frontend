"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PrescriptionPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to cart page where prescription upload is integrated
        router.push("/cart");
    }, [router]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                <p className="text-slate-500 font-medium">Redirecting to cart...</p>
            </div>
        </div>
    );
}
