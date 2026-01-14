import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, StatusBar } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { useTheme } from '../../application/theme/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../application/navigation/types';
import { List } from '../../data/models';
import { ScreenLayout } from '../../shared/components';
import { BlurView } from 'expo-blur';

export const ListsScreen = () => {
    const { lists, items, createList, setTheme } = useAppStore();
    const { theme, isDark } = useTheme();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [isModalVisible, setModalVisible] = useState(false);
    const [newListName, setNewListName] = useState('');

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    const handleCreateList = () => {
        if (newListName.trim()) {
            createList(newListName);
            setNewListName('');
            setModalVisible(false);
        }
    };

    const renderItem = ({ item }: { item: List }) => {
        const count = items.filter(i => i.listId === item.id).length;
        return (
            <TouchableOpacity
                style={[
                    styles.itemCard,
                    {
                        backgroundColor: isDark
                            ? 'rgba(255,255,255,0.10)'
                            : 'rgba(255,255,255,0.85)',
                    },
                ]}


                onPress={() => navigation.navigate('ListDetail', { listId: item.id, title: item.name })}
                activeOpacity={0.7}
            >
                <View style={styles.itemIcon}>
                    <Ionicons name="list" size={28} color={theme.primary} />
                </View>
                <View style={styles.itemContent}>
                    <Text style={[styles.itemTitle, { color: theme.text }]}>{item.name}</Text>
                    <Text style={[styles.itemSubtitle, { color: theme.textSecondary }]}>{count} {count === 1 ? 'Item' : 'Items'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
        );
    };

    return (
        <ScreenLayout noPadding>
            <View style={styles.container}>
                {/* Custom Dashboard Header */}
                <View style={[styles.topBar, { marginTop: 24 }]}>
                    <Text style={[styles.logoText, { color: '#FFF' }]}>Tracker</Text>
                    <View style={styles.topIcons}>
                        {/* <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
                            <Ionicons name={isDark ? "sunny" : "moon"} size={24} color="#FFF" />
                        </TouchableOpacity> */}
                        <TouchableOpacity onPress={() => navigation.navigate('Account')} style={styles.iconButton}>
                            <Ionicons name="person-circle" size={40} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Sub Header */}
                <View style={styles.subHeader}>
                    <Text style={[styles.sectionTitle, { color: 'rgba(255,255,255,0.9)' }]}>My Lists</Text>
                </View>

                <FlatList
                    data={lists}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />

                {/* FAB */}
                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: theme.surface }]}
                    onPress={() => setModalVisible(true)}
                >
                    <Ionicons name="add" size={36} color={theme.primary} />
                </TouchableOpacity>

                {/* Create List Modal */}
                <Modal
                    transparent
                    visible={isModalVisible}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <BlurView
                        intensity={100}
                        tint='dark'
                        style={StyleSheet.absoluteFill}
                    >
                        <View style={styles.modalCenter}>
                            <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
                                <Text style={[styles.modalTitle, { color: theme.text }]}>New List</Text>
                                <TextInput
                                    style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                                    placeholder="List Name"
                                    placeholderTextColor={theme.textSecondary}
                                    value={newListName}
                                    onChangeText={setNewListName}
                                    autoFocus
                                />
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                        <Text style={{ color: theme.textSecondary }}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleCreateList} style={[styles.createButton, { backgroundColor: theme.primary }]}>
                                        <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Create</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </BlurView>
                </Modal>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    logoText: {
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    topIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        padding: 4,
    },
    subHeader: {
        paddingHorizontal: 20,
        paddingBottom: 25,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
    },
    listContent: {
        padding: 20,
        paddingTop: 0,
        paddingBottom: 100,
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 36,
        marginBottom: 20,
        borderRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
    },

    itemIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    itemSubtitle: {
        fontSize: 14,
        opacity: 0.7,
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
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    modalCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxWidth: 340,
        padding: 24,
        borderRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 16,
    },
    cancelButton: {
        padding: 12,
    },
    createButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
});
