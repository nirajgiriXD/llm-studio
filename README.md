# LLM Studio

*A comprehensive Next.js application for running and exploring `.gguf` open-source LLM models locally.*

LLM Studio is designed to empower users to harness the capabilities of large language models (LLMs) on their own machines, providing a seamless, private, and offline experience. It is the ideal solution for anyone looking to dive deeper into open-source LLMs while maintaining control over their data and processes. Explore the power of large language models, all from the comfort of your own machine.

## Tech Stack

- **Next.js 16** (App Router, Turbopack) with **React 19**
- **Tailwind CSS v4** — CSS-first configuration, design tokens defined in [styles/globals.css](styles/globals.css)
- **shadcn/ui** (new-york style) on Radix primitives, in [components/ui/](components/ui/)
- **node-llama-cpp** for local `.gguf` inference
- **next-themes** for light/dark/system theming and **sonner** for toasts

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). Drop at least one `.gguf` file into the `models` folder first — the app tells you if the folder is empty.

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint with ESLint (flat config) |

## Working Mechanism

LLM Studio operates with a focus on simplicity and efficiency. Here’s how it works:

- **Chat History Management:**
  - Each chat session's history is saved as a JSON file in the `history` folder.
  - The filename corresponds to the date when the chat was first initiated, in `YYYY-MM-DD` format.

- **Model Storage:**
  - `.gguf` models should be placed in the `models` folder.
  - By default, the smallest model in the folder is selected as the default model.

- **Optimized History Loading:**
  - All chat histories are loaded into the browser for quick access.
  - Since they are stored as JSON files, the data size remains minimal.

- **Search Functionality:**
  - Press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> to search every stored message and jump straight to it.

- **Model Switching:**
  - Users can switch between different models available in the `models` folder as needed.
  - The sidebar shows each model's file size, so you can pick one that fits your memory.

- **Incognito Mode:**
  - Activate incognito mode to prevent saving chat history from that point onward.
  - It is reachable from the header as well as from settings, and always resets to off when the app reloads.

- **Copy and Delete Options:**
  - Copy any message — or any individual code block — with the copy icon.
  - Delete a message with the delete icon; deletions ask for confirmation first.

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> | Search the chat history |
| <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>B</kbd> | Toggle the sidebar |
| <kbd>Enter</kbd> | Send the message |
| <kbd>Shift</kbd>/<kbd>Ctrl</kbd> + <kbd>Enter</kbd> | Insert a new line |

## Settings

Model parameters live in the settings dialog and apply to your next message. Context size, GPU layers and temperature persist across reloads; the ranges shown in the UI are enforced on the server too ([lib/settings.js](lib/settings.js)).

## Prerequisites

- [CMake](https://cmake.org/): Verify with cmake --version.
- C++ Compiler: Install gcc (Linux), clang (macOS), or [Visual Studio (Windows)](https://visualstudio.microsoft.com/vs/features/cplusplus/).

## Convert Hugging Face (.safetensors) Model Format to .gguf

Follow these steps to convert a Hugging Face model into the `.gguf` format for use in LLM Studio:

### Step 1: Clone the Llama.cpp Repository

Clone the repository for `llama.cpp`, which contains the necessary tools for the conversion:

```bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp/
```

### Step 2: Build the Project

Use CMake to build the project:

```bash
cmake -S . -B build
```

### Step 3: Install Python Dependencies

Install the necessary Python dependencies:

```bash
pip install -r requirements.txt
```

### Convert the Model

Run the conversion script to convert the Hugging Face model to `.gguf` format with FP16 precision:

```bash
python convert_hf_to_gguf.py --outtype f16 models/<INSERT_YOUR_FOLDER_NAME_HERE>
```

Replace `<INSERT_YOUR_FOLDER_NAME_HERE>` with the path to your model folder.

## Known Issues

### CUDA Errors on GPU Models:

You may encounter errors like this when running on a GPU:

```bash
ggml_cuda_init: GGML_CUDA_FORCE_MMQ:    no
ggml_cuda_init: GGML_CUDA_FORCE_CUBLAS: no
ggml_cuda_init: found 1 CUDA devices:
  Device 0: NVIDIA GeForce RTX <model-name>, compute capability 7.5, VMM: yes
<path-to>\node-llama-cpp\node-llama-cpp\llama\llama.cpp\ggml\src\ggml-cuda\ggml-cuda.cu:70: CUDA error
```

This error typically occurs when your GPU is unable to handle the model. Lower **GPU layers** in settings, or try a smaller model.

## Useful Links

- https://node-llama-cpp.withcat.ai/
- https://huggingface.co/
- https://nextjs.org/docs
- https://ui.shadcn.com/

## Contributing

We welcome contributions! If you'd like to improve the project, please fork the repository, make your changes, and submit a pull request. For any issues or feature requests, feel free to open an issue on GitHub.

## License

This project is licensed under the [Apache License Version 2.0](https://www.apache.org/licenses/).
