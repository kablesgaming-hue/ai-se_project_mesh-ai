import express from "express";
import router from "./routes/index.js";

const app = express();
const port = 3000;

app.get("/health", (req, res): void => {
  res.status(200).json({
    success: true,
    data: { status: "ok" },
    error: null,
  });
});

app.use(router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
