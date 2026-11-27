import { useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, ClipboardList, CreditCard, FileImage, History, ShieldCheck, Upload, Wallet, X } from "lucide-react";

type Plan="basic"|"professional"|"special";
type Duration="week"|"month"|"year"|"lifetime";
type Status="pending"|"approved"|"rejected";
type Payment={id:number;manager:string;username:string;plan:Plan;duration:Duration;amount:number;tracking:string;note:string;status:Status;createdAt:string;decisionNote:string;receiptUrl:string};
const plans:Record<Plan,string>={basic:"پایه",professional:"حرفه‌ای",special:"ویژه"};
const durations:Record<Duration,string>={week:"یک هفته",month:"یک ماه تقویمی",year:"یک سال تقویمی",lifetime:"مادام‌العمر"};
const statuses:Record<Status,string>={pending:"در انتظار بررسی",approved:"تأییدشده",rejected:"ردشده"};
const fa=(n:number)=>new Intl.NumberFormat("fa-IR").format(n);
const prices:Record<Plan,Record<Duration,number>>={
 basic:{week:900000,month:2500000,year:25000000,lifetime:90000000},
 professional:{week:1500000,month:4500000,year:45000000,lifetime:150000000},
 special:{week:2200000,month:6500000,year:65000000,lifetime:220000000},
};
const initial:Payment[]=[
 {id:2401,manager:"علی محمدی",username:"ali.m",plan:"professional",duration:"month",amount:4500000,tracking:"78394125",note:"پرداخت از همراه‌بانک",status:"pending",createdAt:"۱۴۰۵/۰۹/۰۶ · ۱۰:۴۲",decisionNote:"",receiptUrl:""},
 {id:2402,manager:"سارا حسینی",username:"sara.h",plan:"basic",duration:"year",amount:25000000,tracking:"99120573",note:"",status:"approved",createdAt:"۱۴۰۵/۰۹/۰۵ · ۱۶:۱۸",decisionNote:"واریز بررسی شد.",receiptUrl:""},
 {id:2403,manager:"محمد رضایی",username:"m.rezaei",plan:"special",duration:"month",amount:6500000,tracking:"66182049",note:"",status:"rejected",createdAt:"۱۴۰۵/۰۹/۰۳ · ۰۹:۱۵",decisionNote:"شماره پیگیری با رسید مطابقت نداشت.",receiptUrl:""},
];

export default function ManualPaymentPreview(){
 const [role,setRole]=useState<"manager"|"owner">("manager");
 const [plan,setPlan]=useState<Plan>("professional");
 const [duration,setDuration]=useState<Duration>("month");
 const [tracking,setTracking]=useState("");
 const [note,setNote]=useState("");
 const [file,setFile]=useState<File|null>(null);
 const [requests,setRequests]=useState(initial);
 const [selected,setSelected]=useState<number|null>(2401);
 const [decisionNote,setDecisionNote]=useState("");
 const [filter,setFilter]=useState<Status|"all">("pending");
 const [toast,setToast]=useState("");
 const [beneficiary,setBeneficiary]=useState("حساب نمونه ترازبان");
 const [bank,setBank]=useState("بانک نمونه");
 const [iban,setIban]=useState("IR00 •••• •••• •••• •••• •••• ••");
 const [account,setAccount]=useState("••••••••••");
 const [instructions,setInstructions]=useState("لطفاً پس از واریز، شماره پیگیری را وارد و تصویر رسید را ارسال کنید.");
 const [editing,setEditing]=useState(false);
 const [receiptPreview,setReceiptPreview]=useState("");
 const current=requests.find(x=>x.id===selected)??null;
 const amount=prices[plan][duration];
 const filtered=useMemo(()=>requests.filter(x=>filter==="all"||x.status===filter),[requests,filter]);
 function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(!file){setToast("برای ثبت درخواست، تصویر رسید را انتخاب کنید.");return;}
  const url=URL.createObjectURL(file);
  const item:Payment={id:Math.max(...requests.map(x=>x.id))+1,manager:"مدیر نمونه",username:"demo.manager",plan,duration,amount,tracking:tracking.trim(),note,status:"pending",createdAt:"همین لحظه",decisionNote:"",receiptUrl:url};
  setRequests(rows=>[item,...rows]);setTracking("");setNote("");setFile(null);setToast("درخواست نمونه ثبت شد و در صف بررسی مالک قرار گرفت.");
 }
 function decide(status:Status){
  if(!current)return;
  setRequests(rows=>rows.map(x=>x.id===current.id?{...x,status,decisionNote:decisionNote.trim()}:x));
  setToast(status==="approved"?"درخواست نمونه تأیید شد؛ اشتراک نمایشی فعال شد.":"درخواست نمونه رد شد.");
  setSelected(null);setDecisionNote("");setReceiptPreview("");
 }
 function openRequest(item:Payment){
  setSelected(item.id);setDecisionNote(item.decisionNote);setReceiptPreview(item.receiptUrl);
 }
 return <main className="mp-shell" dir="rtl">
  <header className="mp-top"><a href="./owner.html" className="mp-brand"><span><ShieldCheck size={22}/></span><b>ترازبان</b><small>پیش‌نمایش پرداخت حق اشتراک</small></a><span className="mp-demo">محیط آزمایشی · داده ساختگی</span></header>
  <section className="mp-wrap">
   <div className="mp-intro"><div><small><CreditCard size={14}/> فاز ۹.۴ · پرداخت دستی اشتراک</small><h1>گردش‌کار پرداخت حق اشتراک</h1><p>برای بررسی هر دو سمت فرایند، نقش مدیر و مالک را جابه‌جا کنید. تمام تغییرات فقط در همین صفحه و به‌صورت نمونه انجام می‌شود.</p></div><div className="mp-role-switch"><button className={role==="manager"?"active":""} onClick={()=>setRole("manager")}>نمای مدیر صندوق</button><button className={role==="owner"?"active":""} onClick={()=>setRole("owner")}>نمای مالک سامانه</button></div></div>
   <div className="mp-warning"><CircleAlert size={16}/> اطلاعات حساب و تعرفه‌ها نمایشی هستند؛ هیچ پرداخت واقعی، بارگذاری سرور یا تغییری در پایگاه داده انجام نمی‌شود.</div>
   {role==="manager"?<div className="mp-manager-layout">
    <section className="mp-card"><div className="mp-card-head"><div><h2><Wallet size={17}/> اطلاعات واریز</h2><p>مبلغ و مشخصات حساب مقصد را پیش از واریز بررسی کنید.</p></div><span className="mp-tag">حساب مقصد</span></div>
     <div className="mp-bank-grid"><div><small>به نام</small><strong>{beneficiary}</strong></div><div><small>بانک</small><strong>{bank}</strong></div><div><small>شماره شبا</small><strong dir="ltr">{iban}</strong></div><div><small>شماره حساب</small><strong dir="ltr">{account}</strong></div></div><p className="mp-instructions">{instructions}</p>
    </section>
    <section className="mp-card"><div className="mp-card-head"><div><h2><Upload size={17}/> ثبت درخواست پرداخت</h2><p>پس از واریز، اطلاعات پرداخت و رسید را ارسال کنید.</p></div></div>
     <form className="mp-form" onSubmit={submit}>
      <div className="mp-fields"><label>طرح اشتراک<select value={plan} onChange={e=>setPlan(e.target.value as Plan)}>{Object.entries(plans).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label><label>مدت اشتراک<select value={duration} onChange={e=>setDuration(e.target.value as Duration)}>{Object.entries(durations).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label></div>
      <div className="mp-amount"><span>مبلغ قابل پرداخت</span><strong>{fa(amount)} <small>ریال</small></strong></div>
      <label>شماره پیگیری بانکی<input value={tracking} onChange={e=>setTracking(e.target.value)} maxLength={80} required placeholder="شماره پیگیری رسید"/></label>
      <label>توضیح (اختیاری)<textarea rows={2} value={note} onChange={e=>setNote(e.target.value)} maxLength={1000} placeholder="توضیحات تکمیلی"/></label>
      <label className="mp-file">تصویر رسید <small>JPG، PNG یا WebP · حداکثر ۵ مگابایت</small><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setFile(e.target.files?.[0]??null)} required/><span><FileImage size={17}/>{file?file.name:"انتخاب تصویر رسید"}</span></label>
      <button className="mp-primary" disabled={requests.some(x=>x.status==="pending"&&x.username==="demo.manager")}>ثبت درخواست بررسی پرداخت</button>
     </form>
    </section>
    <section className="mp-card"><div className="mp-card-head"><div><h2><History size={17}/> درخواست‌های پرداخت من</h2><p>وضعیت درخواست‌ها و توضیح مالک</p></div></div>
     {requests.filter(x=>x.username==="demo.manager").length===0?<div className="mp-empty">هنوز درخواستی از این حساب نمونه ثبت نشده است.</div>:requests.filter(x=>x.username==="demo.manager").map(x=><div className="mp-history-row" key={x.id}><div><strong>{plans[x.plan]} · {durations[x.duration]}</strong><span className={"mp-status "+x.status}>{statuses[x.status]}</span></div><small>{fa(x.amount)} ریال · پیگیری {x.tracking}</small>{x.decisionNote&&<p>{x.decisionNote}</p>}</div>)}
    </section>
   </div>:<div className="mp-owner-layout">
    <section className="mp-card mp-owner-config"><div className="mp-card-head"><div><h2><Wallet size={17}/> حساب مقصد و تعرفه‌ها</h2><p>اطلاعاتی که در صفحه مدیر نمایش داده می‌شود.</p></div><button className="mp-ghost" onClick={()=>setEditing(x=>!x)}>{editing?"بستن ویرایش":"ویرایش اطلاعات"}</button></div>
     {editing?<div className="mp-form"><label>نام صاحب حساب<input value={beneficiary} onChange={e=>setBeneficiary(e.target.value)}/></label><label>نام بانک<input value={bank} onChange={e=>setBank(e.target.value)}/></label><label>شماره شبا<input dir="ltr" value={iban} onChange={e=>setIban(e.target.value)}/></label><label>شماره حساب<input dir="ltr" value={account} onChange={e=>setAccount(e.target.value)}/></label><label>توضیحات پرداخت<textarea rows={2} value={instructions} onChange={e=>setInstructions(e.target.value)}/></label><button className="mp-primary" onClick={()=>{setEditing(false);setToast("تنظیمات نمونه ذخیره شد.");}}>ذخیره تنظیمات نمونه</button></div>:<div className="mp-bank-grid"><div><small>به نام</small><strong>{beneficiary}</strong></div><div><small>بانک</small><strong>{bank}</strong></div><div><small>شماره شبا</small><strong dir="ltr">{iban}</strong></div><div><small>شماره حساب</small><strong dir="ltr">{account}</strong></div></div>}
     <div className="mp-price-list">{Object.entries(plans).map(([p,label])=><div key={p}><strong>{label}</strong><span>{fa(prices[p as Plan].month)} ریال / ماه</span></div>)}</div>
    </section>
    <section className="mp-card"><div className="mp-card-head"><div><h2><ClipboardList size={17}/> صف بررسی پرداخت</h2><p>درخواست را باز کنید، رسید را ببینید و تصمیم ثبت کنید.</p></div><span className="mp-count">{fa(requests.filter(x=>x.status==="pending").length)} در انتظار</span></div>
     <div className="mp-filters">{(["pending","approved","rejected","all"] as const).map(x=><button key={x} className={filter===x?"active":""} onClick={()=>setFilter(x)}>{x==="all"?"همه":statuses[x]}</button>)}</div>
     {filtered.map(item=><button className="mp-request" key={item.id} onClick={()=>openRequest(item)}><span className="mp-avatar"><FileImage size={18}/></span><span className="mp-request-copy"><strong>{item.manager} · {item.username}</strong><small>{plans[item.plan]} · {durations[item.duration]} · پیگیری {item.tracking}</small><small>{item.createdAt}</small></span><span className="mp-request-end"><b>{fa(item.amount)} ریال</b><small className={"mp-status "+item.status}>{statuses[item.status]}</small></span></button>)}
     {!filtered.length&&<div className="mp-empty">درخواستی در این وضعیت وجود ندارد.</div>}
    </section>
   </div>}
  </section>
  {current&&role==="owner"&&<div className="mp-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null);}}><section className="mp-modal" role="dialog" aria-modal="true">
   <header><div><h2>بررسی درخواست #{fa(current.id)}</h2><p>{current.manager} · {current.username}</p></div><button onClick={()=>setSelected(null)}><X size={18}/></button></header>
   <div className="mp-review-grid"><div><small>مبلغ</small><strong>{fa(current.amount)} ریال</strong></div><div><small>شماره پیگیری</small><strong>{current.tracking}</strong></div><div><small>طرح و مدت</small><strong>{plans[current.plan]} · {durations[current.duration]}</strong></div><div><small>وضعیت</small><strong>{statuses[current.status]}</strong></div></div>
   {current.note&&<p className="mp-instructions">{current.note}</p>}
   {receiptPreview?<img className="mp-receipt" src={receiptPreview} alt="رسید نمونه"/>:<div className="mp-receipt-placeholder">رسید نمونه درخواست</div>}
   {current.status==="pending"?<><label className="mp-form mp-decision">توضیح تصمیم (اختیاری)<textarea rows={2} value={decisionNote} onChange={e=>setDecisionNote(e.target.value)}/></label><div className="mp-modal-actions"><button className="mp-reject" onClick={()=>decide("rejected")}>رد درخواست</button><button className="mp-primary" onClick={()=>decide("approved")}>تأیید و فعال‌سازی اشتراک</button></div></>:<p className="mp-final-note">این درخواست قبلاً {statuses[current.status]} شده است. {current.decisionNote}</p>}
  </section></div>}
  {toast&&<button className="mp-toast" onClick={()=>setToast("")}><CheckCircle2 size={16}/>{toast}<X size={14}/></button>}
  <footer className="mp-footer">ترازبان · پیش‌نمایش رابط پرداخت دستی اشتراک <a href="./owner.html">بازگشت به پنل مالک</a></footer>
 </main>;
}