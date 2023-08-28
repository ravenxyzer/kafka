import { Listener, Events } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Time } from "@sapphire/time-utilities";
import { Client } from "discord.js";
import { PrismaClient } from "@prisma/client";

import { Presences } from "../../lib";

@ApplyOptions<Listener.Options>({
    name: "ready",
    event: Events.ClientReady,
    once: true,
})
export class ReadyListener extends Listener {
    public prisma: PrismaClient = new PrismaClient();
    public async run(client: Client) {
        const updatePresence = function (): void {
            client.user?.setPresence({
                status: "online",
                activities: [Presences[Math.floor(Math.random() * Presences.length)]],
            });
        };

        setTimeout(updatePresence, Time.Minute * 2);

        try {
            await this.prisma.$connect();
            void this.container.logger.info("Connected to MongoDB");
        } catch (error) {
            void this.container.logger.error("Error connecting to MongoDB:", error);
        }

        void this.container.logger.info("Client is online!");
    }
}
