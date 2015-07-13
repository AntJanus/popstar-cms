//site config
var path = require('path');

module.exports = {
  reader: {
    postsPerPage: 5,
    directory: path.join(__dirname, 'content')
  },
  cache: {
    enabled: false
  },
  site: {
    title: 'Popstar CMS',
  },
};
