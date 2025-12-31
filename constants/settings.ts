export const themeLabels = {
  light: "Light",
  dark: "Dark",
  system: "System",
} as const;

export type ThemeOption = keyof typeof themeLabels;
