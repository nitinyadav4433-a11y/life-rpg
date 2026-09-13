import {NextResponse} from 'next/server';
import {getUserId} from '@/lib/auth';
import {db} from '@/lib/db';

const allowed = new Set(['ember', 'focus', 'moonlit']);

export async function POST(
  _: Request,
  {params}: {params: Promise<{itemKey: string}>}
) {
  const uid = await getUserId();
  if (!uid) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

  const {itemKey} = await params;
  if (!allowed.has(itemKey)) {
    return NextResponse.json({error: 'Item not found.'}, {status: 404});
  }

  const owned = await db.inventoryItem.findUnique({
    where: {userId_itemKey: {userId: uid, itemKey}},
  });

  if (!owned || owned.quantity < 1) {
    return NextResponse.json({error: 'Buy this item first.'}, {status: 400});
  }

  const character = await db.character.update({
    where: {userId: uid},
    data: {equippedItemKey: itemKey},
    select: {equippedItemKey: true},
  });

  return NextResponse.json({equippedItemKey: character.equippedItemKey});
}
