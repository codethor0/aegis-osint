# Aegis-OSINT Framework

**Open Intelligence for a Networked World**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

An open-source OSINT (Open Source Intelligence) framework designed to provide security professionals, researchers, and investigators with organized access to publicly available intelligence resources, tools, and methodologies.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [OSINT Categories](#osint-categories)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Legal and Ethical Guidelines](#legal-and-ethical-guidelines)
- [License](#license)
- [Support](#support)

## Overview

The Aegis-OSINT Framework is a meticulously organized knowledgebase and optional web-based toolkit for conducting legal, ethical open-source intelligence research. The framework focuses primarily on U.S.-based resources while maintaining global applicability, providing researchers with:

- **Resource Catalog**: Collection of OSINT tools, databases, and services
- **Organized Categories**: Resources organized by intelligence type and use case
- **Methodology Guides**: Best practices and research methodologies
- **Legal Compliance**: Strict adherence to legal and ethical guidelines
- **Modern Web Interface**: Optional Next.js-based portal for browsing and searching resources

### Core Principles

- **Legality**: Only includes legal, publicly accessible resources
- **Ethics**: Strict ethical guidelines for responsible OSINT use
- **Quality**: High-quality, verified, and regularly updated information
- **Modularity**: Extensible architecture for future enhancements
- **Transparency**: Open-source, community-driven development

## Features

### Resource Management

- **Categorized Resources**: OSINT tools organized by category and use case
- **Detailed Metadata**: Information for each resource including legal status, access requirements, and capabilities
- **Search and Filter**: Search and filtering functionality
- **Verification System**: Resources are verified and regularly updated

### Documentation

- **Category Guides**: Guides for each OSINT category
- **Methodology Documentation**: Research methodologies and best practices
- **Legal Guidelines**: Legal and ethical considerations for OSINT research
- **Getting Started Guides**: Tutorials for new users

### Web Application (Optional)

- **Modern Interface**: Clean, professional web interface built with Next.js
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Fast Performance**: Server-side rendering for speed
- **Accessible**: Built with accessibility best practices

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm package manager
- Git (for cloning the repository)
- Modern web browser (for web application)

### Quick Start

1. **Clone the repository**:

   ```bash
   git clone https://github.com/aegis-osint/aegis-osint.git
   cd aegis-osint
   ```

2. **Install dependencies** (if using the web application):

   ```bash
   npm install
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000` to view the web application.

## Installation

### Option 1: Web Application

The web application provides an interactive interface for browsing OSINT resources.

```bash
# Clone the repository
git clone https://github.com/aegis-osint/aegis-osint.git
cd aegis-osint

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

### Option 2: Documentation Only

If you only need the documentation and resource data:

```bash
# Clone the repository
git clone https://github.com/aegis-osint/aegis-osint.git
cd aegis-osint

# Browse documentation
cd docs
# Read category guides, methodologies, and legal documentation
```

### Option 3: Data Files Only

Access the JSON data files directly for integration with other tools:

```bash
# Clone the repository
git clone https://github.com/aegis-osint/aegis-osint.git
cd aegis-osint

# Access data files
cd data
# Use categories.json and resources.json in your own applications
```

## Usage

### Web Application

The web application provides several ways to explore OSINT resources:

1. **Browse by Category**: Navigate through organized OSINT categories
2. **Search**: Use the search functionality to find specific resources
3. **Filter**: Apply filters by category, type, cost, and access level
4. **View Details**: Click on any resource to view details

### Documentation

- **Category Guides**: Located in `docs/categories/`, these guides provide detailed information about each OSINT category
- **Methodology Guides**: Found in `docs/methods/`, these documents explain research methodologies and best practices
- **Legal Guidelines**: Available in `docs/legal/`, these documents cover legal and ethical considerations

### Data Files

The JSON data files in `data/` can be used programmatically:

```typescript
import categories from './data/categories/categories.json';
import resources from './data/resources/resources.json';

// Access category data
const peopleSearchCategory = categories.find((cat) => cat.id === 'people-search');

// Access resource data
const peopleSearchTools = resources.filter((res) => res.category === 'people-search');
```

## OSINT Categories

The framework organizes OSINT resources into the following categories:

### People Search

Tools and databases for finding information about individuals, including contact information, social media profiles, and public records.

### Corporate Intelligence

Resources for researching companies, including business registrations, financial data, and corporate structures.

### Court Records

Access to federal and state court records, case filings, and legal documents.

### FOIA Systems

Freedom of Information Act request systems and public records databases.

### Real Estate Intelligence

Property records, ownership information, and real estate transaction data.

### Cybersecurity & Threat Intelligence

OSINT tools for cybersecurity research, threat intelligence, and security analysis.

### Social Media Intelligence

Tools and techniques for social media research and analysis.

### Domain Intelligence

Domain registration data, DNS information, and website intelligence.

### Automation Tools

Scripts, frameworks, and tools for automating OSINT research workflows.

## Project Structure

```
aegis-osint/
├── docs/                    # Documentation
│   ├── categories/         # OSINT category guides
│   ├── methods/            # Methodology documentation
│   └── legal/              # Legal and ethical guidelines
├── data/                   # JSON data files
│   ├── resources/         # Resource data files
│   └── categories/        # Category data files
├── src/                    # Application source code
│   ├── app/               # Next.js pages
│   ├── components/        # React components
│   ├── lib/               # Utilities and types
│   └── styles/            # Global styles
├── scripts/               # Build and validation scripts
├── tests/                 # Test suite
├── README.md              # This file
├── CONTRIBUTING.md        # Contribution guidelines
├── CODE_OF_CONDUCT.md     # Code of conduct
└── LICENSE                # MIT License
```

## Contributing

We welcome contributions from the community! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines on how to contribute.

### Ways to Contribute

- **Report Issues**: Found a bug or have a feature request? Open an issue.
- **Submit Resources**: Know of a great OSINT resource? Submit it for inclusion.
- **Improve Documentation**: Help us improve our documentation.
- **Write Code**: Contribute to the web application or scripts.
- **Review Pull Requests**: Help review and test contributions from others.

### Contribution Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
5. Participate in code review

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.

## Legal and Ethical Guidelines

### Legal Compliance

The Aegis-OSINT Framework is designed for legal, ethical use only. All resources included in this framework must be:

- **Publicly Accessible**: Available to the general public
- **Legal**: Compliant with applicable laws and regulations
- **Ethical**: Used in accordance with ethical guidelines
- **Respectful**: Respecting privacy and data protection laws

### Ethical Use

Users of this framework must:

- Use OSINT tools responsibly and ethically
- Respect privacy and confidentiality
- Comply with all applicable laws and regulations
- Not use resources for harassment, stalking, or illegal activities
- Follow the terms of service of all resources used

### Prohibited Activities

The following activities are strictly prohibited:

- Using OSINT tools for illegal purposes
- Harassment or stalking
- Unauthorized access to systems or data
- Violation of privacy laws
- Any activity that violates the Code of Conduct

### Disclaimer

This framework is provided for educational and research purposes only. Users are solely responsible for ensuring their use of OSINT tools and techniques complies with all applicable laws and regulations. The maintainers of this project are not responsible for any misuse of the information or tools provided.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Maintainer / Support

**Maintainer:** Thor Thor  
**Email:** codethor@gmail.com  
**GitHub:** https://github.com/codethor0  
**LinkedIn:** https://www.linkedin.com/in/thor-thor0/

If this project helps you, consider supporting ongoing maintenance:

- **One-time support:** https://buy.stripe.com/00w6oA7kM4wc4co5RB3Nm01
- **Monthly support:** https://buy.stripe.com/7sY3cobB2bYEdMYa7R3Nm00

Funding helps maintain OSINT data quality, documentation, bug fixes, roadmap experiments, and new feature development.

### Getting Help

- **Documentation**: Check the documentation in the `docs/` directory
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and general discussion

### Reporting Security Issues

If you discover a security vulnerability, please do not open a public issue. Instead, report it through appropriate channels as outlined in our security policy.

## Acknowledgments

The Aegis-OSINT Framework is built by and for the OSINT community. We thank all contributors, researchers, and security professionals who have helped shape this project.

## Roadmap

Future enhancements planned for the framework include:

- Additional OSINT categories and resources
- Enhanced search and filtering capabilities
- API endpoints for programmatic access
- CLI tools for command-line usage
- Integration with popular OSINT tools
- Automated resource verification
- Community-contributed resource submissions

## Related Projects

If you find the Aegis-OSINT Framework useful, you might also be interested in:

- Security research frameworks
- Threat intelligence platforms
- Digital forensics tools
- Privacy and security resources

---

**Aegis-OSINT Framework** - Open Intelligence for a Networked World

Built by and for the OSINT community
