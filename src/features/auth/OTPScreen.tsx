import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { ScreenLayout } from '../../shared/components/ScreenLayout';
import { BasicButton } from '../../shared/components/BasicButton';
import { useTheme } from '../../application/theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { RootStackParamList } from '../../application/navigation/types';

type OTPScreenRouteProp = RouteProp<RootStackParamList, 'OTP'>;

export const OTPScreen = () => {
    const { theme } = useTheme();
    const route = useRoute<OTPScreenRouteProp>();
    const { phone } = route.params;
    const login = useAppStore((state) => state.login);
    const [otp, setOtp] = useState('');

    const handleVerify = () => {
        if (otp.length < 4) {
            Alert.alert('Invalid OTP', 'Please enter a valid OTP.');
            return;
        }
        // Mock verification
        login();
    };

    return (
        <ScreenLayout title="Enter OTP">
            <View style={styles.container}>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    We sent a code to +91 {phone}
                </Text>

                <View style={[styles.inputContainer, { backgroundColor: theme.surface }]}>
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="Enter OTP"
                        placeholderTextColor={theme.textPlaceholder}
                        keyboardType="number-pad"
                        maxLength={6}
                        value={otp}
                        onChangeText={setOtp}
                        autoFocus
                    />
                </View>

                <BasicButton
                    title="Verify & Login"
                    onPress={handleVerify}
                    variant="primary"
                    style={styles.button}
                />

                <TouchableOpacity style={styles.resendButton} onPress={() => Alert.alert('OTP Sent', 'A new OTP has been sent.')}>
                    <Text style={[styles.resendText, { color: theme.primary }]}>
                        Resend Code
                    </Text>
                </TouchableOpacity>
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 24,
        alignItems: 'center',
    },
    input: {
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 8,
        textAlign: 'center',
        width: '100%',
    },
    button: {
        marginTop: 8,
    },
    resendButton: {
        marginTop: 24,
        alignItems: 'center',
    },
    resendText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
