import { useState } from "react";
import { CalendarClock, CheckCircle2, CircleAlert, Clock3, Eye, ShieldCheck } from "lucide-react";
import "./manager-subscription-preview.css";

type Status = "active" | "expired" | "suspended" | "missing";
const labels: Record<Status, string> = {
  active: "فعال",
  expired: "منقضی‌شده",
  suspended: "تعلیق‌شده",
  missing: "ثبت‌نشده",
};
const plans: Record<Status, string> = {
  active: "حرفه‌ای",
  expired: "پایه",
  suspended: "ویژه",
  missing: "—",
};
const durations: Record<Status, string> = {
  active: "یک ماه تقویمی",
  expired: "یک هفته",
  suspended: "یک سال تقویمی",
  missing: "—",
};

export default function ManagerSubscriptionPreview() {
  const [status, setStatus] = useState<Status>("active");
  const remaining = status === "active" ? 18 : status === "expired" ? 0 : status === "suspended" ? 243 : null;
  const active = status === "active";
  const noSubscription = status === "missing";

  return (
    <main className="subscription-preview-shell">
      <section className="subscription-preview-card">
        <header className="subscription-preview-brand">
          <div className="subscription-preview-mark"><ShieldCheck size={23}/></div>
          <div><strong>ترازبان</strong><span>پنل وضعیت اشتراک مدیر</span></div>
          <span className="subscription-preview-demo"><Eye size={13}/> پیش‌نمایش</span>
        </header>
        <div className="subscription-preview-notice">این صفحه فقط پیش‌نمایش رابط کاربری با داده نمونه است و به حساب یا پایگاه داده واقعی متصل نیست.</div>

        <div className="subscription-preview-switch">
          <span>وضعیت نمونه برای بررسی طراحی</span>
          <div>
            {(["active","expired","suspended","missing"] as Status[]).map((value) => (
              <button key={value} className={status===value?"selected":""} onClick={()=>setStatus(value)}>{labels[value]}</button>
            ))}
          </div>
        </div>

        <div className={`subscription-preview-status ${active?"active":"blocked"}`}>
          {active?<CheckCircle2 size={22}/>:<CircleAlert size={22}/>}
          <div><strong>اشتراک {labels[status]}</strong><span>{active?"دسترسی عملیاتی مدیر فعال است.":"دسترسی عملیاتی تا تعیین تکلیف اشتراک غیرفعال است."}</span></div>
        </div>

        <div className="subscription-preview-greeting">
          <h1>مدیر نمونه ترازبان</h1>
          <p>وضعیت فعلی حساب مدیر صندوق</p>
        </div>

        <div className="subscription-preview-grid">
          <article><span>طرح اشتراک</span><strong>{plans[status]}</strong></article>
          <article><span>مدت اشتراک</span><strong>{durations[status]}</strong></article>
          <article><span>تاریخ شروع</span><strong>{noSubscription?"—":"۱۴۰۵/۰۸/۰۱ · ۱۰:۳۰"}</strong></article>
          <article><span>تاریخ پایان</span><strong>{noSubscription?"—":status==="active"?"۱۴۰۵/۰۹/۰۱ · ۱۰:۳۰":status==="expired"?"۱۴۰۵/۰۸/۰۸ · ۱۰:۳۰":"۱۴۰۶/۰۸/۰۱ · ۱۰:۳۰"}</strong></article>
          <article className="subscription-preview-days"><span><Clock3 size={14}/> زمان باقی‌مانده</span><strong>{remaining===null?"—":remaining===0?"۰ روز":`${new Intl.NumberFormat("fa-IR").format(remaining)} روز`}</strong></article>
        </div>

        {!active&&<div className="subscription-preview-contact"><CalendarClock size={18}/><div><strong>{noSubscription?"هنوز اشتراکی برای حساب شما ثبت نشده است.":status==="expired"?"مهلت اشتراک شما به پایان رسیده است.":"اشتراک شما توسط مالک سامانه تعلیق شده است."}</strong><p>برای فعال‌سازی، تمدید یا پیگیری وضعیت، با مالک سامانه تماس بگیرید. مدیر امکان تغییر مستقیم اشتراک را ندارد.</p></div></div>}
        {active&&<p className="subscription-preview-active-note">اشتراک شما معتبر است. امکانات مدیریتی از طریق پنل اصلی در دسترس خواهند بود.</p>}

        <footer className="subscription-preview-footer"><span>ترازبان · مدیریت اشتراک مدیران</span><span>داده نمونه</span></footer>
      </section>
    </main>
  );
}
