export interface ChorusRecording {
  id: string;
  title: string;
  date: string;
  duration: number;
  participants: string[];
  transcriptUrl?: string;
  insights?: string[];
}

export class ChorusManager {
  private apiKey: string | null = null;
  private baseUrl: string;
  private connected: boolean = false;

  constructor() {
    this.baseUrl = process.env.CHORUS_API_BASE_URL || "https://api.chorus.ai/v1";
  }

  async connect(): Promise<{ success: boolean; message: string }> {
    const apiKey = process.env.CHORUS_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        message: "Chorus.ai API key not configured. Please set CHORUS_API_KEY in .env",
      };
    }

    try {
      this.apiKey = apiKey;
      
      // Test the connection with a simple API call
      const response = await fetch(`${this.baseUrl}/account`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Chorus.ai authentication failed: ${response.statusText}`);
      }

      this.connected = true;

      return {
        success: true,
        message: "Connected to Chorus.ai successfully",
      };
    } catch (error) {
      this.connected = false;
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        message: `Failed to connect to Chorus.ai: ${errorMessage}`,
      };
    }
  }

  async getRecordings(
    from?: string,
    to?: string,
    limit: number = 20
  ): Promise<ChorusRecording[]> {
    if (!this.apiKey || !this.connected) {
      throw new Error("Chorus.ai client not connected. Call connect() first.");
    }

    try {
      let url = `${this.baseUrl}/calls?limit=${limit}`;
      
      if (from) {
        url += `&from=${from}`;
      }
      if (to) {
        url += `&to=${to}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch recordings: ${response.statusText}`);
      }

      const data = await response.json() as any;
      
      const recordings: ChorusRecording[] = data.calls?.map((call: any) => ({
        id: call.id,
        title: call.title || call.subject || "Untitled Call",
        date: call.date || call.start_time,
        duration: call.duration_seconds || 0,
        participants: call.participants?.map((p: any) => p.name || p.email) || [],
        transcriptUrl: call.transcript_url,
        insights: call.insights || [],
      })) || [];

      return recordings;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch Chorus.ai recordings: ${errorMessage}`);
    }
  }

  disconnect() {
    this.apiKey = null;
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

