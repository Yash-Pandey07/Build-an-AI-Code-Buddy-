import { useState } from "react";

const App = () => {
  const [error, setError] = useState("")
  // const [hasContent, setHasContent] = useState(false) // Add state for content presence

  return (
    <div className="app">
      <p>
        What do you want to know ?
        <button className="surprise">Surprise me</button>
      </p>
      <div className="input-container">
        <input
          value={""}
          placeholder="Let's chat! What do you need...?"
          onChange={""}
        />
        {!error && <button>Ask me</button>}
        {error && <button>Clear</button>}
      </div>
      {error && <p>{error}</p>}
      {/* <div className={`search-result ${hasContent ? 'scrollable' : ''}`}></div> */}
      <div className="search-result">
        <div key={""}>
          <p className="answer"></p>
        </div>
      </div>
    </div>
  )
}

export default App;
