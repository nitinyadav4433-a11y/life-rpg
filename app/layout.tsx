import type {Metadata} from 'next'; import './globals.css';
export const metadata:Metadata={title:'Life RPG — Turn Life Into A Game',description:'A gamified productivity RPG with quests, XP, streaks and rewards.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
