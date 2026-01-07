'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useStore from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { clsx } from 'clsx';

const createFoundItemSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    category: z.string().min(1, 'Category is required'),
    location: z.string().min(3, 'Location is required'),
    dateFound: z.string().min(1, 'Date found is required'),
    description: z.string().optional(),
});

export default function NewFoundItemPage() {
    const { createFoundItem } = useStore();
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue
    } = useForm({
        resolver: zodResolver(createFoundItemSchema),
        defaultValues: {
            dateFound: new Date().toISOString().split('T')[0]
        }
    });

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
        if (!file) {
            toast.error('Please upload an image for the found item');
            return;
        }

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('category', data.category);
        formData.append('location', data.location);
        formData.append('dateFound', data.dateFound);
        formData.append('description', data.description || '');
        formData.append('image', file);

        const success = await createFoundItem(formData);
        if (success) {
            router.push('/found');
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 card-shadow">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Report Found Item</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Item Image (Required)</label>
                        <div
                            {...getRootProps()}
                            className={clsx(
                                "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors h-48",
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
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-600">
                                        <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                {...register('title')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Blue Backpack"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location Found</label>
                            <input
                                type="text"
                                {...register('location')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Library, 2nd Floor"
                            />
                            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Found</label>
                            <input
                                type="date"
                                {...register('dateFound')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.dateFound && <p className="text-red-500 text-xs mt-1">{errors.dateFound.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                        <textarea
                            {...register('description')}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Any other details..."
                        />
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
                            {isSubmitting ? 'Submitting...' : 'Report Found Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
