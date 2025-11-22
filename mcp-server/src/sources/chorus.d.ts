export interface ChorusRecording {
    id: string;
    title: string;
    date: string;
    duration: number;
    participants: string[];
    transcriptUrl?: string;
    insights?: string[];
}
export declare class ChorusManager {
    private apiKey;
    private baseUrl;
    private connected;
    constructor();
    connect(): Promise<{
        success: boolean;
        message: string;
    }>;
    getRecordings(from?: string, to?: string, limit?: number): Promise<ChorusRecording[]>;
    disconnect(): void;
    isConnected(): boolean;
}
