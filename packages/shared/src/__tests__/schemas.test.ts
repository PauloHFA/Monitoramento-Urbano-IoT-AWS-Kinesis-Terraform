import { describe, it, expect } from 'vitest';
import { CriarOcorrenciaSchema, TelemetriaEventoSchema } from '../schemas';

describe('Schemas Zod compartilhados', () => {
  it('valida evento de telemetria canônico', () => {
    const res = TelemetriaEventoSchema.safeParse({
      schemaVersion: 1,
      eventId: 'polu-0001-1700000000000',
      sensorId: 'polu-0001',
      tipo: 'poluicao',
      zona: 'zona-centro',
      ocorridoEm: '2026-10-26T12:00:00Z',
      medidas: { pm25: 22.5, pm10: 34.0 },
      bateria: 95,
    });

    expect(res.success).toBe(true);
  });

  it('rejeita evento de telemetria com tipo desconhecido ou bateria fora de faixa', () => {
    const res = TelemetriaEventoSchema.safeParse({
      schemaVersion: 1,
      eventId: 'evt-1',
      sensorId: 's-1',
      tipo: 'energia',
      zona: 'zona-sul',
      ocorridoEm: '2026-10-26T12:00:00Z',
      medidas: { v: 10 },
      bateria: 150,
    });

    expect(res.success).toBe(false);
  });

  it('valida criação de ocorrência cidadã', () => {
    const res = CriarOcorrenciaSchema.safeParse({
      usuarioId: 'usr-1',
      tipo: 'alagamento',
      descricao: 'Acúmulo de água na via principal',
      latitude: -23.5505,
      longitude: -46.6333,
    });

    expect(res.success).toBe(true);
  });
});
