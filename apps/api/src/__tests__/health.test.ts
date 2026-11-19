import { describe, it, expect, vi, beforeEach } from 'vitest';
import fastify from 'fastify';

const mockQuery = vi.fn();
const mockSend = vi.fn();

vi.mock('../db', () => ({
  pool: {
    query: (...args: unknown[]) => mockQuery(...args),
  },
}));

vi.mock('../aws', () => ({
  s3Client: {
    send: (...args: unknown[]) => mockSend(...args),
  },
  S3_BUCKET_IMAGENS: 'smartcity-ocorrencias-imagens',
}));

import { healthRoutes } from '../routes/health';

describe('Health & Readiness routes', () => {
  beforeEach(() => {
    mockQuery.mockReset();
    mockSend.mockReset();
  });

  it('GET /health retorna status healthy', async () => {
    const app = fastify();
    await app.register(healthRoutes);

    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.status).toBe('healthy');
    expect(typeof body.timestamp).toBe('string');

    await app.close();
  });

  it('GET /ready retorna 200 quando PostgreSQL e S3 respondem', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ '?column?': 1 }] });
    mockSend.mockResolvedValueOnce({});

    const app = fastify();
    await app.register(healthRoutes);

    const res = await app.inject({ method: 'GET', url: '/ready' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({
      status: 'ready',
      checks: { database: 'UP', storage_s3: 'UP' },
    });

    await app.close();
  });

  it('GET /ready retorna 503 quando alguma dependência falha', async () => {
    mockQuery.mockRejectedValueOnce(new Error('Connection refused'));

    const app = fastify();
    await app.register(healthRoutes);

    const res = await app.inject({ method: 'GET', url: '/ready' });
    expect(res.statusCode).toBe(503);
    expect(res.json()).toMatchObject({
      status: 'not_ready',
      error: 'Connection refused',
    });

    await app.close();
  });
});
