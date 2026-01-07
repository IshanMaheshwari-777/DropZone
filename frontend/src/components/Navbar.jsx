'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useStore from '@/store/useStore';
import { useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

export default function Navbar() {
    const { isAuthenticated, logout, checkAuth } = useStore();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/found', label: 'Found Items' },
        { href: '/lost', label: 'Lost Items' },
    ];

    const authLinks = [
        { href: '/found/new', label: 'Report Found' },
        { href: '/lost/new', label: 'Report Lost' },
        { href: '/lost/my', label: 'My Items' },
    ];

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-indigo-600">DropZone</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={clsx(
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                                        pathname === link.href
                                            ? 'border-indigo-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {isAuthenticated && authLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={clsx(
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                                        pathname === link.href
                                            ? 'border-indigo-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {isAuthenticated ? (
                            <button
                                onClick={() => {
                                    logout();
                                    window.location.href = '/';
                                }}
                                className="text-sm font-medium text-gray-500 hover:text-gray-900"
                            >
                                Logout
                            </button>
                        ) : (
                            <div className="space-x-4">
                                <Link href="/auth/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                    Login
                                </Link>
                                <Link href="/auth/register" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="sm:hidden bg-white border-t border-gray-100">
                    <div className="pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={clsx(
                                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
                                    pathname === link.href
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isAuthenticated && authLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={clsx(
                                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
                                    pathname === link.href
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isAuthenticated ? (
                            <button
                                onClick={() => {
                                    logout();
                                    setIsMenuOpen(false);
                                    window.location.href = '/';
                                }}
                                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                            >
                                Logout
                            </button>
                        ) : (
                            <div className="pt-4 pb-3 border-t border-gray-200">
                                <div className="space-y-1">
                                    <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Login</Link>
                                    <Link href="/auth/register" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Register</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
