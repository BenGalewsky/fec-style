
## Moneyfollower.us
This application uses [neo4j](http://neo4j.com/) network database to model the flows of campaign money between Political Action Committees (PACs) to federal candidates. With a network graph visulaization it's easy
to see the complex flows that occur between PACs. You can double-click on any committee to follow the money
and get a new graph centered on the selected committee.

## The Data
The data is downloaded from the [Federal Election Commission](http://www.fec.gov/finance/disclosure/ftpdet.shtml#a2015_2016). In 1975, Congress created the Federal Election Commission (FEC) to administer and enforce the Federal Election Campaign Act (FECA) - the statute that governs the financing of federal elections. The duties of the FEC, which is an independent regulatory agency, are to disclose campaign finance information, to enforce the provisions of the law such as the limits and prohibitions on contributions, and to oversee the public funding of Presidential elections.

## The App
I am very grateful for the work that [18F](http://18f.gsa.gov) is doing to develop a brand new website for the FEC using opensource. This application is based on a [fork](https://github.com/18F/fec-style) of the shared 
components and styles used in FEC's application. I also make use of their API to provide suggestions
for the search box.

The visualization is based on the [Sigma.js](http://sigmajs.org/) javascript library.

## Data Load
I have some simple python scripts to process csv files downloaded from the FEC's site. I load
the data into a local instance of neo4j and then package the database file up and upload it to my Amazon EC2 
instance serving up data for the website.


## Set up

You can view the current styleguide on https://pages.18f.gov/fec-style/. It is
updated automatically on every successful push to the `master` branch.


### View the style guide

Clone the repo to your machine and open `styleguide/index.html`. Voila.


### Install dependencies

    $ npm install

Eventually we'll have a sweet build process for this all. In the mean time, we're using node-sass and kss-node to compile the Sass and generate the styleguide.

Watch the sass, build css and styleguide:

    $ npm run watch

Generate the CSS:

    $ npm run build-sass

Generate the JS:

    $ npm run build-js

Run unit tests:

    $ npm test

Watching the Sass:

    $ npm run watch-sass

Note: in order for css changes to be visible on the styleguide, you need to run `npm run copy-css`, which will copy it to the styleguide directory.

Generate the styleguide once:

    $ npm run build

And then we're using a custom template for the styleguide, which lives in
`fec-template/`. To make style changes to the template, you need to edit
`kss.less` and then run:

    $ npm run build-styleguide

Host the styleguide on a local server:

    $ npm install http-server
    $ http-server

To upload screenshots to [percy.io](https://percy.io):

    $ gem install percy
    $ npm run percy

### Use KSS
We use the KSS standard for documenting our Sass. This is both readable to humans and can be used to automatically generate styleguides. Here's an example:

```
// Buttons
// A button suitable for giving stars to someone.
//
// Markup:
// <button>Button</button>
// <button class="primary">Primary Button</button>
//
// :hover             - Subtle hover highlight.
// .primary           - The primary action button
// .disabled          - Dims the button to indicate it cannot be used.
//
// Styleguide 2.1.3.
//
```

### Versioning
We use [Semantic Versioning](http://semver.org/):

> Given a version number MAJOR.MINOR.PATCH, increment the:
>
> MAJOR version when you make incompatible API changes,
> MINOR version when you add functionality in a backwards-compatible manner, and
> PATCH version when you make backwards-compatible bug fixes.
> Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format.

When changes in master are ready to be released, follow these steps to update the package version and publish to npm:

    npm version <major | minor | patch>
    git push
    git push --tags
    npm publish

Use `npm version minor` or `npm version major` for minor and major updates respectively, and `npm version patch` for small updates that only add small bits of functionality to existing features. For details on npm versioning, see `npm version --help`.

Downstream applications should pin versions as appropriate. For example, to get bug fixes but not new features, pin to the minor version:

    {
        "dependencies": {
            "fec-style": "~1.0"
        }
    }
