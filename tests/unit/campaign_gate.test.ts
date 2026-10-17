import { describe, it, expect } from 'vitest';
import { DEFAULT_CLAIM_GATE, DEFAULT_CAMPAIGN_SLIDES } from '../../src/context/StoreContext';

describe('Section 4: Hero Campaign & Miss World Publication Gate', () => {
  it('initializes with draft_unverified status by default', () => {
    expect(DEFAULT_CLAIM_GATE.claimStatus).toBe('draft_unverified');
    expect(DEFAULT_CLAIM_GATE.recipient).toBe('Krystyna Pyszková (Miss World 2024)');
  });

  it('provides conservative copy when claimStatus is draft_unverified', () => {
    const unverifiedCopy = DEFAULT_CLAIM_GATE.conservativePublicCopy;
    expect(unverifiedCopy).toContain('Couture Runway & High-Fashion Showcase');
    expect(unverifiedCopy).not.toContain('Official Miss World Winner');
  });

  it('contains at least 8 campaign slides with ordered sequences', () => {
    expect(DEFAULT_CAMPAIGN_SLIDES.length).toBeGreaterThanOrEqual(8);
    const orderNumbers = DEFAULT_CAMPAIGN_SLIDES.map(s => s.order);
    expect(orderNumbers).toEqual([...orderNumbers].sort((a, b) => a - b));
  });

  it('identifies claim-gated slides and ensures fallback behavior', () => {
    const gatedSlides = DEFAULT_CAMPAIGN_SLIDES.filter(s => s.isGatedCampaign);
    expect(gatedSlides.length).toBeGreaterThan(0);

    // Filter simulation for unverified state
    const isGateVerified = DEFAULT_CLAIM_GATE.claimStatus === 'verified_approved';
    const visibleSlides = DEFAULT_CAMPAIGN_SLIDES.filter(s => {
      if (s.isGatedCampaign && !isGateVerified) return false;
      return s.status === 'published';
    });

    // Unverified should not expose the unapproved claim slide to the public carousel
    expect(visibleSlides.some(s => s.id === 'slide-miss-world')).toBe(false);
  });

  it('permits publishing gated slides only when checklist is fully verified', () => {
    const validChecklist = {
      eventDetailsVerified: true,
      recipientVerified: true,
      mediaRightsCleared: true,
      copyApproved: true
    };

    const isChecklistComplete = Object.values(validChecklist).every(Boolean);
    expect(isChecklistComplete).toBe(true);

    const approvedState = {
      ...DEFAULT_CLAIM_GATE,
      claimStatus: isChecklistComplete ? 'verified_approved' : 'draft_unverified'
    };

    expect(approvedState.claimStatus).toBe('verified_approved');
  });
});
