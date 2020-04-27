# Review notes

These are just some feedback items that I see for the project. Thank you for
giving me the chance to review it.

## The experience on Heroku

It's a very fancy home page with the scrolling and the different background
images. Nicely found and nicely done. Your image carousel is fully functional
and contains nice images.

The channels seem to work flawlessly. That's a real credit to all of you. Well
done. I like that I seem to be able to rename the channels that I created but
not the ones that I didn't.

I was pleasantly amused by my avatar. Full-moon-face-person is sometimes how I
feel. I could really _identify_ with it.

Emoji-view, while mostly illegible to me, works like a _charm_!

Sign-up, logging out, and logging in work with no problem. The fact that I can't
sign up more than once for an account with the same email address is all kinds
of right for data validation.

I really dig the C-logos, by the way.

OMG. Did I mention the audio, yet? I haven't? I <3 the audio! Good work! It adds
a whole new dimension to my interactions.

I would recommend hiding the stuff that you didn't get to. This will tighten
your presentation and not leave test users asking questions.

## Source files

Here is some stuff about the source files.

### Overall

Your code is gloriously consistent and clean. You only have a few places where
you've left in some commented-out code. This is the way code is meant to look.
Good job, here.

### .env

Why is there a DB_URL declaration in there? It doesn't seem to be used anywhere.
Having "extra" environment variables implies that they're used somewhere in the
code. Best to remove them so that no one (like me) gets confused.

Tighten up your security by following the recommendations in the last sections,
and this is a very nice backend.

### .gitignore

Your **.gitignore** file contains these three lines:

```
node_modules/git
node_modules
node_modules/
```

You really should only need

```
node_modules/
```

to prevent stuff in the `node_modules` directory from being included.

### README.md

Your README seems a couple of versions behind the front-end repository's. I
would sync on them.

### utils.js

Clean and understandable. You have an unused variable in your require of
"express-validator".

### auth.js

I know it's kind of boilerplate, that you were able to harvest most of this from
previous projects, but it is very nice to look at. Aesthetically pleasing code
removes one hurdle of maintaining code. Bravo.

### app.js

It is really great that, since this is a non-visual backend, one that serves
data and data only, that your generic error handler emits JSON. There are many
applications with which I've worked that rely on the generic Express error
handler that sends back HTML when an error occurs which just mucks up the
workings of a nice front-end application. You have done the polite and
well-designed thing.

When you broke the front-end off and went full API on the backend, it would help
clear things up by removing the `app.set('view engine', 'pug');` line in the
configuration of the server since you're not using any templates. (Also, remove
the dependency from **package.json**.)

Your configuration of the CORS middleware is exactly what the default
configuration is. Your code

```js
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}));
```

is the same as just doing

```js
app.use(cors());
```

### Models

These look great. Good use of the join table. I see where you were heading with
the `ChannelUsers` entity to get that advanced query for DMs, if I recall. I
think you're on the right path.

### Seeder file

Your seeder file inserts into four tables. Normally, you want to try to keep
them separate, one seeder file per table. However, if you really do want to do
all of them in one file, you actually need to put them in a transaction and
do a big `Promise.all` on them. So, it would look like this.

```js
up: async (queryInterface, Sequelize) => {
  return queryInterface.sequelize.transaction(t => {
    return Promise.all([
      queryInterface.bulkInsert('Users', ...),
      queryInterface.bulkInsert('Channels', ...),
      queryInterface.bulkInsert('ChannelUsers', ...),
      queryInterface.bulkInsert('Messages', ...),
    ]);
  });
}
```

Having it like that will make sure that _all_ inserts succeed or fail. That way,
should something bad happen when trying to insert records into "Channels", it
doesn't cascade into all of the channels.

Also, I'm a fan of the message "I like poop". There's nothing like a little poop
in the seed files. However, the Career Coaches might frown on this. You might
want to prevent their ire by removing those seed messages.

### Channel routes

I like that you get very specific attributes from the database rather than
letting them _all_ come back. That's a very good use of the ORM.

I'm a little surprised that the actions to rename a channel and delete a channel
are not behind the `requireAuth` middleware. I can successfully rename a channel
using Insomnia and no JWT. I would change the route handlers to use
`requireAuth`, to ignore any `userId` sent in the body of the request, and use
the `id` of the restored user on `req.user` rather than some easily manufactured
(or guessed) `userId` in the body.

Now that I'm looking at it, I'm surprised that you let any of your channel
routes be accessed without authorization. I would put them _all_ behind the
`requireAuth` middleware.

### Message routes

At the risk of repeating myself, I'd do the same thing on _all_ of the routes
for messages, too.

* Put them behind `requireAuth`
* Use the id of the restored user on `req.user.id` rather than `userId` sent
  in the payload of the message

As it stands, with some guessing or a script, I could probably delete all
messages in the application.

### Users routes

Your validations, here, and use of authorization are protecting most of your
routes. The unguarded ones are "update a user" and "delete a user". Again, with
some clever guessing or a script, I could probably update everyone's name to be
something silly.
