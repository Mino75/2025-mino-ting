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
    let currentUtterance = null; // Reference to the current utterance
    let chunkIndex = 0; // Current chunk number
    let chunks = []; // Array to hold text chunks
    const CHUNK_LIMIT = 200; // Maximum number of characters per chunk
  
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
  
    // Function to split the text into chunks without breaking words.
    const splitTextIntoChunks = (text, limit) => {
        const words = text.split(' ');
        const chunks = [];
        let currentChunk = '';
  
        for (let i = 0; i < words.length; i++) {
            // Determine if adding the next word exceeds the limit.
            const testChunk = currentChunk ? currentChunk + ' ' + words[i] : words[i];
            if (testChunk.length > limit) {
                // If currentChunk is not empty, push it and start a new one.
                if (currentChunk) {
                    chunks.push(currentChunk);
                }
                currentChunk = words[i]; // Start new chunk with the current word.
            } else {
                currentChunk = testChunk;
            }
        }
        if (currentChunk) {
            chunks.push(currentChunk);
        }
        return chunks;
    };
  
    // Function to speak a single chunk and chain to the next one.
    const speakChunk = () => {
        if (chunkIndex < chunks.length) {
            const chunkText = chunks[chunkIndex];
            console.log(`Speaking chunk ${chunkIndex + 1}/${chunks.length}: ${chunkText} (Length: ${chunkText.length})`);
            currentUtterance = new SpeechSynthesisUtterance(chunkText);
            const selectedVoice = voices.find(voice => voice.name === voiceSelect.value);
            currentUtterance.voice = selectedVoice;
            currentUtterance.lang = selectedVoice.lang;
            currentUtterance.rate = parseFloat(rateInput.value);
  
            currentUtterance.onstart = () => {
                stopButton.disabled = false;
            };
  
            currentUtterance.onend = () => {
                chunkIndex++;
                if (chunkIndex < chunks.length) {
                    speakChunk(); // Speak the next chunk.
                } else {
                    stopButton.disabled = true;
                }
            };
  
            synth.speak(currentUtterance);
        }
    };
  
    // Main speakText function that sets up chunking.
    const speakText = () => {
        if (synth.speaking) {
            synth.cancel();
        }
        const text = textInput.value.trim();
        chunks = splitTextIntoChunks(text, CHUNK_LIMIT);
        chunkIndex = 0;
        console.log(`Total chunks: ${chunks.length}`);
        speakChunk();
    };
  
    languageSelect.addEventListener('change', () => loadVoicesForLanguage(languageSelect.value));
    voiceSelect.addEventListener('change', checkEnableSpeakButton);
    rateInput.addEventListener('input', () => {
        rateValue.textContent = rateInput.value;
    });
    textInput.addEventListener('input', checkEnableSpeakButton);
    speakButton.addEventListener('click', speakText);
  
    stopButton.addEventListener('click', () => {
        if (synth.speaking) {
            synth.cancel();
            stopButton.disabled = true;
        }
    });
  
    clearCacheButton.addEventListener('click', async () => {
        try {
            const keys = await caches.keys();
            await Promise.all(keys.map(key => caches.delete(key)));
            console.log("All caches cleared.");
        } catch (err) {
            console.error("Error clearing caches:", err);
        }
    });
  
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoices;
    }
    populateVoices();
  });
  