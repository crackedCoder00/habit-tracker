import e from "express";

const app = e();

const port = 3000;

app.get("/", (req, res) => {
  res.send("hello from the server");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
