import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
            <h1 className="text-9xl font-black text-indigo-100">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mt-[-2rem] mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8 max-w-md text-center">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
                Go Home
            </Link>
        </div>
    );
}
