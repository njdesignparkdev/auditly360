'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AuditlyLogo() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-transparent"
        >
            <Image
                src="/orange-black-auditly.png"
                alt="Auditly360"
                width={120}
                height={40}
                priority
                draggable={false}
                className="bg-transparent mix-blend-multiply h-auto w-auto pointer-events-none select-none"
            />
        </motion.div>
    );
}
