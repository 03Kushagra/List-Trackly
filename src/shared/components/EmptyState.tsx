import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../application/theme/useTheme';
import { BasicButton } from './BasicButton';

interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'clipboard-outline',
    title,
    message,
    actionLabel,
    onAction
}) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: theme.border }]}>
                <Ionicons name={icon} size={32} color={theme.textSecondary} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            {message && <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>}

            {actionLabel && onAction && (
                <BasicButton
                    title={actionLabel}
                    onPress={onAction}
                    style={styles.button}
                    variant="secondary"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        opacity: 0.8,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        minWidth: 120,
    }
});
