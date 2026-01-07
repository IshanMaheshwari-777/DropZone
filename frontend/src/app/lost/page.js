'use client';

import { useEffect, useState } from 'react';
import useStore from '@/store/useStore';
import ItemCard from '@/components/ItemCard';
import Link from 'next/link';

export default function LostItemsPage() {
    // Use same structure as FoundItemsPage but for lost
    // Assuming fetchLostItems exists in store
    const { lostItems, fetchLostItems, lostLoading } = useStore();

    useEffect(() => {
        fetchLostItems();
    }, [fetchLostItems]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Lost Items</h1>
                    <p className="text-gray-600 mt-1">Help others find their lost belongings.</p>
                </div>
                <Link
                    href="/lost/new"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                >
                    Report Lost Item
                </Link>
            </div>

            {lostLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            ) : lostItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {lostItems.map((item) => (
                        <ItemCard key={item._id} item={item} type="lost" />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-lg">No lost items reported recently.</p>
                </div>
            )}
        </div>
    );
}
