export const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatDateTime = (timestamp: number): string => {
    return `${formatDate(timestamp)} ${formatTime(timestamp)}`;
};
