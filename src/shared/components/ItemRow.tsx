import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Item, Category } from '../../data/models';
import { ProgressBar } from './ProgressBar';
import { useTheme } from '../../application/theme/useTheme';
import { QuantityStepper } from './QuantityStepper';
import { Ionicons } from '@expo/vector-icons';

interface ItemRowProps {
    item: Item;
    category?: Category;
    onPress: () => void;
    onIncrement: () => void;
    onDecrement: () => void;
}

export const ItemRow: React.FC<ItemRowProps> = ({ item, category, onPress, onIncrement, onDecrement }) => {
    const { theme } = useTheme();

    const progress = item.targetQty > 0 ? item.currentQty / item.targetQty : 0;
    const isComplete = item.currentQty >= item.targetQty;

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                    {category && (
                        <View style={[styles.badge, { backgroundColor: category.color + '20' }]}>
                            <Text style={[styles.badgeText, { color: category.color }]}>{category.name}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.progressRow}>
                    <View style={styles.progressContainer}>
                        <ProgressBar progress={progress} height={6} color={isComplete ? theme.success : category?.color || theme.primary} />
                        <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                            {item.currentQty} / {item.targetQty} {item.unit}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.actions}>
                <QuantityStepper
                    value={item.currentQty}
                    onIncrement={onIncrement}
                    onDecrement={onDecrement}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    content: {
        flex: 1,
        marginRight: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        flexWrap: 'wrap',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressContainer: {
        flex: 1,
    },
    progressText: {
        fontSize: 12,
        marginTop: 4,
    },
    actions: {
        justifyContent: 'center',
    },
});
