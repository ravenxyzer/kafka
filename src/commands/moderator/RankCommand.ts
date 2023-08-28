import { Command, RegisterBehavior } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { PrismaClient } from "@prisma/client";
import { Message, InteractionResponse, SlashCommandBuilder, GuildMember, Guild } from "discord.js";

import { EmbedBuilder } from "../../lib";

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
        return (await this.response(message)) as Message;
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<InteractionResponse> {
        return (await this.response(interaction)) as InteractionResponse;
    }

    private async response(ctx: Message | Command.ChatInputCommandInteraction): Promise<Message | InteractionResponse> {
        if (ctx.guild.id !== "1068139995103244289") return;

        const members: Data[] = await this.getMembers();
        const sortedMembers: Data[] = this.sortedMembers(members);
        const line = "๑‧˚꒷꒦︶₊꒷꒦︶₊꒷꒦˚‧๑‧˚꒷꒦︶₊꒷꒦︶₊꒷꒦˚‧๑‧˚꒷꒦︶₊꒷꒦︶₊꒷꒦˚‧๑˖";

        let description: string = "";
        sortedMembers.forEach((player, index) => {
            description += `**#${index + 1}・${player.member.user.username}**\nPoin Keaktifkan: ${player.activityPoint.toLocaleString(
                "us"
            )} poin.\n\n`;
        });

        return await ctx.reply({
            embeds: [
                new EmbedBuilder()
                    .setThumbnail(ctx.guild.iconURL({ size: 4096 }))
                    .setDescription(`## 🏆 ・ Toplist By Activity Point\n${line}\n\n${description}`)
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
            const db = await this.prisma.staff.findFirst({ where: { userId: member.id } });

            if (db) {
                container.push({ member, activityPoint: db.activityPoint });
            } else {
                container.push({ member, activityPoint: 0 });
            }
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
}
