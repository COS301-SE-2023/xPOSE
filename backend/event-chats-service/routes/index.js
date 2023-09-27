const createChat = require('./createChat');
const getChats = require('./getChats');
const deleteChat = require('./deleteChat');
const addRestrictedWord = require('./addRestrictedWord')
const deleteRestrictedWords = require('./deleteRestrictedWords')

module.exports = { createChat, getChats, deleteChat, addRestrictedWord, deleteRestrictedWords };
