export interface ZoomMeeting {
    id: string;
    topic: string;
    startTime: string;
    duration: number;
    participants?: number;
    recordingUrl?: string;
}
export declare class ZoomManager {
    private accessToken;
    private connected;
    connect(): Promise<{
        success: boolean;
        message: string;
    }>;
    getMeetings(from?: string, to?: string, limit?: number): Promise<ZoomMeeting[]>;
    disconnect(): void;
    isConnected(): boolean;
}
