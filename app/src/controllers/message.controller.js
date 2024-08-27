import db from "../models/index.js";

export async function createMessage(req, res) {
  try {
    const { message, to } = req.body;
    const messageString = message
      ? JSON.stringify(message)
      : JSON.stringify(req.body);
    const createdMessage = await db.Message.create({ message: messageString });
    const toObject = to || {
      whatsapp: process.env.GROUP_ID.split(","),
      discord: [process.env.URL_DISCORD],
      teams: [process.env.URL_TEAMS],
    };

    await associateMessageWithServices(createdMessage, toObject);

    res.status(201).json(formatResponse(createdMessage, toObject));
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a mensagem." });
  }
}

async function associateMessageWithServices(createdMessage, to) {
  for (const [serviceName, channels] of Object.entries(to)) {
    const service = await db.Service.findOne({ where: { name: serviceName } });

    if (service) {
      const channelsString = channels.join(",");
      await createdMessage.addService(service, {
        through: { channels: channelsString, send: false },
      });
    }
  }
}

function formatResponse(createdMessage, to) {
  return {
    id: createdMessage.id,
    message: createdMessage.message,
    services: Object.entries(to).map(([serviceName, channels]) => ({
      name: serviceName,
      channels,
    })),
  };
}

export async function getMessageById(req, res) {
  try {
    const messageId = req.params.id;

    const message = await db.Message.findByPk(messageId, {
      include: [
        {
          model: db.Service,
          as: "services",
          attributes: ["id"],
          through: { attributes: ["send", "channels"] },
        },
      ],
    });

    if (!message) {
      res.status(404).json({ error: "Mensagem não encontrada." });
      return;
    }

    const formattedMessage = {
      id: message.id,
      message: JSON.parse(message.message),
      services: message.services.map((service) => ({
        id: service.id,
        send: service.MessageService.send,
        channels: service.MessageService.channels
          ? service.MessageService.channels.split(",")
          : [],
      })),
    };

    res.json(formattedMessage);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a mensagem." });
  }
}

export async function getAllMessages(req, res) {
  try {
    const { send } = req.query;

    const filterOptions =
      send === "true"
        ? { send: true }
        : send === "false"
        ? { send: false }
        : {};

    const messages = await db.Message.findAll({
      include: [
        {
          model: db.Service,
          as: "services",
          attributes: ["id", "name"],
          through: {
            attributes: ["send", "channels"],
            where: filterOptions,
          },
        },
      ],
    });

    const formattedMessages = messages
      .filter((message) => message.services.length > 0)
      .map((message) => ({
        id: message.id,
        message: JSON.parse(message.message),
        services: message.services.map((service) => ({
          id: service.id,
          name: service.name,
          send: service.MessageService.send,
          channels: service.MessageService.channels
            ? service.MessageService.channels.split(",")
            : [],
        })),
      }));

    res.json(formattedMessages);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as mensagens." });
  }
}

export async function updateMessage(req, res) {
  try {
    const messageId = req.params.id;
    const { send, serviceId } = req.body;

    const message = await db.Message.findByPk(messageId);

    if (!message) {
      res.status(404).json({ error: "Mensagem não encontrada." });
      return;
    }

    const service = await db.Service.findByPk(serviceId);

    if (!service) {
      res.status(404).json({ error: "Serviço não encontrado." });
      return;
    }

    const association = await db.MessageService.findOne({
      where: { id_message: messageId, id_service: serviceId },
    });

    if (!association) {
      res
        .status(404)
        .json({ error: "O serviço não está associado a esta mensagem." });
      return;
    }

    await association.update({ send: send });

    res.json({ message: "Status de envio atualizado com sucesso." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar o status de envio da mensagem." });
  }
}

export async function deleteMessage(req, res) {
  try {
    const messageId = req.params.id;
    await db.Message.destroy({ where: { id: messageId } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir a mensagem." });
  }
}
