import { PreconditionOptions, AllFlowsPrecondition, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import type { Message } from "discord.js";

import { AdminIds } from "../lib";

@ApplyOptions<PreconditionOptions>({
    name: "AdminOnly",
})
export class AdminOnlyPrecondition extends AllFlowsPrecondition {
    public override async messageRun(message: Message) {
        return AdminIds.includes(message.author.id)
            ? this.ok()
            : this.error({
                  identifier: "preconditionAdminOnly",
              });
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        return AdminIds.includes(interaction.user.id)
            ? this.ok()
            : this.error({
                  identifier: "preconditionAdminOnly",
              });
    }

    public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
        return AdminIds.includes(interaction.user.id)
            ? this.ok()
            : this.error({
                  identifier: "preconditionAdminOnly",
              });
    }
}
