export interface SlackConversation {
    id: string;
    name: string;
    isPrivate: boolean;
    memberCount?: number;
    purpose?: string;
}
export declare class SlackManager {
    private client;
    private connected;
    connect(): Promise<{
        success: boolean;
        message: string;
    }>;
    getConversations(limit?: number, types?: string): Promise<SlackConversation[]>;
    getConversationHistory(channelId: string, limit?: number): Promise<any[]>;
    disconnect(): void;
    isConnected(): boolean;
}
