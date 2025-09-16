import { Router } from "express";
import { StreamingController } from "../controllers/StreamingController";

const router = Router();
const controller = new StreamingController();

router.post("/room", controller.createRoom);       // Event owner creates room
router.get("/room/:roomId/playback", controller.getPlayback); // Ticketed users

export default router;
