import { web } from "../src/application/web.js";
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

dotenv.config()

web.listen(3000, () => {
    console.log("Start Application");
})