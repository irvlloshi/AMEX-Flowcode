export const STEP_DEFAULTS = {
  text: {
    type: 'text', label: 'Text Message', icon: '💬',
    data: { text: 'Hi! Welcome to American Express. Ready to see how much your savings could grow?', suggestions: [] }
  },
  standalone_card: {
    type: 'standalone_card', label: 'Standalone Rich Card', icon: '🃏',
    data: {
      title: 'Watch Your Savings Work For You',
      description: 'Based on our current APY, a $10,000 deposit could earn you $435 in just one year.',
      mediaUrl: '', mediaHeight: 'MEDIUM', orientation: 'VERTICAL',
      suggestions: [
        { text: 'Apply Now', type: 'url', value: 'https://www.americanexpress.com/en-us/banking/online-savings/high-yield-savings-account/' },
        { text: 'Change Amount', type: 'reply', value: 'change_amount' },
        { text: 'Talk to an Agent', type: 'reply', value: 'escalate_human' }
      ]
    }
  },
  carousel: {
    type: 'carousel', label: 'Carousel', icon: '🎠',
    data: {
      cardWidth: 'MEDIUM',
      cards: [
        { title: 'No Monthly Fees', description: 'No fee to open, no minimum deposit.', mediaUrl: '', mediaHeight: 'MEDIUM', suggestions: [{ text: 'Learn More', type: 'reply', value: 'more_no_fees' }] },
        { title: 'Daily Compounding', description: 'Earn 4.35% APY. Interest compounds daily.', mediaUrl: '', mediaHeight: 'MEDIUM', suggestions: [{ text: 'Calculate', type: 'reply', value: 'start_calculator' }] }
      ]
    }
  },
  suggested_replies: {
    type: 'suggested_replies', label: 'Suggested Replies', icon: '💡',
    data: {
      text: 'How much would you like to start with?',
      suggestions: [
        { text: '$1,000', type: 'reply', value: 'amount_1000' },
        { text: '$5,000', type: 'reply', value: 'amount_5000' },
        { text: '$10,000', type: 'reply', value: 'amount_10000' },
        { text: 'Custom Amount', type: 'reply', value: 'amount_custom' }
      ]
    }
  },
  open_url: {
    type: 'open_url', label: 'Open URL Action', icon: '🔗',
    data: { text: 'Apply Now', buttonLabel: 'Open Application', url: 'https://www.americanexpress.com/en-us/banking/online-savings/high-yield-savings-account/', postbackData: 'apply_now' }
  },
  dial: {
    type: 'dial', label: 'Dial Action', icon: '📞',
    data: { text: 'Connect with a specialist', buttonLabel: 'Call Us Now', phoneNumber: '+18005280800', postbackData: 'dial_amex' }
  }
};

export const TEMPLATES = {
  welcome: [
    { ...STEP_DEFAULTS.text, data: { text: '👋 Hi! Welcome to American Express. Ready to see how much your savings could grow?\n\nOur High Yield Savings Account offers competitive APY with no monthly fees and daily compounding interest.', suggestions: [] } },
    { ...STEP_DEFAULTS.carousel },
    { ...STEP_DEFAULTS.suggested_replies }
  ],
  calculator: [{ ...STEP_DEFAULTS.standalone_card }],
  escalation: [{
    type: 'standalone_card', label: 'Standalone Rich Card', icon: '🃏',
    data: {
      title: 'Connect with American Express',
      description: 'A specialist is ready to help you with your High Yield Savings Account.',
      mediaUrl: '', mediaHeight: 'MEDIUM', orientation: 'VERTICAL',
      suggestions: [
        { text: 'Call Us Now', type: 'dial', value: '+18005280800' },
        { text: 'Voice AI Agent', type: 'url', value: 'https://www.americanexpress.com/en-us/banking/online-savings/high-yield-savings-account/' },
        { text: 'Back to Calculator', type: 'reply', value: 'back_to_calculator' }
      ]
    }
  }]
};