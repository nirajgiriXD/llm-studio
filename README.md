# LLM Studio

*A comprehensive Next.js application for running and exploring `.gguf` open-source LLM models locally.*

LLM Studio is designed to empower users to harness the capabilities of large language models (LLMs) on their own machines, providing a seamless, private, and offline experience. It is the ideal solution for anyone looking to dive deeper into open-source LLMs while maintaining control over their data and processes. Explore the power of large language models, all from the comfort of your own machine.

## Convert .safetensors into .gguf

- `git clone https://github.com/ggerganov/llama.cpp` - This command is cloning the repository located at "https://github.com/ggerganov/llama.cpp" to the local machine.
- `cd llama.cpp/` - Navigate to the newly cloned repository located at "llama.cpp".
- `cmake -S . -B build` - This command is building the project using the cmake build system. It will compile the source code and link any necessary libraries to produce an executable binary. Ensure that you have the necessary tools installed:
    - **CMake:** Use `cmake --version` to verify.
    - **C++ Compiler:** Install gcc (Linux), clang (macOS), or Visual Studio (Windows).
- `pip install -r requirements.txt` - This command is installing the Python dependencies required for the project, specified in the "requirements.txt" file.
- `python convert_hf_to_gguf.py --outtype f16 models/<INSERT_YOUR_FOLDER_NAME_HERE>` - This command converts a Hugging Face model to the GGUF format with FP16 precision using the `convert_hf_to_gguf.py` script.