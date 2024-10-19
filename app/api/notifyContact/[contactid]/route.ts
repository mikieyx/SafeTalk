import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    console.log('Received POST request:', requestBody);

    const toolCalls = requestBody.message?.toolCalls;

    if (!toolCalls || toolCalls.length === 0) {
      return NextResponse.json({ error: 'No tool calls found' }, { status: 400 });
    }

    const toolCall = toolCalls[0];
    const toolCallId = toolCall.id || 'default_tool_call_id';
    const transcript = toolCall.transcript || 'No transcript provided';

    console.log(toolCallId);

    const response = {
      results: [
        {
          toolCallId,
          result: `Processed transcript: ${transcript}`
        }
      ]
    };

    console.log('Response to be sent:', response);
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
