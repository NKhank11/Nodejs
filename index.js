const express = require("express");
const path = require("path");
require("dotenv").config();
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
const flash = require('express-flash');
const moment = require('moment');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const http = require("http");
const { Server } = require("socket.io");

const database = require("./config/database");

const systemConfig = require("./config/system");

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

database.connect();

const app = express();
const port = process.env.PORT;


// SocketIO 
const server = http.createServer(app);
const io = new Server(server); 

io.on("connection", (socket) => {
  console.log('A user connected', socket.id);
})

// End SocketIO

app.use(methodOverride('_method'));

// Flash
app.use(cookieParser('HDSBGKSKJS')); // Key tự tạo để mã hóa cookie
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End Flash

// TinyMCE
app.use(
  '/tinymce',
  express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// End TinyMCE


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;  // Tạo biến prefixAdmin để sử dụng trong tất cả các view
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

// Routes
route(app);
routeAdmin(app);
app.get("*", (req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found",
  });
});
 
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});