import { Command, RegisterBehavior } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { PrismaClient } from "@prisma/client";
import { Message, InteractionResponse, SlashCommandBuilder, GuildMember, Guild } from "discord.js";

import { EmbedBuilder, Emojis } from "../../lib";

@ApplyOptions<Command.Options>({
    name: "rank",
    description: "Display top rank staff.",
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
})
export class RankCommand extends Command {
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
        if (!member.roles.cache.has("1068139995103244289"))
            return await ctx.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`${Emojis.redcross}・Hanya staff yang boleh menjalankan perintah ini!`)
                        .isErrorEmbed(),
                ],
            });

        if (ctx.guild.id !== "1068139995103244289") return;

        const members: Data[] = await this.getMembers();
        const sortedMembers: Data[] = this.sortedMembers(members);
        const line = "๑‧˚꒷꒦︶₊꒷꒦︶₊꒷꒦˚‧๑‧˚꒷꒦︶₊꒷꒦︶₊꒷꒦˚‧๑˖";

        let description: string = "";
        sortedMembers.forEach((player, index) => {
            description += `**#${index + 1}・${player.member.user.username}**\n\`⭐\` : ${player.activityPoint.toLocaleString(
                "us"
            )} points\n\`📝\` : ${player.attendSum} kali (${player.attendPerMonth}x/bulan)\n\n`;
        });

        return await ctx.reply({
            embeds: [
                new EmbedBuilder()
                    .setThumbnail(ctx.guild.iconURL({ size: 4096 }))
                    .setDescription(
                        `## 🏆 ・ Activity Rank\n${line}\n\n${description}\n\nNote: \`⭐\` : Activity Points ・ \`📝\` : Attendance`
                    )
                    .setFooter({
                        text: "Tingkatkan terus keaktifanmu!",
                        iconURL: this.container.client.user.displayAvatarURL({ size: 1024 }),
                    }),
            ],
        });
    }

    private async getMembers(): Promise<Data[]> {
        let container: Data[] = [];
        const guild = this.container.client.guilds.cache.get("1068139995103244289");
        const getMembers = guild.members.cache.filter((m) => m.roles.cache.has("1145597669591502888"));
        const members: GuildMember[] = getMembers.map((m) => {
            return m;
        });

        for (const member of members) {
            const dbStaff = await this.prisma.staff.findFirst({ where: { userId: member.id } });
            const dbUser = await this.prisma.user.findFirst({ where: { userId: member.id } });

            container.push({
                member,
                activityPoint: !dbStaff ? 0 : dbStaff.activityPoint,
                attendSum: !dbUser ? 0 : dbUser.attendSum,
                attendPerMonth: !dbUser ? 0 : dbUser.attendPerMonth,
            });
        }

        return container;
    }

    private sortedMembers(arr: Data[]): Data[] {
        return arr.slice().sort((a, b) => {
            if (b.activityPoint !== a.activityPoint) {
                return b.activityPoint - a.activityPoint;
            } else {
                return a.member.user.username.localeCompare(b.member.user.username);
            }
        });
    }
}

interface Data {
    member: GuildMember;
    activityPoint: number;
    attendSum: number;
    attendPerMonth: number;
}

type Headers = ["Name", "Activity Points", "Attendance", "Attendance (per month)"];
