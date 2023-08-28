import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { PrismaClient } from "@prisma/client";
import { ButtonInteraction, InteractionResponse, TextChannel } from "discord.js";

import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import { Emojis, EmbedBuilder } from "../lib";

@ApplyOptions<InteractionHandler.Options>({
    name: "attendance",
    interactionHandlerType: InteractionHandlerTypes.Button,
})
export class AttendanceHandler extends InteractionHandler {
    public prisma: PrismaClient = new PrismaClient();
    public parse(interaction: ButtonInteraction) {
        if (interaction.customId === "attendance-button") return this.some();

        this.none();
    }

    public override async run(interaction: ButtonInteraction): Promise<InteractionResponse> {
        const channel: TextChannel = interaction.guild.channels.cache.get("1145208321956126790") as TextChannel;

        const embed: EmbedBuilder = new EmbedBuilder();
        embed.setAuthor({ name: "Kehadiran Staff!", iconURL: this.container.client.user.displayAvatarURL({ size: 4096 }) });
        embed.setThumbnail(interaction.user.displayAvatarURL({ size: 4096 }));
        embed.setDescription(`${Emojis.checkmark}・${interaction.user.tag} telah mengisi absen.`);
        embed.setFooter({ text: "Terima kasih sudah absen dan tingkatkan terus kehadiranmu!" });

        const currentTime: Dayjs = dayjs().utcOffset(7);
        const currentDaysInMonth: number = currentTime.daysInMonth();

        const db = await this.prisma.user.findFirst({ where: { userId: interaction.user.id } });
        const staffDb = await this.prisma.staff.findFirst({ where: { userId: interaction.user.id } });

        if (!staffDb)
            return interaction.reply({
                embeds: [new EmbedBuilder().setDescription(`${Emojis.redcross}・Dimohon untuk melakukan register terlebih dahulu!`)],
                ephemeral: true,
            });

        if (!db) {
            const activity = await this.prisma.staff.update({
                where: { userId: interaction.user.id },
                data: { activityPoint: { increment: 100 } },
            });

            const createdUser = await this.prisma.user.create({
                data: { userId: interaction.user.id, lastAttend: new Date(), attendStreak: 1, attendSum: 1, attendPerMonth: 1 },
            });

            const attendPerMonthSum: number = createdUser.attendPerMonth;
            const diff: number = attendPerMonthSum - currentDaysInMonth;

            await channel.send({
                embeds: [
                    embed.addFields([
                        { name: "Waktu", value: `${currentTime.format("HH:mm")} WIB` },
                        { name: "Total Kehadiran", value: `${createdUser.attendSum} kali` },
                        { name: "Kehadiran Beruntun", value: `${createdUser.attendStreak} kali` },
                        { name: "Absen Bulanan", value: `${attendPerMonthSum}/${currentDaysInMonth} (${diff} hari)` },
                        { name: "Poin Keaktifan", value: `${activity.activityPoint.toLocaleString("us")} poin` },
                    ]),
                ],
            });

            return await interaction.reply({ content: `${Emojis.checkmark} ・ Absen berhasil!`, ephemeral: true });
        }

        const lastAttend: Dayjs = dayjs(db.lastAttend).utcOffset(7);
        const attendStreak = this.isStreakFailed(lastAttend, currentTime) ? 1 : { increment: 1 };
        const attendPerMonth = this.isNextMonth(lastAttend, currentTime) ? 1 : { increment: 1 };

        // Attend Success
        if (this.isBeforeDay(lastAttend, currentTime)) {
            const activity = await this.prisma.staff.update({
                where: { userId: interaction.user.id },
                data: { activityPoint: { increment: 100 } },
            });

            const updatedUser = await this.prisma.user.update({
                where: { userId: interaction.user.id },
                data: { lastAttend: new Date(), attendStreak, attendPerMonth, attendSum: { increment: 1 } },
            });

            const attendPerMonthSum: number = updatedUser.attendPerMonth;
            const diff: number = attendPerMonthSum - currentDaysInMonth;

            await channel.send({
                embeds: [
                    embed.addFields([
                        { name: "Waktu", value: `${currentTime.format("HH:mm")} WIB` },
                        { name: "Total Kehadiran", value: `${updatedUser.attendSum} kali` },
                        { name: "Kehadiran Beruntun", value: `${updatedUser.attendStreak} kali` },
                        { name: "Absen Bulanan", value: `${attendPerMonthSum}/${currentDaysInMonth} (${diff} hari)` },
                        { name: "Poin Keaktifan", value: `${activity.activityPoint.toLocaleString("us")} poin` },
                    ]),
                ],
            });

            return await interaction.reply({ content: `${Emojis.checkmark} ・ Absen berhasil!`, ephemeral: true });
        }

        return await interaction.reply({ content: `${Emojis.redcross} ・ Anda sudah absen hari ini.`, ephemeral: true });
    }

    private isBeforeDay(last: Dayjs, current: Dayjs): boolean {
        return last.isBefore(current, "day");
    }

    private isStreakFailed(last: Dayjs, current: Dayjs): boolean {
        return last.isBefore(current.subtract(1, "day"), "day");
    }

    private isNextMonth(last: Dayjs, current: Dayjs): boolean {
        return current.month() > last.month() || current.year() > last.year();
    }
}
