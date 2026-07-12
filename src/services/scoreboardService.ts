export function getLiveScoreboardUrl(eventGuid: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return `${baseUrl}/padel/event/${eventGuid}/scoreboard/live`;
}
