/*!
 * $ocial JS (Social JS) by Rajiv
 *
 * Implementing social platform logins made easier with common implementation syntax for all platforms
 * 
 * A wrapper library around authentication developer apis of Google, Facebook and Linkedin.
 * 
 * Twitter and Github support will be added later
 *
 * Supports jQuery usage
 *
 * License: MIT license
 *
 * Date: 03/05/2017
 */

(function (global, $) {

    // Define a local copy of $ocial
    var $ocial = function (name, key) {
        return new $ocial.init(name, key);
    };

    // List of platforms currently supported
    var supportedPlatforms = ['google', 'facebook', 'linkedin'];
    
    // List of urls used for implementations
    var urls = {
        google: {
            metaTagName    : 'google-signin-client_id',
            metaTagContent : '.apps.googleusercontent.com',
            scriptSrc      : 'https://apis.google.com/js/platform.js'
        },
        facebook: {
            scriptSrc      : '//connect.facebook.net/en_US/sdk.js',
            apiCall        : '/me?fields=email,cover,name'
        },
        linkedin: {
            scriptSrc      : '//platform.linkedin.com/in.js',
            apiCall        : '/people/~:(id,email-address,first-name,last-name,headline,picture-url)'
        }
    };

    // Defining the prototype object for $ocial. (Contains all the implementation methods)
    $ocial.prototype = {
        
        implementGoogle: function(callback) {
            
            // Creates meta tag and appends to <head>
            this.createGoogleMetaTag();           
            
            // Creates script tag with google developer api and appends to <head>
            this.createGoogleScriptTag();            
            
            // Creates a google sign in button and appends to div with id = $ocial-login
            this.createGoogleLoginButton();            
            
            // Defining callback which gets called after successful google signin
            // google$ocialProfileDetails is created globally for google api to access.
            // this.getGoogleProfileDetails returns a function which gets assigned to google$ocialProfileDetails
            google$ocialProfileDetails = this.getGoogleProfileDetails(callback);
            
            // Defining callback which gets called after failed google signin
            // google$ocialProfileFail is created globally for google api to access.
            // this.google$ocialProfileFail returns a function which gets assigned to google$ocialProfileFail
            google$ocialProfileFail = this.getGoogleProfileError(callback);
            
        },
        
        createGoogleMetaTag: function () {
            
            // Creating meta tag for google api
            var m = document.createElement('meta');
            m.name = urls.google.metaTagName;
            
            // Adding google api key to meta tag
            m.content = this.key + urls.google.metaTagContent;

            // Appending meta tag to <head>
            document.getElementsByTagName('head')[0].appendChild(m);
            
        },
        
        createGoogleScriptTag: function () {
            
            // Creating script tag to fetch google api
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = urls.google.scriptSrc;
            s.setAttribute('async', '');
            s.setAttribute('defer', '');

            // Appending script tag to <head>
            document.getElementsByTagName('head')[0].appendChild(s);
            
        },
        
        createGoogleLoginButton: function () {
            
            // Creating google sign in button
            var b = document.createElement('div');
            b.setAttribute('class', 'g-signin2');
            b.setAttribute('data-onsuccess', 'google$ocialProfileDetails');
            b.setAttribute('data-onfailure', 'google$ocialProfileFail');

            // Appending sign in button to div with id '$ocial-login'
            document.getElementById('$ocial-login').appendChild(b);
            
        },
        
        getGoogleProfileDetails: function (callback) {
            
            // Returning function which gets assigned to the global google$ocialProfileDetails
            // this function receives the google user data after succesfull login. That data is sent as argument to the callback function obtained from implementing the login
            return function (googleUser) {
                var p = googleUser.getBasicProfile();
                // Calling the callback with google user data
                callback({
                    'platform': 'google',
                    'id': p.getId(),
                    'name': p.getName(),
                    'image_url' : p.getImageUrl(),
                    'email' : p.getEmail()
                });
            };
            
        },
        
        getGoogleProfileError: function (callback) {
            
            // Returning function which gets assigned to the global getGoogleProfileError
            // this function receives the google authentication error in case of a failed login. That error is sent as argument to the callback function obtained from implementing the login
            return function (error) {               
                callback(error);
            };
            
        },
        
        implementFacebook: function (callback) {
            
            var self=this;
            
            // Defining global function facebook$ocialStatusChangeCallback which gets called whenever there is a change in login status.
            // this.facebook$ocialStatusChangeCallback returns a function which gets assigned to facebook$ocialStatusChangeCallback
            facebook$ocialStatusChangeCallback = this.facebook$ocialStatusChangeCallback(callback);

            // Defining global checkLoginState which will be used by facebook api to check current login state.
            // this.checkFacebookLoginState returns a function which gets assigned to checkLoginState
            checkLoginState = this.checkFacebookLoginState();

            // Initializing the api with api key
            global.fbAsyncInit = function() {
                FB.init({
                    appId      : self.key, // api key
                    cookie     : true,  // enable cookies to allow the server to access 
                    xfbml      : true,  // parse social plugins on this page
                    version    : 'v2.8' // use graph api version 2.8
                });

                // Getting login status during initialization
                FB.getLoginStatus(function(response) {
                    facebook$ocialStatusChangeCallback(response);
                });

            };
            
            // Creates script tag with google developer api and appends to <body>
            this.createFacebookScriptTag(document, 'script', 'facebook-jssdk');            
            
            // Creates facebook login button and appends to div with id '$ocial-login'
            this.createFacebookLoginButton();
            
        },
        
        createFacebookScriptTag: function (d, s, id) {
            
            // Creating facebook api script tag
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = urls.facebook.scriptSrc;
            fjs.parentNode.insertBefore(js, fjs);
            
        },
        
        createFacebookLoginButton: function () {
            
            // Creating facebook login button
            var b = document.createElement('div');
            b.setAttribute('class', 'fb-login-button');
            b.setAttribute('data-max-rows', '1');
            b.setAttribute('data-size', 'medium');
            b.setAttribute('data-show-faces', 'false');
            b.setAttribute('onlogin', 'checkLoginState()');
            b.setAttribute('data-auto-logout-link', 'false');
            
            // Appending login button to div with id '$ocial-login'
            document.getElementById('$ocial-login').appendChild(b);
            
        },
        
        facebook$ocialStatusChangeCallback: function (callback) {
            
            // Returning function that gets assigned to global facebook$ocialStatusChangeCallback
            // For every change in login status, this function gets called with login status
            return function (response) {
                // Calling facebook api to get user details if status is connected 
                if (response.status === 'connected') {
                    // Calling facebook api
                    FB.api(urls.facebook.apiCall, function(data) {
                        // Calling the callback function from implementation with data obtained from calling facebook api
                        callback({
                            'platform': 'facebook',
                            'id': data.id,
                            'name': data.name,
                            'image_url' : data.cover.source,
                            'email' : data.email
                        });
                    });
                } else if (response.status === 'not_authorized') {
                    callback(response);
                } else {
                    callback(response);
                }
            };
            
        },
        
        checkFacebookLoginState: function () {
            
            // Returning function that gets assigned to global checkLoginState
            return function () {
                
                //Calling facebook apis method to get the current login state
                FB.getLoginStatus(function(response) {
                    
                    // Calling the status change callback with response
                    facebook$ocialStatusChangeCallback(response);
                });
            };
            
        },
        
        implementLinkedin: function (callback) {
            
            // Creates script tag for linkedin api and appends to <head>
            this.createLinkedinScriptTag();
            
            // Creates linkedin login button and appends to <div with id '$ocial-login'
            this.createLinkedinButton();
            
            // Defining global onLinkedin$ocialLoad function which gets called on api load
            onLinkedin$ocialLoad = this.onLinkedin$ocialLoad();
            
            // Defining global getLinkedin$ocialProfileData function to make a call for getting logged in user data
            getLinkedin$ocialProfileData = this.getLinkedin$ocialProfileData();
            
            // Defining global onLinkedin$ocialSuccess callback function for getLinkedin$ocialProfileData success callback
            onLinkedin$ocialSuccess = this.onLinkedin$ocialSuccess(callback);
            
            // Defining global onLinkedin$ocialError callback function for getLinkedin$ocialProfileData error callback
            onLinkedin$ocialError = this.onLinkedin$ocialError(callback);
            
        },
        
        createLinkedinButton: function () {
            
            // Creating linkedin login button
            var b = document.createElement('script');
            b.type = 'in/Login';
            
            // Appending login button to div with id '$ocial-login'
            document.getElementById('$ocial-login').appendChild(b);
            
        },
        
        createLinkedinScriptTag: function () {
            
            // Creating linkedin script tag
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = urls.linkedin.scriptSrc;
            
            // Adding api key to url
            var code = '\napi_key:' + this.key + '\nonLoad:onLinkedin$ocialLoad\nauthorize:true\n';
            
            // Appending to <head>
            try {
                s.appendChild(document.createTextNode(code));
                document.getElementsByTagName('head')[0].appendChild(s);
            } catch (e) {
                s.text = code;
                document.getElementsByTagName('head')[0].appendChild(s);
            }
            
        },
        
        onLinkedin$ocialLoad: function () {
            
            // Returning function that gets assigned to global onLinkedin$ocialLoad
            // Makes a call to linkedin api's auth listener
            return function () {
                IN.Event.on(IN, "auth", getLinkedin$ocialProfileData);
            };
            
        },
        
        getLinkedin$ocialProfileData: function () {
            
            // Returning function that gets assigned to global getLinkedin$ocialProfileData
            // Makes a call to linkedin api to get logged in users info
            return function () {
                IN.API.Raw(urls.linkedin.apiCall).result(onLinkedin$ocialSuccess).error(onLinkedin$ocialError);
            }
            
        },
        
        onLinkedin$ocialSuccess: function (callback) {
            
            // Returning function that gets assigned to global onLinkedin$ocialSuccess
            return function (data) {
                // Sending data to the callback from implementation
                callback({
                    'platform': 'linkedin',
                    'id': data.id,
                    'name': data.firstName + ' ' + data.lastName,
                    'image_url' : data.pictureUrl,
                    'headline': data.headline,
                    'email': data.emailAddress
                });
            }
        },
        
        onLinkedin$ocialError: function (callback) {
            
            // Returning function that gets assigned to global onLinkedin$ocialError
            return function (error) {
                // Sending error to the callback from implementation
                callback(error);
            }
        },
        
        // Defining main implement function that calls respective implement functions based on platform chosen
        implement: function (callback) {
            
            switch (this.name) {
                case 'google':
                    this.implementGoogle(callback);
                    break;
                case 'facebook':
                    this.implementFacebook(callback);
                    break;
                case 'linkedin':
                    this.implementLinkedin(callback);
                    break;
                    
            }
            
            return this;
            
        },

        // Validates platform and api key
        validate: function () {
            
            if (supportedPlatforms.indexOf(this.name) === -1) {
                throw 'Social platform ' + this.name + ' not supported';
            }
            
            if (!this.key) {
                throw this.name + ' API Key not found';
            }
            
        },
        
        // Google signout fucntion
        signOutGoogle: function (callback) {
            
            // Calling google api to logout
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                callback();
            });
            
        },
        
        // Facebook signout fucntion
        signOutFacebook: function (callback) {
            
            // Calling facebook api to logout
            FB.logout(function(response) {
                callback();
            });
            
        },
        
        // Linkedin signout fucntion
        signOutLinkedin: function (callback) {
            
            // Calling Linkedin  api to logout
            IN.User.logout(callback);
            
        },
        
        // Main signout function which calls respective signout function based on platform implemented
        signOut: function (callback) {
            
            switch (this.name) {
                case 'google':
                    this.signOutGoogle(callback);
                    break;
                case 'facebook':
                    this.signOutFacebook(callback);
                    break;
                case 'linkedin':
                    this.signOutLinkedin(callback);
                    break;
            }
            
        },

        // Log method logs current platform to console
        log: function() {
            
            if (console) {
                console.log('Current login platform: ' + this.name);
            }

            return this;
            
        }

    };

    // Defining the init which takes platform name and api key.
    $ocial.init = function(name, key) {
        
        var self = this;
        self.name = name || '';
        self.key = key;

        self.validate();
        
    };

    $ocial.init.prototype = $ocial.prototype;

    global.$ocial = $ocial;

}(window, jQuery));