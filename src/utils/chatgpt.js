export const askChatGPT = async (apiKey, prompt) => {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 500,
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get response from ChatGPT');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling ChatGPT:", error);
    throw new Error(error.message || "Failed to get response from ChatGPT");
  }
};
