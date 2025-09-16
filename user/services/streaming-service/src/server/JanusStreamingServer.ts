import axios from "axios";
import { randomUUID } from "crypto";
import { StreamingConfig } from "../config/streaming.config";

interface StreamOptions {
  eventId: string;
  isVR?: boolean;
  record?: boolean;
}

export class JanusStreamingServer {
  private janusUrl: string;

  constructor() {
    this.janusUrl = StreamingConfig.janus.url;
  }

  /**
   * Create a VideoRoom session for an event
   */
  async createRoom(options: StreamOptions): Promise<{ roomId: string; secret: string }> {
    const roomId = randomUUID();
    const secret = randomUUID();

    const pluginRequest = {
      request: "create",
      room: roomId,
      description: `Event ${options.eventId} room`,
      publishers: 50,
      is_private: true,
      pin: secret,
      record: options.record ?? false,
    };

    await axios.post(`${this.janusUrl}`, pluginRequest, {
      headers: { "Admin-Secret": StreamingConfig.janus.adminSecret },
    });

    return { roomId, secret };
  }

  /**
   * Generate WebRTC URLs / SDP info
   */
  async getPublisherOffer(roomId: string) {
    // Here we’d normally interact with Janus WebRTC plugin to get offer
    // For prototype, return a placeholder
    return {
      sdp: "placeholder_sdp_offer",
      janusRoomId: roomId,
    };
  }

  /**
   * Generate playback URL for viewers
   */
  getPlaybackUrl(roomId: string): string {
    return `https://your-server.com/janus/${roomId}/watch`; // Could proxy Janus stream
  }
}
