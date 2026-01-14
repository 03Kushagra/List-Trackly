import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { ScreenLayout } from '../../shared/components';
import { useTheme } from '../../application/theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';

export const SettingsScreen = () => {
    const { theme, isDark } = useTheme();

    // Dummy data for now (swap with Firebase user later)
    const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
    const name = useMemo(() => 'Kushagra', []);
    const email = useMemo(() => 'kushagra@example.com', []);
    const phone = useMemo(() => '+91 98765 43210', []); // non-editable, used for OTP later

    const pickFromGallery = async () => {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (perm.status !== 'granted') {
            Alert.alert('Permission Required', 'Please allow photo library access to choose a profile image.');
            return;
        }

        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.9,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!res.canceled) setProfileImageUri(res.assets[0]?.uri ?? null);
    };

    const pickFromCamera = async () => {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (perm.status !== 'granted') {
            Alert.alert('Permission Required', 'Please allow camera access to take a profile photo.');
            return;
        }

        const res = await ImagePicker.launchCameraAsync({
            quality: 0.9,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!res.canceled) setProfileImageUri(res.assets[0]?.uri ?? null);
    };

    const handleChangePhoto = () => {
        Alert.alert('Profile Photo', 'Choose an option', [
            { text: 'Camera', onPress: pickFromCamera },
            { text: 'Gallery', onPress: pickFromGallery },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const handleContactSupport = async () => {
        const mailto = 'mailto:support@yourapp.com?subject=Support%20Request%20-%20Tracker';
        const can = await Linking.canOpenURL(mailto);
        if (!can) {
            Alert.alert('Not Available', 'No email client found on this device.');
            return;
        }
        Linking.openURL(mailto);
    };

    const handleOpenTerms = async () => {
        const url = 'https://example.com/terms';
        const can = await Linking.canOpenURL(url);
        if (!can) {
            Alert.alert('Not Available', 'Unable to open the Terms link on this device.');
            return;
        }
        Linking.openURL(url);
    };

    return (
        <ScreenLayout style={{ marginTop: 90 }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page}>
                <Text style={[styles.screenSubtitle, { color: 'rgba(255,255,255,0.75)' }]}>
                    Manage your profile and app info
                </Text>

                {/* Profile Card */}
                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            borderColor: 'rgba(255,255,255,0.12)',
                        },
                    ]}
                >
                    <View style={styles.profileRow}>
                        <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.85} style={styles.avatarWrap}>
                            {profileImageUri ? (
                                <Image source={{ uri: profileImageUri }} style={styles.avatar} />
                            ) : (
                                <View style={[styles.avatarFallback, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                                    <Ionicons name="person" size={28} color="#fff" />
                                </View>
                            )}
                            <View style={[styles.cameraBadge, { backgroundColor: theme.primary }]}>
                                <Ionicons name="camera" size={14} color="#fff" />
                            </View>
                        </TouchableOpacity>

                        <View style={{ flex: 1 }}>
                            <Text style={[styles.name, { color: '#fff' }]} numberOfLines={1}>
                                {name}
                            </Text>
                            <Text style={[styles.meta, { color: 'rgba(255,255,255,0.75)' }]} numberOfLines={1}>
                                {email}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <View style={styles.left}>
                            <Ionicons name="call" size={18} color="rgba(255,255,255,0.85)" />
                            <Text style={[styles.rowLabel, { color: 'rgba(255,255,255,0.85)' }]}>Phone</Text>
                        </View>
                        <Text style={[styles.rowValue, { color: '#fff' }]}>{phone}</Text>
                    </View>

                    <Text style={[styles.helper, { color: 'rgba(255,255,255,0.65)' }]}>
                        Phone number is used for OTP login and cannot be edited.
                    </Text>
                </View>

                {/* Support */}
                <Text style={[styles.sectionTitle, { color: 'rgba(255,255,255,0.85)' }]}>Support</Text>

                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            borderColor: 'rgba(255,255,255,0.12)',
                        },
                    ]}
                >
                    <TouchableOpacity onPress={handleContactSupport} activeOpacity={0.75} style={styles.actionRow}>
                        <View style={styles.left}>
                            <Ionicons name="chatbubble-ellipses" size={18} color="rgba(255,255,255,0.9)" />
                            <Text style={[styles.rowLabel, { color: '#fff' }]}>Contact Support</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.65)" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity onPress={handleOpenTerms} activeOpacity={0.75} style={styles.actionRow}>
                        <View style={styles.left}>
                            <Ionicons name="document-text" size={18} color="rgba(255,255,255,0.9)" />
                            <Text style={[styles.rowLabel, { color: '#fff' }]}>Terms & Conditions</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.65)" />
                    </TouchableOpacity>
                </View>

                {/* About */}
                <Text style={[styles.sectionTitle, { color: 'rgba(255,255,255,0.85)' }]}>About</Text>

                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            borderColor: 'rgba(255,255,255,0.12)',
                        },
                    ]}
                >
                    <View style={styles.aboutRow}>
                        <Text style={[styles.aboutTitle, { color: '#fff' }]}>Tracker</Text>
                        <Text style={[styles.aboutMeta, { color: 'rgba(255,255,255,0.75)' }]}>
                            v{Constants.expoConfig?.version || '1.0.0'}
                        </Text>
                    </View>
                    <Text style={[styles.aboutDesc, { color: 'rgba(255,255,255,0.65)' }]}>
                        A clean item tracking app built with Expo.
                    </Text>
                </View>

                {/* Account Actions */}
                <Text style={[styles.sectionTitle, { color: 'rgba(255,255,255,0.85)' }]}>Account</Text>

                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            borderColor: 'rgba(255,255,255,0.12)',
                        },
                    ]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert('Log Out', 'Are you sure you want to log out?', [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Log Out',
                                    style: 'destructive',
                                    onPress: () => useAppStore.getState().logout(),
                                },
                            ]);
                        }}
                        activeOpacity={0.75}
                        style={styles.actionRow}
                    >
                        <View style={styles.left}>
                            <Ionicons name="log-out-outline" size={18} color={theme.destructive} />
                            <Text style={[styles.rowLabel, { color: theme.destructive }]}>Log Out</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>
        </ScreenLayout>
    );

};

const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 18,
        paddingBottom: 20,
    },

    screenTitle: {
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 0.2,
    },
    screenSubtitle: {
        marginTop: 6,
        marginBottom: 18,
        fontSize: 13,
        fontWeight: '600',
    },

    sectionTitle: {
        marginTop: 18,
        marginBottom: 10,
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 0.4,
        textTransform: 'uppercase',
    },

    card: {
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
    },

    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },

    avatarWrap: {
        width: 58,
        height: 58,
    },
    avatar: {
        width: 58,
        height: 58,
        borderRadius: 18,
    },
    avatarFallback: {
        width: 58,
        height: 58,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraBadge: {
        position: 'absolute',
        right: -6,
        bottom: -6,
        width: 26,
        height: 26,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    name: {
        fontSize: 18,
        fontWeight: '900',
    },
    meta: {
        fontSize: 13,
        fontWeight: '600',
        marginTop: 3,
    },

    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.12)',
        marginVertical: 14,
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },

    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    rowLabel: {
        fontSize: 14,
        fontWeight: '800',
    },
    rowValue: {
        fontSize: 14,
        fontWeight: '900',
    },

    helper: {
        marginTop: 10,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '600',
    },

    aboutRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
    },
    aboutTitle: {
        fontSize: 16,
        fontWeight: '900',
    },
    aboutMeta: {
        fontSize: 12,
        fontWeight: '700',
    },
    aboutDesc: {
        marginTop: 10,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '600',
    },
});
