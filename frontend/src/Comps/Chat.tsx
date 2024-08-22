import React from 'react';

const messages = [
  { id: 1, text: 'Hello!', sender: 'me' },
  { id: 2, text: 'Hi there!', sender: 'other' },
  { id: 3, text: 'How are you?', sender: 'me' },
  { id: 4, text: 'I am good, thanks! How about you?', sender: 'other' },
];

const Chat = () => {
  return (
    <div className='flex flex-col gap-4 p-4 bg-gray-800 min-h-screen'>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === 'me' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-xs p-3 rounded-lg text-white shadow-md ${
              message.sender === 'me'
                ? 'bg-blue-600'
                : 'bg-gray-600'
            }`}
          >
            <div className="text-sm opacity-75 mb-1">
              {message.sender === 'me' ? 'You' : 'Other'}
            </div>
            {message.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chat;
