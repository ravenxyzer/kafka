import { Command, RegisterBehavior } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { PrismaClient } from "@prisma/client";
import { Message, InteractionResponse, SlashCommandBuilder, GuildMember } from "discord.js";

import { EmbedBuilder } from "../../lib";
import dayjs from "dayjs";

@ApplyOptions<Command.Options>({
    name: "rank",
    description: "Display top rank staff.",
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    preconditions: ["ModeratorOnly"],
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
        return (await this.response(message)) as Message;
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<InteractionResponse> {
        return (await this.response(interaction)) as InteractionResponse;
    }

    private async response(ctx: Message | Command.ChatInputCommandInteraction): Promise<Message | InteractionResponse> {
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
        const members: GuildMember[] = getMembers.map((m) => m);

        for (const member of members) {
            const dbStaff = await this.prisma.staff.findFirst({ where: { userId: member.id } });
            const dbUser = await this.prisma.user.findFirst({ where: { userId: member.id } });
            const isLasttMonth = dayjs(dbUser.lastAttend).isBefore(1, "month");

            container.push({
                member,
                activityPoint: !dbStaff ? 0 : dbStaff.activityPoint,
                attendSum: !dbUser ? 0 : dbUser.attendSum,
                attendPerMonth: !dbUser ? 0 : isLasttMonth ? 0 : dbUser.attendPerMonth,
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
