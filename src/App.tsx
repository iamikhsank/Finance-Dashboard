import React, { useState, useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  Legend
} from "recharts";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieChartIcon, 
  History, 
  Search, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Code2,
  CalendarDays,
  CreditCard,
  ChevronRight,
  ChevronDown,
  LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { transactions, formatCurrency, getCategoryData, getTrendData } from "./data";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "transactions" | "gas-integration">("dashboard");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        acc.income += curr.income;
        acc.expense += curr.expense;
        acc.balance = curr.balance; // Final balance
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;
      return matchesSearch && matchesCategory;
    }).reverse();
  }, [searchTerm, categoryFilter]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(transactions.map(t => t.category)))], []);
  const categoryData = useMemo(() => getCategoryData(transactions), []);
  const trendData = useMemo(() => getTrendData(transactions), []);

  const appsScriptCode = `/**
 * Google Apps Script for Financial Dashboard
 * Paste this into Extensions > Apps Script in your Google Sheet
 */

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Finance Menu')
      .addItem('Format Header', 'formatHeader')
      .addItem('Calculate Monthly Summary', 'summarizeMonth')
      .addToUi();
}

function formatHeader() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getRange("A1:G1");
  range.setFontWeight("bold")
       .setBackground("#3b82f6")
       .setFontColor("white")
       .setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
}

function summarizeMonth() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var income = 0;
  var expense = 0;
  
  // Mulai dari baris 5 (indeks 4) karena baris 4 adalah header
  for (var i = 4; i < data.length; i++) {
    income += Number(data[i][4]) || 0;
    expense += Number(data[i][5]) || 0;
  }
  
  SpreadsheetApp.getUi().alert(
    "Ringkasan Keuangan:\\n" +
    "Total Pemasukan: " + income.toLocaleString('id-ID', {style: 'currency', currency: 'IDR'}) + "\\n" +
    "Total Pengeluaran: " + expense.toLocaleString('id-ID', {style: 'currency', currency: 'IDR'}) + "\\n" +
    "Saldo Akhir: " + (income - expense).toLocaleString('id-ID', {style: 'currency', currency: 'IDR'})
  );
}`;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-neutral-200 bg-white p-6 lg:block">
        <div className="mb-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Wallet size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">FinanceFlow</span>
        </div>

        <nav className="space-y-1">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === "dashboard"} 
            onClick={() => setActiveTab("dashboard")} 
          />
          <NavItem 
            icon={<History size={20} />} 
            label="Transaksi" 
            active={activeTab === "transactions"} 
            onClick={() => setActiveTab("transactions")} 
          />
          <NavItem 
            icon={<Code2 size={20} />} 
            label="GAS Integration" 
            active={activeTab === "gas-integration"} 
            onClick={() => setActiveTab("gas-integration")} 
          />
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="rounded-xl bg-neutral-900 p-4 text-white">
            <p className="text-sm font-medium opacity-80 text-center">Status Keuangan</p>
            <p className="mt-1 text-center text-lg font-bold">
              {totals.balance < 0 ? "Defisit" : "Surplus"}
            </p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-neutral-800">
              <div 
                className={cn("h-full rounded-full", totals.balance < 0 ? "bg-red-500" : "bg-green-500")}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Laporan Keuangan</h1>
            <p className="text-neutral-500">Ringkasan mutasi rekening periode April - Mei 2026</p>
          </div>
          
          <div className="flex items-center gap-2 rounded-lg bg-white p-1 shadow-sm border border-neutral-200 lg:hidden">
             <button 
              onClick={() => setActiveTab("dashboard")}
              className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors", activeTab === "dashboard" ? "bg-blue-600 text-white" : "text-neutral-600")}
             >
                Dashboard
             </button>
             <button 
              onClick={() => setActiveTab("transactions")}
              className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors", activeTab === "transactions" ? "bg-blue-600 text-white" : "text-neutral-600")}
             >
                Transaksi
             </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard 
                  title="Saldo Akhir" 
                  value={formatCurrency(totals.balance)} 
                  icon={<Wallet className="text-blue-600" />}
                  trend={totals.balance > 0 ? "up" : "down"}
                />
                <StatCard 
                  title="Pemasukan" 
                  value={formatCurrency(totals.income)} 
                  icon={<TrendingUp className="text-green-600" />}
                  subtitle="Total bulan ini"
                />
                <StatCard 
                  title="Pengeluaran" 
                  value={formatCurrency(totals.expense)} 
                  icon={<TrendingDown className="text-red-600" />}
                  subtitle="Total bulan ini"
                />
              </div>

              {/* Charts Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card title="Tren Saldo Harian">
                  <div className="h-[300px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                          tickFormatter={(val) => val.split('/')[0]}
                        />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                          formatter={(value: number) => [formatCurrency(value), "Saldo"]}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="balance" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorBalance)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card title="Pengeluaran per Kategori">
                  <div className="flex flex-col items-center sm:flex-row">
                    <div className="h-[300px] w-full sm:w-1/2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid w-full grid-cols-2 gap-2 sm:mt-0 sm:w-1/2">
                      {categoryData.slice(0, 6).map((cat, index) => (
                        <div key={cat.name} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span className="text-xs font-medium text-neutral-600 truncate">{cat.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent Activity Mini-Table */}
              <Card title="Transaksi Terakhir" className="overflow-hidden">
                <div className="divide-y divide-neutral-100">
                  {transactions.slice(-5).reverse().map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-4 transition-colors hover:bg-neutral-50 px-2 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          tx.income > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        )}>
                          {tx.income > 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{tx.description}</p>
                          <p className="text-xs text-neutral-500">{tx.date} • {tx.category}</p>
                        </div>
                      </div>
                      <p className={cn(
                        "text-sm font-bold",
                        tx.income > 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {tx.income > 0 ? "+" : "-"}{formatCurrency(tx.income || tx.expense)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === "transactions" && (
            <motion.div 
              key="transactions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Cari transaksi atau kategori..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-neutral-500" />
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="rounded-xl border border-neutral-200 bg-white py-2 pl-3 pr-8 text-sm focus:outline-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50/50">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Tanggal</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Keterangan</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Kategori</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500 text-right">Pemasukan</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500 text-right">Pengeluaran</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500 text-right">Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="group hover:bg-neutral-50 transition-colors">
                        <td className="whitespace-nowrap px-6 py-4 text-sm tabular-nums text-neutral-500">{tx.date}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium">{tx.description}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                            {tx.category}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-right font-medium text-green-600">
                          {tx.income > 0 ? formatCurrency(tx.income) : "-"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-right font-medium text-red-600">
                          {tx.expense > 0 ? formatCurrency(tx.expense) : "-"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-right font-bold tabular-nums">
                          {formatCurrency(tx.balance)}
                        </td>
                      </tr>
                    ))}
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-neutral-500">
                          Tidak ada transaksi yang ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "gas-integration" && (
            <motion.div 
              key="gas-integration"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid gap-6 lg:grid-cols-2">
                <Card title="1. Server Side (Code.gs)">
                  <p className="mb-3 text-sm text-neutral-500">Copy kode ini ke Editor Apps Script Anda untuk mengambil data dari Google Sheets.</p>
                  <pre className="h-96 overflow-y-auto rounded-xl bg-neutral-900 p-4 text-[10px] sm:text-xs text-neutral-300 font-mono">
{`function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Dashboard Finance')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getSheetData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Data'); // Pastikan nama sheet adalah 'Data'
  const data = sheet.getDataRange().getValues();
  
  // Baris 4 adalah header (indeks 3), Data mulai baris 5 (indeks 4)
  const rows = data.slice(4); 
  
  return rows.map((row, index) => {
    return {
      date: row[0],
      month: row[1],
      category: row[2],
      description: row[3],
      income: Number(row[4]) || 0,
      expense: Number(row[5]) || 0,
      balance: Number(row[6]) || 0,
      id: 'tx-' + index
    };
  });
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}`}
                  </pre>
                </Card>

                <Card title="2. Client Side (index.html)">
                  <p className="mb-3 text-sm text-neutral-500">Buat file HTML baru di Apps Script dengan nama "index" (tanpa .html).</p>
                  <pre className="h-96 overflow-y-auto rounded-xl bg-neutral-900 p-4 text-[10px] sm:text-xs text-neutral-300 font-mono">
{`<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
      .loading { opacity: 0.5; pointer-events: none; }
    </style>
  </head>
  <body class="bg-gray-50 p-4">
    <div id="content" class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Finance Dashboard</h1>
        <button onclick="loadData()" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Refresh</button>
      </div>
      
      <!-- Stats Summary -->
      <div id="stats" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p class="text-gray-500 text-sm">Total Pemasukan</p>
          <h2 id="totalIncome" class="text-xl font-bold text-green-600">Rp0</h2>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p class="text-gray-500 text-sm">Total Pengeluaran</p>
          <h2 id="totalExpense" class="text-xl font-bold text-red-600">Rp0</h2>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p class="text-gray-500 text-sm">Saldo Saat Ini</p>
          <h2 id="currentBalance" class="text-xl font-bold">Rp0</h2>
        </div>
      </div>

      <!-- Transaction Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-xs font-bold uppercase text-gray-500">Tanggal</th>
              <th class="px-4 py-3 text-xs font-bold uppercase text-gray-500">Keterangan</th>
              <th class="px-4 py-3 text-xs font-bold uppercase text-gray-500">Jumlah</th>
            </tr>
          </thead>
          <tbody id="txBody">
            <!-- Data rows here -->
          </tbody>
        </table>
      </div>
    </div>

    <script>
      function loadData() {
        document.body.classList.add('loading');
        google.script.run.withSuccessHandler(onSuccess).getSheetData();
      }

      function onSuccess(data) {
        document.body.classList.remove('loading');
        let income = 0;
        let expense = 0;
        let html = '';

        data.reverse().forEach(tx => {
          income += tx.income;
          expense += tx.expense;
          const amt = tx.income > 0 ? tx.income : tx.expense;
          const color = tx.income > 0 ? 'text-green-600' : 'text-red-600';
          
          html += \`
            <tr class="border-t border-gray-50">
              <td class="px-4 py-3 text-sm text-gray-500">\${tx.date}</td>
              <td class="px-4 py-3 text-sm font-medium">\${tx.description}</td>
              <td class="px-4 py-3 text-sm font-bold \${color}">\${amt.toLocaleString('id-ID')}</td>
            </tr>
          \`;
        });

        document.getElementById('txBody').innerHTML = html;
        document.getElementById('totalIncome').innerText = 'Rp ' + income.toLocaleString('id-ID');
        document.getElementById('totalExpense').innerText = 'Rp ' + expense.toLocaleString('id-ID');
        document.getElementById('currentBalance').innerText = 'Rp ' + (income - expense).toLocaleString('id-ID');
      }

      window.onload = loadData;
    </script>
  </body>
</html>`}
                  </pre>
                </Card>
              </div>

              <Card title="3. Instruksi Pemasangan">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">1</div>
                    <p className="font-bold">Persiapkan Sheet</p>
                    <p className="text-sm text-neutral-600">Pastikan Sheet pertama bernama **"Data"** dan kolom-kolomnya sesuai urutan: Tanggal, Bulan, Kategori, Keterangan, Pemasukan, Pengeluaran, Saldo.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">2</div>
                    <p className="font-bold">Salin Kode</p>
                    <p className="text-sm text-neutral-600">Buka Editor Apps Script, ganti isi **Code.gs** dan buat file **index.html** baru dengan kode yang disediakan di atas.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">3</div>
                    <p className="font-bold">Deploy Web App</p>
                    <p className="text-sm text-neutral-600">Klik **Deploy** {">"} **New Deployment**, pilih type **Web App**, set *Who has access* ke **Anyone**, lalu klik Deploy.</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
        active ? "bg-blue-50 text-blue-600" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({ title, value, icon, trend, subtitle }: { title: string, value: string, icon: React.ReactNode, trend?: "up" | "down", subtitle?: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-50">
          {icon}
        </div>
        {trend && (
          <span className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold",
            trend === "up" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          )}>
            {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend === "up" ? "Safe" : "Warning"}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-neutral-500">{title}</p>
        <h3 className="mt-1 text-2xl font-bold tracking-tight">{value}</h3>
        {subtitle && <p className="mt-1 text-xs text-neutral-400">{subtitle}</p>}
      </div>
    </div>
  );
}

function Card({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm", className)}>
      <h3 className="text-lg font-bold tracking-tight mb-4">{title}</h3>
      {children}
    </div>
  );
}
