# Inhalert
Web Information Technology (INFO30005) group project repository. Inhalert is a Victorian air quality alert app, providing air quality summaries
and allowing users to register to receive notifications when the air quality in their area is poor.

# How to test if visiting website
* Visit https://inhalert.herokuapp.com/
* Register, first trying erroneous values to test validation of input. When you do register, make sure the email you are using is one you can check.
* From here you will be re-directed to a preferences page. **For the sake of demonstration, make sure you select "Melbourne CBD"**
and submit. This means you have subscribed to updates for Air quality at the Melbourne CBD site.
* From here you should be re-directed to the dashboard. The dashboard gets a live update on the summary of all major site locations in Victoria and displays them on the page.
* ~~In roughly 2 minutes, you should receieve an email telling you that the weather at Melbourne CBD is "Poor" or "Moderate". Our app has been set to inject this status for the sake of demonstration.
In another 2 minutes, the automatic updates should set it back to "Good" and you'll get another email.~~ This has been changed, as it would continuously send emails. Instead we recommend using the button after logging in or to manually inject a bad status using the manual endpoint.
* From the dashboard you may also:
    * Press the "send email" button to send a stock email
    * Add more sites by pressing "Change alert preferences"
    * logout and log back in again, testing that functionality
* _New functionalities now implemented:_
    * Dashboard displays a list of all sites, the list has a show more and refresh button.
    * Clicking on the name of these sites takes you to a summary page where scientific details can be seen for those sites
    * Entering a Victorian postcode in the form at the top also takes you to a summary page for the closest site.

# How to test using POSTMAN (have not tried other similar apps)
* Set up the interceptor for Postman. It saves session cookies and will be needed to test certain endpoints. 
It is the satellite looking button in the top right corner of the desktop app. You will need to install a chrome extension. Clicking it will show you how to set it up. 
* Make sure you add the domain http://inhalert.herokuapp.com/ to the list of domains.
* Make a post request to https://inhalert.herokuapp.com/users/register using
url-encoded option containing name, email, password and password2 key-value pairs.
* Make a post request to https://inhalert.herokuapp.com/users/login with url-encoded email and password key-value pairs. You should now have a session cookie stored.
* Make a post request to https://inhalert.herokuapp.com/users/preferences with url-encoded key value pair:
`selectedSite: 4afe6adc-cbac-4bf1-afbe-ff98d59564f9`
* A get request can now be made to https://inhalert.herokuapp.com/emails/send to receive a stock email. 
* Emails will be sent automatically be sent to your email address about Melbourne CBD same as explained in the website testing section, however there are also manual endpoints:
    * POST to https://inhalert.herokuapp.com/sites/inject: Requires url-encoded siteName and status key-value pairs. Will return json informing whether the injection worked.
    * GET to https://inhalert.herokuapp.com/sites/update: Updates DB records manually, lets you know how many were updated.
    * GET to https://inhalert.herokuapp.com/sites/check: Checks if any DB Site records meet alert conditions and sends out alerts.
    
# Some important notes
* Might be easiest to clone the repo, and comment out the automatic updating in `routes/sites` to then do manual site testing without interference to localhost, and visit the live website for everything else.
* The automatic injection of a bad status for Melbourne CBD only happens 2 minutes after the website is launched, so that will need to be tested manually using the inject endpoint (has to be in the minute between checking and updating so try it a few times) or just press the send email button on the dashboard when logged in to see that that functionality is working.

