import { createServer } from 'node:http';
import { BuiltInAgent, CopilotRuntime } from '@copilotkit/runtime/v2';
import { createCopilotNodeListener } from '@copilotkit/runtime/v2/node';
import { apiKey } from './.key.ts';

const runtime = new CopilotRuntime({
  agents: {
    default: new BuiltInAgent({
      apiKey: apiKey,
      model: 'openai:gpt-5-mini',
      prompt: 'You are a helpful assistant for an Angular app.',
    }),
  },
});

const port = Number(process.env['PORT'] ?? 8200);

createServer(
  createCopilotNodeListener({
    runtime,
    basePath: '/api/copilotkit',
    cors: true,
  }),
).listen(port, () => {
  console.log(`Copilot Runtime listening at http://localhost:${port}/api/copilotkit`);
});
