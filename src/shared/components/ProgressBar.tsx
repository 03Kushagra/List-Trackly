import React from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import { useTheme } from '../../application/theme/useTheme';

interface ProgressBarProps {
    progress: number; // 0 to 1
    height?: number;
    color?: string;
    trackColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    height = 8,
    color,
    trackColor,
}) => {
    const { theme } = useTheme();

    const clampedProgress = Math.min(Math.max(progress, 0), 1);
    const widthPercentage: DimensionValue = `${clampedProgress * 100}%`;

    return (
        <View style={[styles.track, { height, backgroundColor: trackColor || theme.border }]}>
            <View
                style={[
                    styles.fill,
                    {
                        width: widthPercentage,
                        backgroundColor: color || theme.success
                    }
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    track: {
        width: '100%',
        borderRadius: 4,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 4,
    },
});
