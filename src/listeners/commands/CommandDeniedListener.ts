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
import { Message, InteractionResponse } from "discord.js";
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
                embed.setDescription("🛑・Command yang dijalankan sedang cooldown!");
                return data.message.reply({ embeds: [embed] });

            case Identifiers.PreconditionClientPermissions || Identifiers.PreconditionClientPermissionsNoPermissions:
                embed.setDescription(`🛑・Bot tidak memiliki izin!`);
                return data.message.reply({ embeds: [embed] });

            case Identifiers.PreconditionUserPermissions || Identifiers.PreconditionUserPermissionsNoPermissions:
                embed.setDescription("🛑・User tidak memiliki izin!");
                return data.message.reply({ embeds: [embed] });

            case Identifiers.PreconditionOwnerOnly:
                embed.setDescription("🛑・Hanya owner yang dapat menjalankan command ini!");
                return data.message.reply({ embeds: [embed] });

            case Identifiers.PreconditionAdminOnly:
                embed.setDescription("🛑・Hanya admin yang dapat menjalankan command ini!");
                return data.message.reply({ embeds: [embed] });

            case Identifiers.PreconditionModeratorOnly:
                embed.setDescription("🛑・Hanya moderator yang dapat menjalankan command ini!");
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
                embed.setDescription("🛑・Command yang dijalankan sedang cooldown!");
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionClientPermissions || Identifiers.PreconditionClientPermissionsNoPermissions:
                embed.setDescription(`🛑・Bot tidak memiliki izin!`);
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionUserPermissions || Identifiers.PreconditionUserPermissionsNoPermissions:
                embed.setDescription("🛑・User tidak memiliki izin!");
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionOwnerOnly:
                embed.setDescription("🛑・Hanya owner yang dapat menjalankan command ini!");
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionAdminOnly:
                embed.setDescription("🛑・Hanya admin yang dapat menjalankan command ini!");
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionModeratorOnly:
                embed.setDescription("🛑・Hanya moderator yang dapat menjalankan command ini!");
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
                embed.setDescription("🛑・Command yang dijalankan sedang cooldown!");
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionClientPermissions || Identifiers.PreconditionClientPermissionsNoPermissions:
                embed.setDescription(`🛑・Bot tidak memiliki izin!`);
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionUserPermissions || Identifiers.PreconditionUserPermissionsNoPermissions:
                embed.setDescription("🛑・User tidak memiliki izin!");
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionOwnerOnly:
                embed.setDescription("🛑・Hanya owner yang dapat menjalankan command ini!");
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionAdminOnly:
                embed.setDescription("🛑・Hanya admin yang dapat menjalankan command ini!");
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionModeratorOnly:
                embed.setDescription("🛑・Hanya moderator yang dapat menjalankan command ini!");
                return data.interaction.reply({ embeds: [embed] });

            default:
                embed.setDescription(`🛑・${error.identifier}\n\`\`\`${error.message}\`\`\``);
                return data.interaction.reply({ embeds: [embed] });
        }
    }
}
