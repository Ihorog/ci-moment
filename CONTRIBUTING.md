# Contributing to Ci Moment

Thank you for your interest in contributing to Ci Moment! This document provides guidelines for contributing to the project.

## 🤝 Code of Conduct

This is a personal project maintained by Ihorog. We expect all interactions to be respectful and constructive.

## 📝 How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists in [GitHub Issues](https://github.com/Ihorog/ci-moment/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (browser, OS, Node version)

### Suggesting Features

For feature requests:

1. Open an issue with the `feature request` label
2. Describe the feature and its use case
3. Explain why it would benefit the project
4. Be open to discussion and feedback

### Asking Questions

For questions about usage or functionality:

1. Check the documentation in `/docs` folder
2. Review the README.md
3. Search existing issues
4. If still unclear, open a new issue with the `question` label

## 💻 Development Process

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ci-moment.git
   cd ci-moment
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. Make your changes following the coding standards below

3. Test your changes:
   ```bash
   npm run dev        # Test locally
   npm run type-check # TypeScript validation
   npm run lint       # ESLint validation
   npm run build      # Production build test
   ```

4. Commit your changes:
   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request from your fork to the main repository

### Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Ensure all checks pass (type-check, lint, build)
- Keep changes focused and minimal
- Update documentation if needed
- Be responsive to feedback and review comments

## 📋 Coding Standards

### TypeScript

- Use strict TypeScript types
- Avoid `any` type
- Export types for reusable interfaces
- Use proper type imports

### React Components

- Use functional components with hooks
- Keep components focused and small
- Use inline styles (matching project style)
- Extract reusable logic into hooks

### File Organization

```
app/                 # Next.js App Router pages and API routes
components/          # Reusable React components
lib/                 # Utilities and shared logic
db/                  # Database schemas
docs/                # Documentation
```

### Naming Conventions

- **Files**: PascalCase for components (`Landing.tsx`), camelCase for utilities (`engine.ts`)
- **Components**: PascalCase (`Landing`, `Result`)
- **Functions**: camelCase (`calculateStatus`, `generateArtifact`)
- **Constants**: UPPER_SNAKE_CASE (`STRIPE_SECRET_KEY`)
- **Types/Interfaces**: PascalCase (`ArtifactData`, `ContextType`)

### Code Style

- Use double quotes for strings
- 2 spaces for indentation
- No semicolons (follow project convention)
- Descriptive variable names
- Comments only when necessary
- Keep functions small and focused

### Git Commits

- Use present tense ("Add feature" not "Added feature")
- Keep first line under 72 characters
- Reference issues when applicable
- Be descriptive but concise

## 🔒 Security

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email the details to the repository owner (check GitHub profile)
3. Include steps to reproduce
4. Allow time for a fix before public disclosure

See SECURITY.md for more details.

## 🧪 Testing

Currently, the project focuses on:

- Type safety (TypeScript)
- Linting (ESLint)
- Manual testing
- Build validation

When adding new features:

- Ensure TypeScript types are correct
- Test in development mode
- Test production build
- Test on multiple browsers if UI changes

## 📚 Documentation

When adding features:

- Update README.md if user-facing
- Update relevant docs in `/docs` folder
- Add inline comments for complex logic
- Update CHANGELOG.md for releases

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the same license as the project (see LICENSE file).

Note: This is proprietary software. Contributions do not grant you rights to use the software in production without explicit permission.

## ❓ Questions?

If you have questions about contributing:

- Open an issue with the `question` label
- Check existing documentation
- Review closed issues for similar questions

## 🙏 Recognition

Contributors will be acknowledged in release notes and the README (if applicable).

---

Thank you for contributing to Ci Moment! 🎉
