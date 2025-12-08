export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Aegis-OSINT Framework - Open Intelligence for a Networked World</p>
          <p className="mt-2">
            <a
              href="https://github.com"
              className="hover:text-gray-900 dark:hover:text-gray-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            {' · '}
            <a href="/about" className="hover:text-gray-900 dark:hover:text-gray-200">
              About
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
