import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getResourceById, getCategoryById, getAllResourceIds } from '@/lib/data';
import { generateMetadata } from './metadata';
import { isValidUrl, validateUrls } from '@/lib/url-validation';
import BookmarkButton from '@/components/BookmarkButton';

export { generateMetadata };

interface ResourcePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const ids = getAllResourceIds();
  return ids.map((id) => ({
    id,
  }));
}

export const dynamicParams = false;

export default async function ResourceDetailPage({ params }: ResourcePageProps) {
  const { id } = await params;
  const resource = getResourceById(id);

  if (!resource) {
    notFound();
  }

  const category = getCategoryById(resource.category);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        {category && (
          <Link
            href={`/categories/${category.slug}`}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 inline-block"
          >
            ← Back to {category.name}
          </Link>
        )}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1
              className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4"
              data-testid="resource-detail-title"
            >
              {resource.name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{resource.description}</p>
          </div>
          <div className="flex-shrink-0">
            <BookmarkButton resourceId={resource.id} size="lg" />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Information
          </h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isValidUrl(resource.url) && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">URL</dt>
                <dd className="text-gray-900 dark:text-gray-100">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                    data-testid="resource-detail-link"
                  >
                    {resource.url}
                  </a>
                </dd>
              </div>
            )}
            {category && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Category
                </dt>
                <dd className="text-gray-900 dark:text-gray-100">
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {category.name}
                  </Link>
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Cost</dt>
              <dd className="text-gray-900 dark:text-gray-100 capitalize">{resource.cost}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Type</dt>
              <dd className="text-gray-900 dark:text-gray-100">
                {resource.type.replace(/_/g, ' ')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Region</dt>
              <dd className="text-gray-900 dark:text-gray-100">{resource.region}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Risk Level
              </dt>
              <dd className="text-gray-900 dark:text-gray-100 capitalize">{resource.risk_level}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Authentication Required
              </dt>
              <dd className="text-gray-900 dark:text-gray-100">
                {resource.auth_required ? 'Yes' : 'No'}
              </dd>
            </div>
            {resource.api_available && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  API Available
                </dt>
                <dd className="text-gray-900 dark:text-gray-100">Yes</dd>
              </div>
            )}
            {resource.api_docs && isValidUrl(resource.api_docs) && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  API Documentation
                </dt>
                <dd className="text-gray-900 dark:text-gray-100">
                  <a
                    href={resource.api_docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View API Docs
                  </a>
                </dd>
              </div>
            )}
            {resource.last_verified && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Last Verified
                </dt>
                <dd className="text-gray-900 dark:text-gray-100">
                  {new Date(resource.last_verified).toLocaleDateString()}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {resource.long_description && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Description
            </h2>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
              {resource.long_description}
            </p>
          </div>
        )}

        {resource.use_cases && resource.use_cases.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Use Cases
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              {resource.use_cases.map((useCase, index) => (
                <li key={index}>{useCase}</li>
              ))}
            </ul>
          </div>
        )}

        {resource.limitations && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Limitations
            </h2>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
              {resource.limitations}
            </p>
          </div>
        )}

        {resource.legal_notes && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Legal Notes
            </h2>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
              {resource.legal_notes}
            </p>
          </div>
        )}

        {resource.tags && resource.tags.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {resource.alternative_urls && resource.alternative_urls.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Alternative URLs
            </h2>
            <ul className="space-y-2">
              {validateUrls(resource.alternative_urls).map((url, index) => (
                <li key={index}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
