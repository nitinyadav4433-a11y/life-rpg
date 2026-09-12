export const xpForLevel=(level:number)=>Math.floor(150*Math.pow(level,1.55));
export const rewardFor=(difficulty:string)=>difficulty==='Hard'?{xp:150,gold:35}:difficulty==='Medium'?{xp:100,gold:20}:{xp:60,gold:12};
export function applyXp(level:number,xp:number,gain:number){let nextXp=xp+gain, nextLevel=level;while(nextXp>=xpForLevel(nextLevel)){nextXp-=xpForLevel(nextLevel);nextLevel++;}return {level:nextLevel,xp:nextXp,leveledUp:nextLevel>level};}
export const attributeField=(a:string)=>({Strength:'strength',Intellect:'intellect',Vitality:'vitality',Discipline:'discipline'} as Record<string,string>)[a] || 'discipline';
