import Link from 'next/link';
import type { Category } from '@/lib/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="block p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={`View ${category.name} category`}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {category.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {category.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {category.tags &&
          category.tags.length > 0 &&
          category.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
            >
              {tag}
            </span>
          ))}
        {category.tags && category.tags.length > 3 && (
          <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-500">
            +{category.tags.length - 3} more
          </span>
        )}
      </div>
    </Link>
  );
}
