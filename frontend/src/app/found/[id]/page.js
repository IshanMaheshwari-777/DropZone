'use client';

import { useEffect } from 'react';
import useStore from '@/store/useStore';
import { useRouter, useParams } from 'next/navigation';
import { MapPin, Calendar, User, ArrowLeft, Trash2, CheckCircle } from 'lucide-react';
import dayjs from 'dayjs';

export default function FoundItemDetail() {
    const { id } = useParams();
    const router = useRouter();
    const { foundItem, fetchFoundItemById, foundLoading, claimFoundItem, deleteFoundItem, user } = useStore();

    useEffect(() => {
        if (id) fetchFoundItemById(id);
    }, [id, fetchFoundItemById]);

    if (foundLoading || !foundItem) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
                <div className="h-8 w-1/3 bg-gray-200 rounded mb-6"></div>
                <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
        );
    }

    const imageUrl = foundItem.imagePath
        ? (foundItem.imagePath.startsWith('http') ? foundItem.imagePath : `http://localhost:6001${foundItem.imagePath}`)
        : 'https://placehold.co/800x600?text=No+Image';

    const isOwner = user && foundItem.postedBy && (user._id === foundItem.postedBy._id || user._id === foundItem.postedBy);
    const isAdmin = user && user.role === 'admin';

    const handleClaim = async () => {
        if (window.confirm('Mark this item as claimed?')) {
            await claimFoundItem(foundItem._id);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            const success = await deleteFoundItem(foundItem._id);
            if (success) router.push('/found');
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
            >
                <ArrowLeft size={18} className="mr-2" />
                Back to List
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden card-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="h-96 md:h-auto relative bg-gray-100">
                        <img src={imageUrl} alt={foundItem.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{foundItem.category}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${foundItem.status === 'claimed' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                                {foundItem.status}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{foundItem.title}</h1>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center text-gray-600">
                                <MapPin className="text-indigo-500 mr-3" size={20} />
                                <span>{foundItem.location}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Calendar className="text-indigo-500 mr-3" size={20} />
                                <span>Found on {dayjs(foundItem.dateFound).format('MMMM D, YYYY')}</span>
                            </div>
                            {foundItem.postedBy && (
                                <div className="flex items-center text-gray-600">
                                    <User className="text-indigo-500 mr-3" size={20} />
                                    <span>Reported by {foundItem.postedBy.name}</span>
                                </div>
                            )}
                        </div>

                        {foundItem.description && (
                            <div className="mb-8">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{foundItem.description}</p>
                            </div>
                        )}

                        {(isOwner || isAdmin) && (
                            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                                {isOwner && foundItem.status !== 'claimed' && (
                                    <button
                                        onClick={handleClaim}
                                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        <CheckCircle size={16} className="mr-2" />
                                        Mark as Claimed
                                    </button>
                                )}
                                {isAdmin && (
                                    <button
                                        onClick={handleDelete}
                                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <Trash2 size={16} className="mr-2" />
                                        Delete Item
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
