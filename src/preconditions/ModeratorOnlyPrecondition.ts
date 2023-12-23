import { PreconditionOptions, AllFlowsPrecondition, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import type { Guild, GuildMember, Message, Role } from "discord.js";

@ApplyOptions<PreconditionOptions>({
    name: "ModeratorOnly",
})
export class ModeratorOnlyPrecondition extends AllFlowsPrecondition {
    private moderatorId: string = "1145597669591502888";

    public override async messageRun(message: Message) {
        const guild: Guild = this.container.client.guilds.cache.get("1068139995103244289");

        if (message.guild.id !== guild.id) return this.error({ identifier: "preconditionModeratorOnly" });
        if (!message.member.roles.cache.has(this.moderatorId)) return this.error({ identifier: "preconditionModeratorOnly" });

        return this.ok();
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const guild: Guild = this.container.client.guilds.cache.get("1068139995103244289");
        const member: GuildMember = interaction.guild.members.cache.get(interaction.user.id);

        if (interaction.guild.id !== guild.id) return this.error({ identifier: "preconditionModeratorOnly" });
        if (!member.roles.cache.has(this.moderatorId)) return this.error({ identifier: "preconditionModeratorOnly" });

        return this.ok();
    }

    public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
        const guild: Guild = this.container.client.guilds.cache.get("1068139995103244289");
        const member: GuildMember = interaction.guild.members.cache.get(interaction.user.id);

        if (interaction.guild.id !== guild.id) return this.error({ identifier: "preconditionModeratorOnly" });
        if (!member.roles.cache.has(this.moderatorId)) return this.error({ identifier: "preconditionModeratorOnly" });

        return this.ok();
    }
}
