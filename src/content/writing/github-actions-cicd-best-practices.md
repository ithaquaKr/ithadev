---
title: CI/CD Best Practices with GitHub Actions
description: "Master GitHub Actions for continuous integration and deployment with practical examples and best practices"
date: "2024-10-05"
tags:
  - cicd
  - github-actions
  - devops
  - automation
---

## Introduction to GitHub Actions

GitHub Actions is a powerful CI/CD platform that automates software workflows directly within your GitHub repository. It enables you to build, test, and deploy your code automatically.

## Core Concepts

### Workflows

A workflow is an automated process defined in a YAML file in `.github/workflows/`.

### Events

Events trigger workflows, such as:

- Push to a branch
- Pull request creation
- Issue comments
- Scheduled times (cron)
- Manual triggers

### Jobs

Jobs are sets of steps that execute on the same runner.

### Actions

Actions are reusable units of code that perform specific tasks.

## Basic Workflow Structure

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
```

## Best Practice #1: Matrix Builds

Test across multiple versions and platforms:

```yaml
name: Matrix Build

on: [push, pull_request]

jobs:
  test:
    runs-on: ${{ matrix.os }}

    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [16, 18, 20]

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - run: npm ci
      - run: npm test
```

## Best Practice #2: Caching Dependencies

Speed up workflows by caching dependencies:

```yaml
name: Build with Cache

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Cache node modules
        uses: actions/cache@v3
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - run: npm ci
      - run: npm run build
```

## Best Practice #3: Conditional Execution

Run jobs only when necessary:

```yaml
name: Conditional Workflow

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test

  deploy:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - name: Deploy to production
        run: |
          echo "Deploying to production"
          # Deployment commands here
```

## Best Practice #4: Environment Secrets

Securely manage sensitive data:

```yaml
name: Deploy with Secrets

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    environment: production

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy to S3
        run: |
          aws s3 sync ./build s3://${{ secrets.S3_BUCKET }}
```

### Setting Up Secrets

1. Go to repository Settings
2. Navigate to Secrets and variables → Actions
3. Click "New repository secret"
4. Add your secret name and value

## Best Practice #5: Reusable Workflows

Create reusable workflows for common tasks:

### .github/workflows/reusable-test.yml

```yaml
name: Reusable Test Workflow

on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js ${{ inputs.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}

      - run: npm ci
      - run: npm test
```

### Using the Reusable Workflow

```yaml
name: Main Workflow

on: [push, pull_request]

jobs:
  test:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: "18"
```

## Best Practice #6: Docker Build and Push

Automate Docker image builds:

```yaml
name: Docker Build and Push

on:
  push:
    branches: [main]
    tags: ["v*"]

jobs:
  docker:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: myuser/myapp

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=registry,ref=myuser/myapp:buildcache
          cache-to: type=registry,ref=myuser/myapp:buildcache,mode=max
```

## Best Practice #7: Parallel Jobs

Run independent jobs in parallel:

```yaml
name: Parallel Pipeline

on: [push]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm audit

  build:
    needs: [lint, test, security-scan]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
```

## Best Practice #8: Automated Versioning

Automatically create releases and tags:

```yaml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Semantic Release
        uses: cycjimmy/semantic-release-action@v4
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Best Practice #9: Status Checks

Add status badges to README:

```markdown
![CI](https://github.com/username/repo/workflows/CI/badge.svg)
![Deploy](https://github.com/username/repo/workflows/Deploy/badge.svg)
```

## Best Practice #10: Workflow Monitoring

Set up notifications for failures:

```yaml
name: CI with Notifications

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test

      - name: Notify on failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: "CI Pipeline Failed!"
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Complete Example: Full CI/CD Pipeline

```yaml
name: Full CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: "18"

jobs:
  quality-checks:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Security audit
        run: npm audit --audit-level=moderate

  test:
    runs-on: ubuntu-latest
    needs: quality-checks

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  build:
    runs-on: ubuntu-latest
    needs: test

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: dist/

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'

    environment: production

    steps:
      - uses: actions/checkout@v4

      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts
          path: dist/

      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # Your deployment script here
```

## Common Pitfalls to Avoid

### 1. Not Using Secrets for Sensitive Data

```yaml
# Bad
env:
  API_KEY: "my-secret-key"

# Good
env:
  API_KEY: ${{ secrets.API_KEY }}
```

### 2. Running Everything on Every Push

Use path filters and conditions:

```yaml
on:
  push:
    paths:
      - "src/**"
      - "package.json"
```

### 3. Not Caching Dependencies

Always cache to speed up builds.

### 4. Hardcoding Values

Use environment variables and inputs.

## Conclusion

GitHub Actions provides a powerful, flexible CI/CD platform. By following these best practices, you can:

- Speed up your workflows with caching and parallelization
- Secure your deployments with proper secret management
- Create maintainable pipelines with reusable workflows
- Automate your entire software delivery process

Start implementing these patterns in your projects today for more efficient and reliable CI/CD pipelines.

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Awesome Actions](https://github.com/sdras/awesome-actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
