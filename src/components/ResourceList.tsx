import type { Resource } from '@/lib/types';
import ResourceCard from './ResourceCard';

interface ResourceListProps {
  resources: Resource[];
}

export default function ResourceList({ resources }: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400" data-testid="search-no-results">
          No resources available in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
