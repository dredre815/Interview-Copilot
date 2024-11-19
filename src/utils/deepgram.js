export const startTranscription = async (apiKey, audioStream, onTranscription) => {
  try {
    // Create WebSocket connection
    const socket = new WebSocket('wss://api.deepgram.com/v1/listen', [
      'token',
      apiKey,
    ]);

    socket.onopen = () => {
      console.log('Connection opened');
      
      // Create MediaRecorder for the audio stream
      const mediaRecorder = new MediaRecorder(audioStream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
          socket.send(event.data);
        }
      };

      mediaRecorder.start(250);
    };

    socket.onmessage = (message) => {
      const received = JSON.parse(message.data);
      const transcript = received.channel?.alternatives?.[0]?.transcript || '';
      if (transcript) {
        onTranscription(transcript);
      }
    };

    socket.onclose = () => {
      console.log('Connection closed');
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
