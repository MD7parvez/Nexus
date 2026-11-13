"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function LoginPage(){
 const router=useRouter();const [isLoading,setIsLoading]=useState(false);const [error,setError]=useState("");
 async function handleSubmit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setIsLoading(true);setError("");const form=new FormData(event.currentTarget);const response=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:String(form.get("email")??""),password:String(form.get("password")??"")})});const result=await response.json();if(!response.ok){setError(result.error??"Unable to sign in.");setIsLoading(false);return;}router.push(result.user?.role==="admin"?"/admin":"/overview");}
 return <div className="flex min-h-[80vh] items-center justify-center p-6"><Card className="w-full max-w-md border-slate-800 bg-slate-900/90"><CardHeader><CardTitle className="text-center text-2xl">NEXUS sign in</CardTitle></CardHeader><CardContent><form className="space-y-4" onSubmit={handleSubmit}>
 <div><label className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-400">Email</label><input name="email" type="email" autoComplete="username" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-50" required/></div>
 <div><label className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-400">Password</label><input name="password" type="password" autoComplete="current-password" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-50" required/></div>
 {error&&<p className="text-sm text-rose-300">{error}</p>}
 <Button type="submit" className="w-full" disabled={isLoading}>{isLoading?"Signing in...":"Sign in to NEXUS"}</Button>
 <div className="pt-2 text-center text-sm text-slate-300">Need an account? <Link href="/register" className="font-medium text-cyan-300 underline underline-offset-4">Create one</Link></div>
 </form></CardContent></Card></div>;
}
