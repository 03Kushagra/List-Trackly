import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../application/theme/useTheme';

interface SectionHeaderProps {
    title: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionLabel, onAction }) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            {actionLabel && onAction && (
                <TouchableOpacity onPress={onAction}>
                    <Text style={[styles.action, { color: theme.primary }]}>{actionLabel}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    action: {
        fontSize: 14,
        fontWeight: '600',
    },
});
