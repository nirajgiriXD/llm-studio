import fs from 'fs';
import path from 'path';

const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Append chat data to the file or create a new one
const saveChatData = (message, agent) => {
    const folderPath = path.join(process.cwd(), 'history');
    const fileName = `${getFormattedDate()}.json`;
    const filePath = path.join(folderPath, fileName);

    // Ensure the folder exists
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    // Chat data to append
    const chatEntry = { agent, message, timestamp: new Date() };

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        // Read the existing file
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileContent);

        // Append new chat data
        jsonData.data.push(chatEntry);

        // Write updated data back to the file
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    } else {
        // Create a new file with the chat data
        const newData = { data: [chatEntry] };
        fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
    }
};

export default saveChatData;