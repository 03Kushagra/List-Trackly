import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { useTheme } from '../../application/theme/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../application/navigation/types';
import { Item } from '../../data/models';
import { ScreenLayout } from '../../shared/components';

type ListDetailRouteProp = RouteProp<RootStackParamList, 'ListDetail'>;

type SortOrder = 'A to Z' | 'newest' | 'oldest';

export const ListDetailScreen = () => {
    const { items, addItem } = useAppStore();
    const { theme } = useTheme();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<ListDetailRouteProp>();

    if (!route.params?.listId) {
        navigation.goBack();
        return null;
    }

    const { listId, title } = route.params;
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('A to Z');

    // Modal State
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [newItemName, setNewItemName] = useState('');

    // Derived state
    const filteredItems = useMemo(() => {
        let result = items.filter(i => i.listId === listId);

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(i => i.name.toLowerCase().includes(query));
        }

        switch (sortOrder) {
            case 'A to Z':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
                result.sort((a, b) => b.createdAt - a.createdAt);
                break;
            case 'oldest':
                result.sort((a, b) => a.createdAt - b.createdAt);
                break;
        }

        return result;
    }, [items, listId, searchQuery, sortOrder]);

    const handleQuickAdd = () => {
        if (searchQuery.trim()) {
            addItem(listId, searchQuery.trim(), 1, '', '', 0);
            setSearchQuery('');
        }
    };

    const handleAddItem = () => {
        if (newItemName.trim()) {
            addItem(listId, newItemName.trim(), 1, '', '', 0);
            setNewItemName('');
            setAddModalVisible(false);
        }
    };

    const renderItem = ({ item, index }: { item: Item; index: number }) => {
        return (
            <View style={[styles.itemContainer, { backgroundColor: theme.surface }]}>
                <Text style={[styles.itemIndex, { color: theme.textSecondary }]}>
                    {index + 1}.
                </Text>

                <View style={styles.itemContent}>
                    <Text style={[styles.itemName, { color: theme.text }]}>
                        {item.name}
                    </Text>
                </View>
            </View>
        );
    };


    // Check if we should show "Add {query}"
    const showAddOption = searchQuery.length > 0 && !filteredItems.find(i => i.name.toLowerCase() === searchQuery.toLowerCase());

    return (
        // <ScreenLayout title={title || "List Details"} noPadding>
        <ScreenLayout noPadding style={{ marginTop: 10 }}>
            <View style={styles.container}>
                {/* Search & Sort Header */}
                <View style={[styles.header]}>
                    <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
                        <Ionicons name="search" size={20} color={theme.textSecondary} style={{ marginRight: 8 }} />
                        <TextInput
                            style={{ flex: 1, color: theme.text, height: 50, fontWeight: '600' }}
                            placeholder="Search or add items..."
                            placeholderTextColor={theme.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {showAddOption && (
                        <TouchableOpacity style={[styles.quickAddButton, { backgroundColor: theme.primary }]} onPress={handleQuickAdd}>
                            <Ionicons name="add-circle" size={20} color="#FFF" />
                            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Add "{searchQuery}"</Text>
                        </TouchableOpacity>
                    )}

                    <View style={[styles.sortRow, { marginTop: 10, }]}>
                        {['A to Z', 'newest', 'oldest'].map((order) => (
                            <TouchableOpacity
                                key={order}
                                onPress={() => setSortOrder(order as SortOrder)}
                                style={[
                                    styles.sortChip,
                                    sortOrder === order ? { backgroundColor: theme.primary } : { backgroundColor: 'rgba(255,255,255,0.2)' }
                                ]}
                            >
                                <Text style={[
                                    styles.sortText,
                                    { color: sortOrder === order ? '#FFF' : '#FFF' }
                                ]}>
                                    {order.charAt(0).toUpperCase() + order.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <FlatList
                    data={filteredItems}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        !showAddOption ? (
                            <View style={styles.emptyContainer}>
                                <Text style={{ color: 'rgba(255,255,255,0.7)' }}>No items found.</Text>
                            </View>
                        ) : null
                    }
                />

                {/* FAB to Open Modal */}
                {/* <TouchableOpacity
                    style={[styles.fab, { backgroundColor: theme.surface }]}
                    onPress={() => setAddModalVisible(true)}
                >
                    <Ionicons name="add" size={32} color={theme.primary} />
                </TouchableOpacity> */}
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 70
    },
    header: {
        padding: 16,
        gap: 12,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 12,
        height: 48,
    },
    quickAddButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        gap: 8,
    },
    sortRow: {
        flexDirection: 'row',
        gap: 8,
    },
    sortChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    sortText: {
        fontSize: 12,
        fontWeight: '600',
    },
    list: {
        padding: 16,
        paddingBottom: 100,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 10,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    itemContent: {
        flex: 1,
    },
    itemName: {
        fontSize: 18,
        fontWeight: '500',
    },
    itemIndex: {
        marginRight: 12,
        fontSize: 16,
        fontWeight: '600',
    },
    qtyBadge: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    qtyText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    fab: {
        position: 'absolute',
        bottom: 32,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
});
