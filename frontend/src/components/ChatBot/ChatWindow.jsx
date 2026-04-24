import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import LoadingIndicator from './LoadingIndicator';
import ChatInput from './ChatInput';

const ChatWindow = ({ 
  messages, 
  isLoading, 
  input, 
  messagesEndRef,
  onClose, 
  onInputChange, 
  onSend 
}) => {
  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
      <ChatHeader onClose={onClose} />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isLoading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        value={input}
        onChange={onInputChange}
        onSend={onSend}
        disabled={!input.trim() || isLoading}
      />
    </div>
  );
};

export default ChatWindow;
