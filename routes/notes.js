const express = require('express');
const notesModel = require('./../models/model');
const router = express.Router()

// New Page
router.get('/new', (req, res) => {
    res.render('notes/new', { note: new notesModel() });
})

// Edit Page
router.get('/edit/:id', async (req, res) => {
    const note = await notesModel.findById(req.params.id);
    res.render('notes/edit', { note: note });
})


// View Page
router.get('/:slug', async(req, res) => {
    const note = await notesModel.findOne({ slug: req.params.slug });
    if (note == null) res.redirect('/');
    res.render('notes/view', { note: note });
})

// New
router.post('/', async(req, res, next) => {
    req.note = new notesModel();
    next();
}, saveAndRedirect('new'))

// Edit
router.put('/:id', async (req, res, next) => {
    req.note = await notesModel.findById(req.params.id);
    next();
}, saveAndRedirect('edit'))

// Delete
router.delete('/:id', async (req, res) => {
    await notesModel.findByIdAndDelete(req.params.id);
    res.redirect('/');
})


// Save/Edit Function
function saveAndRedirect(path) {
    return async (req, res) => {
        let note = req.note;
        note.title = req.body.title;
        note.subject = req.body.subject;
        note.description = req.body.description;
        note.notes = req.body.notes;
        try {
            note = await note.save();
            res.redirect(`/notes/${note.slug}`);
        } catch (e) {
            console.log(e)
            res.render(`notes/${path}`, { note: note });
        }
    }
}

// Export
module.exports = router;