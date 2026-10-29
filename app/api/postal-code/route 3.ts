import { NextResponse, type NextRequest } from 'next/server';

/**
 * 郵便番号 → 都道府県・市区町村（ドラテク求職者LPの STEP5 で使う）。
 * 日本郵便のデータを元にした zipcloud（無料・キー不要）をサーバー側から引く。
 * ブラウザから直接呼ばないのは、CORS と外部サービス停止時の扱いをここで吸収するため。
 * 見つからない・取得できないときは 404 / 502 を返し、画面側は都道府県の手選択に切り替える。
 */
export async function GET(req: NextRequest) {
  const code = (req.nextUrl.searchParams.get('code') ?? '').replace(/[^\d]/g, '');
  if (!/^\d{7}$/.test(code)) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  try {
    const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code}`, {
      next: { revalidate: 60 * 60 * 24 * 30 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return NextResponse.json({ error: 'unavailable' }, { status: 502 });
    const data = (await res.json()) as { results?: { address1: string; address2: string }[] | null };
    const hit = data.results?.[0];
    if (!hit) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json(
      { prefecture: hit.address1, city: hit.address2 },
      { headers: { 'Cache-Control': 'public, max-age=86400' } },
    );
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 502 });
  }
}
