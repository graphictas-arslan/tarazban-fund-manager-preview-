
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft, ArrowUpLeft, Bell, CalendarDays, ChartNoAxesCombined,
  ChevronDown, CircleHelp, HandCoins, LayoutDashboard, Menu, Moon,
  MoreHorizontal, Plus, ReceiptText, Search, Settings2, ShieldCheck,
  Sun, Users, Wallet, X, Monitor, Sparkles, 
} from "lucide-react";

type ThemeMode = "light" | "dark" | "system";
type NavItem = { id: string; label: string; icon: typeof LayoutDashboard; section: string };

const navItems: NavItem[] = [
  { id: "dashboard", label: "نمای کلی", icon: LayoutDashboard, section: "فضای مدیریت" },
  { id: "members", label: "اعضای صندوق", icon: Users, section: "فضای مدیریت" },
  { id: "shares", label: "سهم‌های ماهانه", icon: Wallet, section: "امور مالی" },
  { id: "loans", label: "وام و اقساط", icon: HandCoins, section: "امور مالی" },
  { id: "ledger", label: "دفتر کل", icon: ReceiptText, section: "امور مالی" },
  { id: "reports", label: "گزارش‌ها", icon: ChartNoAxesCombined, section: "تحلیل و تنظیمات" },
  { id: "settings", label: "تنظیمات صندوق", icon: Settings2, section: "تحلیل و تنظیمات" },
];

const pageTitles: Record<string, string> = {
  dashboard: "نمای کلی صندوق",
  members: "اعضای صندوق",
  shares: "سهم‌های ماهانه",
  loans: "وام و اقساط",
  ledger: "دفتر کل",
  reports: "گزارش‌ها",
  settings: "تنظیمات صندوق",
};

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 48 48" role="img" aria-label="نشان ترازبان">
      <path d="M24 4.5 41.5 14.6v18.8L24 43.5 6.5 33.4V14.6L24 4.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M24 12v24M13 18.3h22M13 29.7h22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="24" cy="24" r="4.2" fill="currentColor" />
      <path d="m13 18.3-4 7.1h8l-4-7.1Zm22 0-4 7.1h8l-4-7.1Z" fill="currentColor" opacity=".7" />
    </svg>
  );
}

function ThemePicker({ mode, onChange }: { mode: ThemeMode; onChange: (mode: ThemeMode) => void }) {
  const options: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
    { id: "light", label: "روشن", icon: Sun },
    { id: "dark", label: "تاریک", icon: Moon },
    { id: "system", label: "سیستم", icon: Monitor },
  ];
  return (
    <div className="theme-picker" aria-label="انتخاب پوسته">
      {options.map(({ id, label, icon: Icon }) => (
        <button key={id} className={mode === id ? "theme-option selected" : "theme-option"} onClick={() => onChange(id)} aria-label={label} aria-pressed={mode === id} title={label}>
          <Icon size={15} strokeWidth={1.8} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

function Sidebar({ activePage, onNavigate, open, onClose }: {
  activePage: string; onNavigate: (id: string) => void; open: boolean; onClose: () => void;
}) {
  const sections = [...new Set(navItems.map((item) => item.section))];
  return (
    <>
      {open && <button className="mobile-scrim" aria-label="بستن منو" onClick={onClose} />}
      <aside className={open ? "sidebar sidebar-open" : "sidebar"}>
        <div className="brand-lockup">
          <div className="brand-icon"><BrandMark /></div>
          <div><div className="brand-name">ترازبان</div><div className="brand-caption">مدیریت صندوق‌های همیاری</div></div>
          <button className="icon-button sidebar-close" onClick={onClose} aria-label="بستن منو"><X size={19} /></button>
        </div>

        <button className="fund-switcher">
          <div className="fund-avatar">م</div>
          <div className="fund-switch-text"><strong>صندوق مهرآفرین</strong><span>صندوق فعال شما</span></div>
          <ChevronDown size={16} />
        </button>

        <nav className="main-nav" aria-label="منوی اصلی">
          {sections.map((section) => (
            <div className="nav-section" key={section}>
              <div className="nav-section-title">{section}</div>
              {navItems.filter((item) => item.section === section).map(({ id, label, icon: Icon }) => (
                <button key={id} className={activePage === id ? "nav-link active" : "nav-link"} onClick={() => { onNavigate(id); onClose(); }}>
                  <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
                  {id === "loans" && <span className="nav-count">۳</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="support-card">
            <div className="support-icon"><CircleHelp size={18} /></div>
            <strong>به راهنمایی نیاز دارید؟</strong>
            <span>راهنمای بخش‌های ترازبان را ببینید.</span>
            <button onClick={() => onNavigate("help")}>مرکز راهنما <ArrowUpLeft size={14} /></button>
          </div>
          <div className="profile-row">
            <div className="profile-avatar">م‌ا</div>
            <div className="profile-info"><strong>مدیر صندوق</strong><span>حساب مدیریتی</span></div>
            <button className="icon-button profile-more" aria-label="گزینه‌های حساب"><MoreHorizontal size={19} /></button>
          </div>
        </div>
      </aside>
    </>
  );
}

function TrendChart() {
  return (
    <div className="chart-wrap">
      <div className="chart-y-labels"><span>۸۰</span><span>۶۰</span><span>۴۰</span><span>۲۰</span><span>۰</span></div>
      <svg className="trend-chart" viewBox="0 0 640 210" preserveAspectRatio="none" role="img" aria-label="نمودار روند ورودی و خروجی صندوق">
        <defs>
          <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#4b8d79" stopOpacity=".22" /><stop offset="100%" stopColor="#4b8d79" stopOpacity="0" /></linearGradient>
        </defs>
        {[20,62,104,146,188].map((y) => <line key={y} x1="0" y1={y} x2="640" y2={y} className="chart-grid" />)}
        <path d="M0 151 C35 142 42 119 78 126 S125 150 160 116 S215 94 240 110 S286 122 320 88 S370 93 400 72 S450 86 480 56 S530 70 560 42 S610 52 640 25 L640 188 L0 188Z" fill="url(#areaFill)" />
        <path d="M0 151 C35 142 42 119 78 126 S125 150 160 116 S215 94 240 110 S286 122 320 88 S370 93 400 72 S450 86 480 56 S530 70 560 42 S610 52 640 25" className="chart-line primary-line" />
        <path d="M0 171 C36 164 50 173 78 159 S126 164 160 151 S205 164 240 145 S287 156 320 137 S365 148 400 125 S448 139 480 117 S525 128 560 102 S610 115 640 91" className="chart-line secondary-line" />
        <circle cx="560" cy="42" r="4.5" className="chart-dot" />
      </svg>
      <div className="chart-x-labels"><span>فروردین</span><span>اردیبهشت</span><span>خرداد</span><span>تیر</span><span>مرداد</span><span>شهریور</span><span>مهر</span></div>
    </div>
  );
}

function DonutChart() {
  return (
    <div className="donut-layout">
      <div className="donut-chart"><div className="donut-center"><strong>۸۴٪</strong><span>وصول سهم‌ها</span></div></div>
      <div className="donut-legend">
        <div><i className="legend-dot paid" /><span>وصول‌شده</span><strong>۸۴٪</strong></div>
        <div><i className="legend-dot pending" /><span>در انتظار</span><strong>۱۱٪</strong></div>
        <div><i className="legend-dot late" /><span>معوق</span><strong>۵٪</strong></div>
      </div>
    </div>
  );
}

function Dashboard() {
  const activity = [
    { initials: "ع‌م", name: "علی محمدی", action: "پرداخت سهم ماهانه", amount: "+ ۲,۵۰۰,۰۰۰", time: "امروز، ۱۰:۴۲", type: "in" },
    { initials: "س‌ح", name: "سارا حسینی", action: "پرداخت قسط وام", amount: "+ ۱,۸۰۰,۰۰۰", time: "امروز، ۰۹:۱۸", type: "in" },
    { initials: "م‌ر", name: "محمد رضایی", action: "دریافت وام", amount: "− ۱۵,۰۰۰,۰۰۰", time: "دیروز، ۱۶:۳۵", type: "out" },
    { initials: "ن‌ک", name: "نرگس کریمی", action: "پرداخت سهم ماهانه", amount: "+ ۲,۵۰۰,۰۰۰", time: "دیروز، ۱۲:۰۶", type: "in" },
  ];
  return (
    <>
      <div className="welcome-row">
        <div><div className="eyebrow"><Sparkles size={14} /> فضای مدیریت شما</div><h1>نمای کلی صندوق</h1><p>تصویر روشنی از وضعیت مالی و جریان فعالیت صندوق داشته باشید.</p></div>
        <button className="button button-primary"><Plus size={17} /> ثبت عملیات جدید</button>
      </div>

      <div className="demo-notice"><span className="demo-pulse" /><span>پیش‌نمایش طراحی · اعداد این صفحه نمونه هستند و هنوز به اطلاعات واقعی متصل نشده‌اند.</span><ShieldCheck size={16} /></div>

      <section className="metrics-grid" aria-label="شاخص‌های اصلی صندوق">
        <article className="metric-card metric-featured">
          <div className="metric-top"><span>موجودی نقدی صندوق</span><span className="metric-icon"><Wallet size={18} /></span></div>
          <div className="metric-value">۲۴۸,۶۰۰,۰۰۰ <small>ریال</small></div>
          <div className="metric-foot"><span className="trend-positive"><ArrowDownLeft size={14} /> ۱۲.۸٪</span><span>نسبت به ماه قبل</span></div>
          <div className="metric-watermark">ت</div>
        </article>
        <article className="metric-card">
          <div className="metric-top"><span>اعضای فعال</span><span className="metric-icon soft-violet"><Users size={18} /></span></div>
          <div className="metric-value">۴۸ <small>نفر</small></div>
          <div className="metric-foot"><span className="trend-positive">+ ۳ نفر</span><span>در این ماه</span></div>
        </article>
        <article className="metric-card">
          <div className="metric-top"><span>وام‌های در جریان</span><span className="metric-icon soft-amber"><HandCoins size={18} /></span></div>
          <div className="metric-value">۱۲ <small>وام</small></div>
          <div className="metric-foot"><span className="metric-neutral">۳ درخواست</span><span>در انتظار بررسی</span></div>
        </article>
        <article className="metric-card">
          <div className="metric-top"><span>اقساط معوق</span><span className="metric-icon soft-rose"><CalendarDays size={18} /></span></div>
          <div className="metric-value">۵ <small>قسط</small></div>
          <div className="metric-foot"><span className="trend-negative">۲ مورد جدید</span><span>نیازمند پیگیری</span></div>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel trend-panel">
          <div className="panel-heading"><div><h2>جریان مالی صندوق</h2><p>مقایسه ورودی و خروجی در ماه‌های اخیر</p></div><button className="select-chip">۷ ماه اخیر <ChevronDown size={14} /></button></div>
          <div className="chart-legend"><span><i className="legend-line income" /> ورودی صندوق</span><span><i className="legend-line expense" /> خروجی صندوق</span></div>
          <TrendChart />
        </article>
        <article className="panel collection-panel">
          <div className="panel-heading"><div><h2>وضعیت وصول سهم‌ها</h2><p>عملکرد دوره جاری</p></div><button className="more-button" aria-label="گزینه‌های بیشتر"><MoreHorizontal size={20} /></button></div>
          <DonutChart />
          <div className="collection-foot"><span>وضعیت کلی</span><strong>مطلوب <span>●</span></strong></div>
        </article>
      </section>

      <section className="lower-grid">
        <article className="panel activity-panel">
          <div className="panel-heading"><div><h2>آخرین فعالیت‌ها</h2><p>تازه‌ترین رویدادهای ثبت‌شده در صندوق</p></div><button className="text-button">مشاهده همه <ArrowUpLeft size={15} /></button></div>
          <div className="activity-list">
            {activity.map((item) => <div className="activity-item" key={item.name}>
              <div className="activity-avatar">{item.initials}</div>
              <div className="activity-copy"><strong>{item.name}</strong><span>{item.action}</span></div>
              <div className="activity-amount"><strong className={item.type === "in" ? "amount-in" : "amount-out"}>{item.amount} <small>ریال</small></strong><span>{item.time}</span></div>
              <span className={item.type === "in" ? "activity-type type-in" : "activity-type type-out"}>{item.type === "in" ? "دریافت" : "پرداخت"}</span>
            </div>)}
          </div>
        </article>
        <article className="panel attention-panel">
          <div className="panel-heading"><div><h2>نیازمند توجه</h2><p>مواردی که بهتر است بررسی شوند</p></div><span className="attention-count">۳</span></div>
          <div className="attention-list">
            <div className="attention-item"><span className="attention-symbol rose"><CalendarDays size={17} /></span><div><strong>اقساط سررسید گذشته</strong><span>۵ قسط از ۳ عضو</span></div><ArrowUpLeft size={16} /></div>
            <div className="attention-item"><span className="attention-symbol amber"><HandCoins size={17} /></span><div><strong>درخواست وام جدید</strong><span>۳ درخواست در صف بررسی</span></div><ArrowUpLeft size={16} /></div>
            <div className="attention-item"><span className="attention-symbol blue"><Users size={17} /></span><div><strong>تکمیل اطلاعات اعضا</strong><span>۲ پرونده ناقص</span></div><ArrowUpLeft size={16} /></div>
          </div>
          <button className="attention-link">بررسی همه موارد <ArrowUpLeft size={15} /></button>
        </article>
      </section>
      <footer className="page-footer"><span>ترازبان · فضای مدیریت صندوق‌های همیاری</span><span>طراحی نسخه اولیه · ۰.۱.۰</span></footer>
    </>
  );
}

function Placeholder({ page }: { page: string }) {
  return <div className="placeholder-panel"><div className="placeholder-mark"><Settings2 size={26} /></div><h2>{pageTitles[page] ?? "مرکز راهنما"}</h2><p>ساختار این بخش در مرحله بعدی توسعه پنل مدیریت تکمیل می‌شود.</p><span>این بخش هنوز به عملیات واقعی متصل نشده است.</span></div>;
}

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("tarazban-theme");
    return saved === "dark" || saved === "system" ? saved : "light";
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const today = useMemo(() => new Intl.DateTimeFormat("fa-IR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date()), []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const resolved = themeMode === "system" ? (media.matches ? "dark" : "light") : themeMode;
      document.documentElement.dataset.theme = resolved;
      document.documentElement.style.colorScheme = resolved;
    };
    applyTheme();
    media.addEventListener("change", applyTheme);
    localStorage.setItem("tarazban-theme", themeMode);
    return () => media.removeEventListener("change", applyTheme);
  }, [themeMode]);

  const handleNavigate = (id: string) => setActivePage(id);
  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="main-area">
        <header className="topbar">
          <div className="topbar-right">
            <button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="باز کردن منو"><Menu size={21} /></button>
            <div className="breadcrumb"><span>ترازبان</span><span className="breadcrumb-separator">/</span><strong>{pageTitles[activePage] ?? "راهنما"}</strong></div>
          </div>
          <div className="topbar-left">
            <div className="date-label"><CalendarDays size={15} /><span>{today}</span></div>
            <div className="topbar-divider" />
            <ThemePicker mode={themeMode} onChange={setThemeMode} />
            <button className="icon-button search-trigger" aria-label="جستجو" onClick={() => setSearchOpen(!searchOpen)}><Search size={19} /></button>
            <button className="icon-button notification-button" aria-label="اعلان‌ها"><Bell size={19} /><i /></button>
            <div className="topbar-profile"><div className="profile-avatar small">م‌ا</div><ChevronDown size={15} /></div>
          </div>
        </header>
        {searchOpen && <div className="search-popover"><Search size={17} /><input autoFocus placeholder="جستجو در بخش‌های صندوق..." /><button onClick={() => setSearchOpen(false)} aria-label="بستن جستجو"><X size={16} /></button></div>}
        <div className="page-content">
          {activePage === "dashboard" ? <Dashboard /> : <Placeholder page={activePage} />}
        </div>
      </main>
    </div>
  );
}
