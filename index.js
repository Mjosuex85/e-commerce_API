const server = require('./src/app.js');
const { conn } = require('./src/db.js');
console.log(process.env)
// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  server.listen(process.env.PORT, () => {
    console.log('%s listening at ' + process.env.PORT); // eslint-disable-line no-console
  });
});
