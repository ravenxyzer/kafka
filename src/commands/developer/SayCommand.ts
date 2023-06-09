import { Args, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";

@ApplyOptions<Command.Options>({
    name: "say",
    description: "Say something as the bot.",
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    preconditions: ["DeveloperOnly"],
})
export class SayCommand extends Command {
    /**
     * @description message command executor
     * @param message message interaction
     * @returns {Message}
     */
    public override async messageRun(message: Message, args: Args): Promise<Message> {
        const content: string = await args.rest("string");

        void message.delete();
        return await message.channel.send({ content, allowedMentions: { parse: [] } });
    }
}
