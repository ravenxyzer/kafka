import { PreconditionOptions, AllFlowsPrecondition, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import type { Message } from "discord.js";

import { AdminIds } from "../lib";

@ApplyOptions<PreconditionOptions>({
    name: "OwnerOnly",
})
export class OwnerOnlyPrecondition extends AllFlowsPrecondition {
    public override async messageRun(message: Message) {
        return AdminIds[0].includes(message.author.id)
            ? this.ok()
            : this.error({
                  identifier: "preconditionOwnerOnly",
              });
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        return AdminIds[0].includes(interaction.user.id)
            ? this.ok()
            : this.error({
                  identifier: "preconditionOwnerOnly",
              });
    }

    public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
        return AdminIds[0].includes(interaction.user.id)
            ? this.ok()
            : this.error({
                  identifier: "preconditionOwnerOnly",
              });
    }
}
