function addIcons(content) {
  const iconMappings = [
    { search: "PROBLEM:", replace: "❌ PROBLEM:" },
    { search: "WARNING:", replace: "⚠️ WARNING:" },
    { search: "RESOLVED:", replace: "✅ RESOLVED:" },
    { search: "OK:", replace: "✅ OK:" },
  ];

  return iconMappings.reduce((formattedContent, mapping) => {
    return formattedContent.replace(mapping.search, mapping.replace);
  }, content);
}

export function formatMessageTeams(message) {
  const { content, embeds } = message;
  const formattedMessageParts = [];
  if (content) {
    const { name, email } = parseMention(content);

    const formattedContent = content
      .replace(/<@(\+\d+)>/g, "")
      .replace(/@(\w+)\.(\w+)/, `<at>${name}</at>`);

    addContent(formattedMessageParts, formattedContent);
    if (name && email) {
      const msteams = generateMention(name, email);
      formattedMessageParts.push(msteams);
    }
  }

  if (embeds && embeds.length > 0) {
    const embed = embeds[0];
    addTitle(formattedMessageParts, embed?.title);
    addFields(formattedMessageParts, embed?.fields);
    addUrl(formattedMessageParts, embed?.url);
  }

  addSignature(formattedMessageParts);

  const adaptiveCards = generateAdaptiveCard(formattedMessageParts);
  return { type: "message", attachments: [adaptiveCards] };
}

function parseMention(content) {
  const reg = /@(\w+)\.(\w+)/;
  const name = content.match(reg)
    ? content.match(reg)[1].replace(/^\w/, (c) => c.toUpperCase()) +
      " " +
      content.match(reg)[2].replace(/^\w/, (c) => c.toUpperCase())
    : "";

  const email = content.match(reg)
    ? content.match(reg)[0].slice(1) + "@test.com.br"
    : "";
  return { name, email };
}

function generateMention(name, email) {
  return {
    msteams: {
      entities: [
        {
          type: "mention",
          text: `<at>${name}</at>`,
          mentioned: {
            id: email,
            name: name,
          },
        },
      ],
    },
  };
}

function generateAdaptiveCard(formattedMessageParts) {
  const msteamsContent = formattedMessageParts.find((part) => part.msteams);
  const body = formattedMessageParts.filter((part) => !part.msteams);

  return {
    contentType: "application/vnd.microsoft.card.adaptive",
    contentUrl: null,
    content: {
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      type: "AdaptiveCard",
      version: "1.2",
      body: body,
      ...(msteamsContent && msteamsContent),
    },
  };
}

function addContent(message, content) {
  const contentIcon = addIcons(content);
  message.push({ type: "TextBlock", text: `${contentIcon}\n`, wrap: true });
}

function addTitle(message, title) {
  message.push({ type: "TextBlock", text: `**${title}**\n\n` });
}

function addUrl(message, url) {
  message.push({
    type: "TextBlock",
    text: `**Saiba mais:** [${url}](${url})\n`,
  });
}

function addFields(message, fields) {
  fields?.forEach((field) => {
    if (field.name && field.value) {
      message.push({
        type: "TextBlock",
        text: `**${field.name}**: ${field.value}\n`,
        wrap: true,
      });
    }
  });
}

function addSignature(message) {
  message.push({
    type: "TextBlock",
    text: `\n--\nSent via ${process.env.HOSTNAME} v${process.env.APP_VERSION}`,
  });
}
