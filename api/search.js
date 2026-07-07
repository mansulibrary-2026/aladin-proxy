// 만수여자중학교 하늘정원 도서관 - 알라딘 도서 검색 프록시
// 브라우저 대신 이 서버가 알라딘에 요청을 보내서 CORS 문제를 피합니다.

export default async function handler(req, res) {
  // 어떤 사이트에서 호출해도 응답을 받을 수 있도록 허용합니다.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const query = req.query.q;
  if (!query) {
    res.status(400).json({ error: 'q(검색어) 파라미터가 필요해요. 예: /api/search?q=아몬드' });
    return;
  }

  const ttbkey = process.env.ALADIN_TTBKEY;
  if (!ttbkey) {
    res.status(500).json({ error: '서버에 ALADIN_TTBKEY 환경변수가 설정되어 있지 않아요.' });
    return;
  }

  const url =
    'https://www.aladin.co.kr/ttb/api/ItemSearch.aspx' +
    '?ttbkey=' + encodeURIComponent(ttbkey) +
    '&Query=' + encodeURIComponent(query) +
    '&QueryType=Title&MaxResults=8&start=1&SearchTarget=Book&output=js&Version=20131101';

  try {
    const aladinRes = await fetch(url);
    const data = await aladinRes.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: '알라딘 서버 호출에 실패했어요: ' + (e && e.message ? e.message : String(e)) });
  }
}
