console.log("Hello world!")

const express = require("express");
const server = express();

server.use(express.json());    // tell server to use parse incoming requests as json (using the json() middleware)
server.use(express.urlencoded({extended:true}));

const port = 3000 // Port to listen on

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    
    res.send(`Username: ${username} Password: ${password}`);
});

app.listen(port, () => console.log(`gophermatch is listening on port ${port}`));