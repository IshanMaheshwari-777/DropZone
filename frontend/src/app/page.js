import Link from 'next/link';
import { Search, HelpCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-white">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight mb-6">
          Lost something? <br />
          <span className="text-indigo-600">Let's find it.</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          DropZone is the campus-wide lost and found platform. Report items you've found or search for things you've lost in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/found/new"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
          >
            I Found Something
          </Link>
          <Link
            href="/lost/new"
            className="inline-flex items-center justify-center px-8 py-4 border border-indigo-200 text-lg font-medium rounded-lg text-indigo-700 bg-white hover:bg-indigo-50 hover:border-indigo-300 shadow-sm transition-all duration-200"
          >
            I Lost Something
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link href="/found" className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-200 transition-colors">
                <Search size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Browse Found Items</h3>
                <p className="text-sm text-gray-500">See what has been turned in recently</p>
              </div>
            </div>
          </Link>
          <Link href="/lost" className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-lg group-hover:bg-amber-200 transition-colors">
                <HelpCircle size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Browse Lost Items</h3>
                <p className="text-sm text-gray-500">Check if someone is looking for an item</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
