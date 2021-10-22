// Load Packages
const express = require('express');
const mongoose = require('mongoose');
const notesModel = require('./models/model');
const notesRouter = require('./routes/notes');
const methodOverride = require('method-override');

const app = express()

// Middleware
app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Environment Variables
require('dotenv').config()

// Connect to Database
const uri = process.env.ATLAS_URI;
try {
    // Connect to MongoDB cluster
    mongoose.connect(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
     },
        () => console.log("Connected to Database")
    );
} catch (e) {
    console.log("Could not connect to Database");
}

// Index
app.get('/', async (req, res) => {
    const notes = await notesModel.find().sort({ title: 'asc' });
    res.render('notes/index', { notes: notes });
})

// Connect Router
app.use("/notes", notesRouter);

// Listen for Port
app.listen(process.env.PORT || 3000,
    () => console.log("Server is running."));