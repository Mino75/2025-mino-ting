// style.js - Injects CSS for the Text-to-Speech Application
(function() {
  var css = `
    /* CSS Variables for Dark Mode */
    :root {
      --background-color: #121212;
      --container-bg: #1e1e1e;
      --accent-color: #2196f3;
      --accent-hover: #1976d2;
      --text-color: #e0e0e0;
      --border-color: #333;
      --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    /* Reset and Global Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background-color: var(--background-color);
      color: var(--text-color);
      font-family: var(--font-family);
      line-height: 1.6;
      padding: 20px;
    }

    /* Container Styling */
    .container {
      max-width: 800px;
      margin: auto;
      background-color: var(--container-bg);
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    h1 {
      text-align: center;
      margin-bottom: 20px;
      font-size: 2rem;
    }

    /* Controls Layout */
    .controls,
    .control-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
    }

    .control-group label {
      margin-bottom: 5px;
      font-size: 1.1rem;
    }

    .control-group select,
    .control-group input[type="range"] {
      padding: 10px;
      font-size: 1rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background-color: var(--background-color);
      color: var(--text-color);
      outline: none;
      appearance: none;
    }

    /* Styling for range slider */
    input[type="range"] {
      -webkit-appearance: none;
      width: 100%;
      margin: 5px 0;
    }
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: var(--accent-color);
      cursor: pointer;
    }
    input[type="range"]::-webkit-slider-runnable-track {
      height: 5px;
      background: var(--border-color);
      border-radius: 3px;
    }

    /* Textarea Styles */
    #text {
      width: 100%;
      min-height: 200px;
      max-height: 400px;
      padding: 15px;
      font-size: 1rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background-color: var(--background-color);
      color: var(--text-color);
      resize: vertical;
      margin-top: 5px;
    }

    /* Button Container and Buttons */
    .button-container {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 20px;
    }

    button {
      padding: 15px 30px;
      font-size: 1.2rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background-color: var(--accent-color);
      color: #fff;
      transition: background-color 0.3s ease;
    }

    button:hover:not(:disabled) {
      background-color: var(--accent-hover);
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Responsive Adjustments */
    @media (max-width: 600px) {
      .container {
        padding: 15px;
      }
      h1 {
        font-size: 1.5rem;
      }
      button {
        font-size: 1rem;
        padding: 10px 20px;
      }
    }
  `;
  
  var style = document.createElement('style');
  style.innerHTML = css;
  document.head.appendChild(style);
})();
