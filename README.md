# Interview Copilot

Interview Copilot is a browser-based application that enhances your interview experience by providing real-time transcription and AI assistance. It captures audio from your device and converts speech to text in real-time, then leverages ChatGPT to help formulate responses.

## Features

- 🎙️ Real-time speech-to-text transcription from any audio source
- 🤖 AI-powered interview assistance using ChatGPT
- 🌐 Pure web-based solution - no installation required
- 💻 Cross-platform support (desktop, tablet, mobile)
- 🔒 Serverless architecture with local storage for API keys
- 🌓 Dark/Light theme support
- 🎯 Optimized for online interview scenarios

## Use Cases

- 👥 Online job interviews
- 🎓 Academic interviews
- 💼 Business meetings
- 🌍 Language assistance during conversations
- 📝 Real-time meeting transcription

## Prerequisites

Before you begin, ensure you have:
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Deepgram API key ([Get it here](https://console.deepgram.com/signup))
- OpenAI API key ([Get it here](https://platform.openai.com/signup))

## Quick Start

1. Visit [Interview Copilot Web App](https://your-deployment-url.com)
2. Open Settings and configure your API keys (stored locally)
3. Grant microphone permissions when prompted
4. Start your meeting or interview
5. Click the microphone button to begin transcription
6. Copy interesting portions to the AI chat for assistance
7. Read AI-suggested responses

## Installation (For Developers)

1. Clone the repository:
```bash
git clone https://github.com/dredre815/interview-copilot.git
cd interview-copilot
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Tech Stack

- ⚛️ React.js for UI components
- 🎤 Deepgram API for real-time speech-to-text
- 🧠 OpenAI GPT-4o for AI responses
- 🔌 WebSocket for real-time communication
- 🎨 CSS3 with custom theming
- 📱 Responsive design principles
- 🔒 Local Storage API for secure key management

## Privacy & Security

- All API keys are stored locally in your browser
- No server-side storage of sensitive information
- Direct communication with API providers
- No data persistence beyond your browser session

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [Apache License 2.0](LICENSE)

## Author

**Zijun (Marshall) Zhang**
- Personal website: [zijun2002.com](https://www.zijun2002.com)
- Email: [zijuzhang1@student.unimelb.edu.au](mailto:zijuzhang1@student.unimelb.edu.au)
- GitHub: [@dredre815](https://github.com/dredre815)
- Twitter: [@Romanticism_02](https://twitter.com/Romanticism_02)

## Acknowledgments

- [Deepgram](https://deepgram.com/) for their powerful speech-to-text API
- [OpenAI](https://openai.com/) for ChatGPT API
- [Material Icons](https://fonts.google.com/icons) for UI icons

## Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/dredre815/interview-copilot/issues) page
2. Create a new issue if your problem isn't already listed
3. Contact the author via email for direct support
