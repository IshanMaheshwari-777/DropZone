import Link from 'next/link';
import { MapPin, Calendar, Tag } from 'lucide-react';
import dayjs from 'dayjs';
import { clsx } from 'clsx';
import Image from 'next/image';

const StatusBadge = ({ status, type }) => {
    const isFound = type === 'found';

    const getStatusColor = (status = '') => {
        switch (status.toLowerCase()) {
            case 'available':
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'claimed':
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide', getStatusColor())}>
            {status}
        </span>
    );
};

export default function ItemCard({ item, type }) {
    const isFound = type === 'found';
    const href = isFound ? `/found/${item._id}` : `/lost/${item._id}`;

    // Use Cloudinary URL if available, otherwise fallback or local
    // Backend now returns full URL in imagePath if it's Cloudinary, or relative path if local. 
    // We need to handle relative path for legacy images if any, or just trust the URL.
    // Ideally backend provides a full URL. For this implementation, we assume imagePath is usable as src.
    // If imagePath starts with /, it's local. If http, it's Cloudinary.
    // Next.js Image component needs configured domains or unoptimized for external. 
    // We'll use unoptimized for simplicity with Cloudinary or add to config. 
    // Actually, standard <img> is safer unless we config next.config.js. Let's use <img> for now or unoptimized Image.

    const imageUrl = item.imagePath
        ? (item.imagePath.startsWith('http') ? item.imagePath : `http://localhost:6001${item.imagePath}`)
        : 'https://placehold.co/400x300?text=No+Image';

    return (
        <Link href={href} className="group block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow card-shadow">
            <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                {item.imagePath || isFound ? (
                    <img
                        src={imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                        <span className="text-sm">No Image</span>
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <StatusBadge status={item.status} type={type} />
                </div>
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        {item.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {dayjs(isFound ? item.dateFound : item.dateLost).format('MMM D, YYYY')}
                    </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3 flex items-center">
                    <MapPin size={14} className="mr-1 text-gray-400" />
                    <span className="truncate">{item.location}</span>
                </p>
            </div>
        </Link>
    );
}
