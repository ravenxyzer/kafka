import { Command, RegisterBehavior } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

import { EmbedBuilder, Emojis } from "../../lib";
import { Embed, GuildMember, InteractionResponse, Message, SlashCommandBuilder } from "discord.js";
import { PrismaClient } from "@prisma/client";

@ApplyOptions<Command.Options>({
    name: "register",
    description: "Honkai: Star Rail Indonesia staff register.",
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
})
export class RegisterCommand extends Command {
    public prisma: PrismaClient = new PrismaClient();
    public override registerApplicationCommands(registry: Command.Registry): void {
        const command: SlashCommandBuilder = new SlashCommandBuilder().setName(this.name).setDescription(this.description);

        void registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: ["1068139995103244289"],
            idHints: [],
        });
    }

    public async messageRun(message: Message): Promise<Message> {
        return (await this.response(message, message.member)) as Message;
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const guild = this.container.client.guilds.cache.get("1068139995103244289");
        const member: GuildMember = guild.members.cache.get(interaction.user.id);

        return (await this.response(interaction, member)) as InteractionResponse;
    }

    private async response(
        ctx: Message | Command.ChatInputCommandInteraction,
        member: GuildMember
    ): Promise<Message | InteractionResponse> {
        const guild = this.container.client.guilds.cache.get("1068139995103244289");
        const staffRole = guild.roles.cache.get("1145597669591502888");
        const db = await this.prisma.staff.findFirst({ where: { userId: member.id } });

        if (ctx.guild.id !== "1068139995103244289") return;

        if (!member.roles.cache.has(staffRole.id))
            return await ctx.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`${Emojis.redcross}・Hanya staff yang boleh menjalankan perintah ini!`)
                        .isErrorEmbed(),
                ],
            });

        if (db)
            return await ctx.reply({
                embeds: [new EmbedBuilder().setDescription(`${Emojis.redcross}・Anda sudah terdaftar!`).isErrorEmbed()],
            });

        await this.prisma.staff.create({ data: { userId: member.id, guildId: guild.id, activityPoint: 0 } });

        return await ctx.reply({
            embeds: [new EmbedBuilder().setDescription(`${Emojis.checkmark}・Berhasil mendaftarkan diri Anda!`).isSuccessEmbed()],
        });
    }
}
