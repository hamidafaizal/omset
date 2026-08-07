import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
    targetBulanan: number;
    jadwalHariKerja: number[]; // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
    setTargetBulanan: (target: number) => void;
    toggleHariKerja: (hari: number) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            targetBulanan: 36400000, // Target default
            jadwalHariKerja: [1, 2, 3, 4, 5], // Default: Senin sampai Jumat

            setTargetBulanan: (target) => set({ targetBulanan: target }),

            toggleHariKerja: (hari) => set((state) => {
                const jadwal = state.jadwalHariKerja.includes(hari)
                    ? state.jadwalHariKerja.filter((h) => h !== hari)
                    : [...state.jadwalHariKerja, hari];
                return { jadwalHariKerja: jadwal };
            }),
        }),
        {
            name: 'sales-tracker-storage', // Nama file brankas di dalam Local Storage browser
        }
    )
);