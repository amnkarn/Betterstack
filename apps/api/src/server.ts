import { app } from "./app";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" })

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`api is litning on port ${PORT}`);
})