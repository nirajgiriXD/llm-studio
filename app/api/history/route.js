/**
 * External dependencies.
 */
import fs from "fs";
import path from "path";

export const GET = async () => {
  try {
    // Define the path to the folder containing JSON files
    const jsonFolderPath = path.join(process.cwd(), "history");

    // Read the file names in the folder
    const fileNames = fs.readdirSync(jsonFolderPath);

    // Filter to include only JSON files
    const jsonFiles = fileNames.filter((file) => file.endsWith(".json"));

    // Read and parse each JSON file
    const data = await Promise.all(
      jsonFiles.map(async (fileName) => {
        const filePath = path.join(jsonFolderPath, fileName);
        const fileContent = await fs.promises.readFile(filePath, "utf8");
        const jsonData = JSON.parse(fileContent);

        // Remove file extension to use the date (yyyy-mm-dd) as key
        const fileKey = path.basename(fileName, ".json");
        return { [fileKey]: jsonData.data };
      })
    );

    const result = data.reduce((acc, item) => {
      // Extract the key and value from the object
      const [key, value] = Object.entries(item)[0];

      // Assign the key and value to the accumulator
      acc[key] = value;

      return acc;
    }, {});

    // Extract just the keys (file names without extensions)
    const date = jsonFiles.map((fileName) => path.basename(fileName, ".json"));

    // Return the formatted JSON data with keys
    return new Response(JSON.stringify({ data: result, date }), {
      status: 200,
    });
  } catch (error) {
    // Return an error response
    return new Response("Failed to load JSON files", { status: 500 });
  }
};
