const KEY="cosmic-planner-v1";
const defaultState={
  goals:[{id:1,title:"پیشرفت در ریاضی",progress:70,deadline:"",notes:"تمرین و مرور منظم"}],
  tasks:[{id:1,title:"حل تمرین ریاضی",date:"",time:"17:00",done:false,category:"study"},
         {id:2,title:"مطالعه فصل ۳ علوم",date:"",time:"18:30",done:false,category:"study"}],
  habits:[{id:1,title:"مطالعه روزانه",done:false},{id:2,title:"ورزش/تحرک",done:false},{id:3,title:"مرتب کردن اتاق",done:false},{id:4,title:"استراحت از صفحه‌نمایش",done:false}],
  subjects:[{id:1,title:"ریاضی",progress:70,hours:"12 ساعت"},{id:2,title:"علوم",progress:60,hours:"8 ساعت"}],
  settings:{name:"ستاره",theme:"cosmic"}
};
let state=JSON.parse(localStorage.getItem(KEY)||"null")||defaultState;
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const app=document.querySelector("#app");
const title=document.querySelector("#pageTitle");
const greeting=document.querySelector("#greeting");
const today=()=>new Date().toLocaleDateString("fa-IR",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
greeting.textContent=today();

const views={
dashboard(){
 const done=state.tasks.filter(x=>x.done).length, habitDone=state.habits.filter(x=>x.done).length;
 return `<div class="grid cols-3">
  <section class="card hero"><div class="row"><div><div class="muted">خوش اومدی، ${esc(state.settings.name)} ✦</div><div class="big">امروز یک قدم به هدفت نزدیک‌تری.</div><p class="muted">برنامه‌ات را از اینجا مدیریت کن؛ همه‌چیز در یک جای آرام و کهکشانی.</p></div><div class="ring" style="--p:${Math.round((done/Math.max(state.tasks.length,1))*100)}%"><span>${Math.round((done/Math.max(state.tasks.length,1))*100)}%</span></div></div></section>
  <section class="card"><div class="section-head"><h3>⭐ سه کار مهم</h3><button class="ghost" onclick="openTask()">＋</button></div>${taskList(3)}</section>
  <section class="card"><h3>🌙 امروز</h3><div class="list"><div class="item"><span>کارهای انجام‌شده</span><b>${done}</b></div><div class="item"><span>عادت‌ها</span><b>${habitDone}/${state.habits.length}</b></div><div class="item"><span>هدف‌ها</span><b>${state.goals.length}</b></div></div></section>
  <section class="card"><h3>📚 پیشرفت مطالعه</h3>${subjectList()}</section>
  <section class="card"><h3>🌱 عادت‌های امروز</h3>${habitList(4)}</section>
  <section class="card"><h3>🎯 اهداف</h3>${goalList(3)}</section>
 </div>`;
},
goals(){
 return `<div class="section-head"><h2>اهداف من</h2><button class="primary" onclick="openGoal()">＋ هدف جدید</button></div><div class="grid cols-2">${state.goals.length?state.goals.map(g=>`<section class="card"><div class="row"><h3>🪐 ${esc(g.title)}</h3><button class="danger" onclick="removeItem('goals',${g.id})">حذف</button></div><p class="muted">${esc(g.notes||"بدون توضیح")}</p><div class="row"><span>${g.progress}%</span><span class="muted">${g.deadline?`تا ${g.deadline}`:"بدون موعد"}</span></div><div class="progress"><i style="width:${g.progress}%"></i></div></section>`).join(""):`<div class="card empty">هنوز هدف جدیدی نداری.</div>`}</div>`;
},
study(){
 return `<div class="section-head"><h2>درس و مطالعه</h2><button class="primary" onclick="openSubject()">＋ درس جدید</button></div><div class="grid cols-2"><section class="card"><h3>📖 درس‌ها</h3>${subjectList(true)}</section><section class="card"><h3>📝 کارهای درسی</h3>${taskList(20,"study")}</section></div>`;
},
day(){
 const tasks=[...state.tasks].sort((a,b)=>(a.time||"").localeCompare(b.time||""));
 return `<div class="section-head"><h2>برنامه روزانه</h2><button class="primary" onclick="openTask()">＋ برنامه جدید</button></div><section class="card"><div class="timeline">${tasks.length?tasks.map(t=>`<div class="time-row"><span class="muted">${esc(t.time||"—")}</span><div class="event"><div class="row"><label style="margin:0;display:flex;gap:8px;align-items:center"><input type="checkbox" ${t.done?"checked":""} onchange="toggleTask(${t.id})"> ${esc(t.title)}</label><button class="danger" onclick="removeItem('tasks',${t.id})">×</button></div></div></div>`).join(""):`<div class="empty">برنامه‌ای برای امروز ثبت نشده.</div>`}</div></section>`;
},
habits(){
 return `<div class="section-head"><h2>عادت‌ها</h2><button class="primary" onclick="openHabit()">＋ عادت جدید</button></div><section class="card"><h3>🌱 امروز</h3>${habitList(20,true)}</section>`;
},
progress(){
 const taskP=Math.round(state.tasks.filter(x=>x.done).length/Math.max(1,state.tasks.length)*100);
 const habitP=Math.round(state.habits.filter(x=>x.done).length/Math.max(1,state.habits.length)*100);
 const goalP=Math.round(state.goals.reduce((s,x)=>s+x.progress,0)/Math.max(1,state.goals.length));
 return `<div class="grid cols-3"><section class="card stat"><div class="ring" style="--p:${taskP}%"><span>${taskP}%</span></div><div><h3>کارها</h3><span class="muted">تکمیل امروز</span></div></section><section class="card stat"><div class="ring" style="--p:${habitP}%"><span>${habitP}%</span></div><div><h3>عادت‌ها</h3><span class="muted">امروز</span></div></section><section class="card stat"><div class="ring" style="--p:${goalP}%"><span>${goalP}%</span></div><div><h3>اهداف</h3><span class="muted">میانگین پیشرفت</span></div></section><section class="card" style="grid-column:1/-1"><h3>🎯 پیشرفت هدف‌ها</h3>${goalList(20)}</section></div>`;
},
calendar(){
 return `<section class="card"><div class="section-head"><div><h2>📅 تقویم</h2><p class="muted">نسخه V1؛ اتصال Google Calendar در مرحله بعد اضافه می‌شود.</p></div><button class="ghost" onclick="openTask()">＋ رویداد</button></div>${taskList(20)}</section>`;
},
settings(){
 return `<div class="settings-grid"><section class="card"><h2>⚙ تنظیمات</h2><label>نام نمایش<input id="nameSetting" value="${esc(state.settings.name)}"></label><button class="primary" onclick="saveSettings()">ذخیره</button></section><section class="card"><h2>💾 اطلاعات</h2><p class="muted">اطلاعات این نسخه داخل همین مرورگر ذخیره می‌شود.</p><button class="danger" onclick="resetData()">بازگردانی داده‌های نمونه</button></section><section class="card"><h2>🔗 Google Calendar</h2><p class="muted">اتصال امن به حساب Google را می‌توان در V2 با ورود Google و مجوز Calendar اضافه کرد.</p><span class="chip">فعلاً غیرفعال</span></section></div>`;
}
};

function render(view="dashboard"){
 title.textContent={dashboard:"داشبورد",goals:"اهداف",study:"درس و مطالعه",day:"برنامه روزانه",habits:"عادت‌ها",progress:"پیشرفت",calendar:"تقویم",settings:"تنظیمات"}[view];
 app.innerHTML=views[view]();
 document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.view===view));
}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function taskList(limit=20,category){
 let a=state.tasks.filter(t=>!category||t.category===category).slice(0,limit);
 return `<div class="list">${a.length?a.map(t=>`<div class="item ${t.done?"done":""}"><div class="item-left"><input type="checkbox" ${t.done?"checked":""} onchange="toggleTask(${t.id})"><span>${esc(t.title)} ${t.time?`<small class="muted">· ${esc(t.time)}</small>`:""}</span></div><button class="danger" onclick="removeItem('tasks',${t.id})">×</button></div>`).join(""):`<div class="empty">هنوز کاری ثبت نشده.</div>`}</div>`;
}
function habitList(limit=20,full=false){let a=state.habits.slice(0,limit);return `<div class="list">${a.map(h=>`<div class="item ${h.done?"done":""}"><label style="margin:0;display:flex;align-items:center;gap:9px"><input type="checkbox" ${h.done?"checked":""} onchange="toggleHabit(${h.id})"><span>${esc(h.title)}</span></label>${full?`<button class="danger" onclick="removeItem('habits',${h.id})">×</button>`:""}</div>`).join("")||`<div class="empty">عادت جدید اضافه کن.</div>`}</div>`}
function goalList(limit=20){return `<div class="list">${state.goals.slice(0,limit).map(g=>`<div class="item"><span>🪐 ${esc(g.title)}</span><b>${g.progress}%</b></div>`).join("")||`<div class="empty">هدف جدید اضافه کن.</div>`}</div>`}
function subjectList(full=false){return `<div class="list">${state.subjects.map(s=>`<div class="item"><div style="flex:1"><div class="row"><span>📘 ${esc(s.title)}</span><span>${s.progress}%</span></div><div class="progress" style="margin-top:7px"><i style="width:${s.progress}%"></i></div></div>${full?`<button class="danger" onclick="removeItem('subjects',${s.id})">×</button>`:""}</div>`).join("")||`<div class="empty">درسی ثبت نشده.</div>`}</div>`}

function openModal(title,fields,saveFn){
 document.querySelector("#modalTitle").textContent=title;
 document.querySelector("#modalFields").innerHTML=fields;
 const form=document.querySelector("#modalForm");
 form.onsubmit=e=>{e.preventDefault();saveFn(new FormData(form));document.querySelector("#modal").close();};
 document.querySelector("#modal").showModal();
}
function openTask(){
 openModal("برنامه جدید",`<label>عنوان<input name="title" required></label><label>زمان<input name="time" type="time"></label><label>نوع<select name="category"><option value="general">عمومی</option><option value="study">درس</option><option value="activity">فعالیت</option></select></label>`,f=>{state.tasks.push({id:Date.now(),title:f.get("title"),time:f.get("time"),category:f.get("category"),done:false});save();render(currentView)});
}
function openGoal(){
 openModal("هدف جدید",`<label>عنوان هدف<input name="title" required></label><label>پیشرفت (%)<input name="progress" type="number" min="0" max="100" value="0"></label><label>موعد<input name="deadline" type="date"></label><label>توضیح<textarea name="notes"></textarea></label>`,f=>{state.goals.push({id:Date.now(),title:f.get("title"),progress:+f.get("progress"),deadline:f.get("deadline"),notes:f.get("notes")});save();render(currentView)});
}
function openHabit(){
 openModal("عادت جدید",`<label>نام عادت<input name="title" required placeholder="مثلاً مطالعه ۲۰ دقیقه"></label>`,f=>{state.habits.push({id:Date.now(),title:f.get("title"),done:false});save();render(currentView)});
}
function openSubject(){
 openModal("درس جدید",`<label>نام درس<input name="title" required></label><label>پیشرفت (%)<input name="progress" type="number" min="0" max="100" value="0"></label><label>زمان مطالعه<input name="hours" placeholder="مثلاً ۵ ساعت"></label>`,f=>{state.subjects.push({id:Date.now(),title:f.get("title"),progress:+f.get("progress"),hours:f.get("hours")});save();render(currentView)});
}
function toggleTask(id){let x=state.tasks.find(x=>x.id===id);if(x)x.done=!x.done;save();render(currentView)}
function toggleHabit(id){let x=state.habits.find(x=>x.id===id);if(x)x.done=!x.done;save();render(currentView)}
function removeItem(key,id){state[key]=state[key].filter(x=>x.id!==id);save();render(currentView)}
function saveSettings(){state.settings.name=document.querySelector("#nameSetting").value.trim()||"ستاره";save();render(currentView)}
function resetData(){if(confirm("داده‌های فعلی پاک و نمونه اولیه برگردانده شود؟")){state=JSON.parse(JSON.stringify(defaultState));save();render(currentView)}}
let currentView="dashboard";
document.querySelectorAll(".nav").forEach(n=>n.addEventListener("click",()=>{currentView=n.dataset.view;render(currentView);document.querySelector(".sidebar").classList.remove("open")}));
document.querySelector("#quickAdd").addEventListener("click",openTask);
document.querySelector("#mobileMenu").addEventListener("click",()=>document.querySelector(".sidebar").classList.toggle("open"));
render();
