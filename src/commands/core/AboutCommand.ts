import { Command, RegisterBehavior } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { APIEmbedField, Guild, InteractionResponse, Message, SlashCommandBuilder, User, bold } from "discord.js";

import { EmbedBuilder } from "../../lib";

@ApplyOptions<Command.Options>({
    name: "about",
    description: "Get information about the bot.",
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
})
export class AboutCommand extends Command {
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
        const client: User = this.container.client.user;
        const server: string = "[**Honkai: Star Rail Indonesia**](https://discord.gg/WCAGWq96vv)";
        const description: string = `Bot multi-fungsi dan Honkai: Star Rail dari ${server}. Bergabunglah dengan kami dan tingkatkan pengalaman bermain Honkai: Star Rail dan perkuat persahabatan di komunitas game yang lebih luas.`;

        const details = {
            dev: [`- [@ravenxyzer](https://instagram.com/ravenxyzer)`],
            socialMedia: [
                `- [@honkaistar.indo](https://instagram.com/honkaistar.indo)`,
                `- [@honkaistarrail.id_](https://instagram.com/honkaistarrail.id_)`,
            ],
            networkServer: [`- [Genshin Impact ID](https://discord.gg/giid)`],
        };

        const embed: EmbedBuilder = new EmbedBuilder();
        embed.setAuthor({ name: client.username, iconURL: client.displayAvatarURL({ size: 1024 }) });
        embed.setDescription(description);
        embed.addFields([
            { name: "Developer", value: details.dev.join("\n") },
            { name: "Social Media", value: details.socialMedia.join("\n") },
            { name: "Network Server", value: details.networkServer.join("\n") },
        ]);

        return await ctx.reply({ embeds: [embed] });
    }

    private async getUser(id: string): Promise<User> {
        return await this.container.client.users.fetch(id);
    }
}
