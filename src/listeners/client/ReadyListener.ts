import { Listener, Events } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { PrismaClient } from "@prisma/client";
import { ActivityType } from "discord.js";

@ApplyOptions<Listener.Options>({
    name: "ready",
    event: Events.ClientReady,
    once: true,
})
export class ReadyListener extends Listener {
    public prisma: PrismaClient = new PrismaClient();
    public async run(): Promise<void> {
        this.container.client.user?.setPresence({
            status: "online",
            activities: [{ name: "Pom-pom cuteness!", type: ActivityType.Watching }],
        });

        try {
            await this.prisma.$connect();
            void this.container.logger.info("Connected to MongoDB");
        } catch (error) {
            void this.container.logger.error("Error connecting to MongoDB:", error);
        }

        void this.container.logger.info("Client is online!");
    }
}
