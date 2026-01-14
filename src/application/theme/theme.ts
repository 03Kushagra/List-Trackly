export const PALETTE = {
    white: '#FFFFFF',
    black: '#000000',

    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',

    blue500: '#3B82F6',
    blue600: '#2563EB',

    red500: '#EF4444',
    green500: '#10B981',
};

export const THEME = {
    light: {
        background: PALETTE.gray50,
        surface: PALETTE.white,
        text: PALETTE.gray900,
        textSecondary: PALETTE.gray500,
        border: PALETTE.gray200,
        primary: PALETTE.black, // Minimalist primary
        primaryForeground: PALETTE.white,
        destructive: PALETTE.red500,
        success: PALETTE.green500,
        inputBackground: PALETTE.white,
        gray400: PALETTE.gray400,
        textPlaceholder: PALETTE.gray400,
    },
    dark: {
        background: PALETTE.black,
        surface: PALETTE.gray900,
        text: PALETTE.gray50,
        textSecondary: PALETTE.gray400,
        border: PALETTE.gray800,
        primary: PALETTE.white,
        primaryForeground: PALETTE.black,
        destructive: PALETTE.red500,
        success: PALETTE.green500,
        inputBackground: PALETTE.gray900,
        gray400: PALETTE.gray400,
        textPlaceholder: PALETTE.gray600,
    }
};

export type ThemeType = typeof THEME.light;
