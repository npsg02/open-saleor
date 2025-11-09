# Contributing to Open Saleor

Thank you for your interest in contributing to Open Saleor! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/open-saleor.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit with clear messages: `git commit -m "Add feature X"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Guidelines

### Code Style

- **JavaScript/TypeScript**: Follow the ESLint configuration
- **React Components**: Use functional components with hooks
- **CSS**: Use Tailwind CSS utility classes
- **Naming**: Use descriptive, meaningful names

### Commit Messages

Follow the conventional commits specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```
feat: add product filtering by category
fix: resolve cart total calculation issue
docs: update setup instructions
```

### Testing

- Test your changes locally before submitting
- Ensure the storefront builds without errors: `npm run build`
- Check for TypeScript errors: `npm run type-check`
- Run linting: `npm run lint`

### Pull Request Process

1. Update README.md or documentation if needed
2. Ensure your code follows the project's style guidelines
3. Test your changes thoroughly
4. Update CHANGELOG.md if applicable
5. Request review from maintainers

## Areas for Contribution

### High Priority

- Payment gateway integrations
- Shipping method implementations
- Search functionality
- Product filtering and sorting
- User authentication (login/register)
- Order management

### Medium Priority

- Performance optimizations
- Mobile responsiveness improvements
- Accessibility improvements
- Internationalization (i18n)
- Additional pages (About, Contact, etc.)
- SEO optimizations

### Documentation

- Setup guides
- API usage examples
- Deployment tutorials
- Troubleshooting guides
- Video tutorials

## Questions?

Feel free to:
- Open an issue for bugs or feature requests
- Join discussions in existing issues
- Ask questions in pull requests

Thank you for contributing! 🎉
