/**
 * Design System - Consistent aesthetic values for the Ci Moment application
 */

// Color Palette
export const colors = {
  // Backgrounds
  background: "#0a0a0a",
  
  // Text colors
  textPrimary: "#d4d4d4",
  textSecondary: "#b0b0b0",
  textTertiary: "#888",
  textQuaternary: "#555",
  textQuinary: "#444",
  textMuted: "#333",
  
  // Border colors
  borderPrimary: "#444",
  borderSecondary: "#2a2a2a",
  borderTertiary: "#1a1a1a",
  
  // Interactive states
  hoverBorderPrimary: "#888",
  hoverBorderSecondary: "#555",
  hoverBorderTertiary: "#333",
  hoverTextPrimary: "#e8e8e8",
  hoverTextSecondary: "#d4d4d4",
  
  // Status colors
  statusProceed: "#c8d8c0",
  statusHold: "#d8d0b8",
  statusNotNow: "#b8b8b8",
  
  // Manifest animation colors
  manifestDark: "#222",
  manifestMid: "#444",
  manifestLight: "#888",
  manifestBright: "#d4d4d4",

  // Holographic gradient colors
  holographicPink: "#ff6ec7",
  holographicBlue: "#7ec8ff",
  holographicYellow: "#ffe47e",
  holographicPurple: "#c77eff",
  holographicCyan: "#7efff5",

  // Accent — used for FOMO timer urgency at <10 s
  accent: "#e85d3d",
};

// Typography
export const typography = {
  // Font families
  fontMonospace: "'JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
  
  // Font sizes
  fontXLarge: "clamp(1.6rem, 5vw, 2.8rem)",
  fontLarge: "clamp(1.4rem, 4vw, 2.2rem)",
  fontMedium: "clamp(1.2rem, 3vw, 1.8rem)",
  fontBase: "0.85rem",
  fontSmall: "0.75rem",
  fontXSmall: "0.7rem",
  fontXXSmall: "0.65rem",
  fontXXXSmall: "0.6rem",
  fontTiny: "0.55rem",
  fontMicro: "0.5rem",
  
  // Font weights
  fontWeightLight: 200,
  fontWeightNormal: 300,
  
  // Letter spacing
  letterSpacingXXWide: "0.4em",
  letterSpacingXWide: "0.3em",
  letterSpacingMedium: "0.2em",
  letterSpacingBase: "0.15em",
  letterSpacingSmall: "0.1em",
  letterSpacingXSmall: "0.05em",
};

// Spacing
export const spacing = {
  // Gaps
  gapXLarge: "3rem",
  gapLarge: "2rem",
  gapMedium: "1.5rem",
  gapBase: "1rem",
  gapSmall: "0.8rem",
  gapXSmall: "0.5rem",
  gapXXSmall: "0.4rem",
  gapXXXSmall: "0.2rem",
  
  // Padding
  paddingLarge: "1rem 1.5rem",
  paddingMedium: "0.8rem 1.5rem",
  paddingSmall: "0.6rem 1.2rem",
};

// Transitions
export const transitions = {
  fast: "0.3s ease",
  medium: "0.5s ease",
  slow: "0.8s ease",
  verySlow: "1s ease",
};

// Layout
export const layout = {
  minTouchTarget: "44px",
  buttonContainerMaxWidth: "280px",
};

// Animation timings
export const animations = {
  fadeInDelay: 50,
  sealButtonDelay: 2000,
  cancelledMessageDuration: 5000,
  holographicShiftDuration: "3s",
  windowExpiryWarning: 10000, // 10s before minute ends
  windowExpiryVibrateDuration: 500,
};

// Visual effects
export const effects = {
  // Paper texture using CSS mask (subtle dot pattern for micro-perforation)
  paperTextureMask: "radial-gradient(circle at 1px 1px, transparent 0.5px, black 1px)",
  paperTextureMaskSize: "4px 4px",

  // Holographic gradient animation (iridescent shift)
  holographicGradient: (colors: typeof import('./design-system').colors) =>
    `linear-gradient(135deg, ${colors.holographicPink}, ${colors.holographicBlue}, ${colors.holographicYellow}, ${colors.holographicPurple}, ${colors.holographicCyan}, ${colors.holographicPink})`,

  // Paper box shadow (subtle depth)
  paperShadow: "0 4px 12px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.5)",

  // Wallet card dimensions (Apple Wallet proportions: 85.6mm x 53.98mm ≈ 1.586:1)
  walletCardAspectRatio: "1.586",
  walletCardMaxWidth: "400px",
};
