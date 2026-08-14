import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 1. Suspect Interrogation Endpoint
  app.post("/api/interrogate", async (req, res) => {
    try {
      const {
        caseData,
        suspectId,
        playerMessage,
        conversationHistory = [],
        presentedEvidence = null,
        currentMood = {},
      } = req.body;

      const suspect = caseData?.suspects?.find((s: any) => s.id === suspectId);
      if (!suspect) {
        return res.status(404).json({ error: "Suspect not found in case" });
      }

      const ai = getGeminiClient();
      if (!ai) {
        // Fallback response if no API key is present
        return res.json({
          response: `"${suspect.initialGreeting || "I have nothing further to say without my attorney."}"`,
          emotion: "defensive",
          nervousnessDelta: 5,
          opennessDelta: 0,
          revealedClueHint: null,
        });
      }

      const historyFormatted = conversationHistory
        .slice(-8)
        .map((m: any) => `${m.sender === "player" ? "Detective" : suspect.name}: ${m.text}`)
        .join("\n");

      const presentedEvidenceInfo = presentedEvidence
        ? `\n[DETECTIVE CONFRONTS YOU WITH PHYSICAL EVIDENCE]:
Item Name: ${presentedEvidence.name}
Description: ${presentedEvidence.description}
Detailed Forensics: ${presentedEvidence.detailedAnalysis}`
        : "";

      const systemInstruction = `You are roleplaying as ${suspect.name}, a character in an interactive murder mystery detective game.
CASE TITLE: ${caseData.title}
SETTING: ${caseData.setting}
VICTIM: ${caseData.victim.name} (${caseData.victim.role}), found dead at ${caseData.victim.timeOfDeath}.
CAUSE OF DEATH: ${caseData.victim.causeOfDeath}.

YOUR CHARACTER DOSSIER:
- Name: ${suspect.name}
- Age: ${suspect.age}, Role: ${suspect.role}
- Personality: ${suspect.personality}
- Voice / Speech Style: ${suspect.voiceStyle}
- Relationship to Victim: ${suspect.relationshipToVictim}
- Stated Alibi (Public Claim): ${suspect.statedAlibi}
- What You Actually Did (Private Truth): ${suspect.actualActivity}
- Your Hidden Secret: ${suspect.secret}
- Are You The Killer?: ${suspect.isGuilty ? "YES (YOU COMMITTED THE MURDER)" : "NO (YOU ARE INNOCENT OF THE MURDER)"}
- Your Motive (Real or perceived): ${suspect.motive}
- Things You Personally Know / Saw: ${JSON.stringify(suspect.privateKnowledge)}
- Your False Beliefs / Rumors you mistakenly think are true: ${JSON.stringify(suspect.falseBeliefs || [])}

BEHAVIORAL RULES:
1. Speak in first-person ("I", "me", "my"). Stay 100% in character. Never break the fourth wall, never say you are an AI or LLM.
2. CONSTRAINED KNOWLEDGE: You only know what is in your dossier and what you personally experienced or heard. You do NOT have omniscient knowledge of the case.
3. If you are GUILTY: You try to defend your alibi and redirect suspicion subtly, but if the detective corners you with definitive physical evidence (like fingerprints, murder weapon, recordings, forged files), you exhibit intense nervousness, defensiveness, stammering, or anger.
4. If you are INNOCENT but have a SECRET (e.g. theft, affair, debt, whistleblowing): You are reluctant to confess your private secret unless pressed with relevant proof, but you will vehemently deny being a murderer.
5. If the detective presents physical evidence, you MUST directly react to that specific piece of evidence in character.
6. Provide an immersive, realistic dialogue response (between 2 to 5 sentences) with organic emotional nuance.`;

      const prompt = `Current Dialogue Context:
${historyFormatted ? `Recent conversation:\n${historyFormatted}\n` : ""}
${presentedEvidenceInfo}

Detective says: "${playerMessage}"

Respond in character as ${suspect.name}. Return a valid JSON object matching the schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              response: {
                type: Type.STRING,
                description: "The spoken dialogue of the suspect, including atmospheric physical actions in asterisks if desired.",
              },
              emotion: {
                type: Type.STRING,
                description: "The primary emotional state: neutral, nervous, angry, relieved, guilty, defensive, or surprised.",
              },
              nervousnessDelta: {
                type: Type.INTEGER,
                description: "Change in suspect's nervousness level from -15 (calmer) to +25 (more flustered).",
              },
              opennessDelta: {
                type: Type.INTEGER,
                description: "Change in suspect's willingness to share details from -10 to +20.",
              },
              revealedClueHint: {
                type: Type.STRING,
                description: "A summary of any new factual admission or lead the suspect just confessed to, or null if none.",
              },
            },
            required: ["response", "emotion", "nervousnessDelta", "opennessDelta"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("Interrogation error:", err);
      res.status(500).json({
        error: "Failed to generate character response",
        details: err?.message || String(err),
      });
    }
  });

  // 2. Procedural / AI Mystery Case Generator
  app.post("/api/cases/generate", async (req, res) => {
    try {
      const { theme = "Classic 1930s Agatha Christie Country Manor", difficulty = "Intermediate" } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.status(500).json({ error: "Gemini API key is required to generate new dynamic cases." });
      }

      const prompt = `Create a completely original, intricate, highly cohesive murder mystery case for the AI Detective game.
Theme / Setting: "${theme}"
Difficulty: "${difficulty}"

REQUIREMENTS FOR A GREAT MYSTERY:
1. One victim with a clear time, cause, and location of death.
2. 4 to 5 distinct suspects with unique roles, distinct motivations, private secrets, alibis, and relationships.
3. Exactly ONE true killer with a logical, non-obvious timeline and foolproof physical + forensic trail.
4. Red herrings: Other suspects should have realistic secrets (e.g. embezzlement, secret affairs, illegal gambling, black market deals) so they act suspicious without being the killer.
5. 4 distinct locations with 2 to 3 inspectable clues each (total 8-12 clues across physical, forensic, document, and digital/audio categories).
6. A verified timeline of events leading up to the murder.
7. A complete solution breakdown with exact culprit, murder weapon, motive, method, and key clues needed to prove guilt in court.

Generate the full case JSON with all rich fields populated.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              setting: { type: Type.STRING },
              timePeriod: { type: Type.STRING },
              victim: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  age: { type: Type.INTEGER },
                  timeOfDeath: { type: Type.STRING },
                  causeOfDeath: { type: Type.STRING },
                  briefBio: { type: Type.STRING },
                  foundLocation: { type: Type.STRING },
                },
                required: ["name", "role", "age", "timeOfDeath", "causeOfDeath", "briefBio", "foundLocation"],
              },
              synopsis: { type: Type.STRING },
              suspects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    role: { type: Type.STRING },
                    age: { type: Type.INTEGER },
                    avatar: { type: Type.STRING },
                    gender: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    personality: { type: Type.STRING },
                    relationshipToVictim: { type: Type.STRING },
                    statedAlibi: { type: Type.STRING },
                    actualActivity: { type: Type.STRING },
                    secret: { type: Type.STRING },
                    isGuilty: { type: Type.BOOLEAN },
                    motive: { type: Type.STRING },
                    suspicionLevel: { type: Type.INTEGER },
                    nervousness: { type: Type.INTEGER },
                    openness: { type: Type.INTEGER },
                    privateKnowledge: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    falseBeliefs: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    initialGreeting: { type: Type.STRING },
                    voiceStyle: { type: Type.STRING },
                  },
                  required: [
                    "id",
                    "name",
                    "role",
                    "age",
                    "avatar",
                    "gender",
                    "summary",
                    "personality",
                    "relationshipToVictim",
                    "statedAlibi",
                    "actualActivity",
                    "secret",
                    "isGuilty",
                    "motive",
                    "suspicionLevel",
                    "nervousness",
                    "openness",
                    "privateKnowledge",
                    "initialGreeting",
                    "voiceStyle",
                  ],
                },
              },
              locations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    imageTheme: { type: Type.STRING },
                    clueIds: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    isCrimeScene: { type: Type.BOOLEAN },
                    searchProgress: { type: Type.INTEGER },
                  },
                  required: ["id", "name", "description", "imageTheme", "clueIds", "isCrimeScene", "searchProgress"],
                },
              },
              clues: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    locationId: { type: Type.STRING },
                    locationName: { type: Type.STRING },
                    category: { type: Type.STRING },
                    description: { type: Type.STRING },
                    detailedAnalysis: { type: Type.STRING },
                    isCrucial: { type: Type.BOOLEAN },
                    discovered: { type: Type.BOOLEAN },
                    icon: { type: Type.STRING },
                  },
                  required: [
                    "id",
                    "name",
                    "locationId",
                    "locationName",
                    "category",
                    "description",
                    "detailedAnalysis",
                    "isCrucial",
                    "discovered",
                    "icon",
                  ],
                },
              },
              timeline: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING },
                    description: { type: Type.STRING },
                    source: { type: Type.STRING },
                    verified: { type: Type.BOOLEAN },
                  },
                  required: ["time", "description", "source", "verified"],
                },
              },
              solution: {
                type: Type.OBJECT,
                properties: {
                  culpritId: { type: Type.STRING },
                  culpritName: { type: Type.STRING },
                  murderWeapon: { type: Type.STRING },
                  motive: { type: Type.STRING },
                  timelineOfCrime: { type: Type.STRING },
                  methodDescription: { type: Type.STRING },
                  keyCluesNeeded: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  confessionText: { type: Type.STRING },
                },
                required: [
                  "culpritId",
                  "culpritName",
                  "murderWeapon",
                  "motive",
                  "timelineOfCrime",
                  "methodDescription",
                  "keyCluesNeeded",
                  "confessionText",
                ],
              },
            },
            required: [
              "id",
              "title",
              "subtitle",
              "difficulty",
              "setting",
              "timePeriod",
              "victim",
              "synopsis",
              "suspects",
              "locations",
              "clues",
              "timeline",
              "solution",
            ],
          },
        },
      });

      const generatedCase = JSON.parse(response.text || "{}");
      generatedCase.isAiGenerated = true;

      // Assign portraits fallback if avatars are missing or generic
      const defaultAvatars = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
      ];
      if (Array.isArray(generatedCase.suspects)) {
        generatedCase.suspects.forEach((s: any, idx: number) => {
          if (!s.avatar || !s.avatar.startsWith("http")) {
            s.avatar = defaultAvatars[idx % defaultAvatars.length];
          }
        });
      }

      res.json(generatedCase);
    } catch (err: any) {
      console.error("Case generation error:", err);
      res.status(500).json({
        error: "Failed to generate AI case",
        details: err?.message || String(err),
      });
    }
  });

  // 3. Deduction & Accusation Evaluation Endpoint
  app.post("/api/evaluate", async (req, res) => {
    try {
      const { caseData, accusation } = req.body;
      const ai = getGeminiClient();

      const trueSolution = caseData.solution;
      const accusedSuspect = caseData.suspects.find((s: any) => s.id === accusation.accusedSuspectId);
      const isCulpritCorrect = accusation.accusedSuspectId === trueSolution.culpritId;

      if (!ai) {
        // Fallback calculation without AI
        const deductionScore = isCulpritCorrect ? 85 : 30;
        return res.json({
          isCorrectCulprit: isCulpritCorrect,
          isCorrectWeapon: true,
          isCorrectMotive: true,
          deductionScore,
          rankTitle: isCulpritCorrect ? "Senior Detective" : "Miscarriage of Justice",
          summaryFeedback: isCulpritCorrect
            ? `You successfully identified ${trueSolution.culpritName} as the true perpetrator!`
            : `Wrongful accusation! You accused ${accusedSuspect?.name || "the wrong person"}, while ${trueSolution.culpritName} got away with murder.`,
          detailedCritique: {
            culpritDeduction: isCulpritCorrect
              ? "Flawless identification of the murderer."
              : "Incorrect suspect chosen.",
            weaponMethodAnalysis: "Your breakdown of the murder weapon and delivery was evaluated against the crime scene forensics.",
            motiveAnalysis: "You analyzed the suspect's underlying motive.",
            evidenceEvaluation: "Evidence presented was reviewed against the crucial clues.",
            reasoningPraise: "Good logical synthesis of the evidence presented.",
            overlookedClues: trueSolution.keyCluesNeeded,
          },
          confessionNarrative: trueSolution.confessionText,
          fullCaseResolution: trueSolution.timelineOfCrime,
        });
      }

      const prompt = `You are the Chief Justice and Senior Forensics Board evaluating the player's final accusation in a murder mystery game.

CASE DETAILS:
Title: ${caseData.title}
Victim: ${caseData.victim.name}
Cause of Death: ${caseData.victim.causeOfDeath}

TRUE GROUND-TRUTH SOLUTION:
- Actual Culprit: ${trueSolution.culpritName} (ID: ${trueSolution.culpritId})
- Actual Murder Weapon / Method: ${trueSolution.murderWeapon}
- Actual Motive: ${trueSolution.motive}
- Actual Method Details: ${trueSolution.methodDescription}
- True Timeline of Crime: ${trueSolution.timelineOfCrime}
- Crucial Clues: ${JSON.stringify(trueSolution.keyCluesNeeded)}
- True Confession Monologue: ${trueSolution.confessionText}

PLAYER'S SUBMITTED ACCUSATION:
- Accused Suspect: ${accusedSuspect?.name || "Unknown"} (ID: ${accusation.accusedSuspectId})
- Submitted Weapon / Method: "${accusation.murderWeapon}"
- Submitted Motive: "${accusation.motive}"
- Selected Supporting Evidence IDs: ${JSON.stringify(accusation.selectedEvidenceIds || [])}
- Detective's Written Closing Argument & Reasoning:
"${accusation.reasoning}"

TASK:
1. Rigorously evaluate the player's deduction.
2. Determine:
   - isCorrectCulprit (boolean)
   - isCorrectWeapon (boolean - did they accurately identify the weapon/delivery mechanism?)
   - isCorrectMotive (boolean - did they understand why the murder occurred?)
   - deductionScore (integer from 0 to 100 based on accuracy, logic, evidence links, and reasoning depth)
   - rankTitle:
     - 95-100: "Grand Master Sleuth"
     - 85-94: "Chief Inspector"
     - 70-84: "Senior Detective"
     - 50-69: "Field Investigator"
     - < 50: "Miscarriage of Justice (Wrongful Arrest)"
3. Write a sharp, atmospheric, engaging summary and detailed critique.
4. Include the dramatic confession monologue and the full resolution of the case.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isCorrectCulprit: { type: Type.BOOLEAN },
              isCorrectWeapon: { type: Type.BOOLEAN },
              isCorrectMotive: { type: Type.BOOLEAN },
              deductionScore: { type: Type.INTEGER },
              rankTitle: { type: Type.STRING },
              summaryFeedback: { type: Type.STRING },
              detailedCritique: {
                type: Type.OBJECT,
                properties: {
                  culpritDeduction: { type: Type.STRING },
                  weaponMethodAnalysis: { type: Type.STRING },
                  motiveAnalysis: { type: Type.STRING },
                  evidenceEvaluation: { type: Type.STRING },
                  reasoningPraise: { type: Type.STRING },
                  overlookedClues: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: [
                  "culpritDeduction",
                  "weaponMethodAnalysis",
                  "motiveAnalysis",
                  "evidenceEvaluation",
                  "reasoningPraise",
                  "overlookedClues",
                ],
              },
              confessionNarrative: { type: Type.STRING },
              fullCaseResolution: { type: Type.STRING },
            },
            required: [
              "isCorrectCulprit",
              "isCorrectWeapon",
              "isCorrectMotive",
              "deductionScore",
              "rankTitle",
              "summaryFeedback",
              "detailedCritique",
              "confessionNarrative",
              "fullCaseResolution",
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("Evaluation error:", err);
      res.status(500).json({
        error: "Failed to evaluate accusation",
        details: err?.message || String(err),
      });
    }
  });

  // 4. Detective Hint / Forensics Dispatch
  app.post("/api/hint", async (req, res) => {
    try {
      const { caseData, discoveredClueIds = [], chatCount = 0 } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          hint: "Examine the crime scene thoroughly and check access logs or timestamps for contradictions.",
        });
      }

      const prompt = `You are Police Chief Dispatch giving a subtle, atmospheric investigative tip to the detective without giving away the murderer directly.
CASE: ${caseData.title}
Discovered Clues: ${discoveredClueIds.length} out of ${caseData.clues.length}
Interrogations conducted: ${chatCount}
Solution Culprit: ${caseData.solution.culpritName}

Give a 2-sentence mysterious yet helpful pointer on what area, document, or suspect relationship the detective should look into next.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
      });

      res.json({ hint: response.text?.trim() || "Review the timeline of events for discrepancies." });
    } catch (err: any) {
      res.json({ hint: "Cross-reference the suspects' claimed alibis with physical evidence logs." });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Detective server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
