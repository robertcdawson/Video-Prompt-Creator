# Video Prompt Creator

A responsive web application designed to optimize video prompts for state-of-the-art AI video generation models like **Veo 3** and **Sora 2**.

Built with **React**, **Vite**, **Tailwind CSS**, and powered by Google's **Gemini 2.5 Pro** model.

![App Screenshot](https://via.placeholder.com/800x450.png?text=Video+Prompt+Creator+Screenshot)

## Features

-   **Intelligent Prompt Expansion**: Turns raw ideas into detailed, structured prompts using filmmaking terminology.
-   **Style Flavors**: Choose between **Cinematic**, **Product Showcase**, or **Social Media** styles to tailor the output.
-   **Rich Output**: Syntax-highlighted prompt display for easy reading and copying.
-   **Negative Prompting**: Automatically includes model-specific negative prompts to ensure high quality.
-   **Secure API Key Management**: Your Gemini API key is stored locally in your browser (`localStorage`).
-   **Responsive Design**: Works seamlessly on desktop (grid layout) and mobile (stacked layout).

## Tech Stack

-   **Frontend**: React 19, Vite, TypeScript
-   **Styling**: Tailwind CSS 3.4, Lucide React (Icons)
-   **AI Integration**: Google Generative AI SDK (`@google/generative-ai`)

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   A Google Gemini API Key (Get one at [Google AI Studio](https://aistudio.google.com/))

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/video-prompt-creator.git
    cd video-prompt-creator
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser at `http://localhost:5174`.

## Usage

1.  **Enter API Key**: Click the Settings icon (gear) in the top right and paste your Gemini API Key.
2.  **Select a Style**: (Optional) Choose a "flavor" like Cinematic or Product.
3.  **Input Idea**: Type your video concept (e.g., "A cyberpunk detective in the rain").
4.  **Optimize**: Click "Optimize Prompt" and wait for the AI to generate a detailed filmmaking prompt.
5.  **Copy**: Click the "Copy" button to use the prompt in your video generation tool.

## License

MIT
