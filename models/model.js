const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const marked = require('marked');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const notesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String
    },
    description: {
        type: String
    },
    notes: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
}, { timestamps: true });

notesSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    if (this.notes) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.notes));
    }
    next();
})

module.exports = mongoose.model("notes", notesSchema)