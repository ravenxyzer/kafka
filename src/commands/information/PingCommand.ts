import { Command, RegisterBehavior } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { InteractionResponse, Message, SlashCommandBuilder } from "discord.js";

import { EmbedBuilder } from "../../lib";

@ApplyOptions<Command.Options>({
    name: "ping",
    aliases: ["p"],
    description: "Check bot and user's latencies.",
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
})
export class PingCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry): void {
        const command: SlashCommandBuilder = new SlashCommandBuilder().setName(this.name).setDescription(this.description);

        void registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: [],
            idHints: [],
        });
    }

    public async messageRun(message: Message): Promise<Message> {
        return (await this.response(message)) as Message;
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<InteractionResponse> {
        return (await this.response(interaction)) as InteractionResponse;
    }

    private async response(ctx: Message | Command.ChatInputCommandInteraction): Promise<Message | InteractionResponse> {
        const start: number = Date.now();

        return await ctx
            .reply({ embeds: [new EmbedBuilder().setDescription("🏓・Pinging...")] })
            .then((sent: Message | InteractionResponse) => {
                const end: number = Date.now();
                return sent.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("🏓・Pong, check these out!")
                            .addFields(
                                { name: "Client", value: `\`${end - start}ms\``, inline: true },
                                { name: "API", value: `\`${Math.round(this.container.client.ws.ping) + 2}ms\``, inline: true },
                                { name: "User", value: `\`${end - ctx.createdTimestamp}ms\``, inline: true }
                            ),
                    ],
                });
            });
    }
}
