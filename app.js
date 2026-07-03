/* MUSORICHO WINES & SPIRITS POS — standalone build
   Runs entirely in the browser via in-browser Babel (no build step needed).
   Loaded as a classic <script type="text/babel"> from index.html. */

const { useState, useMemo, useEffect } = React;
const {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} = Recharts;

/* ---------------------------------- local persistence (standalone build only) ---------------------------------- */
function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* storage unavailable (private browsing, quota, etc.) — fail silently */
  }
}

/* ---------------------------------- lightweight icon set (no external icon library needed) ---------------------------------- */
function Icon({ size = 16, color = "currentColor", style, strokeWidth = 2, children, viewBox = "0 0 24 24" }) {
  return (
    <svg width={size} height={size} viewBox={viewBox} fill="none" stroke={color}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {children}
    </svg>
  );
}
const LayoutDashboard = (p) => <Icon {...p}><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></Icon>;
const Wine = (p) => <Icon {...p}><path d="M7 4h10l-1 6a4 4 0 0 1-8 0L7 4Z" /><path d="M12 14v6" /><path d="M9 20h6" /></Icon>;
const ShoppingCart = (p) => <Icon {...p}><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 7H6" /></Icon>;
const Boxes = (p) => <Icon {...p}><path d="M12 3 5 6.5v6.6L12 17l7-3.9V6.5L12 3Z" /><path d="M5 6.5 12 10l7-3.5" /><path d="M12 10v10.5" /></Icon>;
const BarChart3 = (p) => <Icon {...p}><path d="M4 20V10" /><path d="M11 20V4" /><path d="M18 20v-7" /><path d="M2 20h20" /></Icon>;
const Users = (p) => <Icon {...p}><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><circle cx="17.5" cy="9.5" r="2.6" /><path d="M15.5 13.2A5.2 5.2 0 0 1 21.5 19" /></Icon>;
const SettingsIcon = (p) => <Icon {...p}>{[0,45,90,135,180,225,270,315].map(a => { const r1=8.6, r2=10.5, rad=a*Math.PI/180; const x1=12+r1*Math.cos(rad), y1=12+r1*Math.sin(rad), x2=12+r2*Math.cos(rad), y2=12+r2*Math.sin(rad); return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} />; })}<circle cx="12" cy="12" r="4.2" /></Icon>;
const Sun = (p) => <Icon {...p}><circle cx="12" cy="12" r="4.2" />{[0,45,90,135,180,225,270,315].map(a => { const r1=8.3,r2=10.5, rad=a*Math.PI/180; const x1=12+r1*Math.cos(rad), y1=12+r1*Math.sin(rad), x2=12+r2*Math.cos(rad), y2=12+r2*Math.sin(rad); return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} />; })}</Icon>;
const Moon = (p) => <Icon {...p}><path d="M20 14.5a8.5 8.5 0 1 1-9-11.9 7 7 0 0 0 9 11.9Z" /></Icon>;
const Search = (p) => <Icon {...p}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.2" y2="16.2" /></Icon>;
const Plus = (p) => <Icon {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>;
const Minus = (p) => <Icon {...p}><line x1="5" y1="12" x2="19" y2="12" /></Icon>;
const Trash2 = (p) => <Icon {...p}><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /><path d="M10 11v6" /><path d="M14 11v6" /></Icon>;
const X = (p) => <Icon {...p}><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></Icon>;
const Printer = (p) => <Icon {...p}><path d="M6 9V3h12v6" /><rect x="4" y="9" width="16" height="8" rx="1.5" /><path d="M6 14h12v7H6z" /></Icon>;
const LogOut = (p) => <Icon {...p}><path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4" /><path d="M15 8l4 4-4 4" /><path d="M19 12H9" /></Icon>;
const AlertTriangle = (p) => <Icon {...p}><path d="M12 3.5 22 20H2L12 3.5Z" /><line x1="12" y1="9.5" x2="12" y2="14" /><circle cx="12" cy="17" r="0.6" fill={p.color || "currentColor"} /></Icon>;
const TrendingUp = (p) => <Icon {...p}><path d="M3 16l6.5-6.5 4 4L21 6" /><path d="M15 6h6v6" /></Icon>;
const DollarSign = (p) => <Icon {...p}><line x1="12" y1="2" x2="12" y2="22" /><path d="M17 6.5c0-2-2.2-3-5-3s-5 1.2-5 3 2.2 2.6 5 3 5 1.3 5 3.3-2.2 3.2-5 3.2-5-1-5-3" /></Icon>;
const Package = (p) => <Icon {...p}><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" /><path d="M3 8l9 5 9-5" /><path d="M12 13v8" /></Icon>;
const UserCircle2 = (p) => <Icon {...p}><circle cx="12" cy="12" r="9.5" /><circle cx="12" cy="10" r="3" /><path d="M6 19.2a6.2 6.2 0 0 1 12 0" /></Icon>;
const Lock = (p) => <Icon {...p}><rect x="5" y="11" width="14" height="9" rx="1.5" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" /></Icon>;
const Menu = (p) => <Icon {...p}><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></Icon>;
const PanelLeftClose = (p) => <Icon {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><line x1="10" y1="4" x2="10" y2="20" /><path d="M7 10l2 2-2 2" /></Icon>;
const Bluetooth = (p) => <Icon {...p}><path d="M7 7l10 10-5 5V2l5 5L7 17" /></Icon>;




/* ---------------------------------- tokens ---------------------------------- */
const palette = {
  wine: "#5C1A33",
  wineDeep: "#3E1023",
  wineLight: "#8C2F52",
  gold: "#C9A227",
  goldSoft: "#E4C767",
  creamBg: "#F8F4EE",
  creamSurface: "#FFFFFF",
  charcoalBg: "#1C1620",
  charcoalSurface: "#251B2C",
  success: "#3F7D58",
  danger: "#B23A48",
  ink: "#241B2B",
};

const fmtKES = (n) =>
  "KES " + Number(n || 0).toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

/* ---------------------------------- Bluetooth thermal printing (ESC/POS) ---------------------------------- */
// Common service/characteristic UUIDs used by generic BLE thermal printers (P58E and similar clones).
const BT_PRINTER_SERVICES = [
  "000018f0-0000-1000-8000-00805f9b34fb",
  "0000ff00-0000-1000-8000-00805f9b34fb",
  "0000ffe0-0000-1000-8000-00805f9b34fb",
  "49535343-fe7d-4ae5-8fa9-9fafd205e455",
  "e7810a71-73ae-499d-8c15-faa9aef0c3f2",
];

async function connectBluetoothPrinter() {
  if (!navigator.bluetooth) {
    throw new Error("Bluetooth printing needs Chrome on Android (or desktop Chrome). This browser doesn't support it.");
  }
  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: BT_PRINTER_SERVICES,
  });
  const server = await device.gatt.connect();
  const services = await server.getPrimaryServices();
  let writable = null;
  for (const service of services) {
    const chars = await service.getCharacteristics();
    for (const c of chars) {
      if (c.properties.write || c.properties.writeWithoutResponse) { writable = c; break; }
    }
    if (writable) break;
  }
  if (!writable) throw new Error("Connected, but couldn't find a printable channel on this device.");
  return { device, characteristic: writable, name: device.name || "Bluetooth Printer" };
}

async function writeBytesToPrinter(characteristic, bytes) {
  const chunkSize = 20; // conservative BLE MTU for older printer chipsets
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, i + chunkSize);
    if (characteristic.properties.writeWithoutResponse) {
      await characteristic.writeValueWithoutResponse(chunk);
    } else {
      await characteristic.writeValue(chunk);
    }
    await new Promise(r => setTimeout(r, 20));
  }
}

// Build raw ESC/POS bytes for a 58mm printer (32-character line width).
function buildEscPosReceipt(sale, businessInfo) {
  const WIDTH = 32;
  const enc = new TextEncoder();
  const bytes = [];
  const push = (arr) => bytes.push(...arr);
  const text = (s) => push(Array.from(enc.encode(s)));
  const center = (on) => push([0x1B, 0x61, on ? 1 : 0]);
  const bold = (on) => push([0x1B, 0x45, on ? 1 : 0]);
  const line = (s = "") => { text(s); push([0x0A]); };
  const rule = () => line("-".repeat(WIDTH));
  const twoCol = (l, r) => {
    l = String(l); r = String(r);
    const gap = Math.max(1, WIDTH - l.length - r.length);
    line(l + " ".repeat(gap) + r);
  };

  push([0x1B, 0x40]); // init
  center(true); bold(true);
  line(businessInfo.name);
  bold(false);
  line(businessInfo.address);
  line(businessInfo.phone);
  line("PIN: " + businessInfo.pin);
  center(false);
  rule();
  twoCol("Receipt#", sale.id);
  twoCol("Date", `${sale.date} ${sale.time}`);
  twoCol("Cashier", sale.cashier);
  twoCol("Customer", sale.customer);
  rule();
  sale.items.forEach(it => {
    line(it.name.slice(0, WIDTH));
    twoCol(`${it.qty} x ${fmtKES(it.price)}`, fmtKES(it.qty * it.price));
  });
  rule();
  twoCol("Subtotal", fmtKES(sale.subtotal));
  twoCol("Discount", "-" + fmtKES(sale.discountAmt));
  twoCol(`VAT (${sale.vatPct ?? 16}%)`, fmtKES(sale.vat));
  bold(true);
  twoCol("TOTAL", fmtKES(sale.total));
  bold(false);
  twoCol("Paid via", sale.method);
  rule();
  center(true);
  line("Thank You for Shopping With Us");
  line("Drink responsibly");
  center(false);
  push([0x0A, 0x0A, 0x0A, 0x0A]);
  push([0x1D, 0x56, 66, 0]); // partial cut (ignored if unsupported)
  return new Uint8Array(bytes);
}

/* ---------------------------------- starting data (empty — ready for real input) ---------------------------------- */
const initialProducts = [];

const initialCustomers = [
  { id: 1, name: "Walk-in Customer", phone: "-", points: 0, balance: 0, visits: 0 },
];

const initialTransactions = [];

const CATEGORIES = ["All", "Whisky", "Beer", "Spirits", "Wine", "Cider"];
const VAT_RATE = 0.16;

/* ---------------------------------- app ---------------------------------- */
function App() {
  const [dark, setDark] = useState(false);
  const [role, setRole] = useState(null);
  const [cashierName, setCashierName] = useState("");
  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [products, setProducts] = useState(() => loadState("musoricho_products", initialProducts));
  const [customers, setCustomers] = useState(() => loadState("musoricho_customers", initialCustomers));
  const [transactions, setTransactions] = useState(() => loadState("musoricho_transactions", initialTransactions));
  const [sales, setSales] = useState(() => loadState("musoricho_sales", []));
  const [businessInfo, setBusinessInfo] = useState(() => loadState("musoricho_business_info", {
    name: "MUSORICHO WINES & SPIRITS",
    currency: "KES",
    vatRate: 16,
    pin: "P0512345678X",
    phone: "0722 000 000",
    address: "Moi Avenue, Nairobi",
  }));

  useEffect(() => { saveState("musoricho_products", products); }, [products]);
  useEffect(() => { saveState("musoricho_customers", customers); }, [customers]);
  useEffect(() => { saveState("musoricho_transactions", transactions); }, [transactions]);
  useEffect(() => { saveState("musoricho_sales", sales); }, [sales]);
  useEffect(() => { saveState("musoricho_business_info", businessInfo); }, [businessInfo]);
  const [cart, setCart] = useState([]);
  const [discountPct, setDiscountPct] = useState(0);
  const [payMethod, setPayMethod] = useState("Cash");
  const [receipt, setReceipt] = useState(null);
  const [productModal, setProductModal] = useState(null); // {mode:'add'|'edit', data}
  const [stockModal, setStockModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [printer, setPrinter] = useState(null); // { device, characteristic, name }

  const t = dark
    ? { bg: palette.charcoalBg, surface: palette.charcoalSurface, text: "#F3EEF6", sub: "#B8ACC2", border: "#3A2E42" }
    : { bg: palette.creamBg, surface: palette.creamSurface, text: palette.ink, sub: "#6B5D72", border: "#E7DFE9" };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const connectPrinter = async () => {
    try {
      const conn = await connectBluetoothPrinter();
      conn.device.addEventListener("gattserverdisconnected", () => { setPrinter(null); showToast("Printer disconnected"); });
      setPrinter(conn);
      showToast(`Connected to ${conn.name}`);
    } catch (e) {
      showToast(e.message || "Couldn't connect to printer");
    }
  };
  const disconnectPrinter = () => {
    if (printer?.device?.gatt?.connected) printer.device.gatt.disconnect();
    setPrinter(null);
    showToast("Printer disconnected");
  };
  const printViaBluetooth = async (sale) => {
    try {
      let conn = printer;
      if (!conn || !conn.device.gatt.connected) {
        conn = await connectBluetoothPrinter();
        conn.device.addEventListener("gattserverdisconnected", () => { setPrinter(null); showToast("Printer disconnected"); });
        setPrinter(conn);
      }
      const bytes = buildEscPosReceipt(sale, businessInfo);
      await writeBytesToPrinter(conn.characteristic, bytes);
      showToast("Sent to printer");
    } catch (e) {
      showToast(e.message || "Bluetooth print failed");
    }
  };

  if (!role) {
    return <Login t={t} dark={dark} setDark={setDark} onLogin={(r, name) => { setRole(r); setCashierName(name); }} />;
  }

  const lowStock = products.filter(p => p.qty > 0 && p.qty <= p.min);
  const outStock = products.filter(p => p.qty === 0);

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pos", label: "New Sale", icon: ShoppingCart },
    { id: "products", label: "Products", icon: Wine },
    { id: "inventory", label: "Inventory", icon: Boxes },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "customers", label: "Customers", icon: Users },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div style={{ background: t.bg, color: t.text, minHeight: "100vh", fontFamily: "-apple-system, Inter, Segoe UI, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        html, body, #root { width: 100%; height: 100%; }
        .serif { font-family: Georgia, 'Times New Roman', serif; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${palette.wineLight}55; border-radius: 8px; }
        button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid ${palette.gold}; outline-offset: 1px; }
        button { transition: transform 0.1s ease, filter 0.1s ease, opacity 0.1s ease; }
        button:active:not(:disabled) { transform: scale(0.95); filter: brightness(0.92); }
        button:disabled { cursor: not-allowed; }
        .app-shell { display: flex; min-height: 100vh; width: 100%; }
        .sidebar { flex-shrink: 0; overflow: hidden; transition: width 0.22s ease, padding 0.22s ease; white-space: nowrap; }
        .main-col { flex: 1; min-width: 0; display: flex; flex-direction: column; width: 100%; }
        .content-pad { padding: 28px 40px; flex: 1; overflow-y: auto; width: 100%; max-width: 1600px; margin: 0 auto; }
        .topbar { padding: 16px 40px; }
        .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px,1fr)); gap: 14px; }
        .pos-grid { display: grid; grid-template-columns: minmax(0,1fr) 360px; gap: 18px; height: calc(100vh - 160px); }
        .pos-products { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px,1fr)); gap: 12px; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .two-col-wide { display: grid; grid-template-columns: 1.4fr 1fr; gap: 18px; }
        .four-col { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
        @media (max-width: 980px) {
          .content-pad, .topbar { padding-left: 18px; padding-right: 18px; }
          .pos-grid { grid-template-columns: minmax(0,1fr); height: auto; }
          .two-col, .two-col-wide, .four-col { grid-template-columns: 1fr; }
          .scroll-hint { display: block; }
        }
        .scroll-hint { display: none; font-size: 11px; color: ${t.sub}; padding: 6px 14px 0; }
      `}</style>

      <div className="app-shell">
        {/* Sidebar */}
        <div className="sidebar" style={{ width: sidebarOpen ? 236 : 0, padding: sidebarOpen ? "22px 14px" : "22px 0", background: `linear-gradient(180deg, ${palette.wineDeep}, ${palette.wine})`, color: "#F3EEF6", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px 22px", borderBottom: "1px solid #ffffff22", marginBottom: 18 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: palette.gold, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Wine size={19} color={palette.wineDeep} />
            </div>
            <div className="brand-text" style={{ flex: 1 }}>
              <div className="serif" style={{ fontSize: 15, fontWeight: 700, letterSpacing: 0.3, whiteSpace: "nowrap" }}>MUSORICHO</div>
              <div style={{ fontSize: 9.5, letterSpacing: 1.5, color: palette.goldSoft, whiteSpace: "nowrap" }}>WINES &amp; SPIRITS</div>
            </div>
            <button onClick={() => setSidebarOpen(false)} title="Collapse menu" style={{ background: "transparent", border: "none", color: "#E6D9E8", cursor: "pointer", padding: 4, flexShrink: 0 }}>
              <PanelLeftClose size={17} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
            {nav.map(n => {
              if (n.id === "settings" && role !== "Administrator") return null;
              const Icon = n.icon;
              const active = view === n.id;
              return (
                <button key={n.id} onClick={() => setView(n.id)} title={n.label}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, border: "none",
                    background: active ? "#ffffff1c" : "transparent", color: active ? "#fff" : "#E6D9E8",
                    cursor: "pointer", fontSize: 13.5, fontWeight: active ? 600 : 500, textAlign: "left"
                  }}>
                  <Icon size={16} style={{ flexShrink: 0 }} /> <span className="nav-label">{n.label}</span>
                  {n.id === "inventory" && (lowStock.length + outStock.length > 0) && (
                    <span className="nav-label" style={{ marginLeft: "auto", background: palette.danger, borderRadius: 20, fontSize: 10, padding: "1px 6px" }}>
                      {lowStock.length + outStock.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div style={{ borderTop: "1px solid #ffffff22", paddingTop: 12, marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 8px 10px" }}>
              <UserCircle2 size={22} color={palette.goldSoft} style={{ flexShrink: 0 }} />
              <div className="user-text">
                <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap" }}>{cashierName}</div>
                <div style={{ fontSize: 10.5, color: "#C9B9CC", whiteSpace: "nowrap" }}>{role}</div>
              </div>
            </div>
            <button onClick={() => setRole(null)} title="Sign out" style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 8px", background: "transparent", border: "none", color: "#E6D9E8", fontSize: 12.5, cursor: "pointer" }}>
              <LogOut size={14} style={{ flexShrink: 0 }} /> <span className="nav-label">Sign out</span>
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="main-col">
          <div className="topbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${t.border}`, background: t.surface }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {!sidebarOpen && (
                <button onClick={() => setSidebarOpen(true)} title="Open menu" style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Menu size={16} />
                </button>
              )}
              <div>
                <div className="serif" style={{ fontSize: 18, fontWeight: 700 }}>{nav.find(n => n.id === view)?.label}</div>
                <div style={{ fontSize: 11.5, color: t.sub }}>{new Date().toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {(outStock.length > 0) && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: palette.danger, background: `${palette.danger}18`, padding: "6px 10px", borderRadius: 8, whiteSpace: "nowrap" }}>
                  <AlertTriangle size={13} /> {outStock.length} out of stock
                </div>
              )}
              <button onClick={() => setDark(d => !d)} style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>

          <div className="content-pad">
            {view === "dashboard" && <Dashboard t={t} products={products} lowStock={lowStock} outStock={outStock} customers={customers} transactions={transactions} sales={sales} />}
            {view === "pos" && (
              <POS t={t} products={products} setProducts={setProducts} cart={cart} setCart={setCart}
                discountPct={discountPct} setDiscountPct={setDiscountPct} payMethod={payMethod} setPayMethod={setPayMethod}
                customers={customers} cashierName={cashierName} businessInfo={businessInfo}
                onComplete={(sale) => {
                  setTransactions(tx => [{ id: sale.id, time: sale.time, cashier: cashierName, items: sale.items.length, total: sale.total, method: sale.method }, ...tx]);
                  setSales(s => [...s, sale]);
                  setReceipt(sale);
                  setCart([]); setDiscountPct(0);
                  showToast(`Sale ${sale.id} completed`);
                }} />
            )}
            {view === "products" && <Products t={t} products={products} setProducts={setProducts} onEdit={(p) => setProductModal({ mode: "edit", data: p })} onAdd={() => setProductModal({ mode: "add", data: null })} showToast={showToast} role={role} />}
            {view === "inventory" && <Inventory t={t} products={products} lowStock={lowStock} outStock={outStock} onStockIn={(p) => setStockModal(p)} />}
            {view === "reports" && <Reports t={t} products={products} sales={sales} showToast={showToast} />}
            {view === "customers" && <Customers t={t} customers={customers} setCustomers={setCustomers} showToast={showToast} role={role} />}
            {view === "settings" && <SettingsPanel t={t} role={role} businessInfo={businessInfo} setBusinessInfo={setBusinessInfo} showToast={showToast} printer={printer} connectPrinter={connectPrinter} disconnectPrinter={disconnectPrinter} />}
          </div>
        </div>
      </div>

      {receipt && <ReceiptModal t={t} sale={receipt} businessInfo={businessInfo} printer={printer} printViaBluetooth={printViaBluetooth} onClose={() => setReceipt(null)} />}
      {productModal && (
        <ProductModal t={t} mode={productModal.mode} data={productModal.data}
          onClose={() => setProductModal(null)}
          onSave={(p) => {
            setProducts(list => productModal.mode === "add"
              ? [...list, { ...p, id: Math.max(0, ...list.map(x => x.id)) + 1 }]
              : list.map(x => x.id === p.id ? p : x));
            setProductModal(null);
            showToast(productModal.mode === "add" ? "Product added" : "Product updated");
          }} />
      )}
      {stockModal && (
        <StockInModal t={t} product={stockModal} onClose={() => setStockModal(null)}
          onConfirm={(qty) => {
            setProducts(list => list.map(p => p.id === stockModal.id ? { ...p, qty: p.qty + qty } : p));
            setStockModal(null); showToast(`Added ${qty} units to ${stockModal.name}`);
          }} />
      )}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 8, background: palette.ink, color: "#fff", padding: "11px 20px", borderRadius: 9, fontSize: 13, fontWeight: 500, boxShadow: "0 10px 30px #0006", zIndex: 200, animation: "toastIn 0.18s ease" }}>
          <span style={{ width: 16, height: 16, borderRadius: "50%", background: palette.gold, color: palette.wineDeep, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, flexShrink: 0 }}>✓</span>
          {toast}
        </div>
      )}
      <style>{`@keyframes toastIn { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }`}</style>
    </div>
  );
}

/* ---------------------------------- login ---------------------------------- */
function Login({ t, dark, setDark, onLogin }) {
  const [selected, setSelected] = useState("Administrator");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const roles = ["Administrator", "Manager", "Cashier"];

  const submit = () => {
    if (!name.trim()) { setError("Enter your staff name."); return; }
    if (password !== "7239") { setError("Incorrect password."); return; }
    setError("");
    onLogin(selected, name.trim());
  };
  const onKeyDown = (e) => { if (e.key === "Enter") submit(); };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${palette.wineDeep}, ${palette.wine} 60%, ${palette.wineLight})`, fontFamily: "-apple-system, Inter, Segoe UI, sans-serif", position: "relative" }}>
      <button onClick={() => setDark(d => !d)} style={{ position: "absolute", top: 20, right: 20, width: 36, height: 36, borderRadius: 8, border: "1px solid #ffffff40", background: "#ffffff15", color: "#fff", cursor: "pointer" }}>
        {dark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <div style={{ width: 380, background: t.surface, borderRadius: 16, padding: "34px 30px", boxShadow: "0 30px 70px #00000055" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
          <div style={{ width: 54, height: 54, borderRadius: 14, background: palette.gold, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <Wine size={28} color={palette.wineDeep} />
          </div>
          <div className="serif" style={{ fontSize: 21, fontWeight: 700, color: t.text }}>MUSORICHO</div>
          <div style={{ fontSize: 11, letterSpacing: 2, color: palette.wineLight, fontWeight: 600 }}>WINES &amp; SPIRITS · POS</div>
        </div>

        <label style={{ fontSize: 12, fontWeight: 600, color: t.sub }}>Staff name</label>
        <input value={name} onChange={e => { setName(e.target.value); setError(""); }} onKeyDown={onKeyDown} placeholder="e.g. Wanjiru M."
          style={{ width: "100%", padding: "10px 12px", margin: "6px 0 16px", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.text, fontSize: 14 }} />

        <label style={{ fontSize: 12, fontWeight: 600, color: t.sub }}>Sign in as</label>
        <div style={{ display: "flex", gap: 8, margin: "6px 0 16px" }}>
          {roles.map(r => (
            <button key={r} onClick={() => setSelected(r)}
              style={{ flex: 1, padding: "8px 4px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                border: `1px solid ${selected === r ? palette.wine : t.border}`,
                background: selected === r ? palette.wine : "transparent", color: selected === r ? "#fff" : t.text }}>
              {r}
            </button>
          ))}
        </div>

        <label style={{ fontSize: 12, fontWeight: 600, color: t.sub }}>Password</label>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", margin: "6px 0 6px", borderRadius: 8, border: `1px solid ${error ? palette.danger : t.border}` }}>
          <Lock size={14} color={t.sub} style={{ flexShrink: 0 }} />
          <input type={showPassword ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }} onKeyDown={onKeyDown}
            placeholder="Enter password" style={{ flex: 1, border: "none", outline: "none", background: "transparent", color: t.text, fontSize: 14, minWidth: 0 }} />
          <button onClick={() => setShowPassword(s => !s)} title={showPassword ? "Hide password" : "Show password"}
            style={{ background: "none", border: "none", color: t.sub, cursor: "pointer", padding: 2, flexShrink: 0, fontSize: 11, fontWeight: 600 }}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {error && <div style={{ color: palette.danger, fontSize: 11.5, marginBottom: 14 }}>{error}</div>}
        {!error && <div style={{ marginBottom: 20 }} />}

        <button onClick={submit}
          style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", background: palette.wine, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          Sign In
        </button>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 11.5, color: t.sub }}>Contact your administrator if you don't have your password.</div>
      </div>
    </div>
  );
}

/* ---------------------------------- dashboard ---------------------------------- */
function Dashboard({ t, products, lowStock, outStock, customers, transactions, sales }) {
  const now = new Date();
  const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0, 0, 0, 0);

  const stats = useMemo(() => {
    const profitOf = (sale) => {
      const cogs = sale.items.reduce((a, it) => {
        const prod = products.find(p => p.id === it.id);
        return a + it.qty * (prod ? prod.buy : 0);
      }, 0);
      return (sale.subtotal - sale.discountAmt) - cogs;
    };

    let todaySales = 0, todayProfit = 0, weekSales = 0, monthSales = 0, annualSales = 0, monthProfit = 0, annualProfit = 0;
    const dayBuckets = [0, 0, 0, 0, 0, 0, 0]; // Sun..Sat, sales
    const profitBuckets = [0, 0, 0, 0, 0, 0, 0];
    const categoryTotals = {};

    sales.forEach(s => {
      const d = new Date(s.ts || Date.now());
      const profit = profitOf(s);
      if (isSameDay(d, now)) { todaySales += s.total; todayProfit += profit; }
      if (d >= startOfWeek) { weekSales += s.total; dayBuckets[d.getDay()] += s.total; profitBuckets[d.getDay()] += profit; }
      if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) { monthSales += s.total; monthProfit += profit; }
      if (d.getFullYear() === now.getFullYear()) { annualSales += s.total; annualProfit += profit; }
      s.items.forEach(it => {
        const prod = products.find(p => p.id === it.id);
        const cat = prod ? prod.category : "Other";
        categoryTotals[cat] = (categoryTotals[cat] || 0) + it.qty * it.price;
      });
    });

    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekChart = dayLabels.map((day, i) => ({ day, sales: dayBuckets[i], profit: profitBuckets[i] }));

    const catColors = [palette.wine, palette.gold, palette.wineLight, palette.goldSoft, "#9C8AA5", "#6B8E7C"];
    const categoryPie = Object.entries(categoryTotals).map(([name, value], i) => ({ name, value, color: catColors[i % catColors.length] }));

    return { todaySales, todayProfit, weekSales, monthSales, annualSales, monthProfit, annualProfit, weekChart, categoryPie };
  }, [sales, products]);

  const cards = [
    { label: "Today's Sales", value: fmtKES(stats.todaySales), icon: DollarSign, tone: palette.wine },
    { label: "Weekly Sales", value: fmtKES(stats.weekSales), icon: TrendingUp, tone: palette.wineLight },
    { label: "Monthly Sales", value: fmtKES(stats.monthSales), icon: TrendingUp, tone: palette.wine },
    { label: "Annual Sales", value: fmtKES(stats.annualSales), icon: TrendingUp, tone: palette.wineLight },
    { label: "Today's Profit", value: fmtKES(stats.todayProfit), icon: DollarSign, tone: palette.success },
    { label: "Monthly Profit", value: fmtKES(stats.monthProfit), icon: DollarSign, tone: palette.success },
    { label: "Annual Profit", value: fmtKES(stats.annualProfit), icon: DollarSign, tone: palette.success },
    { label: "Total Products", value: products.length, icon: Package, tone: palette.gold },
    { label: "Low Stock", value: lowStock.length, icon: AlertTriangle, tone: "#C97C22" },
    { label: "Out of Stock", value: outStock.length, icon: AlertTriangle, tone: palette.danger },
    { label: "Total Customers", value: customers.length, icon: Users, tone: palette.wineLight },
  ];

  return (
    <div>
      <div className="card-grid" style={{ marginBottom: 24 }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 11.5, color: t.sub, fontWeight: 600 }}>{c.label}</span>
              <c.icon size={15} color={c.tone} />
            </div>
            <div className="serif" style={{ fontSize: 19, fontWeight: 700 }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div className="two-col-wide" style={{ marginBottom: 16 }}>
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 18 }}>
          <div className="serif" style={{ fontWeight: 700, marginBottom: 12, fontSize: 14.5 }}>This Week's Sales &amp; Profit</div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={stats.weekChart}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
              <XAxis dataKey="day" stroke={t.sub} fontSize={11} />
              <YAxis stroke={t.sub} fontSize={11} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v) => fmtKES(v)} contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="sales" stroke={palette.wine} strokeWidth={2.5} dot={{ r: 3 }} name="Sales" />
              <Line type="monotone" dataKey="profit" stroke={palette.gold} strokeWidth={2.5} dot={{ r: 3 }} name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 18 }}>
          <div className="serif" style={{ fontWeight: 700, marginBottom: 12, fontSize: 14.5 }}>Sales by Category</div>
          {stats.categoryPie.length > 0 ? (
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie data={stats.categoryPie} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {stats.categoryPie.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Pie>
                <Tooltip formatter={(v) => fmtKES(v)} contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 230, display: "flex", alignItems: "center", justifyContent: "center", color: t.sub, fontSize: 12.5 }}>No sales yet</div>
          )}
        </div>
      </div>

      <div className="two-col">
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 18 }}>
          <div className="serif" style={{ fontWeight: 700, marginBottom: 12, fontSize: 14.5 }}>Recent Transactions</div>
          {transactions.slice(0, 5).map(tx => (
            <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${t.border}`, fontSize: 12.5 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{tx.id}</div>
                <div style={{ color: t.sub, fontSize: 11 }}>{tx.cashier} · {tx.time} · {tx.method}</div>
              </div>
              <div style={{ fontWeight: 700, color: palette.wine }}>{fmtKES(tx.total)}</div>
            </div>
          ))}
        </div>
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 18 }}>
          <div className="serif" style={{ fontWeight: 700, marginBottom: 12, fontSize: 14.5 }}>Stock Alerts</div>
          {[...outStock.map(p => ({ ...p, tag: "OUT OF STOCK", tone: palette.danger })), ...lowStock.map(p => ({ ...p, tag: "LOW STOCK", tone: "#C97C22" }))]
            .slice(0, 6).map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${t.border}`, fontSize: 12.5 }}>
                <span>{p.name}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: p.tone, background: `${p.tone}18`, padding: "2px 8px", borderRadius: 20 }}>{p.tag} · {p.qty}</span>
              </div>
            ))}
          {outStock.length + lowStock.length === 0 && <div style={{ color: t.sub, fontSize: 12.5 }}>All stock levels healthy.</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- POS / sales ---------------------------------- */
function POS({ t, products, setProducts, cart, setCart, discountPct, setDiscountPct, payMethod, setPayMethod, customers, cashierName, businessInfo, onComplete }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [customerId, setCustomerId] = useState(1);
  const vatRate = (businessInfo.vatRate ?? 16) / 100;

  const filtered = products.filter(p =>
    (cat === "All" || p.category === cat) &&
    (p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase()))
  );

  const addToCart = (p) => {
    if (p.qty <= 0) return;
    setCart(c => {
      const existing = c.find(i => i.id === p.id);
      if (existing) {
        if (existing.qty >= p.qty) return c;
        return c.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...c, { id: p.id, name: p.name, price: p.sell, qty: 1, max: p.qty }];
    });
  };
  const changeQty = (id, delta) => setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(1, Math.min(i.max, i.qty + delta)) } : i));
  const removeItem = (id) => setCart(c => c.filter(i => i.id !== id));

  const subtotal = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const discountAmt = Math.round(subtotal * (discountPct / 100));
  const taxable = subtotal - discountAmt;
  const vat = Math.round(taxable * vatRate);
  const total = taxable + vat;

  const completeSale = () => {
    if (cart.length === 0) return;
    setProducts(list => list.map(p => {
      const item = cart.find(i => i.id === p.id);
      return item ? { ...p, qty: p.qty - item.qty } : p;
    }));
    const sale = {
      id: "RC-" + Math.floor(10000 + Math.random() * 89999),
      ts: Date.now(),
      time: new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toLocaleDateString("en-KE"),
      cashier: cashierName,
      customer: customers.find(c => c.id === customerId)?.name || "Walk-in Customer",
      items: cart, subtotal, discountAmt, vat, vatPct: businessInfo.vatRate ?? 16, total, method: payMethod,
    };
    onComplete(sale);
  };

  return (
    <div className="pos-grid">
      {/* product picker */}
      <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: "9px 12px" }}>
            <Search size={15} color={t.sub} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, SKU, or scan barcode..."
              style={{ border: "none", outline: "none", background: "transparent", color: t.text, fontSize: 13.5, width: "100%" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
                border: `1px solid ${cat === c ? palette.wine : t.border}`, background: cat === c ? palette.wine : "transparent", color: cat === c ? "#fff" : t.text }}>
              {c}
            </button>
          ))}
        </div>
        <div className="pos-products" style={{ overflowY: "auto", alignContent: "start", paddingRight: 4 }}>
          {filtered.map(p => (
            <button key={p.id} onClick={() => addToCart(p)} disabled={p.qty <= 0}
              style={{ textAlign: "left", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: 12, cursor: p.qty > 0 ? "pointer" : "not-allowed", opacity: p.qty > 0 ? 1 : 0.45 }}>
              <div style={{ width: "100%", height: 54, borderRadius: 6, background: `linear-gradient(135deg, ${palette.wine}22, ${palette.gold}22)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                <Wine size={22} color={palette.wine} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: t.sub, marginBottom: 4 }}>{p.qty} in stock</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: palette.wine }}>{fmtKES(p.sell)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* cart */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ padding: 14, borderBottom: `1px solid ${t.border}` }}>
          <div className="serif" style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Current Sale</div>
          <select value={customerId} onChange={e => setCustomerId(Number(e.target.value))}
            style={{ width: "100%", padding: "7px 8px", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.text, fontSize: 12.5 }}>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
          {cart.length === 0 && <div style={{ color: t.sub, fontSize: 12.5, textAlign: "center", marginTop: 30 }}>Cart is empty — tap a product to add it.</div>}
          {cart.map(i => (
            <div key={i.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${t.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>
                <span>{i.name}</span>
                <button onClick={() => removeItem(i.id)} style={{ background: "none", border: "none", color: palette.danger, cursor: "pointer" }}><Trash2 size={13} /></button>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => changeQty(i.id, -1)} style={{ width: 22, height: 22, borderRadius: 6, border: `1px solid ${t.border}`, background: "transparent", color: t.text, cursor: "pointer" }}><Minus size={11} /></button>
                  <span style={{ fontSize: 12.5, fontWeight: 700, width: 18, textAlign: "center" }}>{i.qty}</span>
                  <button onClick={() => changeQty(i.id, 1)} style={{ width: 22, height: 22, borderRadius: 6, border: `1px solid ${t.border}`, background: "transparent", color: t.text, cursor: "pointer" }}><Plus size={11} /></button>
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{fmtKES(i.price * i.qty)}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: 14, borderTop: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: t.sub }}>Discount %</span>
            <input type="number" min={0} max={100} value={discountPct} onChange={e => setDiscountPct(Math.max(0, Math.min(100, Number(e.target.value))))}
              style={{ width: 56, padding: "5px 7px", borderRadius: 6, border: `1px solid ${t.border}`, background: "transparent", color: t.text, fontSize: 12 }} />
          </div>
          <Row label="Subtotal" value={fmtKES(subtotal)} t={t} />
          <Row label="Discount" value={`-${fmtKES(discountAmt)}`} t={t} />
          <Row label={`VAT (${businessInfo.vatRate ?? 16}%)`} value={fmtKES(vat)} t={t} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, margin: "8px 0 12px" }}>
            <span>Total</span><span style={{ color: palette.wine }}>{fmtKES(total)}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
            {["Cash", "M-Pesa", "Card", "Bank Transfer"].map(m => (
              <button key={m} onClick={() => setPayMethod(m)} style={{ padding: "7px 4px", borderRadius: 7, fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                border: `1px solid ${payMethod === m ? palette.wine : t.border}`, background: payMethod === m ? palette.wine : "transparent", color: payMethod === m ? "#fff" : t.text }}>
                {m}
              </button>
            ))}
          </div>
          <button onClick={completeSale} disabled={cart.length === 0}
            style={{ width: "100%", padding: 12, borderRadius: 9, border: "none", background: cart.length ? palette.wine : `${palette.wine}55`, color: "#fff", fontWeight: 700, fontSize: 14, cursor: cart.length ? "pointer" : "not-allowed" }}>
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
}
function Row({ label, value, t }) {
  return <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: t.sub, marginBottom: 4 }}><span>{label}</span><span>{value}</span></div>;
}

/* ---------------------------------- receipt ---------------------------------- */
function ReceiptModal({ t, sale, businessInfo, printer, printViaBluetooth, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .receipt-print, .receipt-print * { visibility: visible; }
          .receipt-print { position: absolute; top: 0; left: 0; width: 58mm !important; box-shadow: none !important; border-radius: 0 !important; }
          .receipt-print > div { padding-left: 6px !important; padding-right: 6px !important; }
          .no-print { display: none !important; }
          @page { margin: 0; size: 58mm auto; }
        }
      `}</style>
      <div className="receipt-print" style={{ width: 300, background: "#fff", color: "#222", borderRadius: 4, position: "relative", fontFamily: "'Courier New', monospace" }}>
        <button onClick={onClose} className="no-print" style={{ position: "absolute", top: -12, right: -12, width: 28, height: 28, borderRadius: "50%", background: palette.wine, color: "#fff", border: "3px solid #fff", cursor: "pointer" }}><X size={13} /></button>
        <div style={{ padding: "20px 18px 14px", borderBottom: "1px dashed #999" }}>
          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 14 }}>{businessInfo.name}</div>
          <div style={{ textAlign: "center", fontSize: 10, color: "#555" }}>{businessInfo.address} · {businessInfo.phone}</div>
          <div style={{ textAlign: "center", fontSize: 10, color: "#555" }}>PIN: {businessInfo.pin}</div>
        </div>
        <div style={{ padding: "12px 18px", fontSize: 10.5, borderBottom: "1px dashed #999" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Receipt#</span><span>{sale.id}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Date</span><span>{sale.date} {sale.time}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Cashier</span><span>{sale.cashier}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Customer</span><span>{sale.customer}</span></div>
        </div>
        <div style={{ padding: "12px 18px", borderBottom: "1px dashed #999" }}>
          {sale.items.map(i => (
            <div key={i.id} style={{ fontSize: 10.5, marginBottom: 6 }}>
              <div>{i.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#555" }}>
                <span>{i.qty} x {fmtKES(i.price)}</span><span>{fmtKES(i.qty * i.price)}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 18px", fontSize: 10.5, borderBottom: "1px dashed #999" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal</span><span>{fmtKES(sale.subtotal)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Discount</span><span>-{fmtKES(sale.discountAmt)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>VAT ({sale.vatPct ?? 16}%)</span><span>{fmtKES(sale.vat)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 12, marginTop: 4 }}><span>TOTAL</span><span>{fmtKES(sale.total)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}><span>Paid via</span><span>{sale.method}</span></div>
        </div>
        <div style={{ padding: "14px 18px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 10.5, marginBottom: 8 }}>Thank You for Shopping With Us</div>
          <div style={{ fontSize: 9, color: "#777", marginBottom: 14 }}>Drink responsibly · Goods sold are not returnable</div>
          <div className="no-print" style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <button onClick={() => window.print()} style={{ flex: 1, padding: 9, borderRadius: 6, border: "none", background: palette.wine, color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Printer size={13} /> Print
            </button>
            <button onClick={() => printViaBluetooth(sale)} style={{ flex: 1, padding: 9, borderRadius: 6, border: `1px solid ${palette.wine}`, background: "transparent", color: palette.wine, fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Bluetooth size={13} /> {printer ? "Print" : "Connect & Print"}
            </button>
          </div>
          <button onClick={onClose} className="no-print" style={{ width: "100%", padding: 9, borderRadius: 6, border: `1px solid ${t.border}`, background: "transparent", color: "#666", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
            New Sale
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- products ---------------------------------- */
function Products({ t, products, setProducts, onEdit, onAdd, showToast, role }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const filtered = products.filter(p => (cat === "All" || p.category === cat) && p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: "9px 12px" }}>
          <Search size={15} color={t.sub} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products or SKU..." style={{ border: "none", outline: "none", background: "transparent", color: t.text, fontSize: 13, width: "100%" }} />
        </div>
        <select value={cat} onChange={e => setCat(e.target.value)} style={{ padding: "9px 12px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 13 }}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <button onClick={onAdd} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "none", background: palette.wine, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <Plus size={15} /> Add Product
        </button>
      </div>

      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div className="scroll-hint">Swipe left to see status &amp; actions →</div>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", minWidth: 760, borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: `${palette.wine}0F`, textAlign: "left" }}>
              {["Product", "SKU", "Category", "Buy Price", "Sell Price", "Qty", "Status", ""].map(h => (
                <th key={h} style={{ padding: "10px 14px", fontWeight: 700, color: t.sub, fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const status = p.qty === 0 ? { l: "Out of Stock", c: palette.danger } : p.qty <= p.min ? { l: "Low Stock", c: "#C97C22" } : { l: "In Stock", c: palette.success };
              return (
                <tr key={p.id} style={{ borderTop: `1px solid ${t.border}` }}>
                  <td style={{ padding: "10px 14px", fontWeight: 600, whiteSpace: "nowrap" }}>{p.name}<div style={{ fontSize: 10.5, color: t.sub, fontWeight: 400 }}>{p.brand} · {p.size}</div></td>
                  <td style={{ padding: "10px 14px", color: t.sub, whiteSpace: "nowrap" }}>{p.sku}</td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>{p.category}</td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>{fmtKES(p.buy)}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: palette.wine, whiteSpace: "nowrap" }}>{fmtKES(p.sell)}</td>
                  <td style={{ padding: "10px 14px" }}>{p.qty}</td>
                  <td style={{ padding: "10px 14px" }}><span style={{ fontSize: 10, fontWeight: 700, color: status.c, background: `${status.c}18`, padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap" }}>{status.l}</span></td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => onEdit(p)} style={{ fontSize: 11, padding: "5px 10px", borderRadius: 6, border: `1px solid ${t.border}`, background: "transparent", color: t.text, cursor: "pointer", whiteSpace: "nowrap" }}>Edit</button>
                      {role === "Administrator" && (
                        <button onClick={() => { setProducts(list => list.filter(x => x.id !== p.id)); showToast("Product deleted"); }}
                          style={{ fontSize: 11, padding: "5px 8px", borderRadius: 6, border: `1px solid ${palette.danger}55`, background: "transparent", color: palette.danger, cursor: "pointer" }}>
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

function ProductModal({ t, mode, data, onClose, onSave }) {
  const [form, setForm] = useState(data || { name: "", sku: "", category: "Whisky", brand: "", size: "750ml", buy: "", sell: "", qty: "", min: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name && form.sku && form.buy !== "" && form.sell !== "";
  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ width: 460, background: t.surface, color: t.text, borderRadius: 14, padding: 22, maxHeight: "88vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="serif" style={{ fontWeight: 700, fontSize: 16 }}>{mode === "add" ? "Add Product" : "Edit Product"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: t.text, cursor: "pointer" }}><X size={18} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field t={t} label="Product Name" full value={form.name} onChange={v => set("name", v)} />
          <Field t={t} label="SKU / Barcode" value={form.sku} onChange={v => set("sku", v)} />
          <SelectField t={t} label="Category" value={form.category} onChange={v => set("category", v)} options={CATEGORIES.filter(c => c !== "All")} />
          <Field t={t} label="Brand" value={form.brand} onChange={v => set("brand", v)} />
          <Field t={t} label="Bottle Size" value={form.size} onChange={v => set("size", v)} />
          <Field t={t} label="Buying Price (KES)" type="number" value={form.buy} onChange={v => set("buy", v)} />
          <Field t={t} label="Selling Price (KES)" type="number" value={form.sell} onChange={v => set("sell", v)} />
          <Field t={t} label="Quantity" type="number" value={form.qty} onChange={v => set("qty", v)} />
          <Field t={t} label="Low Stock Threshold" type="number" value={form.min} onChange={v => set("min", v)} />
        </div>
        <button disabled={!valid} onClick={() => onSave({ ...form, id: data?.id, buy: Number(form.buy), sell: Number(form.sell), qty: Number(form.qty) || 0, min: Number(form.min) || 5 })}
          style={{ width: "100%", marginTop: 18, padding: 11, borderRadius: 9, border: "none", background: valid ? palette.wine : `${palette.wine}55`, color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: valid ? "pointer" : "not-allowed" }}>
          Save Product
        </button>
      </div>
    </div>
  );
}
function Field({ t, label, value, onChange, type = "text", full }) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : "auto" }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: t.sub }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "8px 10px", marginTop: 4, borderRadius: 7, border: `1px solid ${t.border}`, background: "transparent", color: t.text, fontSize: 13 }} />
    </div>
  );
}
function SelectField({ t, label, value, onChange, options }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: t.sub }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "8px 10px", marginTop: 4, borderRadius: 7, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 13 }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ---------------------------------- inventory ---------------------------------- */
function Inventory({ t, products, lowStock, outStock, onStockIn }) {
  const totalValue = products.reduce((a, p) => a + p.buy * p.qty, 0);
  return (
    <div>
      <div className="four-col" style={{ marginBottom: 18 }}>
        <MiniStat t={t} label="Inventory Value" value={fmtKES(totalValue)} />
        <MiniStat t={t} label="Total Units" value={products.reduce((a, p) => a + p.qty, 0)} />
        <MiniStat t={t} label="Low Stock Items" value={lowStock.length} tone="#C97C22" />
        <MiniStat t={t} label="Out of Stock" value={outStock.length} tone={palette.danger} />
      </div>
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div className="scroll-hint">Swipe left to see status &amp; actions →</div>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: `${palette.wine}0F`, textAlign: "left" }}>
              {["Product", "Current Stock", "Threshold", "Stock Value", "Status", ""].map(h => <th key={h} style={{ padding: "10px 14px", fontWeight: 700, color: t.sub, fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const status = p.qty === 0 ? { l: "Out of Stock", c: palette.danger } : p.qty <= p.min ? { l: "Low Stock", c: "#C97C22" } : { l: "Healthy", c: palette.success };
              return (
                <tr key={p.id} style={{ borderTop: `1px solid ${t.border}` }}>
                  <td style={{ padding: "10px 14px", fontWeight: 600, whiteSpace: "nowrap" }}>{p.name}</td>
                  <td style={{ padding: "10px 14px" }}>{p.qty}</td>
                  <td style={{ padding: "10px 14px", color: t.sub }}>{p.min}</td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>{fmtKES(p.buy * p.qty)}</td>
                  <td style={{ padding: "10px 14px" }}><span style={{ fontSize: 10, fontWeight: 700, color: status.c, background: `${status.c}18`, padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap" }}>{status.l}</span></td>
                  <td style={{ padding: "10px 14px" }}>
                    <button onClick={() => onStockIn(p)} style={{ fontSize: 11, padding: "5px 10px", borderRadius: 6, border: `1px solid ${t.border}`, background: "transparent", color: t.text, cursor: "pointer", whiteSpace: "nowrap" }}>Stock In</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
function MiniStat({ t, label, value, tone }) {
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 14 }}>
      <div style={{ fontSize: 11, color: t.sub, fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div className="serif" style={{ fontSize: 17, fontWeight: 700, color: tone || t.text }}>{value}</div>
    </div>
  );
}
function StockInModal({ t, product, onClose, onConfirm }) {
  const [qty, setQty] = useState(12);
  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ width: 340, background: t.surface, color: t.text, borderRadius: 14, padding: 22 }}>
        <div className="serif" style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Stock In</div>
        <div style={{ fontSize: 12.5, color: t.sub, marginBottom: 16 }}>{product.name}</div>
        <label style={{ fontSize: 11, fontWeight: 600, color: t.sub }}>Quantity received</label>
        <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))}
          style={{ width: "100%", padding: "9px 10px", marginTop: 4, marginBottom: 16, borderRadius: 7, border: `1px solid ${t.border}`, background: "transparent", color: t.text, fontSize: 14 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 10, borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.text, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => onConfirm(qty)} style={{ flex: 1, padding: 10, borderRadius: 8, border: "none", background: palette.wine, color: "#fff", fontWeight: 700, cursor: "pointer" }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- reports ---------------------------------- */
function Reports({ t, products, sales, showToast }) {
  const [period, setPeriod] = useState("Weekly");

  const stats = useMemo(() => {
    const revenue = sales.reduce((a, s) => a + s.total, 0);
    const discountTotal = sales.reduce((a, s) => a + s.discountAmt, 0);
    const vatTotal = sales.reduce((a, s) => a + s.vat, 0);
    const netSales = sales.reduce((a, s) => a + (s.subtotal - s.discountAmt), 0);
    const cogs = sales.reduce((a, s) => a + s.items.reduce((ia, it) => {
      const prod = products.find(p => p.id === it.id);
      return ia + it.qty * (prod ? prod.buy : 0);
    }, 0), 0);
    const grossProfit = netSales - cogs;

    const productMap = {};
    sales.forEach(s => s.items.forEach(it => {
      if (!productMap[it.id]) productMap[it.id] = { name: it.name, qty: 0, revenue: 0 };
      productMap[it.id].qty += it.qty;
      productMap[it.id].revenue += it.qty * it.price;
    }));
    const topProducts = Object.values(productMap).sort((a, b) => b.qty - a.qty).slice(0, 6);

    const methodMap = {};
    sales.forEach(s => { methodMap[s.method] = (methodMap[s.method] || 0) + s.total; });
    const byMethod = Object.entries(methodMap).map(([method, total]) => ({ method, total }));

    return { revenue, discountTotal, vatTotal, netSales, cogs, grossProfit, topProducts, byMethod };
  }, [sales, products]);

  const hasSales = sales.length > 0;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {["Daily", "Weekly", "Monthly", "Yearly"].map(p => (
          <button key={p} onClick={() => { setPeriod(p); showToast(`Showing ${p.toLowerCase()} report`); }} style={{ padding: "8px 16px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            border: `1px solid ${period === p ? palette.wine : t.border}`, background: period === p ? palette.wine : "transparent", color: period === p ? "#fff" : t.text }}>
            {p}
          </button>
        ))}
        <button onClick={() => showToast(hasSales ? "PDF report downloaded" : "No sales data to export yet")} style={{ marginLeft: "auto", padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: `1px solid ${t.border}`, background: "transparent", color: t.text, cursor: "pointer" }}>Export PDF</button>
        <button onClick={() => showToast(hasSales ? "Excel report downloaded" : "No sales data to export yet")} style={{ padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: `1px solid ${t.border}`, background: "transparent", color: t.text, cursor: "pointer" }}>Export Excel</button>
      </div>

      <div style={{ fontSize: 11.5, color: t.sub, marginBottom: 10 }}>
        {hasSales ? `Based on ${sales.length} sale${sales.length > 1 ? "s" : ""} recorded this session.` : "No sales recorded yet — figures below will populate as sales are completed in New Sale."}
      </div>

      <div className="four-col" style={{ marginBottom: 18 }}>
        <MiniStat t={t} label="Revenue" value={fmtKES(stats.revenue)} />
        <MiniStat t={t} label="Cost of Goods Sold" value={fmtKES(stats.cogs)} />
        <MiniStat t={t} label="Gross Profit" value={fmtKES(stats.grossProfit)} tone={stats.grossProfit >= 0 ? palette.success : palette.danger} />
        <MiniStat t={t} label="VAT Collected" value={fmtKES(stats.vatTotal)} />
      </div>

      <div className="two-col-wide">
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 18 }}>
          <div className="serif" style={{ fontWeight: 700, marginBottom: 12, fontSize: 14.5 }}>Revenue by Payment Method</div>
          {hasSales ? (
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={stats.byMethod}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
                <XAxis dataKey="method" stroke={t.sub} fontSize={11} />
                <YAxis stroke={t.sub} fontSize={11} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v) => fmtKES(v)} contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, fontSize: 12 }} />
                <Bar dataKey="total" fill={palette.wine} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 230, display: "flex", alignItems: "center", justifyContent: "center", color: t.sub, fontSize: 12.5 }}>No sales yet</div>
          )}
        </div>
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 18 }}>
          <div className="serif" style={{ fontWeight: 700, marginBottom: 12, fontSize: 14.5 }}>Best Selling Products</div>
          {stats.topProducts.length === 0 && <div style={{ color: t.sub, fontSize: 12.5 }}>No sales yet</div>}
          {stats.topProducts.map((p, i) => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${t.border}` }}>
              <span className="serif" style={{ fontSize: 13, fontWeight: 700, color: palette.gold, width: 16 }}>{i + 1}</span>
              <span style={{ fontSize: 12.5, flex: 1 }}>{p.name}</span>
              <span style={{ fontSize: 11, color: t.sub, marginRight: 8 }}>{p.qty} sold</span>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{fmtKES(p.revenue)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- customers ---------------------------------- */
function Customers({ t, customers, setCustomers, showToast, role }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState(""); const [phone, setPhone] = useState("");
  const [editing, setEditing] = useState(null);
  const canEdit = role === "Administrator";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button onClick={() => setShowAdd(s => !s)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "none", background: palette.wine, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <Plus size={15} /> Add Customer
        </button>
      </div>
      {showAdd && (
        <div style={{ display: "flex", gap: 8, marginBottom: 14, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: 12 }}>
          <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} style={{ flex: 1, padding: "8px 10px", borderRadius: 7, border: `1px solid ${t.border}`, background: "transparent", color: t.text, fontSize: 13 }} />
          <input placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)} style={{ flex: 1, padding: "8px 10px", borderRadius: 7, border: `1px solid ${t.border}`, background: "transparent", color: t.text, fontSize: 13 }} />
          <button onClick={() => {
            if (!name.trim()) return;
            setCustomers(c => [...c, { id: Math.max(0, ...c.map(x => x.id)) + 1, name, phone: phone || "-", points: 0, balance: 0, visits: 0 }]);
            setName(""); setPhone(""); setShowAdd(false); showToast("Customer added");
          }} style={{ padding: "8px 16px", borderRadius: 7, border: "none", background: palette.wine, color: "#fff", fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}>Save</button>
        </div>
      )}
      {!canEdit && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: t.sub, background: `${palette.gold}14`, border: `1px solid ${palette.gold}33`, borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
          <Lock size={12} /> Only Administrators can edit customer records.
        </div>
      )}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div className="scroll-hint">Swipe left to see balance &amp; actions →</div>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: `${palette.wine}0F`, textAlign: "left" }}>
              {["Name", "Phone", "Loyalty Points", "Outstanding Balance", "Visits", ""].map(h => <th key={h} style={{ padding: "10px 14px", fontWeight: 700, color: t.sub, fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} style={{ borderTop: `1px solid ${t.border}` }}>
                <td style={{ padding: "10px 14px", fontWeight: 600, whiteSpace: "nowrap" }}>{c.name}</td>
                <td style={{ padding: "10px 14px", color: t.sub, whiteSpace: "nowrap" }}>{c.phone}</td>
                <td style={{ padding: "10px 14px" }}>{c.points}</td>
                <td style={{ padding: "10px 14px", color: c.balance > 0 ? palette.danger : t.sub, whiteSpace: "nowrap" }}>{fmtKES(c.balance)}</td>
                <td style={{ padding: "10px 14px" }}>{c.visits}</td>
                <td style={{ padding: "10px 14px" }}>
                  {canEdit && (
                    <button onClick={() => setEditing(c)} style={{ fontSize: 11, padding: "5px 10px", borderRadius: 6, border: `1px solid ${t.border}`, background: "transparent", color: t.text, cursor: "pointer", whiteSpace: "nowrap" }}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      {editing && (
        <CustomerModal t={t} data={editing} onClose={() => setEditing(null)}
          onSave={(updated) => {
            setCustomers(list => list.map(x => x.id === updated.id ? updated : x));
            setEditing(null); showToast("Customer updated");
          }}
          onDelete={(id) => {
            setCustomers(list => list.filter(x => x.id !== id));
            setEditing(null); showToast("Customer removed");
          }} />
      )}
    </div>
  );
}

function CustomerModal({ t, data, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(data);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name && form.name.trim().length > 0;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ width: 380, background: t.surface, color: t.text, borderRadius: 14, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="serif" style={{ fontWeight: 700, fontSize: 16 }}>Edit Customer</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: t.text, cursor: "pointer" }}><X size={18} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field t={t} label="Full Name" full value={form.name} onChange={v => set("name", v)} />
          <Field t={t} label="Phone Number" full value={form.phone} onChange={v => set("phone", v)} />
          <Field t={t} label="Loyalty Points" type="number" value={form.points} onChange={v => set("points", v)} />
          <Field t={t} label="Outstanding Balance (KES)" type="number" value={form.balance} onChange={v => set("balance", v)} />
        </div>
        <button disabled={!valid} onClick={() => onSave({ ...form, points: Number(form.points) || 0, balance: Number(form.balance) || 0 })}
          style={{ width: "100%", marginTop: 18, padding: 11, borderRadius: 9, border: "none", background: valid ? palette.wine : `${palette.wine}55`, color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: valid ? "pointer" : "not-allowed" }}>
          Save Changes
        </button>
        {data.id !== 1 && (
          <button onClick={() => onDelete(data.id)}
            style={{ width: "100%", marginTop: 8, padding: 10, borderRadius: 9, border: `1px solid ${palette.danger}55`, background: "transparent", color: palette.danger, fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}>
            Remove Customer
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- settings ---------------------------------- */
function SettingsPanel({ t, role, businessInfo, setBusinessInfo, showToast, printer, connectPrinter, disconnectPrinter }) {
  const [form, setForm] = useState(businessInfo);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const dirty = JSON.stringify(form) !== JSON.stringify(businessInfo);
  const valid = form.name.trim().length > 0 && form.currency.trim().length > 0;

  const save = () => {
    if (!valid) return;
    setBusinessInfo({ ...form, vatRate: Number(form.vatRate) || 0 });
    showToast("Business settings saved");
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div className="serif" style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Business Information</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field t={t} label="Business Name" value={form.name} onChange={v => set("name", v)} full />
          <Field t={t} label="Address" value={form.address} onChange={v => set("address", v)} full />
          <Field t={t} label="Currency" value={form.currency} onChange={v => set("currency", v)} />
          <Field t={t} label="VAT Rate (%)" type="number" value={form.vatRate} onChange={v => set("vatRate", v)} />
          <Field t={t} label="PIN Number" value={form.pin} onChange={v => set("pin", v)} />
          <Field t={t} label="Phone" value={form.phone} onChange={v => set("phone", v)} />
        </div>
        <button disabled={!valid || !dirty} onClick={save}
          style={{ marginTop: 16, padding: "10px 20px", borderRadius: 9, border: "none",
            background: (valid && dirty) ? palette.wine : `${palette.wine}55`, color: "#fff", fontWeight: 700, fontSize: 13, cursor: (valid && dirty) ? "pointer" : "not-allowed" }}>
          {dirty ? "Save Changes" : "Saved"}
        </button>
      </div>
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div className="serif" style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Bluetooth Printer</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: printer ? palette.success : t.sub, flexShrink: 0 }} />
          <span style={{ fontSize: 12.5, color: t.sub }}>{printer ? `Connected: ${printer.name}` : "Not connected"}</span>
        </div>
        {printer ? (
          <button onClick={disconnectPrinter} style={{ padding: "9px 16px", borderRadius: 9, border: `1px solid ${palette.danger}55`, background: "transparent", color: palette.danger, fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}>
            Disconnect
          </button>
        ) : (
          <button onClick={connectPrinter} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 9, border: "none", background: palette.wine, color: "#fff", fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}>
            <Bluetooth size={14} /> Connect Printer
          </button>
        )}
        <div style={{ fontSize: 11, color: t.sub, marginTop: 12 }}>
          Works with 58mm Bluetooth thermal printers like the P58E. Requires Chrome on Android or desktop — pair once here, or connect directly from the receipt screen when completing a sale.
        </div>
      </div>
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 20 }}>
        <div className="serif" style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Access</div>
        <div style={{ fontSize: 12.5, color: t.sub }}>Signed in as <strong style={{ color: t.text }}>{role}</strong>. Settings and user management are restricted to Administrators. Changes here apply to VAT calculations at checkout and the printed receipt.</div>
      </div>
    </div>
  );
}


/* ---------------------------------- mount ---------------------------------- */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
