---
title: Understanding Docker Multi-Stage Builds
description: "Learn how to optimize Docker images using multi-stage builds to reduce image size and improve security"
date: "2024-06-10"
tags:
  - docker
  - devops
  - containers
---

## What Are Multi-Stage Builds?

Multi-stage builds allow you to use multiple `FROM` statements in your Dockerfile. Each `FROM` instruction begins a new stage of the build, and you can selectively copy artifacts from one stage to another.

## The Problem: Large Docker Images

Traditional Dockerfiles often result in bloated images because they include:

- Build tools and dependencies
- Source code
- Intermediate build artifacts
- Development dependencies

### Example of a Traditional Dockerfile

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "dist/index.js"]
```

**Problem**: This image includes `node_modules` with development dependencies, source files, and build tools.

## The Solution: Multi-Stage Builds

Multi-stage builds separate the build environment from the runtime environment.

### Basic Multi-Stage Dockerfile

```dockerfile
# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
CMD ["node", "dist/index.js"]
```

### Key Benefits

1. **Smaller Image Size**: Only production dependencies and compiled code
2. **Better Security**: Fewer attack surfaces, no build tools in production
3. **Faster Deployment**: Smaller images transfer faster

## Real-World Example: Go Application

```dockerfile
# Build stage
FROM golang:1.21 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Production stage
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
CMD ["./main"]
```

**Result**: Image size reduced from ~800MB to ~15MB!

## Advanced Pattern: Using Build Arguments

```dockerfile
ARG NODE_VERSION=18
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:${NODE_VERSION}-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

## Multiple Build Stages

You can have more than two stages for complex builds:

```dockerfile
# Stage 1: Install dependencies
FROM node:18 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build application
FROM node:18 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Run tests
FROM node:18 AS tester
WORKDIR /app
COPY --from=builder /app .
RUN npm test

# Stage 4: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

## Best Practices

### 1. Use Specific Base Images

```dockerfile
# Instead of
FROM node:18

# Use
FROM node:18.17.0-alpine
```

### 2. Order Layers by Change Frequency

```dockerfile
# Dependencies change less frequently
COPY package*.json ./
RUN npm install

# Source code changes more frequently
COPY . .
```

### 3. Leverage Build Cache

```dockerfile
# Good: Separate dependency installation
COPY package*.json ./
RUN npm install
COPY . .

# Bad: Install dependencies with source
COPY . .
RUN npm install
```

### 4. Use .dockerignore

```
node_modules
npm-debug.log
.git
.env
*.md
tests/
```

## Comparing Image Sizes

Let's compare a real application:

| Approach | Image Size | Build Time |
|----------|-----------|------------|
| Single-stage | 1.2 GB | 3m 15s |
| Multi-stage | 180 MB | 3m 30s |
| Multi-stage + Alpine | 95 MB | 3m 45s |

## When to Use Multi-Stage Builds

**Perfect for:**
- Compiled languages (Go, Rust, Java)
- Frontend applications (React, Vue, Angular)
- Applications with build steps
- Production deployments

**May not need for:**
- Simple scripts
- Development environments
- Prototypes

## Common Pitfalls

### 1. Not Cleaning Package Manager Cache

```dockerfile
# Bad
RUN npm install

# Good
RUN npm ci && npm cache clean --force
```

### 2. Copying Unnecessary Files

```dockerfile
# Bad
COPY . .

# Good
COPY package*.json ./
COPY src/ ./src/
```

### 3. Using Wrong Base Image

```dockerfile
# Heavy (~900MB)
FROM node:18

# Light (~180MB)
FROM node:18-alpine
```

## Conclusion

Multi-stage builds are essential for creating optimized Docker images. They reduce image size, improve security, and maintain clean separation between build and runtime environments.

Start using multi-stage builds in your next Docker project to see immediate benefits in deployment speed and resource usage.

## Further Reading

- [Docker Multi-Stage Builds Documentation](https://docs.docker.com/build/building/multi-stage/)
- [Best practices for writing Dockerfiles](https://docs.docker.com/develop/dev-best-practices/)
