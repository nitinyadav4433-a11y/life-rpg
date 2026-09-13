'use client';

import {useEffect,useMemo,useState} from 'react';
import {motion,AnimatePresence} from 'framer-motion';
import {Swords,Brain,HeartPulse,Target,Flame,Coins,Plus,Trash2,LogOut,Package,Shield,Check,LockKeyhole,Sparkles} from 'lucide-react';

type Quest={id:string;title:string;description?:string|null;category:string;difficulty:string;xpReward:number;goldReward:number;attribute:string;completedAt:string|null};
type Character={level:number;xp:number;gold:number;strength:number;intellect:number;vitality:number;discipline:number;equippedItemKey:string|null};
type Dash={user:{username:string;email:string;character:Character};quests:Quest[];inventory:{itemKey:string;quantity:number}[];badges:any[];streak:number};

const xpFor=(l:number)=>Math.floor(150*Math.pow(l,1.55));
const iconMap:any={Strength:Swords,Intellect:Brain,Vitality:HeartPulse,Discipline:Target};
const itemMap:any={
  ember:{name:'Ember Aura',cost:120,icon:'✦'},
  focus:{name:'Focus Sigil',cost:180,icon:'◈'},
  moonlit:{name:'Moonlit Theme',cost:260,icon:'☾'}
};

export default function Home(){
  const [dash,setDash]=useState<Dash|null>(null),[auth,setAuth]=useState<'login'|'register'>('login'),[loading,setLoading]=useState(true),[error,setError]=useState(''),[toast,setToast]=useState(''),[showCreate,setShowCreate]=useState(false),[showShop,setShowShop]=useState(false),[form,setForm]=useState({title:'',category:'Coding',difficulty:'Medium',attribute:'Intellect'});

  const load=async()=>{setLoading(true);const r=await fetch('/api/dashboard',{cache:'no-store'});if(r.ok)setDash(await r.json());else setDash(null);setLoading(false)};
  useEffect(()=>{load()},[]);

  const submitAuth=async(e:any)=>{e.preventDefault();setError('');const fd=new FormData(e.currentTarget);const body=Object.fromEntries(fd.entries());const r=await fetch('/api/auth/'+auth,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const j=await r.json();if(!r.ok)return setError(j.error||'Something went wrong.');await load()};
  const create=async()=>{if(!form.title.trim())return setError('Give your quest a name.');const r=await fetch('/api/quests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});const j=await r.json();if(!r.ok)return setError(j.error);setShowCreate(false);setForm({...form,title:''});setToast('Quest forged ✦');setTimeout(()=>setToast(''),2200);await load()};
  const complete=async(q:Quest)=>{if(q.completedAt)return;setDash(d=>d?{...d,quests:d.quests.map(x=>x.id===q.id?{...x,completedAt:new Date().toISOString()}:x)}:d);const r=await fetch('/api/quests/'+q.id+'/complete',{method:'POST'});if(!r.ok){await load();return setError('Could not complete quest.')}const j=await r.json();setToast(j.leveledUp?'LEVEL UP! You ascended ✦':`Quest complete · +${q.xpReward} XP · +${q.goldReward} Gold`);setTimeout(()=>setToast(''),2600);await load()};
  const remove=async(id:string)=>{await fetch('/api/quests/'+id,{method:'DELETE'});await load()};

  const buy=async(k:string)=>{
    setError('');
    const r=await fetch('/api/inventory/'+k+'/buy',{method:'POST'});
    const j=await r.json();
    if(!r.ok)return setError(j.error);
    setToast(`${itemMap[k].name} acquired ✦`);
    setTimeout(()=>setToast(''),2200);
    await load();
  };

  const equip=async(k:string)=>{
    setError('');
    const r=await fetch('/api/inventory/'+k+'/equip',{method:'POST'});
    const j=await r.json();
    if(!r.ok)return setError(j.error);
    setToast(`${itemMap[k].name} equipped ✦`);
    setTimeout(()=>setToast(''),2200);
    await load();
  };

  const c=dash?.user.character;
  const need=c?xpFor(c.level):0;
  const pct=c?Math.min(100,c.xp/need*100):0;
  const today=dash?.quests.filter(q=>!q.completedAt).slice(0,8)||[];
  const owned=new Set(dash?.inventory.map(i=>i.itemKey)||[]);
  const equipped=c?.equippedItemKey||null;
  const appClass=equipped?`app cosmetic-${equipped}`:'app';

  if(loading)return <div className="loading"><Sparkles/>Entering the realm…</div>;
  if(!dash)return <main className="auth-page"><div className="auth-card"><div className="logo">LIFE<span>RPG</span></div><p className="tagline">Turn ordinary days into legendary progress.</p><div className="auth-tabs"><button className={auth==='login'?'active':''} onClick={()=>setAuth('login')}>Login</button><button className={auth==='register'?'active':''} onClick={()=>setAuth('register')}>Create Character</button></div><form onSubmit={submitAuth}>{auth==='register'&&<input name="username" placeholder="Username" required minLength={3}/>}<input name="email" type="email" placeholder="Email" required/><input name="password" type="password" placeholder="Password" required minLength={8}/>{error&&<div className="error">{error}</div>}<button className="btn primary full">{auth==='login'?'ENTER THE REALM':'BEGIN YOUR QUEST'}</button></form><div className="secure"><LockKeyhole size={14}/> Secure session · server-side progression</div></div></main>;

  return <main className={appClass}>
    <header className="topbar"><div className="logo small-logo">LIFE<span>RPG</span></div><div className="top-actions"><div className="coin"><Coins size={17}/> {c?.gold}</div><div className="user-chip">{dash.user.username}</div><button className="icon-btn" title="Logout" onClick={async()=>{await fetch('/api/auth/logout',{method:'POST'});setDash(null)}}><LogOut size={18}/></button></div></header>
    <div className="content">
      <aside className="side">
        <div className="avatar"><Shield/></div>
        <div className="eyebrow">CHARACTER</div><h2>{dash.user.username}</h2>
        <div className="class">{equipped?`${itemMap[equipped]?.name.toUpperCase()} EQUIPPED`:'THE DISCIPLINED ADVENTURER'}</div>
        <div className="level-row"><b>LEVEL {c?.level}</b><span>{c?.xp} / {need} XP</span></div>
        <div className="xpbar"><motion.div animate={{width:pct+'%'}}/></div>
        <div className="muted">{need-(c?.xp||0)} XP to next level</div>
        <div className="stats">{[['Strength',c?.strength],['Intellect',c?.intellect],['Vitality',c?.vitality],['Discipline',c?.discipline]].map(([n,v]:any)=>{const I=iconMap[n];return <div className="stat" key={n}><I size={17}/><span>{n}</span><b>{v}</b></div>})}</div>
        <div className="side-card"><div className="eyebrow">MOMENTUM</div><div className="streak"><Flame/> {dash.streak}<span>DAY STREAK</span></div><div className="muted">Complete a quest today to keep your fire alive.</div></div>
        <button className="shop-link" onClick={()=>setShowShop(true)}><Package size={17}/> Inventory & Rewards</button>
      </aside>

      <section className="main">
        <div className="hero"><div><div className="eyebrow">DAILY CAMPAIGN</div><h1>Today's Quests</h1><p>Small victories compound into a stronger character.</p></div><button className="btn primary" onClick={()=>{setError('');setShowCreate(true)}}><Plus size={18}/> New Quest</button></div>
        <div className="quest-list">{today.length===0&&<div className="empty"><Sparkles/><h3>All quests conquered</h3><p>Forge another quest and keep the momentum.</p></div>}{today.map((q,i)=><motion.article layout key={q.id} className="quest" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*.04}}><button className="check" onClick={()=>complete(q)} aria-label={'Complete '+q.title}><Check/></button><div className="quest-info"><h3>{q.title}</h3><div className="meta"><span>{q.category}</span><span>{q.difficulty}</span><span>+{q.attribute}</span></div></div><div className="reward"><b>+{q.xpReward} XP</b><span>+{q.goldReward} G</span></div><button className="delete" onClick={()=>remove(q.id)} aria-label="Delete quest"><Trash2 size={16}/></button></motion.article>)}</div>
        <div className="bottom-grid"><div className="feature-card"><div className="feature-icon"><Flame/></div><div><div className="eyebrow">STREAK</div><h3>{dash.streak} days of momentum</h3><p>Your activity history is persisted on the server.</p></div></div><div className="feature-card"><div className="feature-icon"><Sparkles/></div><div><div className="eyebrow">NEXT ASCENSION</div><h3>Level {(c?.level||1)+1}</h3><p>Push your XP bar beyond the next threshold.</p></div></div></div>
      </section>
    </div>

    <AnimatePresence>{toast&&<motion.div className="toast" initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:20,opacity:0}}>{toast}</motion.div>}</AnimatePresence>

    {showCreate&&<div className="overlay"><div className="modal"><div className="eyebrow">QUEST FORGE</div><h2>Create a New Quest</h2><input autoFocus placeholder="What will you conquer?" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><div className="two"><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{['Coding','Study','Fitness','Health','Personal'].map(x=><option key={x}>{x}</option>)}</select><select value={form.difficulty} onChange={e=>setForm({...form,difficulty:e.target.value})}>{['Easy','Medium','Hard'].map(x=><option key={x}>{x}</option>)}</select></div><select value={form.attribute} onChange={e=>setForm({...form,attribute:e.target.value})}>{['Intellect','Strength','Vitality','Discipline'].map(x=><option key={x}>{x}</option>)}</select><div className="modal-actions"><button className="btn" onClick={()=>setShowCreate(false)}>Cancel</button><button className="btn primary" onClick={create}>Forge Quest</button></div></div></div>}

    {showShop&&<div className="overlay"><div className="modal shop"><div className="eyebrow">TREASURY</div><h2>Rewards & Loot</h2><p className="muted">Buy and equip cosmetic rewards. Your equipped item persists after refresh.</p>
      {Object.entries(itemMap).map(([k,v]:any)=>{
        const isOwned=owned.has(k);
        const isEquipped=equipped===k;
        return <div className={`shop-item ${isEquipped?'equipped':''}`} key={k}>
          <div className="loot">{v.icon}</div>
          <div><b>{v.name}</b><div className="muted">{isEquipped?'Currently equipped':isOwned?'Owned · ready to equip':'Virtual cosmetic reward'}</div></div>
          {!isOwned
            ? <button className="btn gold" disabled={(c?.gold||0)<v.cost} onClick={()=>buy(k)}><Coins size={15}/>{v.cost}</button>
            : <button className={`btn ${isEquipped?'equipped-btn':'gold'}`} onClick={()=>equip(k)} disabled={isEquipped}>{isEquipped?'Equipped ✓':'Equip'}</button>}
        </div>
      })}
      <button className="btn full" onClick={()=>setShowShop(false)}>Close</button></div></div>}

    {error&&<div className="error floating" onClick={()=>setError('')}>{error}</div>}
  </main>
}
