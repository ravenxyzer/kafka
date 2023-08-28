import { Utility } from "@sapphire/plugin-utilities-store";
import { ApplyOptions } from "@sapphire/decorators";

@ApplyOptions<Utility.Options>({
    name: "service",
})
export class ServiceUtilities extends Utility {
    /**
     * @description Convert commandName and commandId into command mention.
     */
    public commandMention(commandName: string, commandId: string): string {
        return `</${commandName}:${commandId}>`;
    }

    /**
     * @description Capitalize the first letter of a string.
     */
    public capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * @description Get random number with minimum and maximum limits.
     */
    public getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * @description Pad a string with a certain length.
     */
    pad(num: number, size: number): string {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    /**
     * @description Randomize a array.
     */
    randomArray(array: string[]): string {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * @descriptionet Random integer between min and max, inclusive.
     */
    randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * @description Convert userId into user mention.
     */
    userMention(id: string): string {
        return `<@${id}>`;
    }

    /**
     * @description Trims a string to a certain length.
     */
    trimString(str: string, length: number): string {
        return str.length > length ? str.substring(0, length) + "..." : str;
    }
}

declare module "@sapphire/plugin-utilities-store" {
    export interface Utilities {
        service: ServiceUtilities;
    }
}
