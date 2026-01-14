import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenLayout } from '../../shared/components/ScreenLayout';
import { BasicButton } from '../../shared/components/BasicButton';
import { useTheme } from '../../application/theme/useTheme';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../application/navigation/types';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [phone, setPhone] = useState('');

    const handleSendOTP = () => {
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        if (cleanPhone.length !== 10) {
            Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number.');
            return;
        }
        navigation.navigate('OTP', { phone: cleanPhone });
    };

    return (
        <ScreenLayout title="Welcome">
            <View style={styles.container}>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Enter your phone number to continue
                </Text>

                <View style={[styles.inputContainer, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.prefix, { color: theme.text }]}>+91</Text>
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="Mobile Number"
                        placeholderTextColor={theme.textPlaceholder}
                        keyboardType="number-pad"
                        maxLength={10}
                        value={phone}
                        onChangeText={setPhone}
                    />
                </View>

                <BasicButton
                    title="Send OTP"
                    onPress={handleSendOTP}
                    variant="primary"
                    style={styles.button}
                />
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 32,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 24,
    },
    prefix: {
        fontSize: 18,
        fontWeight: '600',
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
    },
    button: {
        marginTop: 8,
    },
});
