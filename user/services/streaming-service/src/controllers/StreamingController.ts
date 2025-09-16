import { Request, Response } from "express";
import { JanusStreamingServer } from "../server/JanusStreamingServer";
import jwt from "jsonwebtoken";
import { StreamingConfig } from "../config/streaming.config";

export class StreamingController {
  private server = new JanusStreamingServer();

  /**
   * Only event owners with JWT can create room
   */
  createRoom = async (req: Request, res: Response) => {
    const { eventId, isVR, record } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
      jwt.verify(token, StreamingConfig.jwtSecret);
      const room = await this.server.createRoom({ eventId, isVR, record });
      const offer = await this.server.getPublisherOffer(room.roomId);
      res.json({ room, offer });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  /**
   * Ticketed user playback
   */
  getPlayback = async (req: Request, res: Response) => {
    const { roomId } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
      jwt.verify(token, StreamingConfig.jwtSecret); // verify ticket/user
      const url = this.server.getPlaybackUrl(roomId);
      res.json({ playbackUrl: url });
    } catch (err: any) {
      res.status(403).json({ error: "Forbidden" });
    }
  };
}
