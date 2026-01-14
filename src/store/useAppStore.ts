import { create } from 'zustand';
import { Project, List, Item, ActivityLog, AppSettings, ActivityActionType } from '../data/models';
import { SEED_PROJECT, SEED_LISTS, SEED_ITEMS, SEED_LOGS } from '../data/mock';
import { generateId } from '../shared/utils/id';

interface AppState {
    // Data
    project: Project;
    lists: List[];
    items: Item[];
    logs: ActivityLog[];

    settings: AppSettings;
    isAuthenticated: boolean; // [NEW] Auth state

    // Actions
    // Lists
    createList: (name: string) => void;
    deleteList: (id: string) => void;
    // Items
    addItem: (listId: string, name: string, targetQty?: number, notes?: string, unit?: string, currentQty?: number) => void;
    updateItem: (id: string, updates: Partial<Item>) => void;
    deleteItem: (id: string) => void;
    incrementItem: (id: string) => void;
    decrementItem: (id: string) => void;
    setItemQty: (id: string, qty: number) => void;
    resetItemQty: (id: string) => void;
    completeItem: (id: string) => void;
    archiveItem: (id: string) => void;
    unarchiveItem: (id: string) => void;
    bulkAddItems: (listId: string, names: string[]) => void;

    // Settings
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    setOnboardingSeen: (seen: boolean) => void;

    resetSeedData: () => void;

    // Auth
    login: () => void;
    logout: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    project: SEED_PROJECT,
    lists: SEED_LISTS,
    items: SEED_ITEMS,
    logs: SEED_LOGS,
    settings: {
        theme: 'system',

        onboardingSeen: false,
    },
    isAuthenticated: false, // [NEW] Initial auth state

    createList: (name) => {
        set((state) => ({
            lists: [
                ...state.lists,
                {
                    id: generateId(),
                    projectId: state.project.id,
                    name: name.trim(),
                    createdAt: Date.now(),
                },
            ],
        }));
    },

    deleteList: (id) => {
        set((state) => {
            // Delete list and all items in it
            const itemsToDelete = state.items.filter((i) => i.listId === id);
            const itemIds = itemsToDelete.map((i) => i.id);

            return {
                lists: state.lists.filter((l) => l.id !== id),
                items: state.items.filter((i) => i.listId !== id),
                // related logs could be kept or deleted, keeping for history usually better but maybe mark as orphaned?
                // For simplicity, we keep logs.
            };
        });
    },

    addItem: (listId, name, targetQty = 1, notes = '', unit = '', currentQty = 0) => {
        const newItem: Item = {
            id: generateId(),
            projectId: get().project.id,
            name: name.trim(),
            listId,
            notes,
            unit,
            targetQty,
            currentQty,
            isArchived: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        const newLog: ActivityLog = {
            id: generateId(),
            projectId: get().project.id,
            itemId: newItem.id,
            actionType: 'create',
            timestamp: Date.now(),
            itemNameSnapshot: newItem.name,
        };

        set((state) => ({
            items: [newItem, ...state.items],
            logs: [newLog, ...state.logs],
        }));
    },

    updateItem: (id, updates) => {
        set((state) => {
            const item = state.items.find((i) => i.id === id);
            if (!item) return state;

            const updatedItem = { ...item, ...updates, updatedAt: Date.now() };

            const newLog: ActivityLog = {
                id: generateId(),
                projectId: state.project.id,
                itemId: id,
                actionType: 'edit',
                timestamp: Date.now(),
                itemNameSnapshot: updatedItem.name,
            };

            return {
                items: state.items.map((i) => (i.id === id ? updatedItem : i)),
                logs: [newLog, ...state.logs],
            };
        });
    },

    deleteItem: (id) => {
        set((state) => {
            const item = state.items.find((i) => i.id === id);
            const log: ActivityLog = {
                id: generateId(),
                projectId: state.project.id,
                itemId: id,
                actionType: 'delete',
                timestamp: Date.now(),
                itemNameSnapshot: item?.name,
            };

            return {
                items: state.items.filter((i) => i.id !== id),
                logs: [log, ...state.logs],
            };
        });
    },

    incrementItem: (id) => {
        set((state) => {
            const item = state.items.find((i) => i.id === id);
            if (!item) return state;
            const newQty = item.currentQty + 1;

            const log: ActivityLog = {
                id: generateId(),
                projectId: state.project.id,
                itemId: id,
                actionType: 'increment',
                delta: 1,
                timestamp: Date.now(),
                itemNameSnapshot: item.name,
            };

            return {
                items: state.items.map((i) => (i.id === id ? { ...i, currentQty: newQty, updatedAt: Date.now() } : i)),
                logs: [log, ...state.logs],
            };
        });
    },

    decrementItem: (id) => {
        set((state) => {
            const item = state.items.find((i) => i.id === id);
            if (!item || item.currentQty === 0) return state;
            const newQty = Math.max(0, item.currentQty - 1);

            const log: ActivityLog = {
                id: generateId(),
                projectId: state.project.id,
                itemId: id,
                actionType: 'decrement',
                delta: -1,
                timestamp: Date.now(),
                itemNameSnapshot: item.name,
            };

            return {
                items: state.items.map((i) => (i.id === id ? { ...i, currentQty: newQty, updatedAt: Date.now() } : i)),
                logs: [log, ...state.logs],
            };
        });
    },

    setItemQty: (id, qty) => {
        set((state) => {
            const item = state.items.find((i) => i.id === id);
            if (!item) return state;

            const log: ActivityLog = {
                id: generateId(),
                projectId: state.project.id,
                itemId: id,
                actionType: 'set',
                delta: qty - item.currentQty,
                timestamp: Date.now(),
                itemNameSnapshot: item.name,
            };

            return {
                items: state.items.map((i) => (i.id === id ? { ...i, currentQty: qty, updatedAt: Date.now() } : i)),
                logs: [log, ...state.logs],
            };
        });
    },

    resetItemQty: (id) => {
        set((state) => {
            const item = state.items.find((i) => i.id === id);
            if (!item) return state;

            const log: ActivityLog = {
                id: generateId(),
                projectId: state.project.id,
                itemId: id,
                actionType: 'reset',
                delta: -item.currentQty,
                timestamp: Date.now(),
                itemNameSnapshot: item.name,
            };

            return {
                items: state.items.map((i) => (i.id === id ? { ...i, currentQty: 0, updatedAt: Date.now() } : i)),
                logs: [log, ...state.logs],
            };
        });
    },

    completeItem: (id) => {
        set((state) => {
            const item = state.items.find((i) => i.id === id);
            if (!item) return state;

            const log: ActivityLog = {
                id: generateId(),
                projectId: state.project.id,
                itemId: id,
                actionType: 'complete',
                delta: item.targetQty - item.currentQty,
                timestamp: Date.now(),
                itemNameSnapshot: item.name,
            };

            return {
                items: state.items.map((i) => (i.id === id ? { ...i, currentQty: i.targetQty, updatedAt: Date.now() } : i)),
                logs: [log, ...state.logs],
            };
        });
    },

    archiveItem: (id) => {
        set((state) => {
            const item = state.items.find((i) => i.id === id);
            const log: ActivityLog = {
                id: generateId(),
                projectId: state.project.id,
                itemId: id,
                actionType: 'archive',
                timestamp: Date.now(),
                itemNameSnapshot: item?.name,
            };
            return {
                items: state.items.map((i) => (i.id === id ? { ...i, isArchived: true, updatedAt: Date.now() } : i)),
                logs: [log, ...state.logs],
            };
        });
    },

    unarchiveItem: (id) => {
        set((state) => {
            const item = state.items.find((i) => i.id === id);
            const log: ActivityLog = {
                id: generateId(),
                projectId: state.project.id,
                itemId: id,
                actionType: 'unarchive',
                timestamp: Date.now(),
                itemNameSnapshot: item?.name,
            };
            return {
                items: state.items.map((i) => (i.id === id ? { ...i, isArchived: false, updatedAt: Date.now() } : i)),
                logs: [log, ...state.logs],
            };
        });
    },

    bulkAddItems: (listId, names) => {
        set((state) => {
            const newItems: Item[] = names.map((name) => ({
                id: generateId(),
                projectId: state.project.id,
                name: name.trim(),
                listId,
                targetQty: 1,
                currentQty: 0,
                isArchived: false,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            }));

            const newLogs: ActivityLog[] = newItems.map((item) => ({
                id: generateId(),
                projectId: state.project.id,
                itemId: item.id,
                actionType: 'create',
                timestamp: Date.now(),
                itemNameSnapshot: item.name,
            }));

            return {
                items: [...newItems, ...state.items],
                logs: [...newLogs, ...state.logs],
            };
        });
    },

    setTheme: (theme) => {
        set((state) => ({
            settings: { ...state.settings, theme },
        }));
    },

    setOnboardingSeen: (seen) => {
        set((state) => ({
            settings: { ...state.settings, onboardingSeen: seen },
        }));
    },

    resetSeedData: () => {
        set({
            project: SEED_PROJECT,
            lists: SEED_LISTS,
            items: SEED_ITEMS,
            logs: SEED_LOGS,
            settings: { theme: 'system', onboardingSeen: false },
        });
    },

    login: () => {
        set({ isAuthenticated: true });
    },

    logout: () => {
        set({ isAuthenticated: false });
    },
}));
