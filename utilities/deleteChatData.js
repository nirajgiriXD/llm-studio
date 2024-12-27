import fs from "fs";
import path from "path";

const deleteChatData = (date, timestamp) => {
  const folderPath = path.join(process.cwd(), "history");
  const filePath = path.join(folderPath, `${date}.json`);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return false;
  }

  try {
    // Read the existing file
    const fileContent = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(fileContent);

    // Filter out the entry with the matching timestamp
    const updatedData = jsonData.data.filter(
      (entry) => entry.timestamp !== timestamp
    );

    // Update the JSON structure
    jsonData.data = updatedData;

    // Write updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

    return true;
  } catch (error) {
    return false;
  }
};

export default deleteChatData;
