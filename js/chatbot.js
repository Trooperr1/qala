/**
 * JAFF STUDIO - AI Chatbot Widget
 *
 * Features:
 * - FAQ answering
 * - Lead qualification
 * - Consultation booking
 * - Conversation memory
 * - Ready for AI API integration (OpenAI, Claude, etc.)
 */

class JAFFChatbot {
    constructor() {
        this.isOpen = false;
        this.conversationHistory = [];
        this.userName = null;
        this.userEmail = null;
        this.leadScore = 0;
        this.currentFlow = null;

        // Knowledge base with FAQ patterns
        this.knowledgeBase = {
            greeting: {
                patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
                responses: [
                    "Hi there! 👋 I'm JAFF's AI assistant. I can help you learn about our AI solutions, web development, and social media services. What brings you here today?",
                    "Hello! Welcome to JAFF STUDIO. I'm here to answer questions about our services or help you book a free consultation. How can I assist you?",
                    "Hey! Great to see you. I can help with questions about AI chatbots, custom websites, or our pricing. What would you like to know?"
                ]
            },
            services: {
                patterns: ['service', 'what do you do', 'what do you offer', 'help with'],
                responses: [
                    "We specialize in three main areas:\n\n🤖 **AI Solutions** - Custom chatbots, voice agents, and AI automation\n💻 **Web Development** - Premium websites, e-commerce, and web apps\n📱 **Social Media Management** - Strategy, content creation, and growth\n\nWhich area interests you most?"
                ]
            },
            aiChatbot: {
                patterns: ['chatbot', 'ai bot', 'conversational ai', 'voice agent', 'automation'],
                responses: [
                    "Our AI chatbots are perfect for businesses looking to automate customer support and lead qualification! 🤖\n\n**Key features:**\n✅ 24/7 customer support\n✅ Handles 60% of common questions\n✅ Qualifies leads automatically\n✅ Integrates with your systems\n✅ Multilingual support (50+ languages)\n\n**Pricing:** Starting at $2,500 for a custom chatbot\n\nWould you like to see a demo or discuss your specific needs?"
                ]
            },
            webDevelopment: {
                patterns: ['website', 'web design', 'web development', 'ecommerce', 'online store'],
                responses: [
                    "We build high-performance websites that convert! 💻\n\n**Our process:**\n1️⃣ Discovery & Strategy\n2️⃣ Custom Design\n3️⃣ Development & Testing\n4️⃣ Launch & Optimization\n\n**Typical pricing:**\n• Landing page: $2,500 - $5,000\n• Business website: $5,000 - $15,000\n• E-commerce: $15,000 - $50,000\n• Custom app: $50,000+\n\nWhat type of website are you looking for?"
                ]
            },
            pricing: {
                patterns: ['cost', 'price', 'pricing', 'how much', 'budget', 'expensive', 'affordable'],
                responses: [
                    "Great question! Our pricing depends on your specific needs, but here's a quick overview:\n\n**AI Solutions:** $2,500 - $25,000\n**Web Development:** $2,500 - $50,000+\n**Social Media:** $1,500 - $5,000/month\n\nWe offer three package tiers: Starter, Professional, and Enterprise.\n\nWhat's your approximate budget range? This helps me recommend the best option for you."
                ]
            },
            timeline: {
                patterns: ['how long', 'timeline', 'duration', 'when', 'deadline', 'time frame'],
                responses: [
                    "Project timelines vary based on complexity:\n\n⏱️ **Typical timelines:**\n• AI Chatbot: 2-4 weeks\n• Landing Page: 1-2 weeks\n• Business Website: 4-8 weeks\n• E-commerce Site: 8-12 weeks\n• Custom Application: 12+ weeks\n\nWe can also offer rush delivery for urgent projects (+30% fee).\n\nDo you have a specific deadline in mind?"
                ]
            },
            process: {
                patterns: ['process', 'how it works', 'workflow', 'methodology', 'steps'],
                responses: [
                    "Our proven 5-step process ensures exceptional results:\n\n**1. Discovery Call** (30 min, free)\n→ Understand your needs and goals\n\n**2. Strategy & Planning** (1 week)\n→ Create detailed project roadmap\n\n**3. Development** (2-8 weeks)\n→ Build and iterate based on feedback\n\n**4. Testing & Refinement** (1 week)\n→ Quality assurance and optimization\n\n**5. Launch & Support** (Ongoing)\n→ Deploy and provide continued support\n\nWant to start with a free discovery call?"
                ]
            },
            portfolio: {
                patterns: ['portfolio', 'work', 'examples', 'case study', 'clients', 'previous projects'],
                responses: [
                    "We've delivered successful projects across various industries! 🎯\n\n**Recent highlights:**\n• E-commerce chatbot: 45% reduction in support tickets\n• SaaS website: 3x increase in demo bookings\n• Social media campaign: 200% follower growth in 90 days\n\nYou can see detailed case studies on our portfolio page, or I can send you industry-specific examples.\n\nWhat industry are you in?"
                ]
            },
            contact: {
                patterns: ['contact', 'email', 'phone', 'call', 'reach you', 'get in touch'],
                responses: [
                    "I'd love to connect you with our team! 📞\n\n**Contact options:**\n• Book a free 30-min consultation (recommended)\n• Email: contact@jaffstudio.com\n• WhatsApp: [Your number]\n• Fill out our contact form\n\nWould you like to book a consultation now? I can help you schedule it right here."
                ]
            },
            booking: {
                patterns: ['book', 'schedule', 'consultation', 'appointment', 'meeting', 'call'],
                responses: [
                    "Perfect! Let's get you scheduled for a free 30-minute consultation. 📅\n\nDuring this call, we'll:\n✅ Discuss your specific needs\n✅ Provide personalized recommendations\n✅ Answer all your questions\n✅ Give you a custom quote\n\nTo book, I'll need:\n1️⃣ Your name\n2️⃣ Your email\n3️⃣ Brief description of your project\n\nWhat's your name?"
                ]
            },
            location: {
                patterns: ['where', 'location', 'based', 'switzerland', 'swiss'],
                responses: [
                    "We're proudly based in Switzerland! 🇨🇭\n\nWhile we're located in Switzerland, we serve clients worldwide. We work remotely with businesses across Europe, North America, and beyond.\n\nOur Swiss base means:\n✅ High-quality standards\n✅ Data privacy compliance (nFADP)\n✅ Reliable European timezone support\n✅ Multilingual team (EN, DE, FR)\n\nWhere are you located?"
                ]
            },
            guarantee: {
                patterns: ['guarantee', 'refund', 'money back', 'satisfaction', 'warranty'],
                responses: [
                    "We stand behind our work with confidence! 💯\n\n**Our guarantees:**\n✅ Satisfaction guarantee: Unlimited revisions until you're happy\n✅ On-time delivery: Or you get 10% off\n✅ Quality assurance: Thorough testing before launch\n✅ 30-day support: Free bug fixes and adjustments\n✅ Source code ownership: You own everything we build\n\nWe don't offer refunds after work begins, but we work closely with you throughout to ensure you love the result.\n\nAny other concerns I can address?"
                ]
            },
            support: {
                patterns: ['support', 'maintenance', 'updates', 'help after launch', 'ongoing'],
                responses: [
                    "We offer comprehensive post-launch support! 🛠️\n\n**Support options:**\n\n**Included (30 days):**\n• Bug fixes\n• Minor adjustments\n• Technical support\n\n**Ongoing plans:**\n• Basic: $500/month (updates, monitoring)\n• Professional: $1,500/month (+ content, SEO)\n• Enterprise: Custom (dedicated support)\n\n**One-time services:**\n• Feature additions\n• Design updates\n• Performance optimization\n\nMost clients choose a support plan for peace of mind. Interested?"
                ]
            },
            thanks: {
                patterns: ['thank', 'thanks', 'appreciate'],
                responses: [
                    "You're very welcome! 😊 Is there anything else I can help you with?",
                    "Happy to help! Feel free to ask if you have more questions.",
                    "My pleasure! Let me know if you need anything else."
                ]
            },
            goodbye: {
                patterns: ['bye', 'goodbye', 'see you', 'talk later', 'gtg'],
                responses: [
                    "Thanks for chatting! Feel free to reach out anytime. Have a great day! 👋",
                    "Goodbye! Don't hesitate to come back if you have more questions. 🙌",
                    "Talk soon! You can always reopen this chat if you need anything. ✨"
                ]
            }
        };

        this.init();
    }

    init() {
        this.createChatWidget();
        this.loadConversationHistory();
        this.attachEventListeners();
    }

    createChatWidget() {
        const widget = document.createElement('div');
        widget.id = 'jaff-chatbot';
        widget.innerHTML = `
            <!-- Chat Button -->
            <button class="chatbot-toggle" id="chatbot-toggle">
                <svg class="chatbot-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <svg class="chatbot-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span class="chatbot-badge" id="chatbot-badge">1</span>
            </button>

            <!-- Chat Window -->
            <div class="chatbot-window" id="chatbot-window">
                <!-- Header -->
                <div class="chatbot-header">
                    <div class="chatbot-header-info">
                        <div class="chatbot-avatar">
                            <span>🤖</span>
                        </div>
                        <div>
                            <div class="chatbot-title">JAFF AI Assistant</div>
                            <div class="chatbot-status">
                                <span class="status-dot"></span>
                                Online • Typically replies instantly
                            </div>
                        </div>
                    </div>
                    <button class="chatbot-minimize" onclick="jaffChatbot.toggle()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>

                <!-- Messages -->
                <div class="chatbot-messages" id="chatbot-messages">
                    <div class="chatbot-message bot-message">
                        <div class="message-avatar">🤖</div>
                        <div class="message-content">
                            <p>Hi! I'm JAFF's AI assistant. 👋</p>
                            <p>I can help you with:</p>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Learn about our AI, web, and social media services</li>
                                <li>Get pricing information</li>
                                <li>Book a free consultation</li>
                                <li>Answer any questions</li>
                            </ul>
                            <p><strong>What would you like to know?</strong></p>
                        </div>
                    </div>
                </div>

                <!-- Quick Replies -->
                <div class="chatbot-quick-replies" id="chatbot-quick-replies">
                    <button class="quick-reply" onclick="jaffChatbot.sendQuickReply('Tell me about your AI chatbot services')">
                        🤖 AI Chatbots
                    </button>
                    <button class="quick-reply" onclick="jaffChatbot.sendQuickReply('What are your web development packages?')">
                        💻 Web Development
                    </button>
                    <button class="quick-reply" onclick="jaffChatbot.sendQuickReply('How much does it cost?')">
                        💰 Pricing
                    </button>
                    <button class="quick-reply" onclick="jaffChatbot.sendQuickReply('I want to book a consultation')">
                        📅 Book Consultation
                    </button>
                </div>

                <!-- Input -->
                <form class="chatbot-input-form" id="chatbot-form">
                    <input
                        type="text"
                        class="chatbot-input"
                        id="chatbot-input"
                        placeholder="Type your message..."
                        autocomplete="off"
                    />
                    <button type="submit" class="chatbot-send">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </form>

                <!-- Powered By -->
                <div class="chatbot-footer">
                    <small>Powered by JAFF AI • <a href="services.html">Get Your Own Chatbot</a></small>
                </div>
            </div>
        `;

        document.body.appendChild(widget);
    }

    attachEventListeners() {
        // Toggle button
        document.getElementById('chatbot-toggle').addEventListener('click', () => this.toggle());

        // Form submission
        document.getElementById('chatbot-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleUserMessage();
        });

        // Enter key
        document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleUserMessage();
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const toggle = document.getElementById('chatbot-toggle');
        const window = document.getElementById('chatbot-window');
        const badge = document.getElementById('chatbot-badge');

        if (this.isOpen) {
            toggle.classList.add('active');
            window.classList.add('active');
            badge.style.display = 'none';
            document.getElementById('chatbot-input').focus();

            // Track event
            if (typeof ConversionTracker !== 'undefined') {
                ConversionTracker.track('chatbot_opened');
            }
        } else {
            toggle.classList.remove('active');
            window.classList.remove('active');
        }
    }

    handleUserMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();

        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTyping();

        // Process message and respond
        setTimeout(() => {
            this.hideTyping();
            this.processMessage(message);
        }, 1000 + Math.random() * 1000); // Random delay 1-2s for realism
    }

    sendQuickReply(message) {
        document.getElementById('chatbot-input').value = message;
        this.handleUserMessage();

        // Hide quick replies after first use
        document.getElementById('chatbot-quick-replies').style.display = 'none';
    }

    addMessage(text, sender, isHTML = false) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}-message`;

        if (sender === 'bot') {
            messageDiv.innerHTML = `
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    ${isHTML ? text : this.formatMessage(text)}
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    ${isHTML ? text : this.escapeHTML(text)}
                </div>
            `;
        }

        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();

        // Save to history
        this.conversationHistory.push({ text, sender, timestamp: Date.now() });
        this.saveConversationHistory();
    }

    formatMessage(text) {
        // Convert markdown-like formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/• /g, '• ');
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showTyping() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTyping() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();

        // Check for patterns in knowledge base
        for (const [category, data] of Object.entries(this.knowledgeBase)) {
            for (const pattern of data.patterns) {
                if (lowerMessage.includes(pattern)) {
                    const response = Array.isArray(data.responses)
                        ? data.responses[Math.floor(Math.random() * data.responses.length)]
                        : data.responses;

                    this.addMessage(response, 'bot');

                    // Track successful match
                    if (typeof ConversionTracker !== 'undefined') {
                        ConversionTracker.track('chatbot_faq_matched', { category });
                    }

                    return;
                }
            }
        }

        // If no pattern matched, provide helpful fallback
        this.handleUnknownQuery(message);
    }

    handleUnknownQuery(message) {
        const responses = [
            "That's a great question! While I'm still learning, I can connect you with our team who can give you a detailed answer. Would you like to book a free consultation?",
            "I want to make sure you get the best answer. Could you rephrase that, or would you like me to connect you with a specialist who can help?",
            "Hmm, I'm not quite sure about that one. Here's what I can definitely help with:\n\n• AI chatbot services\n• Web development\n• Pricing and packages\n• Booking a consultation\n\nWhat would you like to know more about?"
        ];

        this.addMessage(responses[Math.floor(Math.random() * responses.length)], 'bot');

        // Track unknown query for improvement
        if (typeof ConversionTracker !== 'undefined') {
            ConversionTracker.track('chatbot_unknown_query', { query: message });
        }
    }

    saveConversationHistory() {
        try {
            localStorage.setItem('jaff_chatbot_history', JSON.stringify(this.conversationHistory));
        } catch (e) {
            console.log('Could not save conversation history');
        }
    }

    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('jaff_chatbot_history');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
                // Optionally restore messages (not implemented to keep chat clean on page reload)
            }
        } catch (e) {
            console.log('Could not load conversation history');
        }
    }
}

// Initialize chatbot when DOM is ready
let jaffChatbot;
document.addEventListener('DOMContentLoaded', () => {
    jaffChatbot = new JAFFChatbot();

    // Show badge with bounce animation after 3 seconds
    setTimeout(() => {
        const badge = document.getElementById('chatbot-badge');
        if (badge && !jaffChatbot.isOpen) {
            badge.style.display = 'flex';
            badge.classList.add('bounce');
        }
    }, 3000);
});
