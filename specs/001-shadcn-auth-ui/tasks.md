# Tasks: shadcn-Style Better Auth UI Library

**Branch**: `001-shadcn-auth-ui`
**Input**: Design documents from `/specs/001-shadcn-auth-ui/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Tests**: TDD workflow required per constitution. Tests written first, must fail, then implement.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and monorepo structure

- [X] T001 Verify Nx workspace configuration in nx.json with correct executors
- [X] T002 Verify pnpm workspace configuration in pnpm-workspace.yaml
- [X] T003 [P] Verify Biome configuration in biome.json with ultracite preset
- [X] T004 [P] Verify husky pre-commit hooks in .husky/pre-commit for linting
- [X] T005 [P] Create packages/config/tsconfig.base.json with strict mode enabled
- [X] T006 [P] Configure packages/ui/package.json for NPM package publishing
- [X] T007 [P] Configure packages/api/package.json for registry utilities
- [X] T008 [P] Configure apps/web/package.json for documentation site
- [X] T009 Create apps/web/src/registry/ directory for static registry JSON files
- [X] T010 Create apps/web/content/docs/ directory structure for MDX documentation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Testing Infrastructure

- [X] T011 [P] Create packages/ui/vitest.config.ts with jsdom environment and coverage thresholds
- [X] T012 [P] Create packages/ui/tests/setup.ts with testing-library configuration
- [X] T013 [P] Create apps/web/vitest.config.ts for builder UI tests

### i18n Foundation

- [X] T014 [P] Create packages/ui/src/locales/en.json with authentication strings
- [X] T015 [P] Create packages/ui/src/locales/index.ts with i18next configuration
- [X] T016 Add i18next and react-i18next dependencies to packages/ui/package.json

### Shared UI Components (shadcn primitives)

- [X] T017 [P] Create packages/ui/src/components/ui/button.tsx using Radix UI Button primitive
- [X] T018 [P] Create packages/ui/src/components/ui/input.tsx using Radix UI Input primitive
- [X] T019 [P] Create packages/ui/src/components/ui/label.tsx using Radix UI Label primitive
- [X] T020 [P] Create packages/ui/src/components/ui/form.tsx using react-hook-form integration
- [X] T021 [P] Create packages/ui/src/components/ui/card.tsx using Radix UI Card primitive
- [X] T022 [P] Create packages/ui/src/components/ui/checkbox.tsx using Radix UI Checkbox primitive

### Type Definitions

- [X] T023 [P] Copy specs/001-shadcn-auth-ui/contracts/component-props.ts to packages/ui/src/types/index.ts
- [X] T024 [P] Create packages/ui/src/types/better-auth.d.ts with better-auth client augmentations
- [X] T025 Create packages/ui/src/index.ts with type exports

### Build Configuration

- [X] T026 [P] Create packages/ui/tsup.config.ts for ESM/CJS dual exports
- [X] T027 [P] Configure packages/ui/package.json exports field with type definitions
- [X] T028 Add peer dependencies to packages/ui/package.json (react, react-dom, better-auth)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Developer Installs and Uses Credential Login Block (Priority: P1) 🎯 MVP

**Goal**: Deliver a working credential login block installable via shadcn CLI that integrates with better-auth 1.4 for email/username/phone authentication

**Independent Test**: Run `npx shadcn@latest add "URL"`, import component in test project, verify login form renders and authenticates with better-auth client

### Unit Tests for User Story 1 (TDD - Write First)

> **TDD Workflow**: Write these tests FIRST, ensure they FAIL, then implement

- [X] T029 [P] [US1] Unit test for CredentialLoginForm email authentication in packages/ui/tests/unit/credential-login-email.test.tsx
- [X] T030 [P] [US1] Unit test for CredentialLoginForm username authentication in packages/ui/tests/unit/credential-login-username.test.tsx
- [X] T031 [P] [US1] Unit test for CredentialLoginForm phone authentication in packages/ui/tests/unit/credential-login-phone.test.tsx
- [X] T032 [P] [US1] Unit test for form validation (email/username/phone formats) in packages/ui/tests/unit/validation.test.ts
- [X] T033 [P] [US1] Unit test for password validation rules in packages/ui/tests/unit/password-validation.test.ts
- [X] T034 [P] [US1] Unit test for error handling and display in packages/ui/tests/unit/error-handling.test.tsx

### Validation Layer for User Story 1

- [X] T035 [P] [US1] Create packages/ui/src/lib/validation/email-schema.ts with Zod email validation
- [X] T036 [P] [US1] Create packages/ui/src/lib/validation/username-schema.ts with Zod username validation
- [X] T037 [P] [US1] Create packages/ui/src/lib/validation/phone-schema.ts with Zod E.164 phone validation
- [X] T038 [P] [US1] Create packages/ui/src/lib/validation/password-schema.ts with configurable password rules
- [X] T039 [US1] Create packages/ui/src/lib/validation/index.ts exporting all validation schemas

### Core Component for User Story 1

- [X] T040 [US1] Create packages/ui/src/components/credential-login-form.tsx with react-hook-form integration (depends on T017-T022, T035-T039)
- [X] T041 [US1] Implement authMethod prop switching (email/username/phone) in packages/ui/src/components/credential-login-form.tsx
- [X] T042 [US1] Implement showRememberMe prop with checkbox in packages/ui/src/components/credential-login-form.tsx
- [X] T043 [US1] Implement showForgotPassword prop with link in packages/ui/src/components/credential-login-form.tsx
- [X] T044 [US1] Implement better-auth SDK integration (signIn.email/username/phone methods) in packages/ui/src/components/credential-login-form.tsx
- [X] T045 [US1] Implement error handling with localized messages in packages/ui/src/components/credential-login-form.tsx
- [X] T046 [US1] Implement loading states and form disable during submission in packages/ui/src/components/credential-login-form.tsx
- [X] T047 [US1] Implement onSuccess and onError callbacks in packages/ui/src/components/credential-login-form.tsx
- [X] T048 [US1] Implement twoFactorRedirect handling in packages/ui/src/components/credential-login-form.tsx

### Registry for User Story 1

- [X] T049 [US1] Create apps/web/src/registry/blocks/credential-login/page.tsx wrapper component (depends on T040-T048)
- [X] T050 [US1] Create apps/web/src/registry/blocks/credential-login/components/credential-login-form.tsx (copy from packages/ui)
- [X] T051 [US1] Create apps/web/src/registry/credential-login.json following shadcn schema with all dependencies listed
- [X] T052 [US1] Create apps/web/src/registry/index.json aggregating credential-login block

### Integration Tests for User Story 1

- [X] T053 [US1] Integration test for full authentication flow with mocked better-auth SDK in packages/ui/tests/integration/auth-flow.test.tsx (depends on T040-T048)
- [X] T054 [US1] Integration test for registry installation simulation in apps/web/tests/integration/registry-install.test.ts

### Accessibility for User Story 1

- [X] T055 [US1] Add ARIA labels and roles to credential-login-form.tsx for screen readers
- [X] T056 [US1] Implement keyboard navigation support (Tab, Enter, Escape) in credential-login-form.tsx
- [X] T057 [US1] Create packages/ui/tests/a11y/credential-login.test.tsx with axe-core automated checks

**Checkpoint**: User Story 1 complete - Credential login block is installable, functional, and tested independently

---

## Phase 4: User Story 2 - Developer Explores Options via Builder UI (Priority: P2)

**Goal**: Deliver an interactive builder UI where developers preview credential login options with live updates and see installation instructions for both methods

**Independent Test**: Visit `/builder`, toggle auth method options (email/username/phone, remember me, forgot password), verify live preview updates in real-time, check installation instructions accuracy

### Unit Tests for User Story 2 (TDD - Write First)

- [X] T058 [P] [US2] Unit test for BuilderConfiguration state management in apps/web/tests/unit/builder-state.test.ts
- [X] T059 [P] [US2] Unit test for builder option toggles in apps/web/tests/unit/builder-options.test.tsx
- [X] T060 [P] [US2] Unit test for live preview rendering in apps/web/tests/unit/builder-preview.test.tsx

### Builder UI Components for User Story 2

- [X] T061 [P] [US2] Create apps/web/src/routes/builder/$.tsx route with TanStack Start
- [X] T062 [P] [US2] Create apps/web/src/components/builder/auth-builder.tsx main container component
- [X] T063 [P] [US2] Create apps/web/src/components/builder/builder-options.tsx configuration sidebar with toggles
- [X] T064 [P] [US2] Create apps/web/src/components/builder/builder-preview.tsx live preview panel
- [X] T065 [US2] Create apps/web/src/components/builder/installation-tabs.tsx with shadcn CLI and npm methods (depends on T062-T064)
- [X] T066 [US2] Create apps/web/src/components/builder/code-preview.tsx with syntax highlighting via fumadocs-core

### Builder State Management for User Story 2

- [X] T067 [US2] Create apps/web/src/lib/builder-state.ts with BuilderConfiguration type and useState management (depends on T061-T066)
- [X] T068 [US2] Implement authMethod toggle (email/username/phone) with preview update in apps/web/src/components/builder/builder-options.tsx
- [X] T069 [US2] Implement showRememberMe toggle with preview update in apps/web/src/components/builder/builder-options.tsx
- [X] T070 [US2] Implement showForgotPassword toggle with preview update in apps/web/src/components/builder/builder-options.tsx
- [X] T071 [US2] Implement passwordValidation rules UI with preview update in apps/web/src/components/builder/builder-options.tsx

### Installation Instructions for User Story 2

- [X] T072 [US2] Generate shadcn CLI installation command with static registry URL in apps/web/src/components/builder/installation-tabs.tsx
- [X] T073 [US2] Display manual customization notes for shadcn method in apps/web/src/components/builder/installation-tabs.tsx
- [X] T074 [US2] Generate npm package installation command in apps/web/src/components/builder/installation-tabs.tsx
- [X] T075 [US2] Display prop-based configuration examples matching current builder state in apps/web/src/components/builder/installation-tabs.tsx

### Integration Tests for User Story 2

- [X] T076 [US2] Integration test for builder UI option toggling and preview updates in apps/web/tests/integration/builder-ui.test.tsx (depends on T061-T075)
- [X] T077 [US2] Integration test for installation instruction accuracy in apps/web/tests/integration/installation-instructions.test.ts

**Checkpoint**: User Story 2 complete - Builder UI is interactive, previews work, installation instructions are accurate

---

## Phase 5: User Story 3 - Developer Chooses Installation Method (Priority: P2)

**Goal**: Ensure both installation methods (shadcn CLI for source code, npm package for managed updates) work correctly and deliver equivalent functionality

**Independent Test**: Install credential login block via both methods in separate test projects, verify functionality is equivalent, test update workflows

### Unit Tests for User Story 3 (TDD - Write First)

- [X] T078 [P] [US3] Unit test for NPM package exports in packages/ui/tests/unit/package-exports.test.ts
- [X] T079 [P] [US3] Unit test for prop-based component configuration in packages/ui/tests/unit/component-props.test.tsx

### NPM Package Build for User Story 3

- [X] T080 [US3] Update packages/ui/src/index.ts to export CredentialLoginForm and all types (depends on T040-T048)
- [X] T081 [US3] Configure packages/ui/tsup.config.ts for tree-shaking and dual ESM/CJS output
- [X] T082 [US3] Generate packages/ui/dist/ with type declarations via tsup build
- [X] T083 [US3] Validate packages/ui/package.json exports field resolves correctly for import/require

### Package Publishing Setup for User Story 3

- [X] T084 [P] [US3] Create packages/ui/.npmignore excluding tests and source maps
- [X] T085 [P] [US3] Add npm publish configuration in packages/ui/package.json (publishConfig, files)
- [X] T086 [P] [US3] Create packages/ui/README.md with npm package usage examples
- [X] T087 [P] [US3] Create packages/ui/CHANGELOG.md for version tracking

### Installation Method Tests for User Story 3

- [X] T088 [US3] E2E test for shadcn CLI installation in test project using registry URL (depends on T051-T052)
- [X] T089 [US3] E2E test for npm package installation and import in test project (depends on T080-T083)
- [X] T090 [US3] E2E test verifying functional equivalence between both methods
- [X] T091 [US3] E2E test for npm package update workflow (pnpm update)

**Checkpoint**: User Story 3 complete - Both installation methods work, are tested, and deliver equivalent functionality

---

## Phase 6: User Story 4 - Developer Integrates Into Different Frameworks (Priority: P3)

**Goal**: Provide framework-specific documentation and integration examples for Next.js, React (Vite), and TanStack Start

**Independent Test**: Create sample projects in each framework (Next.js, Vite, TanStack Start), install credential login block, verify integration works following docs

### Documentation for User Story 4

- [X] T092 [P] [US4] Create apps/web/content/docs/installation/nextjs.mdx with Next.js App Router setup guide
- [X] T093 [P] [US4] Create apps/web/content/docs/installation/vite.mdx with React + Vite setup guide
- [X] T094 [P] [US4] Create apps/web/content/docs/installation/tanstack-start.mdx with TanStack Start setup guide
- [X] T095 [P] [US4] Create apps/web/content/docs/installation/index.mdx with framework comparison table
- [X] T096 [P] [US4] Create apps/web/content/docs/examples/nextjs-example.mdx with complete Next.js integration code
- [X] T097 [P] [US4] Create apps/web/content/docs/examples/vite-example.mdx with complete Vite integration code
- [X] T098 [P] [US4] Create apps/web/content/docs/examples/tanstack-example.mdx with complete TanStack Start integration code

### Framework-Specific Examples for User Story 4

- [X] T099 [P] [US4] Create apps/web/content/docs/guides/nextjs-middleware.mdx for route protection
- [X] T100 [P] [US4] Create apps/web/content/docs/guides/vite-router.mdx for React Router integration
- [X] T101 [P] [US4] Create apps/web/content/docs/guides/tanstack-route-guards.mdx for beforeLoad protection

### Integration Tests for User Story 4

- [X] T102 [US4] E2E test for Next.js integration following documentation (depends on T092, T096)
- [X] T103 [US4] E2E test for Vite integration following documentation (depends on T093, T097)
- [X] T104 [US4] E2E test for TanStack Start integration following documentation (depends on T094, T098)

**Checkpoint**: User Story 4 complete - Framework-specific docs are accurate, examples work in all three frameworks

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final documentation

### Documentation Website

- [X] T105 [P] Create apps/web/content/docs/index.mdx homepage with quick start links
- [X] T106 [P] Create apps/web/content/docs/getting-started.mdx with 5-minute quickstart
- [X] T107 [P] Create apps/web/content/docs/components/credential-login.mdx with full API reference
- [X] T108 [P] Create apps/web/content/docs/configuration/authentication.mdx with authMethod details
- [X] T109 [P] Create apps/web/content/docs/configuration/validation.mdx with passwordValidation options
- [X] T110 [P] Create apps/web/content/docs/troubleshooting.mdx with common issues and solutions

### Additional Documentation

- [X] T111 [P] Update root README.md with project overview and installation instructions
- [X] T112 [P] Create apps/web/content/docs/contributing.mdx with development setup guide
- [X] T113 [P] Create apps/web/content/docs/accessibility.mdx documenting WCAG 2.1 AA compliance
- [X] T114 [P] Create apps/web/content/docs/migration.mdx for future users upgrading from old ImBIOS UI

### Performance Optimization

- [X] T115 [P] Add web-vitals package to packages/ui for performance tracking
- [X] T116 [P] Implement code splitting in apps/web/vite.config.ts for builder UI
- [X] T117 Bundle size analysis for packages/ui ensuring < 10KB per component gzipped
- [X] T118 Lighthouse audit for apps/web documentation site targeting 90+ scores

### Security & Accessibility Hardening

- [X] T119 [P] Run axe-core accessibility audit on all components
- [X] T120 [P] Implement focus trap for modal states in credential-login-form.tsx
- [X] T121 Security audit for input sanitization in form components
- [X] T122 Add Content Security Policy headers to apps/web deployment config

### Validation & Testing

- [X] T123 Run all unit tests across packages/ui and apps/web with coverage report
- [X] T124 Run all integration tests verifying user story completion
- [X] T125 Run all E2E tests across frameworks (Next.js, Vite, TanStack Start)
- [X] T126 Validate registry JSON files against specs/001-shadcn-auth-ui/contracts/registry-item.schema.json
- [X] T127 Execute quickstart guide validation following specs/001-shadcn-auth-ui/quickstart.md

### Code Cleanup

- [X] T128 [P] Run Biome formatter on all TypeScript files
- [X] T129 [P] Fix all Biome linter errors and warnings
- [X] T130 Run TypeScript type checking with no errors across all packages
- [X] T131 Remove console.log statements and debug code
- [X] T132 Add JSDoc comments to all public API functions

**Checkpoint**: Project is polished, documented, tested, and ready for release

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 can start after Phase 2 (no dependencies on other stories)
  - US2 depends on US1 completion (needs credential-login component for preview)
  - US3 can start in parallel with US2 (independent package work)
  - US4 depends on US1 and US3 (needs both installation methods working)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

```
Phase 2: Foundational (BLOCKS EVERYTHING)
    ↓
    ├─→ Phase 3: US1 (P1) - Credential Login Block ✅ MVP
    │       ↓
    │       ├─→ Phase 4: US2 (P2) - Builder UI (needs US1 component)
    │       │
    │       ├─→ Phase 5: US3 (P2) - Installation Methods (can parallel with US2)
    │       │       ↓
    │       └───────┴─→ Phase 6: US4 (P3) - Framework Integration (needs US1 + US3)
    │
    └─→ Phase 7: Polish (needs all above)
```

### Within Each User Story

1. **Tests first** (TDD): Write unit tests, ensure they fail
2. **Models/Validation**: Create validation schemas and types
3. **Components**: Implement component logic
4. **Integration**: Connect to better-auth SDK
5. **Tests pass**: Run tests and verify implementation
6. **Story complete**: Checkpoint and validate story works independently

### Parallel Opportunities

**Phase 1 (Setup)**: T003, T004, T005, T006, T007, T008 can run in parallel

**Phase 2 (Foundational)**:

- T011, T012, T013 (testing) can parallel
- T014, T015 (i18n) can parallel with testing
- T017-T022 (UI components) can all run in parallel
- T023, T024 (types) can parallel with UI components
- T026, T027 (build) can parallel after types

**Phase 3 (US1)**:

- T029-T034 (all unit tests) can run in parallel
- T035-T038 (all validation schemas) can run in parallel
- T055, T056, T057 (accessibility) can run in parallel

**Phase 4 (US2)**:

- T058, T059, T060 (unit tests) can run in parallel
- T061, T062, T063, T064, T066 (builder components) can run in parallel

**Phase 5 (US3)**:

- T078, T079 (tests) can run in parallel
- T084, T085, T086, T087 (publishing setup) can run in parallel

**Phase 6 (US4)**:

- T092-T098 (all framework docs) can run in parallel
- T099-T101 (all framework guides) can run in parallel

**Phase 7 (Polish)**:

- T105-T114 (all documentation) can run in parallel
- T115, T116, T119, T120 (performance & a11y) can run in parallel
- T128, T129 (formatting & linting) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all unit tests for US1 together (TDD - write first):
Task: "Unit test for CredentialLoginForm email authentication"
Task: "Unit test for CredentialLoginForm username authentication"
Task: "Unit test for CredentialLoginForm phone authentication"
Task: "Unit test for form validation"
Task: "Unit test for password validation rules"
Task: "Unit test for error handling and display"

# Launch all validation schemas together:
Task: "Create email-schema.ts with Zod email validation"
Task: "Create username-schema.ts with Zod username validation"
Task: "Create phone-schema.ts with Zod E.164 phone validation"
Task: "Create password-schema.ts with configurable password rules"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T010)
2. Complete Phase 2: Foundational (T011-T028) - CRITICAL
3. Complete Phase 3: User Story 1 (T029-T057)
4. **STOP and VALIDATE**: Test US1 independently with real better-auth integration
5. Deploy documentation site with credential-login registry

**MVP Success Criteria**:

- [ ] Developer can run `npx shadcn add "URL"` and install credential-login block
- [ ] Block renders email/username/phone login form
- [ ] Block successfully authenticates with better-auth 1.4
- [ ] All US1 tests pass (unit, integration, accessibility)
- [ ] Installation completes in < 5 minutes
- [ ] Documentation site is live with registry URL

### Incremental Delivery

1. **Iteration 1 (MVP)**: Setup + Foundational + US1 → Test → Demo
2. **Iteration 2**: Add US2 (Builder UI) → Test → Demo
3. **Iteration 3**: Add US3 (NPM Package) → Test → Demo
4. **Iteration 4**: Add US4 (Multi-Framework) → Test → Demo
5. **Iteration 5**: Polish + Final Release

Each iteration adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. **Week 1**: Team completes Setup + Foundational together (T001-T028)
2. **Week 2-3**: Once Foundational done:
   - Developer A: US1 (T029-T057) - Credential Login Block
   - Developer B: Can't start US2 yet (depends on US1)
   - Developer C: Prepare documentation structure (Phase 7)
3. **Week 4**:
   - Developer A: US2 (T058-T077) - Builder UI
   - Developer B: US3 (T078-T091) - NPM Package (parallel with US2)
   - Developer C: Polish documentation
4. **Week 5**:
   - Developer A: US4 (T092-T104) - Framework Integration
   - Developer B: Performance optimization (Phase 7)
   - Developer C: Final testing and validation

---

## Task Summary

**Total Tasks**: 132

**By Phase**:

- Phase 1 (Setup): 10 tasks
- Phase 2 (Foundational): 18 tasks
- Phase 3 (US1 - MVP): 29 tasks
- Phase 4 (US2): 20 tasks
- Phase 5 (US3): 14 tasks
- Phase 6 (US4): 13 tasks
- Phase 7 (Polish): 28 tasks

**By User Story**:

- US1 (Credential Login Block): 29 tasks
- US2 (Builder UI): 20 tasks
- US3 (Installation Methods): 14 tasks
- US4 (Framework Integration): 13 tasks
- Infrastructure (Setup + Foundational): 28 tasks
- Polish (Cross-Cutting): 28 tasks

**Parallel Opportunities**: 48 tasks marked [P] can run in parallel within their phase

**MVP Scope** (Phases 1-3): 57 tasks total
**Full Feature** (All phases): 132 tasks total

---

## Format Validation ✅

All tasks follow the required checklist format:

- ✅ Checkbox: `- [ ]`
- ✅ Task ID: Sequential (T001-T132)
- ✅ [P] marker: Present on parallelizable tasks only
- ✅ [Story] label: Present on US1, US2, US3, US4 tasks only
- ✅ Description: Clear action with file path
- ✅ No tasks without file paths

**Independent Test Criteria**:

- ✅ Each user story has clear test validation
- ✅ US1: Install via CLI, verify authentication works
- ✅ US2: Use builder UI, toggle options, verify preview updates
- ✅ US3: Install via both methods, verify equivalence
- ✅ US4: Test in all three frameworks, verify docs accuracy

---

## Notes

- TDD workflow enforced: Tests written first, must fail before implementation
- Each user story independently completable and testable
- Foundational phase (T011-T028) blocks all user stories - must complete first
- US2 depends on US1 (needs component for preview)
- US4 depends on US1 and US3 (needs both installation methods)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Constitution requirements (TypeScript strict, accessibility, testing) embedded throughout
