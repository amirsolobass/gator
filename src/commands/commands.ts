import { User } from "src/lib/db/schema";

export type CommandHandler = (
    cmdName: string,
    ...args: string[]
) => Promise<void> | void;

export type CommandEntry = {
    handler: CommandHandler;
    description: string;
};

export type CommandsRegistry = Record<string, CommandEntry>;

export function registerCommand(
    registry: CommandsRegistry,
    cmdName: string,
    handler: CommandHandler,
    description: string,
): void {
    registry[cmdName] = { handler, description };
}

export async function runCommand(
    registry: CommandsRegistry,
    cmdName: string,
    ...args: string[]
): Promise<void> {
    const entry = registry[cmdName];
    if (!entry) {
        throw new Error(`Unknown command: ${cmdName}`);
    }
    await entry.handler(cmdName, ...args);
}

export function handlerHelp(registry?: CommandsRegistry) {
    return function (cmdName: string, ...args: string[]): void {
        console.log(`Usage: gator <command> [args]\n`);
        console.log(`Commands:`);
        for (const [name, entry] of Object.entries(registry)) {
            console.log(`  ${name.padEnd(12)} - ${entry.description}`);
        }
    };
}

export type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void> | void;