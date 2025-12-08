import { getCategories } from '@/lib/data';
import CategoryList from '@/components/CategoryList';

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          OSINT Categories
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse all OSINT resource categories organized by intelligence type and use case.
        </p>
      </div>

      <CategoryList categories={categories} />
    </div>
  );
}
