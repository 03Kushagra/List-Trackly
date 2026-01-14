import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { ScreenLayout, ProgressBar, QuantityStepper, BasicButton, SectionHeader, ConfirmDialog } from '../../shared/components';
import { useTheme } from '../../application/theme/useTheme';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../application/navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { formatDateTime } from '../../shared/utils/date';

type ItemDetailRouteProp = RouteProp<RootStackParamList, 'ItemDetail'>;

export const ItemDetailScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<ItemDetailRouteProp>();
    const { itemId } = route.params;

    const item = useAppStore((state) => state.items.find((i) => i.id === itemId));
    const categories = useAppStore((state) => state.categories);
    const logs = useAppStore((state) => state.logs.filter((l) => l.itemId === itemId));

    const {
        incrementItem,
        decrementItem,
        resetItemQty,
        completeItem,
        archiveItem,
        unarchiveItem
    } = useAppStore();

    const [showArchiveDialog, setShowArchiveDialog] = useState(false);

    // If item deleted/not found
    if (!item) {
        return (
            <ScreenLayout>
                <View style={styles.notFound}>
                    <Text style={{ color: theme.text }}>Item not found</Text>
                </View>
            </ScreenLayout>
        );
    }

    const category = categories.find((c) => c.id === item.categoryId);
    const progress = item.targetQty > 0 ? item.currentQty / item.targetQty : 0;
    const percentage = Math.round(Math.min(progress, 1) * 100);
    const isComplete = item.currentQty >= item.targetQty;

    const handleEdit = () => {
        navigation.navigate('AddEditItem', { itemId: item.id });
    };

    const toggleArchive = () => {
        if (item.isArchived) {
            unarchiveItem(item.id);
        } else {
            setShowArchiveDialog(true);
        }
    };

    const confirmArchive = () => {
        archiveItem(item.id);
        setShowArchiveDialog(false);
        navigation.goBack();
    };

    return (
        <ScreenLayout>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Area */}
                <View style={styles.header}>
                    <View style={styles.titleRow}>
                        <Text style={[styles.title, { color: theme.text }]}>{item.name}</Text>
                        <TouchableOpacity onPress={handleEdit}>
                            <Ionicons name="create-outline" size={24} color={theme.primary} />
                        </TouchableOpacity>
                    </View>

                    {category && (
                        <View style={[styles.badge, { backgroundColor: category.color + '20' }]}>
                            <Text style={[styles.badgeText, { color: category.color }]}>{category.name}</Text>
                        </View>
                    )}
                </View>

                {/* Details */}
                {item.notes ? (
                    <Text style={[styles.notes, { color: theme.textSecondary }]}>{item.notes}</Text>
                ) : null}

                {/* Progress Card */}
                <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.progressHeader}>
                        <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>Progress</Text>
                        <Text style={[styles.percentage, { color: isComplete ? theme.success : theme.primary }]}>
                            {percentage}%
                        </Text>
                    </View>

                    <ProgressBar
                        progress={progress}
                        height={12}
                        color={isComplete ? theme.success : category?.color || theme.primary}
                    />

                    <Text style={[styles.progressStats, { color: theme.text }]}>
                        {item.currentQty} <Text style={{ color: theme.textSecondary }}>of</Text> {item.targetQty} {item.unit}
                    </Text>

                    <View style={styles.controls}>
                        <QuantityStepper
                            value={item.currentQty}
                            onIncrement={() => incrementItem(item.id)}
                            onDecrement={() => decrementItem(item.id)}
                        />
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.actionGrid}>
                    <BasicButton
                        title="Complete"
                        onPress={() => completeItem(item.id)}
                        variant="primary"
                        style={{ flex: 1 }}
                        disabled={isComplete}
                    />
                    <BasicButton
                        title="Reset"
                        onPress={() => resetItemQty(item.id)}
                        variant="secondary"
                        style={{ flex: 1 }}
                        disabled={item.currentQty === 0}
                    />
                </View>

                <BasicButton
                    title={item.isArchived ? "Unarchive Item" : "Archive Item"}
                    onPress={toggleArchive}
                    variant={item.isArchived ? "secondary" : "destructive"} // Visual cue
                    style={{ marginTop: 12 }}
                />

                {/* History */}
                <SectionHeader title="History" />
                <View style={[styles.logsContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    {logs.length === 0 ? (
                        <Text style={[styles.emptyLogs, { color: theme.textSecondary }]}>No history yet.</Text>
                    ) : (
                        logs.slice(0, 20).map((log, index) => (
                            <View key={log.id} style={[
                                styles.logRow,
                                index !== logs.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }
                            ]}>
                                <Text style={[styles.logText, { color: theme.text }]}>
                                    {getLogActionText(log)}
                                    {log.delta ? ` (${log.delta > 0 ? '+' : ''}${log.delta})` : ''}
                                </Text>
                                <Text style={[styles.logTime, { color: theme.textSecondary }]}>
                                    {formatDateTime(log.timestamp)}
                                </Text>
                            </View>
                        ))
                    )}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            <ConfirmDialog
                visible={showArchiveDialog}
                title="Archive Item?"
                message="This will hide the item from your main list. You can restore it later from Settings."
                confirmLabel="Archive"
                variant="destructive"
                onConfirm={confirmArchive}
                onCancel={() => setShowArchiveDialog(false)}
            />
        </ScreenLayout>
    );
};

// Duplicated helper for simplicity in this file scope or could export shared one.
// Putting it here for now.
const getLogActionText = (log: any): string => {
    switch (log.actionType) {
        case 'create': return 'Created item';
        case 'increment': return 'Incremented';
        case 'decrement': return 'Decremented';
        case 'set': return 'Set quantity';
        case 'reset': return 'Reset quantity';
        case 'complete': return 'Marked complete';
        case 'archive': return 'Archived';
        case 'unarchive': return 'Restored';
        case 'edit': return 'Updated details';
        case 'delete': return 'Deleted';
        default: return 'Updated';
    }
}

const styles = StyleSheet.create({
    notFound: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginBottom: 16,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        flex: 1,
        marginRight: 10,
    },
    badge: {
        alignSelf: 'flex-start',
        marginTop: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    notes: {
        fontSize: 16,
        marginBottom: 24,
        lineHeight: 22,
    },
    card: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 24,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressLabel: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    percentage: {
        fontSize: 24,
        fontWeight: '800',
    },
    progressStats: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    controls: {
        marginTop: 20,
        alignItems: 'center',
    },
    actionGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    logsContainer: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 4,
    },
    emptyLogs: {
        padding: 16,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    logRow: {
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logText: {
        fontSize: 14,
        fontWeight: '500',
    },
    logTime: {
        fontSize: 12,
    },
});
