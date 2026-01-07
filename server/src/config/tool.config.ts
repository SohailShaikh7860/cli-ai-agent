import { openai } from "@ai-sdk/openai";
import chalk from "chalk";

export const availableTools = [
  {
    id: "web_search",
    name: "Web Search",
    description:
      "Access the latest information using web search. Useful for current events, news, and real-time information.",
    getTool: () =>
      openai.tools.webSearch({
        searchContextSize: "high",
      }),
    enabled: false,
  },
  {
    id: "code_execution",
    name: "Code Execution",
    description:
      "Generate and execute code snippets in various programming languages. Useful for calculations, data processing, and automating tasks.",
    getTool: () => openai.tools.codeInterpreter({}),
    enabled: false,
  },
];

export function getEnabledTools() {
  const tools: any = {};

  try {
    for (const toolConfig of availableTools) {
      if (toolConfig.enabled) {
        tools[toolConfig.id] = toolConfig.getTool();
      }
    }

    if (Object.keys(tools).length > 0) {
      console.log(
        chalk.gray(`[DEBUG] Enabled tools: ${Object.keys(tools).join(", ")}`)
      );
    } else {
      console.log(chalk.yellow(`[DEBUG] No tools enabled`));
    }

    return Object.keys(tools).length > 0 ? tools : undefined;
  } catch (error: any) {
    console.error(
      chalk.red("[ERROR] Failed to initialize tools:"),
      error.message
    );
    console.error(
      chalk.yellow("Make sure you have @ai-sdk/google version 2.0+ installed")
    );
    console.error(chalk.yellow("Run: npm install @ai-sdk/google@latest"));
    return undefined;
  }
}

export function toggleTool(toolId: string) {
  const tool = availableTools.find((t) => t.id === toolId);

  if (tool) {
    tool.enabled = !tool.enabled;
    console.log(
      chalk.gray(`[DEBUG] Tool ${toolId} toggled to ${tool.enabled}`)
    );
    return tool.enabled;
}
console.log(chalk.red(`[DEBUG] Tool ${toolId} not found`));
return false;
}

export function enableTools(toolIds: string[]) {
    console.log(chalk.gray('[DEBUG] enableTools called with: ', toolIds));
    availableTools.forEach(tool=>{
        const wasEnabled = tool.enabled;
        tool.enabled = toolIds.includes(tool.id);

        if(tool.enabled !== wasEnabled){
            console.log(chalk.gray(`[DEBUG] ${tool.id}: ${wasEnabled} -> ${tool.enabled}`));
        }
    });

    const enabledCount = availableTools.filter(t=> t.enabled).length;
    console.log(chalk.gray(`[DEBUG] Total enabled tools: ${enabledCount}/${availableTools.length}`));
}

export function getEnabledToolsNames(){
    const names = availableTools.filter(t=> t.enabled).map(t=> t.name);
    console.log(chalk.gray('[DEBUG] getEnabledToolsNames returning: ', names));
    return names;
}

export function resetTools(){
    availableTools.forEach(tool=>{
        tool.enabled = false;
    })
    console.log(chalk.gray('[DEBUG] All tools have been reset to disabled'));
    
}