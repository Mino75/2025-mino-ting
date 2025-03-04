document.addEventListener('DOMContentLoaded', () => { 
  const synth = window.speechSynthesis;
  const languageSelect = document.getElementById('language');
  const voiceSelect = document.getElementById('voice');
  const rateInput = document.getElementById('rate');
  const rateValue = document.getElementById('rateValue');
  const textInput = document.getElementById('text');
  const speakButton = document.getElementById('speak');
  const stopButton = document.getElementById('stop');
  const clearCacheButton = document.getElementById('clear-cache');
  let voices = [];
  let currentUtterance = null; // Keep a reference to the current utterance

  const populateVoices = () => {
      voices = synth.getVoices();
      loadVoicesForLanguage(languageSelect.value);
  };

  const loadVoicesForLanguage = (language) => {
      voiceSelect.innerHTML = '';
      const filteredVoices = voices.filter(voice => voice.lang.startsWith(language));
      filteredVoices.forEach(voice => {
          const option = document.createElement('option');
          option.textContent = `${voice.name} (${voice.lang})`;
          option.value = voice.name;
          voiceSelect.appendChild(option);
      });
      voiceSelect.disabled = filteredVoices.length === 0;
      checkEnableSpeakButton();
  };

  const checkEnableSpeakButton = () => {
      speakButton.disabled = !textInput.value.trim() || voiceSelect.disabled || voiceSelect.value === '';
  };

  const speakText = () => {
      if (synth.speaking) {
          // Cancel any ongoing speech before starting new one.
          synth.cancel();
      }
      currentUtterance = new SpeechSynthesisUtterance(textInput.value.trim());
      const selectedVoice = voices.find(voice => voice.name === voiceSelect.value);
      currentUtterance.voice = selectedVoice;
      currentUtterance.lang = selectedVoice.lang;
      currentUtterance.rate = parseFloat(rateInput.value);

      // Enable stop button when speech starts.
      currentUtterance.onstart = () => {
          stopButton.disabled = false;
      };

      // Disable stop button when speech ends.
      currentUtterance.onend = () => {
          stopButton.disabled = true;
      };

      // Start speaking.
      synth.speak(currentUtterance);
  };

  // Event listeners for UI elements.
  languageSelect.addEventListener('change', () => loadVoicesForLanguage(languageSelect.value));
  voiceSelect.addEventListener('change', checkEnableSpeakButton);
  rateInput.addEventListener('input', () => {
      rateValue.textContent = rateInput.value;
  });
  textInput.addEventListener('input', checkEnableSpeakButton);
  speakButton.addEventListener('click', speakText);

  // Add stop button functionality.
  stopButton.addEventListener('click', () => {
      if (synth.speaking) {
          synth.cancel();
          stopButton.disabled = true;
      }
  });

  // Add clear cache functionality.
  clearCacheButton.addEventListener('click', async () => {
      try {
          const keys = await caches.keys();
          await Promise.all(keys.map(key => caches.delete(key)));
          console.log("All caches cleared.");
      } catch (err) {
          console.error("Error clearing caches:", err);
      }
  });

  // Populate voices.
  if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoices;
  }
  populateVoices();
});
