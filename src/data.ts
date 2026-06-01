import { Transaction } from "./types";

const rawData = [
  { date: "01/04/2026", month: "April", category: "Tagihan", description: "Motor (Nyampuran)", income: 0, expense: 450000, balance: -450000 },
  { date: "01/04/2026", month: "April", category: "Wifi", description: "Bayar Wifi", income: 0, expense: 100000, balance: -550000 },
  { date: "01/04/2026", month: "April", category: "Bensin", description: "SPBU deket rumah", income: 0, expense: 200000, balance: -570000 }, // Typo in user data 20rb or 200rb? User input says 20.000,00 but balances suggest 20.000 (total -570k). Wait. 450+100+20 = 570. Okay.
  { date: "03/04/2026", month: "April", category: "Barang - Barang", description: "Shampo Motor", income: 0, expense: 44199, balance: -614199 },
  { date: "03/04/2026", month: "April", category: "Barang - Barang", description: "Lap Microfiber Motor beli 2", income: 0, expense: 60582, balance: -674781 },
  { date: "03/04/2026", month: "April", category: "Barang - Barang", description: "Antigores Speedometer", income: 0, expense: 13453, balance: -688234 },
  { date: "04/04/2026", month: "April", category: "Bensin", description: "Gatau SPBU mana", income: 0, expense: 20000, balance: -708234 },
  { date: "05/04/2026", month: "April", category: "Makan", description: "Solaria", income: 0, expense: 157000, balance: -865234 },
  { date: "07/04/2026", month: "April", category: "Gaji", description: "Project", income: 598000, expense: 0, balance: -267234 },
  { date: "07/04/2026", month: "April", category: "Bensin", description: "SPBU deket rumah", income: 0, expense: 50000, balance: -317234 },
  { date: "07/04/2026", month: "April", category: "Kuota", description: "Kuota Azbi", income: 0, expense: 15000, balance: -332234 },
  { date: "07/04/2026", month: "April", category: "TopUp", description: "Dana - Ikhsan Kamal", income: 0, expense: 50000, balance: -382234 },
  { date: "08/04/2026", month: "April", category: "Tagihan", description: "Spinjam 2", income: 0, expense: 62000, balance: -444234 },
  { date: "09/04/2026", month: "April", category: "Makan", description: "Dimsum Bos", income: 0, expense: 66000, balance: -510234 },
  { date: "09/04/2026", month: "April", category: "Makan", description: "Tekun", income: 0, expense: 45000, balance: -555234 },
  { date: "09/04/2026", month: "April", category: "Nabung Married", description: "Nabung Maried - 1", income: 0, expense: 200000, balance: -755234 },
  { date: "10/04/2026", month: "April", category: "Bensin", description: "Gatau SPBU mana", income: 0, expense: 20000, balance: -775234 },
  { date: "11/04/2026", month: "April", category: "Makan", description: "Kebab Pisang Anu AA", income: 0, expense: 54000, balance: -829234 },
  { date: "12/04/2026", month: "April", category: "Makan", description: "Solaria", income: 0, expense: 117000, balance: -946234 },
  { date: "13/04/2026", month: "April", category: "Bensin", description: "SPBU deket rumah", income: 0, expense: 20000, balance: -966234 },
  { date: "14/04/2026", month: "April", category: "Gaji", description: "Project", income: 1426000, expense: 0, balance: 459766 },
  { date: "14/04/2026", month: "April", category: "Bensin", description: "SPBU deket rumah", income: 0, expense: 50000, balance: 409766 },
  { date: "15/04/2026", month: "April", category: "Makan", description: "Jajan ( Lupa jajan apa )", income: 0, expense: 43000, balance: 366766 },
  { date: "16/04/2026", month: "April", category: "Makan", description: "Dimsum Bos", income: 0, expense: 59400, balance: 307366 },
  { date: "17/04/2026", month: "April", category: "Bensin", description: "Gatau SPBU mana", income: 0, expense: 20000, balance: 287366 },
  { date: "17/04/2026", month: "April", category: "Makan", description: "JCO Donuts", income: 0, expense: 126000, balance: 161366 },
  { date: "17/04/2026", month: "April", category: "Kembalian", description: "Ngambil 200 rb, ini angsulan dari JCO", income: 0, expense: 74000, balance: 87366 },
  { date: "18/04/2026", month: "April", category: "Tagihan", description: "Spinjam 2", income: 0, expense: 62000, balance: 25366 },
  { date: "18/04/2026", month: "April", category: "Lainnya", description: "Ngasih ke Sodara Mamah", income: 0, expense: 50000, balance: -24634 },
  { date: "18/04/2026", month: "April", category: "Belanja", description: "Asia belanja Kopi", income: 0, expense: 106100, balance: -130734 },
  { date: "18/04/2026", month: "April", category: "Kuota", description: "Kuota MyLop", income: 0, expense: 50000, balance: -180734 },
  { date: "19/04/2026", month: "April", category: "Makan", description: "Alfamart", income: 0, expense: 40700, balance: -221434 },
  { date: "19/04/2026", month: "April", category: "Makan", description: "Dapur Dimsum", income: 0, expense: 25000, balance: -246434 },
  { date: "19/04/2026", month: "April", category: "Bensin", description: "SPBU deket rumah", income: 0, expense: 20000, balance: -266434 },
  { date: "21/04/2026", month: "April", category: "Gaji", description: "Project", income: 2300000, expense: 0, balance: 2033566 },
  { date: "21/04/2026", month: "April", category: "Bensin", description: "SPBU deket rumah", income: 0, expense: 50000, balance: 1983566 },
  { date: "22/04/2026", month: "April", category: "Nabung Married", description: "Nabung Maried - 2", income: 0, expense: 400000, balance: 1583566 },
  { date: "22/04/2026", month: "April", category: "Orang Tua", description: "Ngasi ke Mamah ", income: 0, expense: 100000, balance: 1483566 },
  { date: "22/04/2026", month: "April", category: "Keluarga", description: "Ngasi si Azbi", income: 0, expense: 100000, balance: 1383566 },
  { date: "22/04/2026", month: "April", category: "Keluarga", description: "Ngasi Nenek (gatau kapan tapi bulan ini)", income: 0, expense: 50000, balance: 1333566 },
  { date: "23/04/2026", month: "April", category: "Makan", description: "Nangkring Seblak", income: 0, expense: 55700, balance: 1277866 },
  { date: "24/04/2026", month: "April", category: "Tagihan", description: "SPaylater ( Hp sendiri, Hp Ayah, Kuota )", income: 0, expense: 767899, balance: 509967 },
  { date: "25/04/2026", month: "April", category: "Lainnya", description: "Uang Hp dari Ayah", income: 289000, expense: 0, balance: 798967 },
  { date: "25/04/2026", month: "April", category: "Bensin", description: "SPBU deket rumah", income: 0, expense: 50000, balance: 748967 },
  { date: "25/04/2026", month: "April", category: "Tarik Uang", description: "BCA Wanaraja", income: 0, expense: 150000, balance: 598967 },
  { date: "25/04/2026", month: "April", category: "Tagihan", description: "Tiktok Shop", income: 0, expense: 78000, balance: 520967 },
  { date: "25/04/2026", month: "April", category: "Makan", description: "Alfamart Bayongbong", income: 0, expense: 99500, balance: 421467 },
  { date: "27/04/2026", month: "April", category: "Makan", description: "Warung Steak", income: 0, expense: 54000, balance: 367467 },
  { date: "28/04/2026", month: "April", category: "Tagihan", description: "Spinjam 3", income: 0, expense: 186500, balance: 180967 },
  { date: "28/04/2026", month: "April", category: "Bensin", description: "SPBU deket rumah", income: 0, expense: 30000, balance: 150967 },
  { date: "29/04/2026", month: "April", category: "Belanja", description: "Daster 2", income: 0, expense: 100000, balance: 50967 },
  { date: "04/05/2026", month: "Mei", category: "Makan", description: "Ciscuit 2", income: 0, expense: 80000, balance: -29033 },
  { date: "05/05/2026", month: "Mei", category: "Bensin", description: "SPBU ", income: 0, expense: 30000, balance: -59033 },
  { date: "06/05/2026", month: "Mei", category: "Bensin", description: "SPBU", income: 0, expense: 20000, balance: -79033 },
  { date: "10/05/2026", month: "Mei", category: "Makan", description: "Rotibakar + Angkringan", income: 0, expense: 73000, balance: -152033 },
  { date: "10/05/2026", month: "Mei", category: "Bensin", description: "SPBU Garut", income: 0, expense: 40000, balance: -192033 },
  { date: "13/05/2026", month: "Mei", category: "Makan", description: "Seblak + Alfa", income: 0, expense: 82000, balance: -274033 },
  { date: "13/05/2026", month: "Mei", category: "Bensin", description: "SPBU Deket SMEA", income: 0, expense: 20000, balance: -294033 },
].map((item, index) => ({
  ...item,
  id: `tx-${index}`
}));

export const transactions: Transaction[] = rawData;

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export const getCategoryData = (data: Transaction[]) => {
  const categories: Record<string, number> = {};
  data.forEach((item) => {
    if (item.expense > 0) {
      categories[item.category] = (categories[item.category] || 0) + item.expense;
    }
  });
  return Object.entries(categories)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const getTrendData = (data: Transaction[]) => {
  // Aggregate by date
  const trend: Record<string, { income: number; expense: number; balance: number }> = {};
  data.forEach((item) => {
    if (!trend[item.date]) {
      trend[item.date] = { income: 0, expense: 0, balance: item.balance };
    }
    trend[item.date].income += item.income;
    trend[item.date].expense += item.expense;
    trend[item.date].balance = item.balance; // Use the balance from the last transaction of the day
  });

  return Object.entries(trend).map(([date, values]) => ({
    date,
    ...values,
  }));
};
