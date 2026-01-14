import { useAppStore } from '../../store/useAppStore';
import { THEME } from './theme';
import { useColorScheme } from 'react-native';

export const useTheme = () => {
    const systemScheme = useColorScheme();
    const settingsTheme = useAppStore((state) => state.settings.theme);

    const isDark =
        settingsTheme === 'system'
            ? systemScheme === 'dark'
            : settingsTheme === 'dark';

    return {
        theme: isDark ? THEME.dark : THEME.light,
        isDark,
    };
};
