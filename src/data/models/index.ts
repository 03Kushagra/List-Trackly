export interface Project {
    id: string;
    title: string;
    description?: string;
    createdAt: number;
}

export interface List {
    id: string;
    projectId: string;
    name: string;
    description?: string;
    createdAt: number;
}

export interface Item {
    id: string;
    projectId: string;
    listId: string;
    name: string;
    notes?: string;
    unit?: string;
    targetQty: number; // Defaults to 1 for simple items
    currentQty: number;
    isArchived: boolean;
    createdAt: number;
    updatedAt: number;
}

export type ActivityActionType =
    | 'increment'
    | 'decrement'
    | 'set'
    | 'reset'
    | 'complete'
    | 'create'
    | 'edit'
    | 'archive'
    | 'unarchive'
    | 'delete';

export interface ActivityLog {
    id: string;
    projectId: string;
    itemId: string;
    actionType: ActivityActionType;
    delta?: number;
    timestamp: number;
    note?: string;
    itemNameSnapshot?: string; // storing name in case item is deleted
}

export interface AppSettings {
    theme: 'light' | 'dark' | 'system';
    onboardingSeen: boolean;
}
