
const path = require('path');
const express = require('express');
require('dotenv').config(); // load .env if it exists
const app = express();
const staticRoutes = require('./routes/static');

/* ***********************
 * View engine & static files
 *************************/
// Set EJS as the view engine
app.set('view engine', 'ejs');
// Ensure views path is correct
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

/* ***********************
 * Body parsing middleware
 *************************/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ***********************
 * Routes
 *************************/
// Static routes
app.use(staticRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('index', { title: 'W01 Site - Home' });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Intentional error route for testing error handling
app.use("/intentional-error", require("./routes/intentionalErrorRoute"));

/* ***********************
 * Error handling middleware (MUST BE LAST)
 *************************/
app.use((err, req, res, next) => {
  console.error("Error caught by middleware:", err);
  // Set error information in locals
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("errors/error", {
    title: "Error - " + (err.status || 500),
    message: err.message
  });
});

/* ***********************
 * Server setup
 *************************/
const host = process.env.HOST || 'localhost';
let port = process.env.PORT || process.env.PORT_LOCAL || 5500;

// Try to start the server, automatically find next port if busy
const startServer = (p) => {
  const server = app.listen(p, () => {
    console.log(` App running on http://${host}:${p}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(` Port ${p} in use, trying port ${p + 1}...`);
      startServer(p + 1);
    } else {
      console.error(' Server error:', err);
    }
  });
};

startServer(parseInt(port));startServer(parseInt(port));
