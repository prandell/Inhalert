# Inhalert
Web Information Technology (INFO30005) group project repository

# How to test if visiting website
* Visit https://inhalert.herokuapp.com/
* Register, first trying erroneous values to test validation of input. When you do register, make sure the email you are using is one you can check.
* From here you will be re-directed to a preferences page. **For the sake of demonstration, make sure you select "Melbourne CBD"**
and submit. This means you have subscribed to updates for Air quality at the Melbourne CBD site.
* From here you should be re-directed to the dashboard. The dashboard gets a live update on the summary of 12 major site locations in Victoria and displays them on the page.
* In roughly a minute, you should receieve an email telling you that the weather at Melbourne CBD is "Poor" or "Moderate". Our app has been set to inject this status for the sake of demonstration.
* From the dashboard you may also:
    * Press the "send email" button to send a stock email
    * Add more sites by pressing "Change alert preferences"
    * logout and log back in again, testing that functionality

# How to test using POSTMAN (have not tried other similar apps)
* Set up the interceptor for Postman. It saves session cookies and will be needed to test certain endpoints. 
It is the satellite looking button in the top right corner of the desktop app. You will need to install a chrome extension. Clicking it will show you how to set it up. 
* Make sure you add the domain http://inhalert.herokuapp.com/ to the list of domains.
* Make a post request to https://inhalert.herokuapp.com/users/register using
url-encoded option containing name, email, password and password2 key-value pairs.
* Make a post request to https://inhalert.herokuapp.com/users/ with url-encoded email and password key-value pairs. You should now have a session cookie stored.
* Make a post request to https://inhalert.herokuapp.com/users/preferences with url-encoded key value pair:
`selectedSite: 4afe6adc-cbac-4bf1-afbe-ff98d59564f9`
* A get request can now be made to https://inhalert.herokuapp.com/emails/send to receive a stock email. 
* Emails will be sent automatically be sent to your email address about Melbourne CBD same as explained in the website testing section.

