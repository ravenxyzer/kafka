import { Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { ButtonStyle, Message, ActionRowBuilder, ButtonBuilder } from "discord.js";

import { EmbedBuilder } from "../../lib";

@ApplyOptions<Command.Options>({
    name: "attendance",
    description: "Staff daily attendance.",
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    preconditions: ["AdminOnly"],
})
export default class AttendanceCommand extends Command {
    public override async messageRun(message: Message): Promise<Message> {
        return message.channel.send({
            embeds: [new EmbedBuilder().setTitle("✍️・Staff Attendance").setDescription("Tekan tombol di bawah untuk presensi kehadiran!")],
            components: [
                new ActionRowBuilder<ButtonBuilder>().setComponents(
                    new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel("Attend!").setCustomId("attendance-button")
                ),
            ],
        });
    }
}
