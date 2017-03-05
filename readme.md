# $ocial JS (Social JS) - Implementing social platform login made easier

Social JS is a wrapper library around popular social login platforms like Google, Facebook and LinkedIn. Instead of going through each platform's api and implementing it their way, you can use $ocial JS's common implementation for all the platforms.

## Platforms Supported

$ocial JS supports Google, Facebook and LinkedIn logins for now. Support for Twitter and Github will be added in the future.

## Getting Started

To get started, download the social-1.0.js file from the social js folder and include it in your project files.

### Prerequisites

Before implementing a login flow, you must have an api key for your app from that platform. For information on how to get an api key for Google, Facebook and LinkedIn, visit the following links respectively.

* [Google API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)
* [Facebook API Key](https://developers.facebook.com/docs/pages/getting-started)
* [LinkedIn API Key](https://developer.linkedin.com/support/faq)

### Implementing a login flow

In your HTML, create a div with id='$ocial-login'. The login button for your platform will be created inside this div.

```
<div id="$ocial-login"></div>
```

Now in your JS file, create an instance of the login by calling $ocial(). It takes two arguments
* 1. The login platform you want to implement
* 2. The API key of your app for that platform

```
var google = $ocial('google', [YOUR_API_KEY]);
```

Now that you have the instance created, call the implement method on your instance as shown below. You need to pass a callback function with the implement method so that it gets called after successful or failed implementation

```
google.implement(function (response) {
    console.log(response);
});
```

The implement method creates all the script tags and meta tags required to implement login flow for that platform and appends them to your document. It also creates a login button that comes with the API. For every change in login status or failed login attempts, the callback function you passed with the implement method gets called with a response argument.

* Response for succesful login

    On succesful login, the response object is:
    
    ```
    {
        name: [USER_NAME],
        email: [USER_EMAIL],
        id: [USER_ID],
        image_url: [USER_IMAGE_URL],
        platform: [CURRENT LOGIN PLATFORM IMPLEMENTED],
        headline: [USER_HEADLINE] // Only for LinkedIn
    }
    
    ```
* Response for failed login

    On failed login the response is just an error object returned from the API


### Demo Project

A demo project can be found in the public folder. It only works for localhost:3000 as I have registered that url as a redirect url when I got my API keys.

### Note

This is a work under progress. Support for more login platforms will be added.

## Authors

* **Rajiv Ratan Reddy** - *Initial work*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Google, Facebook and LinkedIn Javascript login APIs

