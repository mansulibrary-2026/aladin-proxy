module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const q = req.query.q;
  if (!q) {
    res.status(400).json({ error: '검색어(q)가 필요해요.' });
    return;
  }

  const apiKey = process.env.YES24_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: '서버에 YES24_API_KEY 환경변수가 설정되지 않았어요.' });
    return;
  }

  const url = 'https://apis.yes24.com/v1/goods/itemList'
    + '?query=' + encodeURIComponent(q)
    + '&category=BOOK'
    + '&sort=DEFAULT'
    + '&page=1'
    + '&pageSize=10';

  try {
    const response = await fetch(url, { headers: { 'X-Api-Key': apiKey } });
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      res.status(502).json({ error: '예스24 응답을 읽지 못했어요.', detail: text.slice(0, 200) });
      return;
    }
    res.status(response.ok ? 200 : response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: '예스24 검색에 실패했어요.', detail: String(err) });
  }
};
