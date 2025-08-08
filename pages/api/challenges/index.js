import { listChallenges, createChallenge } from "../../../lib/memory";
import { extractSegmentIdFromUrl, slugify } from "../../../lib/segment";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(listChallenges());
  }

  if (req.method === "POST") {
    const { segmentUrl, title, prize, dateRange } = req.body || {};
    if (!segmentUrl || !prize || !dateRange) {
      return res.status(400).json({ error: "segmentUrl, prize, dateRange requis" });
    }
    const segmentId = extractSegmentIdFromUrl(segmentUrl);
    if (!segmentId) return res.status(400).json({ error: "URL de segment invalide" });

    const idBase = slugify(title || `challenge-${segmentId}`) || `challenge-${segmentId}`;
    let id = idBase;
    let i = 1;
    while (listChallenges().some((c) => c.id === id)) id = `${idBase}-${i++}`;

    const challenge = createChallenge({
      id, segmentId, segmentUrl, title: title || `Challenge ${segmentId}`, prize, dateRange,
    });

    return res.status(201).json(challenge);
  }

  return res.status(405).json({ error: "Méthode non autorisée" });
}
