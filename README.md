# Inhalert
Web Information Technology (INFO30005) group project repository. Inhalert is a Victorian air quality alert app, providing air quality summaries
and allowing users to register to receive notifications when the air quality in their area is poor.

Visit https://inhalert.herokuapp.com/
# Functionalities
Each of the core functionalities will be grouped together and explained below, as per submission guidelines.

A sample user account has been made for use throughout the marking process, however _we strongly encourage signing up with your own
email account to test the notification functionality_.

Email: test@test.test\
Password: password
1. ## User Management
    This functionalities allows users to create accounts, login, and subscribe to Site locations in Victoria for which they want to recieve notifications. It also includes an email change functionality, and a delete account functionality.
    
    _URL Endpoints_\
        Registration: `/users/register`\
        Login: `/users/login`\
        Preferences: `users/preferences`\
        Account: `users/account`\
        Logout: `users/logout`
    
    The route for this functionality is `routes/users`. 
    
    The controllers for this functionality are
    `controllers/users`, `controllers/preferences` and `controllers/account`.
    
    The models for this functionality are `models/user` and `models/siteSub`. 
    
    The views for this functionality are `views/register`, `views/login`, `views/preferences`,
    and `views/account`. Other views also change depending on whether a user is logged in, but are not
    part of the feature itself.
    
    A front-end javascript file is used `public/static/preferences`.
 
2. ## Notifications
    This functionality is responsible for updating internal site information, and sending out alerts to users when necessary.
    
    _URL Endpoints_\
        None: This feature is a backend feature that is constantly running.
    
    The routes for this feature are `routes/sites` and `routes/emails`.
    
    The controllers for this functionality are
    `controllers/sites` and `controllers/emails`.
    
    The models for this functionality are `models/site` and `models/siteSub`.
    
    `views/email` is used to embed Site summaries into email bodies. Arguably
    `views/preferences` is associated with this feature.
    
3. ## Website Air Quality Summaries
    This functionality is responsible for displaying Air quality information about each site on our 
    website, with or without an account
    
    _URL Endpoints_\
    Dashboard: `/dashboard`\
    Summary: `/dashboard/siteSummary:siteId`\
    About: `/about`
    
    The routes for this feature are `routes/dashboard` and `routes/index`.
    
    The controller for this functionality is `controllers/dashboard`
    
    There are no models for this functionality. Front end objects are used from `public/static/sites`
    and `public/static/colours`
    
    The views for this functionality are `views/index`, `views/about` and `views/summary`.
    
    Some front-end javascript files are used, which are `public/static/site_summary` and `public/static/convert_postcode`.

# Testing
Testing has been implemented for the User Management functionality. However, only integration style testing has been completed. 
Unit testing for controller functions proved very difficult, so much so that we could not complete it.

To run tests, simply type `npm test` in a terminal at the top level directory.

##
> NOTE: Old README below
# How to test if visiting website
* Visit https://inhalert.herokuapp.com/
* Register, first trying erroneous values to test validation of input. When you do register, make sure the email you are using is one you can check.
* From here you will be re-directed to a preferences page. Choose any Site and status, keeping a note of what you have chosen.
* From here you should be re-directed to the dashboard. The dashboard gets a live update on the summary of all major site locations in Victoria and displays them on the page.
* Inject a bad weather status into a site you subscribed to using Postman or similar. Try this a few times, as you may have injected a status
right before the app is updating its database. You want to inject the bad status right before triggering alerts. These loops are offset by 1 minute.
* From the dashboard you may also:
    * See full site summaries by entering your postcode or suburb, or clicking on a table name.
    * Update preferences by clicking on "Preferences"
    * logout and log back in again, testing that functionality
    * Update your email or delete your account at "Account"
    * Check out the About page

# How to test using POSTMAN (have not tried other similar apps)
* Set up the interceptor for Postman. It saves session cookies and will be needed to test certain endpoints. 
It is the satellite looking button in the top right corner of the desktop app. You will need to install a chrome extension. Clicking it will show you how to set it up. 
* Make sure you add the domain http://inhalert.herokuapp.com/ to the list of domains.
* Make a post request to https://inhalert.herokuapp.com/users/register using
url-encoded option containing name, email, password and password2 key-value pairs.
* Make a post request to https://inhalert.herokuapp.com/users/login with url-encoded email and password key-value pairs.
* You should now have a session cookie stored and can make authenticated requests.

