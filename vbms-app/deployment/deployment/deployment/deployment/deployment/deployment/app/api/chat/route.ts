import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const apiEndpoint = process.env.AZURE_AI_ENDPOINT;
    const apiKey = process.env.AZURE_AI_PROJECT_KEY;
    const projectId = process.env.AZURE_AI_PROJECT_ID;

    if (!apiEndpoint || !apiKey || !projectId) {
      console.error('Missing Azure AI configuration');
      return NextResponse.json(
        { error: 'Azure AI Service not configured' },
        { status: 500 }
      );
    }

    // Call Azure AI Services API
    const response = await fetch(
      `${apiEndpoint}/chat/completions?api-version=2024-01-01-preview`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          max_tokens: 2048,
          temperature: 0.7,
          top_p: 1,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Azure API error:', errorData);
      throw new Error(`Azure API error: ${response.status}`);
    }

    const data = await response.json();

    // Extract the assistant's response
    const assistantMessage =
      data.choices?.[0]?.message?.content || 'No response';

    return NextResponse.json({
      role: 'assistant',
      content: assistantMessage,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
