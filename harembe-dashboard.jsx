import { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const COLORS = ["#C9A84C","#E8C97A","#A07830","#F0DFA0","#7A5C20","#D4B060"];
const CHAIRMAN_PASSWORD = "chairman2024";
const STORAGE_KEY = "hvc_dashboard_data_v2";

const defaultData = {
  orgName: "HAREMBE VIEWER'S CORPORATION",
  members: [
    { name: "Wokuti Constant", share: 26.1, role: "Chairman", savings: 20000, contribution: 25600 },
    { name: "Bilali Ayub",     share: 56.7, role: "Member",   savings: 50000, contribution: 55600 },
    { name: "Kulisoma Joshua", share: 5.7,  role: "Member",   savings: 0,     contribution: 5600  },
    { name: "Namukose Samali", share: 5.7,  role: "Member",   savings: 0,     contribution: 5600  },
    { name: "Kintu Jamal",     share: 5.7,  role: "Member",   savings: 0,     contribution: 5600  },
    { name: "Bashiri Umar",    share: 0,    role: "Member",   savings: 0,     contribution: 0     },
  ],
  monthly: [
    { month: "Jan", profit: 0,      loss: 0,     investment: 0 },
    { month: "Feb", profit: 0,      loss: 0,     investment: 0 },
    { month: "Mar", profit: 20000,  loss: 0,     investment: 28000 },
    { month: "Apr", profit: 0,      loss: 10000, investment: 30000 },
    { month: "May", profit: 0,      loss: 0,     investment: 0 },
  ],
  investments: [
    { name: "March Birds (4 chicks→grown)", amount: 28000, currentValue: 48000, sector: "Poultry", status: "Active" },
    { name: "April Birds (3 chicks bought)", amount: 30000, currentValue: 14000, sector: "Poultry", status: "Active" },
  ],
  cash: 513000,
};

function fmt(n) {
  const num = Number(n) || 0;
  if (num >= 1000000) return `UGX ${(num/1000000).toFixed(2)}M`;
  if (num >= 1000)    return `UGX ${(num/1000).toFixed(1)}K`;
  return `UGX ${num.toLocaleString()}`;
}

function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState(null);
  const [pwd, setPwd] = useState("");
  const [memberName, setMemberName] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  function doChairman() {
    if (pwd === CHAIRMAN_PASSWORD) { onLogin("chairman","Wokuti Constant"); }
    else { setError("Incorrect password."); setShake(true); setTimeout(()=>setShake(false),500); setPwd(""); }
  }
  function doMember() {
    if (!memberName.trim()) { setError("Please enter your name."); return; }
    onLogin("member", memberName.trim());
  }

  return (
    <div style={{minHeight:"100vh",background:"#0D0D0D",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Georgia',serif",color:"#F0E6CC"}}>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
      <div style={{textAlign:"center",marginBottom:"44px"}}>
        <div style={{fontSize:"44px",marginBottom:"14px"}}>🐓</div>
        <h1 style={{margin:0,fontSize:"22px",color:"#C9A84C",letterSpacing:"4px"}}>HAREMBE VIEWER'S</h1>
        <h2 style={{margin:"4px 0 0",fontSize:"13px",color:"#7A5C20",letterSpacing:"6px",fontWeight:"normal"}}>CORPORATION</h2>
        <p style={{margin:"14px 0 0",fontSize:"11px",color:"#3A2A00",letterSpacing:"3px"}}>INVESTMENT DASHBOARD · CONFIDENTIAL · {new Date().getFullYear()}</p>
      </div>

      {!mode ? (
        <div style={{display:"flex",gap:"16px"}}>
          {[{key:"chairman",icon:"👑",label:"Chairman",sub:"Full access & editing"},{key:"member",icon:"👤",label:"Member",sub:"View-only access"}].map(opt=>(
            <button key={opt.key} onClick={()=>{setMode(opt.key);setError("");}}
              style={{background:"linear-gradient(135deg,#1A1200,#0D0D0D)",border:"1px solid #C9A84C",borderRadius:"10px",color:"#F0E6CC",padding:"32px 44px",cursor:"pointer",textAlign:"center",fontFamily:"'Georgia',serif"}}>
              <div style={{fontSize:"28px",marginBottom:"10px"}}>{opt.icon}</div>
              <div style={{fontSize:"15px",color:"#C9A84C",letterSpacing:"1px",marginBottom:"6px"}}>{opt.label}</div>
              <div style={{fontSize:"11px",color:"#7A5C20"}}>{opt.sub}</div>
            </button>
          ))}
        </div>
      ) : (
        <div style={{background:"#111",border:"1px solid #2A1F00",borderRadius:"10px",padding:"36px 44px",width:"320px",textAlign:"center",animation:shake?"shake 0.4s":"none"}}>
          <div style={{fontSize:"28px",marginBottom:"16px"}}>{mode==="chairman"?"👑":"👤"}</div>
          <h3 style={{margin:"0 0 22px",color:"#C9A84C",fontSize:"13px",letterSpacing:"2px"}}>{mode==="chairman"?"CHAIRMAN ACCESS":"MEMBER ACCESS"}</h3>
          <div style={{fontSize:"11px",color:"#7A5C20",letterSpacing:"2px",marginBottom:"8px",textAlign:"left"}}>{mode==="chairman"?"PASSWORD":"YOUR NAME"}</div>
          <input type={mode==="chairman"?"password":"text"} value={mode==="chairman"?pwd:memberName}
            onChange={e=>{mode==="chairman"?setPwd(e.target.value):setMemberName(e.target.value);setError("");}}
            onKeyDown={e=>e.key==="Enter"&&(mode==="chairman"?doChairman():doMember())}
            placeholder={mode==="chairman"?"Enter password":"Enter your name"}
            style={{background:"#0D0D0D",border:"1px solid #2A1F00",borderRadius:"4px",color:"#F0E6CC",padding:"12px 14px",fontSize:"14px",fontFamily:"'Georgia',serif",outline:"none",width:"100%",boxSizing:"border-box",display:"block",marginBottom:"10px"}}
          />
          {error && <div style={{color:"#FF6B6B",fontSize:"12px",marginBottom:"12px"}}>{error}</div>}
          <button onClick={mode==="chairman"?doChairman:doMember}
            style={{background:"linear-gradient(135deg,#2D1F00,#1A1200)",border:"1px solid #C9A84C",borderRadius:"4px",color:"#C9A84C",padding:"12px",width:"100%",cursor:"pointer",fontSize:"12px",letterSpacing:"2px",fontFamily:"'Georgia',serif",marginBottom:"12px"}}>
            ENTER DASHBOARD
          </button>
          <button onClick={()=>{setMode(null);setError("");setPwd("");setMemberName("");}}
            style={{background:"none",border:"none",color:"#3A2A00",cursor:"pointer",fontSize:"11px",fontFamily:"'Georgia',serif"}}>← Back</button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [auth, setAuth] = useState(null);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("overview");
  const [savedBadge, setSavedBadge] = useState(false);
  const [newMember, setNewMember] = useState({name:"",share:"",role:"",savings:"",contribution:""});
  const [newInv, setNewInv] = useState({name:"",amount:"",currentValue:"",sector:"",status:"Active"});

  useEffect(()=>{
    try { const s=localStorage.getItem(STORAGE_KEY); setData(s?JSON.parse(s):defaultData); }
    catch { setData(defaultData); }
  },[]);

  useEffect(()=>{
    if(!data) return;
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(data)); setSavedBadge(true); const t=setTimeout(()=>setSavedBadge(false),1800); return()=>clearTimeout(t); } catch{}
  },[data]);

  function upd(fn){ setData(prev=>{ const d=JSON.parse(JSON.stringify(prev)); fn(d); return d; }); }

  if(!auth) return <LoginScreen onLogin={(r,n)=>setAuth({role:r,name:n})} />;
  if(!data) return <div style={{color:"#C9A84C",textAlign:"center",paddingTop:"40vh",fontFamily:"Georgia,serif"}}>Loading…</div>;

  const isC = auth.role==="chairman";
  const {orgName,members,monthly,investments,cash} = data;

  const totalProfit     = monthly.reduce((s,m)=>s+Number(m.profit||0),0);
  const totalLoss       = monthly.reduce((s,m)=>s+Number(m.loss||0),0);
  const totalInvested   = investments.reduce((s,i)=>s+Number(i.amount||0),0);
  const totalCurrValue  = investments.reduce((s,i)=>s+Number(i.currentValue||0),0);
  const netBalance      = totalProfit - totalLoss;
  const totalAssets     = totalCurrValue + Number(cash||0);
  const totalShare      = members.reduce((s,m)=>s+Number(m.share||0),0);
  const totalSavings    = members.reduce((s,m)=>s+Number(m.savings||0),0);

  const iStyle = (color="#F0E6CC",w="auto")=>({background:"transparent",border:"1px solid #1A1200",borderRadius:"3px",color,padding:"5px 8px",fontSize:"13px",fontFamily:"'Georgia',serif",outline:"none",width:w});
  const aInput = {background:"#0D0D0D",border:"1px solid #2A1F00",borderRadius:"4px",color:"#F0E6CC",padding:"9px 12px",fontSize:"13px",fontFamily:"'Georgia',serif",outline:"none",width:"130px"};
  const aBtn   = {background:"linear-gradient(135deg,#2D1F00,#1A1200)",border:"1px solid #C9A84C",borderRadius:"4px",color:"#C9A84C",padding:"9px 18px",cursor:"pointer",fontSize:"11px",letterSpacing:"2px",fontFamily:"'Georgia',serif"};

  function cell(val, onChange, opts={}){
    if(!isC) return <span style={{color:opts.color||"#F0E6CC",fontSize:"13px"}}>{opts.type==="number"?fmt(val):val||"—"}</span>;
    return <input type={opts.type||"text"} value={val} onChange={onChange} style={iStyle(opts.color||"#F0E6CC",opts.w||"auto")} />;
  }
  function statusCell(val, onChange){
    if(!isC) return <span style={{padding:"3px 10px",borderRadius:"20px",fontSize:"11px",background:val==="Active"?"rgba(76,175,80,0.15)":val==="Pending"?"rgba(201,168,76,0.15)":"rgba(120,120,120,0.15)",color:val==="Active"?"#4CAF50":val==="Pending"?"#C9A84C":"#999"}}>{val}</span>;
    return <select value={val} onChange={onChange} style={{...iStyle(),cursor:"pointer"}}><option>Active</option><option>Pending</option><option>Exited</option></select>;
  }

  const thStyle = {padding:"13px 18px",textAlign:"left",fontSize:"11px",color:"#C9A84C",letterSpacing:"2px"};
  const tdStyle = {padding:"12px 18px",borderBottom:"1px solid #1A1200"};

  return (
    <div style={{minHeight:"100vh",background:"#0D0D0D",fontFamily:"'Georgia',serif",color:"#F0E6CC"}}>
      {/* ── HEADER ── */}
      <div style={{background:"linear-gradient(135deg,#1A1200,#2D1F00,#1A1200)",borderBottom:"2px solid #C9A84C",padding:"18px 36px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 4px 24px rgba(201,168,76,0.15)"}}>
        <div>
          <h1 style={{margin:0,fontSize:"18px",color:"#C9A84C",letterSpacing:"3px",textTransform:"uppercase"}}>{orgName}</h1>
          <p style={{margin:"3px 0 0",color:"#7A5C20",fontSize:"11px",letterSpacing:"4px"}}>POULTRY INVESTMENT DASHBOARD · {new Date().getFullYear()}</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          {savedBadge&&isC&&<span style={{fontSize:"11px",color:"#4CAF50"}}>✓ Saved</span>}
          <div style={{padding:"5px 12px",borderRadius:"20px",fontSize:"11px",letterSpacing:"2px",background:isC?"rgba(201,168,76,0.15)":"rgba(100,181,246,0.1)",border:`1px solid ${isC?"#C9A84C":"#64B5F6"}`,color:isC?"#C9A84C":"#64B5F6"}}>{isC?"👑 CHAIRMAN":`👤 ${auth.name.toUpperCase()}`}</div>
          <div style={{background:"rgba(201,168,76,0.1)",border:"1px solid #C9A84C",borderRadius:"4px",padding:"7px 14px",textAlign:"right"}}>
            <div style={{fontSize:"10px",color:"#7A5C20",letterSpacing:"2px"}}>TOTAL ASSETS</div>
            <div style={{fontSize:"22px",fontWeight:"bold",color:"#C9A84C"}}>{fmt(totalAssets)}</div>
          </div>
          <button onClick={()=>setAuth(null)} style={{background:"none",border:"1px solid #2A1F00",borderRadius:"4px",color:"#7A5C20",cursor:"pointer",padding:"7px 12px",fontSize:"11px",fontFamily:"'Georgia',serif"}}>⏏ EXIT</button>
        </div>
      </div>

      {!isC&&<div style={{background:"rgba(100,181,246,0.07)",borderBottom:"1px solid rgba(100,181,246,0.2)",padding:"9px 36px",fontSize:"12px",color:"#64B5F6",letterSpacing:"1px"}}>🔒 Read-only mode — only the Chairman can edit data.</div>}

      {/* ── TABS ── */}
      <div style={{display:"flex",background:"#111",padding:"0 36px",borderBottom:"1px solid #2A1F00"}}>
        {["overview","financials","investments","members","assets"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{background:tab===t?"#2D1F00":"transparent",border:"none",borderBottom:tab===t?"3px solid #C9A84C":"3px solid transparent",color:tab===t?"#C9A84C":"#7A5C20",padding:"13px 22px",cursor:"pointer",fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",fontFamily:"'Georgia',serif",transition:"all 0.2s"}}>
            {t==="overview"?"📊 Overview":t==="financials"?"💰 Financials":t==="investments"?"🐓 Investments":t==="members"?"👥 Members":"🏦 Assets"}
          </button>
        ))}
      </div>

      <div style={{padding:"28px 36px"}}>

        {/* ══ OVERVIEW ══ */}
        {tab==="overview"&&<>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"28px"}}>
            {[
              {label:"Total Assets",    value:fmt(totalAssets),    color:"#C9A84C", icon:"🏦"},
              {label:"Cash at Hand",    value:fmt(cash),           color:"#64B5F6", icon:"💵"},
              {label:"Total Profit",    value:fmt(totalProfit),    color:"#4CAF50", icon:"📈"},
              {label:"Total Loss",      value:fmt(totalLoss),      color:"#FF6B6B", icon:"📉"},
            ].map(c=>(
              <div key={c.label} style={{background:"linear-gradient(135deg,#1A1200,#0D0D0D)",border:"1px solid #2A1F00",borderRadius:"8px",padding:"18px",borderLeft:`4px solid ${c.color}`}}>
                <div style={{fontSize:"20px",marginBottom:"7px"}}>{c.icon}</div>
                <div style={{fontSize:"10px",color:"#7A5C20",letterSpacing:"2px",marginBottom:"5px"}}>{c.label.toUpperCase()}</div>
                <div style={{fontSize:"22px",fontWeight:"bold",color:c.color}}>{c.value}</div>
              </div>
            ))}
          </div>

          {/* Summary box */}
          <div style={{background:"#111",border:"1px solid #2A1F00",borderRadius:"8px",padding:"22px",marginBottom:"24px"}}>
            <h3 style={{margin:"0 0 16px",color:"#C9A84C",fontSize:"13px",letterSpacing:"2px"}}>📋 BUSINESS SUMMARY</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"20px",fontSize:"13px",lineHeight:"1.9"}}>
              <div>
                <div style={{color:"#7A5C20",fontSize:"11px",letterSpacing:"2px",marginBottom:"8px"}}>MARCH BIRDS</div>
                <div>🐓 4 birds (2 hens + 2 cocks)</div>
                <div style={{color:"#7A5C20"}}>Cost basis: <span style={{color:"#F0E6CC"}}>UGX 28,000</span></div>
                <div style={{color:"#7A5C20"}}>Current value: <span style={{color:"#4CAF50"}}>UGX 48,000</span></div>
                <div style={{color:"#4CAF50",fontWeight:"bold"}}>▲ Gain: UGX 20,000</div>
              </div>
              <div>
                <div style={{color:"#7A5C20",fontSize:"11px",letterSpacing:"2px",marginBottom:"8px"}}>APRIL BIRDS</div>
                <div>🐓 2 remaining (1 hen + 1 cock)</div>
                <div style={{color:"#7A5C20"}}>Cost: <span style={{color:"#F0E6CC"}}>UGX 30,000</span></div>
                <div style={{color:"#7A5C20"}}>Current value: <span style={{color:"#FF6B6B"}}>UGX 14,000</span></div>
                <div style={{color:"#FF6B6B"}}>☠️ 1 hen died in rain (loss: 10,000)</div>
              </div>
              <div>
                <div style={{color:"#7A5C20",fontSize:"11px",letterSpacing:"2px",marginBottom:"8px"}}>TOTALS</div>
                <div style={{color:"#7A5C20"}}>Birds value: <span style={{color:"#C9A84C"}}>UGX 62,000</span></div>
                <div style={{color:"#7A5C20"}}>Cash at hand: <span style={{color:"#C9A84C"}}>UGX 513,000</span></div>
                <div style={{color:"#7A5C20"}}>Total savings: <span style={{color:"#C9A84C"}}>{fmt(totalSavings)}</span></div>
                <div style={{color:"#C9A84C",fontWeight:"bold",fontSize:"15px",marginTop:"4px"}}>NET ASSETS: {fmt(totalAssets)}</div>
              </div>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"22px"}}>
            <div style={{background:"#111",border:"1px solid #2A1F00",borderRadius:"8px",padding:"22px"}}>
              <h3 style={{margin:"0 0 18px",color:"#C9A84C",fontSize:"13px",letterSpacing:"2px"}}>PROFIT vs LOSS BY MONTH</h3>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1200"/>
                  <XAxis dataKey="month" stroke="#7A5C20" tick={{fontSize:11}}/>
                  <YAxis stroke="#7A5C20" tick={{fontSize:11}} tickFormatter={v=>`${(v/1000).toFixed(0)}K`}/>
                  <Tooltip contentStyle={{background:"#1A1200",border:"1px solid #C9A84C",borderRadius:"4px",color:"#F0E6CC"}} formatter={v=>[fmt(v)]}/>
                  <Bar dataKey="profit" fill="#4CAF50" name="Profit" radius={[3,3,0,0]}/>
                  <Bar dataKey="loss"   fill="#FF6B6B" name="Loss"   radius={[3,3,0,0]}/>
                  <Legend wrapperStyle={{color:"#7A5C20",fontSize:"11px"}}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{background:"#111",border:"1px solid #2A1F00",borderRadius:"8px",padding:"22px"}}>
              <h3 style={{margin:"0 0 18px",color:"#C9A84C",fontSize:"13px",letterSpacing:"2px"}}>MEMBER SHAREHOLDING</h3>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie data={members.filter(m=>m.share>0)} dataKey="share" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={({share})=>`${share}%`} labelLine={false}>
                    {members.filter(m=>m.share>0).map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                  </Pie>
                  <Tooltip contentStyle={{background:"#1A1200",border:"1px solid #C9A84C",borderRadius:"4px",color:"#F0E6CC"}} formatter={(v,n)=>[`${v}%`,n]}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>}

        {/* ══ FINANCIALS ══ */}
        {tab==="financials"&&<>
          <h2 style={{color:"#C9A84C",fontSize:"14px",letterSpacing:"3px",marginBottom:"22px"}}>MONTHLY FINANCIAL DATA</h2>
          <div style={{background:"#111",border:"1px solid #2A1F00",borderRadius:"8px",overflow:"hidden",marginBottom:"28px"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{background:"#1A1200",borderBottom:"1px solid #C9A84C"}}>
                  {["Month","Profit (UGX)","Loss (UGX)","Investment (UGX)"].map(h=><th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {monthly.map((row,i)=>(
                  <tr key={i} style={{borderBottom:"1px solid #1A1200"}}>
                    <td style={{padding:"13px 18px",color:"#F0E6CC",fontWeight:"bold"}}>{row.month}</td>
                    {["profit","loss","investment"].map(f=>(
                      <td key={f} style={{padding:"9px 18px"}}>
                        {isC
                          ?<input type="number" value={row[f]||""} placeholder="0"
                              onChange={e=>upd(d=>{d.monthly[i][f]=Number(e.target.value)||0;})}
                              style={{background:"#0D0D0D",border:"1px solid #2A1F00",borderRadius:"4px",color:f==="profit"?"#4CAF50":f==="loss"?"#FF6B6B":"#C9A84C",padding:"7px 10px",fontSize:"14px",width:"130px",fontFamily:"'Georgia',serif",outline:"none"}}/>
                          :<span style={{color:f==="profit"?"#4CAF50":f==="loss"?"#FF6B6B":"#C9A84C",fontSize:"14px",fontWeight:"bold"}}>{fmt(row[f]||0)}</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
                <tr style={{background:"#1A1200",borderTop:"2px solid #C9A84C"}}>
                  <td style={{padding:"13px 18px",color:"#C9A84C",fontWeight:"bold",letterSpacing:"1px"}}>TOTALS</td>
                  <td style={{padding:"13px 18px",color:"#4CAF50",fontWeight:"bold",fontSize:"15px"}}>{fmt(totalProfit)}</td>
                  <td style={{padding:"13px 18px",color:"#FF6B6B",fontWeight:"bold",fontSize:"15px"}}>{fmt(totalLoss)}</td>
                  <td style={{padding:"13px 18px",color:"#C9A84C",fontWeight:"bold",fontSize:"15px"}}>{fmt(investments.reduce((s,i)=>s+Number(i.amount||0),0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{background:"#111",border:"1px solid #2A1F00",borderRadius:"8px",padding:"22px"}}>
            <h3 style={{margin:"0 0 18px",color:"#C9A84C",fontSize:"13px",letterSpacing:"2px"}}>MONTHLY FLOW CHART</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1200"/>
                <XAxis dataKey="month" stroke="#7A5C20" tick={{fontSize:11}}/>
                <YAxis stroke="#7A5C20" tick={{fontSize:11}} tickFormatter={v=>`${(v/1000).toFixed(0)}K`}/>
                <Tooltip contentStyle={{background:"#1A1200",border:"1px solid #C9A84C",borderRadius:"4px",color:"#F0E6CC"}} formatter={v=>[fmt(v)]}/>
                <Line type="monotone" dataKey="profit"     stroke="#4CAF50" strokeWidth={2} dot={{r:4}} name="Profit"/>
                <Line type="monotone" dataKey="loss"       stroke="#FF6B6B" strokeWidth={2} dot={{r:4}} name="Loss"/>
                <Line type="monotone" dataKey="investment" stroke="#C9A84C" strokeWidth={2} dot={{r:4}} name="Investment"/>
                <Legend wrapperStyle={{color:"#7A5C20",fontSize:"11px"}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>}

        {/* ══ INVESTMENTS ══ */}
        {tab==="investments"&&<>
          <h2 style={{color:"#C9A84C",fontSize:"14px",letterSpacing:"3px",marginBottom:"22px"}}>POULTRY INVESTMENT PORTFOLIO</h2>
          {isC&&(
            <div style={{background:"#111",border:"1px solid #2A1F00",borderRadius:"8px",padding:"18px",marginBottom:"22px",display:"flex",gap:"10px",flexWrap:"wrap",alignItems:"flex-end"}}>
              {[["BUSINESS/BIRD","name","text","e.g. New Chicks"],["COST (UGX)","amount","number","0"],["CURR. VALUE","currentValue","number","0"],["SECTOR","sector","text","Poultry"]].map(([lb,k,t,ph])=>(
                <div key={k}>
                  <div style={{fontSize:"10px",color:"#7A5C20",letterSpacing:"2px",marginBottom:"5px"}}>{lb}</div>
                  <input type={t} value={newInv[k]} placeholder={ph} onChange={e=>setNewInv(p=>({...p,[k]:e.target.value}))} style={aInput}/>
                </div>
              ))}
              <div>
                <div style={{fontSize:"10px",color:"#7A5C20",letterSpacing:"2px",marginBottom:"5px"}}>STATUS</div>
                <select value={newInv.status} onChange={e=>setNewInv(p=>({...p,status:e.target.value}))} style={{...aInput,cursor:"pointer"}}>
                  <option>Active</option><option>Pending</option><option>Exited</option>
                </select>
              </div>
              <button onClick={()=>{if(!newInv.name||!newInv.amount)return;upd(d=>{d.investments.push({...newInv,amount:Number(newInv.amount),currentValue:Number(newInv.currentValue||0)});});setNewInv({name:"",amount:"",currentValue:"",sector:"",status:"Active"});}} style={aBtn}>+ ADD</button>
            </div>
          )}
          <div style={{background:"#111",border:"1px solid #2A1F00",borderRadius:"8px",overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{background:"#1A1200",borderBottom:"1px solid #C9A84C"}}>
                  {["Investment","Sector","Cost (UGX)","Current Value","Gain/Loss","Status",...(isC?[""]:[])].map(h=><th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {investments.map((inv,i)=>{
                  const gl = Number(inv.currentValue||0)-Number(inv.amount||0);
                  return(
                    <tr key={i} style={{borderBottom:"1px solid #1A1200"}}>
                      <td style={tdStyle}>{cell(inv.name, e=>upd(d=>{d.investments[i].name=e.target.value;}),{w:"160px"})}</td>
                      <td style={tdStyle}>{cell(inv.sector, e=>upd(d=>{d.investments[i].sector=e.target.value;}),{w:"100px"})}</td>
                      <td style={tdStyle}>{isC?<input type="number" value={inv.amount} onChange={e=>upd(d=>{d.investments[i].amount=Number(e.target.value);})} style={iStyle("#C9A84C","110px")}/>:<span style={{color:"#C9A84C",fontWeight:"bold"}}>{fmt(inv.amount)}</span>}</td>
                      <td style={tdStyle}>{isC?<input type="number" value={inv.currentValue} onChange={e=>upd(d=>{d.investments[i].currentValue=Number(e.target.value);})} style={iStyle("#F0E6CC","110px")}/>:<span>{fmt(inv.currentValue)}</span>}</td>
                      <td style={tdStyle}><span style={{color:gl>=0?"#4CAF50":"#FF6B6B",fontWeight:"bold"}}>{gl>=0?"+":""}{fmt(gl)}</span></td>
                      <td style={tdStyle}>{statusCell(inv.status, e=>upd(d=>{d.investments[i].status=e.target.value;}))}</td>
                      {isC&&<td style={tdStyle}><button onClick={()=>upd(d=>{d.investments.splice(i,1);})} style={{background:"none",border:"none",color:"#FF6B6B",cursor:"pointer",fontSize:"15px"}}>✕</button></td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>}

        {/* ══ MEMBERS ══ */}
        {tab==="members"&&<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"22px"}}>
            <h2 style={{color:"#C9A84C",fontSize:"14px",letterSpacing:"3px",margin:0}}>MEMBERS & SHAREHOLDING</h2>
            {isC&&<div style={{padding:"7px 14px",background:Math.round(totalShare)===100?"rgba(76,175,80,0.1)":"rgba(255,107,107,0.1)",border:`1px solid ${Math.round(totalShare)===100?"#4CAF50":"#FF6B6B"}`,borderRadius:"4px",fontSize:"12px",color:Math.round(totalShare)===100?"#4CAF50":"#FF6B6B"}}>Total: {totalShare.toFixed(1)}% {Math.round(totalShare)===100?"✓":"(should = 100%)"}</div>}
          </div>

          {isC&&(
            <div style={{background:"#111",border:"1px solid #2A1F00",borderRadius:"8px",padding:"18px",marginBottom:"22px",display:"flex",gap:"10px",flexWrap:"wrap",alignItems:"flex-end"}}>
              {[["NAME","name","text","Full Name"],["SHARE %","share","number","0"],["ROLE","role","text","Member"],["SAVINGS","savings","number","0"],["CONTRIBUTION","contribution","number","0"]].map(([lb,k,t,ph])=>(
                <div key={k}>
                  <div style={{fontSize:"10px",color:"#7A5C20",letterSpacing:"2px",marginBottom:"5px"}}>{lb}</div>
                  <input type={t} value={newMember[k]} placeholder={ph} onChange={e=>setNewMember(p=>({...p,[k]:e.target.value}))} style={{...aInput,width:"110px"}}/>
                </div>
              ))}
              <button onClick={()=>{if(!newMember.name)return;upd(d=>{d.members.push({...newMember,share:Number(newMember.share||0),savings:Number(newMember.savings||0),contribution:Number(newMember.contribution||0)});});setNewMember({name:"",share:"",role:"",savings:"",contribution:""});}} style={aBtn}>+ ADD MEMBER</button>
            </div>
          )}

          <div style={{background:"#111",border:"1px solid #2A1F00",borderRadius:"8px",overflow:"hidden",marginBottom:"28px"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{background:"#1A1200",borderBottom:"1px solid #C9A84C"}}>
                  {["#","Name","Role","Contribution","Savings","Share %","Profit Share",...(isC?[""]:[])].map(h=><th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {members.map((m,i)=>(
                  <tr key={i} style={{borderBottom:"1px solid #1A1200",background:i===0?"rgba(201,168,76,0.04)":"transparent"}}>
                    <td style={tdStyle}><span style={{color:"#7A5C20"}}>{i+1}</span></td>
                    <td style={tdStyle}>{cell(m.name, e=>upd(d=>{d.members[i].name=e.target.value;}),{color:i===0?"#C9A84C":"#F0E6CC",w:"150px"})}</td>
                    <td style={tdStyle}>{cell(m.role, e=>upd(d=>{d.members[i].role=e.target.value;}),{w:"100px"})}</td>
                    <td style={tdStyle}>{isC?<input type="number" value={m.contribution} onChange={e=>upd(d=>{d.members[i].contribution=Number(e.target.value);})} style={iStyle("#C9A84C","100px")}/>:<span style={{color:"#C9A84C"}}>{fmt(m.contribution)}</span>}</td>
                    <td style={tdStyle}>{isC?<input type="number" value={m.savings} onChange={e=>upd(d=>{d.members[i].savings=Number(e.target.value);})} style={iStyle("#64B5F6","90px")}/>:<span style={{color:"#64B5F6"}}>{fmt(m.savings)}</span>}</td>
                    <td style={tdStyle}>
                      <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                        {isC?<input type="number" value={m.share} onChange={e=>upd(d=>{d.members[i].share=Number(e.target.value)||0;})} style={iStyle("#C9A84C","60px")}/>:<span style={{color:"#C9A84C",fontWeight:"bold"}}>{m.share}%</span>}
                        <div style={{height:"5px",borderRadius:"3px",background:"#1A1200",width:"70px",overflow:"hidden"}}>
                          <div style={{height:"100%",borderRadius:"3px",width:`${Math.min(m.share,100)}%`,background:COLORS[i%COLORS.length],transition:"width 0.3s"}}/>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}><span style={{color:"#4CAF50",fontWeight:"bold"}}>{fmt((totalProfit*m.share)/100)}</span></td>
                    {isC&&<td style={tdStyle}><button onClick={()=>upd(d=>{d.members.splice(i,1);})} style={{background:"none",border:"none",color:"#FF6B6B",cursor:"pointer",fontSize:"15px"}}>✕</button></td>}
                  </tr>
                ))}
                <tr style={{background:"#1A1200",borderTop:"2px solid #C9A84C"}}>
                  <td colSpan="3" style={{padding:"12px 18px",color:"#C9A84C",fontWeight:"bold",letterSpacing:"1px"}}>TOTALS</td>
                  <td style={{padding:"12px 18px",color:"#C9A84C",fontWeight:"bold"}}>{fmt(members.reduce((s,m)=>s+Number(m.contribution||0),0))}</td>
                  <td style={{padding:"12px 18px",color:"#64B5F6",fontWeight:"bold"}}>{fmt(totalSavings)}</td>
                  <td style={{padding:"12px 18px",color:"#C9A84C",fontWeight:"bold"}}>{totalShare.toFixed(1)}%</td>
                  <td style={{padding:"12px 18px",color:"#4CAF50",fontWeight:"bold"}}>{fmt(totalProfit)}</td>
                  {isC&&<td/>}
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{background:"#111",border:"1px solid #2A1F00",borderRadius:"8px",padding:"22px"}}>
            <h3 style={{margin:"0 0 18px",color:"#C9A84C",fontSize:"13px",letterSpacing:"2px"}}>OWNERSHIP DISTRIBUTION</h3>
            <div style={{display:"flex",alignItems:"center",gap:"28px"}}>
              <ResponsiveContainer width="50%" height={230}>
                <PieChart>
                  <Pie data={members.filter(m=>m.share>0)} dataKey="share" nameKey="name" cx="50%" cy="50%" outerRadius={95} innerRadius={45}>
                    {members.filter(m=>m.share>0).map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                  </Pie>
                  <Tooltip contentStyle={{background:"#1A1200",border:"1px solid #C9A84C",borderRadius:"4px",color:"#F0E6CC"}} formatter={(v,n)=>[`${v}%`,n]}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{flex:1}}>
                {members.map((m,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"9px"}}>
                    <div style={{width:"11px",height:"11px",borderRadius:"2px",background:m.share>0?COLORS[i%COLORS.length]:"#2A1F00",flexShrink:0}}/>
                    <span style={{flex:1,color:"#F0E6CC",fontSize:"13px"}}>{m.name}</span>
                    <span style={{color:m.share>0?COLORS[i%COLORS.length]:"#3A2A00",fontWeight:"bold",fontSize:"13px"}}>{m.share}%</span>
                    {m.share===0&&<span style={{fontSize:"11px",color:"#FF6B6B",marginLeft:"4px"}}>No contribution</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>}

        {/* ══ ASSETS ══ */}
        {tab==="assets"&&<>
          <h2 style={{color:"#C9A84C",fontSize:"14px",letterSpacing:"3px",marginBottom:"22px"}}>ASSET REGISTER</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"18px",marginBottom:"24px"}}>
            <div style={{background:"#111",border:"1px solid #2A1F00",borderRadius:"8px",padding:"22px"}}>
              <h3 style={{margin:"0 0 16px",color:"#C9A84C",fontSize:"13px",letterSpacing:"2px"}}>💵 CASH AT HAND</h3>
              {isC
                ?<><div style={{fontSize:"11px",color:"#7A5C20",letterSpacing:"2px",marginBottom:"8px"}}>CURRENT CASH (UGX)</div>
                  <input type="number" value={data.cash||0} onChange={e=>upd(d=>{d.cash=Number(e.target.value)||0;})}
                    style={{background:"#0D0D0D",border:"1px solid #C9A84C",borderRadius:"4px",color:"#64B5F6",padding:"12px 16px",fontSize:"22px",fontFamily:"'Georgia',serif",outline:"none",width:"100%",boxSizing:"border-box"}}/></>
                :<div style={{fontSize:"32px",fontWeight:"bold",color:"#64B5F6",marginTop:"8px"}}>{fmt(cash)}</div>
              }
            </div>
            <div style={{background:"#111",border:"1px solid #2A1F00",borderRadius:"8px",padding:"22px"}}>
              <h3 style={{margin:"0 0 16px",color:"#C9A84C",fontSize:"13px",letterSpacing:"2px"}}>🐓 BIRD ASSETS</h3>
              <div style={{fontSize:"13px",lineHeight:"2"}}>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#7A5C20"}}>March birds (4):</span><span style={{color:"#4CAF50",fontWeight:"bold"}}>UGX 48,000</span></div>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#7A5C20"}}>April birds (2):</span><span style={{color:"#F0E6CC"}}>UGX 14,000</span></div>
                <div style={{borderTop:"1px solid #2A1F00",marginTop:"8px",paddingTop:"8px",display:"flex",justifyContent:"space-between"}}><span style={{color:"#C9A84C",fontWeight:"bold"}}>Total Birds Value:</span><span style={{color:"#C9A84C",fontWeight:"bold",fontSize:"16px"}}>UGX 62,000</span></div>
              </div>
            </div>
          </div>
          <div style={{background:"#111",border:"1px solid #2A1F00",borderRadius:"8px",padding:"22px"}}>
            <h3 style={{margin:"0 0 16px",color:"#C9A84C",fontSize:"13px",letterSpacing:"2px"}}>📊 SAVINGS TRACKER</h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"14px"}}>
              {members.map((m,i)=>(
                <div key={i} style={{background:"#0D0D0D",border:"1px solid #2A1F00",borderRadius:"6px",padding:"14px",borderLeft:`3px solid ${m.savings>0?COLORS[i%COLORS.length]:"#2A1F00"}`}}>
                  <div style={{fontSize:"12px",color:"#7A5C20",marginBottom:"6px",letterSpacing:"1px"}}>{m.name}</div>
                  <div style={{fontSize:"20px",fontWeight:"bold",color:m.savings>0?"#64B5F6":"#3A2A00"}}>{fmt(m.savings)}</div>
                  {m.savings===0&&<div style={{fontSize:"11px",color:"#FF6B6B",marginTop:"4px"}}>No savings yet</div>}
                </div>
              ))}
            </div>
            <div style={{marginTop:"16px",padding:"14px",background:"#1A1200",borderRadius:"6px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:"#7A5C20",fontSize:"13px",letterSpacing:"1px"}}>TOTAL GROUP SAVINGS</span>
              <span style={{color:"#64B5F6",fontWeight:"bold",fontSize:"22px"}}>{fmt(totalSavings)}</span>
            </div>
          </div>
        </>}

      </div>
      <div style={{textAlign:"center",padding:"18px",color:"#2A1F00",fontSize:"11px",letterSpacing:"2px"}}>{orgName} · CONFIDENTIAL · {new Date().getFullYear()}</div>
    </div>
  );
}
