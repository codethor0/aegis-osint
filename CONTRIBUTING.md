# Contributing to Aegis-OSINT Framework

Thank you for your interest in contributing to the Aegis-OSINT Framework! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Documentation Standards](#documentation-standards)
- [Submitting Changes](#submitting-changes)
- [Resource Submission Guidelines](#resource-submission-guidelines)
- [Legal and Ethical Guidelines](#legal-and-ethical-guidelines)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before participating.

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git
- A GitHub account
- Familiarity with TypeScript (for code contributions)
- Understanding of OSINT principles and legal boundaries

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/aegis-osint.git
   cd aegis-osint
   ```
3. Install dependencies (if working on the web application):
   ```bash
   npm install
   ```
4. Create a new branch for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## How to Contribute

There are many ways to contribute to Aegis-OSINT:

### Reporting Issues

- **Bug Reports**: If you find a bug, please open an issue with a clear description, steps to reproduce, and expected vs. actual behavior.
- **Feature Requests**: Suggest new features or improvements through GitHub Issues.
- **Documentation Issues**: Report typos, unclear sections, or missing information.

### Contributing Code

- Fix bugs
- Implement new features
- Improve existing functionality
- Optimize performance
- Refactor code for better maintainability

### Contributing Documentation

- Improve existing documentation
- Add new guides or tutorials
- Fix typos and grammatical errors
- Translate documentation (if applicable)

### Contributing Resources

- Submit new OSINT resources (tools, databases, services)
- Verify existing resources
- Update outdated resource information
- Add new OSINT categories

## Development Workflow

### Branch Naming Convention

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring
- `test/description` - Test additions or changes

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Maintenance tasks

Example:

```
feat(resources): add new people search tool

Added WhitePages Pro to the people search category with complete
metadata including API availability and legal status verification.
```

### Pull Request Process

1. **Before Submitting**:
   - Ensure your code follows the project's coding standards
   - Run all tests and ensure they pass
   - Update documentation as needed
   - Verify all links and references are valid

2. **Creating a Pull Request**:
   - Push your branch to your fork
   - Create a pull request with a clear title and description
   - Reference any related issues
   - Request review from maintainers

3. **Pull Request Requirements**:
   - All checks must pass (tests, linting, validation)
   - Code must be reviewed and approved
   - Documentation must be updated if applicable
   - No merge conflicts

4. **After Approval**:
   - Maintainers will merge your PR
   - Your contribution will be credited in the project

## Project Structure

```
aegis-osint/
├── docs/              # Documentation
│   ├── categories/    # OSINT category guides
│   ├── methods/       # Methodology documentation
│   └── legal/         # Legal and ethical guidelines
├── data/              # JSON data files
│   ├── resources/     # Resource data files
│   └── categories/    # Category data files
├── src/               # Application source code
│   ├── app/           # Next.js pages
│   ├── components/    # React components
│   ├── lib/           # Utilities and types
│   └── styles/        # Global styles
├── scripts/           # Build and validation scripts
└── tests/             # Test suite
```

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Avoid `any` types; use proper type definitions
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public functions

### React/Next.js

- Use functional components with hooks
- Prefer Server Components when possible
- Follow Next.js App Router conventions
- Keep components small and focused
- Use TypeScript for all components

### Code Formatting

- Use Prettier for code formatting
- Follow ESLint rules
- Maintain consistent indentation (2 spaces)
- Use meaningful commit messages

## Documentation Standards

### Markdown Files

- Use clear, descriptive headings
- Include a table of contents for long documents
- Use code blocks with syntax highlighting
- Verify all links are valid
- Follow consistent formatting

### Resource Documentation

- Provide accurate, verified information
- Include legal status and access requirements
- Document limitations and use cases
- Include last verified date
- Provide official URLs only

## Submitting Changes

### For Code Changes

1. Write clean, well-documented code
2. Add or update tests as needed
3. Ensure all tests pass
4. Update relevant documentation
5. Submit a pull request with a clear description

### For Documentation Changes

1. Ensure accuracy and clarity
2. Verify all links and references
3. Follow the existing documentation style
4. Update the table of contents if needed
5. Submit a pull request

### For Resource Submissions

1. Verify the resource is legal and publicly accessible
2. Complete all required metadata fields
3. Test the resource to ensure it works
4. Document any limitations or restrictions
5. Submit through a pull request or issue

## Resource Submission Guidelines

When submitting a new OSINT resource, please include:

### Required Information

- **Name**: Official name of the resource
- **Category**: Appropriate OSINT category
- **Type**: Tool, database, service, API, etc.
- **Description**: Clear, concise description
- **URL**: Primary URL (must be valid)
- **Cost**: Free, freemium, paid, or enterprise
- **Access Level**: Public, registration required, etc.
- **Legal Status**: Legal, restricted, region-specific
- **Country**: Primary country (e.g., "US")
- **Features**: Key features and capabilities
- **Use Cases**: Common use cases
- **Last Verified**: Date of verification

### Verification Requirements

- Verify the URL is accessible and current
- Test the resource functionality
- Confirm legal status and access requirements
- Document any limitations or restrictions
- Ensure the resource is appropriate for inclusion

### What Not to Submit

- Illegal tools or services
- Resources that violate privacy laws
- Paid services without free tiers (unless exceptional value)
- Outdated or non-functional resources
- Resources that require illegal activities to access

## Legal and Ethical Guidelines

### Legal Compliance

- Only submit legal, publicly accessible resources
- Respect terms of service of all resources
- Do not include tools for illegal activities
- Respect privacy and data protection laws
- Comply with all applicable laws and regulations

### Ethical Considerations

- Use OSINT tools responsibly and ethically
- Respect privacy and confidentiality
- Do not use resources for harassment or stalking
- Follow ethical hacking principles
- Report vulnerabilities responsibly

### Prohibited Activities

- Using OSINT tools for illegal purposes
- Harassment or stalking
- Unauthorized access to systems or data
- Violation of privacy laws
- Any activity that violates the Code of Conduct

## Review Process

All contributions are reviewed by maintainers. The review process may include:

- Code quality and standards review
- Functionality testing
- Documentation review
- Legal and ethical compliance check
- Security review

Please be patient during the review process. Maintainers are volunteers and may take time to review contributions.

## Getting Help

If you need help or have questions:

- Open a GitHub Discussion for general questions
- Open a GitHub Issue for bugs or feature requests
- Check existing documentation first
- Review closed issues and pull requests

## Recognition

Contributors will be recognized in:

- The project's README.md
- Release notes
- The project's contributors page (if applicable)

Thank you for contributing to Aegis-OSINT Framework!
