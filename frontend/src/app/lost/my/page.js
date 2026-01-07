'use client';

import { useEffect } from 'react';
import useStore from '@/store/useStore';
import Link from 'next/link';
import { Eye, EyeOff, Trash2, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';

export default function MyLostItemsPage() {
    const { myLostItems, fetchMyLostItems, lostLoading, deactivateLostItem, deleteLostItem } = useStore();

    useEffect(() => {
        fetchMyLostItems();
    }, [fetchMyLostItems]);

    const handleDeactivate = async (id) => {
        if (window.confirm('Deactivate this item?')) {
            await deactivateLostItem(id);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this report permanently?')) {
            await deleteLostItem(id);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Lost Items</h1>

            {lostLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                </div>
            ) : myLostItems.length > 0 ? (
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden card-shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Lost</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {myLostItems.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-0">
                                                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                                    <div className="text-sm text-gray-500">{item.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {dayjs(item.dateLost).format('MMM D, YYYY')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-3">
                                                <Link href={`/lost/${item._id}`} className="text-indigo-600 hover:text-indigo-900" title="View">
                                                    <Eye size={18} />
                                                </Link>
                                                {item.status === 'active' && (
                                                    <button onClick={() => handleDeactivate(item._id)} className="text-orange-600 hover:text-orange-900" title="Deactivate">
                                                        <EyeOff size={18} />
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-900" title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-100 border-dashed">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No items reported</h3>
                    <p className="mt-1 text-sm text-gray-500">You haven't reported any lost items yet.</p>
                    <div className="mt-6">
                        <Link
                            href="/lost/new"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Report Lost Item
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
