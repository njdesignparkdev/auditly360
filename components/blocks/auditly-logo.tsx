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
        >
            <Image 
                src="/herosection-icon/orange-black-auditly.png" 
                alt="Auditly360" 
                width={120} 
                height={40}
                priority
            />
        </motion.div>
    );
}
