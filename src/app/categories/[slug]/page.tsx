import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, getResourcesByCategory, getAllCategorySlugs } from '@/lib/data';
import ResourceList from '@/components/ResourceList';
import { generateMetadata } from './metadata';

export { generateMetadata };

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllCategorySlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export const dynamicParams = false;

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const resources = getResourcesByCategory(category.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link
          href="/categories"
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 inline-block"
        >
          ← Back to Categories
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {category.name}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
        {category.long_description && (
          <p className="text-gray-500 dark:text-gray-500 mb-4">{category.long_description}</p>
        )}
        {category.tags && category.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {category.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="text-sm text-gray-500 dark:text-gray-500">Region: {category.region}</div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Resources ({resources.length})
        </h2>
        <ResourceList resources={resources} />
      </div>
    </div>
  );
}
