import { useMemo, useState } from "react";
import {
  Activity, Building2, CalendarClock, CheckCircle2, CircleAlert,
  Clock3, History, LayoutDashboard, LogOut, PauseCircle, PlayCircle,
  Search, ShieldCheck, Users, Wallet, X,
} from "lucide-react";

type Plan = "basic" | "professional" | "special";
type Duration = "week" | "month" | "year" | "lifetime";
type Status = "active" | "suspended" | "expired";
type EventRow = { id:number; action:string; note:string; createdAt:Date; detail:string };
type Manager = {
  id:number; name:string; username:string; plan:Plan|null; duration:Duration|null;
  status:Status|"none"; startsAt:Date|null; expiresAt:Date|null; history:EventRow[];
};
const planNames:Record<Plan,string>={basic:"پایه",professional:"حرفه‌ای",special:"ویژه"};
const durationNames:Record<Duration,string>={week:"یک هفته",month:"یک ماه تقویمی",year:"یک سال تقویمی",lifetime:"مادام‌العمر"};
const statusNames:Record<string,string>={active:"فعال",suspended:"تعلیق‌شده",expired:"منقضی‌شده",none:"بدون اشتراک"};
const actionNames:Record<string,string>={activate:"فعال‌سازی",renew:"تمدید",change:"تغییر اشتراک",suspend:"تعلیق",resume:"فعال‌سازی مجدد"};
const fa=(n:number)=>new Intl.NumberFormat("fa-IR").format(n);
const fmt=(d:Date|null)=>d?new Intl.DateTimeFormat("fa-IR",{dateStyle:"medium"}).format(d):"بدون تاریخ انقضا";
function addDuration(from:Date,duration:Duration):Date|null{
  const d=new Date(from);
  if(duration==="week")d.setDate(d.getDate()+7);
  else if(duration==="month")d.setMonth(d.getMonth()+1);
  else if(duration==="year")d.setFullYear(d.getFullYear()+1);
  else return null;
  return d;
}
const initial:Manager[]=[
  {id:101,name:"علی محمدی",username:"ali.m",plan:"professional",duration:"month",status:"active",startsAt:new Date(Date.now()-12*86400000),expiresAt:new Date(Date.now()+18*86400000),history:[{id:1,action:"activate",note:"فعال‌سازی اولیه توسط مالک",createdAt:new Date(Date.now()-12*86400000),detail:"حرفه‌ای · یک ماه تقویمی"}]},
  {id:102,name:"سارا حسینی",username:"sara.h",plan:"basic",duration:"year",status:"active",startsAt:new Date(Date.now()-75*86400000),expiresAt:new Date(Date.now()+290*86400000),history:[{id:2,action:"renew",note:"تمدید سالانه",createdAt:new Date(Date.now()-75*86400000),detail:"پایه · یک سال تقویمی"}]},
  {id:103,name:"محمد رضایی",username:"m.rezaei",plan:"special",duration:"month",status:"suspended",startsAt:new Date(Date.now()-40*86400000),expiresAt:new Date(Date.now()-10*86400000),history:[{id:3,action:"suspend",note:"تعلیق موقت",createdAt:new Date(Date.now()-5*86400000),detail:"ویژه · یک ماه تقویمی"}]},
  {id:104,name:"نرگس کریمی",username:"n.karimi",plan:null,duration:null,status:"none",startsAt:null,expiresAt:null,history:[]},
];
export default function OwnerPreview(){
  const [managers,setManagers]=useState(initial);
  const [selected,setSelected]=useState<number|null>(null);
  const [plan,setPlan]=useState<Plan>("basic");
  const [duration,setDuration]=useState<Duration>("month");
  const [note,setNote]=useState("");
  const [query,setQuery]=useState("");
  const [tab,setTab]=useState<"overview"|"managers"|"funds">("managers");
  const [toast,setToast]=useState("");
  const manager=managers.find(x=>x.id===selected)??null;
  const filtered=useMemo(()=>managers.filter(x=>(x.name+" "+x.username).toLowerCase().includes(query.toLowerCase())),[managers,query]);
  const active=managers.filter(x=>x.status==="active").length;
  function open(item:Manager){
    setSelected(item.id);setPlan(item.plan??"basic");setDuration(item.duration??"month");setNote("");
  }
  function save(){
    if(!manager)return;
    const now=new Date();
    const nextExpiry=addDuration(now,duration);
    const action=manager.status==="none"?"activate":manager.plan!==plan||manager.duration!==duration?"change":"renew";
    const updated:Manager={...manager,plan,duration,status:"active",startsAt:manager.startsAt??now,expiresAt:nextExpiry,
      history:[{id:Date.now(),action,note:note.trim()||"ثبت آزمایشی توسط مالک",createdAt:now,detail:planNames[plan]+" · "+durationNames[duration]},...manager.history]};
    setManagers(rows=>rows.map(x=>x.id===manager.id?updated:x));setToast("تغییر اشتراک به‌صورت آزمایشی ثبت شد.");setSelected(null);
  }
  function changeStatus(action:"suspend"|"resume"){
    if(!manager)return;
    const now=new Date();
    setManagers(rows=>rows.map(x=>x.id===manager.id?{...x,status:action==="suspend"?"suspended":"active",history:[{id:Date.now(),action,note:note.trim()||"ثبت آزمایشی توسط مالک",createdAt:now,detail:statusNames[action==="suspend"?"suspended":"active"]},...x.history]}:x));
    setToast("وضعیت اشتراک به‌صورت آزمایشی تغییر کرد.");setSelected(null);
  }
  return <div className="op-shell" dir="rtl">
    <aside className="op-sidebar">
      <div className="op-brand"><span className="op-brand-mark">ت</span><div><strong>ترازبان</strong><small>مرکز راهبری سامانه</small></div></div>
      <div className="op-side-caption">مدیریت سامانه</div>
      <button className={"op-nav "+(tab==="overview"?"selected":"")} onClick={()=>setTab("overview")}><LayoutDashboard size={18}/> نمای کلی</button>
      <button className={"op-nav "+(tab==="managers"?"selected":"")} onClick={()=>setTab("managers")}><Users size={18}/> مدیران صندوق <span>{fa(managers.length)}</span></button>
      <button className={"op-nav "+(tab==="funds"?"selected":"")} onClick={()=>setTab("funds")}><Building2 size={18}/> صندوق‌ها <span>۳</span></button>
      <div className="op-sidebar-bottom"><div className="op-profile"><span>م</span><div><strong>مالک سامانه</strong><small>دسترسی مالک</small></div></div><div className="op-logout"><LogOut size={15}/> خروج امن</div></div>
    </aside>
    <main className="op-main">
      <header className="op-topbar"><div><span>ترازبان</span><b>/</b><strong>{tab==="managers"?"مدیریت مدیران":tab==="funds"?"مدیریت صندوق‌ها":"نمای کلی سامانه"}</strong></div><span className="op-role"><ShieldCheck size={15}/> مالک سامانه</span></header>
      <section className="op-content">
        <div className="op-demo-alert"><CircleAlert size={16}/> نسخه پیش‌نمایش؛ اطلاعات نمونه است و هیچ تغییری در سرور یا پایگاه داده ذخیره نمی‌شود.</div>
        <div className="op-heading"><div><small><Activity size={14}/> مرکز کنترل ترازبان</small><h1>{tab==="managers"?"مدیران صندوق":tab==="funds"?"صندوق‌های ثبت‌شده":"نمای کلی سامانه"}</h1><p>مدیریت مدیران، وضعیت دسترسی و اشتراک‌های سامانه</p></div><button className="op-refresh" onClick={()=>{setManagers([...managers]);setToast("اطلاعات نمونه تازه‌سازی شد.");}}>بروزرسانی</button></div>
        <div className="op-stats">
          <article><span><Users size={18}/></span><small>کل مدیران</small><strong>{fa(managers.length)}</strong><em>مدیر ثبت‌شده</em></article>
          <article><span><CheckCircle2 size={18}/></span><small>اشتراک فعال</small><strong>{fa(active)}</strong><em>دارای دسترسی فعال</em></article>
          <article><span><Clock3 size={18}/></span><small>بدون اشتراک / تعلیق</small><strong>{fa(managers.length-active)}</strong><em>نیازمند بررسی</em></article>
          <article><span><Wallet size={18}/></span><small>طرح‌های اشتراک</small><strong>۳</strong><em>پایه، حرفه‌ای، ویژه</em></article>
        </div>
        <section className="op-panel">
          <div className="op-panel-head"><div><h2>{tab==="managers"?"فهرست مدیران":"مدیران و اشتراک‌ها"}</h2><p>برای مشاهده جزئیات و مدیریت اشتراک، روی دکمه اشتراک بزنید.</p></div><label className="op-search"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="جستجوی مدیر..."/></label></div>
          <div className="op-table-wrap"><table><thead><tr><th>مدیر</th><th>نام کاربری</th><th>طرح اشتراک</th><th>وضعیت</th><th>پایان اشتراک</th><th>عملیات</th></tr></thead><tbody>
            {filtered.map(item=><tr key={item.id}><td><strong>{item.name}</strong><small>شناسه: {fa(item.id)}</small></td><td dir="ltr">{item.username}</td><td>{item.plan?planNames[item.plan]:"—"}</td><td><span className={"op-status "+item.status}>{statusNames[item.status]}</span></td><td>{fmt(item.expiresAt)}</td><td><button className="op-sub-btn" onClick={()=>open(item)}><CalendarClock size={14}/> اشتراک</button></td></tr>)}
          </tbody></table></div>
        </section>
        <footer className="op-footer">ترازبان · پیش‌نمایش پنل مالک <span>نسخه آزمایشی فاز ۹.۲</span></footer>
      </section>
    </main>
    {manager&&<div className="op-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null);}}>
      <section className="op-modal" role="dialog" aria-modal="true" aria-labelledby="op-modal-title">
        <div className="op-modal-head"><div><h2 id="op-modal-title">مدیریت اشتراک مدیر</h2><p>{manager.name} · شناسه {fa(manager.id)}</p></div><button onClick={()=>setSelected(null)} aria-label="بستن"><X size={18}/></button></div>
        <div className="op-summary">
          <div><small>وضعیت فعلی</small><strong className={"op-state "+manager.status}>{statusNames[manager.status]}</strong></div>
          <div><small>طرح و مدت</small><strong>{manager.plan?planNames[manager.plan]+" · "+durationNames[manager.duration! ]:"—"}</strong></div>
          <div><small>پایان اشتراک</small><strong>{fmt(manager.expiresAt)}</strong></div>
          <div><small>زمان باقی‌مانده</small><strong>{manager.expiresAt?fa(Math.max(0,Math.ceil((manager.expiresAt.getTime()-Date.now())/86400000)))+" روز":manager.status==="active"?"مادام‌العمر":"—"}</strong></div>
        </div>
        <div className="op-form"><h3>{manager.status==="none"?"ایجاد اشتراک": "فعال‌سازی یا تمدید اشتراک"}</h3>
          <div className="op-fields"><label>طرح اشتراک<select value={plan} onChange={e=>setPlan(e.target.value as Plan)}><option value="basic">پایه</option><option value="professional">حرفه‌ای</option><option value="special">ویژه</option></select></label>
            <label>مدت اشتراک<select value={duration} onChange={e=>setDuration(e.target.value as Duration)}><option value="week">یک هفته (۷ روز)</option><option value="month">یک ماه تقویمی</option><option value="year">یک سال تقویمی</option><option value="lifetime">مادام‌العمر</option></select></label></div>
          <label>یادداشت مالک (اختیاری)<input value={note} onChange={e=>setNote(e.target.value)} maxLength={300} placeholder="مثلاً تمدید با توافق مالک"/></label>
          <button className="op-primary" onClick={save}>ثبت تغییر / تمدید</button>
        </div>
        {manager.status==="active"||manager.status==="suspended"?<div className="op-status-actions">{manager.status==="active"?<button className="op-danger" onClick={()=>changeStatus("suspend")}><PauseCircle size={14}/> تعلیق اشتراک</button>:<button className="op-secondary" onClick={()=>changeStatus("resume")}><PlayCircle size={14}/> فعال‌سازی مجدد</button>}</div>:null}
        <div className="op-history"><h3><History size={15}/> تاریخچه تغییرات</h3>{manager.history.length?manager.history.map(ev=><article key={ev.id}><div><strong>{actionNames[ev.action]??ev.action}</strong><small>{fmt(ev.createdAt)}</small></div><p>{ev.detail}</p>{ev.note&&<small>{ev.note}</small>}</article>):<p>هنوز رویدادی برای این اشتراک ثبت نشده است.</p>}</div>
        <div className="op-modal-bottom"><button onClick={()=>setSelected(null)}>بستن</button></div>
      </section>
    </div>}
    {toast&&<button className="op-toast" onClick={()=>setToast("")}><CheckCircle2 size={16}/>{toast}<X size={14}/></button>}
  </div>;
}
