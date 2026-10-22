const allowedUniverses = new Set(['6136926393', '10630513390', '9544855325']);

export default async function handler(request, response) {
  const ids = String(request.query?.universeIds || '')
    .split(',')
    .filter((id) => allowedUniverses.has(id));

  if (!ids.length) {
    return response.status(400).json({ data: [], error: 'No valid universe IDs supplied.' });
  }

  try {
    const upstream = await fetch(`https://games.roblox.com/v1/games?universeIds=${ids.join(',')}`);
    if (!upstream.ok) throw new Error(`Roblox returned ${upstream.status}`);
    const payload = await upstream.json();
    response.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    return response.status(200).json(payload);
  } catch {
    return response.status(502).json({ data: [], error: 'Roblox statistics are temporarily unavailable.' });
  }
}
