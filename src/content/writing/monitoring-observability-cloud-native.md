---
title: Monitoring and Observability in Cloud-Native Applications
description: Learn the difference between monitoring and observability, and how to implement effective observability practices in cloud-native environments
date: 2024-11-18
tags:
  - monitoring
  - observability
  - cloud-native
  - devops
  - sre
created: 2025-12-16T14:10
updated: 2025-12-16T14:10
---

## Monitoring vs Observability

While often used interchangeably, monitoring and observability are distinct concepts:

### Monitoring

- **What**: Watching predefined metrics
- **When**: Tracks known failure modes
- **How**: Alerts based on thresholds

### Observability

- **What**: Understanding system behavior
- **When**: Explores unknown failure modes
- **How**: Questions data to find answers

**Key Insight**: Monitoring tells you _when_ something is wrong. Observability helps you understand _why_.

## The Three Pillars of Observability

### 1. Metrics

Numerical measurements over time intervals.

**Examples**:

- CPU usage
- Request rate
- Error rate
- Response time

**Tools**: Prometheus, Grafana, CloudWatch

### 2. Logs

Discrete events that happened in your system.

**Examples**:

- Application logs
- Access logs
- Error logs
- Audit logs

**Tools**: ELK Stack, Loki, CloudWatch Logs

### 3. Traces

Request paths through distributed systems.

**Examples**:

- Request flow through microservices
- Database query timing
- External API calls
- Service dependencies

**Tools**: Jaeger, Zipkin, OpenTelemetry

## Implementing Observability

### Setting Up Prometheus and Grafana

#### 1. Prometheus Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: "my-app"
    static_configs:
      - targets: ["localhost:3000"]

  - job_name: "kubernetes-pods"
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
```

#### 2. Application Instrumentation

**Node.js Example**:

```javascript
const express = require("express");
const prometheus = require("prom-client");

const app = express();

// Create a Registry
const register = new prometheus.Registry();

// Add default metrics
prometheus.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new prometheus.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

const httpRequestTotal = new prometheus.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

// Middleware to track requests
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;

    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);

    httpRequestTotal
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .inc();
  });

  next();
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(3000);
```

#### 3. Grafana Dashboard

```json
{
  "dashboard": {
    "title": "Application Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status_code=~\"5..\"}[5m])"
          }
        ]
      },
      {
        "title": "Response Time (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))"
          }
        ]
      }
    ]
  }
}
```

### Structured Logging

**Bad Logging**:

```javascript
console.log("User logged in");
console.log("Error: " + error);
```

**Good Logging**:

```javascript
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Structured log with context
logger.info("User logged in", {
  userId: user.id,
  email: user.email,
  timestamp: new Date().toISOString(),
  ip: req.ip,
});

// Error logging with stack trace
logger.error("Authentication failed", {
  error: error.message,
  stack: error.stack,
  userId: user.id,
  timestamp: new Date().toISOString(),
});
```

### Distributed Tracing with OpenTelemetry

```javascript
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const {
  ExpressInstrumentation,
} = require("@opentelemetry/instrumentation-express");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");

// Create a tracer provider
const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "my-service",
  }),
});

provider.register();

// Auto-instrument HTTP and Express
registerInstrumentations({
  instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
});

// Manual instrumentation
const tracer = provider.getTracer("my-app");

app.get("/api/users/:id", async (req, res) => {
  const span = tracer.startSpan("get-user");

  try {
    span.setAttribute("user.id", req.params.id);

    const user = await getUserFromDatabase(req.params.id);

    span.addEvent("user-fetched", {
      "user.name": user.name,
    });

    res.json(user);
  } catch (error) {
    span.recordException(error);
    span.setStatus({ code: 2, message: error.message });
    res.status(500).json({ error: error.message });
  } finally {
    span.end();
  }
});
```

## The Four Golden Signals

### 1. Latency

Time to serve a request.

```promql
# Average latency
avg(rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m]))

# P95 latency
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

### 2. Traffic

How much demand is placed on your system.

```promql
# Requests per second
rate(http_requests_total[5m])

# By endpoint
sum by (route) (rate(http_requests_total[5m]))
```

### 3. Errors

Rate of failed requests.

```promql
# Error rate
rate(http_requests_total{status_code=~"5.."}[5m])

# Error percentage
(
  sum(rate(http_requests_total{status_code=~"5.."}[5m]))
  /
  sum(rate(http_requests_total[5m]))
) * 100
```

### 4. Saturation

How "full" your service is.

```promql
# CPU usage
avg(rate(container_cpu_usage_seconds_total[5m])) * 100

# Memory usage
(container_memory_usage_bytes / container_spec_memory_limit_bytes) * 100

# Disk usage
(node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100
```

## Service Level Objectives (SLOs)

### Defining SLOs

```yaml
# Example SLO definition
service: api
slos:
  - name: availability
    target: 99.9%
    window: 30d

  - name: latency_p95
    target: 200ms
    percentile: 95
    window: 7d

  - name: error_rate
    target: 0.1%
    window: 30d
```

### Calculating Error Budget

```javascript
function calculateErrorBudget(slo, actualUptime, windowDays) {
  const totalMinutes = windowDays * 24 * 60;
  const allowedDowntime = totalMinutes * (1 - slo);
  const actualDowntime = totalMinutes * (1 - actualUptime);
  const remainingBudget = allowedDowntime - actualDowntime;

  return {
    totalBudget: allowedDowntime,
    consumed: actualDowntime,
    remaining: remainingBudget,
    percentage: (remainingBudget / allowedDowntime) * 100,
  };
}

// Example: 99.9% SLO over 30 days
const budget = calculateErrorBudget(0.999, 0.9995, 30);
console.log(budget);
// {
//   totalBudget: 43.2 minutes,
//   consumed: 21.6 minutes,
//   remaining: 21.6 minutes,
//   percentage: 50%
// }
```

## Alerting Best Practices

### 1. Alert on Symptoms, Not Causes

```yaml
# Bad: Alert on cause
- alert: HighCPU
  expr: cpu_usage > 80

# Good: Alert on symptom
- alert: HighLatency
  expr: http_request_duration_seconds{quantile="0.95"} > 1
```

### 2. Reduce Alert Fatigue

```yaml
# Use 'for' clause to avoid flapping
- alert: HighErrorRate
  expr: |
    (
      sum(rate(http_requests_total{status_code=~"5.."}[5m]))
      /
      sum(rate(http_requests_total[5m]))
    ) > 0.05
  for: 5m # Only alert if condition persists
  annotations:
    summary: "High error rate detected"
    description: "Error rate is {{ $value }}%"
```

### 3. Actionable Alerts

```yaml
- alert: DatabaseConnectionPoolExhausted
  expr: db_connection_pool_active >= db_connection_pool_max
  for: 2m
  annotations:
    summary: "Database connection pool exhausted"
    description: |
      Connection pool for {{ $labels.database }} is at capacity.

      Runbook: https://wiki.company.com/runbooks/db-pool-exhausted

      Steps to resolve:
      1. Check for long-running queries
      2. Review connection leak logs
      3. Consider scaling connection pool
```

## Observability as Code

### Terraform for Grafana Dashboards

```hcl
resource "grafana_dashboard" "metrics" {
  config_json = jsonencode({
    title = "Application Metrics"
    panels = [
      {
        title = "Request Rate"
        targets = [
          {
            expr = "rate(http_requests_total[5m])"
          }
        ]
      }
    ]
  })
}

resource "grafana_alert_rule" "high_error_rate" {
  name      = "High Error Rate"
  folder_id = grafana_folder.alerts.id

  condition = "B"

  data {
    ref_id = "A"
    query_type = "promql"
    expr = "rate(http_requests_total{status=~\"5..\"}[5m])"
  }

  data {
    ref_id = "B"
    reducer = "last"
    expression = "A > 0.05"
  }
}
```

## Kubernetes Observability

### Pod Metrics

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "8080"
    prometheus.io/path: "/metrics"
spec:
  containers:
    - name: app
      image: my-app:latest
      ports:
        - containerPort: 8080
      resources:
        requests:
          memory: "128Mi"
          cpu: "100m"
        limits:
          memory: "256Mi"
          cpu: "200m"
      livenessProbe:
        httpGet:
          path: /health
          port: 8080
        initialDelaySeconds: 30
        periodSeconds: 10
      readinessProbe:
        httpGet:
          path: /ready
          port: 8080
        initialDelaySeconds: 5
        periodSeconds: 5
```

### Service Monitor

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  endpoints:
    - port: metrics
      interval: 30s
      path: /metrics
```

## Conclusion

Effective observability is crucial for maintaining reliable cloud-native applications. Key takeaways:

1. **Implement all three pillars**: Metrics, logs, and traces
2. **Focus on the Four Golden Signals**: Latency, traffic, errors, saturation
3. **Define meaningful SLOs**: Base alerts on user-facing metrics
4. **Make alerts actionable**: Include runbooks and context
5. **Use structured logging**: Makes debugging easier
6. **Automate everything**: Treat observability as code

Start by instrumenting your most critical services, then expand coverage as you learn what matters most for your system.

## Resources

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Prometheus Best Practices](https://prometheus.io/docs/practices/)
- [Google SRE Books](https://sre.google/books/)
- [The Observability Engineering Book](https://www.oreilly.com/library/view/observability-engineering/9781492076438/)
