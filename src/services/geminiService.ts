import { GoogleGenAI, Type } from "@google/genai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface DashboardData {
  book_target: string;
  daily_goal: string;
  daily_motivation: string;
}

export interface VocabularyCard {
  word: string;
  phonetic: string;
  core_meaning: string;
  logical_analysis: string;
  academic_context: string;
  translation: string;
}

export interface DailyLearningPlan {
  learning_dashboard: DashboardData;
  vocabulary_cards: VocabularyCard[];
}

export async function getTutorResponse(userInput: string, character: any, context: any, history: {role: string, content: string}[]): Promise<any> {
  const historyText = history.map(h => `${h.role === 'user' ? 'User' : character.name}: ${h.content}`).join('\n');
  const prompt = `You are ${character.name}. 
Background: ${character.background}
Personality: ${character.personality}
Speech Style: ${character.speechStyle}

Current User Learning Context:
- Scenario: ${context.scenario}
- User Level: ${context.userLevel}
- Native Language: ${context.nativeLanguage}
- Focus Areas: ${JSON.stringify(context.focusAreas)}

Recent Chat History:
${historyText}

User says: "${userInput}"

Please provide a helpful reply in character, AND professional feedback on the user's English (grammar, phrasing).
Return a JSON object with this structure:
{
  "feedback": {
    "has_error": boolean,
    "grammar_correction": "A friendly explanation in ${context.nativeLanguage} with the correct form",
    "native_polishing": "A more natural/native way to say it in English"
  },
  "roleplay_reply": {
    "character_name": "${character.name}",
    "reply_text": "Character's response in English",
    "native_translation": "Translation of the reply into ${context.nativeLanguage}",
    "motivation_msg": "A short encouraging word"
  },
  "vocabulary": [
    {
      "word": "word",
      "meaning": "meaning in ${context.nativeLanguage}",
      "phonetic": "phonetic",
      "context_usage": "how it was used in this conversation"
    }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedback: {
              type: Type.OBJECT,
              properties: {
                has_error: { type: Type.BOOLEAN },
                grammar_correction: { type: Type.STRING },
                native_polishing: { type: Type.STRING },
              },
              required: ["has_error", "grammar_correction", "native_polishing"],
            },
            roleplay_reply: {
              type: Type.OBJECT,
              properties: {
                character_name: { type: Type.STRING },
                reply_text: { type: Type.STRING },
                native_translation: { type: Type.STRING },
                motivation_msg: { type: Type.STRING },
              },
              required: ["character_name", "reply_text", "native_translation", "motivation_msg"],
            },
            vocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                  phonetic: { type: Type.STRING },
                  context_usage: { type: Type.STRING },
                },
                required: ["word", "meaning", "phonetic", "context_usage"],
              },
            },
          },
          required: ["feedback", "roleplay_reply", "vocabulary"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response from Gemini");
  } catch (error) {
    console.error("Error getting tutor response:", error);
    throw error;
  }
}

export async function generateDailyPlan(bookName: string, dailyQuota: number, wordList: string[]): Promise<DailyLearningPlan | null> {
  const prompt = `你是一个智能英语学习规划引擎与学术英语导师。
请读取以下用户的当前学习状态参数：
- 当前选择词书：${bookName}
- 每日计划背诵量：${dailyQuota} 词/天
- 今日需要解析的单词列表：${wordList.join(', ')}

请严格根据上述输入参数，生成今日的学习看板及单词解析。
你必须且只能返回一个合法的 JSON 数据，不要包含任何额外的解释文本或 Markdown 代码块标记。

JSON 结构必须严格如下：
{
  "learning_dashboard": {
    "book_target": "重复用户选择的词书名称",
    "daily_goal": "重复每日计划背诵量",
    "daily_motivation": "结合该词书的最终应用场景（如海外学术深造、科研论文阅读等），生成一句简短的今日打气标语"
  },
  "vocabulary_cards": [
    {
      "word": "单词本身",
      "phonetic": "音标",
      "core_meaning": "最核心的词性与中文释义",
      "logical_analysis": "词源与词根词缀的逻辑推导。请像拆解底层逻辑一样，步步推导词义的演变规律，必须逻辑严密，拒绝牵强的谐音记忆。",
      "academic_context": "构造一个该单词的实际应用例句。请优先采用电子信息、光电材料、控制算法或实验室科研场景的英文语境。",
      "translation": "例句的精准中文翻译"
    }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            learning_dashboard: {
              type: Type.OBJECT,
              properties: {
                book_target: { type: Type.STRING },
                daily_goal: { type: Type.STRING },
                daily_motivation: { type: Type.STRING },
              },
              required: ["book_target", "daily_goal", "daily_motivation"],
            },
            vocabulary_cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  phonetic: { type: Type.STRING },
                  core_meaning: { type: Type.STRING },
                  logical_analysis: { type: Type.STRING },
                  academic_context: { type: Type.STRING },
                  translation: { type: Type.STRING },
                },
                required: ["word", "phonetic", "core_meaning", "logical_analysis", "academic_context", "translation"],
              },
            },
          },
          required: ["learning_dashboard", "vocabulary_cards"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Error generating daily plan:", error);
    return null;
  }
}
