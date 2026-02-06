import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MoneyRain = ({ isActive, onComplete }) => {
    const [bills, setBills] = useState([]);

    useEffect(() => {
        if (isActive) {
            // Generate 50 dollar bills with random positions and delays
            const newBills = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 2,
                duration: 3 + Math.random() * 2,
                rotation: Math.random() * 360,
                size: 40 + Math.random() * 20,
            }));
            setBills(newBills);

            // Clear bills after animation
            const timeout = setTimeout(() => {
                setBills([]);
                onComplete();
            }, 6000);

            return () => clearTimeout(timeout);
        }
    }, [isActive, onComplete]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <AnimatePresence>
                {bills.map((bill) => (
                    <motion.div
                        key={bill.id}
                        initial={{
                            top: -100,
                            left: `${bill.left}%`,
                            rotate: bill.rotation,
                            opacity: 0,
                        }}
                        animate={{
                            top: '110vh',
                            rotate: bill.rotation + 720,
                            opacity: [0, 1, 1, 0],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: bill.duration,
                            delay: bill.delay,
                            ease: 'linear',
                        }}
                        className="absolute"
                        style={{ fontSize: `${bill.size}px` }}
                    >
                        💵
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default MoneyRain;
