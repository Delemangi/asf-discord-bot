import type {CommandInteraction, Channel} from 'discord.js';

export async function replyToInteraction(interaction: CommandInteraction, message: string, language: string = ''): Promise<void> {
    let reply: boolean = false;

    for (const output of splitMessage(message, language)) {
        if (reply) {
            await interaction.followUp(output);
        } else {
            if (interaction.deferred) {
                await interaction.editReply(output);
            } else {
                await interaction.reply(output);
            }
        }

        reply = true;
    }
}

export async function printLog(channel: Channel, message: string) {
    if (channel.isText()) {
        for (const output of splitMessage(message)) {
            await channel.send(`${output}`);
        }
    }
}

function* splitMessage(message: string, language: string = ''): Generator<string, void> {
    const delimiters: string[] = ['\n', ' ', ','];
    let output: string;
    let index: number = message.length;
    let split: boolean;

    while (message) {
        if (message.length > 1900) {
            split = true;
            for (const char of delimiters) {
                index = message.substring(0, 1900).lastIndexOf(char) + 1;

                if (index) {
                    split = false;
                    break;
                }
            }

            if (split) {
                index = 1900;
            }

            output = `\`\`\`${language}\n${message.substring(0, index)}\`\`\``;
            message = message.slice(index);
        } else {
            output = `\`\`\`${language}\n${message}\`\`\``;
            message = '';
        }

        yield output;
    }
}
