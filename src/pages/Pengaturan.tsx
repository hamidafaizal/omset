import { useState } from 'react';
import { useStore } from '../store/useStore';
import { db } from '../services/db';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const daftarHari = [
    { id: 1, nama: 'Sen' },
    { id: 2, nama: 'Sel' },
    { id: 3, nama: 'Rab' },
    { id: 4, nama: 'Kam' },
    { id: 5, nama: 'Jum' },
    { id: 6, nama: 'Sab' },
    { id: 0, nama: 'Min' },
];

export default function Pengaturan() {
    const { targetBulanan, jadwalHariKerja, setTargetBulanan, toggleHariKerja } = useStore();
    const [inputTarget, setInputTarget] = useState(targetBulanan.toString());

    const handleSimpanPengaturan = (e: React.FormEvent) => {
        e.preventDefault();
        setTargetBulanan(Number(inputTarget));
        alert('Target bulanan berhasil diperbarui!');
    };

    const handleResetData = async () => {
        if (confirm('PERINGATAN: Semua riwayat omzet akan dihapus permanen! Lanjutkan?')) {
            await db.omzet.clear();
            alert('Seluruh data omzet berhasil di-reset.');
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto sm:max-w-3xl space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Pengaturan Target & Sistem</h1>

            {/* Pengaturan Target */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Target Bulanan</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSimpanPengaturan} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="target">Nominal Target (Rp)</Label>
                            <Input
                                id="target"
                                type="number"
                                value={inputTarget}
                                onChange={(e) => setInputTarget(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">Simpan Target</Button>
                    </form>
                </CardContent>
            </Card>

            {/* Pengaturan Jadwal Hari Kerja */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Jadwal Hari Kerja</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">
                        Pilih hari operasionalmu. Sistem tidak akan menambah target kumulatif di hari yang tidak dipilih.
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {daftarHari.map((hari) => {
                            const aktif = jadwalHariKerja.includes(hari.id);
                            return (
                                <Button
                                    key={hari.id}
                                    type="button"
                                    variant={aktif ? "default" : "outline"}
                                    onClick={() => toggleHariKerja(hari.id)}
                                    className="flex-1 min-w-[60px]"
                                >
                                    {hari.nama}
                                </Button>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Zona Reset Data */}
            <Card className="border-red-200">
                <CardHeader>
                    <CardTitle className="text-lg text-red-600">Zona Reset Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" className="w-full" onClick={handleResetData}>
                        Reset Semua Data Omzet
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}