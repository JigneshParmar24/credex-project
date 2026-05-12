import { describe, it, expect } from 'vitest'
import evaluateAudit from '../services/auditEngine.service.js'

describe('Audit Engine', () => {

  it('detects seat waste on Claude Team plan', () => {

    const tools = [
      {
        toolId: 'claude',
        planId: 'team',
        seats: 2,
        monthlySpend: 100
      }
    ]

    const classification = {
      useCase: 'writing',
      requiredLevel: 2
    }

    const result = evaluateAudit(tools, classification)

    expect(result.totalMonthlySavings).toBeGreaterThan(0)
    expect(result.results[0].status).toBe('overspending')

  })

  it('detects downgrade opportunity', () => {

    const tools = [
      {
        toolId: 'chatgpt',
        planId: 'team',
        seats: 1,
        monthlySpend: 30
      }
    ]

    const classification = {
      useCase: 'research',
      requiredLevel: 1
    }

    const result = evaluateAudit(tools, classification)

    expect(result.totalMonthlySavings).toBeGreaterThan(0)

  })

  it('returns optimized result when spend is reasonable', () => {

    const tools = [
      {
        toolId: 'cursor',
        planId: 'pro',
        seats: 1,
        monthlySpend: 20
      }
    ]

    const classification = {
      useCase: 'coding',
      requiredLevel: 2
    }

    const result = evaluateAudit(tools, classification)

    expect(result.results[0].status).toBe('optimal')

  })

  it('calculates annual savings correctly', () => {

    const tools = [
      {
        toolId: 'chatgpt',
        planId: 'team',
        seats: 1,
        monthlySpend: 30
      }
    ]

    const classification = {
      useCase: 'research',
      requiredLevel: 1
    }

    const result = evaluateAudit(tools, classification)

    expect(result.totalAnnualSavings)
      .toBe(result.totalMonthlySavings * 12)

  })

  it('flags wrong tool for coding workflows', () => {

    const tools = [
      {
        toolId: 'claude',
        planId: 'max',
        seats: 1,
        monthlySpend: 100
      }
    ]

    const classification = {
      useCase: 'coding',
      requiredLevel: 2
    }

    const result = evaluateAudit(tools, classification)

    expect(result.totalMonthlySavings).toBeGreaterThan(0)

  })

})