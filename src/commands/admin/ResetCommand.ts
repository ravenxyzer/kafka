import { Command, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { PrismaClient } from "@prisma/client";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, Message } from "discord.js";

import { EmbedBuilder, Emojis } from "../../lib";
import { Time } from "@sapphire/time-utilities";

@ApplyOptions<Command.Options>({
    name: "reset",
    description: "Reset all staff activity point.",
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    preconditions: ["AdminOnly"],
})
export class ResetCommand extends Command {
    public prisma: PrismaClient = new PrismaClient();
    public async messageRun(message: Message): Promise<void> {
        if (message.guild.id !== "1068139995103244289") return;

        const row = new ActionRowBuilder<ButtonBuilder>();
        row.addComponents(
            new ButtonBuilder()
                .setCustomId("reset-confirm")
                .setEmoji(`${Emojis.checkmark}`)
                .setLabel("Confirm")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("reset-cancel")
                .setEmoji(`${Emojis.redcross}`)
                .setLabel("Cancel")
                .setStyle(ButtonStyle.Secondary)
        );

        const response = await message.reply({
            embeds: [new EmbedBuilder().setDescription("Apakah Anda yakin ingin me-reset seluruh poin keaktifan?")],
            components: [row],
        });

        const filter = (interaction: any): boolean => interaction.customId === "reset-confirm" || interaction.customId === "reset-cancel";
        const collector = response.createMessageComponentCollector({ filter, time: Time.Second * 30, componentType: ComponentType.Button });

        collector.on("collect", async (interaction: ButtonInteraction) => {
            const disabledButtonRow = new ActionRowBuilder<ButtonBuilder>();
            const disabled = row.components.map((button) => button.setDisabled(true));

            if (interaction.customId === "reset-confirm") {
                response.edit({ components: [disabledButtonRow.addComponents(disabled)] });

                await this.prisma.staff.updateMany({ data: { activityPoint: 0 } });
                await interaction.reply({ content: "Poin keaktifan berhasil di-reset!", ephemeral: true });

                return;
            }

            response.edit({ components: [disabledButtonRow.addComponents(disabled)] });
            await interaction.reply({ content: "Reset telah di-cancel!", ephemeral: true });
        });

        collector.on("end", () => {
            const disabledButtonRow = new ActionRowBuilder<ButtonBuilder>();
            const disabled = row.components.map((button) => button.setDisabled(true));
            response.edit({ components: [disabledButtonRow.addComponents(disabled)] });
        });
    }
}
