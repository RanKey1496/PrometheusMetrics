import * as express from 'express';
const Prometheus = require('prom-client');
const responseTime = require('response-time');
const app = express();

const httpRequestDurationMicroseconds = new Prometheus.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['route'],
    // buckets for response time from 0.1ms to 500ms
    buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
});

const PrometheusMetrics = {
    requestCounter: new Prometheus.Counter('throughput', 'The number of request served')
};

app.use(responseTime((req: any, res: any, time: any) => {
    if (req.url != '/metrics') {
        httpRequestDurationMicroseconds
        .labels(req.route.path)
        .observe(time);
    }
}));

app.use((req, res, next) => {
    Prometheus.collectDefaultMetrics();
    if (req.url != '/metrics') {
        PrometheusMetrics.requestCounter.inc();
    }
    next();
});

app.get('/jimbo', (req, res, next) => {
    setTimeout(() => {
        return res.json({ sopa: 'du macaco' });
    }, 2000);
});

app.get('/metrics', (req, res, next) => {
    res.set('Content-Type', Prometheus.register.contentType);
    return res.end(Prometheus.register.metrics());
});

export default app;