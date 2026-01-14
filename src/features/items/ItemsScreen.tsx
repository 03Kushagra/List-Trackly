import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { ScreenLayout, ItemRow, BasicButton, EmptyState } from '../../shared/components';
import { useTheme } from '../../application/theme/useTheme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../application/navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { Item } from '../../data/models';

export const ItemsScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [searchQuery, setSearchQuery] = useState('');

    const items = useAppStore((state) => state.items);
    const categories = useAppStore((state) => state.categories);
    const { incrementItem, decrementItem } = useAppStore();

    const activeItems = useMemo(() => items.filter(i => !i.isArchived), [items]);

    // Search Logic
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredItems = useMemo(() => {
        if (!normalizedQuery) return activeItems;
        return activeItems.filter(i => i.name.toLowerCase().includes(normalizedQuery));
    }, [activeItems, normalizedQuery]);

    const exactMatchExists = useMemo(() => {
        if (!normalizedQuery) return false;
        return activeItems.some(i => i.name.toLowerCase() === normalizedQuery);
    }, [activeItems, normalizedQuery]);

    const showAddButton = normalizedQuery.length > 0 && !exactMatchExists && filteredItems.length === 0;

    const handleAddItem = () => {
        navigation.navigate('AddEditItem', { initialName: searchQuery.trim() });
        setSearchQuery('');
    };

    const renderItem = ({ item }: { item: Item }) => {
        const category = categories.find(c => c.id === item.categoryId);
        return (
            <ItemRow
                item={item}
                category={category}
                onPress={() => navigation.navigate('ItemDetail', { itemId: item.id, title: item.name })}
                onIncrement={() => incrementItem(item.id)}
                onDecrement={() => decrementItem(item.id)}
            />
        );
    };

    return (
        <ScreenLayout style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Items</Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Ionicons name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="Search items..."
                        placeholderTextColor={theme.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="sentences"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.content}>
                {/* Case 1: Search is empty, show list or empty state */}
                {!normalizedQuery && activeItems.length === 0 && (
                    <EmptyState
                        title="No items yet"
                        message="Tap the + button to add your first item."
                        actionLabel="Add Item"
                        onAction={() => navigation.navigate('AddEditItem', {})}
                    />
                )}

                {/* Case 2: No matches found, show Add button (if query exists) */}
                {normalizedQuery && filteredItems.length === 0 && (
                    <View style={styles.noMatchContainer}>
                        <Text style={[styles.noMatchText, { color: theme.textSecondary }]}>
                            No item matches "{searchQuery}"
                        </Text>
                        {!exactMatchExists && (
                            <BasicButton
                                title={`Create "${searchQuery}"`}
                                onPress={handleAddItem}
                                style={styles.createButton}
                            />
                        )}
                    </View>
                )}

                {/* List of items */}
                <FlatList
                    data={filteredItems}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            {/* FAB - Only show if not searching or if items exist */}
            {!showAddButton && (
                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: theme.primary }]}
                    onPress={() => navigation.navigate('AddEditItem', {})}
                >
                    <Ionicons name="add" size={32} color={theme.primaryForeground} />
                </TouchableOpacity>
            )}
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0, // Manual padding control
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
    },
    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    listContent: {
        paddingTop: 8,
        paddingBottom: 80, // for FAB
    },
    noMatchContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    noMatchText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    createButton: {
        minWidth: 200,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
});
