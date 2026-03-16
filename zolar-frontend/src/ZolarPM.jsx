/* eslint-disable */
import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');`;

// ── DATA ─────────────────────────────────────────────────────
const INIT_USERS = [
  {id:"u1",name:"Vikash Verma",email:"vikash.verma@videwan.com",role:"admin",avatar:"VV",dept:"Management",title:"Admin / Founder",status:"active",gender:"Male",phone:"",joined:"2026-01-01",managerName:"",password:"Vikash@123"},
];

const INIT_PROJECTS = [
  {id:"p1",name:"Zolar Dashboard v2",description:"Complete redesign of the analytics dashboard with real-time data",status:"active",priority:"critical",progress:68,startDate:"2025-01-01",deadline:"2025-04-30",manager:"u2",color:"#06b6d4",members:["u2","u3","u4"],tags:["design","frontend"]},
  {id:"p2",name:"API Gateway Migration",description:"Migrate all microservices to new API gateway with improved security",status:"active",priority:"high",progress:35,startDate:"2025-02-01",deadline:"2025-05-15",manager:"u1",color:"#f59e0b",members:["u1","u3","u6"],tags:["backend","security"]},
  {id:"p3",name:"Mobile App Launch",description:"iOS and Android application development for B2C market",status:"planning",priority:"high",progress:12,startDate:"2025-03-01",deadline:"2025-08-01",manager:"u2",color:"#8b5cf6",members:["u2","u4","u5"],tags:["mobile","product"]},
  {id:"p4",name:"Customer Portal",description:"Self-service customer portal with billing and support integration",status:"completed",priority:"medium",progress:100,startDate:"2024-10-01",deadline:"2025-02-28",manager:"u2",color:"#10b981",members:["u2","u3"],tags:["fullstack"]},
  {id:"p5",name:"Data Pipeline",description:"Build ETL pipeline for analytics and reporting",status:"on_hold",priority:"low",progress:45,startDate:"2025-01-15",deadline:"2025-06-30",manager:"u1",color:"#ef4444",members:["u1","u3"],tags:["data","backend"]},
];

const INIT_TASKS = [
  {id:"t1",projectId:"p1",title:"Design system audit",description:"Audit all existing components and identify inconsistencies",status:"completed",priority:"high",assignee:"u4",creator:"u2",deadline:"2025-03-10",createdAt:"2025-02-20",comments:3,attachments:2,tags:["design"],timeLogged:4.5},
  {id:"t2",projectId:"p1",title:"Implement dark mode tokens",description:"Create CSS variables for dark mode across all components",status:"in_progress",priority:"medium",assignee:"u4",creator:"u2",deadline:"2025-03-25",createdAt:"2025-02-21",comments:1,attachments:0,tags:["frontend"],timeLogged:2},
  {id:"t3",projectId:"p1",title:"Dashboard analytics widgets",description:"Build real-time analytics widgets with Chart.js integration",status:"in_progress",priority:"critical",assignee:"u3",creator:"u2",deadline:"2025-04-01",createdAt:"2025-02-22",comments:5,attachments:1,tags:["frontend","data"],timeLogged:8},
  {id:"t4",projectId:"p1",title:"Performance optimization",description:"Reduce bundle size and improve LCP scores",status:"todo",priority:"high",assignee:"u3",creator:"u1",deadline:"2025-04-15",createdAt:"2025-02-25",comments:0,attachments:0,tags:["performance"],timeLogged:0},
  {id:"t5",projectId:"p1",title:"User testing sessions",description:"Conduct 5 user testing sessions and document findings",status:"review",priority:"medium",assignee:"u5",creator:"u2",deadline:"2025-04-20",createdAt:"2025-03-01",comments:2,attachments:3,tags:["research"],timeLogged:6},
  {id:"t6",projectId:"p2",title:"Gateway security audit",description:"Comprehensive security review of new API gateway",status:"in_progress",priority:"critical",assignee:"u1",creator:"u1",deadline:"2025-03-30",createdAt:"2025-02-15",comments:4,attachments:2,tags:["security"],timeLogged:12},
  {id:"t7",projectId:"p2",title:"Rate limiting implementation",description:"Implement per-user and per-IP rate limiting",status:"todo",priority:"high",assignee:"u3",creator:"u1",deadline:"2025-04-10",createdAt:"2025-02-18",comments:0,attachments:0,tags:["backend"],timeLogged:0},
  {id:"t8",projectId:"p2",title:"Documentation update",description:"Update API documentation with new gateway endpoints",status:"todo",priority:"low",assignee:"u6",creator:"u1",deadline:"2025-05-01",createdAt:"2025-03-01",comments:0,attachments:0,tags:["docs"],timeLogged:0},
  {id:"t9",projectId:"p3",title:"App architecture planning",description:"Define mobile app architecture and tech stack",status:"completed",priority:"critical",assignee:"u2",creator:"u2",deadline:"2025-03-15",createdAt:"2025-03-01",comments:6,attachments:4,tags:["planning"],timeLogged:10},
  {id:"t10",projectId:"p3",title:"UI wireframes",description:"Create low and high-fidelity wireframes for all screens",status:"in_progress",priority:"high",assignee:"u4",creator:"u2",deadline:"2025-04-01",createdAt:"2025-03-05",comments:2,attachments:8,tags:["design"],timeLogged:15},
];

const INIT_EVENTS = [
  {id:"ev1",title:"Sprint Planning",date:"2026-03-17",time:"10:00",type:"meeting",projectId:"p1",notes:""},
  {id:"ev2",title:"Design Review",date:"2026-03-19",time:"14:00",type:"meeting",projectId:"p1",notes:""},
  {id:"ev3",title:"Team Standup",date:"2026-03-14",time:"09:30",type:"meeting",projectId:"",notes:"Daily standup"},
];

const INIT_NOTIFS = [
  {id:"n1",type:"task_assigned",title:"New task assigned",message:"Dashboard analytics widgets was assigned to you",time:"2 min ago",read:false},
  {id:"n2",type:"deadline",title:"Deadline approaching",message:"Gateway security audit is due in 3 days",time:"1 hour ago",read:false},
  {id:"n3",type:"comment",title:"New comment",message:"Sarah Chen commented on User testing sessions",time:"3 hours ago",read:true},
  {id:"n4",type:"task_completed",title:"Task completed",message:"App architecture planning marked as completed",time:"1 day ago",read:true},
];

// ── UTILS ────────────────────────────────────────────────────
const pColor = p => ({critical:"#ef4444",high:"#f59e0b",medium:"#06b6d4",low:"#6b7280"}[p]||"#6b7280");
const sColor = s => ({completed:"#10b981",active:"#06b6d4",in_progress:"#06b6d4",todo:"#6b7280",review:"#8b5cf6",testing:"#f59e0b",planning:"#f59e0b",on_hold:"#f59e0b",cancelled:"#ef4444",backlog:"#4b5563"}[s]||"#6b7280");
const sLabel = s => ({completed:"Completed",active:"Active",in_progress:"In Progress",todo:"To Do",review:"Review",testing:"Testing",planning:"Planning",on_hold:"On Hold",cancelled:"Cancelled",backlog:"Backlog"}[s]||s);
const rLabel = r => ({admin:"Admin",project_manager:"Project Manager",team_member:"Team Member",viewer:"Viewer"}[r]||r);
const rColor = r => ({admin:"#ef4444",project_manager:"#f59e0b",team_member:"#06b6d4",viewer:"#6b7280"}[r]||"#6b7280");
const fmtDate = d => d?new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"—";
const daysLeft = d => d?Math.ceil((new Date(d)-new Date())/(864e5)):null;
const initials = n => n?n.split(" ").map(x=>x[0]).join("").toUpperCase().slice(0,2):"?";
const uid = () => "id"+Date.now()+Math.random().toString(36).slice(2,6);

// ── BASE COMPONENTS ──────────────────────────────────────────
const Av = ({u,size=32,style={}}) => {
  const cols=["#06b6d4","#f59e0b","#8b5cf6","#10b981","#ef4444","#3b82f6"];
  const i = u?u.charCodeAt(0)%cols.length:0;
  return <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${cols[i]},${cols[(i+2)%6]})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.35,fontWeight:600,color:"#fff",flexShrink:0,...style}}>{u||"?"}</div>;
};

const Badge = ({label,color,sm}) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:sm?"2px 8px":"3px 10px",borderRadius:20,fontSize:sm?10:11,fontWeight:600,background:color+"22",color,border:`1px solid ${color}33`,textTransform:"uppercase",letterSpacing:"0.04em",whiteSpace:"nowrap"}}>
    <span style={{width:sm?5:6,height:sm?5:6,borderRadius:"50%",background:color,flexShrink:0}}/>
    {label}
  </span>
);

const Bar = ({v,color="#06b6d4",h=6}) => (
  <div style={{width:"100%",height:h,background:"rgba(255,255,255,0.06)",borderRadius:99,overflow:"hidden"}}>
    <div style={{width:`${Math.min(100,v||0)}%`,height:"100%",background:`linear-gradient(90deg,${color},${color}cc)`,borderRadius:99,transition:"width .6s"}}/>
  </div>
);

const Inp = ({label,value,onChange,type="text",placeholder,req,disabled,small}) => (
  <div style={{marginBottom:small?8:16}}>
    {label&&<label style={{display:"block",fontSize:11,fontWeight:600,color:"#94a3b8",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}{req&&<span style={{color:"#ef4444"}}> *</span>}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      style={{width:"100%",padding:small?"7px 10px":"10px 14px",background:disabled?"rgba(255,255,255,0.02)":"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,color:"#f1f5f9",fontSize:small?12:14,fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box",opacity:disabled?.6:1}}
      onFocus={e=>{if(!disabled)e.target.style.borderColor="#06b6d4";}} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
  </div>
);

const Sel = ({label,value,onChange,options,req}) => (
  <div style={{marginBottom:16}}>
    {label&&<label style={{display:"block",fontSize:11,fontWeight:600,color:"#94a3b8",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}{req&&<span style={{color:"#ef4444"}}> *</span>}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"10px 14px",background:"#0f1318",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,color:"#f1f5f9",fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",cursor:"pointer"}}>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Txta = ({label,value,onChange,placeholder,rows=3}) => (
  <div style={{marginBottom:16}}>
    {label&&<label style={{display:"block",fontSize:11,fontWeight:600,color:"#94a3b8",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</label>}
    <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{width:"100%",padding:"10px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,color:"#f1f5f9",fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",resize:"vertical",boxSizing:"border-box"}}
      onFocus={e=>e.target.style.borderColor="#06b6d4"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
  </div>
);

const Btn = ({children,onClick,variant="primary",icon,sm,disabled,sx={}}) => {
  const vs={primary:{background:"linear-gradient(135deg,#06b6d4,#0891b2)",color:"#fff",border:"none"},secondary:{background:"rgba(255,255,255,0.07)",color:"#e2e8f0",border:"1px solid rgba(255,255,255,0.1)"},danger:{background:"rgba(239,68,68,0.15)",color:"#ef4444",border:"1px solid rgba(239,68,68,0.3)"},success:{background:"rgba(16,185,129,0.15)",color:"#10b981",border:"1px solid rgba(16,185,129,0.3)"},ghost:{background:"transparent",color:"#94a3b8",border:"none"}};
  return <button onClick={disabled?null:onClick} disabled={disabled} style={{display:"inline-flex",alignItems:"center",gap:6,padding:sm?"5px 12px":"9px 18px",borderRadius:sm?7:10,fontSize:sm?11:13,fontWeight:600,cursor:disabled?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",opacity:disabled?.5:1,transition:"all .2s",whiteSpace:"nowrap",...vs[variant],...sx}}>{icon&&<span style={{fontSize:13}}>{icon}</span>}{children}</button>;
};

const Modal = ({open,onClose,title,children,width=560}) => {
  if(!open) return null;
  return <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20,backdropFilter:"blur(4px)"}}>
    <div onClick={e=>e.stopPropagation()} style={{background:"#141920",border:"1px solid rgba(255,255,255,0.1)",borderRadius:16,width:"100%",maxWidth:width,maxHeight:"90vh",overflow:"auto",boxShadow:"0 24px 80px rgba(0,0,0,0.6)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
        <h3 style={{margin:0,fontSize:17,fontWeight:600,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif"}}>{title}</h3>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.07)",border:"none",color:"#94a3b8",width:30,height:30,borderRadius:8,cursor:"pointer",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
      </div>
      <div style={{padding:24}}>{children}</div>
    </div>
  </div>;
};

const Donut = ({data,size=130}) => {
  const total = data.reduce((s,d)=>s+d.value,0)||1;
  let cum=0; const r=50,cx=size/2,cy=size/2;
  const segs = data.map(d=>{
    const pct=d.value/total,s=cum,e=cum+pct; cum=e;
    const a1=(s*2*Math.PI)-Math.PI/2, a2=(e*2*Math.PI)-Math.PI/2;
    const x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1),x2=cx+r*Math.cos(a2),y2=cy+r*Math.sin(a2);
    return {...d,path:`M${cx},${cy} L${x1},${y1} A${r},${r},0,${pct>.5?1:0},1,${x2},${y2}Z`};
  });
  return <svg width={size} height={size} style={{flexShrink:0}}>
    <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.03)"/>
    {segs.map((s,i)=><path key={i} d={s.path} fill={s.color} opacity={.85}/>)}
    <circle cx={cx} cy={cy} r={r*.58} fill="#0f1318"/>
    <text x={cx} y={cy} textAnchor="middle" dy=".35em" fill="#f1f5f9" fontSize={16} fontWeight={700} fontFamily="'Clash Display',sans-serif">{total}</text>
  </svg>;
};

const BarC = ({data,color,h=80}) => {
  const max=Math.max(...data.map(d=>d.value),1);
  return <div style={{display:"flex",alignItems:"flex-end",gap:6,height:h}}>
    {data.map((d,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
      <div style={{width:"100%",height:`${(d.value/max)*100}%`,minHeight:4,background:`linear-gradient(180deg,${color},${color}88)`,borderRadius:"4px 4px 0 0"}}/>
      <span style={{fontSize:9,color:"#475569"}}>{d.label}</span>
    </div>)}
  </div>;
};

const StatCard = ({label,value,icon,color,sub,trend}) => (
  <div style={{background:"linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"18px 22px",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:-15,right:-15,fontSize:70,opacity:.04}}>{icon}</div>
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
      <div style={{width:38,height:38,borderRadius:11,background:color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,border:`1px solid ${color}33`}}>{icon}</div>
      {trend&&<span style={{fontSize:10,fontWeight:600,color:trend>0?"#10b981":"#ef4444",background:trend>0?"#10b98122":"#ef444422",padding:"2px 7px",borderRadius:20}}>{trend>0?"↑":"↓"}{Math.abs(trend)}%</span>}
    </div>
    <div style={{fontSize:28,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif",lineHeight:1}}>{value}</div>
    <div style={{fontSize:12,color:"#64748b",marginTop:3,fontWeight:500}}>{label}</div>
    {sub&&<div style={{fontSize:11,color:"#475569",marginTop:5}}>{sub}</div>}
  </div>
);

// ── SIDEBAR ──────────────────────────────────────────────────
const NAV=[
  {id:"dashboard",icon:"◈",label:"Dashboard"},
  {id:"projects",icon:"◧",label:"Projects"},
  {id:"tasks",icon:"◇",label:"Tasks"},
  {id:"kanban",icon:"▦",label:"Kanban"},
  {id:"team",icon:"◎",label:"Team"},
  {id:"calendar",icon:"◫",label:"Calendar"},
  {id:"reports",icon:"◉",label:"Reports"},
  {id:"files",icon:"◱",label:"Files"},
  {id:"activity",icon:"◐",label:"Activity"},
  {id:"settings",icon:"⚙",label:"Settings"},
];

const Sidebar = ({active,onNav,collapsed,unread}) => (
  <div style={{width:collapsed?60:215,flexShrink:0,background:"#0d1117",borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",transition:"width .25s",overflow:"hidden"}}>
    <div style={{padding:collapsed?"16px 10px":"18px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",gap:9}}>
      <div style={{width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,boxShadow:"0 0 20px rgba(6,182,212,0.3)"}}>⬡</div>
      {!collapsed&&<div><div style={{fontSize:13,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif"}}>ZOLAR</div><div style={{fontSize:8,color:"#475569",letterSpacing:"0.1em",textTransform:"uppercase"}}>PROJECT MGMT</div></div>}
    </div>
    <nav style={{flex:1,padding:"10px 7px",overflowY:"auto"}}>
      {NAV.map(n=>{
        const act=active===n.id||(active==="project_detail"&&n.id==="projects");
        return <button key={n.id} onClick={()=>onNav(n.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:9,border:"none",cursor:"pointer",marginBottom:2,fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:act?600:400,transition:"all .15s",textAlign:"left",position:"relative",background:act?"rgba(6,182,212,0.12)":"transparent",color:act?"#06b6d4":"#64748b"}}>
          <span style={{fontSize:15,flexShrink:0,width:20,textAlign:"center"}}>{n.icon}</span>
          {!collapsed&&<span>{n.label}</span>}
          {n.id==="dashboard"&&unread>0&&!collapsed&&<span style={{marginLeft:"auto",background:"#ef4444",color:"#fff",fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:20}}>{unread}</span>}
          {act&&<div style={{position:"absolute",left:0,top:"20%",bottom:"20%",width:3,borderRadius:"0 2px 2px 0",background:"#06b6d4"}}/>}
        </button>;
      })}
    </nav>
  </div>
);

// ── TOPBAR ───────────────────────────────────────────────────
const TopBar = ({title,onToggle,notifs,onNotif,onSearch,user,onProfile}) => {
  const unread=notifs.filter(n=>!n.read).length;
  return <div style={{height:58,background:"rgba(13,17,23,0.97)",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",padding:"0 18px",gap:14,flexShrink:0,backdropFilter:"blur(10px)"}}>
    <button onClick={onToggle} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,width:32,height:32,cursor:"pointer",color:"#64748b",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>☰</button>
    <div style={{flex:1,fontSize:15,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif"}}>{title}</div>
    <div style={{display:"flex",alignItems:"center",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:9,padding:"6px 11px",gap:7,width:210}}>
      <span style={{color:"#475569",fontSize:13}}>⌕</span>
      <input onChange={e=>onSearch(e.target.value)} placeholder="Search..." style={{background:"transparent",border:"none",outline:"none",color:"#94a3b8",fontSize:13,fontFamily:"'DM Sans',sans-serif",width:"100%"}}/>
    </div>
    <button onClick={onNotif} style={{position:"relative",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,width:36,height:36,cursor:"pointer",color:"#94a3b8",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>
      🔔{unread>0&&<span style={{position:"absolute",top:4,right:4,width:8,height:8,borderRadius:"50%",background:"#ef4444",border:"1px solid #0d1117"}}/>}
    </button>
    <div onClick={onProfile} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"4px 10px",borderRadius:9,border:"1px solid transparent",transition:"all .15s"}}
      onMouseEnter={e=>{e.currentTarget.style.background="rgba(6,182,212,0.08)";e.currentTarget.style.borderColor="rgba(6,182,212,0.25)";}}
      onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="transparent";}}>
      <Av u={user?.avatar||"AM"} size={32}/>
      <div>
        <div style={{fontSize:12,fontWeight:600,color:"#e2e8f0"}}>{user?.name||"Alex Morgan"}</div>
        <div style={{fontSize:10,color:"#06b6d4"}}>✎ Edit Profile</div>
      </div>
    </div>
  </div>;
};

// ── NOTIFICATIONS PANEL ──────────────────────────────────────
const NotifsPanel = ({notifs,onRead,onClose}) => (
  <div style={{position:"fixed",top:58,right:14,width:350,background:"#141920",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,zIndex:500,boxShadow:"0 20px 60px rgba(0,0,0,0.5)",overflow:"hidden"}}>
    <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:14,fontWeight:600,color:"#f1f5f9"}}>Notifications</span>
      <button onClick={onClose} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:17}}>×</button>
    </div>
    <div style={{maxHeight:380,overflowY:"auto"}}>
      {notifs.map(n=><div key={n.id} onClick={()=>onRead(n.id)} style={{padding:"12px 18px",borderBottom:"1px solid rgba(255,255,255,0.05)",cursor:"pointer",background:n.read?"transparent":"rgba(6,182,212,0.04)"}}
        onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
        onMouseLeave={e=>e.currentTarget.style.background=n.read?"transparent":"rgba(6,182,212,0.04)"}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
          <span style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{n.title}</span>
          {!n.read&&<div style={{width:7,height:7,borderRadius:"50%",background:"#06b6d4",marginTop:4,flexShrink:0}}/>}
        </div>
        <div style={{fontSize:12,color:"#64748b",marginBottom:3}}>{n.message}</div>
        <div style={{fontSize:10,color:"#374151"}}>{n.time}</div>
      </div>)}
    </div>
  </div>
);

// ── PROFILE EDIT MODAL ───────────────────────────────────────
const ProfileModal = ({open,onClose,user,onSave}) => {
  const [f,setF] = useState({name:"",email:"",title:"",dept:"",phone:"",gender:"Male",managerName:""});
  useEffect(()=>{if(user)setF({name:user.name||"",email:user.email||"",title:user.title||"",dept:user.dept||"",phone:user.phone||"",gender:user.gender||"Male",managerName:user.managerName||""});},[user]);
  const up = k => v => setF(p=>({...p,[k]:v}));
  const save = () => {onSave({...user,...f,avatar:initials(f.name)});onClose();};
  return <Modal open={open} onClose={onClose} title="✎ Edit My Profile" width={600}>
    <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20,padding:16,background:"rgba(6,182,212,0.06)",borderRadius:12,border:"1px solid rgba(6,182,212,0.15)"}}>
      <Av u={initials(f.name)} size={58}/>
      <div>
        <div style={{fontSize:15,fontWeight:700,color:"#f1f5f9"}}>{f.name||"Your Name"}</div>
        <div style={{fontSize:12,color:"#64748b"}}>{f.email}</div>
        <Badge label={rLabel(user?.role||"team_member")} color={rColor(user?.role||"team_member")} sm/>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <Inp label="Full Name" value={f.name} onChange={up("name")} req/>
      <Inp label="Email" type="email" value={f.email} onChange={up("email")} req/>
      <Inp label="Job Title / Profile" value={f.title} onChange={up("title")} placeholder="e.g. Senior Developer"/>
      <Inp label="Department" value={f.dept} onChange={up("dept")} placeholder="e.g. Engineering"/>
      <Inp label="Phone Number" value={f.phone} onChange={up("phone")} placeholder="+91 9876543210"/>
      <Sel label="Gender" value={f.gender} onChange={up("gender")} options={[{value:"Male",label:"Male"},{value:"Female",label:"Female"},{value:"Other",label:"Other"}]}/>
    </div>
    <Inp label="Manager Name" value={f.managerName} onChange={up("managerName")} placeholder="Your reporting manager's name"/>
    <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
      <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
      <Btn variant="primary" onClick={save}>Save Profile</Btn>
    </div>
  </Modal>;
};

// ── ACCOUNT SETUP PAGE (First-time user) ─────────────────────
const AccountSetup = ({token,onComplete}) => {
  const [step,setStep] = useState(1);
  const [f,setF] = useState({name:"",phone:"",title:"",managerName:"",dept:"",email:"",password:"",confirmPass:""});
  const up = k => v => setF(p=>({...p,[k]:v}));
  const [done,setDone] = useState(false);
  const finish = () => {
    if(!f.name||!f.email||!f.password) return;
    setDone(true);
    setTimeout(()=>onComplete(f),1500);
  };
  if(done) return <div style={{minHeight:"100vh",background:"#0a0e13",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{textAlign:"center"}}>
      <div style={{fontSize:60,marginBottom:16}}>🎉</div>
      <div style={{fontSize:22,fontWeight:700,color:"#10b981",fontFamily:"'Clash Display',sans-serif",marginBottom:8}}>Account Setup Complete!</div>
      <div style={{fontSize:14,color:"#64748b"}}>Redirecting to your dashboard...</div>
    </div>
  </div>;
  return <div style={{minHeight:"100vh",background:"#0a0e13",display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:-200,right:-200,width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(6,182,212,0.08) 0%,transparent 70%)"}}/>
    <div style={{position:"absolute",bottom:-200,left:-200,width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.06) 0%,transparent 70%)"}}/>
    <div style={{width:"100%",maxWidth:480,position:"relative"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:8}}>
          <div style={{width:44,height:44,borderRadius:13,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:"0 0 25px rgba(6,182,212,0.4)"}}>⬡</div>
          <div><div style={{fontSize:22,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif"}}>ZOLAR PM</div><div style={{fontSize:9,color:"#475569",letterSpacing:"0.14em",textTransform:"uppercase"}}>Account Setup</div></div>
        </div>
        <div style={{fontSize:14,color:"#64748b"}}>Welcome! Please complete your profile to get started.</div>
      </div>
      <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:18,padding:32,backdropFilter:"blur(10px)"}}>
        {/* Steps indicator */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:0,marginBottom:28}}>
          {[1,2].map((s,i)=><>
            <div key={s} style={{width:32,height:32,borderRadius:"50%",background:step>=s?"linear-gradient(135deg,#06b6d4,#0891b2)":"rgba(255,255,255,0.08)",border:`2px solid ${step>=s?"#06b6d4":"rgba(255,255,255,0.1)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:step>=s?"#fff":"#475569"}}>
              {step>s?"✓":s}
            </div>
            {i===0&&<div style={{width:60,height:2,background:step>1?"#06b6d4":"rgba(255,255,255,0.08)"}}/>}
          </>)}
        </div>
        {step===1?<>
          <div style={{fontSize:15,fontWeight:700,color:"#f1f5f9",marginBottom:20,fontFamily:"'Clash Display',sans-serif"}}>Step 1: Personal Information</div>
          <Inp label="Full Name" value={f.name} onChange={up("name")} req placeholder="Enter your full name"/>
          <Inp label="Phone Number" value={f.phone} onChange={up("phone")} placeholder="+91 9876543210"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Inp label="Job Profile / Title" value={f.title} onChange={up("title")} placeholder="e.g. Developer"/>
            <Inp label="Department" value={f.dept} onChange={up("dept")} placeholder="e.g. Engineering"/>
          </div>
          <Inp label="Manager Name" value={f.managerName} onChange={up("managerName")} placeholder="Your reporting manager"/>
          <Btn variant="primary" onClick={()=>{if(f.name)setStep(2);}} disabled={!f.name} sx={{width:"100%",justifyContent:"center",marginTop:4}}>Next →</Btn>
        </>:<>
          <div style={{fontSize:15,fontWeight:700,color:"#f1f5f9",marginBottom:20,fontFamily:"'Clash Display',sans-serif"}}>Step 2: Account Credentials</div>
          <Inp label="Your Email Address" type="email" value={f.email} onChange={up("email")} req placeholder="name@company.com"/>
          <Inp label="Create Password" type="password" value={f.password} onChange={up("password")} req placeholder="Minimum 8 characters"/>
          <Inp label="Confirm Password" type="password" value={f.confirmPass} onChange={up("confirmPass")} placeholder="Re-enter password"/>
          {f.password&&f.confirmPass&&f.password!==f.confirmPass&&<div style={{color:"#ef4444",fontSize:12,marginBottom:12,marginTop:-8}}>Passwords do not match</div>}
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <Btn variant="secondary" onClick={()=>setStep(1)} sx={{flex:1,justifyContent:"center"}}>← Back</Btn>
            <Btn variant="primary" onClick={finish} disabled={!f.email||!f.password||f.password!==f.confirmPass} sx={{flex:1,justifyContent:"center"}}>Complete Setup 🎉</Btn>
          </div>
        </>}
      </div>
    </div>
  </div>;
};

// ── DASHBOARD ────────────────────────────────────────────────
const Dashboard = ({projects,tasks,users,notifs,currentUser}) => {
  const myTasks = tasks.filter(t=>t.assignee===currentUser?.id);
  const pending = myTasks.filter(t=>["todo","backlog"].includes(t.status));
  const running = myTasks.filter(t=>["in_progress","review"].includes(t.status));
  const completed = myTasks.filter(t=>t.status==="completed");
  const overdue = tasks.filter(t=>{const d=daysLeft(t.deadline);return d!==null&&d<0&&t.status!=="completed";});
  const pStatus=[
    {label:"Active",value:projects.filter(p=>p.status==="active").length,color:"#06b6d4"},
    {label:"Completed",value:projects.filter(p=>p.status==="completed").length,color:"#10b981"},
    {label:"Planning",value:projects.filter(p=>p.status==="planning").length,color:"#f59e0b"},
    {label:"On Hold",value:projects.filter(p=>p.status==="on_hold").length,color:"#ef4444"},
  ].filter(d=>d.value>0);
  const myTaskStatus=[
    {label:"Done",value:completed.length,color:"#10b981"},
    {label:"Running",value:running.length,color:"#06b6d4"},
    {label:"Pending",value:pending.length,color:"#f59e0b"},
  ].filter(d=>d.value>0);
  const weekly=[{label:"Mon",value:4},{label:"Tue",value:7},{label:"Wed",value:5},{label:"Thu",value:9},{label:"Fri",value:6},{label:"Sat",value:2},{label:"Sun",value:1}];
  return <div style={{padding:22,maxWidth:1400}}>
    <div style={{marginBottom:18,padding:"14px 18px",background:"linear-gradient(135deg,rgba(6,182,212,0.08),rgba(139,92,246,0.06))",border:"1px solid rgba(6,182,212,0.15)",borderRadius:13}}>
      <div style={{fontSize:16,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif"}}>Welcome back, {currentUser?.name?.split(" ")[0]||"Admin"} 👋</div>
      <div style={{fontSize:12,color:"#64748b",marginTop:3}}>Here is what is happening in your workspace today</div>
    </div>
    {/* Global stats */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:14,marginBottom:20}}>
      <StatCard label="Total Projects" value={projects.length} icon="◈" color="#06b6d4" sub={`${projects.filter(p=>p.status==="active").length} active`} trend={12}/>
      <StatCard label="Completed Projects" value={projects.filter(p=>p.status==="completed").length} icon="✓" color="#10b981" sub="This quarter" trend={8}/>
      <StatCard label="Total Tasks" value={tasks.length} icon="◇" color="#8b5cf6" sub={`${tasks.filter(t=>t.status==="completed").length} done`} trend={5}/>
      <StatCard label="Overdue" value={overdue.length} icon="⏱" color="#ef4444" sub="Need attention" trend={-3}/>
      <StatCard label="My Tasks" value={myTasks.length} icon="◎" color="#f59e0b" sub="Assigned to me"/>
      <StatCard label="Team Members" value={users.filter(u=>u.status==="active").length} icon="◐" color="#06b6d4" sub="Active users" trend={2}/>
    </div>
    {/* My task summary boxes */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
      {[
        {label:"Pending Tasks",value:pending.length,color:"#f59e0b",icon:"⏳",list:pending},
        {label:"Running Tasks",value:running.length,color:"#06b6d4",icon:"▶",list:running},
        {label:"Completed Tasks",value:completed.length,color:"#10b981",icon:"✓",list:completed},
      ].map(s=><div key={s.label} style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${s.color}33`,borderRadius:13,padding:18}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:18}}>{s.icon}</span><span style={{fontSize:13,fontWeight:600,color:"#94a3b8"}}>{s.label}</span></div>
          <span style={{fontSize:26,fontWeight:700,color:s.color,fontFamily:"'Clash Display',sans-serif"}}>{s.value}</span>
        </div>
        {s.list.slice(0,2).map(t=><div key={t.id} style={{padding:"5px 9px",background:"rgba(255,255,255,0.03)",borderRadius:7,marginBottom:4,fontSize:11,color:"#64748b",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</span>
          <Badge label={t.priority} color={pColor(t.priority)} sm/>
        </div>)}
        {s.list.length>2&&<div style={{fontSize:11,color:"#475569",textAlign:"center",marginTop:3}}>+{s.list.length-2} more</div>}
      </div>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:22}}>
        <div style={{fontSize:12,fontWeight:600,color:"#94a3b8",marginBottom:14,textTransform:"uppercase",letterSpacing:"0.06em"}}>Project Status</div>
        <div style={{display:"flex",alignItems:"center",gap:18}}>
          <Donut data={pStatus} size={120}/>
          <div style={{flex:1}}>{pStatus.map(d=><div key={d.label} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:7,height:7,borderRadius:"50%",background:d.color}}/><span style={{fontSize:11,color:"#94a3b8"}}>{d.label}</span></div>
            <span style={{fontSize:12,fontWeight:600,color:"#f1f5f9"}}>{d.value}</span>
          </div>)}</div>
        </div>
      </div>
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:22}}>
        <div style={{fontSize:12,fontWeight:600,color:"#94a3b8",marginBottom:14,textTransform:"uppercase",letterSpacing:"0.06em"}}>My Task Overview</div>
        <div style={{display:"flex",alignItems:"center",gap:18}}>
          <Donut data={myTaskStatus.length?myTaskStatus:[{label:"No tasks",value:1,color:"#374151"}]} size={120}/>
          <div style={{flex:1}}>{myTaskStatus.map(d=><div key={d.label} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:7,height:7,borderRadius:"50%",background:d.color}}/><span style={{fontSize:11,color:"#94a3b8"}}>{d.label}</span></div>
            <span style={{fontSize:12,fontWeight:600,color:"#f1f5f9"}}>{d.value}</span>
          </div>)}</div>
        </div>
      </div>
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:22}}>
        <div style={{fontSize:12,fontWeight:600,color:"#94a3b8",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Weekly Activity</div>
        <div style={{fontSize:26,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif",marginBottom:10}}>34 <span style={{fontSize:12,color:"#10b981",fontFamily:"'DM Sans',sans-serif"}}>tasks done</span></div>
        <BarC data={weekly} color="#06b6d4" h={85}/>
      </div>
    </div>
  </div>;
};

// ── CONFIRM DELETE MODAL ─────────────────────────────────────
const ConfirmDel = ({open,onClose,onConfirm,title,msg}) => (
  <Modal open={open} onClose={onClose} title="Confirm Delete" width={400}>
    <div style={{textAlign:"center",padding:"8px 0 12px"}}>
      <div style={{fontSize:44,marginBottom:14}}>🗑️</div>
      <div style={{fontSize:15,fontWeight:600,color:"#f1f5f9",marginBottom:7}}>{title}</div>
      <div style={{fontSize:13,color:"#64748b",marginBottom:22}}>{msg}</div>
      <div style={{display:"flex",gap:8,justifyContent:"center"}}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn variant="danger" onClick={()=>{onConfirm();onClose();}}>Yes, Delete</Btn>
      </div>
    </div>
  </Modal>
);

// ── PROJECTS VIEW ─────────────────────────────────────────────
const ProjForm = ({init,users,onSave,onClose}) => {
  const def = {name:"",description:"",status:"planning",priority:"medium",startDate:"",deadline:"",color:"#06b6d4",manager:"",members:[],...(init||{})};
  const [f,setF] = useState(def);
  const [progress,setProgress] = useState(init?.progress||0);
  const up = k => v => setF(p=>({...p,[k]:v}));
  const toggle = uid => setF(p=>({...p,members:p.members.includes(uid)?p.members.filter(x=>x!==uid):[...p.members,uid]}));
  const COLORS=["#06b6d4","#f59e0b","#8b5cf6","#10b981","#ef4444","#3b82f6","#ec4899"];
  return <>
    <Inp label="Project Name" value={f.name} onChange={up("name")} req/>
    <Txta label="Description" value={f.description} onChange={up("description")}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <Sel label="Status" value={f.status} onChange={up("status")} options={[{value:"planning",label:"Planning"},{value:"active",label:"Active"},{value:"on_hold",label:"On Hold"},{value:"completed",label:"Completed"},{value:"cancelled",label:"Cancelled"}]}/>
      <Sel label="Priority" value={f.priority} onChange={up("priority")} options={[{value:"low",label:"Low"},{value:"medium",label:"Medium"},{value:"high",label:"High"},{value:"critical",label:"Critical"}]}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <Inp label="Start Date" type="date" value={f.startDate} onChange={up("startDate")}/>
      <Inp label="Deadline" type="date" value={f.deadline} onChange={up("deadline")}/>
    </div>
    {/* Project Manager - with add/remove */}
    <div style={{marginBottom:16}}>
      <label style={{display:"block",fontSize:11,fontWeight:600,color:"#94a3b8",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>Project Manager</label>
      <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
        {users.filter(u=>["admin","project_manager"].includes(u.role)).map(u=>{
          const sel=f.manager===u.id;
          return <button key={u.id} onClick={()=>up("manager")(sel?"":u.id)}
            style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:20,border:`1px solid ${sel?"#f59e0b":"rgba(255,255,255,0.1)"}`,background:sel?"rgba(245,158,11,0.12)":"transparent",cursor:"pointer",color:sel?"#f59e0b":"#64748b",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>
            <Av u={u.avatar} size={18}/>{u.name}{sel&&<span style={{color:"#f59e0b"}}>✓ PM</span>}
          </button>;
        })}
      </div>
      {f.manager&&<div style={{marginTop:8,padding:"7px 12px",background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:8,fontSize:12,color:"#f59e0b",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span>👑 PM: {users.find(u=>u.id===f.manager)?.name}</span>
        <button onClick={()=>up("manager")("")} style={{background:"rgba(239,68,68,0.15)",border:"none",color:"#ef4444",cursor:"pointer",borderRadius:4,padding:"2px 7px",fontSize:11}}>Remove</button>
      </div>}
    </div>
    {/* Members */}
    <div style={{marginBottom:16}}>
      <label style={{display:"block",fontSize:11,fontWeight:600,color:"#94a3b8",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>Team Members</label>
      <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
        {users.map(u=>{const sel=f.members.includes(u.id);return <button key={u.id} onClick={()=>toggle(u.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:20,border:`1px solid ${sel?"#06b6d4":"rgba(255,255,255,0.1)"}`,background:sel?"rgba(6,182,212,0.12)":"transparent",cursor:"pointer",color:sel?"#06b6d4":"#64748b",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}><Av u={u.avatar} size={18}/>{u.name}{sel&&"✓"}</button>;})}
      </div>
    </div>
    {init&&<div style={{marginBottom:16}}>
      <label style={{display:"block",fontSize:11,fontWeight:600,color:"#94a3b8",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.06em"}}>Progress ({progress}%)</label>
      <input type="range" min={0} max={100} value={progress} onChange={e=>setProgress(Number(e.target.value))} style={{width:"100%",accentColor:"#06b6d4"}}/>
    </div>}
    <div style={{marginBottom:16}}>
      <label style={{display:"block",fontSize:11,fontWeight:600,color:"#94a3b8",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>Color</label>
      <div style={{display:"flex",gap:8}}>{COLORS.map(c=><button key={c} onClick={()=>up("color")(c)} style={{width:26,height:26,borderRadius:"50%",background:c,border:f.color===c?"3px solid #fff":"2px solid transparent",cursor:"pointer"}}/>)}</div>
    </div>
    <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
      <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
      <Btn variant="primary" onClick={()=>onSave({...f,progress})} disabled={!f.name}>{init?"Update Project":"Create Project"}</Btn>
    </div>
  </>;
};

const ProjectsView = ({projects,users,onView,onCreate,onEdit,onDelete}) => {
  const [filter,setFilter] = useState("all");
  const [view,setView] = useState("grid");
  const filtered = projects.filter(p=>filter==="all"||p.status===filter);
  return <div style={{padding:22}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:10}}>
      <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
        {["all","active","planning","completed","on_hold"].map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:"5px 14px",borderRadius:20,border:"1px solid",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:filter===f?"#06b6d4":"transparent",borderColor:filter===f?"#06b6d4":"rgba(255,255,255,0.1)",color:filter===f?"#fff":"#64748b"}}>{f==="all"?"All":sLabel(f)}</button>)}
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>setView(v=>v==="grid"?"list":"grid")} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"7px 11px",color:"#94a3b8",cursor:"pointer",fontSize:13}}>{view==="grid"?"☰":"⊞"}</button>
        <Btn onClick={onCreate} icon="+" variant="primary">New Project</Btn>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(295px,1fr))",gap:15}}>
      {filtered.map(p=>{
        const mgr=users.find(u=>u.id===p.manager);
        const d=daysLeft(p.deadline);
        return <div key={p.id} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:15,padding:19,position:"relative",overflow:"hidden",transition:"all .2s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=p.color+"55";e.currentTarget.style.transform="translateY(-2px)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.transform="translateY(0)";}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:p.color,borderRadius:"15px 15px 0 0"}}/>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginTop:6,marginBottom:10}}>
            <div style={{flex:1,cursor:"pointer"}} onClick={()=>onView(p)}>
              <div style={{fontSize:14,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif",marginBottom:5}}>{p.name}</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                <Badge label={sLabel(p.status)} color={sColor(p.status)} sm/>
                <Badge label={p.priority} color={pColor(p.priority)} sm/>
              </div>
            </div>
            {/* Edit/Delete buttons */}
            <div style={{display:"flex",gap:4,flexShrink:0,marginLeft:8}}>
              <button onClick={e=>{e.stopPropagation();onEdit(p);}} title="Edit" style={{width:27,height:27,borderRadius:6,background:"rgba(6,182,212,0.1)",border:"1px solid rgba(6,182,212,0.2)",cursor:"pointer",color:"#06b6d4",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✎</button>
              <button onClick={e=>{e.stopPropagation();onDelete(p);}} title="Delete" style={{width:27,height:27,borderRadius:6,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",cursor:"pointer",color:"#ef4444",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>🗑</button>
            </div>
          </div>
          <div onClick={()=>onView(p)} style={{cursor:"pointer"}}>
            <p style={{fontSize:11,color:"#64748b",margin:"0 0 10px",lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.description}</p>
            {mgr&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,padding:"5px 9px",background:"rgba(255,255,255,0.03)",borderRadius:7}}>
              <Av u={mgr.avatar} size={18}/>
              <span style={{fontSize:11,color:"#64748b"}}>PM: <span style={{color:"#94a3b8"}}>{mgr.name}</span></span>
            </div>}
            <div style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:10,color:"#475569"}}>Progress</span><span style={{fontSize:11,fontWeight:700,color:p.progress===100?"#10b981":"#f1f5f9"}}>{p.progress}%</span></div>
              <Bar v={p.progress} color={p.color}/>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex"}}>{p.members.slice(0,3).map((mid,i)=>{const u=users.find(x=>x.id===mid);return <Av key={mid} u={u?.avatar||"?"} size={22} style={{marginLeft:i>0?-6:0,border:"2px solid #141920"}}/>;})}{p.members.length>3&&<div style={{width:22,height:22,borderRadius:"50%",background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#94a3b8",marginLeft:-6,border:"2px solid #141920"}}>+{p.members.length-3}</div>}</div>
              <span style={{fontSize:10,color:d!==null&&d<7?"#ef4444":"#475569"}}>{d!==null?(d<0?`${Math.abs(d)}d overdue`:d===0?"Due today":`${d}d left`):"No deadline"}</span>
            </div>
          </div>
        </div>;
      })}
    </div>
  </div>;
};

// ── TASKS VIEW ────────────────────────────────────────────────
const TaskForm = ({init,projects,users,onSave,onClose}) => {
  const def={title:"",description:"",projectId:"",assignee:"",priority:"medium",status:"todo",deadline:"",...(init||{})};
  const [f,setF] = useState(def);
  const up = k => v => setF(p=>({...p,[k]:v}));
  return <>
    <Inp label="Task Title" value={f.title} onChange={up("title")} req/>
    <Txta label="Description" value={f.description} onChange={up("description")}/>
    <Sel label="Project" value={f.projectId} onChange={up("projectId")} req options={[{value:"",label:"Select project..."},...projects.map(p=>({value:p.id,label:p.name}))]}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <Sel label="Status" value={f.status} onChange={up("status")} options={[{value:"todo",label:"To Do"},{value:"in_progress",label:"In Progress"},{value:"review",label:"Review"},{value:"testing",label:"Testing"},{value:"completed",label:"Completed"},{value:"backlog",label:"Backlog"}]}/>
      <Sel label="Priority" value={f.priority} onChange={up("priority")} options={[{value:"low",label:"Low"},{value:"medium",label:"Medium"},{value:"high",label:"High"},{value:"critical",label:"Critical"}]}/>
    </div>
    <Sel label="Assign To" value={f.assignee} onChange={up("assignee")} options={[{value:"",label:"Unassigned"},...users.map(u=>({value:u.id,label:u.name}))]}/>
    <Inp label="Deadline" type="date" value={f.deadline} onChange={up("deadline")}/>
    <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
      <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
      <Btn variant="primary" onClick={()=>onSave(f)} disabled={!f.title||!f.projectId}>{init?"Update Task":"Create Task"}</Btn>
    </div>
  </>;
};

const TasksView = ({tasks,projects,users,onCreate,onEdit,onDelete,onUpdate}) => {
  const [sf,setSf] = useState("all");
  const [pf,setPf] = useState("all");
  const filtered = tasks.filter(t=>(sf==="all"||t.status===sf)&&(pf==="all"||t.projectId===pf));
  return <div style={{padding:22}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10}}>
      <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
        {["all","todo","in_progress","review","completed"].map(s=><button key={s} onClick={()=>setSf(s)} style={{padding:"5px 13px",borderRadius:20,border:"1px solid",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:sf===s?sColor(s):"transparent",borderColor:sf===s?sColor(s):"rgba(255,255,255,0.1)",color:sf===s?"#fff":"#64748b"}}>{s==="all"?"All":sLabel(s)}</button>)}
      </div>
      <div style={{display:"flex",gap:8}}>
        <select value={pf} onChange={e=>setPf(e.target.value)} style={{padding:"6px 11px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#94a3b8",fontSize:12,cursor:"pointer"}}>
          <option value="all">All Projects</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <Btn onClick={onCreate} icon="+" variant="primary">New Task</Btn>
      </div>
    </div>
    <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,overflow:"hidden"}}>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 110px",padding:"11px 18px",borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,fontWeight:600,color:"#475569",textTransform:"uppercase",letterSpacing:"0.06em"}}>
        <span>Task</span><span>Project</span><span>Priority</span><span>Status</span><span>Due</span><span>Actions</span>
      </div>
      {filtered.map(t=>{
        const proj=projects.find(p=>p.id===t.projectId);
        const asgn=users.find(u=>u.id===t.assignee);
        const d=daysLeft(t.deadline);
        return <div key={t.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 110px",padding:"13px 18px",borderBottom:"1px solid rgba(255,255,255,0.04)",alignItems:"center",transition:"background .15s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.02)"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <input type="checkbox" checked={t.status==="completed"} onChange={()=>onUpdate(t.id,{status:t.status==="completed"?"todo":"completed"})} style={{accentColor:"#06b6d4",cursor:"pointer"}}/>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:t.status==="completed"?"#475569":"#e2e8f0",textDecoration:t.status==="completed"?"line-through":"none"}}>{t.title}</div>
              {asgn&&<div style={{display:"flex",alignItems:"center",gap:4,marginTop:2}}><Av u={asgn.avatar} size={13}/><span style={{fontSize:10,color:"#475569"}}>{asgn.name}</span></div>}
            </div>
          </div>
          <div>{proj&&<div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:7,height:7,borderRadius:"50%",background:proj.color}}/><span style={{fontSize:11,color:"#64748b"}}>{proj.name}</span></div>}</div>
          <Badge label={t.priority} color={pColor(t.priority)} sm/>
          <Badge label={sLabel(t.status)} color={sColor(t.status)} sm/>
          <span style={{fontSize:11,color:d!==null&&d<0?"#ef4444":d!==null&&d<3?"#f59e0b":"#475569"}}>{d!==null?(d<0?`${Math.abs(d)}d over`:d===0?"Today":`${d}d`):"—"}</span>
          <div style={{display:"flex",gap:4}}>
            <button onClick={()=>onEdit(t)} style={{padding:"3px 9px",borderRadius:6,background:"rgba(6,182,212,0.1)",border:"1px solid rgba(6,182,212,0.2)",cursor:"pointer",color:"#06b6d4",fontSize:11,fontFamily:"'DM Sans',sans-serif"}}>Edit</button>
            <button onClick={()=>onDelete(t)} style={{padding:"3px 9px",borderRadius:6,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",cursor:"pointer",color:"#ef4444",fontSize:11,fontFamily:"'DM Sans',sans-serif"}}>Del</button>
          </div>
        </div>;
      })}
      {filtered.length===0&&<div style={{padding:40,textAlign:"center",color:"#475569",fontSize:13}}>No tasks found</div>}
    </div>
  </div>;
};

// ── KANBAN ────────────────────────────────────────────────────
const KCOLS=[
  {id:"backlog",label:"Backlog",color:"#4b5563"},{id:"todo",label:"To Do",color:"#6b7280"},
  {id:"in_progress",label:"In Progress",color:"#06b6d4"},{id:"review",label:"Review",color:"#8b5cf6"},
  {id:"testing",label:"Testing",color:"#f59e0b"},{id:"completed",label:"Done",color:"#10b981"},
];
const KanbanView = ({tasks,projects,users,onUpdate}) => {
  const [drag,setDrag] = useState(null);
  const [over,setOver] = useState(null);
  const [pf,setPf] = useState("all");
  const filtered = tasks.filter(t=>pf==="all"||t.projectId===pf);
  return <div style={{padding:22}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
      <select value={pf} onChange={e=>setPf(e.target.value)} style={{padding:"7px 13px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#94a3b8",fontSize:12,cursor:"pointer"}}>
        <option value="all">All Projects</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <div style={{fontSize:11,color:"#475569"}}>Drag tasks to change status</div>
    </div>
    <div style={{display:"flex",gap:11,overflowX:"auto",paddingBottom:8}}>
      {KCOLS.map(col=>{
        const ct=filtered.filter(t=>t.status===col.id);
        const isOver=over===col.id;
        return <div key={col.id} onDragOver={e=>{e.preventDefault();setOver(col.id);}} onDragLeave={()=>setOver(null)} onDrop={()=>{if(drag&&drag.status!==col.id)onUpdate(drag.id,{status:col.id});setDrag(null);setOver(null);}} style={{minWidth:230,width:230,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9,padding:"7px 11px",background:"rgba(255,255,255,0.03)",borderRadius:9,border:`1px solid ${isOver?col.color:"rgba(255,255,255,0.06)"}`}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:9,height:9,borderRadius:"50%",background:col.color}}/><span style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em"}}>{col.label}</span></div>
            <span style={{fontSize:10,fontWeight:600,color:col.color,background:col.color+"22",padding:"1px 7px",borderRadius:20}}>{ct.length}</span>
          </div>
          <div style={{minHeight:180,borderRadius:10,border:`2px dashed ${isOver?col.color:"transparent"}`,background:isOver?"rgba(255,255,255,0.02)":"transparent",transition:"all .15s",padding:isOver?3:0}}>
            {ct.map(t=>{const pr=projects.find(p=>p.id===t.projectId);const a=users.find(u=>u.id===t.assignee);const d=daysLeft(t.deadline);return <div key={t.id} draggable onDragStart={()=>setDrag(t)} onDragEnd={()=>{setDrag(null);setOver(null);}} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderLeft:`3px solid ${pColor(t.priority)}`,borderRadius:9,padding:13,marginBottom:7,cursor:"grab",opacity:drag?.id===t.id?.5:1,transition:"all .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=col.color+"55"} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.borderLeftColor=pColor(t.priority);}}>
              {pr&&<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:5}}><div style={{width:5,height:5,borderRadius:"50%",background:pr.color}}/><span style={{fontSize:10,color:"#475569"}}>{pr.name}</span></div>}
              <div style={{fontSize:12,fontWeight:600,color:"#e2e8f0",marginBottom:7,lineHeight:1.4}}>{t.title}</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <Badge label={t.priority} color={pColor(t.priority)} sm/>
                <div style={{display:"flex",alignItems:"center",gap:5}}>{t.comments>0&&<span style={{fontSize:10,color:"#475569"}}>💬{t.comments}</span>}{a&&<Av u={a.avatar} size={18}/>}</div>
              </div>
              {t.deadline&&<div style={{marginTop:7,fontSize:10,color:d!==null&&d<0?"#ef4444":d!==null&&d<3?"#f59e0b":"#475569"}}>📅 {fmtDate(t.deadline)}</div>}
            </div>;})}
          </div>
        </div>;
      })}
    </div>
  </div>;
};

// ── TEAM VIEW with Email Invite ───────────────────────────────
const InviteModal = ({open,onClose,onAdd,projects,currentUser}) => {
  const [f,setF] = useState({name:"",email:"",role:"team_member",dept:"",title:"",gender:"Male",phone:"",managerName:"",projectId:""});
  const [sent,setSent] = useState(false);
  const [inviteToken,setInviteToken] = useState("");
  const up = k => v => setF(p=>({...p,[k]:v}));
  const submit = () => {
    if(!f.name||!f.email) return;
    const token = "ZOLAR-"+Math.random().toString(36).slice(2,10).toUpperCase();
    setInviteToken(token);
    onAdd({...f,id:uid(),avatar:initials(f.name),status:"pending_setup",joined:new Date().toISOString().split("T")[0],password:"",setupToken:token});
    setSent(true);
    setTimeout(()=>{setSent(false);setInviteToken("");onClose();setF({name:"",email:"",role:"team_member",dept:"",title:"",gender:"Male",phone:"",managerName:"",projectId:""});},4000);
  };
  return <Modal open={open} onClose={onClose} title="📧 Invite Team Member" width={620}>
    {sent?<div style={{textAlign:"center",padding:"20px 0"}}>
      <div style={{fontSize:48,marginBottom:12}}>📨</div>
      <div style={{fontSize:16,fontWeight:700,color:"#10b981",marginBottom:6}}>Invitation Sent!</div>
      <div style={{fontSize:13,color:"#64748b",marginBottom:16}}>Email sent to <strong style={{color:"#e2e8f0"}}>{f.email}</strong></div>
      <div style={{padding:"12px 16px",background:"rgba(6,182,212,0.08)",border:"1px solid rgba(6,182,212,0.2)",borderRadius:10,marginBottom:12,textAlign:"left"}}>
        <div style={{fontSize:11,fontWeight:600,color:"#06b6d4",marginBottom:6}}>📧 Email Content Preview:</div>
        <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.7}}>
          "Hi <strong style={{color:"#e2e8f0"}}>{f.name}</strong>, you have been invited to join <strong style={{color:"#e2e8f0"}}>Zolar PM</strong> by <strong style={{color:"#e2e8f0"}}>{currentUser?.name}</strong> as <strong style={{color:"#f59e0b"}}>{f.role==="project_manager"?"Project Manager":"Team Member"}</strong>.<br/>
          Click the link below to set up your account and create your password."
        </div>
      </div>
      <div style={{padding:"10px 14px",background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:8,fontSize:12,color:"#94a3b8",wordBreak:"break-all"}}>
        🔗 Setup Link: <span style={{color:"#06b6d4"}}>http://localhost:3000/setup?token={inviteToken}</span>
      </div>
    </div>:<>
      <div style={{padding:"10px 14px",background:"rgba(6,182,212,0.06)",border:"1px solid rgba(6,182,212,0.15)",borderRadius:9,marginBottom:18,fontSize:12,color:"#94a3b8"}}>
        📧 User will receive an email with an account setup link where they fill their Full Name, Phone, Job Profile, Manager, Department and set their own password.
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Inp label="Full Name" value={f.name} onChange={up("name")} req/>
        <Inp label="Work Email" type="email" value={f.email} onChange={up("email")} req/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Sel label="Role" value={f.role} onChange={up("role")} options={[{value:"admin",label:"Admin"},{value:"project_manager",label:"Project Manager"},{value:"team_member",label:"Team Member"},{value:"viewer",label:"Viewer"}]}/>
        <Sel label="Gender" value={f.gender} onChange={up("gender")} options={[{value:"Male",label:"Male"},{value:"Female",label:"Female"},{value:"Other",label:"Other"}]}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Inp label="Department (optional)" value={f.dept} onChange={up("dept")} placeholder="e.g. Engineering"/>
        <Inp label="Job Title (optional)" value={f.title} onChange={up("title")} placeholder="e.g. Developer"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Inp label="Phone (optional)" value={f.phone} onChange={up("phone")} placeholder="+91 9876543210"/>
        <Inp label="Manager Name (optional)" value={f.managerName} onChange={up("managerName")} placeholder="Reporting manager"/>
      </div>
      <Sel label="Assign to Project (Optional)" value={f.projectId} onChange={up("projectId")} options={[{value:"",label:"No project yet"},...projects.map(p=>({value:p.id,label:p.name}))]}/>
      <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" onClick={submit} disabled={!f.name||!f.email} icon="📧">Send Invitation</Btn>
      </div>
    </>}
  </Modal>;
};

const TeamView = ({users,projects,tasks,onInvite}) => <div style={{padding:22}}>
  <div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}>
    <div style={{fontSize:13,color:"#64748b"}}>{users.length} members · {users.filter(u=>u.status==="active").length} active</div>
    <Btn variant="primary" icon="📧" onClick={onInvite}>Invite Member</Btn>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(285px,1fr))",gap:14}}>
    {users.map(u=>{
      const ut=tasks.filter(t=>t.assignee===u.id);
      const ct=ut.filter(t=>t.status==="completed");
      const up2=projects.filter(p=>p.members.includes(u.id));
      return <div key={u.id} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:18,transition:"all .2s"}}
        onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"}
        onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"}>
        <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:13}}>
          <div style={{position:"relative"}}><Av u={u.avatar} size={46}/><div style={{position:"absolute",bottom:0,right:0,width:11,height:11,borderRadius:"50%",background:u.status==="active"?"#10b981":u.status==="pending_setup"?"#f59e0b":"#6b7280",border:"2px solid #141920"}}/></div>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif"}}>{u.name}</div>
            <div style={{fontSize:11,color:"#64748b"}}>{u.title||"—"}</div>
            <div style={{display:"flex",gap:5,marginTop:4}}>
              <Badge label={rLabel(u.role)} color={rColor(u.role)} sm/>
              {u.status==="pending_setup"&&<Badge label="Setup Pending" color="#f59e0b" sm/>}
            </div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:12}}>
          {[{label:"Projects",value:up2.length,color:"#06b6d4"},{label:"Tasks",value:ut.length,color:"#8b5cf6"},{label:"Done",value:ct.length,color:"#10b981"}].map(s=><div key={s.label} style={{textAlign:"center",background:"rgba(255,255,255,0.04)",borderRadius:7,padding:"7px 4px"}}><div style={{fontSize:16,fontWeight:700,color:s.color,fontFamily:"'Clash Display',sans-serif"}}>{s.value}</div><div style={{fontSize:9,color:"#475569"}}>{s.label}</div></div>)}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:7}}><span style={{fontSize:10,color:"#475569"}}>Completion:</span><div style={{flex:1}}><Bar v={ut.length>0?(ct.length/ut.length*100):0} color="#10b981" h={4}/></div><span style={{fontSize:10,color:"#10b981",fontWeight:600}}>{ut.length>0?Math.round(ct.length/ut.length*100):0}%</span></div>
        <div style={{fontSize:11,color:"#475569"}}>{u.dept||"—"} · {u.email}</div>
        {u.managerName&&<div style={{fontSize:10,color:"#374151",marginTop:3}}>👤 Reports to: {u.managerName}</div>}
      </div>;
    })}
  </div>
</div>;

// ── CALENDAR VIEW ─────────────────────────────────────────────
const AddEventModal = ({open,onClose,onAdd,projects,prefDate}) => {
  const [f,setF] = useState({title:"",date:prefDate||"",time:"09:00",type:"meeting",projectId:"",notes:""});
  useEffect(()=>{if(prefDate)setF(p=>({...p,date:prefDate}));},[prefDate]);
  const up = k => v => setF(p=>({...p,[k]:v}));
  const save = () => {if(!f.title||!f.date)return;onAdd({...f,id:uid()});onClose();setF({title:"",date:"",time:"09:00",type:"meeting",projectId:"",notes:""});};
  return <Modal open={open} onClose={onClose} title="📅 Add Calendar Event" width={480}>
    <Inp label="Event / Task Title" value={f.title} onChange={up("title")} req placeholder="e.g. Team Meeting"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <Inp label="Date" type="date" value={f.date} onChange={up("date")} req/>
      <Inp label="Time" type="time" value={f.time} onChange={up("time")}/>
    </div>
    <Sel label="Type" value={f.type} onChange={up("type")} options={[{value:"meeting",label:"📅 Meeting"},{value:"deadline",label:"⏰ Deadline"},{value:"task",label:"✅ Task"},{value:"reminder",label:"🔔 Reminder"}]}/>
    <Sel label="Related Project (Optional)" value={f.projectId} onChange={up("projectId")} options={[{value:"",label:"None"},...projects.map(p=>({value:p.id,label:p.name}))]}/>
    <Txta label="Notes" value={f.notes} onChange={up("notes")} placeholder="Additional notes..." rows={2}/>
    <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
      <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
      <Btn variant="primary" onClick={save} disabled={!f.title||!f.date}>Add Event</Btn>
    </div>
  </Modal>;
};

const CalendarView = ({tasks,projects,events,onAddEvent}) => {
  const [cur,setCur] = useState(new Date());
  const [sel,setSel] = useState(null);
  const [showAdd,setShowAdd] = useState(false);
  const yr=cur.getFullYear(),mo=cur.getMonth();
  const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dim=new Date(yr,mo+1,0).getDate();
  const fd=new Date(yr,mo,1).getDay();
  const days=[...Array(fd).fill(null),...Array(dim).fill(0).map((_,i)=>i+1)];
  const today=new Date();
  const dateStr = d => d?`${yr}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`:"";
  const getItems = d => {
    if(!d) return [];
    const ds=dateStr(d);
    const evs=events.filter(e=>e.date===ds).map(e=>({...e,color:e.type==="meeting"?"#06b6d4":e.type==="deadline"?"#ef4444":e.type==="reminder"?"#f59e0b":"#8b5cf6"}));
    const tks=tasks.filter(t=>t.deadline===ds).map(t=>({id:t.id,title:t.title,type:"task",color:pColor(t.priority),time:""}));
    return [...evs,...tks];
  };
  const selItems=getItems(sel);
  const selDs=dateStr(sel);
  const upcoming=[...events].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,8);
  return <div style={{padding:22}}>
    <div style={{display:"flex",gap:18}}>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:11}}>
            <button onClick={()=>setCur(new Date(yr,mo-1))} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,width:30,height:30,cursor:"pointer",color:"#94a3b8",fontSize:15}}>‹</button>
            <span style={{fontSize:17,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif",minWidth:155}}>{MONTHS[mo]} {yr}</span>
            <button onClick={()=>setCur(new Date(yr,mo+1))} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,width:30,height:30,cursor:"pointer",color:"#94a3b8",fontSize:15}}>›</button>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn variant="secondary" sm onClick={()=>setCur(new Date())}>Today</Btn>
            <Btn variant="primary" sm icon="+" onClick={()=>{setSel(null);setShowAdd(true);}}>Add Event</Btn>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=><div key={d} style={{padding:"11px 0",textAlign:"center",fontSize:10,fontWeight:600,color:"#475569",textTransform:"uppercase",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
            {days.map((d,i)=>{
              const items=getItems(d);
              const isToday=d===today.getDate()&&mo===today.getMonth()&&yr===today.getFullYear();
              const isSel=d===sel;
              return <div key={i} onClick={()=>d&&setSel(d)} style={{minHeight:88,padding:7,borderRight:"1px solid rgba(255,255,255,0.04)",borderBottom:"1px solid rgba(255,255,255,0.04)",cursor:d?"pointer":"default",background:isSel?"rgba(6,182,212,0.09)":isToday?"rgba(6,182,212,0.04)":"transparent",transition:"background .15s"}}
                onMouseEnter={e=>{if(d&&!isSel)e.currentTarget.style.background="rgba(255,255,255,0.03)";}}
                onMouseLeave={e=>{if(d&&!isSel)e.currentTarget.style.background=isToday?"rgba(6,182,212,0.04)":"transparent";}}>
                {d&&<>
                  <div style={{width:24,height:24,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:isToday?700:400,background:isToday?"#06b6d4":"transparent",color:isToday?"#fff":"#94a3b8",marginBottom:4}}>{d}</div>
                  {items.slice(0,3).map((ev,j)=><div key={j} style={{fontSize:9,padding:"1px 5px",borderRadius:4,background:ev.color+"22",color:ev.color,marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ev.time?`${ev.time} `:""}{ev.title}</div>)}
                  {items.length>3&&<div style={{fontSize:9,color:"#475569"}}>+{items.length-3}</div>}
                </>}
              </div>;
            })}
          </div>
        </div>
      </div>
      {/* Sidebar */}
      <div style={{width:265,flexShrink:0}}>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:18}}>
          {sel?<>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif"}}>{MONTHS[mo]} {sel}</div>
              <Btn sm variant="primary" icon="+" onClick={()=>setShowAdd(true)}>Add</Btn>
            </div>
            {selItems.length===0?<div style={{textAlign:"center",padding:"18px 0",color:"#475569",fontSize:12}}><div style={{fontSize:30,marginBottom:7}}>📅</div>No events this day</div>:
            selItems.map((e,i)=><div key={i} style={{padding:"9px 11px",background:`${e.color}11`,border:`1px solid ${e.color}33`,borderRadius:9,marginBottom:7}}>
              <div style={{fontSize:12,fontWeight:600,color:"#f1f5f9",marginBottom:3}}>{e.title}</div>
              {e.time&&<div style={{fontSize:10,color:"#64748b"}}>🕐 {e.time}</div>}
              <Badge label={e.type} color={e.color} sm/>
            </div>)}
          </>:<>
            <div style={{fontSize:13,fontWeight:700,color:"#f1f5f9",marginBottom:14,fontFamily:"'Clash Display',sans-serif"}}>Upcoming Events</div>
            {upcoming.map((e,i)=>{const pr=projects.find(p=>p.id===e.projectId);return <div key={i} style={{padding:"9px 11px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:9,marginBottom:7}}>
              <div style={{fontSize:11,fontWeight:600,color:"#e2e8f0"}}>{e.title}</div>
              <div style={{fontSize:10,color:"#64748b",marginTop:2}}>📅 {fmtDate(e.date)}{e.time&&` · ${e.time}`}</div>
              {pr&&<div style={{fontSize:10,color:"#475569",marginTop:1}}>📁 {pr.name}</div>}
            </div>;})}
          </>}
        </div>
      </div>
    </div>
    <AddEventModal open={showAdd} onClose={()=>setShowAdd(false)} onAdd={onAddEvent} projects={projects} prefDate={selDs||""}/>
  </div>;
};

// ── REPORTS VIEW ──────────────────────────────────────────────
const ReportsView = ({projects,tasks,users}) => {
  const [period,setPeriod] = useState("week");
  const now=new Date();
  const periodDays={today:1,week:7,month:30,year:365};
  const filtered = tasks.filter(t=>{
    if(!t.createdAt)return false;
    const diff=(now-new Date(t.createdAt))/(864e5);
    return diff<=(periodDays[period]||7);
  });
  const comp=filtered.filter(t=>t.status==="completed");
  const inProg=filtered.filter(t=>t.status==="in_progress");
  const overdue=tasks.filter(t=>{const d=daysLeft(t.deadline);return d!==null&&d<0&&t.status!=="completed";});
  const byPriority=[
    {label:"Critical",value:tasks.filter(t=>t.priority==="critical").length,color:"#ef4444"},
    {label:"High",value:tasks.filter(t=>t.priority==="high").length,color:"#f59e0b"},
    {label:"Medium",value:tasks.filter(t=>t.priority==="medium").length,color:"#06b6d4"},
    {label:"Low",value:tasks.filter(t=>t.priority==="low").length,color:"#6b7280"},
  ];
  const chartData=period==="month"?
    [{label:"W1",value:12},{label:"W2",value:18},{label:"W3",value:15},{label:"W4",value:22}]:
    period==="year"?
    [{label:"Jan",value:45},{label:"Feb",value:52},{label:"Mar",value:48},{label:"Apr",value:61},{label:"May",value:55},{label:"Jun",value:67},{label:"Jul",value:70},{label:"Aug",value:63},{label:"Sep",value:58},{label:"Oct",value:72},{label:"Nov",value:68},{label:"Dec",value:75}]:
    [{label:"Mon",value:4},{label:"Tue",value:7},{label:"Wed",value:5},{label:"Thu",value:9},{label:"Fri",value:6},{label:"Sat",value:2},{label:"Sun",value:1}];
  return <div style={{padding:22}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
      <div style={{fontSize:13,fontWeight:600,color:"#94a3b8"}}>Report Period</div>
      <div style={{display:"flex",gap:7}}>
        {[{id:"today",label:"Today"},{id:"week",label:"1 Week"},{id:"month",label:"1 Month"},{id:"year",label:"1 Year"}].map(p=><button key={p.id} onClick={()=>setPeriod(p.id)} style={{padding:"6px 18px",borderRadius:20,border:"1px solid",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:period===p.id?"#06b6d4":"transparent",borderColor:period===p.id?"#06b6d4":"rgba(255,255,255,0.1)",color:period===p.id?"#fff":"#64748b"}}>{p.label}</button>)}
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
      <StatCard label="Tasks in Period" value={filtered.length} icon="◇" color="#8b5cf6" sub={`Period: ${period}`}/>
      <StatCard label="Completed" value={comp.length} icon="✓" color="#10b981" sub={`${filtered.length>0?Math.round(comp.length/filtered.length*100):0}% rate`} trend={8}/>
      <StatCard label="In Progress" value={inProg.length} icon="▶" color="#06b6d4" sub="Currently active"/>
      <StatCard label="Overdue" value={overdue.length} icon="⏱" color="#ef4444" sub="Past deadline" trend={-3}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:22}}>
        <div style={{fontSize:12,fontWeight:600,color:"#94a3b8",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>{period==="today"?"Today":period==="week"?"Weekly":period==="month"?"Monthly":"Yearly"} Activity</div>
        <div style={{fontSize:24,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif",marginBottom:10}}>{filtered.length} <span style={{fontSize:11,color:"#10b981",fontFamily:"'DM Sans',sans-serif"}}>tasks this period</span></div>
        <BarC data={chartData} color="#10b981" h={95}/>
      </div>
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:22}}>
        <div style={{fontSize:12,fontWeight:600,color:"#94a3b8",marginBottom:14,textTransform:"uppercase",letterSpacing:"0.06em"}}>Tasks by Priority</div>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <Donut data={byPriority.filter(d=>d.value>0)} size={115}/>
          <div style={{flex:1}}>{byPriority.map(d=><div key={d.label} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:9,height:9,borderRadius:"50%",background:d.color}}/><span style={{fontSize:11,color:"#94a3b8"}}>{d.label}</span></div>
            <span style={{fontSize:12,fontWeight:700,color:"#f1f5f9"}}>{d.value}</span>
          </div>)}</div>
        </div>
      </div>
    </div>
    <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,overflow:"hidden"}}>
      <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:12,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em"}}>Project Performance</span>
        <Badge label={period} color="#06b6d4" sm/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"9px 18px",borderBottom:"1px solid rgba(255,255,255,0.07)",fontSize:10,fontWeight:600,color:"#475569",textTransform:"uppercase",letterSpacing:"0.05em"}}>
        <span>Project</span><span>Status</span><span>Progress</span><span>Tasks</span><span>Members</span>
      </div>
      {projects.map(p=>{const pt=tasks.filter(t=>t.projectId===p.id);return <div key={p.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"13px 18px",borderBottom:"1px solid rgba(255,255,255,0.04)",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:9,height:9,borderRadius:"50%",background:p.color}}/><span style={{fontSize:12,fontWeight:600,color:"#e2e8f0"}}>{p.name}</span></div>
        <Badge label={sLabel(p.status)} color={sColor(p.status)} sm/>
        <div style={{display:"flex",alignItems:"center",gap:7}}><Bar v={p.progress} color={p.color}/><span style={{fontSize:10,color:"#94a3b8",flexShrink:0}}>{p.progress}%</span></div>
        <span style={{fontSize:12,color:"#94a3b8"}}>{pt.length}</span>
        <span style={{fontSize:12,color:"#94a3b8"}}>{p.members.length}</span>
      </div>;})}
    </div>
  </div>;
};

// ── SETTINGS VIEW ─────────────────────────────────────────────
const SettingsView = ({user,onSave}) => {
  const [tab,setTab] = useState("profile");
  const [f,setF] = useState({name:user?.name||"",email:user?.email||"",title:user?.title||"",dept:user?.dept||"",phone:user?.phone||"",gender:user?.gender||"Male",managerName:user?.managerName||""});
  const [saved,setSaved] = useState(false);
  const up = k => v => setF(p=>({...p,[k]:v}));
  const save = () => {onSave({...user,...f,avatar:initials(f.name)});setSaved(true);setTimeout(()=>setSaved(false),2500);};
  const TABS=[{id:"profile",label:"My Profile"},{id:"notifs",label:"Notifications"},{id:"company",label:"Company"},{id:"security",label:"Security"},{id:"smtp",label:"Email/SMTP"}];
  return <div style={{padding:22,display:"flex",gap:22,maxWidth:1050}}>
    <div style={{width:190,flexShrink:0}}>
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:7}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{width:"100%",padding:"9px 13px",borderRadius:8,border:"none",cursor:"pointer",textAlign:"left",fontSize:13,fontWeight:tab===t.id?600:400,fontFamily:"'DM Sans',sans-serif",background:tab===t.id?"rgba(6,182,212,0.12)":"transparent",color:tab===t.id?"#06b6d4":"#64748b",borderLeft:tab===t.id?"2px solid #06b6d4":"2px solid transparent",marginBottom:2}}>{t.label}</button>)}
      </div>
    </div>
    <div style={{flex:1}}>
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:26}}>
        {tab==="profile"&&<>
          <div style={{fontSize:15,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif",marginBottom:22}}>Profile Settings</div>
          <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:24,padding:18,background:"rgba(255,255,255,0.03)",borderRadius:11}}>
            <Av u={initials(f.name)} size={66}/>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:"#f1f5f9"}}>{f.name}</div>
              <div style={{fontSize:12,color:"#64748b",marginBottom:7}}>{f.email}</div>
              <Badge label={rLabel(user?.role||"team_member")} color={rColor(user?.role||"team_member")}/>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Inp label="Full Name" value={f.name} onChange={up("name")}/>
            <Inp label="Email" type="email" value={f.email} onChange={up("email")}/>
            <Inp label="Job Title / Profile" value={f.title} onChange={up("title")}/>
            <Inp label="Department" value={f.dept} onChange={up("dept")}/>
            <Inp label="Phone" value={f.phone} onChange={up("phone")}/>
            <Sel label="Gender" value={f.gender} onChange={up("gender")} options={[{value:"Male",label:"Male"},{value:"Female",label:"Female"},{value:"Other",label:"Other"}]}/>
          </div>
          <Inp label="Manager Name" value={f.managerName} onChange={up("managerName")}/>
          <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:4}}>
            {saved&&<span style={{fontSize:12,color:"#10b981",alignSelf:"center"}}>✓ Saved successfully!</span>}
            <Btn variant="primary" onClick={save}>Save Changes</Btn>
          </div>
        </>}
        {tab==="notifs"&&<>
          <div style={{fontSize:15,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif",marginBottom:22}}>Notification Preferences</div>
          {[{l:"Task assigned to me",s:"Receive alerts when tasks are assigned"},{l:"Project updates",s:"Get notified on project status changes"},{l:"Deadline reminders",s:"Reminders 3 days before deadlines"},{l:"Comment mentions",s:"When someone @mentions you"},{l:"Task completed",s:"When tasks you created are completed"},{l:"Weekly digest",s:"Weekly summary of activity"}].map((n,i)=><div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <div><div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{n.l}</div><div style={{fontSize:11,color:"#475569"}}>{n.s}</div></div>
            <div style={{display:"flex",gap:11}}>{["Email","In-App"].map(type=><label key={type} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer"}}><input type="checkbox" defaultChecked style={{accentColor:"#06b6d4"}}/><span style={{fontSize:11,color:"#64748b"}}>{type}</span></label>)}</div>
          </div>)}
        </>}
        {tab==="company"&&<>
          <div style={{fontSize:15,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif",marginBottom:22}}>Company Settings</div>
          <Inp label="Company Name" value="Zolar Corp" onChange={()=>{}}/>
          <Inp label="Company Domain" value="zolarcorp.com" onChange={()=>{}}/>
          <Sel label="Plan" value="enterprise" onChange={()=>{}} options={[{value:"free",label:"Free (5 users)"},{value:"pro",label:"Pro (20 users)"},{value:"enterprise",label:"Enterprise (Unlimited)"}]}/>
          <div style={{display:"flex",justifyContent:"flex-end"}}><Btn variant="primary">Save Settings</Btn></div>
        </>}
        {tab==="security"&&<>
          <div style={{fontSize:15,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif",marginBottom:22}}>Security Settings</div>
          <Inp label="Current Password" type="password" value="" onChange={()=>{}} placeholder="Enter current password"/>
          <Inp label="New Password" type="password" value="" onChange={()=>{}} placeholder="Minimum 8 characters"/>
          <Inp label="Confirm New Password" type="password" value="" onChange={()=>{}} placeholder="Re-enter new password"/>
          <div style={{background:"rgba(6,182,212,0.08)",border:"1px solid rgba(6,182,212,0.2)",borderRadius:9,padding:11,fontSize:11,color:"#94a3b8",marginBottom:14}}>🔒 Passwords must be at least 8 characters with uppercase, lowercase, and numbers.</div>
          <div style={{display:"flex",justifyContent:"flex-end"}}><Btn variant="primary">Update Password</Btn></div>
        </>}
        {tab==="smtp"&&<>
          <div style={{fontSize:15,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif",marginBottom:22}}>Email / SMTP Configuration</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Inp label="SMTP Host" value="smtp.gmail.com" onChange={()=>{}}/>
            <Inp label="SMTP Port" value="587" onChange={()=>{}}/>
            <Inp label="Username" value="noreply@zolarcorp.com" onChange={()=>{}}/>
            <Inp label="Password" type="password" value="••••••••" onChange={()=>{}}/>
          </div>
          <Sel label="Encryption" value="tls" onChange={()=>{}} options={[{value:"tls",label:"TLS"},{value:"ssl",label:"SSL"},{value:"none",label:"None"}]}/>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="secondary">Test Connection</Btn><Btn variant="primary">Save SMTP</Btn></div>
        </>}
      </div>
    </div>
  </div>;
};

// ── FILES VIEW ────────────────────────────────────────────────
const FilesView = () => {
  const files=[
    {name:"Design System v2.fig",type:"figma",size:"24.5 MB",project:"Zolar Dashboard v2",uploaded:"2h ago"},
    {name:"API Documentation.pdf",type:"pdf",size:"2.1 MB",project:"API Gateway Migration",uploaded:"5h ago"},
    {name:"Mobile Wireframes.xd",type:"xd",size:"18.3 MB",project:"Mobile App Launch",uploaded:"1d ago"},
    {name:"Q1 Progress Report.xlsx",type:"excel",size:"1.2 MB",project:"Customer Portal",uploaded:"2d ago"},
    {name:"Architecture Diagram.png",type:"image",size:"3.7 MB",project:"API Gateway Migration",uploaded:"3d ago"},
  ];
  const fc={figma:"#8b5cf6",pdf:"#ef4444",xd:"#f59e0b",excel:"#10b981",image:"#06b6d4"};
  const fi={figma:"✦",pdf:"📄",xd:"⬡",excel:"📊",image:"🖼"};
  return <div style={{padding:22}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}>
      <div style={{fontSize:13,color:"#64748b"}}>{files.length} files</div>
      <Btn variant="primary" icon="↑">Upload File</Btn>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))",gap:11}}>
      {files.map((f,i)=><div key={i} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:13,padding:15,cursor:"pointer",transition:"all .2s"}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=fc[f.type]+"44";e.currentTarget.style.transform="translateY(-2px)";}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.transform="translateY(0)";}}>
        <div style={{width:46,height:46,borderRadius:11,background:fc[f.type]+"22",border:`1px solid ${fc[f.type]}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:11}}>{fi[f.type]||"📄"}</div>
        <div style={{fontSize:12,fontWeight:600,color:"#e2e8f0",marginBottom:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{f.name}</div>
        <div style={{fontSize:10,color:"#475569",marginBottom:7}}>{f.project}</div>
        <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:9,color:"#374151",background:"rgba(255,255,255,0.06)",padding:"2px 7px",borderRadius:20}}>{f.size}</span><span style={{fontSize:9,color:"#475569"}}>{f.uploaded}</span></div>
      </div>)}
    </div>
  </div>;
};

// ── ACTIVITY VIEW ─────────────────────────────────────────────
const ActivityView = () => {
  const LOG=[
    {id:"a1",user:"Sarah Chen",action:"created task",target:"Dashboard analytics widgets",time:"2 hours ago",type:"create"},
    {id:"a2",user:"James Okafor",action:"updated status to In Progress",target:"Gateway security audit",time:"4 hours ago",type:"update"},
    {id:"a3",user:"Priya Sharma",action:"completed task",target:"Design system audit",time:"6 hours ago",type:"complete"},
    {id:"a4",user:"Alex Morgan",action:"added comment on",target:"API Gateway Migration",time:"8 hours ago",type:"comment"},
    {id:"a5",user:"Luna Park",action:"uploaded 3 files to",target:"Mobile App Launch",time:"1 day ago",type:"file"},
    {id:"a6",user:"Sarah Chen",action:"assigned task to James",target:"Rate limiting implementation",time:"1 day ago",type:"assign"},
  ];
  const TC={create:"#10b981",update:"#06b6d4",complete:"#8b5cf6",comment:"#f59e0b",file:"#3b82f6",assign:"#ec4899"};
  const TI={create:"✦",update:"◈",complete:"✓",comment:"💬",file:"📎",assign:"→"};
  return <div style={{padding:22,maxWidth:860}}>
    <div style={{fontSize:12,fontWeight:600,color:"#94a3b8",marginBottom:18,textTransform:"uppercase",letterSpacing:"0.06em"}}>Recent Activity</div>
    <div style={{position:"relative"}}>
      <div style={{position:"absolute",left:20,top:0,bottom:0,width:1,background:"rgba(255,255,255,0.06)"}}/>
      {LOG.map(a=><div key={a.id} style={{display:"flex",gap:18,marginBottom:18,position:"relative"}}>
        <div style={{width:40,height:40,borderRadius:"50%",background:TC[a.type]+"22",border:`2px solid ${TC[a.type]}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:TC[a.type],flexShrink:0,zIndex:1}}>{TI[a.type]}</div>
        <div style={{flex:1,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:11,padding:"13px 15px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
            <span style={{fontSize:13,color:"#e2e8f0"}}><strong style={{color:"#f1f5f9"}}>{a.user}</strong> {a.action} <strong style={{color:TC[a.type]}}>{a.target}</strong></span>
            <span style={{fontSize:10,color:"#475569",flexShrink:0,marginLeft:11}}>{a.time}</span>
          </div>
        </div>
      </div>)}
    </div>
  </div>;
};

// ── PROJECT DETAIL ────────────────────────────────────────────
const ProjectDetail = ({project,tasks,users,onBack,onUpdate}) => {
  const pt=tasks.filter(t=>t.projectId===project.id);
  const mgr=users.find(u=>u.id===project.manager);
  return <div style={{padding:22}}>
    <button onClick={onBack} style={{background:"transparent",border:"none",color:"#06b6d4",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",marginBottom:18,display:"flex",alignItems:"center",gap:5}}>← Back to Projects</button>
    <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:22,marginBottom:18}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:7}}><div style={{width:11,height:11,borderRadius:"50%",background:project.color}}/><h2 style={{margin:0,fontSize:20,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif"}}>{project.name}</h2></div>
          <div style={{display:"flex",gap:7}}><Badge label={sLabel(project.status)} color={sColor(project.status)}/><Badge label={project.priority} color={pColor(project.priority)}/></div>
        </div>
        {mgr&&<div style={{display:"flex",alignItems:"center",gap:7,padding:"7px 13px",background:"rgba(255,255,255,0.04)",borderRadius:9}}><Av u={mgr.avatar} size={26}/><div><div style={{fontSize:10,color:"#475569"}}>Project Manager</div><div style={{fontSize:12,fontWeight:600,color:"#e2e8f0"}}>{mgr.name}</div></div></div>}
      </div>
      <p style={{fontSize:12,color:"#64748b",marginBottom:14}}>{project.description}</p>
      <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:11,color:"#475569"}}>Progress</span><span style={{fontSize:12,fontWeight:700,color:project.progress===100?"#10b981":"#f1f5f9"}}>{project.progress}%</span></div><Bar v={project.progress} color={project.color} h={8}/></div>
    </div>
    <div style={{fontSize:13,fontWeight:600,color:"#94a3b8",marginBottom:11,textTransform:"uppercase",letterSpacing:"0.06em"}}>Tasks ({pt.length})</div>
    <div style={{display:"flex",flexDirection:"column",gap:7}}>
      {pt.map(t=>{const a=users.find(u=>u.id===t.assignee);return <div key={t.id} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:11,padding:"13px 15px",display:"flex",alignItems:"center",gap:11}}>
        <input type="checkbox" checked={t.status==="completed"} onChange={()=>onUpdate(t.id,{status:t.status==="completed"?"todo":"completed"})} style={{accentColor:"#06b6d4",cursor:"pointer"}}/>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.status==="completed"?"#475569":"#e2e8f0",textDecoration:t.status==="completed"?"line-through":"none"}}>{t.title}</div>{t.description&&<div style={{fontSize:11,color:"#475569",marginTop:2}}>{t.description}</div>}</div>
        <Badge label={t.priority} color={pColor(t.priority)} sm/>
        <Badge label={sLabel(t.status)} color={sColor(t.status)} sm/>
        {a&&<Av u={a.avatar} size={22}/>}
      </div>;})}
      {pt.length===0&&<div style={{padding:35,textAlign:"center",color:"#475569"}}>No tasks in this project yet.</div>}
    </div>
  </div>;
};

// ── LOGIN PAGE ────────────────────────────────────────────────
const LoginPage = ({onLogin, users}) => {
  const [step, setStep] = useState("login"); // login | forgot | forgot_otp
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotGenOtp, setForgotGenOtp] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwReset, setPwReset] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);

  useEffect(() => {
    if (step === "forgot_otp") {
      setOtpTimer(60);
      const t = setInterval(() => setOtpTimer(p => { if(p<=1){clearInterval(t);return 0;} return p-1; }), 1000);
      return () => clearInterval(t);
    }
  }, [step]);

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  // Direct login — no OTP needed
  const handleLogin = async () => {
    setErr(""); setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) { setErr("❌ No account found with this email."); setLoading(false); return; }
    if (found.status === "pending_setup") { setErr("⚠️ Account setup pending. Please check your email for the setup link."); setLoading(false); return; }
    if (!pw || pw.length < 4) { setErr("Please enter your password."); setLoading(false); return; }
    if (found.password && found.password !== pw) { setErr("❌ Incorrect password. Please try again."); setLoading(false); return; }
    onLogin(found);
    setLoading(false);
  };

  // Forgot — send OTP
  const handleForgot = async () => {
    setErr(""); setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const found = users.find(u => u.email.toLowerCase() === forgotEmail.toLowerCase());
    if (!found) { setErr("❌ No account found with this email."); setLoading(false); return; }
    const code = generateOtp();
    setForgotGenOtp(code);
    setForgotOtp("");
    setStep("forgot_otp");
    setLoading(false);
    // In production: send real email via backend
    alert(`🔧 DEV MODE\n\nYour OTP is: ${code}\n\n(Production mein yeh email par aayega)`);
  };

  const handleResetPw = () => {
    setErr("");
    if (forgotOtp !== forgotGenOtp) { setErr("❌ Invalid OTP. Please try again."); return; }
    if (newPw.length < 6) { setErr("Password must be at least 6 characters."); return; }
    if (newPw !== confirmPw) { setErr("❌ Passwords do not match."); return; }
    setPwReset(true);
    setTimeout(() => { setStep("login"); setPwReset(false); setForgotEmail(""); setForgotOtp(""); setNewPw(""); setConfirmPw(""); }, 2000);
  };

  const BG = <>
    <div style={{position:"absolute",top:-200,right:-200,width:550,height:550,borderRadius:"50%",background:"radial-gradient(circle,rgba(6,182,212,0.08) 0%,transparent 70%)"}}/>
    <div style={{position:"absolute",bottom:-250,left:-200,width:650,height:650,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.06) 0%,transparent 70%)"}}/>
    <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",backgroundSize:"60px 60px",pointerEvents:"none"}}/>
  </>;

  const Logo = <div style={{textAlign:"center",marginBottom:32}}>
    <div style={{display:"inline-flex",alignItems:"center",gap:11,marginBottom:7}}>
      <div style={{width:46,height:46,borderRadius:13,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:"0 0 28px rgba(6,182,212,0.4)"}}>⬡</div>
      <div>
        <div style={{fontSize:22,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif",letterSpacing:"-0.02em"}}>ZOLAR</div>
        <div style={{fontSize:9,color:"#475569",letterSpacing:"0.14em",textTransform:"uppercase"}}>Project Management</div>
      </div>
    </div>
  </div>;

  // ── FORGOT OTP SCREEN ──
  if (step === "forgot_otp") return (
    <div style={{minHeight:"100vh",background:"#0a0e13",display:"flex",alignItems:"center",justifyContent:"center",padding:22,position:"relative",overflow:"hidden"}}>
      {BG}
      <div style={{width:"100%",maxWidth:420,position:"relative"}}>
        {Logo}
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:18,padding:34,backdropFilter:"blur(10px)"}}>
          {pwReset ? (
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:48,marginBottom:12}}>✅</div>
              <div style={{fontSize:16,fontWeight:700,color:"#10b981",marginBottom:6}}>Password Reset!</div>
              <div style={{fontSize:12,color:"#64748b"}}>Redirecting to login...</div>
            </div>
          ) : <>
            <div style={{textAlign:"center",marginBottom:22}}>
              <div style={{fontSize:44,marginBottom:10}}>📧</div>
              <div style={{fontSize:16,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif",marginBottom:6}}>Enter Verification Code</div>
              <div style={{fontSize:12,color:"#64748b"}}>Code sent to <strong style={{color:"#06b6d4"}}>{forgotEmail}</strong></div>
            </div>
            {/* Single OTP input field — easy to type */}
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:11,fontWeight:600,color:"#94a3b8",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.06em"}}>6-Digit OTP Code</label>
              <input
                type="text" inputMode="numeric" maxLength={6}
                value={forgotOtp}
                onChange={e => setForgotOtp(e.target.value.replace(/\D/g,"").slice(0,6))}
                placeholder="000000"
                autoFocus
                style={{width:"100%",padding:"14px",background:"rgba(255,255,255,0.06)",border:`1px solid ${forgotOtp.length===6?"#06b6d4":"rgba(255,255,255,0.15)"}`,borderRadius:11,color:"#f1f5f9",fontSize:24,fontWeight:700,fontFamily:"'Clash Display',sans-serif",outline:"none",textAlign:"center",letterSpacing:"0.3em",boxSizing:"border-box"}}
              />
              <div style={{fontSize:11,color:"#475569",marginTop:6,textAlign:"right"}}>
                {otpTimer>0 ? <span>Resend in <strong style={{color:"#06b6d4"}}>{otpTimer}s</strong></span> :
                <button onClick={()=>{const c=generateOtp();setForgotGenOtp(c);setForgotOtp("");setOtpTimer(60);alert(`DEV: New OTP = ${c}`);}} style={{background:"none",border:"none",color:"#06b6d4",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>Resend OTP</button>}
              </div>
            </div>
            <div style={{marginBottom:16,position:"relative"}}>
              <label style={{display:"block",fontSize:11,fontWeight:600,color:"#94a3b8",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.06em"}}>New Password</label>
              <div style={{position:"relative"}}>
                <input type={showNewPw?"text":"password"} value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="Min 6 characters"
                  style={{width:"100%",padding:"10px 40px 10px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,color:"#f1f5f9",fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box"}}
                  onFocus={e=>e.target.style.borderColor="#06b6d4"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
                <button onClick={()=>setShowNewPw(p=>!p)} style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#475569",fontSize:14}}>{showNewPw?"🙈":"👁"}</button>
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:11,fontWeight:600,color:"#94a3b8",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.06em"}}>Confirm Password</label>
              <input type="password" value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} placeholder="Re-enter password"
                style={{width:"100%",padding:"10px 14px",background:"rgba(255,255,255,0.04)",border:`1px solid ${confirmPw&&newPw!==confirmPw?"#ef4444":"rgba(255,255,255,0.1)"}`,borderRadius:9,color:"#f1f5f9",fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box"}}/>
            </div>
            {err&&<div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:9,padding:"9px 13px",fontSize:12,color:"#ef4444",marginBottom:14}}>{err}</div>}
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{setStep("login");setErr("");}} style={{flex:1,padding:"10px",background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:11,color:"#64748b",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>← Back</button>
              <button onClick={handleResetPw} disabled={forgotOtp.length<6||!newPw||!confirmPw}
                style={{flex:2,padding:"10px",background:"linear-gradient(135deg,#06b6d4,#0891b2)",border:"none",borderRadius:11,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",opacity:forgotOtp.length<6||!newPw||!confirmPw?.5:1}}>
                Reset Password ✓
              </button>
            </div>
          </>}
        </div>
      </div>
    </div>
  );

  // ── FORGOT EMAIL SCREEN ──
  if (step === "forgot") return (
    <div style={{minHeight:"100vh",background:"#0a0e13",display:"flex",alignItems:"center",justifyContent:"center",padding:22,position:"relative",overflow:"hidden"}}>
      {BG}
      <div style={{width:"100%",maxWidth:420,position:"relative"}}>
        {Logo}
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:18,padding:34,backdropFilter:"blur(10px)"}}>
          <div style={{fontSize:16,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif",marginBottom:6}}>Reset Password</div>
          <div style={{fontSize:12,color:"#64748b",marginBottom:22}}>Enter your registered email to receive a reset code.</div>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:600,color:"#94a3b8",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.06em"}}>Work Email</label>
            <input type="email" value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)} placeholder="name@company.com" autoFocus
              onKeyDown={e=>e.key==="Enter"&&handleForgot()}
              style={{width:"100%",padding:"10px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,color:"#f1f5f9",fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box"}}
              onFocus={e=>e.target.style.borderColor="#06b6d4"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
          </div>
          {err&&<div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:9,padding:"9px 13px",fontSize:12,color:"#ef4444",marginBottom:14}}>{err}</div>}
          <button onClick={handleForgot} disabled={loading||!forgotEmail}
            style={{width:"100%",padding:"11px",background:"linear-gradient(135deg,#06b6d4,#0891b2)",border:"none",borderRadius:11,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:12,opacity:!forgotEmail?.5:1}}>
            {loading?"Sending...":"Send Reset Code →"}
          </button>
          <button onClick={()=>{setStep("login");setErr("");}} style={{width:"100%",padding:"10px",background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:11,color:"#64748b",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>← Back to Login</button>
        </div>
      </div>
    </div>
  );

  // ── MAIN LOGIN SCREEN ──
  return (
    <div style={{minHeight:"100vh",background:"#0a0e13",display:"flex",alignItems:"center",justifyContent:"center",padding:22,position:"relative",overflow:"hidden"}}>
      {BG}
      <div style={{width:"100%",maxWidth:420,position:"relative"}}>
        {Logo}
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:18,padding:34,backdropFilter:"blur(10px)"}}>
          <div style={{fontSize:16,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif",marginBottom:4}}>Welcome back</div>
          <div style={{fontSize:12,color:"#64748b",marginBottom:24}}>Sign in to your workspace</div>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:600,color:"#94a3b8",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.06em"}}>Work Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@company.com" autoFocus
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              style={{width:"100%",padding:"10px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,color:"#f1f5f9",fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box"}}
              onFocus={e=>e.target.style.borderColor="#06b6d4"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
          </div>
          <div style={{marginBottom:8,position:"relative"}}>
            <label style={{display:"block",fontSize:11,fontWeight:600,color:"#94a3b8",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.06em"}}>Password</label>
            <div style={{position:"relative"}}>
              <input type={showPw?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)}
                placeholder="Enter your password"
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                style={{width:"100%",padding:"10px 40px 10px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,color:"#f1f5f9",fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box"}}
                onFocus={e=>e.target.style.borderColor="#06b6d4"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
              <button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#475569",fontSize:15,padding:0}}>
                {showPw?"🙈":"👁"}
              </button>
            </div>
          </div>
          <div style={{textAlign:"right",marginBottom:20}}>
            <button onClick={()=>{setStep("forgot");setErr("");setForgotEmail(email);}} style={{background:"none",border:"none",color:"#06b6d4",cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>Forgot password?</button>
          </div>
          {err&&<div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:9,padding:"9px 13px",fontSize:12,color:"#ef4444",marginBottom:16}}>{err}</div>}
          <button onClick={handleLogin} disabled={loading||!email||!pw}
            style={{width:"100%",padding:"12px",background:loading||!email||!pw?"rgba(6,182,212,0.35)":"linear-gradient(135deg,#06b6d4,#0891b2)",border:"none",borderRadius:11,color:"#fff",fontSize:14,fontWeight:700,cursor:loading||!email||!pw?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 4px 18px rgba(6,182,212,0.25)",transition:"all .2s"}}>
            {loading?"Signing in...":"Sign In →"}
          </button>
          <div style={{marginTop:18,padding:"10px 13px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:9,fontSize:11,color:"#475569",textAlign:"center",lineHeight:1.6}}>
            🔒 Only authorized company accounts can sign in
          </div>
        </div>
      </div>
    </div>
  );
};

// ── ACCOUNT SETUP PAGE ───────────────────────────────────────
const SetupPage = ({setupUser, onComplete}) => {
  const [step,setStep] = useState(1);
  const [f,setF] = useState({name:setupUser?.name||"",phone:"",title:setupUser?.title||"",dept:setupUser?.dept||"",managerName:setupUser?.managerName||"",password:"",confirmPw:""});
  const [showPw,setShowPw] = useState(false);
  const [done,setDone] = useState(false);
  const up = k => v => setF(p=>({...p,[k]:v}));

  const BG = <>
    <div style={{position:"absolute",top:-200,right:-200,width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(6,182,212,0.08) 0%,transparent 70%)"}}/>
    <div style={{position:"absolute",bottom:-200,left:-200,width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.06) 0%,transparent 70%)"}}/>
    <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",backgroundSize:"60px 60px",pointerEvents:"none"}}/>
  </>;

  const finish = () => {
    if(!f.name||!f.password||f.password!==f.confirmPw) return;
    setDone(true);
    setTimeout(()=>onComplete({...setupUser,...f,avatar:initials(f.name),status:"active",password:f.password}),1500);
  };

  if(done) return <div style={{minHeight:"100vh",background:"#0a0e13",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
    <div style={{fontSize:60}}>🎉</div>
    <div style={{fontSize:22,fontWeight:700,color:"#10b981",fontFamily:"'Clash Display',sans-serif"}}>Account Ready!</div>
    <div style={{fontSize:14,color:"#64748b"}}>Redirecting to your dashboard...</div>
  </div>;

  return <div style={{minHeight:"100vh",background:"#0a0e13",display:"flex",alignItems:"center",justifyContent:"center",padding:22,position:"relative",overflow:"hidden"}}>
    {BG}
    <div style={{width:"100%",maxWidth:480,position:"relative"}}>
      {/* Logo */}
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:11,marginBottom:8}}>
          <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 0 25px rgba(6,182,212,0.4)"}}>⬡</div>
          <div><div style={{fontSize:20,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif"}}>ZOLAR PM</div><div style={{fontSize:9,color:"#475569",letterSpacing:"0.12em",textTransform:"uppercase"}}>Account Setup</div></div>
        </div>
        <div style={{fontSize:13,color:"#64748b"}}>Welcome, <strong style={{color:"#06b6d4"}}>{setupUser?.name||"New Member"}</strong>! Complete your profile to get started.</div>
      </div>
      {/* Steps */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:0,marginBottom:24}}>
        {[1,2].map((s,i)=><><div key={s} onClick={()=>step>s&&setStep(s)} style={{width:34,height:34,borderRadius:"50%",background:step>=s?"linear-gradient(135deg,#06b6d4,#0891b2)":"rgba(255,255,255,0.08)",border:`2px solid ${step>=s?"#06b6d4":"rgba(255,255,255,0.1)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:step>=s?"#fff":"#475569",cursor:step>s?"pointer":"default"}}>
          {step>s?"✓":s}
        </div>{i===0&&<div style={{width:60,height:2,background:step>1?"#06b6d4":"rgba(255,255,255,0.08)"}}/>}</>)}
      </div>
      <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:18,padding:30,backdropFilter:"blur(10px)"}}>
        {/* Role badge */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,padding:"10px 14px",background:"rgba(6,182,212,0.08)",border:"1px solid rgba(6,182,212,0.2)",borderRadius:10}}>
          <Av u={initials(f.name||setupUser?.name||"?")} size={36}/>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#f1f5f9"}}>{f.name||setupUser?.name}</div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}><Badge label={rLabel(setupUser?.role||"team_member")} color={rColor(setupUser?.role||"team_member")} sm/><span style={{fontSize:11,color:"#475569"}}>· {setupUser?.email}</span></div>
          </div>
        </div>

        {step===1?<>
          <div style={{fontSize:14,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif",marginBottom:18}}>Step 1 — Personal Information</div>
          <Inp label="Full Name" value={f.name} onChange={up("name")} req placeholder="Enter your full name"/>
          <Inp label="Phone Number" value={f.phone} onChange={up("phone")} placeholder="+91 9876543210"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Inp label="Job Title / Profile" value={f.title} onChange={up("title")} placeholder="e.g. Developer"/>
            <Inp label="Department" value={f.dept} onChange={up("dept")} placeholder="e.g. Engineering"/>
          </div>
          <Inp label="Manager Name" value={f.managerName} onChange={up("managerName")} placeholder="Your reporting manager"/>
          <Btn variant="primary" onClick={()=>{if(f.name)setStep(2);}} disabled={!f.name} sx={{width:"100%",justifyContent:"center",marginTop:4}}>Next Step →</Btn>
        </>:<>
          <div style={{fontSize:14,fontWeight:700,color:"#f1f5f9",fontFamily:"'Clash Display',sans-serif",marginBottom:18}}>Step 2 — Create Your Password</div>
          <div style={{marginBottom:16,position:"relative"}}>
            <label style={{display:"block",fontSize:11,fontWeight:600,color:"#94a3b8",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>Create Password <span style={{color:"#ef4444"}}>*</span></label>
            <div style={{position:"relative"}}>
              <input type={showPw?"text":"password"} value={f.password} onChange={e=>up("password")(e.target.value)} placeholder="Min 6 characters"
                style={{width:"100%",padding:"10px 40px 10px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,color:"#f1f5f9",fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box"}}
                onFocus={e=>e.target.style.borderColor="#06b6d4"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
              <button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#475569",fontSize:14}}>
                {showPw?"🙈":"👁"}
              </button>
            </div>
          </div>
          <Inp label="Confirm Password" type="password" value={f.confirmPw} onChange={up("confirmPw")} placeholder="Re-enter your password" req/>
          {f.password&&f.confirmPw&&f.password!==f.confirmPw&&<div style={{color:"#ef4444",fontSize:12,marginBottom:12,marginTop:-8}}>⚠️ Passwords do not match</div>}
          {f.password&&f.password.length>0&&f.password.length<6&&<div style={{color:"#f59e0b",fontSize:12,marginBottom:12,marginTop:-8}}>⚠️ Password must be at least 6 characters</div>}
          <div style={{padding:"10px 14px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:9,fontSize:11,color:"#475569",marginBottom:16}}>
            🔐 Your password will be used to log in to Zolar PM. Choose a strong password.
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn variant="secondary" onClick={()=>setStep(1)} sx={{flex:1,justifyContent:"center"}}>← Back</Btn>
            <Btn variant="primary" onClick={finish} disabled={!f.password||f.password.length<6||f.password!==f.confirmPw} sx={{flex:2,justifyContent:"center"}}>🎉 Complete Setup</Btn>
          </div>
        </>}
      </div>
    </div>
  </div>;
};

// ── MAIN APP ──────────────────────────────────────────────────
export default function ZolarApp() {
  const [screen,setScreen] = useState("login"); // login | setup | app
  const [setupUser,setSetupUser] = useState(null);
  const [activeNav,setActiveNav] = useState("dashboard");
  const [collapsed,setCollapsed] = useState(false);
  const [showNotifs,setShowNotifs] = useState(false);
  const [showProfile,setShowProfile] = useState(false);
  const [selectedProject,setSelectedProject] = useState(null);

  const [projects,setProjects] = useState(INIT_PROJECTS);
  const [tasks,setTasks] = useState(INIT_TASKS);
  const [users,setUsers] = useState(INIT_USERS);
  const [notifs,setNotifs] = useState(INIT_NOTIFS);
  const [events,setEvents] = useState(INIT_EVENTS);
  const [currentUser,setCurrentUser] = useState(null);

  // Modals
  const [showNewProj,setShowNewProj] = useState(false);
  const [editProj,setEditProj] = useState(null);
  const [delProj,setDelProj] = useState(null);
  const [showNewTask,setShowNewTask] = useState(false);
  const [editTask,setEditTask] = useState(null);
  const [delTask,setDelTask] = useState(null);
  const [showInvite,setShowInvite] = useState(false);

  const addNotif = n => setNotifs(p=>[{id:uid(),read:false,time:"Just now",...n},...p]);

  const handleLogin = user => {
    const full = users.find(u=>u.id===user.id) || users.find(u=>u.email===user.email) || {...user};
    setCurrentUser(full);
    setScreen("app");
  };

  const handleSetupComplete = data => {
    setUsers(us=>us.map(u=>u.id===data.id?{...u,...data}:u));
    setCurrentUser({...data});
    setSetupUser(null);
    setScreen("app");
  };

  // Projects CRUD
  const createProj = d => { const p={...d,id:uid(),progress:d.progress||0,tags:[]}; setProjects(ps=>[...ps,p]); addNotif({type:"project_update",title:"Project created",message:`${d.name} created`}); setShowNewProj(false); };
  const saveProj = d => { setProjects(ps=>ps.map(p=>p.id===d.id?d:p)); if(selectedProject?.id===d.id)setSelectedProject(d); addNotif({type:"project_update",title:"Project updated",message:`${d.name} updated`}); setEditProj(null); };
  const deleteProj = () => { setProjects(ps=>ps.filter(p=>p.id!==delProj.id)); if(selectedProject?.id===delProj.id){setSelectedProject(null);setActiveNav("projects");} setDelProj(null); };

  // Tasks CRUD
  const createTask = d => { const t={...d,id:uid(),creator:currentUser?.id||"u1",createdAt:new Date().toISOString().split("T")[0],comments:0,attachments:0,timeLogged:0,tags:[]}; setTasks(ts=>[...ts,t]); addNotif({type:"task_assigned",title:"Task created",message:`"${d.title}" created`}); setShowNewTask(false); };
  const saveTask = d => { setTasks(ts=>ts.map(t=>t.id===d.id?{...t,...d}:t)); addNotif({type:"task_assigned",title:"Task updated",message:`"${d.title}" updated`}); setEditTask(null); };
  const deleteTask = () => { setTasks(ts=>ts.filter(t=>t.id!==delTask.id)); setDelTask(null); };
  const updateTask = (id,upd) => {
    setTasks(ts=>ts.map(t=>t.id===id?{...t,...upd}:t));
    if(upd.status==="completed") addNotif({type:"task_completed",title:"Task completed",message:"A task has been marked done"});
  };

  const inviteUser = d => {
    const u={...d,id:uid(),avatar:initials(d.name),status:"pending_setup",password:"",joined:new Date().toISOString().split("T")[0]};
    setUsers(us=>[...us,u]);
    addNotif({type:"project_update",title:"Member invited",message:`Invitation sent to ${d.email}`});
    setShowInvite(false);
  };

  // When user clicks setup link
  const handleSetupLink = (token) => {
    const found = users.find(u=>u.setupToken===token);
    if(found){ setSetupUser(found); setScreen("setup"); }
  };

  const addEvent = ev => { setEvents(es=>[...es,ev]); addNotif({type:"project_update",title:"Event added",message:`"${ev.title}" added to calendar`}); };

  const saveProfile = upd => { setCurrentUser(upd); setUsers(us=>us.map(u=>u.id===upd.id?upd:u)); setShowProfile(false); };
  const saveSettings = upd => { setCurrentUser(upd); setUsers(us=>us.map(u=>u.id===upd.id?upd:u)); };

  const PT={"dashboard":"Dashboard","projects":"Projects","tasks":"Tasks","kanban":"Kanban Board","team":"Team","calendar":"Calendar","reports":"Reports & Analytics","files":"File Management","activity":"Activity Log","settings":"Settings"};

  if(screen==="login") return <><style>{FONTS}</style><style>{`*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'DM Sans',sans-serif;}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:99px}`}</style><LoginPage onLogin={handleLogin} users={users}/></>;
  if(screen==="setup") return <><style>{FONTS}</style><style>{`*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'DM Sans',sans-serif;}`}</style><SetupPage setupUser={setupUser} onComplete={handleSetupComplete}/></>;

  const renderPage = () => {
    if(activeNav==="project_detail"&&selectedProject) return <ProjectDetail project={selectedProject} tasks={tasks} users={users} onBack={()=>setActiveNav("projects")} onUpdate={updateTask}/>;
    switch(activeNav){
      case "dashboard": return <Dashboard projects={projects} tasks={tasks} users={users} notifs={notifs} currentUser={currentUser}/>;
      case "projects": return <ProjectsView projects={projects} users={users} onView={p=>{setSelectedProject(p);setActiveNav("project_detail");}} onCreate={()=>setShowNewProj(true)} onEdit={setEditProj} onDelete={setDelProj}/>;
      case "tasks": return <TasksView tasks={tasks} projects={projects} users={users} onCreate={()=>setShowNewTask(true)} onEdit={setEditTask} onDelete={setDelTask} onUpdate={updateTask}/>;
      case "kanban": return <KanbanView tasks={tasks} projects={projects} users={users} onUpdate={updateTask}/>;
      case "team": return <TeamView users={users} projects={projects} tasks={tasks} onInvite={()=>setShowInvite(true)}/>;
      case "calendar": return <CalendarView tasks={tasks} projects={projects} events={events} onAddEvent={addEvent}/>;
      case "reports": return <ReportsView projects={projects} tasks={tasks} users={users}/>;
      case "files": return <FilesView/>;
      case "activity": return <ActivityView/>;
      case "settings": return <SettingsView user={currentUser} onSave={saveSettings}/>;
      default: return <Dashboard projects={projects} tasks={tasks} users={users} notifs={notifs} currentUser={currentUser}/>;
    }
  };

  return <>
    <style>{FONTS}</style>
    <style>{`*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'DM Sans',sans-serif;background:#0a0e13;color:#f1f5f9;}::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:99px}input[type="date"]::-webkit-calendar-picker-indicator,input[type="time"]::-webkit-calendar-picker-indicator{filter:invert(.5);cursor:pointer}select option{background:#141920}@keyframes fadeIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}`}</style>
    <div style={{display:"flex",minHeight:"100vh",background:"#0a0e13"}}>
      <Sidebar active={activeNav} onNav={id=>{setActiveNav(id);setSelectedProject(null);}} collapsed={collapsed} unread={notifs.filter(n=>!n.read).length}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:"100vh",overflow:"hidden"}}>
        <TopBar
          title={activeNav==="project_detail"?selectedProject?.name:(PT[activeNav]||"Dashboard")}
          onToggle={()=>setCollapsed(c=>!c)}
          notifs={notifs}
          onNotif={()=>setShowNotifs(v=>!v)}
          onSearch={()=>{}}
          user={currentUser}
          onProfile={()=>setShowProfile(true)}
        />
        <div style={{flex:1,overflowY:"auto",animation:"fadeIn .3s ease"}}>{renderPage()}</div>
      </div>
    </div>

    {showNotifs&&<NotifsPanel notifs={notifs} onRead={id=>setNotifs(ns=>ns.map(n=>n.id===id?{...n,read:true}:n))} onClose={()=>setShowNotifs(false)}/>}

    {/* Profile Edit Modal */}
    <ProfileModal open={showProfile} onClose={()=>setShowProfile(false)} user={currentUser} onSave={saveProfile}/>

    {/* Project Modals */}
    <Modal open={showNewProj} onClose={()=>setShowNewProj(false)} title="Create New Project" width={640}>
      <ProjForm users={users} onSave={createProj} onClose={()=>setShowNewProj(false)}/>
    </Modal>
    <Modal open={!!editProj} onClose={()=>setEditProj(null)} title="Edit Project" width={640}>
      {editProj&&<ProjForm init={editProj} users={users} onSave={saveProj} onClose={()=>setEditProj(null)}/>}
    </Modal>
    <ConfirmDel open={!!delProj} onClose={()=>setDelProj(null)} onConfirm={deleteProj} title={`Delete "${delProj?.name}"?`} msg="This will permanently delete the project. This cannot be undone."/>

    {/* Task Modals */}
    <Modal open={showNewTask} onClose={()=>setShowNewTask(false)} title="Create New Task">
      <TaskForm projects={projects} users={users} onSave={createTask} onClose={()=>setShowNewTask(false)}/>
    </Modal>
    <Modal open={!!editTask} onClose={()=>setEditTask(null)} title="Edit Task">
      {editTask&&<TaskForm init={editTask} projects={projects} users={users} onSave={saveTask} onClose={()=>setEditTask(null)}/>}
    </Modal>
    <ConfirmDel open={!!delTask} onClose={()=>setDelTask(null)} onConfirm={deleteTask} title={`Delete "${delTask?.title}"?`} msg="This task will be permanently deleted."/>

    {/* Invite User */}
    <InviteModal open={showInvite} onClose={()=>setShowInvite(false)} onAdd={inviteUser} projects={projects} currentUser={currentUser}/>

    {/* Dev: Simulate clicking invite link */}
    {users.filter(u=>u.status==="pending_setup").length>0&&<div style={{position:"fixed",bottom:60,right:16,background:"#141920",border:"1px solid rgba(245,158,11,0.3)",borderRadius:12,padding:"12px 16px",zIndex:999,maxWidth:280}}>
      <div style={{fontSize:11,fontWeight:600,color:"#f59e0b",marginBottom:8}}>🔧 Dev: Pending Setup Users</div>
      {users.filter(u=>u.status==="pending_setup").map(u=><div key={u.id} style={{marginBottom:6}}>
        <div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>{u.name} ({u.email})</div>
        <button onClick={()=>{setSetupUser(u);setScreen("setup");}} style={{background:"linear-gradient(135deg,#06b6d4,#0891b2)",border:"none",borderRadius:6,padding:"4px 12px",color:"#fff",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>
          🔗 Simulate Setup Link Click
        </button>
      </div>)}
    </div>}


  </>;
}
