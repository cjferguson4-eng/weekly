import { WebClient } from "@slack/web-api";
export class SlackManager {
    client = null;
    connected = false;
    async connect() {
        const token = process.env.SLACK_BOT_TOKEN || process.env.SLACK_USER_TOKEN;
        if (!token) {
            return {
                success: false,
                message: "Slack token not configured. Please set SLACK_BOT_TOKEN or SLACK_USER_TOKEN in .env",
            };
        }
        try {
            this.client = new WebClient(token);
            // Test the connection
            const authTest = await this.client.auth.test();
            this.connected = true;
            return {
                success: true,
                message: `Connected to Slack workspace: ${authTest.team}`,
            };
        }
        catch (error) {
            this.connected = false;
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                success: false,
                message: `Failed to connect to Slack: ${errorMessage}`,
            };
        }
    }
    async getConversations(limit = 20, types = "public_channel,private_channel") {
        if (!this.client || !this.connected) {
            throw new Error("Slack client not connected. Call connect() first.");
        }
        try {
            const result = await this.client.conversations.list({
                limit,
                types,
                exclude_archived: true,
            });
            const conversations = result.channels?.map((channel) => ({
                id: channel.id,
                name: channel.name || "Unknown",
                isPrivate: channel.is_private || false,
                memberCount: channel.num_members,
                purpose: channel.purpose?.value,
            })) || [];
            return conversations;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to fetch Slack conversations: ${errorMessage}`);
        }
    }
    async getConversationHistory(channelId, limit = 100) {
        if (!this.client || !this.connected) {
            throw new Error("Slack client not connected. Call connect() first.");
        }
        try {
            const result = await this.client.conversations.history({
                channel: channelId,
                limit,
            });
            return result.messages || [];
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to fetch conversation history: ${errorMessage}`);
        }
    }
    disconnect() {
        this.client = null;
        this.connected = false;
    }
    isConnected() {
        return this.connected;
    }
}
//# sourceMappingURL=slack.js.map