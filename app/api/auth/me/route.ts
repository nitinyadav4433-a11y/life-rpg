import {NextResponse} from 'next/server'; import {getUserId} from '@/lib/auth'; import {db} from '@/lib/db';
export async function GET(){const id=await getUserId();if(!id)return NextResponse.json({user:null});const user=await db.user.findUnique({where:{id},select:{id:true,username:true,email:true,character:true}});return NextResponse.json({user})}
