import 'dotenv/config';
import app from './app.js';

// const port = Number(process.env.PORT) || 8080;

// app.listen(port, () => {
//   console.log(`Tablewise API listening on http://localhost:${port}`);
// });


const port = Number(process.env.PORT) || 8080;

app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});