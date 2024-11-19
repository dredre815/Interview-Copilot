export const askChatGPT = async (apiKey, prompt) => {
  if (!apiKey) {
    throw new Error("OpenAI API key is required");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a Computer Science interview assistant. Your goal is to:
            1. Help candidates approach technical interview questions, including coding problems, algorithms, and system design.
            2. Provide concise and real-world responses that sound natural in a live interview setting, avoiding overly academic or verbose answers.
            3. Simulate the tone and style of a confident and experienced interviewee.
            4. If given a question, suggest a practical and structured way to tackle it.
            5. If given a candidate's answer, provide constructive and concise feedback, highlighting improvements and any missing elements.
            6. Focus on clarity and brevity, ensuring answers are easy to follow and relevant to the question.
            7. Adapt to the level of complexity based on the question, keeping explanations as simple as possible unless asked otherwise.
            
            Always keep your tone confident, conversational, and supportive, as if you're helping the candidate succeed in a real interview.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.6,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message || "Failed to get response from ChatGPT"
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling ChatGPT:", error);
    throw new Error(error.message || "Failed to get response from ChatGPT");
  }
};
