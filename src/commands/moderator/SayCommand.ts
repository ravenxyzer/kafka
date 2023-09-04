import { Command, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";

@ApplyOptions<Command.Options>({
    name: "say",
    aliases: ["echo"],
    description: "Say something as the bot.",
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
})
export class SayCommand extends Command {
    public async messageRun(message: Message, args: Args): Promise<Message> {
        const content: string = await args.rest("string");

        if (content == null) return;

        return await message.delete().then(async () => {
            return await message.channel.send(content);
        });
    }
}
