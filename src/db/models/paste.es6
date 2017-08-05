import mongoose from 'mongoose';
import Promise from 'bluebird';
mongoose.Promise = Promise;

const pasteSchema = new mongoose.Schema({
  content: String,
  expiry: Date
});

const Paste = mongoose.model('Paste', pasteSchema);

export default Paste;