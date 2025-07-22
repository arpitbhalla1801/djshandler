## 🤝 Contributing to djshandler

Thank you for your interest in contributing to djshandler! We welcome contributions from the community.

### 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/djshandler.git`
3. **Install** dependencies: `npm install`
4. **Create** a new branch: `git checkout -b feature/amazing-feature`
5. **Make** your changes
6. **Test** your changes: `npm test`
7. **Commit** your changes: `git commit -m 'Add amazing feature'`
8. **Push** to your branch: `git push origin feature/amazing-feature`
9. **Open** a Pull Request

### 🛠️ Development Setup

This project uses TurboRepo for monorepo management:

```bash
# Install dependencies for all packages
npm install

# Build all packages
npm run build

# Start development mode (watches for changes)
npm run dev

# Run tests
npm run test

# Run linting
npm run lint

# Type check
npm run type-check
```

### 📁 Project Structure

```
djshandler/
├── packages/
│   ├── djshandler-core/     # Core framework
│   │   ├── src/
│   │   │   ├── handler.ts   # Main handler class
│   │   │   ├── types.ts     # TypeScript types
│   │   │   ├── decorators.ts# Decorator utilities
│   │   │   └── utils.ts     # Utility functions
│   │   └── tests/           # Core tests
│   └── djshandler-cli/      # CLI tool
│       ├── src/
│       │   ├── commands/    # CLI commands
│       │   ├── utils/       # CLI utilities
│       │   └── cli.ts       # Main CLI entry
│       └── tests/           # CLI tests
├── turbo.json              # TurboRepo configuration
└── package.json            # Root package.json
```

### 🧪 Testing

We use Vitest for testing:

```bash
# Run tests for all packages
npm test

# Run tests for specific package
npm run test --workspace=djshandler-core

# Run tests in watch mode
npm run test:watch
```

### 📝 Code Style

We use ESLint and Prettier for code formatting:

```bash
# Lint all code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### 🎯 Areas for Contribution

#### 🔧 Core Framework (`djshandler-core`)
- Command middleware system
- Advanced error handling
- Performance optimizations
- Additional Discord.js integrations
- Plugin system

#### 🛠️ CLI Tool (`djshandler-cli`)
- Additional project templates
- Interactive configuration wizard
- Hot reload implementation
- Command deployment improvements
- Database integration templates

#### 📖 Documentation
- Code examples
- Tutorials and guides
- API documentation
- Video tutorials

#### 🧪 Testing
- Unit tests
- Integration tests
- CLI command tests
- Example project tests

### 💡 Feature Requests

Before working on a new feature:

1. **Check** existing [issues](https://github.com/arpitbhalla1801/djshandler/issues) and [discussions](https://github.com/arpitbhalla1801/djshandler/discussions)
2. **Create** an issue to discuss the feature
3. **Wait** for maintainer approval before starting work
4. **Follow** the development setup above

### 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Environment details** (Node.js version, OS, etc.)
5. **Code examples** or minimal reproduction

### 📋 Pull Request Guidelines

#### Before Submitting

- [ ] Tests pass (`npm test`)
- [ ] Code is linted (`npm run lint`)
- [ ] Types check (`npm run type-check`)
- [ ] Documentation is updated
- [ ] Changeset is added (if applicable)

#### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing performed

## Checklist
- [ ] Tests pass
- [ ] Code is linted
- [ ] Documentation updated
- [ ] Breaking changes documented
```

### 🔄 Release Process

We use [Changesets](https://github.com/changesets/changesets) for version management:

```bash
# Add a changeset
npx changeset

# Version packages (maintainers only)
npx changeset version

# Publish (maintainers only)
npx changeset publish
```

### 📞 Getting Help

- 💬 [Discord Server](https://discord.gg/YOUR_INVITE) - General discussion
- 🐛 [GitHub Issues](https://github.com/arpitbhalla1801/djshandler/issues) - Bug reports
- 💡 [GitHub Discussions](https://github.com/arpitbhalla1801/djshandler/discussions) - Feature requests

### 🏆 Recognition

Contributors will be:
- Added to the contributors list
- Mentioned in release notes
- Given credit in documentation

Thank you for helping make djshandler better! 🚀
