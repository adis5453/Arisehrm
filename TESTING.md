# Testing Guide

This document outlines the testing strategy and setup for the Arise HRM application.

## Test Structure

```
src/
├── __tests__/
│   ├── components/     # Component tests
│   ├── hooks/         # Custom hook tests
│   ├── services/      # API service tests
│   └── utils/         # Utility function tests
├── e2e/              # End-to-end tests (Cypress/Playwright)
└── test-utils.tsx    # Testing utilities
```

## Running Tests

### Unit Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run coverage report
npm test -- --coverage
```

### E2E Tests
```bash
# Run Cypress in interactive mode
npm run test:e2e

# Run Cypress headless
npm run test:e2e:ci
```

## Testing Libraries

- **Vitest**: Test runner
- **React Testing Library**: Component testing
- **MSW**: API mocking
- **Cypress**: E2E testing

## Best Practices

1. **Test Organization**
   - Group tests by feature
   - Use descriptive test names
   - Follow the AAA pattern (Arrange, Act, Assert)

2. **Component Testing**
   - Test behavior, not implementation
   - Use `data-testid` for stable selectors
   - Mock external dependencies

3. **API Testing**
   - Use MSW for API mocking
   - Test error states and edge cases
   - Mock network conditions when needed

## Writing New Tests

1. Create a new test file next to the component/hook being tested
2. Use the `render` utility from `test-utils`
3. Follow the testing patterns in existing test files

## Debugging Tests

- Use `screen.debug()` to inspect the rendered output
- Add `--no-cache` flag if tests are not picking up changes
- Check the browser console for errors when debugging in watch mode
