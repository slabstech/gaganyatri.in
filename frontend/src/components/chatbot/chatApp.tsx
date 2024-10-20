import React, { useState } from 'react';
import ChatBot from 'react-chatbotify';

const MyChatBot = () => {
  const [form, setForm] = useState({});
  const formStyle = {
    marginTop: 10,
    marginLeft: 20,
    border: "1px solid #491d8d",
    padding: 10,
    borderRadius: 5,
    maxWidth: 300
  };

  const flow = {
    start: {
      message: "Hello there! What is your name?",
      function: (params) => setForm({...form, name: params.userInput}),
      path: "ask_age"
    },
    ask_age: {
      message: (params) => `Nice to meet you ${params.userInput}, what is your age?`,
      function: (params) => setForm({...form, age: params.userInput}),
      path: "ask_pet"
    },
    ask_pet: {
      message: "Do you own any pets?",
      options: ["Yes", "No"],
      chatDisabled: true,
      function: (params) => setForm({...form, pet_ownership: params.userInput}),
      path: "ask_choice"
    },
    ask_choice: {
      message: "Select at least 2 pets that you are comfortable to work with:",
      checkboxes: {
        items: ["Dog", "Cat", "Rabbit", "Hamster"],
        min: 2
      },
      chatDisabled: true,
      function: (params) => setForm({...form, pet_choices: params.userInput}),
      path: "ask_work_days"
    },
    ask_work_days: {
      message: "How many days can you work per week?",
      function: (params) => setForm({...form, num_work_days: params.userInput}),
      path: "end"
    },
    end: {
      message: "Thank you for your interest, we will get back to you shortly!",
      component: (
        <div style={formStyle}>
          <p>Name: {form.name}</p>
          <p>Age: {form.age}</p>
          <p>Pet Ownership: {form.pet_ownership}</p>
          <p>Pet Choices: {form.pet_choices}</p>
          <p>Num Work Days: {form.num_work_days}</p>
        </div>
      ),
      options: ["New Application"],
      chatDisabled: true,
      path: "start"
    }
  };

  return (
    <ChatBot
      settings={{
        general: { embedded: true },
        chatHistory: { storageKey: "example_basic_form" }
      }}
      flow={flow}
    />
  );
};

export default MyChatBot;
