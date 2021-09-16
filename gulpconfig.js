module.exports = {
  critical: {
    // When adding new options here, be sure to call them from
    // /gulp-tasks/critical.js around line 41.
    dest: './dist/css/critical/',
    dimensions: [
      {
        height: 640,
        width: 360,
      },
      {
        height: 900,
        width: 1280,
      },
    ],
    urls: {
      '/': 'default-critical',
      // add more here as needed.
    },
  },
};
