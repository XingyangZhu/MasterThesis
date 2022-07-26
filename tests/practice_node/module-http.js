const http = require('http');

const port = 5000;

const server = http.createServer((req, res)=>{
    // main home page
    if (req.url === '/') {
        res.write('Welcome to my home page!');
        res.end();
    }
    // about page
    else if (req.url === '/about') {
        res.write('Here is some history');
        res.end();
    }
    // unknown url
    else {
        res.write(`
            <h1>Oops!</h1>
            <p>I cannot find the page you are looking for. :(</p>
            <a href='/'>Click here!</a>
        `);
        res.end();
    }
})

server.listen(port);