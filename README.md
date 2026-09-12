# LIFE RPG

A full-stack gamified productivity RPG. Turn real-world tasks into quests, earn XP and Gold, build streaks, improve attributes, and unlock cosmetic rewards.

## Stack
- Next.js + TypeScript
- Tailwind-style custom CSS UI
- PostgreSQL + Prisma
- Secure HTTP-only JWT session cookie
- Framer Motion

## Local setup
1. Install Node.js 20+.
2. Create a PostgreSQL database.
3. Copy `.env.example` to `.env` and set `DATABASE_URL` and a strong `AUTH_SECRET`.
4. Run `npm install`.
5. Run `npx prisma generate` and `npx prisma db push`.
6. Run `npm run dev` and open http://localhost:3000.

## Security model
The browser never directly writes XP, Gold, Level, or attributes. Quest completion is authenticated, ownership-checked, and calculated server-side in a database transaction. Passwords are bcrypt-hashed and the session is stored in an HTTP-only cookie.

## Production
Set the production `DATABASE_URL` and `AUTH_SECRET`, run `npx prisma db push`, then `npm run build` and `npm start` (or deploy to a Next.js-compatible host).
