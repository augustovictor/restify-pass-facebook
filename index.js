var restify            = require( 'restify' );

// Config vars
var FB_LOGIN_PATH      = '/api/facebook/login';
var FB_CALLBACK_PATH   = '/api/facebook/callback';
var FB_APPID           = '564309943746864';
var FB_APPSECRET       = '1c22c105f9dce179b729330dc63fa1e4';
var port               = process.env.PORT || 3000;
var SERVER_PREFIX      = 'http://localhost:' + port;

// Setup server
var server             = restify.createServer();
server.use( restify.queryParser() );

// Setup passport-facebook
var passport           = require( 'passport' );
var FacebookStrategy   = require( 'passport-facebook' ).Strategy;

// Initialize passport
server.use( passport.initialize() );

// Sessions aren't used in this example.  To enabled sessions, enable the
// `session` option and implement session support with user serialization.
// See here for info: http://passportjs.org/guide/configuration.html
var fbLoginHandler     = passport.authenticate( 'facebook', { session: false } );
var fbCallbackHandler  = passport.authenticate( 'facebook', { session: false } );
var fbCallbackHandler2 = function ( req, res ) {

	console.log( 'We\'re logged in.' );
	console.log( 'USER: ' + req.user );
	res.send( '200', req.user.displayName );

};

server.get( FB_LOGIN_PATH, fbLoginHandler );
server.get( FB_CALLBACK_PATH, fbCallbackHandler, fbCallbackHandler2 );

passport.use( new FacebookStrategy( {
	clientID     : FB_APPID,
	clientSecret : FB_APPSECRET,
	callbackURL  : SERVER_PREFIX + FB_CALLBACK_PATH
	// passReqToCallback: true,
	// profileFields: [ 'id', 'displayName', 'photos', 'email' ]
}, function( accessToken, refreshToken, profile, done ) {

	console.log( 'AccessToken: ' + accessToken + '\nFacebookId: ' + profile.id );
	return done( null, profile );

    } )
);

// Start app
server.listen( port );
console.log( 'App started on port ' + port );
