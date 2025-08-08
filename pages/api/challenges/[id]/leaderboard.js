import { getChallenge } from "../../../../lib/memory";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const { id } = req.query;
  const challenge = getChallenge(id);
  if (!challenge) return res.status(404).json({ error: "Challenge introuvable" });

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const url = new URL(`https://www.strava.com/api/v3/segments/${challenge.segmentId}/leaderboard`);
  url.searchParams.set("date_range", challenge.dateRange);
  url.searchParams.set("per_page", "50");

  const headers = {};
  if (token?.accessToken) headers["Authorization"] = `Bearer ${token.accessToken}`;

  const r = await fetch(url.toString(), { headers });
  const data = await r.json();
  if (!r.ok) return res.status(r.status).json(data);

  const entries = (data.entries || []).map((e) => ({
    rank: e.rank,
    athleteName: e.athlete_name,
    elapsedTime: e.elapsed_time,
    activityId: e.activity_id,
    effortId: e.effort_id,
    date: e.start_date_local,
  }));

  return res.status(200).json({ challenge, entries });
}
