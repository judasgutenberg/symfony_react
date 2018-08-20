# symfony-react
I built a simple demo scheduling system with a Symfony backend and a React fontend

Things to be aware of:

scheduler.sql is a dump of a small database of users and shifts.

There is a simple login mechanism so the system will know what data to show to whom.
Login with email addresses and passwords.  All the passwords for all the users are "1111"
I had to add a "password" column to the user table to support this.

I've disabled user creation (so as not to provide routes for things not specified in the user stories), 
though there is code to support it that can be enabled in the UserController of the Symfony backend.

An employee login to try is gus@asecular.com/1111  .

A manager login to try is oscarpoof@dribble.org/1111  .

The display of shifts is very basic. In a better system, there would be multiple views and calendars and such, but that would've taken awhile to get working nice.

The employee/manager dropdowns in the ShiftEditor (in the React frontend) can be a bit wonky. In theory they should work beautifully, but there seems to be a bug in the module I went with. Sometimes you have to play with it a bit to get the right user to appear.

In the backend if you want to get this working, Symfony is going to need some additional components.  In particular, you should use composer to install the rest-bundle, the doctrine-cache-bundle, and a few other things:

_composer require friendsofsymfony/rest-bundle_

_composer require symfony/serializer_

_composer require doctrine/doctrine-cache-bundle_

_composer require doctrine/doctrine-bundle_

_composer require sensio/framework-extra-bundle_ 

_composer require doctrine/doctrine-migrations-bundle_

_composer require symfony/security-bundle_

(Depending on your Symfony setup, you could spend all day installing bundles this way!)

React also needs some modules: cookiejar, formidable, superagent, and attr-accept

In the provided source code, the React frontend is hardcoded to access the Symfony backend at "http://localhost:8000/api/" -- to change that, edit line 15 of /src/App.js
The connection info for the Symfony database is in /.env, line 27.

To see this app working live on the web, the url is http://randomsprocket.com/sched_frontend/
The live backend (should you like to see the JSON) is at http://sched.randomsprocket.com/api
Some endpoints include:

http://sched.randomsprocket.com/api/user

http://sched.randomsprocket.com/api/user/1

http://sched.randomsprocket.com/api/user/weeklysummary/1


--Gus Mueller, August 18 2018
