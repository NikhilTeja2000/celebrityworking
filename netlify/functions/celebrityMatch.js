const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  }

  try {
    const { interests } = JSON.parse(event.body);

    if (!interests || !Array.isArray(interests) || interests.length < 2) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Please provide at least 2 interests' 
        }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'API key not configured' 
        }),
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `I want you to act as a pop-culture data-synthesis expert. Your task is to find up to 3 famous people who match a specific set of interests: a love for ${interests[0]}${interests[1] ? `, ${interests[1]}` : ''}${interests[2] ? `, and ${interests[2]}` : ''}.

Format the response as:

- A Markdown table with columns: "Celebrity," ${interests.map((interest, index) => `"Loves ${interest}"`).join(', ')}
- Use "Yes" and a superscript number (¹, ², ³, etc.) in each column to indicate source
- Add a "Sources" section below with numbered citations and brief explanations

End with:  
"These celebrities are excellent matches for your interests, as supported by the sources below."

**Guardrails**:  
- Don't make up interests  
- If no match for all ${interests.length}, show matches for ${interests.length - 1}  
- If none, say: "No strong celebrity matches could be found for this combination of interests."`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        data: text 
      }),
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to generate celebrity matches. Please try again.' 
      }),
    };
  }
};