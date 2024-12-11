/**
 * External dependencies
 */
import { readdirSync } from 'fs';
import { join, extname } from 'path';

/**
 * Get the list of .gguf files in the models folder.
 * @returns {string[]} Array of .gguf filenames.
 */
const getModels = () => {
    // Path to the models folder
    const modelsFolderPath = join(process.cwd(), 'models');

    try {
        // Read the directory
        const files = readdirSync(modelsFolderPath);

        // Filter files with the .gguf extension
        const ggufFiles = files.filter((file) => extname(file) === '.gguf');

        return ggufFiles;
    } catch (error) {
        console.error('Error reading the models folder:', error.message);
        return [];
    }
};

export default getModels;