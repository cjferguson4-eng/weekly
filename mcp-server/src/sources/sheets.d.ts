export interface GoogleSheetInfo {
    id: string;
    name: string;
    url: string;
    lastModified?: string;
}
export declare class SheetsManager {
    private auth;
    private connected;
    connect(): Promise<{
        success: boolean;
        message: string;
    }>;
    listSheets(limit?: number): Promise<GoogleSheetInfo[]>;
    readSheet(spreadsheetId: string, range: string): Promise<any[][]>;
    getSheetInfo(spreadsheetId: string): Promise<any>;
    disconnect(): void;
    isConnected(): boolean;
}
