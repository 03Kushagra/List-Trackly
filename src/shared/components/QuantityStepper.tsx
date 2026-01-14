import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../application/theme/useTheme';

interface QuantityStepperProps {
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    min?: number;
    max?: number;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
    value,
    onIncrement,
    onDecrement,
    min = 0,
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { borderColor: theme.border }]}>
            <TouchableOpacity
                onPress={onDecrement}
                disabled={value <= min}
                style={[styles.button, { borderRightColor: theme.border }]}
            >
                <Ionicons name="remove" size={20} color={value <= min ? theme.border : theme.text} />
            </TouchableOpacity>

            <View style={[styles.valueContainer, { backgroundColor: theme.background }]}>
                <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
            </View>

            <TouchableOpacity
                onPress={onIncrement}
                style={[styles.button, { borderLeftColor: theme.border }]}
            >
                <Ionicons name="add" size={20} color={theme.text} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 8,
        overflow: 'hidden',
        height: 40,
        alignItems: 'center',
    },
    button: {
        width: 40,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    valueContainer: {
        paddingHorizontal: 12,
        justifyContent: 'center',
        minWidth: 40,
        alignItems: 'center',
        height: '100%',
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
    },
});
