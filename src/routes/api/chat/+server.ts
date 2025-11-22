import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

// Available MCP tools
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'connect_data_source',
      description: 'Connect to a data source (slack, zoom, chorus, or sheets)',
      parameters: {
        type: 'object',
        properties: {
          source: {
            type: 'string',
            enum: ['slack', 'zoom', 'chorus', 'sheets'],
            description: 'The data source to connect to'
          }
        },
        required: ['source']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'list_data_sources',
      description: 'List all available data sources and their connection status',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_slack_conversations',
      description: 'Fetch Slack conversations from connected workspace',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Maximum number of conversations to fetch'
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_drive_files',
      description: 'List files from connected Google Drive',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Maximum number of files to fetch'
          },
          fileType: {
            type: 'string',
            description: 'Filter by file type (docs, sheets, slides, pdfs, all)',
            enum: ['all', 'docs', 'sheets', 'slides', 'pdfs']
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'navigate_to_step',
      description: 'Navigate to a specific step in the workflow',
      parameters: {
        type: 'object',
        properties: {
          step: {
            type: 'number',
            description: 'The step number (1-5)',
            enum: [1, 2, 3, 4, 5]
          }
        },
        required: ['step']
      }
    }
  }
];

// Mock MCP client for now (in production, this would connect to actual MCP server)
async function callMCPTool(name: string, args: any): Promise<any> {
  // For now, return mock responses
  switch (name) {
    case 'list_data_sources':
      return {
        success: true,
        dataSources: [
          { type: 'slack', name: 'Slack', connected: false },
          { type: 'zoom', name: 'Zoom', connected: false },
          { type: 'chorus', name: 'Chorus.ai', connected: false },
          { type: 'sheets', name: 'Google Sheets', connected: false },
          { type: 'drive', name: 'Google Drive', connected: false }
        ],
        connectedCount: 0,
        totalCount: 5
      };
    
    case 'connect_data_source':
      return {
        success: true,
        source: args.source,
        message: `Connected to ${args.source} successfully`,
        connected: true
      };
    
    case 'navigate_to_step':
      return {
        success: true,
        step: args.step,
        message: `Navigated to step ${args.step}`
      };
    
    case 'get_drive_files':
      return {
        success: true,
        files: [
          {
            id: '1',
            name: 'Q1 Product Roadmap 2024.gdoc',
            mimeType: 'application/vnd.google-apps.document',
            modifiedTime: '2024-01-10T14:30:00Z'
          }
        ],
        message: `Found ${args.limit || 10} Google Drive files`
      };
    
    default:
      return {
        success: false,
        error: `Tool ${name} not yet implemented in web interface`
      };
  }
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { messages } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Add system prompt
    const systemMessage = {
      role: 'system' as const,
      content: `You are a helpful assistant for the Weekly application. 
You help users manage their weekly updates by:
- Connecting to data sources (Slack, Zoom, Chorus.ai, Google Sheets)
- Navigating through the 5-step workflow
- Fetching and managing data

The workflow steps are:
1. Connect Sources - Link data sources
2. Select Data - Choose conversations & meetings
3. Choose Template - Select update format
4. Generate Draft - AI creates update
5. Review & Edit - Finalize update

Be helpful, concise, and guide users through the process.`
    };

    const allMessages = [systemMessage, ...messages];

    // Call OpenAI with function calling
    let response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: allMessages as any,
      tools: tools,
      tool_choice: 'auto'
    });

    let assistantMessage = response.choices[0].message;
    const toolCalls: Array<{ name: string; args: any; result: any }> = [];

    // Handle tool calls
    while (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      const newMessages = [...allMessages, assistantMessage as any];

      // Execute each tool call
      for (const toolCall of assistantMessage.tool_calls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);

        const result = await callMCPTool(functionName, functionArgs);
        
        toolCalls.push({
          name: functionName,
          args: functionArgs,
          result
        });

        newMessages.push({
          role: 'tool' as const,
          tool_call_id: toolCall.id,
          content: JSON.stringify(result)
        });
      }

      // Get next response
      response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: newMessages as any,
        tools: tools,
        tool_choice: 'auto'
      });

      assistantMessage = response.choices[0].message;
    }

    return json({
      message: assistantMessage.content,
      toolCalls
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};

