const createChat = require('./createChat');
const getChats = require('./getChats');
const deleteChat = require('./deleteChat');
const addRestrictedWord = require('./addRestrictedWord')
const deleteRestrictedWords = require('./deleteRestrictedWords')
const deleteMessage = require('./deleteMessage')

module.exports = { createChat, getChats, deleteChat, addRestrictedWord, deleteRestrictedWords, deleteMessage };
