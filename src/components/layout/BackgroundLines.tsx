"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function BackgroundLines() {
    const { scrollY } = useScroll();

    // Parallax transforms for the different lines
    const y1 = useTransform(scrollY, [0, 2000], [0, 150]);
    const y2 = useTransform(scrollY, [0, 2000], [0, -200]);
    const y3 = useTransform(scrollY, [0, 2000], [0, 100]);
    const y4 = useTransform(scrollY, [0, 2000], [0, 300]);

    return (
        <div className="fixed inset-0 z-[50] pointer-events-none overflow-hidden opacity-30 mix-blend-screen">
            <motion.svg
                className="absolute w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Line 1 */}
                <motion.path
                    style={{ y: y1 }}
                    d="M-10,50 C20,10 80,90 110,40"
                    animate={{
                        d: [
                            "M-10,50 C20,10 80,90 110,40",
                            "M-10,60 C40,0 60,100 110,30",
                            "M-10,50 C20,10 80,90 110,40"
                        ]
                    }}
                    transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
                    fill="none"
                    stroke="rgba(212, 175, 53, 0.4)"
                    strokeWidth="0.2"
                />
                <motion.path
                    style={{ y: y1 }}
                    d="M-10,50 C20,10 80,90 110,40"
                    animate={{
                        d: [
                            "M-10,50 C20,10 80,90 110,40",
                            "M-10,40 C30,20 70,80 110,50",
                            "M-10,50 C20,10 80,90 110,40"
                        ]
                    }}
                    transition={{ repeat: Infinity, duration: 18, ease: "easeInOut", delay: 1 }}
                    fill="none"
                    stroke="rgba(212, 175, 53, 0.15)"
                    strokeWidth="0.8"
                />

                {/* Line 2 */}
                <motion.path
                    style={{ y: y2 }}
                    d="M-5,80 C30,40 60,110 105,20"
                    animate={{
                        d: [
                            "M-5,80 C30,40 60,110 105,20",
                            "M-5,90 C40,30 50,120 105,10",
                            "M-5,80 C30,40 60,110 105,20"
                        ]
                    }}
                    transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
                    fill="none"
                    stroke="rgba(212, 175, 53, 0.3)"
                    strokeWidth="0.15"
                />

                {/* Line 3 */}
                <motion.path
                    style={{ y: y3 }}
                    d="M10,-10 C40,40 50,70 110,80"
                    animate={{
                        d: [
                            "M10,-10 C40,40 50,70 110,80",
                            "M0,-20 C50,30 40,80 120,90",
                            "M10,-10 C40,40 50,70 110,80"
                        ]
                    }}
                    transition={{ repeat: Infinity, duration: 25, ease: "easeInOut", delay: 2 }}
                    fill="none"
                    stroke="rgba(212, 175, 53, 0.2)"
                    strokeWidth="0.25"
                />

                {/* Slowly shifting lines - Group 4 */}
                <motion.g
                    style={{ y: y4 }}
                    animate={{ x: [0, -10, 10, 0], y: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                >
                    <motion.path
                        animate={{
                            d: [
                                "M-20,30 C30,80 70,-10 120,60",
                                "M-20,40 C40,90 60,-20 120,50",
                                "M-20,30 C30,80 70,-10 120,60"
                            ]
                        }}
                        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
                        fill="none"
                        stroke="rgba(212, 175, 53, 0.1)"
                        strokeWidth="0.3"
                    />
                    <motion.path
                        animate={{
                            d: [
                                "M-20,70 C40,-10 80,100 120,40",
                                "M-20,60 C30,0 90,90 120,50",
                                "M-20,70 C40,-10 80,100 120,40"
                            ]
                        }}
                        transition={{ repeat: Infinity, duration: 24, ease: "easeInOut", delay: 3 }}
                        fill="none"
                        stroke="rgba(212, 175, 53, 0.1)"
                        strokeWidth="0.2"
                    />
                </motion.g>
            </motion.svg>
        </div>
    );
}
