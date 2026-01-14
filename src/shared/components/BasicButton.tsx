import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../application/theme/useTheme';

interface BasicButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
    size?: 'default' | 'sm';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
}

export const BasicButton: React.FC<BasicButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'default',
    loading = false,
    disabled = false,
    style,
}) => {
    const { theme } = useTheme();

    const getBackgroundColor = () => {
        if (disabled) return theme.border;
        switch (variant) {
            case 'primary': return theme.primary;
            case 'destructive': return theme.destructive;
            case 'secondary': return theme.border;
            case 'ghost': return 'transparent';
            default: return theme.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return theme.textSecondary;
        switch (variant) {
            case 'primary': return theme.primaryForeground;
            case 'destructive': return '#FFFFFF';
            case 'secondary': return theme.text;
            case 'ghost': return theme.text;
            default: return theme.primaryForeground;
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.container,
                { backgroundColor: getBackgroundColor() },
                size === 'sm' && styles.smContainer,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }, size === 'sm' && styles.smText]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    smContainer: {
        height: 36,
        paddingHorizontal: 12,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    smText: {
        fontSize: 14,
    },
});
