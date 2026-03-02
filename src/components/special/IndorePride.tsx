"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Award, Sparkles } from "lucide-react";

export default function IndorePride() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className="hidden lg:flex items-center justify-center p-4">
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="relative h-48 w-80 rounded-3xl bg-gradient-to-br from-primary to-emerald-500 p-8 shadow-2xl cursor-pointer overflow-hidden border border-white/20"
            >
                {/* Background Sparkle Effect */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                    <Sparkles className="absolute top-4 right-4 h-12 w-12 text-white animate-pulse" />
                </div>

                <div style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }} className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                        <Award className="h-10 w-10 text-white" />
                        <div className="text-right">
                            <span className="text-[10px] uppercase font-black tracking-widest text-white/80">Proudly Indori</span>
                            <h3 className="text-white font-black text-xl leading-tight mt-1">#1 Cleanest <br />City in India</h3>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-white text-xs font-bold flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                            Serving with Pride since 2024
                        </p>
                        <p className="text-white/80 text-[10px] font-medium italic">
                            Bringing Global Standards to Indore.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
