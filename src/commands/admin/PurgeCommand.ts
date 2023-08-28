import { Command, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";

import { EmbedBuilder, Emojis } from "../../lib";

@ApplyOptions<Command.Options>({
    name: "purge",
    description: "Purge a staff user from database.",
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    preconditions: ["AdminOnly"],
})
export class PurgeCommand extends Command {
    public prisma: PrismaClient = new PrismaClient();
    public async messageRun(message: Message, args: Args): Promise<Message> {
        const user = await args.pick("user");
        const db = await this.prisma.staff.findFirst({ where: { userId: user.id } });

        if (!db)
            return await message.reply({
                embeds: [new EmbedBuilder().setDescription(`${Emojis.redcross}・User tidak terdaftar!`).isErrorEmbed()],
            });

        await this.prisma.staff.delete({ where: { userId: user.id } });

        return await message.reply({
            embeds: [new EmbedBuilder().setDescription(`${Emojis.checkmark}・Berhasil menghapus user dari database!`).isSuccessEmbed()],
        });
    }
}
