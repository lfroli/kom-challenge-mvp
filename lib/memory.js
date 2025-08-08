// Simple in-memory store (resets on server restart)
const state = {
  challenges: [],
};

export function listChallenges() {
  return state.challenges;
}

export function getChallenge(id) {
  return state.challenges.find((c) => c.id === id) || null;
}

export function createChallenge({ id, segmentId, segmentUrl, title, prize, dateRange }) {
  const challenge = {
    id, segmentId, segmentUrl, title, prize, dateRange,
    createdAt: new Date().toISOString(),
  };
  state.challenges.push(challenge);
  return challenge;
}
