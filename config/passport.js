// config/passport.js

// load all the things we need
// var LocalStrategy = require('passport-local').Strategy;
// var FacebookStrategy = require('passport-facebook').Strategy;
// var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

// load up the user model
const User = require('../models').User;


// load the auth variables
var configAuth = require('./auth');

module.exports = function (passport) {

       passport.serializeUser((user, callback) => {
           callback(null, user);
       });

       passport.deserializeUser((obj, callback) => {
           callback(null, obj);
       });

    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))
    // code for facebook (use('facebook', new FacebookStrategy))
    // code for twitter (use('twitter', new TwitterStrategy))

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use('googleToken', new GoogleStrategy({

            clientID: process.env.clientID,
            clientSecret: process.env.clientSecret,
            callbackURL: process.env.callbackURL,

        },
        async(token, refreshToken, profile, done) => {

            console.log('USER PROFILE.......', profile);

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google
            try {
                const existingUser = await User.findOne({
                    where: {
                        auth_id: profile.id,
                    }
                });
                if (existingUser) {
                    console.log('User already exists in our database');
                    return done(null, existingUser);
                }
                console.log('User does not exists in our database');
                const newUser = new User({
									  auth_id: profile.id,
                    token: token,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                });
                // console.log('USER.....', newUser);
                await newUser.save();
                done(null, newUser);
            } catch (error) {
                done(error, false, error.message);
            }

        }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use('facebookToken', new FacebookStrategy({
					// pull in our app id and secret from our auth.js file
					clientID: process.env.facebookAppId,
					clientSecret: process.env.facebookClientSecret,
					callbackURL: process.env.facebookCallbackURL
          },
					// facebook will send back the token and profile
					async(token, refreshToken, profile, done)  => {
							// console.log('FACEBOOK PROFILE......', profile);
							// console.log('TOKEN........', token);
						   try {
						   	const existingUser = await User.findOne({
						   		where: {
						   			auth_id: profile.id,
						   		}
						   	});
						   	if (existingUser) {
						   		console.log('User already exists in our database');
						   		return done(null, existingUser);
						   	}
						   	console.log('User does not exists in our database');
						   	const newUser = new User({
									auth_id: profile.id,
						   		token: token,
						   		name: profile.displayName,
						   	});
						   	// console.log('USER.....', newUser);
						   	await newUser.save();
						   	done(null, newUser);
						   } catch (error) {
						   	done(error, false, error.message);
						   }
					}     
			));
		
		// =========================================================================
		// TWITTER =================================================================
		// ====================================================================
		    passport.use('twitterToken', new TwitterStrategy({
		    		// pull in our app id and secret from our auth.js file
		       	consumerKey: process.env.twitterAppId,
		       	consumerSecret: process.env.twitterAPISecret,
		       	callbackURL: process.env.twittercallbackURL
		    	},
		    	// facebook will send back the token and profile
		    	async (token, refreshToken, profile, done) => {
		    		console.log('TWITTER PROFILE......', profile);
		    		console.log('TWITTER TOKEN........', token);
		    		try {
		    			const existingUser = await User.findOne({
		    				where: {
		    					auth_id: profile.id,
		    				}
		    			});
		    			if (existingUser) {
		    				console.log('User already exists in our database');
		    				return done(null, existingUser);
		    			}
		    			console.log('User does not exists in our database');
		    			const newUser = new User({
		    				auth_id: profile.id,
		    				token: token,
		    				name: profile.displayName,
		    			});
		    			// console.log('USER.....', newUser);
		    			await newUser.save();
		    			done(null, newUser);
		    		} catch (error) {
		    			done(error, false, error.message);
		    		}
		    	}
		    ));
};
