import { ColorResolvable, PresenceData, ActivitiesOptions, ActivityType } from "discord.js";

/**
 * @description Administrator Discord UserId's
 */
export const AdminIds: string[] = ["387886389800337409", "576425042452283412"];

/**
 * @description Colors
 */
export const Colors = {
    primary: "#960078" as ColorResolvable,
    secondary: "#b4b4b4" as ColorResolvable,
    success: "#1cc200" as ColorResolvable,
    error: "#ff0004" as ColorResolvable,
};

/**
 * @description Custom Emojis
 */
export const Emojis = {
    checkmark: "<:checkmark:1080037252765335572>",
    redcross: "<:red_cross:1083636400689262624>",
};

/**
 * @description Client Presences
 */
export const Presences: ActivitiesOptions[] = [
    { name: "Trailblazer's Journey", type: ActivityType.Watching },
    { name: "Pom-pom Cuteness", type: ActivityType.Watching },
    { name: "With Silverwolf", type: ActivityType.Playing },
];
