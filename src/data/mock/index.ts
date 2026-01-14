import { Project, List, Item, ActivityLog } from '../models';

export const SEED_PROJECT: Project = {
    id: 'default-project',
    title: 'My List',
    description: 'General items tracker',
    createdAt: Date.now(),
};

export const SEED_LISTS: List[] = [
    { id: 'list-1', projectId: 'default-project', name: 'My Day', createdAt: Date.now() },
    { id: 'list-2', projectId: 'default-project', name: 'Groceries', createdAt: Date.now() },
];

export const SEED_ITEMS: Item[] = [
    {
        id: 'item-1',
        projectId: 'default-project',
        name: 'Drink Water',
        listId: 'list-1',
        targetQty: 8,
        currentQty: 3,
        unit: 'cups',
        isArchived: false,
        createdAt: Date.now() - 100000,
        updatedAt: Date.now(),
    },
    {
        id: 'item-2',
        projectId: 'default-project',
        name: 'Read Book Pages',
        listId: 'list-1',
        targetQty: 50,
        currentQty: 50,
        notes: 'Chapter 5',
        isArchived: false,
        createdAt: Date.now() - 200000,
        updatedAt: Date.now(),
    },
    {
        id: 'item-3',
        projectId: 'default-project',
        name: 'Apples',
        listId: 'list-2',
        targetQty: 5,
        currentQty: 0,
        isArchived: false,
        createdAt: Date.now() - 300000,
        updatedAt: Date.now(),
    },
];

export const SEED_LOGS: ActivityLog[] = [
    { id: 'log-1', projectId: 'default-project', itemId: 'item-1', actionType: 'create', timestamp: Date.now() - 100000, itemNameSnapshot: 'Drink Water' },
    { id: 'log-2', projectId: 'default-project', itemId: 'item-1', actionType: 'increment', delta: 3, timestamp: Date.now() - 50000, itemNameSnapshot: 'Drink Water' },
    { id: 'log-3', projectId: 'default-project', itemId: 'item-2', actionType: 'complete', timestamp: Date.now() - 10000, itemNameSnapshot: 'Read Book Pages' },
];
