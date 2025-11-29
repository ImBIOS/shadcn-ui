<!--
Sync Impact Report:
- Version: Initial → 1.0.0 (first ratification)
- Added: Four core principles (Code Quality, Testing Standards, UX Consistency, Performance Requirements)
- Added: Development Workflow section
- Added: Quality Gates section
- Templates status:
  ✅ plan-template.md - Reviewed, constitution gates align with principles
  ✅ spec-template.md - Reviewed, requirements structure supports principles
  ✅ tasks-template.md - Reviewed, test-first workflow aligns
  ✅ Command files in .cursor/commands/ - No updates required (generic agent references only)
- Follow-up: None - all placeholders filled
-->

# ImBIOS UI Constitution

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)

All code contributions MUST adhere to the following non-negotiable standards:

- **Type Safety**: TypeScript strict mode MUST be enabled. No `any` types except when interfacing with truly untyped external APIs, and these MUST be documented with explicit rationale.
- **Code Complexity**: Functions MUST be single-purpose and maintainable. Cyclomatic complexity > 10 requires explicit justification and approval. Time and space complexity MUST be documented for non-trivial algorithms.
- **Code Review**: All changes MUST pass peer review focusing on readability, maintainability, and adherence to patterns established in the codebase.
- **Documentation**: Public APIs MUST have TSDoc comments. Complex logic MUST have inline explanations. Architecture decisions MUST be documented.
- **Linting**: Zero linter errors or warnings at commit time. ESLint/Prettier configurations are enforced via pre-commit hooks.

**Rationale**: Quality gates prevent technical debt accumulation and ensure long-term maintainability. The cost of fixing quality issues grows exponentially with time.

### II. Testing Standards (NON-NEGOTIABLE)

Test-Driven Development is mandatory for all features:

- **TDD Workflow**: Tests MUST be written first, reviewed, confirmed failing, then implementation follows. Red-Green-Refactor cycle strictly enforced.
- **Test Coverage**: Minimum 80% code coverage for new features. Critical paths (auth flows, data mutations) require 100% coverage.
- **Test Pyramid**:
  - **Unit tests** (70%): Fast, isolated, test single units of logic
  - **Integration tests** (20%): Test component interactions, API contracts
  - **E2E tests** (10%): Test critical user journeys
- **Performance Tests**: Features affecting user interaction MUST include performance regression tests with documented baselines.
- **Test Quality**: Tests MUST be deterministic, fast (<5s for unit suites), and independently runnable. Flaky tests are treated as failing tests.

**Rationale**: TDD ensures testability by design, prevents regression, and serves as living documentation. The test pyramid optimizes for fast feedback cycles.

### III. User Experience Consistency (NON-NEGOTIABLE)

All user-facing features MUST maintain consistent experience:

- **Accessibility**: WCAG 2.1 Level AA compliance MUST be verified. Keyboard navigation, screen reader support, and focus management are mandatory.
- **Design Tokens**: All styling MUST use centralized design tokens (colors, spacing, typography). No hardcoded values in components.
- **Component Patterns**: New components MUST follow established patterns. Deviations require design system review and documentation.
- **i18n Support**: All user-facing text MUST be externalized for internationalization. No hardcoded strings in components.
- **Error Handling**: User errors MUST provide clear, actionable feedback. System errors MUST be logged with context while showing user-friendly messages.
- **Loading States**: All async operations MUST show loading indicators. Skeleton screens preferred over spinners for content areas.

**Rationale**: Consistency reduces cognitive load, improves usability, and ensures equitable access. Design systems scale better than ad-hoc styling.

### IV. Performance Requirements (NON-NEGOTIABLE)

All features MUST meet these performance thresholds:

- **Initial Load**: Time to Interactive (TTI) < 3 seconds on 3G networks for critical paths
- **Interaction Responsiveness**: User interactions MUST provide feedback within 100ms (visual acknowledgment), complete within 1 second for common operations
- **Bundle Size**: Component bundles MUST be tree-shakeable. Individual component impact < 10KB gzipped. Total bundle growth requires explicit approval.
- **Runtime Performance**:
  - React components MUST avoid unnecessary re-renders (measured via React DevTools Profiler)
  - Memory leaks MUST be prevented (event listeners cleaned up, subscriptions unsubscribed)
  - Animations MUST maintain 60 FPS (use CSS transforms/opacity, avoid layout thrashing)
- **Complexity Analysis**: Algorithm choices MUST document time/space complexity. O(n²) or worse requires explicit justification.

**Rationale**: Performance is a feature. Slow UIs frustrate users and increase abandonment rates. Performance budgets prevent gradual degradation.

## Development Workflow

### Feature Development Process

1. **Specification Phase**: Feature requirements documented in `specs/` following spec-template.md format
2. **Planning Phase**: Technical design and task breakdown in implementation plan following plan-template.md
3. **Test-First Implementation**:
   - Write failing tests (contract, integration as applicable)
   - Implement minimum code to pass tests
   - Refactor while keeping tests green
   - Add documentation
4. **Review Phase**: PR review covering code quality, test coverage, performance impact, and UX consistency
5. **Validation Phase**: QA validation against acceptance criteria from specification

### Branching Strategy

- **Feature branches**: `###-feature-name` format where ### is issue/task number
- **Main branch**: Production-ready code only. All merges via PR.
- **Protected main**: Requires passing CI (tests, lints, type-check, bundle size check)

### Commit Standards

- Conventional commits format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `perf`, `chore`
- Atomic commits: Each commit represents a single logical change

## Quality Gates

All PRs MUST pass these gates before merge approval:

### Automated Gates (CI/CD)

- ✅ All tests pass (unit, integration, e2e)
- ✅ Test coverage meets minimum thresholds
- ✅ TypeScript compilation succeeds (strict mode)
- ✅ Zero linter errors/warnings
- ✅ Bundle size impact within limits
- ✅ No accessibility violations in changed components

### Manual Review Gates

- ✅ Code review approved by at least one maintainer
- ✅ Design review approved for UI changes
- ✅ Performance impact assessed for user-facing changes
- ✅ Documentation updated (API docs, README, CHANGELOG)
- ✅ Breaking changes documented with migration guide

### Complexity Justification

Any PR introducing the following MUST include written justification:

- Cyclomatic complexity > 10
- Bundle size increase > 5KB
- New third-party dependency
- Breaking API changes
- Performance regression in existing features
- Accessibility exceptions (must be temporary with remediation plan)

## Governance

### Constitution Authority

This constitution supersedes all other development practices and guidelines. In case of conflict, constitution principles take precedence.

### Amendment Process

Constitution amendments require:

1. Written proposal documenting: change rationale, impact analysis, migration plan
2. Review and approval by project maintainers
3. Version bump following semantic versioning:
   - **MAJOR**: Backward-incompatible principle changes, removals
   - **MINOR**: New principles added, material expansions
   - **PATCH**: Clarifications, wording improvements, non-semantic refinements
4. Update to all dependent templates and documentation
5. Team notification and training on changes

### Compliance Review

- **PR Review**: Every PR MUST verify compliance with applicable principles
- **Quarterly Audits**: Codebase audited quarterly for drift from constitution standards
- **Violation Response**: Constitution violations are treated as bugs (must fix before merge)
- **Continuous Improvement**: Principles may be refined based on team retrospectives and lessons learned

### Exceptions

Exceptions to constitution principles:

- MUST be documented in PR description with explicit rationale
- MUST include remediation plan with timeline
- MUST be approved by project lead
- MUST be tracked as technical debt with associated issue

**Version**: 1.0.0 | **Ratified**: 2025-11-25 | **Last Amended**: 2025-11-25
