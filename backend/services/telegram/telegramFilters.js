const { Api } = require('telegram');

function createTelegramFilter(filterOptions) {
  return new Api.InputMessagesFilterEmpty();
}

function parseKeywordWithOperators(keyword, operators) {
  if (!operators || operators.length === 0) return keyword;

  let parsedKeyword = keyword;
  operators.forEach(op => {
    switch (op.toLowerCase()) {
      case 'and':
        parsedKeyword = parsedKeyword.split(' ').join(' AND ');
        break;
      case 'or':
        parsedKeyword = parsedKeyword.split(' ').join(' OR ');
        break;
      case 'not':
        parsedKeyword = `NOT (${parsedKeyword})`;
        break;
    }
  });

  return parsedKeyword;
}

function applyCustomFilters(message, sender, filterOptions) {
  const { username, userId } = filterOptions;

  console.log('Applying custom filters:', JSON.stringify(filterOptions));
  console.log('Sender:', JSON.stringify(sender));

  if (username && sender) {
    const senderUsername = sender.username || '';
    if (senderUsername.toLowerCase() !== username.toLowerCase().replace('@', '')) {
      console.log(`Filtered out by username. Expected: ${username}, Got: ${senderUsername}`);
      return false;
    }
  }

  if (userId && sender) {
    if (sender.id.toString() !== userId.toString()) {
      console.log(`Filtered out by userId. Expected: ${userId}, Got: ${sender.id}`);
      return false;
    }
  }

  console.log('Message passed all filters');
  return true;
}

module.exports = { createTelegramFilter, parseKeywordWithOperators, applyCustomFilters };