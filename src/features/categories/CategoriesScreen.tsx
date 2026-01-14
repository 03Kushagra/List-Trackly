import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { ScreenLayout, BasicButton, SectionHeader } from '../../shared/components';
import { useTheme } from '../../application/theme/useTheme';
import { Ionicons } from '@expo/vector-icons';

const COLORS = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#06B6D4', // Cyan
    '#3B82F6', // Blue
    '#6366F1', // Indigo
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#64748B', // Slate
];

export const CategoriesScreen = () => {
    const { theme } = useTheme();
    const { categories, addCategory, deleteCategory, items } = useAppStore();

    const [isCreating, setIsCreating] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [newCatColor, setNewCatColor] = useState(COLORS[5]);

    const handleCreate = () => {
        if (!newCatName.trim()) return;
        addCategory(newCatName, newCatColor);
        setNewCatName('');
        setIsCreating(false);
    };

    const handleDelete = (id: string) => {
        const inUse = items.some(i => i.categoryId === id);
        if (inUse) {
            Alert.alert("Cannot Delete", "This category is assigned to one or more items.");
            return;
        }

        Alert.alert(
            "Delete Category",
            "Are you sure?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteCategory(id) }
            ]
        );
    };

    return (
        <ScreenLayout>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* List */}
                <View style={styles.list}>
                    {categories.map((cat) => {
                        const count = items.filter(i => i.categoryId === cat.id && !i.isArchived).length;
                        return (
                            <View key={cat.id} style={[styles.row, { borderBottomColor: theme.border }]}>
                                <View style={styles.info}>
                                    <View style={[styles.dot, { backgroundColor: cat.color }]} />
                                    <Text style={[styles.name, { color: theme.text }]}>{cat.name}</Text>
                                    <Text style={[styles.count, { color: theme.textSecondary }]}>{count} items</Text>
                                </View>
                                <TouchableOpacity onPress={() => handleDelete(cat.id)}>
                                    <Ionicons name="trash-outline" size={20} color={theme.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>

                {/* Add Section */}
                {isCreating ? (
                    <View style={[styles.creator, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Text style={[styles.header, { color: theme.text }]}>New Category</Text>

                        <TextInput
                            style={[styles.input, { color: theme.text, backgroundColor: theme.inputBackground, borderColor: theme.border }]}
                            value={newCatName}
                            onChangeText={setNewCatName}
                            placeholder="Category Name"
                            placeholderTextColor={theme.gray400}
                            autoFocus
                        />

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorRow}>
                            {COLORS.map(c => (
                                <TouchableOpacity
                                    key={c}
                                    onPress={() => setNewCatColor(c)}
                                    style={[
                                        styles.colorDot,
                                        { backgroundColor: c },
                                        newCatColor === c && styles.selectedColor
                                    ]}
                                />
                            ))}
                        </ScrollView>

                        <View style={styles.createActions}>
                            <BasicButton title="Save" onPress={handleCreate} size="sm" style={{ flex: 1 }} />
                            <BasicButton title="Cancel" variant="ghost" onPress={() => setIsCreating(false)} size="sm" style={{ flex: 1 }} />
                        </View>
                    </View>
                ) : (
                    <BasicButton
                        title="Add Category"
                        variant="secondary"
                        onPress={() => setIsCreating(true)}
                        style={{ marginTop: 20 }}
                    />
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    list: {
        marginTop: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    count: {
        fontSize: 14,
    },
    creator: {
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    header: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    colorRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    colorDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    selectedColor: {
        borderWidth: 2,
        borderColor: '#FFF',
    },
    createActions: {
        flexDirection: 'row',
        gap: 8,
    },
});
