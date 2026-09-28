/**
 * WCAG 2.1 Contrast Ratio Verification Test Suite for DevTrack Phase 5
 * Evaluates luminance contrast ratios according to W3C specifications.
 */

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function getChannelLuminance(c: number): number {
  const sRGB = c / 255;
  return sRGB <= 0.04045
    ? sRGB / 12.92
    : Math.pow((sRGB + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (
    0.2126 * getChannelLuminance(r) +
    0.7152 * getChannelLuminance(g) +
    0.0722 * getChannelLuminance(b)
  );
}

export function calculateContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

export interface ContrastTestResult {
  pair: string;
  fg: string;
  bg: string;
  ratio: number;
  minRequired: number;
  passed: boolean;
}

export function runContrastSuite(): { results: ContrastTestResult[]; allPassed: boolean } {
  const pairs: Array<{ name: string; fg: string; bg: string; min: number }> = [
    // Text Pairs (Must be >= 4.5:1 for WCAG AA)
    { name: 'Primary Text on White Card', fg: '#14181C', bg: '#FFFFFF', min: 4.5 },
    { name: 'Primary Text on Page Background', fg: '#14181C', bg: '#F5F6F7', min: 4.5 },
    { name: 'Secondary Text on White Card', fg: '#2F363D', bg: '#FFFFFF', min: 4.5 },
    { name: 'Secondary Text on Page Background', fg: '#2F363D', bg: '#F5F6F7', min: 4.5 },
    { name: 'Muted Text on White Card', fg: '#4A535C', bg: '#FFFFFF', min: 4.5 },
    { name: 'Subtle Text on White Card', fg: '#4A535C', bg: '#FFFFFF', min: 4.5 },
    { name: 'Success Text on Success Tint', fg: '#17573F', bg: '#E3F1EA', min: 4.5 },
    { name: 'Warning Text on Warning Tint', fg: '#6F4708', bg: '#F8EBD5', min: 4.5 },
    { name: 'Danger Text on Danger Tint', fg: '#8F2F2B', bg: '#F8E3E2', min: 4.5 },
    { name: 'Info Text on Info Tint', fg: '#1F5570', bg: '#E1EEF3', min: 4.5 },
    { name: 'White Text on Primary Accent', fg: '#FFFFFF', bg: '#2B333B', min: 4.5 },

    // Border & Focus Pairs (Must be >= 3.0:1)
    { name: 'Default Border on White Card', fg: '#6E7781', bg: '#FFFFFF', min: 3.0 },
    { name: 'Default Border on Page Background', fg: '#6E7781', bg: '#F5F6F7', min: 3.0 },
    { name: 'Strong Border on White Card', fg: '#57606A', bg: '#FFFFFF', min: 3.0 },
    { name: 'Focus Ring on White Card', fg: '#14181C', bg: '#FFFFFF', min: 3.0 },
    { name: 'Focus Ring on Page Background', fg: '#14181C', bg: '#F5F6F7', min: 3.0 },
  ];

  const results: ContrastTestResult[] = pairs.map((p) => {
    const ratio = calculateContrastRatio(p.fg, p.bg);
    return {
      pair: p.name,
      fg: p.fg,
      bg: p.bg,
      ratio: Math.round(ratio * 100) / 100,
      minRequired: p.min,
      passed: ratio >= p.min,
    };
  });

  const allPassed = results.every((r) => r.passed);
  return { results, allPassed };
}

// Self-executing runner when executed via Node/tsx
if (require.main === module) {
  const { results, allPassed } = runContrastSuite();
  console.log('--- DevTrack Phase 5 WCAG Contrast Audit ---');
  results.forEach((r) => {
    console.log(
      `[${r.passed ? 'PASS' : 'FAIL'}] ${r.pair}: ${r.ratio}:1 (Required: ${r.minRequired}:1)`
    );
  });
  if (!allPassed) {
    console.error('FAILED: One or more contrast ratios did not meet WCAG guidelines.');
    process.exit(1);
  } else {
    console.log('SUCCESS: All Phase 5 contrast pairs passed WCAG AA rules!');
  }
}
