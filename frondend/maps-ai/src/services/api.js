import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export const analyzeRoute = async (userInput, myLoc, transportMode) => {
  const res = await axios.post(`${API_BASE_URL}/analyze-route`, {
    user_speech: userInput,
    current_lat: myLoc.lat,
    current_long: myLoc.lng,
    transport_mode: transportMode,
  });

  let data;
  try {
    if (typeof res.data.user_intent === "string") {
      const cleanedStr = res.data.user_intent
        .replace(/```json|```/gi, "")
        .trim();
      data = JSON.parse(cleanedStr);
    } else {
      data = res.data.user_intent;
    }
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    throw e;
  }
  return data;
};
