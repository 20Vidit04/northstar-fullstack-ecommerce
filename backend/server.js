const app = require('./app');
const port = Number(process.env.PORT) || 5000;
app.listen(port, () => console.log(`Northstar API running at http://localhost:${port}`));
