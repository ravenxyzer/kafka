import { Args, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } from "discord.js";

import { EmbedBuilder } from "../../lib";

@ApplyOptions<Command.Options>({
    name: "sendcode",
    aliases: ["sc"],
    description: "Send redeemable codes.",
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    preconditions: ["ModeratorOnly"],
})
export class SendCodeCommand extends Command {
    public override async messageRun(message: Message, args: Args): Promise<Message> {
        void message.delete();
        const codes: string = (await args.rest("string")).toUpperCase();
        const codesToArray: string[] = codes.split(" ");

        const mappingCodes: string[] = codesToArray.map(
            (code) => `- \`${code}\` ・ [**Direct Link**](https://hsr.hoyoverse.com/gift?code=${code})`
        );

        const embed: EmbedBuilder = new EmbedBuilder()
            .setTitle("`⭐`  Honkai: Star Rail Redeem Codes!")
            .setDescription("Hai Trailblazer, jangan sampai ketinggalan untuk klaim kodenya ya!")
            .addFields([{ name: "Codes", value: mappingCodes.join("\n") }])
            .setImage(
                "https://cdn.discordapp.com/attachments/1068139997531734070/1187972491147231232/HSR_kode_redeem-01.png?ex=6598d499&is=65865f99&hm=ce492aaad6bfd71870542e9de4b1aa9bdce3d4b6ed38965db2891b98886bdd5e&"
            );

        const button: ButtonBuilder = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel("Redeem Now!")
            .setURL(`https://hsr.hoyoverse.com/gift`);

        const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

        return await message.channel.send({ content: "<@&1068139995237449772> ada kode baru nih!", embeds: [embed], components: [row] });
    }
}
