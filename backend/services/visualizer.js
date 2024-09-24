function prepareVisualizationData(analysis) {
    const sentimentData = analysis.reduce((acc, post) => {
      acc[post.platform] = (acc[post.platform] || []).concat(post.sentiment);
      return acc;
    }, {});
  
    const keywordData = analysis.reduce((acc, post) => {
      post.keywords.forEach(keyword => {
        acc[keyword] = (acc[keyword] || 0) + 1;
      });
      return acc;
    }, {});
  
    return { sentimentData, keywordData };
  }
  
  module.exports = { prepareVisualizationData };