import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your Garage Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Smart fallback response generator
  const generateFallbackResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Greetings
    if (input.match(/^(hi|hello|hey|good morning|good afternoon|good evening|howdy)/)) {
      return "Hello! Welcome to our Garage Management System. How can I assist you today? 😊";
    }
    
    // Appointment/Booking related
    if (input.includes('appointment') || input.includes('schedule') || input.includes('book') || input.includes('reserve')) {
      return "To schedule an appointment:\n1. Go to 'Appointment' page\n2. Select your vehicle\n3. Choose a service type\n4. Pick date and time\n5. Submit your request\n\nYou'll get confirmation once the admin reviews it.";
    }
    
    // Vehicle related
    if (input.includes('vehicle') || input.includes('car') || input.includes('truck') || input.includes('motorcycle')) {
      if (input.includes('add') || input.includes('new') || input.includes('register')) {
        return "To add a new vehicle:\n1. Go to 'My Vehicles' page\n2. Click 'Add Vehicle' button\n3. Enter vehicle details (name, model, plate number)\n4. Save\n\nYour vehicle will be ready for booking appointments!";
      }
      return "You can view and manage all your vehicles in the 'My Vehicles' section. From there, you can add, edit, or remove vehicles from your account.";
    }
    
    // Service related
    if (input.includes('service') || input.includes('repair') || input.includes('maintenance') || input.includes('fix')) {
      if (input.includes('price') || input.includes('cost') || input.includes('how much') || input.includes('fee')) {
        return "Service prices vary based on the type of service. You can see exact prices when you go to the Appointment page and select a service. We offer transparent pricing with no hidden fees!";
      }
      return "We offer various services including:\n• Oil change & maintenance\n• Engine repairs\n• Brake services\n• Tire services\n• General inspections\n• And more!\n\nCheck the Appointment page to see all available services.";
    }
    
    // Status related
    if (input.includes('status') || input.includes('progress') || input.includes('done') || input.includes('ready')) {
      return "To check your appointment status:\n1. Go to 'Dashboard' or 'History' page\n2. View your appointments list\n\nStatus meanings:\n🟡 Pending - Waiting for admin approval\n🔵 In Progress - Being worked on\n🟢 Completed - Finished and ready\n🔴 Cancelled - Appointment cancelled";
    }
    
    // Cancel related
    if (input.includes('cancel') || input.includes('delete') || input.includes('remove') || input.includes('stop')) {
      return "To cancel an appointment:\n1. Go to 'Dashboard' or 'History'\n2. Find the appointment you want to cancel\n3. Contact the admin for cancellation\n\nNote: Please cancel at least 24 hours before your scheduled time.";
    }
    
    // Help related - only trigger on specific help phrases
    if (input.match(/\b(help|assist|support)\b/) && !input.includes('computer') && !input.includes('what is') && !input.includes('meaning')) {
      return "I can help you with:\n\n📅 Scheduling appointments\n🚗 Managing your vehicles\n🔧 Service information\n📊 Checking appointment status\n❌ Cancelling appointments\n\nJust ask me anything about these topics!";
    }
    
    // Contact related
    if (input.includes('contact') || input.includes('phone') || input.includes('email') || input.includes('call') || input.includes('reach')) {
      return "For direct assistance:\n• Speak with the garage admin\n• Visit the garage in person\n• Or check your Dashboard for contact information\n\nOur team is ready to help you with any questions!";
    }
    
    // Time/When related
    if (input.includes('when') || input.includes('time') || input.includes('how long') || input.includes('duration')) {
      return "Appointment durations depend on the service type:\n• Basic maintenance: 30-60 minutes\n• Oil change: 30-45 minutes\n• Major repairs: 2-4 hours or more\n\nYou'll see estimated duration when booking. Check your Dashboard for specific appointment times.";
    }
    
    // Thank you
    if (input.includes('thank') || input.includes('thanks')) {
      return "You're welcome! 😊 I'm happy to help. If you have any other questions, feel free to ask!";
    }
    
    // Default response for non-garage questions
    return "I'm a garage management assistant, so I'm specialized in helping with:\n• Vehicle appointments & scheduling\n• Car services & repairs\n• Managing your vehicles\n• Appointment status tracking\n\nFor questions about \"" + userInput + "\", I may not be able to help. Please ask me about garage services, vehicles, or appointments instead! 😊";
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // If no API key, use fallback immediately
    if (!API_KEY) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: generateFallbackResponse(userMessage.content)
        }]);
        setIsLoading(false);
      }, 500);
      return;
    }

    try {
      console.log('Using API Key:', API_KEY?.substring(0, 20) + '...');

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.href,
          'X-Title': 'Garage Management System'
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct:free',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for a Garage Management System. You help clients with vehicle services, appointments, and general garage questions. Keep responses concise and friendly.'
            },
            ...messages.filter(m => m.role !== 'system'),
            userMessage
          ]
        })
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
      }

      if (data.choices && data.choices[0] && data.choices[0].message) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.choices[0].message.content
        }]);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Use fallback response instead of showing error
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: generateFallbackResponse(userMessage.content)
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-fade-in border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Garage Assistant</h3>
                <p className="text-xs text-blue-100">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  message.role === 'user' ? 'bg-blue-100' : 'bg-gray-200'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 shadow-sm rounded-bl-md border border-gray-100'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
