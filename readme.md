![build status](https://travis-ci.org/AntJanus/popstar-cms.svg?branch=master) ![dependencies](https://david-dm.org/antjanus/popstar-cms.png)
##Popstar CMS <img src="public/images/logo-small.png" width="50px" />
The file-based CMS running on NodeJS.

##Dependencies

* Node (obviously)
* Forever or other application for running Node in production
* Grunt (for development)

##Installation
Installation is simple as hell so here goes:

````
$ git clone https://github.com/AntJanus/popstar-cms.git
$ npm install
$ forever start server.js
````

##Development
To start the development environment:

````
$ grunt
````

##Templating

So, how do you built templates? All templates are [ejs](http://embeddedjs.com/) based but you can switch the template to anything you like (for example: Jade). Each template gets a payload of data sent to it upon route request.

The easiest way to view the payload is to append a route with `?format=json` to get the JSON format of the payload. Here's what it may look like:

````
{
  "title": "Test",
  "content": "nothing",
  "path": [
    "1-posts"
  ],
  "slug": [
    "posts"
  ],
  "children": [
    {
      "title": "Something",
      "content": "else",
      "path": "content/1-posts/1-first-post/post.md",
      "slug": [
        "posts",
        "first-post"
      ]
    }
  ],
  "site": {
    "title": "Site title"
  },
  "main": [
    {
      "title": "Test",
      "content": "nothing",
      "path": "content/1-posts/post.md",
      "slug": [
        "posts"
      ]
    }
  ]
}
````

###What does all this mean?

* `title` - Title of the primary file for the route
* `content` - Content of the primary file.
* `path` - the file path to the primary file
* `slug` - URL slug
* `children` - children to the file with their own root-level information
* `sites` - site title and other information
* `main` - top-level file information

##File Structure
The file structure for content is pretty simple. Each folder is made up of an ID (`1-`) and a slug path (`posts`). Within that folder a `post.md` file contains the actual contents for that folder. The slug is used to create a route for which the `post.md` will provide information for.

The ids are used to sort the files. For example, a `1-first-post` and `2-second-post` will get sorted accordingly. The slugs are used to create a route path. For instance, a structure of `contents/1-posts/1-first-post` will be available via `/posts/first-post`.

##Custom Variables
The variables accessible from the `post.md` are completely arbitrary. A `title` and `content` should always be present but anything extra/custom is voluntary and easy to add. Simply add a variable in the following format:

````
-----
customVariable: Something blah blah blah
````

There are some restrictions on the variable names:

* it has to be a single name, no spaces or special symbols
* it cannot conflict with javascript's built-in function and variable names

The variables will be automatically added to the file's variable listings in the JSON file and the payload.

###Array variables
Since I'm using this CMS for a variety of reasons, I thought it prudent to add array support (and possibly object support in the future!) so that when you want to list out certain data in an array, you don't have to bother with extra post-processing.

Here's how to go about it:

````
customArray[]: first element
-----
customArray[]: second element
````

And so on. The `customArray` values get squished down into an array accessible like so:

````
title: "My title",
content: "My content that you will read",
customArray: [ 'first element', 'second element']
````

##Custom configs
A `config.js` file at the root of the project allows you to override, change, or append additional configs to the project. 
