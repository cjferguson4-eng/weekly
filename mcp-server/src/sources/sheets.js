import { google } from "googleapis";
export class SheetsManager {
    auth = null;
    connected = false;
    async connect() {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
        if (!clientId || !clientSecret || !refreshToken) {
            return {
                success: false,
                message: "Google credentials not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN in .env",
            };
        }
        try {
            this.auth = new google.auth.OAuth2(clientId, clientSecret, "http://localhost");
            this.auth.setCredentials({
                refresh_token: refreshToken,
            });
            // Test the connection
            const drive = google.drive({ version: "v3", auth: this.auth });
            await drive.about.get({ fields: "user" });
            this.connected = true;
            return {
                success: true,
                message: "Connected to Google Sheets successfully",
            };
        }
        catch (error) {
            this.connected = false;
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                success: false,
                message: `Failed to connect to Google Sheets: ${errorMessage}`,
            };
        }
    }
    async listSheets(limit = 10) {
        if (!this.auth || !this.connected) {
            throw new Error("Google Sheets client not connected. Call connect() first.");
        }
        try {
            const drive = google.drive({ version: "v3", auth: this.auth });
            const response = await drive.files.list({
                pageSize: limit,
                fields: "files(id, name, webViewLink, modifiedTime)",
                q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
                orderBy: "modifiedTime desc",
            });
            const sheets = response.data.files?.map((file) => ({
                id: file.id,
                name: file.name,
                url: file.webViewLink,
                lastModified: file.modifiedTime,
            })) || [];
            return sheets;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to list Google Sheets: ${errorMessage}`);
        }
    }
    async readSheet(spreadsheetId, range) {
        if (!this.auth || !this.connected) {
            throw new Error("Google Sheets client not connected. Call connect() first.");
        }
        try {
            const sheets = google.sheets({ version: "v4", auth: this.auth });
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            });
            return response.data.values || [];
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to read sheet data: ${errorMessage}`);
        }
    }
    async getSheetInfo(spreadsheetId) {
        if (!this.auth || !this.connected) {
            throw new Error("Google Sheets client not connected. Call connect() first.");
        }
        try {
            const sheets = google.sheets({ version: "v4", auth: this.auth });
            const response = await sheets.spreadsheets.get({
                spreadsheetId,
            });
            return {
                id: response.data.spreadsheetId,
                title: response.data.properties?.title,
                sheets: response.data.sheets?.map((sheet) => ({
                    title: sheet.properties?.title,
                    sheetId: sheet.properties?.sheetId,
                    rowCount: sheet.properties?.gridProperties?.rowCount,
                    columnCount: sheet.properties?.gridProperties?.columnCount,
                })),
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to get sheet info: ${errorMessage}`);
        }
    }
    disconnect() {
        this.auth = null;
        this.connected = false;
    }
    isConnected() {
        return this.connected;
    }
}
//# sourceMappingURL=sheets.js.map