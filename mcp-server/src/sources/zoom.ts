export interface ZoomMeeting {
  id: string;
  topic: string;
  startTime: string;
  duration: number;
  participants?: number;
  recordingUrl?: string;
}

export class ZoomManager {
  private accessToken: string | null = null;
  private connected: boolean = false;

  async connect(): Promise<{ success: boolean; message: string }> {
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;
    const accountId = process.env.ZOOM_ACCOUNT_ID;

    if (!clientId || !clientSecret || !accountId) {
      return {
        success: false,
        message: "Zoom credentials not configured. Please set ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, and ZOOM_ACCOUNT_ID in .env",
      };
    }

    try {
      // Get Server-to-Server OAuth token
      const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`;
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) {
        throw new Error(`Zoom OAuth failed: ${response.statusText}`);
      }

      const data = await response.json() as any;
      this.accessToken = data.access_token;
      this.connected = true;

      return {
        success: true,
        message: "Connected to Zoom successfully",
      };
    } catch (error) {
      this.connected = false;
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        message: `Failed to connect to Zoom: ${errorMessage}`,
      };
    }
  }

  async getMeetings(
    from?: string,
    to?: string,
    limit: number = 30
  ): Promise<ZoomMeeting[]> {
    if (!this.accessToken || !this.connected) {
      throw new Error("Zoom client not connected. Call connect() first.");
    }

    try {
      // Get user ID first
      const userResponse = await fetch("https://api.zoom.us/v2/users/me", {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error(`Failed to get user info: ${userResponse.statusText}`);
      }

      const userData = await userResponse.json() as any;
      const userId = userData.id;

      // Get meetings
      let url = `https://api.zoom.us/v2/users/${userId}/meetings?type=scheduled&page_size=${limit}`;
      
      if (from) {
        url += `&from=${from}`;
      }
      if (to) {
        url += `&to=${to}`;
      }

      const meetingsResponse = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!meetingsResponse.ok) {
        throw new Error(`Failed to fetch meetings: ${meetingsResponse.statusText}`);
      }

      const data = await meetingsResponse.json() as any;
      
      const meetings: ZoomMeeting[] = data.meetings?.map((meeting: any) => ({
        id: meeting.id,
        topic: meeting.topic,
        startTime: meeting.start_time,
        duration: meeting.duration,
        participants: meeting.participant_count,
      })) || [];

      return meetings;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch Zoom meetings: ${errorMessage}`);
    }
  }

  disconnect() {
    this.accessToken = null;
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

