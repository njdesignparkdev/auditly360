'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface DropdownItem {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavbarDropdownProps {
  label: string;
  items: DropdownItem[];
  href?: string;
}

export default function NavbarDropdown({ label, items, href }: NavbarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {href ? (
        <Link
          href={href}
          className="px-5 py-2 text-base font-medium text-[#29272A] hover:text-[#f0803c] transition-colors rounded-full hover:bg-white/5 flex items-center gap-1"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {label}
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </Link>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-5 py-2 text-base font-medium text-[#29272A] hover:text-[#f0803c] transition-colors rounded-full hover:bg-white/5 flex items-center gap-1"
        >
          {label}
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="flex flex-col gap-2">
              {items.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="group p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {item.icon && (
                      <div className="flex-shrink-0 mt-0.5 text-[#f0803c]">
                        {item.icon}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#f0803c] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

