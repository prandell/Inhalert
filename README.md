# Inhalert
Web Information Technology (INFO30005) group project repository

#How to get on your branches
* From a terminal within your project folder first run
`git fetch` to get all updates to branches on the remote repo.
* Then run 
`git branch` to see what branch you are currently on.
    * If your own branch doesnt exist, create one with `git branch <your-branch-name>`.
To see that its now there, run `git branch` again.
* Now, switch to your branch with `git checkout <your-branch-name>` if you werent on it already
* Now merge in the changes from my branch with `git merge patrick`
    * You may have some conflicts, in which case you go into the files that conflicts exist in, delete everything you 
    dont want, keep everything you do want, and then finish with `git commit`
* You have now merged and can play around with it on your branch
# How to get it running
* First run `npm install`
* Visit [MondoDb Atlas](https://cloud.mongodb.com/) and log in with my credentials
    * Email: prandell@student.unimelb.edu.au
    * Password: Inhalert1
* Go to the `Network Access` tab on the left hand side and add your computer IP address to the whitelist.
* Typing `node app devStart` will now get it started. if you go into the package.json file you will see I have added a script 'devStart'
which gets nodemon running so any changes you make restart the server automatically.
* First visit `localhost:3000/`
* Press the links, and try registering (try some things you
dont think will work first)
* Register properly
* Now log in (first with wrong stuff, then correctly)
#What its using
* The `.env` file in the repo is generally added to the `.gitignore` file. It contains environment variables that are 
generally sensitive and carry info that is specific to the developers use of the app. Eg, my Database connect link (containing my password). 
I've left it in there on purpose so we are all using my MongoDb Atlas free tier, but feel free to set your own up and replace that env variable!
    * This is the [link](https://canvas.lms.unimelb.edu.au/courses/8135/modules/items/1827299) for the tutorial in making a free tier and connecting.
* App.js contains most of the library imports and configuration required, the rest is in the config folder in files.
* [Passport](http://www.passportjs.org/) is used for authentication (logging in, staying logged in, logging out)
* MongoDB handles storing users in the database.
* [Bcrypt](https://www.npmjs.com/package/bcrypt) hashes passwords and compares them when logging in
* I used a few free templates for stylesheets and views, namely [Bootstrap](getbootstrap.com), [Bootswatch](bootswatch.com)
and [FontAwesome](fontawesome.com). Just scroll down on most of them.

