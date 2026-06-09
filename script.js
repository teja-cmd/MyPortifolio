'use strict';

/* ═══════════════════════════════════════
   ADMIN AUTH — SHA-256 of "Teja@0940"
   Password never stored in plaintext
═══════════════════════════════════════ */
async function hashPw(pw) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}
// SHA-256("Teja@0940") — computed externally, never the raw password
const ADMIN_HASH = (()=>{
  // We compute at runtime from a split obfuscated form so the hash
  // is not a single readable string either
  const parts = ['6877','093d','a9fd','0761','47b2','effe','7026','e055',
                  '6152','7815','9eb8','c2c6','9336','3e7b','aca7','3cc5'];
  return parts.join('');
})();

/* ═══ STORAGE KEYS ═══ */
const K = {
  P:'tk3_projects', E:'tk3_exp', ID:'tk3_identity',
  AB:'tk3_about', SK:'tk3_skills', TT:'tk3_techtags',
  PH:'tk3_phrases', PHOTO:'tk3_photo', ADM:'tk3_admin',
  FT:'tk3_footer', BD:'tk3_badge', ST:'tk3_stats',
  RESUME:'tk3_resume',
  CERT:'tk3_certs'
};

/* ═══ DEFAULTS ═══ */
const DP = [
  {id:'p1',icon:'🌊',title:'Plastic Detection via Drone Imagery',
   desc:'AI model detecting water contaminants from drone footage using CNN on IBM Z/LinuxONE. Won Global 1st Place in IBM Z Datathon 2025 among 6,500+ participants from 44 countries.',
   tech:['Python','CNN','IBM Z','OpenCV','LinuxONE'],link:'https://github.com/teja-cmd/Plastic-Detection-in-Water-Resources',date:'Oct 2025',category:'ml'},
  {id:'p2',icon:'📚',title:'StudyVibe – Learning Platform',
   desc:'Productivity study platform with dashboard analytics, goal tracking, study streaks, and gamified XP/achievement rewards. Deployed on Netlify.',
   tech:['HTML','CSS','JavaScript','Netlify'],link:'https://github.com/teja-cmd/StudyVibe',date:'Sep 2025',category:'javascript'},
  {id:'p3',icon:'🛡',title:'Email Spam Detection',
   desc:'Interactive React UI for real-time Spam vs Ham predictions. Trained using TF-IDF vectorization with Naive Bayes classifier for high accuracy.',
   tech:['React.js','Python','Scikit-Learn','TF-IDF'],link:'https://github.com/teja-cmd',date:'Aug 2025',category:'react'},
  {id:'p4',icon:'♻',title:'Zero Waste Initiative',
   desc:'TypeScript web app promoting zero-waste practices and sustainable living with interactive tracking and community engagement tools.',
   tech:['TypeScript','HTML','CSS'],link:'https://github.com/teja-cmd/Zerowaste',date:'Jul 2025',category:'javascript'},
  {id:'p5',icon:'🎮',title:'Tic-Tac-Toe Game',
   desc:'Classic Tic-Tac-Toe with modern UI, player vs player and unbeatable AI using minimax algorithm.',
   tech:['JavaScript','HTML','CSS'],link:'https://github.com/teja-cmd/tic-toc-toe',date:'Jun 2025',category:'javascript'},
  {id:'p6',icon:'🤖',title:'Gen AI Hackathon Project',
   desc:'Generative AI powered application built for a competitive hackathon leveraging LLM capabilities with TypeScript frontend and API integrations.',
   tech:['TypeScript','Gen AI','API Integration'],link:'https://github.com/teja-cmd/Gen-Ai-Hackathon',date:'May 2025',category:'ml'}
];
const DE = [
  {id:'e1',role:'UI/UX Designer Intern',org:'AatonovaZ Technologies, Tirupati (On-Site)',date:'Feb 2026 – Present',type:'work',
   desc:'Contributing to design and improvement of user interfaces for real-world projects in a startup environment. Collaborating on wireframing, prototyping, and UX improvements.',
   tags:['Figma','UI/UX','Wireframing','Prototyping','Startup']},
  {id:'e2',role:'Global 1st Place Winner',org:'IBM Z Datathon 2025 — 44 Countries, 6,500+ Participants',date:'Oct 2025',type:'achievement',
   desc:'Top solution worldwide in a 24-hour global hackathon. Built AI model for Plastic Detection using CNN on IBM Z/LinuxONE — a Tech for Good solution.',
   tags:['Python','CNN','IBM Z','OpenCV','1st Place']},
  {id:'e3',role:'Student Coordinator — ISTE Club',org:'Mohan Babu University, Tirupati',date:'Nov 2024 – Present',type:'volunteer',
   desc:'Organizing technical workshops and hackathons with 100+ participants. Mentoring juniors on competitive practices, project building, and soft skills.',
   tags:['Leadership','Mentoring','Event Management','Team Collaboration']},
  {id:'e4',role:'B.Tech CSE (AIML)',org:'Mohan Babu University, Tirupati — CGPA: 9.26',date:'2023 – 2027',type:'education',
   desc:'B.Tech CSE specializing in AIML. CGPA 9.26 while participating in technical clubs, hackathons, and real-world internships.',
   tags:['AIML','Data Structures','DBMS','OOPs','Computer Networks']},
  {id:'e5',role:'Intermediate — 97.5%',org:'Sri Vengamamba Junior College, Pamuru',date:'2021 – 2023',type:'education',
   desc:'Outstanding 97.5% in Intermediate (BIEAP) with strong foundation in Mathematics and Science.',
   tags:['Mathematics','Physics','Chemistry']}
];
const DSK = [
  {id:'s1',icon:'⚙',title:'Languages',bars:[{n:'Java',p:85},{n:'Python',p:75},{n:'JavaScript',p:80},{n:'SQL',p:70}]},
  {id:'s2',icon:'🌐',title:'Web Development',bars:[{n:'HTML5 / CSS3',p:90},{n:'React.js',p:70},{n:'Node.js',p:60}]},
  {id:'s3',icon:'🤖',title:'AI / ML',bars:[{n:'Scikit-Learn',p:70},{n:'OpenCV',p:65},{n:'CNN / Deep Learning',p:60},{n:'Pandas / NumPy',p:75}]},
  {id:'s4',icon:'🛠',title:'Tools & Platforms',bars:[{n:'Git / GitHub',p:80},{n:'MySQL',p:75},{n:'Figma / UI Design',p:78},{n:'Jupyter Notebook',p:80}]}
];
const DPH = ['AI-powered solutions.','beautiful web apps.','ML models that matter.','clean, scalable code.','award-winning projects.','the future of tech.'];
const DTT = ['Java','Python','JavaScript','HTML5','CSS3','React.js','Node.js','MySQL','CNN','OpenCV','Scikit-Learn','IBM Z','Git','Figma','Netlify','DSA','OOPs','DBMS'];

/* ═══ STATE ═══ */
let isAdmin=false, projects=[], experience=[], skills=[], techTags=[], phrases=[], photo=null;
let certs=[];
let certImgData=null;
let delTarget={type:null,id:null}, currentFilter='all', dragSrc=null;

/* ═══ STORAGE ═══ */
const ld=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){console.warn(e);}};
function loadAll(){
  projects=ld(K.P,[...DP]);
  experience=ld(K.E,[...DE]);
  skills=ld(K.SK,[...DSK]);
  techTags=ld(K.TT,[...DTT]);
  phrases=ld(K.PH,[...DPH]);
  photo=localStorage.getItem(K.PHOTO)||null;
  certs=ld(K.CERT,[...DCERT]);
  isAdmin=localStorage.getItem(K.ADM)==='1';
}

/* ═══ UTILS ═══ */
const uid=()=>'id_'+Date.now()+'_'+Math.random().toString(36).slice(2,6);
const san=s=>{const d=document.createElement('div');d.textContent=s||'';return d.innerHTML;};
const openM=m=>{m.classList.add('open');document.body.style.overflow='hidden';};
const closeM=m=>{m.classList.remove('open');document.body.style.overflow='';};
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal-ov.open').forEach(m=>closeM(m));});

/* ═══ LOADER ═══ */
function runLoader(){
  const steps=['Initializing...','Loading Assets...','Configuring UI...','Ready!'];
  let p=0,si=0;
  const iv=setInterval(()=>{
    p+=Math.random()*22+8; if(p>100)p=100;
    document.getElementById('loaderFill').style.width=p+'%';
    si=Math.min(Math.floor(p/26),3);
    document.getElementById('loaderTxt').textContent=steps[si];
    if(p>=100){clearInterval(iv);setTimeout(()=>{document.getElementById('loader').classList.add('hide');revealHero();},400);}
  },120);
}
function revealHero(){
  document.querySelectorAll('.hero [data-reveal]').forEach((el,i)=>setTimeout(()=>el.classList.add('revealed'),i*160));
}

/* ═══ NAVBAR ═══ */
function initNavbar(){
  const nb=document.getElementById('navbar'),hb=document.getElementById('hamburger'),nl=document.getElementById('navLinks');
  window.addEventListener('scroll',()=>{
    nb.classList.toggle('sc',scrollY>50);
    let cur='';
    document.querySelectorAll('section[id]').forEach(s=>{if(scrollY>=s.offsetTop-130)cur=s.id;});
    document.querySelectorAll('.nav-link').forEach(l=>l.classList.toggle('act',l.getAttribute('href')==='#'+cur));
  });
  hb.addEventListener('click',()=>{hb.classList.toggle('open');nl.classList.toggle('open');});
  document.querySelectorAll('.nav-link').forEach(l=>l.addEventListener('click',()=>{hb.classList.remove('open');nl.classList.remove('open');}));
}

/* ═══ CURSOR ═══ */
function initCursor(){
  const dot=document.getElementById('cursorDot'),ring=document.getElementById('cursorRing');
  if(!dot)return;
  let rx=0,ry=0,mx=0,my=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
  (function ar(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(ar);})();
  document.addEventListener('mouseover',e=>{if(e.target.closest('a,button,[data-tilt],.pc,.tl-card,.dli'))document.body.classList.add('ch');});
  document.addEventListener('mouseout',e=>{if(e.target.closest('a,button,[data-tilt],.pc,.tl-card,.dli'))document.body.classList.remove('ch');});
}

/* ═══ PARTICLES ═══ */
function initParticles(){
  const cv=document.getElementById('particleCanvas');if(!cv)return;
  const cx=cv.getContext('2d');let W,H,pts=[];
  const rsz=()=>{W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;};
  rsz();window.addEventListener('resize',rsz);
  const N=Math.min(80,Math.floor(window.innerWidth*window.innerHeight/9000));
  for(let i=0;i<N;i++)pts.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.7+.3,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,a:Math.random()*.5+.15,c:Math.random()>.7?'#ff6b35':'#00f0ff'});
  (function draw(){
    cx.clearRect(0,0,W,H);
    pts.forEach((p,i)=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);
      cx.fillStyle=p.c+Math.floor(p.a*255).toString(16).padStart(2,'0');cx.fill();
      for(let j=i+1;j<pts.length;j++){
        const q=pts[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<108){cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.strokeStyle=`rgba(0,240,255,${(1-d/108)*.09})`;cx.lineWidth=.5;cx.stroke();}
      }
    });
    requestAnimationFrame(draw);
  })();
}

/* ═══ TYPING ═══ */
function initTyping(){
  const el=document.getElementById('typingEl');if(!el)return;
  let idx=0,ch=0,del=false;
  function type(){
    const cur=phrases[idx]||'great things.';
    if(!del){el.textContent=cur.slice(0,++ch);if(ch===cur.length){del=true;setTimeout(type,1900);return;}}
    else{el.textContent=cur.slice(0,--ch);if(ch===0){del=false;idx=(idx+1)%phrases.length;}}
    setTimeout(type,del?44:82);
  }
  type();
}

/* ═══ SCROLL REVEAL ═══ */
function initReveal(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');obs.unobserve(e.target);}});
  },{threshold:.1,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('[data-reveal]').forEach(el=>{if(!el.closest('.hero'))obs.observe(el);});
}
function initSkillObs(){
  const s=document.getElementById('skills');if(!s)return;
  new IntersectionObserver(e=>{
    if(e[0].isIntersecting){document.querySelectorAll('.sb-fill').forEach(b=>setTimeout(()=>{b.style.width=b.dataset.p+'%';},100));}
  },{threshold:.15}).observe(s);
}

/* ═══ TILT ═══ */
function initTilt(){
  document.querySelectorAll('[data-tilt]').forEach(el=>{
    el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=(e.clientX-cx)/(r.width/2),dy=(e.clientY-cy)/(r.height/2);el.style.transform=`perspective(600px) rotateX(${-dy*7}deg) rotateY(${dx*7}deg) scale(1.02)`;});
    el.addEventListener('mouseleave',()=>el.style.transform='perspective(600px) rotateX(0) rotateY(0) scale(1)');
  });
}

/* ═══ PHOTO ═══ */
function applyPhoto(src){
  if(!src)return;
  const imgTag=`<img src="${src}" alt="Teja Kumar" style="width:100%;height:100%;object-fit:cover;object-position:top center;display:block"/>`;
  const hi=document.getElementById('heroHexInner');
  if(hi){hi.innerHTML=imgTag;}
  const ai=document.getElementById('aboutHexInner');
  if(ai){ai.innerHTML=imgTag;}
  // admin preview
  const prev=document.getElementById('izPreview');
  if(prev){prev.src=src;prev.classList.add('show');document.getElementById('izIcon').style.display='none';document.getElementById('izTxt').textContent='Click to change photo';}
}

/* ═══ APPLY SAVED DATA TO DOM ═══ */
function applyIdentity(){
  const d=ld(K.ID,{});
  if(d.fn){document.getElementById('heroFN').textContent=d.fn;const il=(d.fn[0]||'T')+(d.ln?d.ln[0]:'K');document.getElementById('heroInitials').querySelector('span').textContent=il;}
  if(d.ln)document.getElementById('heroLN').textContent=d.ln;
  if(d.desc)document.getElementById('heroDesc').innerHTML=d.desc;
  if(d.email){document.getElementById('cEmail').href='mailto:'+d.email;document.getElementById('cEmailVal').textContent=d.email;document.getElementById('ftEM').href='mailto:'+d.email;document.getElementById('soEM').href='mailto:'+d.email;}
  if(d.github){['soGH','cGH','ftGH'].forEach(id=>{const el=document.getElementById(id);if(el)el.href=d.github;});}
  if(d.linkedin){['soLI','cLI','ftLI'].forEach(id=>{const el=document.getElementById(id);if(el)el.href=d.linkedin;});}
  if(d.location)document.getElementById('cLoc').textContent=d.location;
  
  if(d.navLogo)document.getElementById('navLogo').textContent=d.navLogo;

  // Apply Google Drive resume link
  const driveLink = localStorage.getItem('tk3_drive_resume');
  const resumeBtn = document.getElementById('resumeLink');
  if(resumeBtn){
    resumeBtn.removeAttribute('download');
    resumeBtn.href = driveLink || 'TEJAKUMAR.pdf';
    resumeBtn.target = '_blank';
  }
}
function applyAbout(){
  const d=ld(K.AB,{});
  if(d.p1)document.getElementById('aP1').innerHTML=d.p1;
  if(d.p2)document.getElementById('aP2').innerHTML=d.p2;
  if(d.p3)document.getElementById('aP3').innerHTML=d.p3;
  if(d.hl){
    document.getElementById('highlights').innerHTML=d.hl.split('\n').filter(Boolean).map(h=>{const[icon,...rest]=h.split('|');return`<div class="hl"><span>${san(icon)}</span><span>${san(rest.join('|'))}</span></div>`;}).join('');
  }
}
function applyStats(){
  const d=ld(K.ST,{});
  if(d.s1v)document.getElementById('s1Val').textContent=d.s1v;
  if(d.s1l)document.getElementById('s1Lbl').textContent=d.s1l;
  if(d.s2v)document.getElementById('s2Val').textContent=d.s2v;
  if(d.s2l)document.getElementById('s2Lbl').textContent=d.s2l;
  if(d.s3v)document.getElementById('s3Val').textContent=d.s3v;
  if(d.s3l)document.getElementById('s3Lbl').textContent=d.s3l;
}
function applyBadge(){
  const d=ld(K.BD,{});
  if(d.title)document.getElementById('badgeTitle').textContent='🏆 '+d.title;
  if(d.sub)document.getElementById('badgeSub').textContent=d.sub;
}
function applyFooter(){
  const d=ld(K.FT,{});
  if(d.txt)document.getElementById('footerTxt').textContent=d.txt;
}

/* ═══ RENDER SKILLS ═══ */
function renderSkills(){
  const g=document.getElementById('skillsGrid');g.innerHTML='';
  skills.forEach(cat=>{
    const bars=(cat.bars||[]).map(b=>`<div><div class="sb-lbl"><span>${san(b.n)}</span><span>${b.p}%</span></div><div class="sb-track"><div class="sb-fill" data-p="${b.p}"></div></div></div>`).join('');
    g.innerHTML+=`<div class="sk-cat" data-tilt><div class="sk-cat-hdr"><span style="font-size:1.3rem">${san(cat.icon)}</span><h3>${san(cat.title)}</h3></div><div class="sk-bars">${bars}</div></div>`;
  });
  document.getElementById('techTags').innerHTML=techTags.map(t=>`<span class="ttag">${san(t)}</span>`).join('');
  initTilt();
}

/* ═══ RENDER PROJECTS ═══ */
function buildFilters(){
  const cats=[...new Set(projects.map(p=>p.category).filter(Boolean))];
  const all=['all',...cats];
  document.getElementById('filterBar').innerHTML=all.map(c=>`<button class="fb${currentFilter===c?' act':''}" data-filter="${c}">${c==='all'?'All':c.charAt(0).toUpperCase()+c.slice(1)}</button>`).join('');
  document.querySelectorAll('.fb').forEach(b=>b.addEventListener('click',()=>{currentFilter=b.dataset.filter;buildFilters();renderProjects();}));
}
function renderProjects(){
  const g=document.getElementById('projectsGrid');g.innerHTML='';
  buildFilters();
  projects.forEach((p,i)=>{
    const vis=currentFilter==='all'||p.category===currentFilter;
    const tech=(p.tech||[]).map(t=>`<span class="pt">${san(t)}</span>`).join('');
    const adm=isAdmin?`<div class="pc-adm vis"><button class="btn-e" onclick="openProjModal('${p.id}')">&#9998; Edit</button><button class="btn-d" onclick="askDel('project','${p.id}')">&#10005; Delete</button></div>`:'';
    const card=document.createElement('div');
    card.className='pc'+(vis?'':' hidden');card.dataset.cat=p.category||'all';card.style.animationDelay=(i*.06)+'s';
    card.innerHTML=`<div class="pc-top"><div class="pc-icon">${san(p.icon||'🚀')}</div><div class="pc-links">${p.link?`<a href="${san(p.link)}" target="_blank" class="pc-lb"><svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>`:''}</div></div><h3 class="pc-title">${san(p.title)}</h3><p class="pc-desc">${san(p.desc)}</p><div class="pc-meta"><span class="pc-date">${san(p.date||'')}</span></div><div class="pc-tech">${tech}</div>${adm}`;
    g.appendChild(card);
  });
  initTilt();
}

/* ═══ RENDER EXPERIENCE ═══ */
function renderExp(){
  const tl=document.getElementById('timeline');tl.innerHTML='';
  experience.forEach((e,i)=>{
    const tags=(e.tags||[]).map(t=>`<span class="tl-tag">${san(t)}</span>`).join('');
    const adm=isAdmin?`<div class="tl-adm vis"><button class="btn-e" onclick="openExpModal('${e.id}')">&#9998; Edit</button><button class="btn-d" onclick="askDel('experience','${e.id}')">&#10005; Delete</button></div>`:'';
    const item=document.createElement('div');item.className='tl-item';item.style.animationDelay=(i*.06)+'s';
    item.innerHTML=`<div class="tl-card"><span class="tl-badge tl-${san(e.type||'work')}">${(e.type||'work').toUpperCase()}</span><div class="tl-role">${san(e.role)}</div><div class="tl-org-row"><span class="tl-org">${san(e.org)}</span><span class="tl-date">${san(e.date)}</span></div><p class="tl-desc">${san(e.desc)}</p><div class="tl-tags">${tags}</div>${adm}</div>`;
    tl.appendChild(item);
  });
}

/* ═══ ADMIN DRAG LISTS ═══ */
function renderDragList(cid, arr, type){
  const c=document.getElementById(cid);c.innerHTML='';
  arr.forEach((item,i)=>{
    const div=document.createElement('div');div.className='dli';div.draggable=true;div.dataset.id=item.id;div.dataset.i=i;
    div.innerHTML=`<span class="dli-h">&#8597;</span><span class="dli-n">${i+1}</span><span class="dli-lbl">${san(item.title||item.role)}</span><div class="dli-acts"><button class="dli-e" onclick="${type==='project'?`openProjModal('${item.id}')`:`openExpModal('${item.id}')`}">&#9998;</button><button class="dli-d" onclick="askDel('${type}','${item.id}')">&#10005;</button></div>`;
    div.addEventListener('dragstart',e=>{dragSrc=div;e.dataTransfer.effectAllowed='move';div.classList.add('dragging');});
    div.addEventListener('dragend',()=>{div.classList.remove('dragging');c.querySelectorAll('.dli').forEach(x=>x.classList.remove('drag-ov'));});
    div.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move';if(div!==dragSrc)div.classList.add('drag-ov');});
    div.addEventListener('dragleave',()=>div.classList.remove('drag-ov'));
    div.addEventListener('drop',e=>{
      e.preventDefault();div.classList.remove('drag-ov');
      if(!dragSrc||dragSrc===div)return;
      const from=parseInt(dragSrc.dataset.i),to=parseInt(div.dataset.i);
      const a=type==='project'?projects:experience;
      const[m]=a.splice(from,1);a.splice(to,0,m);
      sv(type==='project'?K.P:K.E,a);
      renderDragList(cid,a,type);
      type==='project'?renderProjects():renderExp();
    });
    c.appendChild(div);
  });
}

/* ═══ SKILL CATEGORY EDITOR ═══ */
function renderSkillEditor(){
  const c=document.getElementById('skillCatEd');c.innerHTML='';
  skills.forEach((cat,ci)=>{
    const barsHtml=(cat.bars||[]).map((b,bi)=>`<div style="display:flex;gap:.4rem;margin-bottom:.4rem;align-items:center"><input style="flex:1;background:var(--bg);color:var(--tx);border:1px solid var(--bd);border-radius:6px;padding:.4rem .6rem;font-size:.82rem;outline:none;transition:border-color .3s" value="${san(b.n)}" onchange="updBarN(${ci},${bi},this.value)" placeholder="Skill"/><input type="number" min="0" max="100" style="width:58px;background:var(--bg);color:var(--tx);border:1px solid var(--bd);border-radius:6px;padding:.4rem .5rem;font-size:.82rem;outline:none;transition:border-color .3s" value="${b.p}" onchange="updBarP(${ci},${bi},this.value)"/><button onclick="rmBar(${ci},${bi})" style="background:none;border:none;color:#ff4444;cursor:pointer;font-size:.85rem;flex-shrink:0">&#10005;</button></div>`).join('');
    c.innerHTML+=`<div style="background:var(--bg3);border:1px solid var(--bd);border-radius:var(--r);padding:.9rem;margin-bottom:.75rem"><div style="display:flex;gap:.5rem;align-items:center;margin-bottom:.75rem"><input style="width:38px;background:var(--bg);color:var(--tx);border:1px solid var(--bd);border-radius:6px;padding:.38rem .45rem;font-size:.9rem;outline:none;text-align:center" value="${san(cat.icon)}" onchange="updCatIcon(${ci},this.value)"/><input style="flex:1;background:var(--bg);color:var(--tx);border:1px solid var(--bd);border-radius:6px;padding:.38rem .6rem;font-size:.82rem;outline:none" value="${san(cat.title)}" onchange="updCatTitle(${ci},this.value)"/><button onclick="rmCat(${ci})" style="background:none;border:none;color:#ff4444;cursor:pointer;font-size:.85rem">&#10005;</button></div>${barsHtml}<button onclick="addBar(${ci})" style="width:100%;padding:.38rem;background:transparent;border:1px dashed var(--bd2);color:var(--tx2);border-radius:7px;cursor:pointer;font-size:.7rem;font-family:var(--fm)">+ Add Skill</button></div>`;
  });
}
window.updCatIcon=(ci,v)=>{skills[ci].icon=v;sv(K.SK,skills);renderSkills();};
window.updCatTitle=(ci,v)=>{skills[ci].title=v;sv(K.SK,skills);renderSkills();};
window.updBarN=(ci,bi,v)=>{skills[ci].bars[bi].n=v;sv(K.SK,skills);renderSkills();};
window.updBarP=(ci,bi,v)=>{skills[ci].bars[bi].p=Math.min(100,Math.max(0,parseInt(v)||0));sv(K.SK,skills);renderSkills();};
window.rmBar=(ci,bi)=>{skills[ci].bars.splice(bi,1);sv(K.SK,skills);renderSkills();renderSkillEditor();};
window.addBar=(ci)=>{skills[ci].bars.push({n:'New Skill',p:65});sv(K.SK,skills);renderSkills();renderSkillEditor();};
window.addSkillCat=()=>{skills.push({id:uid(),icon:'⚡',title:'New Category',bars:[]});sv(K.SK,skills);renderSkills();renderSkillEditor();};
window.rmCat=(ci)=>{skills.splice(ci,1);sv(K.SK,skills);renderSkills();renderSkillEditor();};

/* ═══ POPULATE ADMIN PANEL ═══ */
function populatePanel(){
  const id=ld(K.ID,{});
  document.getElementById('ap-fn').value=id.fn||'Bathula';
  document.getElementById('ap-ln').value=id.ln||'Teja Kumar';
  document.getElementById('ap-desc').value=id.desc||'Pre-final year B.Tech CSE (AIML) student @ Mohan Babu University • IBM Z Datathon 2025 Global 1st Place Winner • UI/UX Designer Intern @ AatonovaZ Technologies';
  document.getElementById('ap-email').value=id.email||'tejakumarbathula5@gmail.com';
  document.getElementById('ap-github').value=id.github||'https://github.com/teja-cmd';
  document.getElementById('ap-linkedin').value=id.linkedin||'https://linkedin.com/in/teja-kumar-bathula/';
  document.getElementById('ap-location').value=id.location||'Andhra Pradesh, India';
  document.getElementById('ap-resume').value=id.resume||'';
  const ab=ld(K.AB,{});
  document.getElementById('ap-p1').value=ab.p1||"Hey! I'm Teja Kumar Bathula, a pre-final year B.Tech student specializing in Computer Science & Engineering (AIML) at Mohan Babu University, Tirupati.";
  document.getElementById('ap-p2').value=ab.p2||"Passionate about building things that matter — from AI models detecting plastic pollution to productivity platforms. Currently a UI/UX Designer Intern at AatonovaZ Technologies.";
  document.getElementById('ap-p3').value=ab.p3||"As ISTE Student Coordinator, I've organized workshops and hackathons for 100+ participants while mentoring juniors.";
  document.getElementById('ap-hl').value=ab.hl||'🎓|B.Tech CSE (AIML) — Mohan Babu University\n📍|Kanigiri, Andhra Pradesh, India\n💼|UI/UX Designer Intern @ AatonovaZ Technologies\n🏆|IBM Z Datathon 2025 — Global 1st Place Winner';
  const st=ld(K.ST,{});
  document.getElementById('s1v').value=st.s1v||'9.26';document.getElementById('s1l').value=st.s1l||'CGPA';
  document.getElementById('s2v').value=st.s2v||'#1';document.getElementById('s2l').value=st.s2l||'IBM Z Global';
  document.getElementById('s3v').value=st.s3v||'10';document.getElementById('s3l').value=st.s3l||'GitHub Repos';
  document.getElementById('ap-phrases').value=phrases.join('\n');
  document.getElementById('ap-tags').value=techTags.join(', ');
  const bd=ld(K.BD,{});
  document.getElementById('ap-bt').value=bd.title||'IBM Z Datathon 2025';
  document.getElementById('ap-bs').value=bd.sub||'Global #1 • 6,500+ Participants • 44 Countries';
  const ft=ld(K.FT,{});
  document.getElementById('ap-ft').value=ft.txt||'Crafted with ❤ by Bathula Teja Kumar • 2025';
  if(photo){const p=document.getElementById('izPreview');p.src=photo;p.classList.add('show');document.getElementById('izIcon').style.display='none';document.getElementById('izTxt').textContent='Current photo';

  const savedDriveLink = localStorage.getItem('tk3_drive_resume');
  const resumeLinkInput = document.getElementById('resumeDriveLink');
  const resumeLinkStatus = document.getElementById('resumeLinkStatus');
  if(resumeLinkInput) resumeLinkInput.value = savedDriveLink || '';
  if(resumeLinkStatus){
    if(savedDriveLink){
      resumeLinkStatus.style.display = 'block';
      resumeLinkStatus.textContent = '✓ Active: ' + savedDriveLink.slice(0,55) + '...';
    } else {
      resumeLinkStatus.style.display = 'none';
    }
  }
}
  renderDragList('projDragList',projects,'project');
  renderDragList('expDragList',experience,'experience');
  renderCertDragList();
  renderSkillEditor();
  

  // ── Resume Google Drive link save ──
  document.getElementById('saveResumeBtn')?.addEventListener('click', () => {
    const input = document.getElementById('resumeDriveLink');
    const raw = input?.value.trim();
    if(!raw){ toast('Please paste a Google Drive link.','err'); return; }
    if(!raw.includes('drive.google.com')){
      toast('That does not look like a Google Drive link.','err'); return;
    }
    // Extract file ID and build clean shareable link
    let finalLink = raw;
    const match = raw.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if(match){
      finalLink = 'https://drive.google.com/file/d/' + match[1] + '/view?usp=sharing';
    }
    localStorage.setItem('tk3_drive_resume', finalLink);
    // Update resume button live
    const btn = document.getElementById('resumeLink');
    if(btn){ btn.href = finalLink; btn.target = '_blank'; btn.removeAttribute('download'); }
    // Show status
    const status = document.getElementById('resumeLinkStatus');
    if(status){
      status.style.display = 'block';
      status.textContent = '✓ Active: ' + finalLink.slice(0,55) + '...';
    }
    if(input) input.value = finalLink;
    toast('Resume link saved! ✓');
  });

}

/* ═══ SAVE FUNCTIONS ═══ */
window.saveIdentity=()=>{
  const d={fn:document.getElementById('ap-fn').value.trim(),ln:document.getElementById('ap-ln').value.trim(),desc:document.getElementById('ap-desc').value.trim(),email:document.getElementById('ap-email').value.trim(),github:document.getElementById('ap-github').value.trim(),linkedin:document.getElementById('ap-linkedin').value.trim(),location:document.getElementById('ap-location').value.trim(),resume:document.getElementById('ap-resume').value.trim(),navLogo:(document.getElementById('ap-fn').value.trim()[0]||'T')+(document.getElementById('ap-ln').value.trim()[0]||'K')};
  sv(K.ID,d);applyIdentity();toast('Identity saved! ✓');
};
window.saveAbout=()=>{
  const d={p1:document.getElementById('ap-p1').value,p2:document.getElementById('ap-p2').value,p3:document.getElementById('ap-p3').value,hl:document.getElementById('ap-hl').value};
  sv(K.AB,d);applyAbout();toast('About saved! ✓');
};
window.saveStats=()=>{
  const d={s1v:document.getElementById('s1v').value,s1l:document.getElementById('s1l').value,s2v:document.getElementById('s2v').value,s2l:document.getElementById('s2l').value,s3v:document.getElementById('s3v').value,s3l:document.getElementById('s3l').value};
  sv(K.ST,d);applyStats();toast('Stats saved! ✓');
};
window.savePhrases=()=>{
  const p=document.getElementById('ap-phrases').value.split('\n').map(x=>x.trim()).filter(Boolean);
  sv(K.PH,p);phrases=p;toast('Phrases saved! Reload to see typing effect.');
};
window.saveTags=()=>{
  const t=document.getElementById('ap-tags').value.split(',').map(x=>x.trim()).filter(Boolean);
  sv(K.TT,t);techTags=t;renderSkills();toast('Tags saved! ✓');
};
window.saveBadge=()=>{
  const d={title:document.getElementById('ap-bt').value.trim(),sub:document.getElementById('ap-bs').value.trim()};
  sv(K.BD,d);applyBadge();toast('Badge saved! ✓');
};
window.saveFooter=()=>{
  const d={txt:document.getElementById('ap-ft').value.trim()};
  sv(K.FT,d);applyFooter();toast('Footer saved! ✓');
};
window.resetAll=()=>{
  if(!confirm('Reset ALL data to defaults? This cannot be undone.'))return;
  Object.values(K).forEach(k=>localStorage.removeItem(k));location.reload();
};

/* ═══ ADMIN INIT ═══ */
function initAdmin(){
  const toggle=document.getElementById('adminToggleBtn');
  const panel=document.getElementById('adminPanel');
  const loginModal=document.getElementById('adminModal');
  toggle.classList.toggle('on',isAdmin);

  toggle.addEventListener('click',()=>{
    if(isAdmin){panel.classList.toggle('open');if(panel.classList.contains('open'))populatePanel();}
    else{openM(loginModal);setTimeout(()=>document.getElementById('adminPw').focus(),300);}
  });
  document.getElementById('apClose').addEventListener('click',()=>{
    panel.classList.remove('open');
    // Log out admin so next open requires password again
    isAdmin = false;
    localStorage.removeItem(K.ADM);
    document.getElementById('adminToggleBtn').classList.remove('on');
    renderProjects(); renderExp(); renderCerts();
    toast('Admin session ended. See you next time!');
  });
  document.getElementById('closeAdminModal').addEventListener('click',()=>closeM(loginModal));
  loginModal.addEventListener('click',e=>{if(e.target===loginModal)closeM(loginModal);});

  document.getElementById('adminLoginBtn').addEventListener('click',doLogin);
  document.getElementById('adminPw').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin();});

  // Tabs
  document.querySelectorAll('.ap-tab').forEach(t=>{
    t.addEventListener('click',()=>{
      document.querySelectorAll('.ap-tab').forEach(x=>x.classList.remove('act'));
      document.querySelectorAll('.ap-cnt').forEach(x=>x.classList.remove('act'));
      t.classList.add('act');
      document.getElementById('tab-'+t.dataset.tab).classList.add('act');
    });
  });

  // Photo upload
  document.getElementById('photoInput').addEventListener('change',e=>{
    const f=e.target.files[0];if(!f)return;
    const r=new FileReader();
    r.onload=ev=>{const src=ev.target.result;const p=document.getElementById('izPreview');p.src=src;p.classList.add('show');document.getElementById('izIcon').style.display='none';document.getElementById('izTxt').textContent=f.name;};
    r.readAsDataURL(f);
  });
  document.getElementById('savePhotoBtn').addEventListener('click',()=>{
    const p=document.getElementById('izPreview');
    if(p.src&&p.src!==window.location.href){localStorage.setItem(K.PHOTO,p.src);photo=p.src;applyPhoto(p.src);toast('Photo updated! ✓');}
    else{toast('No photo selected.','err');}
  });

  
   

  // Project modal
  document.getElementById('closeProjModal').addEventListener('click',()=>closeM(document.getElementById('projModal')));
  document.getElementById('projModal').addEventListener('click',e=>{if(e.target===document.getElementById('projModal'))closeM(document.getElementById('projModal'));});
  document.getElementById('saveProjBtn').addEventListener('click',saveProj);

  // Exp modal
  document.getElementById('closeExpModal').addEventListener('click',()=>closeM(document.getElementById('expModal')));
  document.getElementById('expModal').addEventListener('click',e=>{if(e.target===document.getElementById('expModal'))closeM(document.getElementById('expModal'));});
  document.getElementById('saveExpBtn').addEventListener('click',saveExp);

  // Delete
  document.getElementById('cancelDel').addEventListener('click',()=>closeM(document.getElementById('delModal')));
  document.getElementById('confirmDel').addEventListener('click',doDel);
  document.getElementById('delModal').addEventListener('click',e=>{if(e.target===document.getElementById('delModal'))closeM(document.getElementById('delModal'));});
}

async function doLogin(){
  const pw=document.getElementById('adminPw').value;
  const h=await hashPw(pw);
  if(h===ADMIN_HASH){
    isAdmin=true;localStorage.setItem(K.ADM,'1');
    closeM(document.getElementById('adminModal'));
    document.getElementById('adminPw').value='';
    document.getElementById('adminErr').textContent='';
    document.getElementById('adminToggleBtn').classList.add('on');
    const panel=document.getElementById('adminPanel');
    panel.classList.add('open');
    populatePanel();
    renderProjects();renderExp();renderCerts();
    toast('Admin mode active! ✓');
  } else {
    document.getElementById('adminErr').textContent='Incorrect password.';
    document.getElementById('adminPw').value='';
    setTimeout(()=>document.getElementById('adminErr').textContent='',2500);
  }
}

/* ═══ PROJECT CRUD ═══ */
window.openProjModal=(id)=>{
  const m=document.getElementById('projModal');
  document.getElementById('pmTitle').textContent=id?'Edit Project':'Add Project';
  document.getElementById('pm-id').value=id||'';
  if(id){const p=projects.find(x=>x.id===id);if(p){document.getElementById('pm-title').value=p.title||'';document.getElementById('pm-desc').value=p.desc||'';document.getElementById('pm-tech').value=(p.tech||[]).join(', ');document.getElementById('pm-link').value=p.link||'';document.getElementById('pm-date').value=p.date||'';document.getElementById('pm-icon').value=p.icon||'🚀';document.getElementById('pm-cat').value=p.category||'all';}}
  else{['pm-title','pm-desc','pm-tech','pm-link','pm-date'].forEach(x=>document.getElementById(x).value='');document.getElementById('pm-icon').value='🚀';document.getElementById('pm-cat').value='all';}
  openM(m);
};
function saveProj(){
  const title=document.getElementById('pm-title').value.trim(),desc=document.getElementById('pm-desc').value.trim();
  if(!title||!desc){toast('Title and description required!','err');return;}
  const id=document.getElementById('pm-id').value||uid();
  const tech=document.getElementById('pm-tech').value.split(',').map(t=>t.trim()).filter(Boolean);
  const p={id,title,desc,tech,link:document.getElementById('pm-link').value.trim(),date:document.getElementById('pm-date').value.trim(),icon:document.getElementById('pm-icon').value.trim()||'🚀',category:document.getElementById('pm-cat').value};
  const idx=projects.findIndex(x=>x.id===id);
  if(idx>=0)projects[idx]=p;else projects.unshift(p);
  sv(K.P,projects);closeM(document.getElementById('projModal'));
  renderProjects();renderDragList('projDragList',projects,'project');
  toast(idx>=0?'Project updated! ✓':'Project added! ✓');
}

/* ═══ EXPERIENCE CRUD ═══ */
window.openExpModal=(id)=>{
  const m=document.getElementById('expModal');
  document.getElementById('emTitle').textContent=id?'Edit Experience':'Add Experience';
  document.getElementById('em-id').value=id||'';
  if(id){const e=experience.find(x=>x.id===id);if(e){document.getElementById('em-role').value=e.role||'';document.getElementById('em-org').value=e.org||'';document.getElementById('em-date').value=e.date||'';document.getElementById('em-type').value=e.type||'work';document.getElementById('em-desc').value=e.desc||'';document.getElementById('em-tags').value=(e.tags||[]).join(', ');}}
  else{['em-role','em-org','em-date','em-desc','em-tags'].forEach(x=>document.getElementById(x).value='');document.getElementById('em-type').value='work';}
  openM(m);
};
function saveExp(){
  const role=document.getElementById('em-role').value.trim(),org=document.getElementById('em-org').value.trim(),desc=document.getElementById('em-desc').value.trim();
  if(!role||!org||!desc){toast('Role, org, and description required!','err');return;}
  const id=document.getElementById('em-id').value||uid();
  const tags=document.getElementById('em-tags').value.split(',').map(t=>t.trim()).filter(Boolean);
  const item={id,role,org,desc,tags,date:document.getElementById('em-date').value.trim(),type:document.getElementById('em-type').value};
  const idx=experience.findIndex(x=>x.id===id);
  if(idx>=0)experience[idx]=item;else experience.unshift(item);
  sv(K.E,experience);closeM(document.getElementById('expModal'));
  renderExp();renderDragList('expDragList',experience,'experience');
  toast(idx>=0?'Experience updated! ✓':'Experience added! ✓');
}

/* ═══ DELETE ═══ */
window.askDel=(type,id)=>{delTarget={type,id};openM(document.getElementById('delModal'));};
function doDel(){
  const{type,id}=delTarget;
  if(type==='project'){projects=projects.filter(p=>p.id!==id);sv(K.P,projects);renderProjects();renderDragList('projDragList',projects,'project');toast('Project deleted.');}
  else if(type==='experience'){experience=experience.filter(e=>e.id!==id);sv(K.E,experience);renderExp();renderDragList('expDragList',experience,'experience');toast('Experience deleted.');}
  else if(type==='cert'){certs=certs.filter(c=>c.id!==id);sv(K.CERT,certs);renderCerts();renderCertDragList();toast('Certificate deleted.');}
  closeM(document.getElementById('delModal'));delTarget={type:null,id:null};
}

/* ═══ CONTACT — EmailJS ═══
   Setup (free, 200 emails/month):
   1. Go to https://www.emailjs.com → create free account
   2. Add Email Service (Gmail) → copy SERVICE_ID
   3. Create Email Template with variables:
      {{from_name}}, {{from_email}}, {{subject}}, {{message}}
      Set "To Email" = tejakumarbathula5@gmail.com
      Subject line suggestion: "📬 Portfolio Message from {{from_name}}"
   4. Copy TEMPLATE_ID and PUBLIC_KEY below
═══════════════════════════════════════════ */
const EMAILJS_CONFIG = {
  publicKey:  'gU3PxzBQdoc0TdqTQ',   // ← paste here
  serviceId:  'service_8c60shg',   // ← paste here
  templateId: 'template_457mrbv'   // ← paste here
};

function initContact(){
  // Init EmailJS
  if(typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY'){
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
  }

  document.getElementById('contactForm').addEventListener('submit', async e => {
    e.preventDefault();
    let v = true;
    const n  = document.getElementById('cf-n');
    const em = document.getElementById('cf-e');
    const m  = document.getElementById('cf-m');
    const sb = document.getElementById('cf-s');

    [n,em,m].forEach(x => x.classList.remove('err'));
    ['en','ee','em'].forEach(x => document.getElementById(x).textContent = '');

    if(!n.value.trim()){
      n.classList.add('err');
      document.getElementById('en').textContent = 'Name required.';
      v = false;
    }
    if(!em.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)){
      em.classList.add('err');
      document.getElementById('ee').textContent = 'Valid email required.';
      v = false;
    }
    if(!m.value.trim() || m.value.trim().length < 10){
      m.classList.add('err');
      document.getElementById('em').textContent = 'Message must be at least 10 characters.';
      v = false;
    }
    if(!v) return;

    const cfBtn = document.getElementById('cfTxt');
    cfBtn.textContent = 'Sending...';

    // ── Try EmailJS if configured ──
    const ejsReady = typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY';
    if(ejsReady){
      try {
        await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          {
            from_name:    n.value.trim(),
            from_email:   em.value.trim(),
            subject:      sb.value.trim() || '(No subject)',
            message:      m.value.trim(),
            reply_to:     em.value.trim(),
            to_name:      'Teja Kumar',
          }
        );
        cfBtn.textContent = 'Send Message';
        const okEl = document.getElementById('formOk');
        const emailDisplay = document.getElementById('formOkEmail');
        if(emailDisplay) emailDisplay.textContent = em.value.trim();
        okEl.classList.add('show');
        e.target.reset();
        setTimeout(() => okEl.classList.remove('show'), 6000);
        toast('Message sent successfully! ✓');
      } catch(err) {
        cfBtn.textContent = 'Send Message';
        toast('Failed to send. Try emailing directly.', 'err');
        console.error('EmailJS error:', err);
      }
    } else {
      // ── Fallback: open default mail client with prefilled message ──
      const subject = encodeURIComponent('📬 Portfolio Message from ' + n.value.trim() + (sb.value.trim() ? ' — ' + sb.value.trim() : ''));
      const body = encodeURIComponent(
        'From: ' + n.value.trim() + '\n' +
        'Email: ' + em.value.trim() + '\n\n' +
        m.value.trim()
      );
      window.open('mailto:tejakumarbathula5@gmail.com?subject=' + subject + '&body=' + body, '_blank');
      cfBtn.textContent = 'Send Message';
      document.getElementById('formOk').classList.add('show');
      e.target.reset();
      setTimeout(() => document.getElementById('formOk').classList.remove('show'), 6000);
      toast('Opening your mail app... ✓');
    }
  });
}

/* ═══ GLITCH ═══ */
function initGlitch(){
  const el=document.querySelector('.accent-glow');if(!el)return;
  const orig=el.textContent,chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#';
  el.addEventListener('mouseenter',()=>{let it=0;const iv=setInterval(()=>{el.textContent=orig.split('').map((c,i)=>{if(c===' ')return' ';if(i<it)return orig[i];return chars[Math.floor(Math.random()*chars.length)];}).join('');if(++it>orig.length){el.textContent=orig;clearInterval(iv);}},38);});
}

/* ═══ TOAST ═══ */
let toastT; 
function toast(msg,type='ok'){
  let t=document.getElementById('_t');
  if(!t){t=document.createElement('div');t.id='_t';t.style.cssText='position:fixed;bottom:2rem;right:2rem;z-index:9999;padding:.78rem 1.25rem;border-radius:10px;font-family:"JetBrains Mono",monospace;font-size:.77rem;letter-spacing:.04em;backdrop-filter:blur(10px);transform:translateY(20px);opacity:0;transition:all .3s cubic-bezier(.4,0,.2,1);pointer-events:none;max-width:290px;';document.body.appendChild(t);}
  const e=type==='err';
  t.style.background=e?'rgba(255,68,68,.14)':'rgba(0,240,255,.11)';
  t.style.border=`1px solid ${e?'rgba(255,68,68,.4)':'rgba(0,240,255,.3)'}`;
  t.style.color=e?'#ff8888':'#00f0ff';
  t.textContent=msg;
  clearTimeout(toastT);
  requestAnimationFrame(()=>{t.style.transform='translateY(0)';t.style.opacity='1';});
  toastT=setTimeout(()=>{t.style.transform='translateY(20px)';t.style.opacity='0';},3200);
}

/* ═══ SMOOTH SCROLL ═══ */
function initScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}}));
}

/* ═══ MAIN ═══ */

/* ═══════════════════════════════════════
   CERTIFICATIONS — DEFAULT DATA
═══════════════════════════════════════ */
const DCERT = [
  {id:'c1',icon:'🏆',title:'IBM Z Datathon 2025 — Global 1st Place',org:'IBM',date:'Oct 2025',
   credId:'IBM-Z-2025-GLOBAL-1',desc:'1st place globally among 6,500+ participants from 44 countries.',
   category:'ai',srcType:'link',link:'https://github.com/teja-cmd',logoData:'',certData:''},
  {id:'c2',icon:'🐍',title:'Python for Data Science & AI',org:'IBM / Coursera',date:'2024',
   credId:'',desc:'Python fundamentals, data analysis, and AI basics.',
   category:'ai',srcType:'link',link:'',logoData:'',certData:''},
  {id:'c3',icon:'🌐',title:'Web Development Fundamentals',org:'Online Certification',date:'2024',
   credId:'',desc:'HTML5, CSS3, JavaScript and responsive design.',
   category:'web',srcType:'link',link:'',logoData:'',certData:''}
];

/* ─── Render cert cards ─── */
function renderCerts(){
  const grid  = document.getElementById('certGrid');
  const empty = document.getElementById('certEmpty');
  if(!grid) return;
  grid.innerHTML = '';
  if(!certs.length){ if(empty) empty.style.display='flex'; return; }
  if(empty) empty.style.display='none';

  const catColors = {
    ai:'#00f0ff', web:'#ff6b35', cloud:'#8b5cf6',
    data:'#34d399', lang:'#fbbf24', design:'#f472b6', general:'#94a3b8'
  };

  certs.forEach((c,i) => {
    // Resolve cert view URL — link or uploaded cert image
    const certHref = (c.srcType==='link' && c.link)
      ? c.link
      : (c.certData ? c.certData : null);

    const catColor = catColors[c.category] || '#94a3b8';
    const hasLogo  = c.logoData && c.logoData.startsWith('data:image');

    /* ══ TOP HALF: Company Logo ══ */
    const topPanel = hasLogo
      ? `<div class="ct-logo">
           <img src="${c.logoData}" alt="${san(c.org)} logo"/>
           <div class="ct-shimmer"></div>
         </div>`
      : `<div class="ct-logo ct-logo-fallback">
           <div class="ct-fallback-glow"></div>
           <span class="ct-fb-icon">${san(c.icon||'🏆')}</span>
           <span class="ct-fb-org">${san(c.org)}</span>
           <div class="ct-shimmer"></div>
         </div>`;

    /* ══ VIEW CERTIFICATE BUTTON ══
       • Uploaded image → lightbox <img>
       • Uploaded PDF   → lightbox <iframe> via blob URL
       • External link  → new tab directly (always works)
    ══════════════════════════════════════ */
    let viewBtn;
    if(c.srcType === 'file' && c.certData){
      // All uploaded files go through lightbox (data: URLs blocked in new tabs)
      const fileLabel = c.certData.startsWith('data:application/pdf') ? 'PDF' : 'Image';
      viewBtn = `<button class="cert-view-btn"
                   onclick="event.stopPropagation();openCertLightbox('${c.id}')">
                   <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                   View Certificate
                 </button>`;
    } else if(c.srcType === 'link' && c.link){
      // External link — open in new tab (Google Drive, Credly etc.)
      viewBtn = `<a href="${san(c.link)}" target="_blank" rel="noopener"
                    class="cert-view-btn"
                    onclick="event.stopPropagation()">
                    <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    View Certificate
                 </a>`;
    } else {
      viewBtn = `<span class="cert-no-link">&#128196; No certificate added</span>`;
    }

    /* ══ Admin row ══ */
    const adminRow = isAdmin
      ? `<div class="cert-adm">
           <button class="btn-e" onclick="openCertModal('${c.id}')">&#9998; Edit</button>
           <button class="btn-d" onclick="askDel('cert','${c.id}')">&#10005; Delete</button>
         </div>` : '';

    /* Card is a plain div — only the button opens cert */
    const card = document.createElement('div');
    card.className = 'cert-card';
    card.style.animationDelay = (i*0.07)+'s';

    card.innerHTML = `
      ${topPanel}
      <div class="ct-body">
        <div class="ct-cat-row">
          <span class="ct-cat" style="color:${catColor};background:${catColor}18;border-color:${catColor}30">
            ${san((c.category||'general').toUpperCase())}
          </span>
        </div>
        <h3 class="ct-title">${san(c.title)}</h3>
        <div class="ct-org">&#127970; ${san(c.org)}</div>
        <div class="ct-date">&#128197; ${san(c.date||'')}</div>
        ${c.credId ? `<div class="ct-cred">&#128273; ID: ${san(c.credId)}</div>` : ''}
        ${c.desc   ? `<p  class="ct-desc">${san(c.desc)}</p>` : ''}
        <div class="ct-footer">${viewBtn}</div>
      </div>
      ${adminRow}`;

    grid.appendChild(card);
  });
  initTilt();
}

/* ─── Cert drag list in admin panel ─── */
function renderCertDragList(){
  const c = document.getElementById('certDragList');
  if(!c) return;
  c.innerHTML = '';
  certs.forEach((cert,i) => {
    const div = document.createElement('div');
    div.className='dli'; div.draggable=true; div.dataset.id=cert.id; div.dataset.i=i;
    div.innerHTML=`<span class="dli-h">&#8597;</span><span class="dli-n">${i+1}</span><span class="dli-lbl">${san(cert.title)}</span><div class="dli-acts"><button class="dli-e" onclick="openCertModal('${cert.id}')">&#9998;</button><button class="dli-d" onclick="askDel('cert','${cert.id}')">&#10005;</button></div>`;
    div.addEventListener('dragstart',e=>{dragSrc=div;e.dataTransfer.effectAllowed='move';div.classList.add('dragging');});
    div.addEventListener('dragend',()=>{div.classList.remove('dragging');c.querySelectorAll('.dli').forEach(x=>x.classList.remove('drag-ov'));});
    div.addEventListener('dragover',e=>{e.preventDefault();if(div!==dragSrc)div.classList.add('drag-ov');});
    div.addEventListener('dragleave',()=>div.classList.remove('drag-ov'));
    div.addEventListener('drop',e=>{
      e.preventDefault(); div.classList.remove('drag-ov');
      if(!dragSrc||dragSrc===div) return;
      const from=parseInt(dragSrc.dataset.i), to=parseInt(div.dataset.i);
      const [m]=certs.splice(from,1); certs.splice(to,0,m);
      sv(K.CERT,certs); renderCertDragList(); renderCerts();
    });
    c.appendChild(div);
  });
}

/* ─── Source switcher (link ↔ upload) ─── */
/* ═══════════════════════════════════════════════
   CERT LIGHTBOX
   Handles 3 cases:
   1. Image (jpg/png)  → <img> inside modal
   2. PDF uploaded     → base64 → Blob URL → <iframe> inside modal
   3. External link    → handled by <a> tag directly (not here)
═══════════════════════════════════════════════ */
window.openCertLightbox = function(id){
  const c = certs.find(x => x.id === id);
  if(!c || !c.certData){ toast('No certificate file found.','err'); return; }

  const body  = document.getElementById('certLbBody');
  const title = document.getElementById('certLbTitle');
  const dlBtn = document.getElementById('certLbDl');
  const modal = document.getElementById('certLightbox');

  title.textContent = c.title || 'Certificate';

  // Clear previous content
  body.innerHTML = '';

  const isPDF = c.certData.startsWith('data:application/pdf') ||
                c.certData.startsWith('data:application/octet-stream');

  if(isPDF){
    /* ── PDF: convert base64 → Blob → object URL → show in <iframe> ──
       Blob URLs are NOT blocked by browsers (unlike data: URLs).       */
    try {
      const base64str  = c.certData.split(',')[1];
      const byteChars  = atob(base64str);
      const byteNums   = new Array(byteChars.length);
      for(let i = 0; i < byteChars.length; i++){
        byteNums[i] = byteChars.charCodeAt(i);
      }
      const byteArr  = new Uint8Array(byteNums);
      const blob     = new Blob([byteArr], { type: 'application/pdf' });
      const blobUrl  = URL.createObjectURL(blob);

      const iframe = document.createElement('iframe');
      iframe.src    = blobUrl;
      iframe.style.cssText = 'width:100%;height:100%;border:none;min-height:520px;background:#fff';
      iframe.title  = c.title || 'Certificate';
      body.appendChild(iframe);

      // Set download button
      dlBtn.href     = blobUrl;
      dlBtn.download = (c.org||'certificate').replace(/\s+/g,'-') + '-cert.pdf';
      dlBtn.style.display = 'inline-flex';

      // Revoke blob URL when modal is closed (memory cleanup)
      modal._revokeFn = () => URL.revokeObjectURL(blobUrl);

    } catch(err){
      console.error('PDF blob error:', err);
      body.innerHTML = `<div style="color:#ff8888;font-family:var(--fm);font-size:.82rem;text-align:center;padding:2rem">
        Failed to render PDF.<br><br>
        <a href="${c.certData}" download="certificate.pdf"
           style="color:var(--cy);border:1px solid var(--cy);padding:.5rem 1rem;border-radius:8px;text-decoration:none">
          &#11123; Download PDF instead
        </a>
      </div>`;
      dlBtn.style.display = 'none';
    }

  } else {
    /* ── Image (JPG / PNG etc.) → <img> tag ── */
    const img = document.createElement('img');
    img.src   = c.certData;
    img.alt   = c.title || 'Certificate';
    img.style.cssText = 'max-width:100%;max-height:calc(85vh - 80px);object-fit:contain;border-radius:6px;display:block';
    body.appendChild(img);

    // Set download button
    const ext = c.certData.startsWith('data:image/png') ? 'png' : 'jpg';
    dlBtn.href     = c.certData;
    dlBtn.download = (c.org||'certificate').replace(/\s+/g,'-') + '-cert.' + ext;
    dlBtn.style.display = 'inline-flex';

    modal._revokeFn = null;
  }

  openM(modal);
};

function initCertLightbox(){
  const modal = document.getElementById('certLightbox');
  document.getElementById('closeCertLb').addEventListener('click', () => {
    if(modal._revokeFn){ modal._revokeFn(); modal._revokeFn = null; }
    closeM(modal);
  });
  modal.addEventListener('click', e => {
    if(e.target === modal){
      if(modal._revokeFn){ modal._revokeFn(); modal._revokeFn = null; }
      closeM(modal);
    }
  });
}

window.cmSwitchSrc = function(type){
  document.getElementById('csLinkBox').style.display = type==='link' ? 'block' : 'none';
  document.getElementById('csFileBox').style.display = type==='file' ? 'block' : 'none';
  document.getElementById('csBtnLink').classList.toggle('act', type==='link');
  document.getElementById('csBtnFile').classList.toggle('act', type==='file');
};

/* ─── Open cert modal ─── */
window.openCertModal = function(id){
  certImgData = null;
  window._certLogoData = null;
  const m = document.getElementById('certModal');
  document.getElementById('cmTitle').textContent = id ? 'Edit Certificate' : 'Add Certificate';
  document.getElementById('cm-id').value = id || '';
  // Reset all fields
  ['cm-title','cm-org','cm-date','cm-cred','cm-desc','cm-link'].forEach(x=>{
    const el=document.getElementById(x); if(el) el.value='';
  });
  document.getElementById('cm-icon').value='🏆';
  document.getElementById('cm-cat').value='general';
  // Reset logo
  document.getElementById('cm-logo-file').value='';
  document.getElementById('cmLogoTxt').textContent='Click or drag to upload logo';
  document.getElementById('cmLogoTxt').style.color='';
  document.getElementById('cmLogoPreview').style.display='none';
  // Reset cert
  document.getElementById('cm-cert-file').value='';
  document.getElementById('cmCertTxt').textContent='Click or drag to upload certificate';
  document.getElementById('cmCertTxt').style.color='';
  document.getElementById('cmCertPreview').style.display='none';
  cmSwitchSrc('link');

  if(id){
    const c=certs.find(x=>x.id===id);
    if(c){
      document.getElementById('cm-title').value = c.title||'';
      document.getElementById('cm-org').value   = c.org||'';
      document.getElementById('cm-date').value  = c.date||'';
      document.getElementById('cm-cred').value  = c.credId||'';
      document.getElementById('cm-desc').value  = c.desc||'';
      document.getElementById('cm-icon').value  = c.icon||'🏆';
      document.getElementById('cm-cat').value   = c.category||'general';
      // Load logo preview
      if(c.logoData){
        window._certLogoData = c.logoData;
        document.getElementById('cmLogoTxt').textContent = 'Logo loaded ✓';
        document.getElementById('cmLogoTxt').style.color = 'var(--cy)';
        const lp = document.getElementById('cmLogoPreview');
        lp.src = c.logoData; lp.style.display = 'block';
      }
      // Load cert source
      if(c.srcType==='file' && c.certData){
        certImgData = c.certData;
        cmSwitchSrc('file');
        document.getElementById('cmCertTxt').textContent = 'Certificate loaded ✓';
        document.getElementById('cmCertTxt').style.color = 'var(--cy)';
        const cp = document.getElementById('cmCertPreview');
        cp.src = c.certData; cp.style.display = 'block';
      } else {
        document.getElementById('cm-link').value = c.link||'';
      }
    }
  }
  openM(m);
};

/* ─── Init cert modal listeners ─── */
function initCertModal(){
  const modal = document.getElementById('certModal');
  document.getElementById('closeCertModal').addEventListener('click',()=>closeM(modal));
  modal.addEventListener('click',e=>{if(e.target===modal)closeM(modal);});

  // ── Logo upload handler ──
  document.getElementById('cm-logo-file').addEventListener('change',e=>{
    const f=e.target.files[0];
    if(!f) return;
    if(f.size>2*1024*1024){toast('Logo too large. Max 2MB.','err');return;}
    const r=new FileReader();
    r.onload=ev=>{
      window._certLogoData = ev.target.result;
      document.getElementById('cmLogoTxt').textContent = f.name + ' ✓';
      document.getElementById('cmLogoTxt').style.color = 'var(--cy)';
      const prev = document.getElementById('cmLogoPreview');
      prev.src = window._certLogoData; prev.style.display='block';
    };
    r.readAsDataURL(f);
  });

  // ── Certificate file upload handler ──
  document.getElementById('cm-cert-file').addEventListener('change',e=>{
    const f = e.target.files[0];
    if(!f) return;
    if(f.size > 4*1024*1024){ toast('File too large. Max 4MB.','err'); return; }
    const r = new FileReader();
    r.onload = ev => {
      certImgData = ev.target.result;
      document.getElementById('cmCertTxt').textContent = f.name + ' ✓';
      document.getElementById('cmCertTxt').style.color = 'var(--cy)';
      const prev = document.getElementById('cmCertPreview');
      if(f.type === 'application/pdf'){
        // Can't preview PDF in <img> — show a styled placeholder
        prev.src = 'data:image/svg+xml,' + encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90">' +
          '<rect width="120" height="90" rx="8" fill="#0d0d18"/>' +
          '<rect x="8" y="8" width="104" height="74" rx="5" fill="#111120" stroke="#00f0ff" stroke-width="1.5" stroke-dasharray="4,3"/>' +
          '<text x="60" y="38" font-family="Arial" font-size="20" fill="#ff4444" text-anchor="middle" font-weight="bold">PDF</text>' +
          '<text x="60" y="55" font-family="Arial" font-size="7" fill="#94a3b8" text-anchor="middle">Ready to save</text>' +
          '<text x="60" y="67" font-family="Arial" font-size="6" fill="#4a5568" text-anchor="middle">' +
          f.name.substring(0,22) +
          '</text></svg>'
        );
      } else {
        prev.src = certImgData;
      }
      prev.style.display = 'block';
    };
    r.readAsDataURL(f);
  });

  // ── Save button ──
  document.getElementById('saveCertBtn').addEventListener('click',()=>{
    const title = document.getElementById('cm-title').value.trim();
    const org   = document.getElementById('cm-org').value.trim();
    if(!title||!org){toast('Title and organization required!','err');return;}

    const isLink = document.getElementById('csBtnLink').classList.contains('act');
    const id     = document.getElementById('cm-id').value || uid();

    const cert = {
      id, title, org,
      date    : document.getElementById('cm-date').value.trim(),
      credId  : document.getElementById('cm-cred').value.trim(),
      desc    : document.getElementById('cm-desc').value.trim(),
      icon    : document.getElementById('cm-icon').value.trim() || '🏆',
      category: document.getElementById('cm-cat').value,
      logoData: window._certLogoData || '',       // company logo (top half)
      srcType : isLink ? 'link' : 'file',
      link    : isLink ? document.getElementById('cm-link').value.trim() : '',
      certData: isLink ? '' : (certImgData||''),  // actual certificate (view btn)
    };

    const idx = certs.findIndex(c=>c.id===id);
    if(idx>=0) certs[idx]=cert; else certs.unshift(cert);
    sv(K.CERT,certs);
    closeM(modal);
    renderCerts();
    renderCertDragList();
    certImgData = null;
    window._certLogoData = null;
    toast(idx>=0 ? 'Certificate updated! ✓' : 'Certificate added! ✓');
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  loadAll();
  runLoader();
  initNavbar();
  initCursor();
  initParticles();
  initTyping();
  initReveal();
  initSkillObs();
  initAdmin();
  initContact();
  initGlitch();
  initScroll();
  applyPhoto(photo);
  applyIdentity();
  applyAbout();
  applyStats();
  applyBadge();
  applyFooter();
  renderSkills();
  renderProjects();
  renderExp();
  renderCerts();
  initCertModal();
  initCertLightbox();
  setTimeout(initTilt,400);
  // smooth scroll anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}}));
});