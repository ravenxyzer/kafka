import { Events, Listener } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";

@ApplyOptions<Listener.Options>({
    name: "activity",
    event: Events.MessageCreate,
    once: false,
})
export class ActivityListener extends Listener {
    public prisma: PrismaClient = new PrismaClient();
    public async run(message: Message): Promise<void> {
        if (message.author.bot) return;
        if (message.guild.id !== "1068139995103244289") return;

        const db = await this.prisma.staff.findFirst({ where: { userId: message.author.id } });

        if (!db) return;

        await this.prisma.staff.update({
            where: { userId: message.author.id },
            data: { activityPoint: { increment: 1 }, lastMessage: new Date() },
        });
    }
}
