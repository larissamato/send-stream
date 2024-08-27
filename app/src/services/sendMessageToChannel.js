import db from "../models/index.js";
import { makeRequest } from "../helpers/api.js";
import { formatMessageTeams } from "../helpers/formatMessageTeams.js";

export async function sendMessageToChannel() {
  const messagesNotSend = await db.MessageService.findAll({
    where: { send: 0, id_service: 3 },
  });

  try {
    for (const messageNotSend of messagesNotSend) {
      const channels = messageNotSend.channels.split(",");
      const message = await db.Message.findByPk(messageNotSend.id_message);
      if (message) {
        channels.map(async (channel) => {
          await makeRequest(
            channel,
            "post",
            formatMessageTeams(JSON.parse(message.message))
          );
        });

        await messageNotSend.update({ send: true });
      }
    }
  } catch (error) {
    console.error("Error sending message", error);
  }
}
