// const person = require('./person');
// const Person = require('./person');

// // console.log(person.name);
// const person1 = new Person('michael mansy', 25);

// person1.greeting();

const http = require('http');
const path = require('path');
const fs = require('fs');

//create the server
const server = http.createServer(function (req, res) {
    //if we want to go the /index.html
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    }

    //same process to go to the about.html page
    if (req.url === '/about.html') {
        fs.readFile(path.join(__dirname, 'public', 'about.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    }

    //say we want to fetch data from an api (now json for simplicity)
    if (req.url === '/api/users') {
        const users = [
            { name: 'Michael Mansy', age: 25 },
            { name: 'Sam Newman', age: 35 }
        ];
        res.writeHead(200, { 'Content-Type': 'application.json' });
        res.end(JSON.stringify(users));
    }

    //NOW all that isnot very effiecient specially when dealing with css or images
    //let's build the path and extension w keda bas dynamically
    // Build file path
    let filePath = path.join(
        __dirname,
        "public",
        req.url === "/" ? "index.html" : req.url
    );

    // Extension of file
    let extname = path.extname(filePath);

    // Initial content type
    let contentType = "text/html";

    // Check ext and set content type
    switch (extname) {
        case ".js":
            contentType = "text/javascript";
            break;
        case ".css":
            contentType = "text/css";
            break;
        case ".json":
            contentType = "application/json";
            break;
        case ".png":
            contentType = "image/png";
            break;
        case ".jpg":
            contentType = "image/jpg";
            break;
    }

    // Read File
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code == "ENOENT") {
                // Page not found
                fs.readFile(
                    path.join(__dirname, "public", "404.html"),
                    (err, content) => {
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.end(content, "utf8");
                    }
                );
            } else {
                //  Some server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf8");
        }
    });
});


//choose port
const PORT = process.env.PORT || 5000;

//listen
server.listen(PORT, () => console.log(`Server running on ${PORT}`));

