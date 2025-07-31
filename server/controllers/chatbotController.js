const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require("mongoose");
const Announcement = require("../models/Announcement");
const Event = require("../models/Event");
const Comment = require("../models/Comment");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });




// Step 1: Smarter classifier
async function classifyQuery(userQuery) {
  const prompt = `
Classify this user query into one of the following categories:
- "events"
- "announcements"
- "comments"
- "general"

Query: "${userQuery}"

Only return one of the above words.
  `;

  try {
    const raw = await model.generateContent(prompt);
    const res = (await raw.response.text()).trim().toLowerCase();
    return ["events", "announcements", "comments"].includes(res) ? res : "general";
  } catch {
    return "general";
  }
}

// Step 2: Handle chatbot logic
exports.handleChat = async (req, res) => {
  const { userQuery } = req.body;
  if (!userQuery) return res.status(400).json({ message: "Missing query" });

  try {
    const queryType = await classifyQuery(userQuery);
    let context = "";
    let data = [];

    if (queryType === "events") {
      data = await Event.find({});
      context = data.map(e => {
  const winners = e.winners && e.winners.length > 0
    ? e.winners.map(w =>
        `• ${w.position} - ${w.branch} (${w.points} pts)` +
        (w.playerOfTheMatch ? ` | Player of the Match: ${w.playerOfTheMatch}` : "")
      ).join("\n")
    : "No winners declared yet.";

  return `🟢 Event Name: ${e.name}
📄 Description: ${e.description}
🎮 Game Type: ${e.gameType}
👥 Category: ${e.category}
🏅 Event Type: ${e.eventType}
📍 Venue: ${e.venue}
📆 Date: ${new Date(e.day).toDateString()}
⏰ Time: ${e.time}
🏳️ Branch Tags: ${e.branchTags.join(', ')}
📊 Points: 1st - ${e.points.first}, 2nd - ${e.points.second}, 3rd - ${e.points.third}
📌 Status: ${e.status}
🏆 Winners:
${winners}
`;
}).join("\n\n");

    } else if (queryType === "announcements") {
      data = await Announcement.find({});
      context = data.map(a => {
  return `📢 Title: ${a.title}
📝 Body: ${a.body}

📅 Created At: ${new Date(a.createdAt).toLocaleString()}
🕒 Updated At: ${new Date(a.updatedAt).toLocaleString()}`;
}).join("\n\n");
    } else if (queryType === "comments") {
      data = await Comment.find({});
      context = data.map(c => 
        `Comment: ${c.content}`
      ).join("\n\n");
    }

    if (queryType !== "general") {
      const prompt = `
You are Urjaa Bot, a helpful assistant for a college sports fest.
Answer the following query using the context below.

Query: "${userQuery}"

Context:
${context}

Guidelines:
- Respond in 3–6 bullet points
- Start each bullet with the Unicode bullet "•"
- Each bullet should be on a new line
- Only use facts from the context
- Keep formatting clean and user-friendly

Your answer:
      `;

      const genRes = await model.generateContent(prompt);
      const summary = await genRes.response.text();

      return res.json({
        type: queryType,
        summary,
        data,
      });
    }

    // General fallback
    const prompt = `
You are Urjaa Bot – a helpful assistant for a college sports fest.
Answer the user's query in a helpful, concise, and friendly way.

Query: "${userQuery}"

Guidelines:
- Respond in 3–6 bullet points
- Start each bullet with the Unicode bullet "•"
- Each bullet should be on a new line
- Only use facts from the context
- Keep formatting clean and user-friendly
    `;

    const genRes = await model.generateContent(prompt);
    const summary = await genRes.response.text();

    return res.json({ type: "general", summary });

  } catch (err) {
    console.error("Chatbot Error:", err.message);
    res.status(500).json({ message: "Internal chatbot error." });
  }
};
