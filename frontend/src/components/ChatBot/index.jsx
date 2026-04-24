import FloatingButton from './FloatingButton';
import ChatWindow from './ChatWindow';
import { useChatBot } from './useChatBot';

const ChatBot = () => {
  const {
    isOpen,
    messages,
    input,
    isLoading,
    messagesEndRef,
    handleSend,
    handleInputChange,
    toggleChat,
    setIsOpen
  } = useChatBot();

  return (
    <>
      {!isOpen && <FloatingButton onClick={toggleChat} />}
      {isOpen && (
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          input={input}
          messagesEndRef={messagesEndRef}
          onClose={() => setIsOpen(false)}
          onInputChange={handleInputChange}
          onSend={handleSend}
        />
      )}
    </>
  );
};

export default ChatBot;
