"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, ArrowRight, ShieldCheck, Truck, Clock, MessageCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

    if (pathname?.startsWith("/admin") || pathname?.startsWith("/platform-admin")) return null;

    return (
        <footer className="w-full bg-slate-900 text-slate-300 pt-20 pb-10 mt-20">
            <div className="container mx-auto px-6 lg:px-8">
                {/* Top Section: Trust Badges */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16 border-b border-white/10 mb-16">
                    {[
                        { icon: ShieldCheck, title: "100% Genuine", desc: "Sourced directly from certified manufacturers" },
                        { icon: Truck, title: "Free Delivery", desc: "For all orders above ₹500 in Indore" },
                        { icon: Clock, title: "24/7 Support", desc: "Talk to our pharmacists anytime you need" },
                    ].map((item, i) => (
                        <div key={i} className="flex gap-4 items-center group">
                            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <item.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">{item.title}</h4>
                                <p className="text-sm text-slate-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <Image src="/medsetu-logo.jpeg" alt="MedSetu Logo" width={40} height={40} className="rounded-xl shadow-lg group-hover:scale-110 transition-transform" />
                            <span className="text-2xl font-black tracking-tight text-white">
                                Med<span className="text-primary italic">Setu</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            Your trusted digital pharmacy in Indore. We deliver verified medicines and wellness products to your doorstep with speed and clinical accuracy.
                        </p>
                        <div className="flex gap-3">
                            {[Facebook, Twitter, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-primary transition-colors">
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                        
                        {/* Quick Contact Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href="https://wa.me/919303489207?text=Hi%20MedSetu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105"
                            >
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp
                            </a>
                            <a
                                href="https://play.google.com/store"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105"
                            >
                                <Smartphone className="h-4 w-4" />
                                Play Store
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-white font-bold text-lg">Shop</h4>
                        <ul className="space-y-4">
                            {['Medicines', 'Wellness', 'Prescriptions', 'Home Care', 'Personal Care'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm hover:text-primary transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-white font-bold text-lg">Support</h4>
                        <ul className="space-y-4">
                            {['Help Center', 'Track Order', 'Return Policy', 'FAQS', 'Privacy Policy'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm hover:text-primary transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Subscription Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <h4 className="text-white font-bold text-lg">Stay Healthy</h4>
                        <p className="text-sm text-slate-400">
                            Get health tips and exclusive offers delivered to your inbox every week.
                        </p>
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="Email address"
                                className="bg-white/5 border-white/10 text-white rounded-xl focus:ring-primary/20"
                            />
                            <Button className="rounded-xl px-4 shadow-lg shadow-primary/20">
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="pt-4 flex items-center gap-4">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Phone className="h-4 w-4 text-primary" />
                                <span>+91 731-000-0000</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Mail className="h-4 w-4 text-primary" />
                                <span>support@medsetu.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2">
                        <p>© {new Date().getFullYear()} MedSetu Pharmacy. Licensed by FDA Indore.</p>
                        <p>123 Healthcare Tower, Vijay Nagar, Indore - 452010</p>
                    </div>
                    <div className="flex gap-6">
                        <span className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            System Online
                        </span>
                        <span>v1.0.4-stable</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
