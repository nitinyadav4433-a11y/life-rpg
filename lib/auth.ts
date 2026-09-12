import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-only-change-me-life-rpg');
const COOKIE='life_rpg_session';
export async function signSession(userId:string){return new SignJWT({userId}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('7d').sign(secret)}
export async function setSession(userId:string){const token=await signSession(userId); (await cookies()).set(COOKIE,token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*7})}
export async function clearSession(){(await cookies()).set(COOKIE,'',{httpOnly:true,expires:new Date(0),path:'/'})}
export async function getUserId(){const token=(await cookies()).get(COOKIE)?.value;if(!token)return null;try{const {payload}=await jwtVerify(token,secret);return typeof payload.userId==='string'?payload.userId:null}catch{return null}}
