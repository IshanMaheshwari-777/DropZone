'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useStore from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { clsx } from 'clsx';
import api from '@/utils/api';

const createLostItemSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    category: z.string().min(1, 'Category is required'),
    location: z.string().min(3, 'Location is required'),
    dateLost: z.string().min(1, 'Date lost is required'),
    publicDescription: z.string().min(10, 'Please provide a description'),
    privateNotes: z.string().optional(),
});

export default function NewLostItemPage() {
    const { createLostItem } = useStore();
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(createLostItemSchema),
        defaultValues: {
            dateLost: new Date().toISOString().split('T')[0]
        }
    });

    const category = watch('category');

    // Fetch suggestions when category changes
    const fetchSuggestions = async (cat) => {
        if (!cat) return;
        try {
            const res = await api.get(`/suggestions/${cat}`);
            setSuggestions(res.data.suggestions || []);
        } catch (err) {
            console.error("Failed to fetch suggestions", err);
        }
    }

    useEffect(() => {
        if (category) {
            fetchSuggestions(category);
        } else {
            setSuggestions([]);
        }
    }, [category]);


    const onDrop = (acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFilePreview(URL.createObjectURL(selectedFile));
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        },
        maxFiles: 1,
        multiple: false
    });

    const removeFile = (e) => {
        e.stopPropagation();
        setFile(null);
        setFilePreview(null);
    }

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('category', data.category);
        formData.append('location', data.location);
        formData.append('dateLost', data.dateLost);
        formData.append('publicDescription', data.publicDescription);
        formData.append('privateNotes', data.privateNotes || '');
        if (file) {
            formData.append('image', file);
        }

        const success = await createLostItem(formData);
        if (success) {
            router.push('/lost');
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 card-shadow">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Report Lost Item</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {suggestions.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start">
                                <Lightbulb className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" size={20} />
                                <div>
                                    <h4 className="text-sm font-semibold text-blue-800 mb-1">Did you check here?</h4>
                                    <p className="text-sm text-blue-700">
                                        Items in this category are often found at: <span className="font-medium">{suggestions.join(', ')}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                {...register('title')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="MacBook Pro Charger"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                {...register('category')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            >
                                <option value="">Select Category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Documents">Documents</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Seen Location</label>
                            <input
                                type="text"
                                {...register('location')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Cafeteria"
                            />
                            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Lost</label>
                            <input
                                type="date"
                                {...register('dateLost')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.dateLost && <p className="text-red-500 text-xs mt-1">{errors.dateLost.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Public Description</label>
                        <textarea
                            {...register('publicDescription')}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Describe the item publically..."
                        />
                        {errors.publicDescription && <p className="text-red-500 text-xs mt-1">{errors.publicDescription.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Private Notes (Optional)</label>
                        <textarea
                            {...register('privateNotes')}
                            rows={2}
                            className="w-full px-3 py-2 border border-orange-200 bg-orange-50 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="Serial number or hidden markings (Only visible to you)"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                        <div
                            {...getRootProps()}
                            className={clsx(
                                "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors h-32",
                                isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-gray-400",
                                filePreview ? "border-solid border-gray-200 p-0 overflow-hidden relative" : ""
                            )}
                        >
                            <input {...getInputProps()} />
                            {filePreview ? (
                                <>
                                    <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                    >
                                        <X size={16} className="text-gray-600" />
                                    </button>
                                </>
                            ) : (
                                <div className="text-center">
                                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                    <p className="mt-1 text-sm text-gray-600">
                                        Upload image
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transform hover:-translate-y-0.5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all shadow-md"
                        >
                            {isSubmitting ? 'Submitting...' : 'Report Lost Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
