import { Suspense } from 'react';
import FavoritesContent from '@/components/FavoritesContent';

function FavoritesFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Favorites
      </h1>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <Suspense fallback={<FavoritesFallback />}>
      <FavoritesContent />
    </Suspense>
  );
}
