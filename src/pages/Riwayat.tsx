import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Riwayat() {
    // Mengambil data omzet secara reaktif dari database lokal
    const listOmzet = useLiveQuery(() => db.omzet.orderBy('tanggal').reverse().toArray()) || [];

    // Fungsi untuk menghapus data berdasarkan ID
    const handleHapus = async (id?: number) => {
        if (!id) return;
        if (confirm('Yakin ingin menghapus data omzet ini?')) {
            await db.omzet.delete(id);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto sm:max-w-3xl">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Riwayat Omzet</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Daftar Transaksi Masuk</CardTitle>
                </CardHeader>
                <CardContent>
                    {listOmzet.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Belum ada data omzet yang dimasukkan.</p>
                    ) : (
                        <div className="space-y-3">
                            {listOmzet.map((item) => (
                                <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-lg">
                                    <div>
                                        <div className="font-bold text-slate-800">Rp {item.nominal.toLocaleString('id-ID')}</div>
                                        <div className="text-xs text-slate-500">{item.tanggal} {item.catatan ? `• ${item.catatan}` : ''}</div>
                                    </div>
                                    <Button variant="destructive" size="sm" onClick={() => handleHapus(item.id)}>
                                        Hapus
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}