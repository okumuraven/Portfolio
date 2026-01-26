const app = require('./app');
const { PORT } = require('./config/env');

// Extra: Ensure PORT is always defined
const port = PORT || 5000;

app.listen(port, () => {
  console.log(`✅ Backend server running on port ${port}`);
});