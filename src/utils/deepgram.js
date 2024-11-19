export const processTranscription = (text) => {
  if (!text) return "";

  // remove duplicate phrases
  const removeDuplicates = (text) => {
    const words = text.split(" ");
    const phrases = new Set();
    const result = [];
    const phraseLength = 4; 

    for (let i = 0; i < words.length; i++) {
      // check different length phrases
      let isRepeat = false;
      for (let len = 2; len <= phraseLength; len++) {
        const phrase = words.slice(i, i + len).join(" ");
        if (phrase.split(" ").length < 2) continue;

        if (phrases.has(phrase)) {
          isRepeat = true;
          break;
        }
        phrases.add(phrase);
      }

      if (!isRepeat) {
        result.push(words[i]);
      }
    }

    return result.join(" ");
  };

  // smart punctuation processing
  const addPunctuation = (text) => {
    return (
      text
        // handle questions
        .replace(
          /\b(what|how|why|when|where|who|which|whose|whom)(\s+\w+){3,}?(?=[.!?]|\s+[A-Z]|$)/gi,
          (match) => match.trim() + "?"
        )

        // handle natural pauses
        .replace(
          /(\w+)\s+(?=(and|or|but|because|however|therefore|meanwhile|moreover|furthermore|although|nevertheless|consequently|additionally|similarly|conversely|specifically|particularly|generally|typically|usually|occasionally|frequently|rarely|finally|initially|subsequently|previously|currently|eventually|ultimately|basically|essentially|actually|literally|seriously|honestly|frankly|obviously|clearly|certainly|probably|possibly|perhaps|maybe))\s+/gi,
          "$1, "
        )

        // handle subordinate clauses
        .replace(
          /(\w+)\s+(?=(which|who|whom|whose|where|when|that|if|unless|although|though|while|whereas|because|since|as|whether))\s+/gi,
          "$1, "
        )

        // handle exclamations
        .replace(
          /\b(wow|amazing|great|awesome|oh|ah|hey|whoa|ouch|yikes|congratulations|thanks|thank you|please|sorry|excuse me).*?(?=\.|$)/gi,
          (match) => match.trim() + "!"
        )

        // add comma in long sentences
        .replace(
          /([^,]{50,}?)(?=\s+(?:and|or|but|because|however|therefore))/g,
          "$1,"
        )

        // ensure sentence ends with correct punctuation
        .replace(/([a-z])(?=\s+[A-Z]|$)/g, "$1.")
        .replace(/([.!?])\s*([.!?])+/g, "$1")
    ); 
  };

  // advanced paragraph processing
  const addParagraphs = (text) => {
    const sentences = text.split(/[.!?]\s+/);
    const paragraphs = [];
    let currentParagraph = [];
    let prevTopic = "";

    for (const sentence of sentences) {
      if (!sentence.trim()) continue;

      // extract sentence topic words
      const words = sentence.toLowerCase().split(" ");
      const topicWords = words
        .filter((w) => w.length > 4)
        .slice(0, 3)
        .join(" ");

      // if topic changes too much, start a new paragraph
      if (prevTopic && !topicWords.includes(prevTopic.split(" ")[0])) {
        if (currentParagraph.length > 0) {
          paragraphs.push(currentParagraph.join(" "));
          currentParagraph = [];
        }
      }

      currentParagraph.push(sentence.trim() + ".");
      prevTopic = topicWords;
    }

    if (currentParagraph.length > 0) {
      paragraphs.push(currentParagraph.join(" "));
    }

    return paragraphs.join("\n\n");
  };

  // enhanced text cleaning
  const cleanText = (text) => {
    return (
      text
        // basic cleaning
        .trim()
        .replace(/\s+/g, " ")
        .replace(/\n{3,}/g, "\n\n")

        // fix common speech recognition errors
        .replace(/\b(i)\b/g, "I")
        .replace(/\bi'm\b/gi, "I'm")
        .replace(/\bi'll\b/gi, "I'll")
        .replace(/\bi've\b/gi, "I've")
        .replace(/\bi'd\b/gi, "I'd")

        // fix numbers and units
        .replace(/(\d+)\s*(dollars|usd)/gi, "$1 dollars")
        .replace(/(\d+)\s*(percent|percentage)/gi, "$1%")

        // fix punctuation spacing
        .replace(/\s+([.,!?;:])/g, "$1")
        .replace(/([.,!?;:])(?=[a-zA-Z])/g, "$1 ")

        // fix quotes
        .replace(/"([^"]*?)"/g, '"$1"')

        // delete duplicate punctuation
        .replace(/([.,!?])\1+/g, "$1")
    );
  };

  const preProcess = (text) => {
    return text
      // fix numbers
      .replace(/(\d+)\s+(\d+)/g, '$1$2')
      // fix common abbreviations
      .replace(/\b(dont|cant|wont|didnt|couldnt|shouldnt|wouldnt)\b/gi, 
        match => match.charAt(0) + "'" + match.slice(1))
      // fix common phrases
      .replace(/\b(going to|want to|got to)\b/gi, 
        match => match.replace(' to', ' to'));
  };

  // tokenize and recombine
  const tokenize = (text) => {
    const words = text.split(/\s+/);
    const result = [];
    let i = 0;
    
    while (i < words.length) {
      let word = words[i];
      
      // check next word, whether to merge
      if (i < words.length - 1) {
        const nextWord = words[i + 1];
        const combined = word + ' ' + nextWord;
        
        // check common phrases dictionary
        if (commonPhrases.has(combined.toLowerCase())) {
          word = combined;
          i++;
        }
      }
      
      result.push(word);
      i++;
    }
    
    return result.join(' ');
  };

  // Common phrases set - organized by categories
  const commonPhrases = new Set([
    // Basic conversational phrases
    'thank you', 'thank you very much', 'thanks a lot',
    'excuse me', 'pardon me', 'sorry about that',
    'of course', 'as well', 'in fact',
    'you know', 'i mean', 'i think',
    'kind of', 'sort of', 'a lot of',
    'more or less', 'pretty much',

    // Time-related phrases
    'right now', 'at the moment',
    'all the time', 'most of the time',
    'from time to time', 'once in a while',
    'first of all', 'last but not least',
    'in the end', 'at the end',
    'in the beginning', 'at the beginning',
    'as soon as possible', 'right away',

    // Opinion & thinking phrases
    'i believe', 'i suppose', 'i guess',
    'i assume', 'i understand',
    'in my opinion', 'from my perspective',
    'as far as i know', 'as far as i can tell',
    'it seems to me', 'it appears that',
    'i would say', 'i would think',

    // Clarification phrases
    'in other words', 'that is to say',
    'what i mean is', 'to put it another way',
    'let me explain', 'for example',
    'such as', 'in particular',
    'to be specific', 'in general',

    // Transition phrases
    'on the other hand', 'having said that',
    'in addition to', 'furthermore',
    'moreover', 'nevertheless',
    'however', 'therefore',
    'as a result', 'consequently',
    'in contrast', 'on the contrary',

    // Business/Professional phrases
    'in terms of', 'with regard to',
    'with respect to', 'according to',
    'based on', 'due to',
    'in response to', 'in relation to',
    'as mentioned earlier', 'as discussed',
    'moving forward', 'going forward',

    // Agreement/Disagreement
    'i agree with', 'i disagree with',
    'that makes sense', 'fair enough',
    'absolutely right', 'not necessarily',
    'more or less', 'sort of like',

    // Quantity/Degree phrases
    'a great deal of', 'a number of',
    'plenty of', 'lots of',
    'a few', 'quite a few',
    'more than', 'less than',
    'as much as', 'as many as',

    // Location/Direction phrases
    'next to', 'close to',
    'far from', 'in front of',
    'behind the', 'on top of',
    'at the bottom of', 'in the middle of',

    // Emphasis phrases
    'in fact', 'as a matter of fact',
    'actually', 'basically',
    'especially', 'particularly',
    'specifically', 'certainly',
    'definitely', 'absolutely',

    // Common verb phrases
    'going to', 'want to',
    'need to', 'have to',
    'trying to', 'supposed to',
    'used to', 'ought to',
    'would like to', 'planning to',

    // Technical discussion phrases
    'in this case', 'in this situation',
    'for instance', 'in practice',
    'in theory', 'generally speaking',
    'technically speaking', 'strictly speaking',
    'relatively speaking', 'broadly speaking',

    // Conclusion phrases
    'to sum up', 'in conclusion',
    'to conclude', 'finally',
    'last but not least', 'in summary',
    'to summarize', 'all in all',
    'at the end of the day', 'in the long run'
  ]);

  // execute processing
  let processedText = text;
  processedText = preProcess(processedText);
  processedText = tokenize(processedText);
  processedText = removeDuplicates(processedText);
  processedText = addPunctuation(processedText);
  processedText = addParagraphs(processedText);
  processedText = cleanText(processedText);

  return processedText;
};

export const getAudioStream = async (selectedDevices) => {
  try {
    const streams = [];
    let cleanup = null;

    // get system audio
    if (selectedDevices.speaker) {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          audio: true,  // simplify audio config
          video: {
            width: 1,
            height: 1,
            frameRate: 1
          }
        });

        // only keep audio track
        const audioTrack = displayStream.getAudioTracks()[0];
        if (audioTrack) {
          const audioStream = new MediaStream([audioTrack]);
          streams.push(audioStream);
          
          // stop unnecessary video tracks
          displayStream.getVideoTracks().forEach(track => track.stop());
        }
      } catch (error) {
        console.error('System audio capture failed:', error);
        throw new Error('Failed to capture system audio. Please make sure to select "Share system audio" in the dialog.');
      }
    }

    // get microphone audio
    if (selectedDevices.microphone) {
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: { exact: selectedDevices.microphone.id },
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 48000
          }
        });
        streams.push(micStream);
      } catch (error) {
        console.error('Microphone capture failed:', error);
        throw new Error(`Failed to capture microphone: ${error.message}`);
      }
    }

    if (streams.length === 0) {
      throw new Error('No audio sources could be captured');
    }

    // merge audio streams
    const audioContext = new AudioContext({
      sampleRate: 48000,
      latencyHint: 'interactive'
    });
    const destination = audioContext.createMediaStreamDestination();

    streams.forEach(stream => {
      stream.getAudioTracks().forEach(track => {
        const source = audioContext.createMediaStreamSource(new MediaStream([track]));
        
        // add volume control
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 1.0; // can adjust volume
        
        source.connect(gainNode);
        gainNode.connect(destination);
      });
    });

    cleanup = () => {
      streams.forEach(stream => {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      });
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    };

    return {
      stream: destination.stream,
      cleanup
    };
  } catch (error) {
    console.error('Error getting audio stream:', error);
    throw error;
  }
};

export const startTranscription = async (apiKey, audioStream, onTranscription) => {
  try {
    const socket = new WebSocket('wss://api.deepgram.com/v1/listen', [
      'token',
      apiKey,
    ]);

    const buffer = {
      chunks: [],
      processingTimer: null,
      lastInterimResult: ''
    };

    const BUFFER_INTERVAL = 1000; 

    socket.onopen = () => {
      console.log('Connection opened');
      
      // Optimize configuration for higher real-time performance
      const config = {
        type: 'Configure',
        encoding: 'linear16',
        sample_rate: 48000,
        channels: 1,
        punctuate: true,
        language: 'en',
        model: 'general',
        interim_results: true,
        endpointing: true,
        vad_turnoff: 500
      };
      
      socket.send(JSON.stringify(config));
      
      try {
        const mediaRecorder = new MediaRecorder(audioStream, {
          mimeType: 'audio/webm;codecs=opus',
          audioBitsPerSecond: 128000
        });
        
        // 减少时间片以提高实时性
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        };

        mediaRecorder.start(250);

        return () => {
          try {
            mediaRecorder.stop();
          } catch (error) {
            console.error('Error stopping MediaRecorder:', error);
          }
        };
      } catch (error) {
        console.error('MediaRecorder creation failed:', error);
        throw new Error('Audio recording not supported in this browser');
      }
    };

    socket.onmessage = (message) => {
      try {
        const received = JSON.parse(message.data);
        const transcript = received.channel?.alternatives?.[0];
        
        if (transcript) {
          if (received.is_final) {
            const finalText = transcript.transcript.trim();
            if (finalText) {
              buffer.chunks.push(finalText);
              scheduleProcessing(buffer, onTranscription);
            }
            buffer.lastInterimResult = '';
          } else {
            const interimText = transcript.transcript.trim();
            if (interimText && interimText !== buffer.lastInterimResult) {
              onTranscription(interimText, true);
              buffer.lastInterimResult = interimText;
            }
          }
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    const scheduleProcessing = (buffer, callback) => {
      if (buffer.processingTimer) {
        clearTimeout(buffer.processingTimer);
      }

      buffer.processingTimer = setTimeout(() => {
        if (buffer.chunks.length > 0) {
          const textToProcess = buffer.chunks.join(' ');
          buffer.chunks = [];
          
          const processedText = processTranscription(textToProcess);
          if (processedText.trim()) {
            callback(processedText, false);
          }
        }
      }, BUFFER_INTERVAL);
    };

    socket.onclose = () => {
      console.log('Connection closed');
      if (buffer.processingTimer) {
        clearTimeout(buffer.processingTimer);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return socket;
  } catch (error) {
    console.error('Error in startTranscription:', error);
    throw error;
  }
};
