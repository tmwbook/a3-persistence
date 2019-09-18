## Chronus Continuum

http://a3-tmwbook.glitch.me

Logging in:
- User1
  - pw: `hunter2`
- User2
  - pw: `hunter2`

Chronus Continuum is your one stop solution to keping track of how long ago something happened.
Our next generation counting techonology allows you reflect on how long you've been working, playing, creating, anything!
Chronus Continuum is truly a necesity in today's world of transient goals.

This app uses:
- Bootstrap
- Local Authentication for Passport
- I wanted to get practice working with hashing/salting, which would not have been possible with OAuth. Local was perfect for this practice.
- LowDB

The Express Middleware that was used:
- Passport
  - Handles intercepting the login requests and works with `pwd` to auth the user.
- Bodyparse
  - Parses JSON and form data that comes to the server.
- Favicon
  - Serves the request for the favicon.ico file.
- Session
  - Keeps a persistent session so the user does not need to authenticate every action.
- Static
  - Servese static HTML, CSS, and JavaScript files.

Challenges
- Dynamically hooking up the clock instances based on how many a user had active in the databse.
  - These needed to be instantiated using JavaScript, as well as kept track of in case we reset or delete them.

Technical Defficiencies:
- The library `FlipClock` has a bug where 3 digit hours end up having the 1's digit of hours in the minutes section.
EX: 139 hours 22 minutes 15 seconds appears as: `13:922:15`

## Technical Achievements
- **Tech Achievement 1**: I used `nunjucks` to template the HTML on the secure pages.
This removed some code reuse on libraries loaded from a CDN. Additionally, it endabled a dynamic number of clocks to be used on the status page, which otherwise would have taken a significant amount of JavaScript to acomplish.
- **Tech Achievement 2**: I used the `pwd` package to store a hash + salt of the users password instead of the plaintext. If the database would ever be compromised, no credentials would be released, and we could just require users to change their password on next login.
- **Tech Achievement 3**: I used `moment` with `FlipClock` to achieve the main functionality of the website.
Moment is used as the timestamp stored in the database and is then compared to set the initial value of the clock on the status page. `FlipClock` then continues to count up from there.

### Design/Evaluation Achievements
- **Design Achievement 1**: Performed a small override on the bootstrap css background color to give the app a more grounded feel.
- **Design Achievement 2**: I ensured that I used the proper classes for bootstrap buttons. This provides some benefit to screen reading software, as well as a visual consistency.
- **Design Achievement 3**: Implemented a 'fire-and-hope' method for resetting timers.
When the user presses the reset button, the webpage instantly reset the clock visually, and sends a request to be processed by the server.
This way, we don't hold up the user from doing other actions while we update the entry in the database.
This at most makes a couples second inconsistnecy that will be fixed on the next page load.
