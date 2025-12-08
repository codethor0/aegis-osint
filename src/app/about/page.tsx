import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        About Aegis-OSINT Framework
      </h1>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Overview</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The Aegis-OSINT Framework is an open-source OSINT (Open Source Intelligence) framework
            designed to provide security professionals, researchers, and investigators with
            organized access to publicly available intelligence resources, tools, and methodologies.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            The framework focuses primarily on U.S.-based resources while maintaining global
            applicability, providing researchers with a curated collection of OSINT tools,
            databases, and services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Core Principles
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>
              <strong>Legality:</strong> Only includes legal, publicly accessible resources
            </li>
            <li>
              <strong>Ethics:</strong> Strict ethical guidelines for responsible OSINT use
            </li>
            <li>
              <strong>Quality:</strong> Verified and regularly updated information
            </li>
            <li>
              <strong>Modularity:</strong> Extensible architecture for future enhancements
            </li>
            <li>
              <strong>Transparency:</strong> Open-source, community-driven development
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>Categorized OSINT resources organized by intelligence type</li>
            <li>Detailed metadata for each resource</li>
            <li>Search and filtering capabilities</li>
            <li>Verification system for resource accuracy</li>
            <li>Web interface for browsing and searching</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Contributing
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We welcome contributions from the community! Please see our{' '}
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
              contribution guidelines
            </Link>{' '}
            for more information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">License</h2>
          <p className="text-gray-600 dark:text-gray-400">
            This project is licensed under the MIT License. See the LICENSE file for details.
          </p>
        </section>
      </div>
    </div>
  );
}
