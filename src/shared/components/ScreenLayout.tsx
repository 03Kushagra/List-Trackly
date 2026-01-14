import React from 'react';
import { View, StyleSheet, SafeAreaView, ViewStyle, Text } from 'react-native';
import { useTheme } from '../../application/theme/useTheme';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

interface ScreenLayoutProps {
    children: React.ReactNode;
    style?: ViewStyle;
    noPadding?: boolean;
    title?: string;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({ children, style, noPadding = false, title }) => {
    const { theme, isDark } = useTheme();

    return (
        <View style={styles.flex}>
            <LinearGradient
                // Modern Blue Gradient
                colors={['#1e3c72', '#2a5298', '#ffffff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 0.4, 1]}
                style={styles.background}
            />
            <SafeAreaView style={styles.safeArea}>
                <ExpoStatusBar style="light" />
                {title && (
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                )}
                <View style={[styles.container, !noPadding && styles.padding, style]}>
                    {children}
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    padding: {
        paddingHorizontal: 16,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});
