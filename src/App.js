import { useState } from "react";

const App = () => {
  const [error, setError] = useState("")
  const [value, setValue] = useState("")
  const [chatHistory,setChatHistory] = useState([])
  const [hasContent, setHasContent] = useState(false) // Add state for content presence

  const surpriseOptions = [
    // General Knowledge (Expands knowledge):
    "What's the origin of the phrase 'once in a blue moon'?",
    "Can you explain the concept of quantum mechanics in a simple way?", // Consider adjusting difficulty based on audience
    "What are some unsolved mysteries of the ancient world?",
    "Tell me something interesting about the human brain.",
    "What's the farthest object we can see in the universe?",
  
    // Creative Prompts (Sparks imagination):
    "Write a short poem about a robot who discovers emotions.",
    "Describe a future world where artificial intelligence plays a major role in art creation.",
    "Come up with a new invention that could help with climate change.",
    "Create a funny story about a group of animals who run a restaurant.",
    "Imagine you're a historical figure witnessing a major event. Tell me your perspective.",
  
    // Personal Engagement (Connects with the user):
    "What do you think are the most important qualities in a friend?",
    "If you could travel anywhere in the world, where would you go and why?",
    "What are your thoughts on the concept of artificial consciousness?",
    "What do you find most surprising about human behavior?",
    "Do you believe in life on other planets? Why or why not?",
  
    // Current Events (Keeps the user informed):
    "What are your thoughts on the recent developments in (mention a specific field)?" ,// Update with a current topic
    // Add more current event options based on your needs
  
    // Bonus (Humor and Surprise):
    "What's the funniest thing you've overheard someone say?", // Consider user privacy concerns
    "Tell me a surprising fact about the natural world.",

    //Some more random
    "Who won the latest Noval prize? ","Wish me Luck !!!"
    ,"If you could time travel to any era, past or future, where would you go and why?"
    ,"What's the most fascinating technological advancement you've come across recently?"
    ,"Do you have any favorite hobbies or activities that you enjoy in your free time?"
    ,"If you could have dinner with any historical figure, who would it be and what would you ask them?"
    ,"What's a book or movie that has had a significant impact on your perspective or life?",

    //ChatGPT
    "If you could possess any superpower, what would it be and how would you use it?",
    "Share an interesting fact or trivia that most people might not know.",
    "Imagine having a conversation with your future self. What advice would your future self give to you?",
    "If you were a character in a fantasy novel, what kind of character would you be and what adventures would you embark on?",
    "Describe your dream vacation destination and the activities you would enjoy there.",
    "If you could learn any new skill instantly, what would it be and why?",
    "Share a memorable childhood story or experience that shaped who you are today.",
    "Create a fictional dinner party guest list with three historical figures, alive or deceased. Who would you invite and why?",
    "If you had the chance to explore outer space, what celestial body or planet would you visit first?",
    "Name a technology or innovation you wish existed but hasn't been invented yet. What would it do?",
    // Challenging and Common Questions
  "What is the only planet in our solar system that rotates clockwise?",
  "How many time zones are there in the world?",
  "Which letter is not used in the spelling of any US state?",
  "What comes once in a minute, twice in a moment, but never in a thousand years?",
  "Can you name three consecutive days without using the words Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, or Sunday?",
  "What has keys but can't open locks?",
  "What is the only number with letters in alphabetical order?",
  "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?",
  "What gets wetter as it dries?",
  "What has cities but no houses, forests but no trees, and rivers but no water?"
  ];

  // const surprise = () => {
  //   const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
  //   setValue(randomValue)
  // }
  const surprise = () => {
    // Shuffle the surpriseOptions array
    const shuffledOptions = surpriseOptions.sort(() => Math.random() - 0.5);
  
    // Pick the first option from the shuffled array
    const randomValue = shuffledOptions[0];
  
    setValue(randomValue);
  };

  const getResponse = async () => {
        if(!value){
          setError("Error! Please ask a question :( ")
          return
        }

        try{
            const options = {
              method: 'POST',
              body: JSON.stringify({
                history:  chatHistory,
                message:  value
              }),
              headers:  {
                'Content-Type': 'application/json'
              }
            }

            const response = await fetch('http://localhost:9000/gemini', options)
            const data = await response.text();
            console.log(data)
            setChatHistory(oldChatHistory => [...oldChatHistory,{
              role: "user",
              parts: value
            },
            {
              role: "model",
              parts: data
            }
          ])
          setValue("")
        }
        catch(error){

            console.error(error)
            setError("Something went wrong! Please try agian later.")
        }
  }

  const clear = () => {
    setValue("")
    setError("")
    setChatHistory([])
  }
  const cleanUpText = (text) => {
    return text
      .replace(/\*{2}/g, '') // Remove double asterisks
      .replace(/\*/g, '')    // Remove single asterisks
      .trim();               // Trim leading and trailing whitespaces
  };

  const readAloud = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  return (
    <div className="app">
      <p>
        What do you want to know ?
        <button className="surprise" onClick={surprise} disabled={!chatHistory}>Surprise me</button>
      </p>
      <div className="input-container">
        <input
          value={value}
          placeholder="Let's chat! What do you need...?"
          onChange={(e) => {
            setValue(e.target.value)
            setError("") // Clear the error when the user types something new
          }}
        />

        {!error && <button onClick={getResponse}>Ask me</button>}
        {error && <button  onClick={clear}>Clear</button>}
        {/* <button onClick={getResponse}>{error ? 'Clear' : 'Ask me'}</button> */}

      </div>
      {error && <p>{error}</p>}
      {/* <div className={`search-result ${hasContent ? 'scrollable' : ''}`}></div> */}
      <div className="search-result">
        {chatHistory.map((chatItem, _index) => <div key={ _index}>
          <p className="answer" onClick={() => readAloud(chatItem.parts)}>
            {chatItem.role} : {cleanUpText(chatItem.parts)}</p>
        </div>)}
      </div>
    </div>
  )
}

export default App;
