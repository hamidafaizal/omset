import { useStore } from '../store/useStore';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from 'dayjs';

export default function Dashboard() {
    const { targetBulanan, jadwalHariKerja } = useStore();

    const listOmzet = useLiveQuery(() => db.omzet.toArray()) || [];
    const totalOmzetAktual = listOmzet.reduce((sum, item) => sum + item.nominal, 0);

    // LOGIKA KALENDER CERDAS
    const today = dayjs();
    const daysInMonth = today.daysInMonth();

    let totalHariKerjaBulanIni = 0;
    let hariKerjaBerjalan = 0;

    for (let i = 1; i <= daysInMonth; i++) {
        const date = today.date(i);
        const dayOfWeek = date.day();

        if (jadwalHariKerja.includes(dayOfWeek)) {
            totalHariKerjaBulanIni++;
            if (date.isBefore(today, 'day') || date.isSame(today, 'day')) {
                hariKerjaBerjalan++;
            }
        }
    }

    // PERHITUNGAN TARGET
    const targetHarianDasar = totalHariKerjaBulanIni > 0 ? targetBulanan / totalHariKerjaBulanIni : 0;
    const targetKumulatifSeharusnya = hariKerjaBerjalan * targetHarianDasar;
    const sisaHariKerja = Math.max(0, totalHariKerjaBulanIni - hariKerjaBerjalan);

    const selisih = totalOmzetAktual - targetKumulatifSeharusnya;

    // PERHITUNGAN UNTUK GRAFIK PROGRESS BAR
    const ekspektasiPersen = targetBulanan > 0 ? (targetKumulatifSeharusnya / targetBulanan) * 100 : 0;
    const aktualPersen = targetBulanan > 0 ? (totalOmzetAktual / targetBulanan) * 100 : 0;

    // Membatasi lebar grafik maksimal 100% agar tampilan tidak rusak jika omzet melebihi target
    const displayEkspektasi = Math.min(ekspektasiPersen, 100);
    const displayAktual = Math.min(aktualPersen, 100);

    // PENENTUAN STATUS & WARNA
    let statusText = "On Track";
    let statusColor = "text-yellow-600 bg-yellow-50 border-yellow-200";
    let barColor = "bg-yellow-400"; // Warna bar aktual

    const toleransi = targetKumulatifSeharusnya * 0.05; // ±5%
    if (totalOmzetAktual > targetKumulatifSeharusnya + toleransi) {
        statusText = "Ahead (Melampaui Target Waktu)";
        statusColor = "text-green-700 bg-green-50 border-green-200";
        barColor = "bg-green-500";
    } else if (totalOmzetAktual < targetKumulatifSeharusnya - toleransi) {
        statusText = "Behind (Tertinggal oleh Waktu)";
        statusColor = "text-red-700 bg-red-50 border-red-200";
        barColor = "bg-red-500";
    }

    const sisaTarget = Math.max(0, targetBulanan - totalOmzetAktual);
    const targetHarianBaru = sisaHariKerja > 0 ? sisaTarget / sisaHariKerja : 0;

    return (
        <div className="p-4 max-w-md mx-auto sm:max-w-4xl space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Sales</h1>
                <div className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
                    {today.format('DD MMM YYYY')}
                </div>
            </div>

            {/* Papan Informasi Kalender & Status Utama */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-blue-800 font-medium">Total Hari Kerja: {totalHariKerjaBulanIni}</span>
                        <span className="text-sm text-blue-800 font-medium">Hari ke-{hariKerjaBerjalan}</span>
                    </div>
                    <div className="text-xs text-blue-600">Hari libur diabaikan dari perhitungan target</div>
                </div>

                <div className={`p-4 border rounded-xl flex justify-between items-center ${statusColor}`}>
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Status Performa Saat Ini</div>
                        <div className="text-lg font-bold mt-1">{statusText}</div>
                    </div>
                </div>
            </div>

            {/* --- SMART PROGRESS BAR (BULLET CHART) --- */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="pb-4 bg-slate-50 border-b border-slate-100">
                    <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                        Visualisasi Progres Real-Time
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-8">

                    {/* Label Informasi Grafik */}
                    <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                        <span>0%</span>
                        <span>Ekspektasi: {ekspektasiPersen.toFixed(1)}%</span>
                        <span>100% Target</span>
                    </div>

                    {/* Lintasan Bar */}
                    <div className="relative w-full h-8 bg-slate-200 rounded-lg overflow-hidden shadow-inner">

                        {/* Isian Bar (Omzet Aktual) */}
                        <div
                            className={`absolute top-0 left-0 h-full ${barColor} transition-all duration-700 ease-in-out`}
                            style={{ width: `${displayAktual}%` }}
                        >
                            {/* Teks persentase di dalam bar */}
                            {displayAktual > 5 && (
                                <div className="absolute right-2 top-0 h-full flex items-center text-white text-xs font-bold shadow-sm">
                                    {aktualPersen.toFixed(1)}%
                                </div>
                            )}
                        </div>

                        {/* Garis Pembatas (Ekspektasi/Waktu Berjalan) */}
                        <div
                            className="absolute top-0 h-full w-1 bg-slate-800 shadow-[0_0_8px_rgba(0,0,0,0.8)] z-10"
                            style={{ left: `${displayEkspektasi}%` }}
                            title={`Target seharusnya: Rp ${targetKumulatifSeharusnya.toLocaleString('id-ID')}`}
                        >
                            {/* Segitiga panah kecil di atas garis */}
                            <div className="absolute -top-2 -left-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-800"></div>
                        </div>

                    </div>

                    <div className="mt-4 flex gap-4 text-xs justify-center text-slate-500">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-800 rounded-sm"></div> Garis Ekspektasi Waktu</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> Aktual Ahead</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Aktual Behind</div>
                    </div>
                </CardContent>
            </Card>

            {/* Grid Informasi Detail (Angka Rupiah) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Omzet Aktual</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-slate-800">
                            Rp {totalOmzetAktual.toLocaleString('id-ID')}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Target Total: Rp {targetBulanan.toLocaleString('id-ID')}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Ekspektasi Waktu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-slate-700">
                            Rp {targetKumulatifSeharusnya.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                        </div>
                        <p className={`text-xs font-semibold mt-1 ${selisih >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            Selisih: {selisih >= 0 ? `+Rp ${selisih.toLocaleString('id-ID', { maximumFractionDigits: 0 })}` : `-Rp ${Math.abs(selisih).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Target Harian Baru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-purple-600">
                            Rp {targetHarianBaru.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Untuk sisa {sisaHariKerja} hari kerja</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}