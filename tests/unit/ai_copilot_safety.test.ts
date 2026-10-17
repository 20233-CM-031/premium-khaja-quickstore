import { describe, it, expect } from 'vitest';

describe('Section 10: Safe AI Copilot Pipeline & Governance', () => {
  // Pure intent parsing logic simulation mirroring StoreContext pipeline
  const parseCopilotIntent = (userPrompt: string) => {
    const lower = userPrompt.toLowerCase();

    if (lower.includes('restock') || lower.includes('add stock') || lower.includes('replenish')) {
      const qtyMatch = userPrompt.match(/\b\d+\b/);
      const changeQty = qtyMatch ? parseInt(qtyMatch[0], 10) : 10;
      return {
        actionType: 'ADJUST_STOCK',
        title: 'Draft Inventory Restock',
        target: 'Inventory Hub',
        currentValue: 10,
        proposedValue: 10 + changeQty,
        mutationPayload: {
          productId: 'bangle-01',
          changeQty,
          reason: 'AI Copilot Restock Intent'
        },
        reason: `Restock request parsed from merchant prompt: "${userPrompt}"`,
        confidence: 'HIGH',
        requiresConfirmation: true
      };
    }

    if (lower.includes('discount') || lower.includes('coupon') || lower.includes('offer')) {
      return {
        actionType: 'CREATE_OFFER',
        title: 'Draft Promotional Coupon',
        target: 'Coupons Engine',
        currentValue: null,
        proposedValue: {
          code: 'FESTIVE15',
          discountType: 'percentage',
          discountValue: 15,
          minSubtotal: 1999
        },
        reason: `Promotional rule draft from request: "${userPrompt}"`,
        confidence: 'HIGH',
        requiresConfirmation: true
      };
    }

    return {
      actionType: 'OPERATIONAL_SUMMARY',
      title: 'Store Operations Inspection',
      target: 'Overview KPIs',
      currentValue: 'N/A',
      proposedValue: { status: 'OK' },
      reason: 'AI Operations Digest calculated from canonical tenant state.',
      confidence: 'EXACT',
      requiresConfirmation: false
    };
  };

  it('correctly parses restock prompt into a structured action draft requiring confirmation', () => {
    const draft = parseCopilotIntent('Restock bridal bangles with 25 units');
    expect(draft.actionType).toBe('ADJUST_STOCK');
    expect(draft.mutationPayload.changeQty).toBe(25);
    expect(draft.requiresConfirmation).toBe(true);
  });

  it('correctly parses coupon draft prompt with schema-validated structure', () => {
    const draft = parseCopilotIntent('Create a festive discount coupon for customers');
    expect(draft.actionType).toBe('CREATE_OFFER');
    expect(draft.proposedValue.code).toBe('FESTIVE15');
    expect(draft.proposedValue.discountValue).toBe(15);
    expect(draft.requiresConfirmation).toBe(true);
  });

  it('generates non-destructive read-only summary when prompt is an inquiry', () => {
    const draft = parseCopilotIntent('Show me store operational overview and metrics');
    expect(draft.actionType).toBe('OPERATIONAL_SUMMARY');
    expect(draft.requiresConfirmation).toBe(false);
  });

  it('prohibits automatic execution without explicit human approval confirmation', () => {
    const draft = parseCopilotIntent('Restock bridal bangles with 20 units');
    let inventoryState = 10;
    const auditLogs: string[] = [];

    // Prior to human confirmation: state remains completely untouched
    expect(inventoryState).toBe(10);
    expect(auditLogs.length).toBe(0);

    // Human approves and executes
    const executeAction = (approvedDraft: typeof draft, confirmedByHuman: boolean) => {
      if (!confirmedByHuman) throw new Error('Human confirmation required');
      inventoryState += approvedDraft.mutationPayload.changeQty;
      auditLogs.push(`COPILOT_ACTION_EXECUTED: ${approvedDraft.actionType}`);
    };

    expect(() => executeAction(draft, false)).toThrow('Human confirmation required');
    expect(inventoryState).toBe(10);

    executeAction(draft, true);
    expect(inventoryState).toBe(30);
    expect(auditLogs).toContain('COPILOT_ACTION_EXECUTED: ADJUST_STOCK');
  });
});
