import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useTheme } from '../theme/useTheme';
import { useAppStore } from '../../store/useAppStore';

import { RootStackParamList } from './types';

// Screens
import { ListsScreen } from '../../features/lists/ListsScreen';
import { SettingsScreen } from '../../features/settings/SettingsScreen';
import { ListDetailScreen } from '../../features/lists/ListDetailScreen';
import { BulkAddScreen } from '../../features/items/BulkAddScreen';
import { LoginScreen } from '../../features/auth/LoginScreen';
import { OTPScreen } from '../../features/auth/OTPScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    const { theme, isDark } = useTheme();
    const isAuthenticated = useAppStore((state) => state.isAuthenticated);

    return (
        <NavigationContainer theme={{
            dark: isDark,
            colors: {
                primary: theme.primary,
                background: theme.background,
                card: theme.surface,
                text: theme.text,
                border: theme.border,
                notification: theme.primary,
            }
        }}>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: theme.surface,
                    },
                    headerTintColor: theme.text,
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                    headerShadowVisible: false,
                    cardStyle: { backgroundColor: theme.background },
                    ...TransitionPresets.SlideFromRightIOS,
                }}
            >
                {!isAuthenticated ? (
                    // Auth Stack
                    <>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="OTP"
                            component={OTPScreen}
                            options={{
                                title: '',
                                headerTransparent: true,
                            }}
                        />
                    </>
                ) : (
                    // App Stack
                    <>
                        <Stack.Screen
                            name="Lists"
                            component={ListsScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Account"
                            component={SettingsScreen}
                            // options={{ title: 'Account' }}
                            options={({ route }) => ({
                                title: 'Account Settings',
                                headerTransparent: true,
                                headerTintColor: isDark ? '#fff' : '#000',
                                headerTitleStyle: {
                                    fontWeight: '700',
                                },
                                headerShadowVisible: false,

                            })}
                        />
                        <Stack.Screen
                            name="ListDetail"
                            component={ListDetailScreen}
                            options={({ route }) => ({
                                title: route.params?.title || 'List Detail',
                                headerTransparent: true,
                                headerTintColor: isDark ? '#fff' : '#000',
                                headerTitleStyle: {
                                    fontWeight: '700',
                                },
                                headerShadowVisible: false,

                            })}
                        />

                        <Stack.Screen
                            name="BulkAdd"
                            component={BulkAddScreen}
                            options={{
                                title: 'Bulk Add',
                                presentation: 'modal',
                                ...TransitionPresets.ModalPresentationIOS,
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
