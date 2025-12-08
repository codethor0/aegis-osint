import Link from 'next/link';
import { getCategories } from '@/lib/data';
import CategoryList from '@/components/CategoryList';

export default function HomePage() {
  const categories = getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Aegis-OSINT Framework
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
          Open Intelligence for a Networked World
        </p>
        <p className="text-gray-500 dark:text-gray-500 max-w-2xl mx-auto">
          A comprehensive, open-source OSINT framework providing organized access to publicly
          available intelligence resources, tools, and methodologies.
        </p>
      </header>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            OSINT Categories
          </h2>
          <Link
            href="/categories"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All →
          </Link>
        </div>
        <CategoryList categories={categories} />
      </div>

      <div className="text-center mt-12">
        <Link
          href="/categories"
          className="inline-block px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
        >
          Browse All Categories
        </Link>
      </div>
    </div>
  );
}
