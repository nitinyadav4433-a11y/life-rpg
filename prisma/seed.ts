import {PrismaClient} from '@prisma/client';
const db=new PrismaClient();
async function main(){for(const b of [{key:'first_quest',name:'First Blood',description:'Complete your first quest.'},{key:'streak_7',name:'Seven Days Strong',description:'Maintain a 7-day activity streak.'},{key:'level_10',name:'Veteran',description:'Reach level 10.'}])await db.badge.upsert({where:{key:b.key},create:b,update:b})}
main().finally(()=>db.$disconnect());
