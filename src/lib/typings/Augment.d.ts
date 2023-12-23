import * as Preconditions from "../../preconditions";
import { TimeUtilities } from "../../utilities/TimeUtility";

declare module "@sapphire/framework" {
    interface Preconditions {
        OwnerOnly: never;
        AdminOnly: never;
        ModeratorOnly: never;
    }

    const enum Identifiers {
        PreconditionOwnerOnly = "preconditionOwnerOnly",
        PreconditionAdminOnly = "preconditionAdminOnly",
        PreconditionModeratorOnly = "preconditionModeratorOnly",
    }
}
