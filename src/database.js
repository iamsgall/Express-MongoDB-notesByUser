const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/crud-notes-app', {
   useNewUrlParser: true
   // , useCreateIndex: true
   // , useFindAndModify: false 
})
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));

