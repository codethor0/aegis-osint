import Link from 'next/link';
import type { Resource } from '@/lib/types';

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Link
      href={`/resources/${resource.id}`}
      className="block p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={`View ${resource.name} resource details`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex-1">
          {resource.name}
        </h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {resource.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-2">
        <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded capitalize">
          {resource.cost}
        </span>
        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
          {resource.type.replace(/_/g, ' ')}
        </span>
        {resource.risk_level !== 'none' && (
          <span
            className={`px-2 py-1 text-xs rounded ${
              resource.risk_level === 'high'
                ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                : resource.risk_level === 'medium'
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                  : 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300'
            }`}
          >
            Risk: {resource.risk_level}
          </span>
        )}
        {resource.auth_required && (
          <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
            Auth Required
          </span>
        )}
        {resource.api_available && (
          <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
            API
          </span>
        )}
      </div>
      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
