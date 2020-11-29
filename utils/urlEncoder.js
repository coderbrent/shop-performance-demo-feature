//simple util to encode the name for google places lookup - TODO: some vendor names include special characters
//ex. 'Shell #4290' - this function should be expanded to parse/replace these types of names.

module.exports = { 
  urlEncoder: str => str.replace(/[ ]/g, '%20')
}