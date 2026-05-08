export const generateChatResponse = async (question, contextData) => {
  const lower = question.toLowerCase();

  const { issData, astronauts, news } = contextData;

  // Correct ISS fields
  const latitude = issData?.lat;
  const longitude = issData?.lng;
  const speed = issData?.speed;

  // ISS location
  if (
    lower.includes("iss") ||
    lower.includes("location") ||
    lower.includes("latitude") ||
    lower.includes("longitude") ||
    lower.includes("where")
  ) {
    return `The ISS is currently at latitude ${latitude} and longitude ${longitude}.`;
  }

  // ISS speed
  if (
    lower.includes("speed") ||
    lower.includes("fast")
  ) {
    return `The ISS is currently traveling at approximately ${Math.round(
      speed
    )} km/h.`;
  }

  // Astronauts
  if (
    lower.includes("astronaut") ||
    lower.includes("people in space") ||
    lower.includes("crew")
  ) {
    if (!astronauts || astronauts.length === 0) {
      return "I could not retrieve astronaut data right now.";
    }

    return `There are ${
      astronauts.length
    } astronauts currently in space: ${astronauts
      .map((a) => a.name)
      .join(", ")}.`;
  }

  // News
  if (
    lower.includes("news") ||
    lower.includes("article") ||
    lower.includes("space news")
  ) {
    if (!news || news.length === 0) {
      return "No recent space news is available right now.";
    }

    return `Recent space news includes: ${news
      .slice(0, 3)
      .map((n) => n.title)
      .join(" | ")}`;
  }

  // Default response
  return "I can only answer questions related to ISS tracking and dashboard news.";
};