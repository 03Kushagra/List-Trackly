import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { ScreenLayout, BasicButton, SectionHeader } from '../../shared/components';
import { useTheme } from '../../application/theme/useTheme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../application/navigation/types';

export const BulkAddScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { bulkAddItems } = useAppStore();

    const [input, setInput] = useState('');
    const [preview, setPreview] = useState<string[]>([]);

    const handleTextChange = (text: string) => {
        setInput(text);
        if (!text.trim()) {
            setPreview([]);
            return;
        }

        // Split by newlines or commas
        const items = text.split(/[,\n]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);

        setPreview(items);
    };

    const handleSave = () => {
        if (preview.length === 0) return;
        bulkAddItems(preview);
        navigation.goBack();
    };

    return (
        <ScreenLayout>
            <View style={styles.container}>
                <Text style={[styles.helperText, { color: theme.textSecondary }]}>
                    Enter multiple items separated by commas or new lines.
                </Text>

                <TextInput
                    style={[
                        styles.input,
                        {
                            color: theme.text,
                            backgroundColor: theme.inputBackground,
                            borderColor: theme.border
                        }
                    ]}
                    value={input}
                    onChangeText={handleTextChange}
                    multiline
                    placeholder={`Apples\nBananas\nMilk`}
                    placeholderTextColor={theme.gray400}
                    autoFocus
                />

                <SectionHeader title={`Preview (${preview.length})`} />

                <ScrollView style={[styles.previewContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    {preview.length === 0 ? (
                        <Text style={[styles.emptyPreview, { color: theme.textSecondary }]}>
                            Items will appear here...
                        </Text>
                    ) : (
                        preview.map((item, index) => (
                            <View key={index} style={[
                                styles.previewRow,
                                index !== preview.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }
                            ]}>
                                <Text style={[styles.previewText, { color: theme.text }]}>{item}</Text>
                            </View>
                        ))
                    )}
                </ScrollView>

                <View style={styles.actions}>
                    <BasicButton
                        title={`Add ${preview.length} Items`}
                        onPress={handleSave}
                        disabled={preview.length === 0}
                    />
                    <BasicButton
                        title="Cancel"
                        variant="ghost"
                        onPress={() => navigation.goBack()}
                        style={{ marginTop: 8 }}
                    />
                </View>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    helperText: {
        marginBottom: 12,
        fontSize: 14,
    },
    input: {
        height: 150,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    previewContainer: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 20,
    },
    emptyPreview: {
        padding: 16,
        fontStyle: 'italic',
    },
    previewRow: {
        padding: 12,
    },
    previewText: {
        fontSize: 16,
    },
    actions: {
        marginBottom: 20,
    }
});
