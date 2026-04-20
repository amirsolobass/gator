import {
    CommandsRegistry,
    handlerHelp,
    registerCommand,
    runCommand,
} from "./commands/commands";
import {
    handlerListUsers,
    handlerLogin,
    handlerRegister,
} from "./commands/users";
import { handlerReset } from "./commands/reset";
import { handlerAgg } from "./commands/aggregate";
import { handlerAddFeed, handlerListFeeds } from "./commands/feeds";
import {
    handlerFollow,
    handlerListFeedFollows,
    handlerUnfollow,
} from "./commands/feed-follows";
import { middlewareLoggedIn } from "./middleware";
import { handlerBrowse } from "./commands/browse";

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        handlerHelp();
        process.exit(0);
    }

    const cmdName = args[0];
    const cmdArgs = args.slice(1);
    const commandsRegistry: CommandsRegistry = {};

    registerCommand(commandsRegistry, "login", handlerLogin, "login <name> - switch to an existing user");
    registerCommand(commandsRegistry, "register", handlerRegister, "register <name> - create a new user");
    registerCommand(commandsRegistry, "reset", handlerReset, "reset - reset the database");
    registerCommand(commandsRegistry, "users", handlerListUsers, "users - list all users");
    registerCommand(commandsRegistry, "agg", handlerAgg, "agg <duration> - start the feed aggregator");
    registerCommand(
        commandsRegistry,
        "addfeed",
        middlewareLoggedIn(handlerAddFeed),
        "addfeed <name> <url> - add and follow a new RSS feed"
    );
    registerCommand(commandsRegistry, "feeds", handlerListFeeds, "feeds - list all feeds");
    registerCommand(
        commandsRegistry,
        "follow",
        middlewareLoggedIn(handlerFollow),
        "follow <url> - follow an existing feed"
    );
    registerCommand(
        commandsRegistry,
        "following",
        middlewareLoggedIn(handlerListFeedFollows),
        "following - list feeds you follow"
    );
    registerCommand(
        commandsRegistry,
        "unfollow",
        middlewareLoggedIn(handlerUnfollow),
        "unfollow <url> - unfollow a feed"
    );
    registerCommand(
        commandsRegistry,
        "browse",
        middlewareLoggedIn(handlerBrowse),
        "browse [limit] - view latest posts (default limit: 2)"
    );
    registerCommand(commandsRegistry, "help", handlerHelp(commandsRegistry), "help - list available commands");

    try {
        await runCommand(commandsRegistry, cmdName, ...cmdArgs);
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error running command ${cmdName}: ${err.message}`);
        } else {
            console.error(`Error running command ${cmdName}: ${err}`);
        }
        process.exit(1);
    }
    process.exit(0);
}

main();
