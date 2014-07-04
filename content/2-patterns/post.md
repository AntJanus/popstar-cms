title: Patterns
-----
content:

One of the hardest parts of starting with a new CMS is being able to understand how you can structure your application and what you can do with it. This comes with reading through examples, exploring edge cases, and seeing production-ready applications.

I mentioned a couple of demos on the home page but they're not really enough. There is no explanation so let me dive right into some common situations and how you can tackle them.

##Fully front-end
Building an API for a CMS can be difficult, even if it's read-only. However, with just a few changes in the `routes/` section of Popstar CMS, you'll turn  your entire feed into a JSON feed that'll be easy to access and use for a front-end application.

For a production-ready application that utilizes this pattern, checkout my [jumbotron app](https://github.com/AntJanus/jumbotron-feed-app). It utilizes [Vuejs](http://vuejs.org/) for its front-end framework.

###Routes
The core of Popstar (in `/routes/lib` currently) need not ever be changed. So let's tackle routes. Popstar uses [ExpressJS](expressjs.com) so whatever works with that framework will work here as well. For these purposes, we're just going to prepend our regular routes with `/api` like so:

````
//routes
app.get('/api/*', function(req,res) {
````

This will route anything starting with `/api/` to this routing function. However, we have to change some things within the routing function. First, let's look at the slug function:

`var slug = req.params[0].split('/');`

The slug directly corresponds to the structure of the content. So if the request comes in from `/blog/posts/first-post`, Popstar will look under `/yourcontentfolder/x-blog/x-posts/x-first-post` where x is equal to an id (used for sorting).

If we keep things as is, Popstar will try to look in `/yourcontent/x-api/x-blog/x-posts/x-first-post` which is not what we want. Instead, we'll slice off the first argument in the slug like so:

````
var slug = req.params[0].split('/').slice(1);
slug.shift();
````

`.shift()` removes the first element of an array. If we had inlined-it, shift would return that element into `slug`, not what we want. So this will work.

Anything else? One more thing. We want to bypass using a view engine and instead send back the data in a JSON format at all times. So remove the `var format` declaration and at the end of the routes, we can simplify how we send our payload:

````
if (format === 'json') {
  res.send(payload);
} else {
  payload.md = md;
  res.render('index', payload);
}
````

into:

````
res.send(payload)
````

And that should be it. Popstar automatically prefers using `/public` over our routes so your `public/index.html` will get preference over route matching. Once that loads up, as long as you don't create an `api` folder under `/public`, you'll have access to all the data you're used to on the front-end.
