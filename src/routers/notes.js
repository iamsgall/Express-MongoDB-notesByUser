const { Router } = require('express');

const router = Router();

const Note = require('../models/Note'); // Note is a class

const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/add-note'); 
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    // Validar errores
    const errors = [];
    if(!title) {
        errors.push({text: 'Please write a title' });
    }
    if(!description) {
        errors.push({text: 'Please write a description' })
    }
    if(errors.length > 0 ) {
        res.render('notes/add-note', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new Note({ title, description }); // newNote is the new Note
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Note Added Successfully !');
        res.redirect('/notes');
    }
});

router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'}); // const notes have all notes from MongoDB 
    console.log(notes)
    res.render('notes/all-notes.hbs', { notes });
});

router.get('/notes/edit/:id', isAuthenticated,  async (req, res) => {
    const note = await Note.findById(req.params.id);
    res.render('notes/edit-note', {note});

});

router.put('/notes/edit-note/:id', isAuthenticated,  async (req, res) => {
    const { id } = req.params;
    const {title, description } = req.body;
    await Note.findByIdAndUpdate(id, {title, description});
    req.flash('success_msg', 'Note Update Successfully !');
    res.redirect('/notes');
});

router.delete('/notes/delete-note/:id', isAuthenticated,  async (req, res) => {
    await Note.findByIdAndDelete(req.params.id); 
    req.flash('success_msg', 'Note Deleted Successfully !');
    res.redirect('/notes');
});




module.exports = router; 