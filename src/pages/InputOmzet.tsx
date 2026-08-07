import { useState } from 'react';
import { db } from '../services/db';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function InputOmzet() {
    // Menyiapkan state (penampung data sementara) untuk form
    const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
    const [nominal, setNominal] = useState('');
    const [catatan, setCatatan] = useState('');

    // Fungsi yang dijalankan saat tombol simpan diklik
    const handleSimpan = async (e: React.FormEvent) => {
        e.preventDefault(); // Mencegah halaman refresh

        if (!nominal) return alert('Nominal omzet harus diisi!');

        try {
            // Menyimpan data ke database lokal (Dexie)
            await db.omzet.add({
                tanggal: tanggal,
                nominal: Number(nominal), // Mengubah teks menjadi angka
                catatan: catatan
            });

            alert('Data omzet berhasil disimpan!');

            // Mengosongkan form setelah berhasil disimpan
            setNominal('');
            setCatatan('');
        } catch (error) {
            alert('Gagal menyimpan data');
            console.error(error);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto sm:max-w-3xl">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Input Omzet Harian</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Catat Penjualan</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSimpan} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="tanggal">Tanggal</Label>
                            <Input
                                id="tanggal"
                                type="date"
                                value={tanggal}
                                onChange={(e) => setTanggal(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nominal">Nominal Omzet (Rp)</Label>
                            <Input
                                id="nominal"
                                type="number"
                                placeholder="Contoh: 1500000"
                                value={nominal}
                                onChange={(e) => setNominal(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="catatan">Catatan (Opsional)</Label>
                            <Input
                                id="catatan"
                                type="text"
                                placeholder="Contoh: Closing dari Klien A"
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Simpan Omzet
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}