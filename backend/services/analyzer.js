const natural = require('natural');
const sentiment = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');

function analyzeContent(content) {
    return content.map(post => ({
        ...post,
        sentiment: sentiment.getSentiment(post.text.split(' ')),
        keywords: extractKeywords(post.text)
    }));
}

function extractKeywords(text) {
    const tokenizer = new natural.WordTokenizer();
    const tfidf = new natural.TfIdf();
    tfidf.addDocument(text);
    return tfidf.listTerms(0).slice(0, 5).map(item => item.term);
}

module.exports = { analyzeContent };