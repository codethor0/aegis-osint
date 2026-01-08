'use client';

import { useState, useEffect } from 'react';
import { isBookmarked, toggleBookmark } from '@/lib/bookmarks';

interface BookmarkButtonProps {
  resourceId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function BookmarkButton({
  resourceId,
  className = '',
  size = 'md',
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBookmarked(isBookmarked(resourceId));
  }, [resourceId]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (mounted) {
      const newState = toggleBookmark(resourceId);
      setBookmarked(newState);
      window.dispatchEvent(new CustomEvent('bookmarks-changed'));
    }
  };

  if (!mounted) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses[size]} ${className} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded`}
      aria-label={bookmarked ? `Remove ${resourceId} from bookmarks` : `Bookmark ${resourceId}`}
      type="button"
      data-testid="favorite-toggle"
      data-resource-id={resourceId}
    >
      {bookmarked ? (
        <svg
          className="w-full h-full text-yellow-500 fill-current"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ) : (
        <svg
          className="w-full h-full text-gray-400 hover:text-yellow-500 transition-colors"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      )}
    </button>
  );
}

