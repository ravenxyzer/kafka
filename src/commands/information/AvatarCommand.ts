import { Args, Command, RegisterBehavior } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { InteractionResponse, Message, SlashCommandBuilder, Guild, GuildMember, User, Embed } from "discord.js";

import { EmbedBuilder } from "../../lib";

@ApplyOptions<Command.Options>({
    name: "avatar",
    aliases: ["av"],
    description: "Display user's avatar(s).",
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
})
export class AvatarCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry): void {
        const command = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption((option) => option.setName("user").setDescription("Provide user!").setRequired(false));

        void registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: [],
            idHints: [],
        });
    }

    public async messageRun(message: Message, args: Args): Promise<Message> {
        const user: User = await args.pick("user");
        return (await this.response(message, user)) as Message;
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const user: User = interaction.options.getUser("user");
        return (await this.response(interaction, user)) as InteractionResponse;
    }

    private async response(ctx: Message | Command.ChatInputCommandInteraction, user: User): Promise<Message | InteractionResponse> {
        const member: GuildMember = ctx.guild.members.cache.get(user.id);

        const userAvatar = user.displayAvatarURL({ size: 4096 });
        const memberAvatar = member.displayAvatarURL({ size: 4096 });

        const avatars: EmbedBuilder[] =
            userAvatar !== memberAvatar
                ? [new EmbedBuilder().setImage(userAvatar), new EmbedBuilder().setImage(memberAvatar)]
                : [new EmbedBuilder().setImage(userAvatar)];

        return ctx.reply({ content: `**${user.username}'s** avatar(s)`, embeds: avatars });
    }
}
