import { LogLevel, SapphireClient } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { PrismaClient } from "@prisma/client";
import { Partials } from "discord.js";

const prisma: PrismaClient = new PrismaClient();

export class Client extends SapphireClient {
    public constructor() {
        super({
            allowedMentions: {
                parse: ["roles", "users"],
                repliedUser: true,
            },
            caseInsensitiveCommands: true,
            caseInsensitivePrefixes: true,
            defaultPrefix: "kaf" || "kaf ",
            defaultCooldown: {
                delay: Time.Second * 3,
            },
            enableLoaderTraceLoggings: false,
            intents: [
                "AutoModerationConfiguration",
                "AutoModerationExecution",
                "DirectMessageReactions",
                "DirectMessageTyping",
                "DirectMessages",
                "GuildBans",
                "GuildEmojisAndStickers",
                "GuildIntegrations",
                "GuildInvites",
                "GuildMembers",
                "GuildMessageReactions",
                "GuildMessageTyping",
                "GuildMessages",
                "GuildPresences",
                "GuildScheduledEvents",
                "GuildVoiceStates",
                "GuildWebhooks",
                "Guilds",
                "MessageContent",
            ],
            loadDefaultErrorListeners: false,
            loadMessageCommandListeners: true,
            logger: {
                level: LogLevel.Debug,
            },
            partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction],
            typing: false,
        });
    }

    public login(token: string): Promise<string> {
        return super.login(token);
    }

    public destroy(): Promise<void> {
        return super.destroy();
    }
}
