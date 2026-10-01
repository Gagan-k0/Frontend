import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ZoomService {
  private readonly logger = new Logger(ZoomService.name);

  async createMeeting(topic: string, startTime: Date, durationMin: number): Promise<string> {
    const accountId = process.env.ZOOM_ACCOUNT_ID;
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;

    if (!accountId || accountId === 'dummy_account_id') {
      this.logger.warn('Using dummy Zoom credentials. Generating a fake Zoom link.');
      // Return a fake zoom link for testing
      const fakeMeetingId = Math.floor(Math.random() * 10000000000).toString();
      return `https://zoom.us/j/${fakeMeetingId}?pwd=dummy`;
    }

    try {
      // 1. Get Server-to-Server OAuth Token
      const tokenRes = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        }
      });
      
      if (!tokenRes.ok) {
        throw new Error(`Zoom Auth Error: ${tokenRes.statusText}`);
      }
      
      const { access_token } = await tokenRes.json();

      // 2. Create Meeting
      const meetingRes = await fetch('https://api.zoom.us/v2/users/me/meetings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic,
          type: 2, // Scheduled meeting
          start_time: startTime.toISOString(),
          duration: durationMin,
          timezone: 'UTC',
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
            mute_upon_entry: true,
            waiting_room: true
          }
        })
      });

      if (!meetingRes.ok) {
        throw new Error(`Zoom API Error: ${meetingRes.statusText}`);
      }

      const meetingData = await meetingRes.json();
      return meetingData.join_url;
    } catch (error) {
      this.logger.error('Failed to create Zoom meeting', error);
      throw new Error('Could not create Zoom meeting. Please check your credentials.');
    }
  }
}
