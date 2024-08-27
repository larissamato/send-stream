import cron from "node-cron";
import { sendMessageToChannel } from "./sendMessageToChannel.js";

cron.schedule("*/5 * * * * *", () => {
  console.log("Running send messages to webhooks...");
  sendMessageToChannel();
});
