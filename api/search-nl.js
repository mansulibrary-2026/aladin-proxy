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

  const certKey = process.env.NL_CERT_KEY;
  if (!certKey) {
    res.status(500).json({ error: '서버에 NL_CERT_KEY 환경변수가 설정되지 않았어요.' });
    return;
  }

  const url = 'https://www.nl.go.kr/seoji/SearchApi.do'
    + '?cert_key=' + encodeURIComponent(certKey)
    + '&result_style=json'
    + '&page_no=1'
    + '&page_size=10'
    + '&title=' + encodeURIComponent(q);

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: '국립중앙도서관 검색에 실패했어요.', detail: String(err) });
  }
};
