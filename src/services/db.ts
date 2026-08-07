import Dexie, { type Table } from 'dexie';
import type { Omzet } from '../types';

export class SalesDatabase extends Dexie {
    omzet!: Table<Omzet>;

    constructor() {
        super('SalesTrackerDB');
        this.version(1).stores({
            omzet: '++id, tanggal, nominal'
        });
    }
}

export const db = new SalesDatabase();