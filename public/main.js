import { web } from "../src/application/web.js";
import dotenv from "dotenv"

dotenv.config()

web.listen(3000, () => {
    console.log("Start Application");
})