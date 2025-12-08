import Link from 'next/link';
import { Suspense } from 'react';
import SearchBar from './SearchBar';

function SearchBarFallback() {
  return (
    <div className="w-full max-w-md">
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="w-20 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

export default function NavBar() {
  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Aegis-OSINT
            </Link>
            <div className="hidden md:flex md:space-x-6">
              <Link
                href="/categories"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Categories
              </Link>
              <Link
                href="/favorites"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Favorites
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                About
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <Suspense fallback={<SearchBarFallback />}>
              <SearchBar />
            </Suspense>
          </div>
        </div>
      </div>
    </nav>
  );
}
