import React, { useState, useEffect, useRef } from "react";
import "./ChatBot.css";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const chatEndRef = useRef(null);

  const questions = [
    {
      q: "What type of job are you looking for?",
      options: ["Software Developer", "Web Designer", "Data Analyst", "HR Executive"],
      answers: [
        "Great! Software jobs are in demand 👨‍💻",
        "Nice! Designers build amazing UI 🎨",
        "Cool! Analysts turn data into decisions 📊",
        "HR builds company culture 🤝"
      ]
    },
    {
      q: "Preferred job type?",
      options: ["Full-time", "Internship", "Remote", "Hybrid"],
      answers: [
        "Full-time noted!",
        "Internship added 👍",
        "Remote is super popular now 🌍",
        "Hybrid work is growing 🏢🏠"
      ]
    },
    {
      q: "Experience level?",
      options: ["Fresher", "1-2 Years", "2-5 Years", "5+ Years"],
      answers: [
        "Fresher — exciting start 🚀",
        "Nice early experience!",
        "Solid experience level 👏",
        "Wow! Senior professional 💼"
      ]
    }
  ];

  useEffect(() => {
    setMessages([
      { sender: "bot", text: "👋 Hi! I am your RG Job Assistant." },
      { sender: "bot", text: questions[0].q, options: questions[0].options }
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOptionClick = (option, idx) => {
    const answer = questions[questionIndex].answers[idx];

    setMessages(prev => [
      ...prev,
      { sender: "user", text: option },
      { sender: "bot", text: answer }
    ]);

    const next = questionIndex + 1;

    if (next < questions.length) {
      setQuestionIndex(next);

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { sender: "bot", text: questions[next].q, options: questions[next].options }
        ]);
      }, 800);

    } else {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { sender: "bot", text: "✅ Thanks! I will suggest best jobs for you!" }
        ]);
      }, 600);
    }
  };

  return (
    <>
      {!open && (
        <div className="chatbot-button" onClick={() => setOpen(true)}>
          💬
        </div>
      )}

      {open && (
        <div className="chatbot-box animate-up">
        <div className="chatbot-header">
  <h4>RG Job Assistant</h4>

  <div className="header-buttons">
    {/* Minimize */}
    <button className="chatbot-min" onClick={() => setOpen(false)}>−</button>

    {/* Close (Reset chat) */}
    <button
      className="chatbot-cross"
      onClick={() => {
        setOpen(false);
        setMessages([]);
        setQuestionIndex(0);
        setTimeout(() => {
          setMessages([
            { sender: "bot", text: "👋 Hi! I am your RG Job Assistant." },
            { sender: "bot", text: questions[0].q, options: questions[0].options }
          ]);
        }, 200);
      }}
    >
      ✖
    </button>
  </div>
</div>


          <div className="chatbot-body">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.sender}`}>
                {msg.text}

                {msg.options && (
                  <>
                    <p className="select-text">Please select an answer 👇</p>
                    <div className="options">
                      {msg.options.map((opt, idx) => (
                        <button
                          key={idx}
                          className="option-btn"
                          onClick={() => handleOptionClick(opt, idx)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
