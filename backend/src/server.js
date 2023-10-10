const express = require("express");
const session = require("express-session");
const server = express();

server.use(express.json());    // tell server to use parse incoming requests as json (using the json() middleware)
server.use(express.urlencoded({extended:true}));
// TODO: Add private file
// server.use(session({secret:private.session.secret}));

const port = 3000 // Port to listen on

const router = require("./routes/router.js")
server.use('/api', router);

server.listen(port, () => console.log(`gophermatch is listening on port ${port}`));