import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../application/theme/useTheme';
import { BasicButton } from './BasicButton';

interface ConfirmDialogProps {
    visible: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'destructive' | 'primary';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    visible,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'primary',
}) => {
    const { theme } = useTheme();

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={[styles.dialog, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
                    <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>

                    <View style={styles.actions}>
                        <TouchableOpacity onPress={onCancel} style={styles.button}>
                            <Text style={[styles.buttonText, { color: theme.text }]}>{cancelLabel}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirm}
                            style={[
                                styles.button,
                                styles.confirmButton,
                                { backgroundColor: variant === 'destructive' ? theme.destructive : theme.primary }
                            ]}
                        >
                            <Text style={[styles.buttonText, { color: theme.primaryForeground }]}>{confirmLabel}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    dialog: {
        width: '100%',
        borderRadius: 16,
        padding: 24,
        maxWidth: 400,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    message: {
        fontSize: 16,
        marginBottom: 24,
        lineHeight: 22,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    confirmButton: {
        // bg is handled in render
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
