import { Listener } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import {
    Events,
    UserError,
    Identifiers,
    MessageCommandDeniedPayload,
    ChatInputCommandDeniedPayload,
    ContextMenuCommandDeniedPayload,
} from "@sapphire/framework";
import { Message, InteractionResponse, Embed } from "discord.js";

import { EmbedBuilder } from "../../lib";

@ApplyOptions<Listener.Options>({
    name: "MessageCommandDenied",
    once: false,
    event: Events.MessageCommandDenied,
})
export class MessageCommandDeniedListener extends Listener {
    public async run(error: UserError, data: MessageCommandDeniedPayload): Promise<Message> {
        const embed: EmbedBuilder = new EmbedBuilder().isErrorEmbed();

        switch (error.identifier) {
            case Identifiers.PreconditionCooldown:
                embed.setDescription("🛑・The command you are using is on cooldown!");
                return data.message.reply({ embeds: [embed] });

            case Identifiers.PreconditionClientPermissions || Identifiers.PreconditionClientPermissionsNoPermissions:
                embed.setDescription(`🛑・Bot has no permission!\nPerms needed: ${error.context}`);
                return data.message.reply({ embeds: [embed] });

            case Identifiers.PreconditionUserPermissions || Identifiers.PreconditionUserPermissionsNoPermissions:
                embed.setDescription("🛑・User has no permission!");
                return data.message.reply({ embeds: [embed] });

            case Identifiers.PreconditionOwnerOnly:
                embed.setDescription("🛑・Only owner can run this command!");
                return data.message.reply({ embeds: [embed] });

            case Identifiers.PreconditionDeveloperOnly:
                embed.setDescription("🛑・Only developer can run this command!");
                return data.message.reply({ embeds: [embed] });

            default:
                embed.setDescription(`🛑・${error.identifier} | ${error.message}`);
                return data.message.reply({ embeds: [embed] });
        }
    }
}

@ApplyOptions<Listener.Options>({
    name: "ChatInputCommandDenied",
    once: false,
    event: Events.ChatInputCommandDenied,
})
export class ChatInputCommandDeniedListener extends Listener {
    public async run(error: UserError, data: ChatInputCommandDeniedPayload): Promise<InteractionResponse<boolean>> {
        const embed: EmbedBuilder = new EmbedBuilder();
        switch (error.identifier) {
            case Identifiers.PreconditionCooldown:
                embed.setDescription("🛑・The command you are using is on cooldown!");
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionClientPermissions || Identifiers.PreconditionClientPermissionsNoPermissions:
                embed.setDescription(`🛑・Bot has no permission!\nPerms needed: ${error.context}`);
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionUserPermissions || Identifiers.PreconditionUserPermissionsNoPermissions:
                embed.setDescription("🛑・User has no permission!");
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionOwnerOnly:
                embed.setDescription("🛑・Only owner can run this command!");
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionDeveloperOnly:
                embed.setDescription("🛑・Only developer can run this command!");
                return data.interaction.reply({ embeds: [embed] });

            default:
                embed.setDescription(`🛑・${error.identifier}\n\`\`\`${error.message}\`\`\``);
                return data.interaction.reply({ embeds: [embed] });
        }
    }
}

@ApplyOptions<Listener.Options>({
    name: "ContextMenuCommandDenied",
    once: false,
    event: Events.ContextMenuCommandDenied,
})
export class ContextMenuCommandDeniedListener extends Listener {
    public async run(error: UserError, data: ContextMenuCommandDeniedPayload): Promise<InteractionResponse<boolean>> {
        const embed: EmbedBuilder = new EmbedBuilder().isErrorEmbed();
        switch (error.identifier) {
            case Identifiers.PreconditionCooldown:
                embed.setDescription("🛑・The command you are using is on cooldown!");
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionClientPermissions || Identifiers.PreconditionClientPermissionsNoPermissions:
                embed.setDescription(`🛑・Bot has no permission!\nPerms needed: ${error.context}`);
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionUserPermissions || Identifiers.PreconditionUserPermissionsNoPermissions:
                embed.setDescription("🛑・User has no permission!");
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionOwnerOnly:
                embed.setDescription("🛑・Only owner can run this command!");
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionDeveloperOnly:
                embed.setDescription("🛑・Only developer can run this command!");
                return data.interaction.reply({ embeds: [embed] });

            default:
                embed.setDescription(`🛑・${error.identifier}\n\`\`\`${error.message}\`\`\``);
                return data.interaction.reply({ embeds: [embed] });
        }
    }
}
