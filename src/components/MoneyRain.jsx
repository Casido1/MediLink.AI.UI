import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MoneyRain = ({ isActive, onComplete }) => {
    const [drops, setDrops] = useState([]);

    useEffect(() => {
        if (isActive) {
            // Generate 150 raindrops with random positions and delays
            const newDrops = Array.from({ length: 150 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 1.5, // Faster spawn
                duration: 0.8 + Math.random() * 0.5, // Faster fall
                height: 10 + Math.random() * 20, // Random height for depth
                opacity: 0.3 + Math.random() * 0.5,
            }));
            setDrops(newDrops);

            // Clear drops after animation
            const timeout = setTimeout(() => {
                setDrops([]);
                onComplete();
            }, 4000);

            return () => clearTimeout(timeout);
        }
    }, [isActive, onComplete]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <AnimatePresence>
                {drops.map((drop) => (
                    <motion.div
                        key={drop.id}
                        initial={{
                            top: -100,
                            left: `${drop.left}%`,
                            opacity: 0,
                        }}
                        animate={{
                            top: '120vh',
                            opacity: [0, drop.opacity, drop.opacity, 0],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: drop.duration,
                            delay: drop.delay,
                            ease: 'linear',
                        }}
                        className="absolute w-0.5 bg-gradient-to-b from-transparent to-blue-400 rounded-full"
                        style={{ height: `${drop.height}px` }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default MoneyRain;
