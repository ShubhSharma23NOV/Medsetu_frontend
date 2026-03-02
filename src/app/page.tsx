"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Pill, ShieldCheck, Truck, Activity, HeartPulse, Microscope } from "lucide-react";
import IndorePride from "@/components/special/IndorePride";

export default function Home() {
  const categories = [
    { name: "Prescription", icon: Activity, count: "1,200+ Products", color: "bg-teal-50 text-teal-600" },
    { name: "OTC Meds", icon: Pill, count: "800+ Products", color: "bg-blue-50 text-blue-600" },
    { name: "Vitamins", icon: HeartPulse, count: "450+ Products", color: "bg-green-50 text-green-600" },
    { name: "Devices", icon: Microscope, count: "200+ Products", color: "bg-slate-50 text-slate-600" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 },
    },
  };

  return (
    <div className="flex flex-col">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* WhatsApp Button */}
        <motion.a
          href="https://wa.me/919303489207?text=Hi%20MedSetu"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="h-14 w-14 bg-[#25D366] hover:bg-[#20BA5A] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
          title="Order on WhatsApp"
        >
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </motion.a>

        {/* Play Store Button */}
        <motion.a
          href="https://play.google.com/store"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="h-14 w-14 bg-slate-900 hover:bg-slate-800 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
          title="Download from Play Store"
        >
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
          </svg>
        </motion.a>
      </div>
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-[400px] h-[400px] bg-teal-100/20 rounded-full blur-3xl" />

        <div className="container mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 space-y-8 text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold tracking-tight">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                LICENSED DIGITAL PHARMACY
              </div>
              <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-md border border-slate-100">
                <Pill className="h-5 w-5 text-primary" />
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Med<span className="text-primary italic">Setu</span>
                </span>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight"
            >
              Get Medicines <br />
              <span className="text-primary italic">At Your Home.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="max-w-[600px] text-lg md:text-xl text-slate-500 font-medium leading-relaxed"
            >
              Why wait at the chemist? Order verified medicines and health products. We deliver across Indore in 24 hours.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl shadow-xl shadow-primary/25 group transition-all duration-300 hover:scale-105" asChild>
                <Link href="/medicines">
                  Order Now <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold rounded-2xl border-2 hover:bg-slate-50 transition-all duration-300 hover:scale-105" asChild>
                <Link href="/cart">
                  Upload Prescription
                </Link>
              </Button>
            </motion.div>

            {/* Quick Contact Options */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="https://wa.me/919303489207?text=Hi%20MedSetu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Chat on WhatsApp
              </a>
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                </svg>
                Download App
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-8 pt-4">
              <div className="flex flex-col items-center gap-3">
                <div className="flex -space-x-3">
                  {[
                    "https://i.pravatar.cc/150?img=1",
                    "https://i.pravatar.cc/150?img=2",
                    "https://i.pravatar.cc/150?img=3",
                    "https://i.pravatar.cc/150?img=4"
                  ].map((avatar, i) => (
                    <img 
                      key={i} 
                      src={avatar} 
                      alt={`Customer ${i + 1}`}
                      className="h-10 w-10 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <p className="text-sm font-bold text-white whitespace-nowrap">
                  <span className="text-primary">10k+</span> Trusted Customers
                </p>
              </div>

              <div className="h-8 w-[1px] bg-slate-200 hidden lg:block" />

              <IndorePride />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="flex-1 w-full max-w-xl"
          >
            <div
              className="relative aspect-[4/5] sm:aspect-square bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-100 p-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-teal-500/5" />

              {/* Professional Hero Image Placeholder / Visualization */}
              <div className="relative h-full w-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-between p-8">

                {/* Top Section - Verified Badge */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="w-full flex justify-end"
                >
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
                    <div className="bg-green-100 p-1.5 rounded-lg text-green-600">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900 leading-none">Verified</p>
                      <p className="text-[9px] text-slate-500 mt-0.5">Clinical Grade</p>
                    </div>
                  </div>
                </motion.div>

                {/* Center Section - Main Content */}
                <div className="flex flex-col items-center gap-6 text-center">
                  <div
                    className="h-24 w-24 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20"
                  >
                    <Pill size={48} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Genuine Care</h3>
                    <p className="text-slate-500 font-semibold uppercase tracking-widest text-[10px]">Indore's Trusted Choice</p>
                    <p className="text-slate-600 text-sm max-w-xs leading-relaxed">
                      Licensed pharmacy delivering authentic medicines with care and precision across Indore
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-2">
                      <div className="text-center">
                        <p className="text-2xl font-black text-primary">24/7</p>
                        <p className="text-[10px] text-slate-500 font-bold">Available</p>
                      </div>
                      <div className="h-8 w-[1px] bg-slate-200"></div>
                      <div className="text-center">
                        <p className="text-2xl font-black text-primary">100%</p>
                        <p className="text-[10px] text-slate-500 font-bold">Authentic</p>
                      </div>
                      <div className="h-8 w-[1px] bg-slate-200"></div>
                      <div className="text-center">
                        <p className="text-2xl font-black text-primary">24h</p>
                        <p className="text-[10px] text-slate-500 font-bold">Delivery</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section - Fast Dispatch Badge */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="w-full flex justify-start"
                >
                  <div className="bg-primary text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                    <div className="bg-white/20 p-1.5 rounded-lg">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs leading-none">Fast Dispatch</p>
                      <p className="text-[9px] text-white/80 mt-0.5">Across Indore</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white py-24 border-y border-slate-100">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Shop by Category</h2>
              <p className="text-slate-500 font-medium">Easily find what you need from our collection.</p>
            </div>
            <Button variant="ghost" className="text-primary font-bold">View All Categories</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href="/medicines" className="block group p-6 rounded-2xl bg-white border border-slate-200 hover:border-primary/50 hover:shadow-md transition-all h-full">
                  <div className={`h-12 w-12 rounded-xl ${cat.color} flex items-center justify-center mb-4 transition-transform`}>
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{cat.name}</h3>
                  <p className="text-xs text-slate-500">{cat.count}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: ShieldCheck, title: "Original Medicines", desc: "We only sell 100% original medicines, stored safely in our certified warehouse." },
            { icon: Truck, title: "Fast Home Delivery", desc: "Get your medicines delivered the same day in most parts of Indore." },
            { icon: HeartPulse, title: "Talk to Pharmacist", desc: "Our friendly pharmacists are here to help with your prescription 24/7." }
          ].map((badge, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="flex flex-col gap-4 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <badge.icon size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900">{badge.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto pb-24 px-4">
        <motion.div
          whileInView={{ y: [20, 0], opacity: [0, 1] }}
          viewport={{ once: true }}
          className="relative rounded-2xl bg-slate-900 overflow-hidden p-10 md:p-16 text-center space-y-6 max-w-5xl mx-auto"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
          <h2 className="relative z-10 text-3xl md:text-5xl font-black text-white leading-tight">
            Ready to Take Control of <br /> Your Health?
          </h2>
          <p className="relative z-10 text-slate-400 text-lg font-medium max-w-xl mx-auto">
            Experience the future of healthcare in Indore. Swift, safe, and always reliable.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-14 px-10 text-lg font-black rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95" asChild>
              <Link href="/register">
                Get Started for Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-black border-slate-700 bg-transparent text-white hover:bg-slate-800 rounded-2xl transition-all hover:scale-105 active:scale-95" asChild>
              <Link href="/medicines">
                Browse Medicines
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
