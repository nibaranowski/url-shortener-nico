const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UrlSchema = new Schema({
  originalUrl: String,
  shortenUrl: String
});

const ModelClass = mongoose.model('shortUrl', UrlSchema);

module.exports = ModelClass;