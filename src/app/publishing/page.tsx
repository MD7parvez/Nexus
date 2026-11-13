"use client";
import { useEffect, useState } from "react";

type Account={id:string;platform:"Facebook"|"X";label:string;url:string};
type Draft={id:string;accountId:string;text:string;status:"Draft"|"Approved for review"|"Published";createdAt:string};
const disclosure="RESEARCH ACCOUNT — This account shares clearly labelled research updates. Content is informational; verify claims against linked sources.";
const field="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-100 outline-none focus:border-cyan-500";
const button="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 hover:border-cyan-500/60 disabled:cursor-not-allowed disabled:opacity-40";
const panel="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 md:p-6";

export default function PublishingPage(){
 const [accounts,setAccounts]=useState<Account[]>([]);
 const [drafts,setDrafts]=useState<Draft[]>([]);
 const [platform,setPlatform]=useState<Account["platform"]>("Facebook");
 const [label,setLabel]=useState("NEXUS Research");
 const [url,setUrl]=useState("");
 const [accountId,setAccountId]=useState("");
 const [text,setText]=useState(disclosure+"\n\n");
 const [notice,setNotice]=useState("");
 const [publishReady,setPublishReady]=useState(false);
 const [facebookPageUrl,setFacebookPageUrl]=useState("");
 const [showAccountForm,setShowAccountForm]=useState(false);

 useEffect(()=>{
  try{
   setAccounts(JSON.parse(localStorage.getItem("nexus-research-accounts-v1")||"[]"));
   setDrafts(JSON.parse(localStorage.getItem("nexus-research-drafts-v1")||"[]"));
  }catch{setNotice("Could not read saved browser data.");}
  fetch("/api/social/status",{cache:"no-store"}).then(r=>r.json()).then(s=>{setPublishReady(Boolean(s.livePublishingReady));setFacebookPageUrl(s.facebook?.profileUrl||"");}).catch(()=>setPublishReady(false));
 },[]);
 useEffect(()=>{localStorage.setItem("nexus-research-accounts-v1",JSON.stringify(accounts));},[accounts]);
 useEffect(()=>{localStorage.setItem("nexus-research-drafts-v1",JSON.stringify(drafts));},[drafts]);

 function addAccount(){
  let host="";try{host=new URL(url).hostname.toLowerCase();}catch{}
  const allowed=platform==="Facebook"?["facebook.com","www.facebook.com"]:["x.com","www.x.com","twitter.com"];
  if(accounts.length>=5){setNotice("You can add up to five account profiles.");return;}
  if(!label.trim()||!url.startsWith("https://")||!allowed.includes(host)){setNotice("Enter an account name and a valid public HTTPS Facebook or X profile URL.");return;}
  if(accounts.some(a=>a.url===url)){setNotice("This profile is already on the list.");return;}
  setAccounts([...accounts,{id:crypto.randomUUID(),platform,label:label.trim(),url}]);
  setUrl("");setShowAccountForm(false);
  setNotice("Profile added on this browser. It is not connected or authenticated.");
 }
 function saveDraft(){
  if(!accountId){setNotice("Choose where this draft is intended to appear.");return;}
  if(!text.trim()||text.length>5000){setNotice("Post text must be between 1 and 5,000 characters.");return;}
  if(!text.includes(disclosure)){setNotice("Keep the full research disclosure in every post.");return;}
  setDrafts([{id:crypto.randomUUID(),accountId,text,status:"Draft",createdAt:new Date().toISOString()},...drafts]);
  setNotice("Draft saved on this browser. Nothing was published.");
 }
 function markReviewed(id:string){
  setDrafts(drafts.map(d=>d.id===id?{...d,status:"Approved for review"}:d));
  setNotice("Review note saved locally. This is not secure publishing authorization.");
 }
 async function publishDraft(d:Draft){
  const a=accounts.find(x=>x.id===d.accountId);
  if(!publishReady||!a||a.platform!=="Facebook"||a.url!==facebookPageUrl){setNotice("This draft is not linked to the authorized Facebook Page.");return;}
  const message=d.text.replace(disclosure,"").trim();
  if(!message){setNotice("Add your update after the disclosure text.");return;}
  if(!window.confirm("Publish this one post to the configured Facebook Page? The research disclosure will be appended automatically."))return;
  try{
   const r=await fetch("/api/social/publish",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({requestId:crypto.randomUUID(),message,confirmPublish:true})});
   const data=await r.json();
   if(data.published){setDrafts(current=>current.map(x=>x.id===d.id?{...x,status:"Published"}:x));setNotice(data.auditUpdatePending?"Facebook accepted the post, but its audit update is pending. Do not retry.":"Post published. Audit record saved.");}
   else setNotice(data.error||"Publishing failed. Check the audit record before trying again.");
  }catch{setNotice("Network error. Check the audit record before retrying; do not send it again immediately.");}
 }

 return <main className="mx-auto max-w-5xl space-y-5">
  <header className="space-y-2">
   <p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan-300">Communications</p>
   <div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-2xl font-semibold text-white md:text-3xl">Research publishing</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Create a clearly labelled research update, review it, and publish only when an authorized Page is configured.</p></div><span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300">{accounts.length} of 5 profiles</span></div>
  </header>

  <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
   <h2 className="text-sm font-semibold text-amber-100">Publishing status</h2>
   <p className="mt-1 text-sm leading-6 text-amber-100/80">{publishReady?"The server reports that Facebook Page publishing is configured. Each post still needs your confirmation.":"Live publishing is currently locked. You can still add profiles and prepare drafts. An authorized organization administrator must complete the Facebook Page and audit setup."}</p>
   <p className="mt-2 text-xs text-amber-100/70">X live publishing is not available. Only one Facebook Page post can be sent at a time.</p>
  </section>

  <section className={panel}>
   <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-bold text-cyan-200">1</span><div><h2 className="font-semibold text-white">Choose an account</h2><p className="text-xs text-slate-400">Add the public profile or Page you manage.</p></div></div>
   {accounts.length===0?<div className="mt-4 rounded-xl border border-dashed border-slate-700 p-5 text-center"><p className="text-sm text-slate-300">No account profiles added yet.</p><p className="mt-1 text-xs text-slate-500">You can save profiles here; this does not connect your social account.</p></div>:<ul className="mt-4 grid gap-2 sm:grid-cols-2">{accounts.map(a=><li key={a.id} className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3"><div className="min-w-0"><p className="truncate text-sm font-medium text-white">{a.label}</p><p className="text-xs text-slate-400">{a.platform}</p><a href={a.url} target="_blank" rel="noreferrer" className="block truncate text-xs text-cyan-300 underline">{a.url}</a></div><button className={button} onClick={()=>{setAccounts(accounts.filter(x=>x.id!==a.id));setDrafts(drafts.filter(d=>d.accountId!==a.id));}}>Remove</button></li>)}</ul>}
   {showAccountForm?<div className="mt-4 grid gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:grid-cols-2">
    <label className="text-xs text-slate-300">Platform<select className={field} value={platform} onChange={e=>setPlatform(e.target.value as Account["platform"])}><option>Facebook</option><option>X</option></select></label>
    <label className="text-xs text-slate-300">Display name<input className={field} value={label} onChange={e=>setLabel(e.target.value)} maxLength={80} placeholder="e.g. NEXUS Research"/></label>
    <label className="text-xs text-slate-300 sm:col-span-2">Public profile URL<input className={field} value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://www.facebook.com/your-page"/></label>
    <div className="flex flex-wrap gap-2 sm:col-span-2"><button className="rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-40" disabled={accounts.length>=5} onClick={addAccount}>Save profile</button><button className={button} onClick={()=>setShowAccountForm(false)}>Cancel</button></div>
   </div>:<button className="mt-4 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/20" disabled={accounts.length>=5} onClick={()=>setShowAccountForm(true)}>+ Add an account</button>}
   <details className="mt-4 text-sm text-slate-400"><summary className="cursor-pointer text-cyan-200">Help: What is an account profile?</summary><p className="mt-2 leading-6">It is a saved label and public URL for an account your organization manages. Adding it does not sign in, connect to, or prove ownership of that account. Never paste an access token here.</p></details>
  </section>

  <section className={panel}>
   <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-bold text-cyan-200">2</span><div><h2 className="font-semibold text-white">Write your update</h2><p className="text-xs text-slate-400">Choose a destination and keep the research notice visible.</p></div></div>
   <label className="mt-4 block text-xs text-slate-300">Publish destination<select className={field} value={accountId} onChange={e=>setAccountId(e.target.value)}><option value="">Select an account</option>{accounts.map(a=><option key={a.id} value={a.id}>{a.label} — {a.platform}</option>)}</select></label>
   <label className="mt-4 block text-xs text-slate-300">Post content<textarea className={field+" min-h-44 resize-y"} value={text} onChange={e=>setText(e.target.value)} maxLength={5000}/></label>
   <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3"><p className="text-xs font-semibold text-cyan-200">Required research disclosure</p><p className="mt-1 text-xs leading-5 text-slate-300">{disclosure}</p></div>
   <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-slate-500">{text.length}/5,000 characters</span><button className="rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-40" disabled={!accounts.length||!accountId} onClick={saveDraft}>Save draft</button></div>
   <details className="mt-4 text-sm text-slate-400"><summary className="cursor-pointer text-cyan-200">Help: What happens when I save?</summary><p className="mt-2 leading-6">The draft is stored in this browser only. Saving does not publish anything or send data to Facebook or X. You can review or delete it below.</p></details>
  </section>

  <section className={panel}>
   <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-bold text-cyan-200">3</span><div><h2 className="font-semibold text-white">Review and manage drafts</h2><p className="text-xs text-slate-400">Check the wording and source links before any publication.</p></div></div><span className="text-xs text-slate-500">{drafts.length} saved</span></div>
   {drafts.length===0?<div className="mt-4 rounded-xl border border-dashed border-slate-700 p-6 text-center"><p className="text-sm text-slate-300">Your saved drafts will appear here.</p><p className="mt-1 text-xs text-slate-500">Start by selecting an account and saving an update above.</p></div>:<ul className="mt-4 space-y-3">{drafts.map(d=>{const a=accounts.find(x=>x.id===d.accountId);return <li key={d.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-sm font-semibold text-white">{a?.label||"Removed account"}</p><p className="mt-1 text-xs text-slate-500">{new Date(d.createdAt).toLocaleString()}</p></div><span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-300">{d.status}</span></div><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">{d.text}</p><div className="mt-4 flex flex-wrap gap-2"><button className={button} disabled={d.status!=="Draft"} onClick={()=>markReviewed(d.id)}>Mark reviewed</button>{publishReady&&a?.platform==="Facebook"&&a.url===facebookPageUrl&&d.status!=="Published"&&<button className="rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950" onClick={()=>publishDraft(d)}>Publish this post</button>}<button className={button} disabled={d.status==="Published"} onClick={()=>setDrafts(drafts.filter(x=>x.id!==d.id))}>Delete draft</button></div></li>;})}</ul>}
   <details className="mt-4 text-sm text-slate-400"><summary className="cursor-pointer text-cyan-200">Help: What does “Mark reviewed” mean?</summary><p className="mt-2 leading-6">It adds a local review label in this browser. It is not a secure approval and does not unlock publishing. A live post still requires server-side authorization and a separate confirmation.</p></details>
  </section>

  {notice&&<p role="status" aria-live="polite" className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3 text-sm text-cyan-100">{notice}</p>}
  <p className="text-xs leading-5 text-slate-500">Account labels and drafts are stored in this browser. Do not save passwords or access tokens here. Live publishing remains subject to platform authorization, adult organization administration, and server-side audit controls.</p>
 </main>;
}
