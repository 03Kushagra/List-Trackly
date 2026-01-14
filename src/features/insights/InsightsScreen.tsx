import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { ScreenLayout, ProgressBar, SectionHeader, EmptyState } from '../../shared/components';
import { useTheme } from '../../application/theme/useTheme';

export const InsightsScreen = () => {
    const { theme } = useTheme();
    const { items, categories, logs } = useAppStore();

    const activeItems = useMemo(() => items.filter(i => !i.isArchived), [items]);
    const completedItems = activeItems.filter(i => i.currentQty >= i.targetQty);

    // Total Progress
    const totalCurrent = activeItems.reduce((acc, i) => acc + i.currentQty, 0);
    const totalTarget = activeItems.reduce((acc, i) => acc + i.targetQty, 0);
    const overallProgress = totalTarget > 0 ? totalCurrent / totalTarget : 0;

    // Remaining Qty
    const remainingQty = activeItems.reduce((acc, i) => acc + Math.max(0, i.targetQty - i.currentQty), 0);

    // Category Breakdown
    const categoryStats = useMemo(() => {
        return categories.map(cat => {
            const catItems = activeItems.filter(i => i.categoryId === cat.id);
            if (catItems.length === 0) return null;

            const current = catItems.reduce((acc, i) => acc + i.currentQty, 0);
            const target = catItems.reduce((acc, i) => acc + i.targetQty, 0);
            return {
                ...cat,
                progress: target > 0 ? current / target : 0,
                itemCount: catItems.length,
            };
        }).filter(Boolean) as any[];
    }, [activeItems, categories]);

    // Last 7 days activity
    const activityStats = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            return d;
        }).reverse(); // Past to Present

        return last7Days.map(date => {
            const count = logs.filter(l => {
                const logDate = new Date(l.timestamp);
                logDate.setHours(0, 0, 0, 0);
                return logDate.getTime() === date.getTime();
            }).length;

            return {
                date,
                count,
                label: date.toLocaleDateString(undefined, { weekday: 'narrow' }) // M, T, W...
            };
        });
    }, [logs]);

    const maxActivity = Math.max(...activityStats.map(s => s.count), 1); // Avoid div by zero

    return (
        <ScreenLayout>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, { color: theme.text }]}>Insights</Text>

                {activeItems.length === 0 ? (
                    <EmptyState
                        title="Not enough data"
                        message="Add active items to see insights."
                        icon="bar-chart-outline"
                    />
                ) : (
                    <>
                        {/* Summary Cards */}
                        <View style={styles.cardRow}>
                            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Completion</Text>
                                <Text style={[styles.cardValue, { color: theme.primary }]}>{Math.round(overallProgress * 100)}%</Text>
                            </View>
                            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Remaining Qty</Text>
                                <Text style={[styles.cardValue, { color: theme.text }]}>{remainingQty}</Text>
                            </View>
                        </View>

                        {/* Weekly Activity Chart */}
                        <SectionHeader title="Last 7 Days Activity" />
                        <View style={[styles.chartContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <View style={styles.chartBars}>
                                {activityStats.map((day, idx) => (
                                    <View key={idx} style={styles.barColumn}>
                                        <View style={styles.barTrack}>
                                            <View
                                                style={[
                                                    styles.barFill,
                                                    {
                                                        height: `${(day.count / maxActivity) * 100}%`,
                                                        backgroundColor: day.count > 0 ? theme.primary : 'transparent',
                                                        minHeight: day.count > 0 ? 4 : 0
                                                    }
                                                ]}
                                            />
                                        </View>
                                        <Text style={[styles.barLabel, { color: theme.textSecondary }]}>{day.label}</Text>
                                    </View>
                                ))}
                            </View>
                            <Text style={[styles.chartFooter, { color: theme.textSecondary }]}>Total actions logged</Text>
                        </View>

                        {/* Category Breakdown */}
                        <SectionHeader title="Category Breakdown" />
                        {categoryStats.length === 0 ? (
                            <Text style={{ color: theme.textSecondary, fontStyle: 'italic' }}>No categorized items found.</Text>
                        ) : (
                            categoryStats.map(cat => (
                                <View key={cat.id} style={styles.categoryRow}>
                                    <View style={styles.catHeader}>
                                        <Text style={[styles.catName, { color: theme.text }]}>{cat.name}</Text>
                                        <Text style={[styles.catPercent, { color: theme.textSecondary }]}>{Math.round(cat.progress * 100)}%</Text>
                                    </View>
                                    <ProgressBar
                                        progress={cat.progress}
                                        height={8}
                                        color={cat.color}
                                    />
                                </View>
                            ))
                        )}
                    </>
                )}
                <View style={{ height: 40 }} />
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 24,
        marginTop: 16,
    },
    cardRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    card: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
    },
    cardLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: 8,
    },
    cardValue: {
        fontSize: 24,
        fontWeight: '700',
    },
    chartContainer: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
    },
    chartBars: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 100,
        alignItems: 'flex-end',
        marginBottom: 12,
    },
    barColumn: {
        alignItems: 'center',
        flex: 1,
    },
    barTrack: {
        height: '100%',
        width: 8,
        justifyContent: 'flex-end',
    },
    barFill: {
        borderRadius: 4,
        width: '100%',
    },
    barLabel: {
        marginTop: 8,
        fontSize: 12,
    },
    chartFooter: {
        textAlign: 'center',
        fontSize: 12,
    },
    categoryRow: {
        marginBottom: 16,
    },
    catHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    catName: {
        fontSize: 14,
        fontWeight: '600',
    },
    catPercent: {
        fontSize: 12,
        fontWeight: '600',
    },
});
