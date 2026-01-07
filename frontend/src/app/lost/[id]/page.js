'use client';

import { useEffect } from 'react';
import useStore from '@/store/useStore';
import { useRouter, useParams } from 'next/navigation';
import { MapPin, Calendar, ArrowLeft, Trash2, EyeOff, FileText, User } from 'lucide-react';
import dayjs from 'dayjs';

export default function LostItemDetail() {
    const { id } = useParams();
    const router = useRouter();
    const { lostItem, fetchLostItemById, lostLoading, deactivateLostItem, deleteLostItem, user } = useStore();

    useEffect(() => {
        if (id) fetchLostItemById(id);
    }, [id, fetchLostItemById]);

    if (lostLoading || !lostItem) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
                <div className="h-8 w-1/3 bg-gray-200 rounded mb-6"></div>
                <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            </div>
        );
    }

    // Lost items might not have images, handle gracefully
    const imageUrl = lostItem.imagePath
        ? (lostItem.imagePath.startsWith('http') ? lostItem.imagePath : `http://localhost:6001${lostItem.imagePath}`)
        : null;

    const isOwner = user && lostItem.postedBy && (user._id === lostItem.postedBy._id || user._id === lostItem.postedBy);
    const isAdmin = user && user.role === 'admin';

    const handleDeactivate = async () => {
        if (window.confirm('Deactivate this item? It will be marked as inactive.')) {
            await deactivateLostItem(lostItem._id);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this lost item report?')) {
            const success = await deleteLostItem(lostItem._id);
            if (success) router.push('/lost');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
            >
                <ArrowLeft size={18} className="mr-2" />
                Back to List
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden card-shadow">
                {imageUrl && (
                    <div className="h-64 sm:h-80 bg-gray-100 w-full relative">
                        <img src={imageUrl} alt={lostItem.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{lostItem.category}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${lostItem.status === 'inactive' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                                    {lostItem.status}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">{lostItem.title}</h1>
                        </div>
                        {(isOwner || isAdmin) && (
                            <div className="flex gap-2">
                                {isOwner && lostItem.status !== 'inactive' && (
                                    <button
                                        onClick={handleDeactivate}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                    >
                                        <EyeOff size={16} className="mr-2" />
                                        Deactivate
                                    </button>
                                )}
                                <button
                                    onClick={handleDelete}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
                                >
                                    <Trash2 size={16} className="mr-2" />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-4">
                            <div className="flex items-center text-gray-600">
                                <MapPin className="text-indigo-500 mr-3" size={20} />
                                <span>Last seen at {lostItem.location}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Calendar className="text-indigo-500 mr-3" size={20} />
                                <span>Lost on {dayjs(lostItem.dateLost).format('MMMM D, YYYY')}</span>
                            </div>
                            {lostItem.postedBy && (
                                <div className="flex items-center text-gray-600">
                                    <User className="text-indigo-500 mr-3" size={20} />
                                    <span>Reported by {lostItem.postedBy.name}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="prose prose-indigo max-w-none">
                        <p className="text-gray-600 leading-relaxed text-lg">{lostItem.publicDescription}</p>
                    </div>

                    {isOwner && lostItem.privateNotes && (
                        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
                            <h3 className="flex items-center text-amber-800 font-semibold mb-2">
                                <FileText size={18} className="mr-2" />
                                Private Notes (Only visible to you)
                            </h3>
                            <p className="text-amber-900">{lostItem.privateNotes}</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
