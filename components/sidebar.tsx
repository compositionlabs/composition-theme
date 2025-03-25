'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu } from 'lucide-react';

const sideButtons = [
    {
        label: 'home',
        href: '/',
    },
    {
        label: 'about',
        href: '/about',
    },
]

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className='px-4 pt-4 md:p-0'>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 z-50 bg-white rounded-lg hover:bg-gray-100 outline-none active:rounded-lg focus:rounded-lg"
            >
                <Menu className='w-6 h-6 text-gray-800 rounded-lg' />
            </button>

            {/* Sidebar Overlay */}
            {isOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/50 z-40" 
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={
                `fixed md:relative left-0 top-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out 
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} z-50`
            }>
                <div className="flex flex-col h-full">
                    <nav className="flex-1 p-4">
                        <ul className="space-y-4">
                            {sideButtons.map((button) => (
                                <li key={button.label}>
                                    <Link 
                                        href={button.href} 
                                        className="block p-2 text-gray-800 hover:bg-gray-100 rounded text-right"
                                    >
                                        {button.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
