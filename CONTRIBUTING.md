# Contributing to ArcFactory Token Factory

Thank you for your interest in contributing to ArcFactory Token Factory!

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ArcFactory-Token-Factory.git
   cd ArcFactory-Token-Factory
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Making Changes

1. Make your changes in a feature branch
2. Write or update tests if applicable
3. Ensure code compiles:
   ```bash
   npm run compile
   ```
4. Test your changes on testnet
5. Update documentation if needed

### Code Style

- Follow existing code formatting
- Use clear, descriptive variable names
- Add comments for complex logic
- Keep functions focused and small
- Use Solidity 0.8.20 features

### Commit Messages

Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

Examples:
```
feat(factory): add batch token creation
fix(token): resolve blacklist check in _update
docs(readme): update deployment instructions
```

### Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the API.md if you changed function signatures
3. Ensure all tests pass
4. Update the DEPLOYMENT.md if you changed deployment process
5. Request review from maintainers

## Testing

### Local Testing

```bash
# Compile contracts
npm run compile

# Test on Arc Testnet
npm run test-factory
```

### Manual Testing Checklist

- [ ] Contract compiles without errors
- [ ] Deployment succeeds on testnet
- [ ] Token creation works
- [ ] All token features function correctly
- [ ] Gas costs are reasonable
- [ ] Events are emitted correctly
- [ ] Access control works as expected

## Security

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead, email security@arcflow.finance with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Security Best Practices

- Never commit private keys
- Use `.env` for sensitive data
- Follow OpenZeppelin security patterns
- Implement proper access control
- Add reentrancy guards where needed
- Validate all inputs
- Use SafeMath (built into Solidity 0.8+)

## Documentation

### What to Document

- New features and functions
- Breaking changes
- Configuration changes
- Deployment procedures
- API changes

### Documentation Style

- Be clear and concise
- Include code examples
- Explain the "why" not just the "what"
- Keep it up to date

## Gas Optimization

When optimizing for gas:

1. Measure before and after
2. Document the optimization
3. Ensure functionality is preserved
4. Consider readability vs. optimization tradeoff

## Questions?

- Open a discussion on GitHub
- Check existing issues and PRs
- Review the documentation

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes (for significant contributions)
- Project documentation (for major features)

Thank you for contributing! 🚀
