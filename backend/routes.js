// app/routes.js
var node = require('../backend/models/nodes');
var dev_dash = require('../backend/models/dash');

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('../dist/pages/login/login.ejs', { message: req.flash('loginMessage') }); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('../dist/pages/login/login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/main', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('../dist/pages/login/signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/login', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/main', isLoggedIn, function(req, res) {
        res.render('../dist/index.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // [HomeStark] Start our routes from SPA
    // =====================================
    // MAIN SECTION   ======================
    // =====================================
    // Main routes for mongodb

    // Get the devices to list
    app.get('/devices/list', function(req, res) {
      node.find({}, function (err, nodes) {
        res.send(nodes);
      });
    });

    // Get the dash sensors to list in dashboard
    app.get('/dash/list', function(req, res) {
      dev_dash.find({}, function (err, dash) {
        res.send(dash);
      });
    });

    // Set data from dashboard
    app.post('/dash/setData', function(req, res) {
      console.log(req.body);
      res.send('ok');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
