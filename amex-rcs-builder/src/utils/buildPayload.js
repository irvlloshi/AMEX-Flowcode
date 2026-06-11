export function buildSuggestion(s) {
  if (s.type === 'reply') return { reply: { text: s.text, postbackData: s.value } };
  if (s.type === 'url') return { action: { text: s.text, postbackData: 'action_' + s.text.toLowerCase().replace(/\s/g, '_'), openUrlAction: { url: s.value } } };
  if (s.type === 'dial') return { action: { text: s.text, postbackData: 'dial_' + s.text.toLowerCase().replace(/\s/g, '_'), dialAction: { phoneNumber: s.value } } };
  return {};
}

export function buildPayload(step) {
  if (step.type === 'text') {
    if (step.data.suggestions?.length) {
      return { message_type: 'custom', custom: { contentMessage: { text: step.data.text, suggestions: step.data.suggestions.map(buildSuggestion) } } };
    }
    return { message_type: 'text', text: step.data.text };
  }
  if (step.type === 'suggested_replies') {
    return { message_type: 'custom', custom: { contentMessage: { text: step.data.text, suggestions: step.data.suggestions.map(buildSuggestion) } } };
  }
  if (step.type === 'standalone_card') {
    const cardContent = { title: step.data.title, description: step.data.description, suggestions: step.data.suggestions.map(buildSuggestion) };
    if (step.data.mediaUrl) cardContent.media = { height: step.data.mediaHeight, contentInfo: { fileUrl: step.data.mediaUrl, forceRefresh: 'false' } };
    return { message_type: 'custom', custom: { contentMessage: { richCard: { standaloneCard: { cardOrientation: step.data.orientation, cardContent } } } } };
  }
  if (step.type === 'carousel') {
    return {
      message_type: 'custom', custom: { contentMessage: { richCard: { carouselCard: {
        cardWidth: step.data.cardWidth,
        cardContents: (step.data.cards || []).map(card => {
          const cc = { title: card.title, description: card.description, suggestions: (card.suggestions || []).map(buildSuggestion) };
          if (card.mediaUrl?.trim()) cc.media = { height: card.mediaHeight || 'MEDIUM', contentInfo: { fileUrl: card.mediaUrl, forceRefresh: 'false' } };
          return cc;
        })
      } } } }
    };
  }
  if (step.type === 'open_url') {
    return { message_type: 'custom', custom: { contentMessage: { text: step.data.text, suggestions: [{ action: { text: step.data.buttonLabel, postbackData: step.data.postbackData, openUrlAction: { url: step.data.url } } }] } } };
  }
  if (step.type === 'dial') {
    return { message_type: 'custom', custom: { contentMessage: { text: step.data.text, suggestions: [{ action: { text: step.data.buttonLabel, postbackData: step.data.postbackData, dialAction: { phoneNumber: step.data.phoneNumber } } }] } } };
  }
  return {};
}

export function buildPayloads(steps) {
  return steps.map(buildPayload);
}