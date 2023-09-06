import { Command, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { PrismaClient } from "@prisma/client";
import { Message, User } from "discord.js";

import { EmbedBuilder, Emojis } from "../../lib";

@ApplyOptions<Command.Options>({
    name: "subpoint",
    description: "Substract activity point to a user.",
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    preconditions: ["AdminOnly"],
})
export class AddPointCommand extends Command {
    public prisma: PrismaClient = new PrismaClient();
    public async messageRun(message: Message, args: Args): Promise<Message> {
        const user: User = await args.pick("user");
        const point: number = await args.pick("number");

        const db = await this.prisma.staff.findFirst({ where: { userId: user.id } });

        if (!db)
            return message.reply({
                embeds: [new EmbedBuilder().setDescription(`${Emojis.redcross}・User tidak ter-registrasi!`).isErrorEmbed()],
            });

        await this.prisma.staff.update({ where: { userId: user.id }, data: { activityPoint: { increment: point } } });
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${Emojis.checkmark}・Berhasil mengurangi ${point.toLocaleString("us")} point <@${user.id}>`)
                    .isSuccessEmbed(),
            ],
        });
    }
}
