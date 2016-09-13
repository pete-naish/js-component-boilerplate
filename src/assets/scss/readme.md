# Component-based CSS architecture

## About this project

This document introduces a comprehensive style guide and CSS architecture that front-end devs should use in all projects going forwards.

This is intended to be easy to modify, scale, and adapt.

The project itself functions as a working example that can be downloaded and used to kick off new projects. It contains example sass partials and useful helpers and mixins to get you started.

### Key benefits

*   Allows for mobile-first, component-based development.
*   Easy to maintain and scale through consistent structure and simple, modular CSS partials.
*   Uses inline media queries rather than separate stylesheets for each breakpoint.
*   Uses the CSS cascade to full effect via the logical import order of CSS partials.

## Contents

1.  [Key concepts](#key-concepts)
    1.  [Modular, component-based development](#component-based-development)
    2.  [Mobile-first](#mobile-first)
    3.  [Nested media queries](#nested-media-queries)
2.  [CSS style guide](#css-style-guide)
    1.  [Specificity](#specificity)
    2.  [Class naming convention (BEM)](#class-naming-convention)
    3.  [Writing rules](#writing-rules)
3.  [CSS architecture](#css-architecture)
    1.  [CSS folder structure](#css-folder-structure)
    2.  [CSS source order](#css-source-order)

## Key concepts

### Modular, component-based development

Instead of thinking about a website as a set of pages and templates, try to break designs into separate components. These components should be re-usable blocks that can be moved, repositioned, modified, and re-combined in order to build pages. Components may be part of bigger components. Typical components might be the header, footer, main navigation, carousel, etc.

Each component has its own Sass partial that contains all of the relevant styling for that component only.

### Mobile-first

Mobile websites are usually more simple, and have fewer components than their desktop counterparts. When writing CSS, it makes sense to cover the simple (read: mobile) styles first, then add complexity as new breakpoints are required. This way, you are taking advantage of the CSS cascade, and in many cases only adding styles, rather than defining them for desktop and undoing them for mobile.

### Nested media queries

Back in the day, you might have written all of your main 'desktop' CSS in one long file. There probably wouldn't be much of an order to the styles, and over time, new stuff just gets added to the bottom. There would most likely be a load of redundant code and `!important` declarations, and it just becomes a nightmare to maintain.

Responsive CSS would add to this nightmare. You might create a new Sass partial for each breakpoint, and call it something like `_min569-max840.scss`. This sucks because you'd have to rename the file, fix your `@import` statement, and curse yourself every time the breakpoint values change.

Nesting in Sass is a hotly-debated topic, but it can really improve the responsive nightmare illustrated above. When paired with component-based development, it becomes a dream.

Components can be entirely self contained within their Sass partial. New breakpoints can be nested, as and when they are needed, which keeps styles in order, and makes them easy to find, read,git and maintain.

Having said that, I'd recommend avoiding nesting where possible, with the exception of the following:

*   Pseudo states (e.g. `&:hover`, `&:active`)
*   Pseudo elements (e.g. `&:before`, `&:after`)
*   Sibling combinators (e.g. `+`, `~`)
*   Media queries (e.g. `@media screen and (max-width: 768px)`)

It's best to use common sense and think about how your selectors will look once compiled.

## CSS style guide

### Specificity

Firstly, a note on specificity. Specificity applies to your CSS selectors, and determines which CSS rules are applied to an element. Selectors with higher specificity override selectors with lower specificity. Using overly specific selectors can cause issues that are typically solved by sticking `!important` at the end of the rule. This is **bad**.

`!important` has its place, as explained in the [trumps](#) section of this document, but it usually causes further problems with specificity, and can be a sign that the CSS is badly written.

Specificity also increases when multiple selectors are used to target an element, e.g. `.nav-primary ul li a {}`.

For this reason, you should **only use classes in your HTML and CSS**, and **avoid ids**. Of course, you can use ids for anchors and form elements that require them, just don't use ids for styling hooks. To further reduce specificity issues, you should **apply classes to every element within a component**, as described in the [Class naming convention](#) section this document. Additionally, **do not qualify your class selectors with an element**, i.e. `div.nav-primary`. This increases selector specificity, and makes styles less portable. Using a class on its own allows you to add use it with different elements and the styles will still apply.

Read more about specificity on [Smashing Magazine](http://www.smashingmagazine.com/2007/07/27/css-specificity-things-you-should-know/) and [CSS Tricks](http://css-tricks.com/strategies-keeping-css-specificity-low/).

### Class naming convention (BEM)

A key part of component-based development comes from the class naming convention.

Each component (header, footer, navigation etc) is a **block**, which contains **elements** (list items, links, etc). Every **element** within a **block** should have a class that ties it to the **block**. Classes should be lowercase (no camelCase), and use the [BEM](http://bem.info/) naming convention, e.g.:

```
.block__element--modifier
```

Double dashes `--` and underscores `__` are used to give visual separation, and allows you to use single dashes `-` or underscores `_` when naming a block, element, or modifier, e.g.:

```
.social-links--small
```

#### Block

`.block` is the name given to the component. It may be hyphenated, e.g. `.nav-primary`.

#### Element

`__element` represents a descendent of `.block` that helps form `.block` as a whole, e.g.:

```html
<nav class="nav"> <!--this is the block-->
    <ul class="nav__menu"> <!--this is an element within the 'nav' block-->
        <li class="nav__item"> <!--this is another element within the 'nav' block-->
            <a href="#" class="nav__link">Float me left</a> <!--this is another element within the 'nav' block-->
        </li>
    </ul>
</nav>
``` 

Note that `__element` identifiers should not be chained. i.e. don't write `nav__menu__item__link` - they should only be one level deep.

#### Modifier

`--modifier` can be applied to a `.block` or an `__element`, and represents a different version or state of the `.block` or `__element`, e.g.:

```html
<nav class="nav nav--secondary"> <!--this is a variation of the 'nav' block shown above-->
    <ul class="nav__menu">
        <li class="nav__item">
            <a href="#" class="nav__link">Float me left</a>
        </li>
        <li class="nav__item">
            <a href="#" class="nav__link">Float me left</a>
        </li>
        <li class="nav__item nav__item--alt"> <!--this is a variation of 'nav__item'-->
            <a href="#" class="nav__link">Float me right</a>
        </li>
    </ul>
</nav>
```

When a `--modifier` is used, the original `.block` or `__element` class _and_ the `--modifier` class should be added in the markup. This makes it clear how variations of components interact with each other. In your CSS, simply do this:

```scss
.nav {
    // styles that apply to both .nav and .nav--primary
}

.nav--primary {
    // styles that only apply to .nav--primary
}
```

Applying classes to every element may seem unnecessary and verbose, but ensures that any element can be targeted in your CSS with simple, low-specificity selectors, i.e. in most cases, a single class. This helps to keep nesting to a minimum, and styles remain easy to intentionally override.

For example:

```scss
.nav-primary {
    // styles
}

.nav-primary__menu {
    // styles   
}

.nav-primary__item {
    // styles
}
``` 

There may be times when you cannot apply classes to every element within a block, such as wysiwyg content from a CMS. In this instance, the following can be used:

```scss
.wysiwyg { // or .rte, as it's easier to type
    > h1 {
        // styles
    }
    > p {
        // styles
    }
    > img {
        // styles
    }
}
``` 

The direct child selector `>` is used here to tightly scope styles.

#### JavaScript hooks and states

Avoid using styling classes as JavaScript hooks, and instead add JavaScript-specific classes to elements, using the `js-` prefix, e.g.:

```html
<button class="button--positive js-tree-toggle">Toggle</button>
```

If you're using JavaScript to add classes to elements to reflect states, use classes prefixed with `is-` or `has-`, e.g.:

```html
<button class="button--positive js-tree-toggle is-active">Toggle</button>
// or
<form class="form-search js-validate has-errors">...</form>
```

#### Naming things

The class name given to a `.block` or `__element` should be as general as possible, but it should still make sense to a developer. You should be able to tell which component you are editing, and what that component does, just by looking at the HTML or CSS (and not just the page in-browser). Keeping the name general means that a component can be placed anywhere on a site, and its name is not affected by the context.

Names should go from general to specific, usually identifying the type of component, and then a more specific identifier, e.g.:

`home-carousel` is a bad class name, because if the same slider is used somewhere other than the home page, the name no longer makes sense.

`carousel-primary` is better, as it makes scanning for a particular type of component faster. You can then use secondary, tertiary, alpha, beta, etc to name similar components.

[Read this great article about the benefits of BEM](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/).

### Writing rules

#### General

*   Sass partials should be prefixed with an underscore.
*   Component partials should match the `.block` name that they reference, e.g `_nav.scss`.
*   Write CSS mobile-first when appropriate
*   Do not use ids (unless you're overriding something a CMS has generated and you can't add a class to the element).

#### Formatting

*   One selector per line
*   Put a single space before the opening brace `{`
*   Put a single space after the colon `:`
*   Use semi-colon `;` after every declaration
*   No space before semi-colon `;`
*   Put the closing brace `}` on a new line, and add an empty line after it, except when nesting selectors

#### Style

*   Use (short) hex color codes `#000` or rgba
*   Use shorthand notation where possible, e.g. `border: 1px solid #000;`
*   Use double forward-slash `//` for comments
*   Use `'single quotes'` instead of `"double quotes"`
*   Use `:before` and `:after` for pseudo elements
*   Put a single space after commas, e.g. `color: rgba(0, 0, 0, .5);`
*   Omit the 0 when entering decimals between 0 and 1, e.g. `color: rgba(0, 0, 0, .5);`
*   Omit units after 0 values, e.g. `font-size: 0;`
*   Omit units from `line-height`, e.g. `line-height: 1.4`
*   Avoid qualifying class names with an element selector e.g. `div.primary`. This increases selector specificity, and makes styles less portable. Using a class on its own allows you to add use it with different elements and the styles will still apply
*   Do not use quotes in URLs, e.g. `background-image: url(image.png);`
*   Use 4 spaces for indentation

#### Font sizing

*   Set body font size to the standard paragraph size (from the PSD), not `62.5%`
*   Use the Sass `rem-calc` function to set `px` font sizes that are converted to `rem` once compiled

#### Units

*   Use `box-sizing: border-box` (globally, if possible)
*   Use `rem` for font sizes
*   Use `%` for widths
*   Use `px` for padding and margins

#### Magic numbers

*   Use `bottom: 100%` or `top: 100%` etc. instead of magic numbers (e.g. `top: 177px`)

#### Grunt

*   Use [`grunt-autoprefixer`](https://github.com/nDmitry/grunt-autoprefixer) instead of a Sass mixin to handle browser prefixes

#### Nesting

Only nest the following, if you can help it:

*   Pseudo states (e.g. `&:hover`, `&:active`)
*   Pseudo elements (e.g. `&:before`, `&:after`)
*   Sibling combinators (e.g. `+`, `~`)
*   Media queries (e.g. `@media screen and (max-width: 768px)`)

*   Nest media queries within the parent (or top level) selector, as shown in the [full example](#full-example)

#### Declaration order

1.  Extends
2.  Includes (mixins)
3.  Standard rules
4.  Pseudo states
5.  Pseudo elements
6.  Descendents
7.  Media queries (nested)

#### Full example

```scss
.example {
    @extend %heading;
    @include clearfix();
    border: 1px solid #000;
    color: rgba(0, 0, 0, .5);
    background: url(/assets/img/placeholder--example.jpg) no-repeat center;
    padding: 0; // remove padding
    font-size: rem(20px);
    &:hover,
    &:active {
        color: #f00;
    }
    &:before {
        // styles
    }
    @media-query(desktop) {
        font-size: rem(22px);
        &:before {
            // styles
        }
    }
}

.example--special {
    border: 1px solid #f00;
}
``` 

## CSS architecture

### CSS folder structure

The folder structure for CSS is based on [Harry Roberts'](http://csswizardry.com/) CSS Architecture for Big Front Ends. I attended his workshop at the [Future of Web Design 2014](http://futureofwebdesign.com/london-2014/) conference, and it was outstanding.

<button class="button--positive js-tree-toggle">Toggle entire structure</button>

1.  <label class="folder__label" for="css">css / <span class="hint">< Click to expand and collapse</span></label> [ ] 
    1.  <label class="folder__label" for="sass">sass /</label> [ ] 
        1.  <label class="folder__label" for="settings">settings /</label> [ ] 
            1.  _all.scss <span class="hint">< Click files to view source</span>
            2.  _color.scss
            3.  _type.scss
            4.  _vars.scss
        2.  <label class="folder__label" for="tools">tools /</label> [ ] 
            1.  <label class="folder__label" for="helpers">helpers /</label> [ ] 
                1.  _clearfix.scss
                2.  _hide-text.scss
                3.  _image-replacement.scss
                4.  _image-retina.scss
            2.  <label class="folder__label" for="mixins">mixins /</label> [ ] 
                1.  _font-face.scss
                2.  _media-query-hi-dpi.scss
                3.  _media-query.scss
            3.  <label class="folder__label" for="functions">functions /</label> [ ] 
                1.  _em-calc.scss
                2.  _percentage.scss
                3.  _strip-units.scss
            4.  _all.scss
        3.  <label class="folder__label" for="generic">generic /</label> [ ] 
            1.  _all.scss
            2.  _normalize.scss
            3.  _reset.scss
        4.  <label class="folder__label" for="base">base /</label> [ ] 
            1.  _all.scss
            2.  _form-elements.scss
            3.  _headings.scss
            4.  _links.scss
            5.  _page.scss
        5.  <label class="folder__label" for="objects">objects /</label> [ ] 
            1.  _all.scss
            2.  _accordion.scss
            3.  _buttons.scss
        6.  <label class="folder__label" for="components">components /</label> [ ] 
            1.  _all.scss
            2.  _accordion--primary.scss
        7.  <label class="folder__label" for="trumps">trumps /</label> [ ] 
            1.  _all.scss
            2.  _helpers.scss
            3.  _print.scss
        8.  app.scss
    2.  [app.css](assets/css/app.css) <span class="hint">< Click files to view source</span>
    3.  app.min.css

### CSS source order

Click the folder names below to jump to more detailed descriptions of the contents, with examples.

1.  [`settings`](#folder-settings) - Variables, feature switches and other project specific settings. These are defined first and will be picked up and used by the framework later on.
2.  [`tools`](#folder-tools) - Mixins and functions to make tasks easier. These appear early on so that they can be utilised in the main body of the codebase.
3.  `generic` - Resets, global box-sizing. These styles are really far reaching; they underpin every element we place on the page.
4.  `base` - Base elements, unclassed h1, ol, etc. These are semantic HTML elements that require some base styling for when they exist outside of a component context (e.g. a regular, bulleted list in some body copy).
5.  `objects` - Design patterns, objects, abstractions, and constructs.
6.  `components` - Styled components and modules. These build on top of semantic HTML elements and are referred to mainly through class selectors. Partial names should be named after the class that they describe, e.g. _nav--primary.scss. Partials should always start with an underscore.
7.  `trumps` - Style trumps, helper classes, and overrides. These need to override any other styles, and thus come last. It is common for these styles to be `!important`

The CSS structure and import order is important, and goes from general (affecting many elements), to specific (affecting just one element in one circumstance, for example). The order that styles are imported should match the order that the browser renders them. This way, you're typically adding styles to an element instead of taking them away, and the browser should render the page faster.

Each direct subfolder within the `sass` directory contains a partial called `_all.scss`, which contains `@import` statements for each partial within the same folder, e.g.:

```scss
// css/sass/settings/_all.scss
@import 'vars',
        'color',
        'type';
``` 

Because it has subfolders, the `_all.scss` partial for `tools` is a little different:

```scss
// Custom Functions
@import 'functions/em-calc',
        'functions/percentage',
        'functions/grid-flex',
        'functions/strip-units',

        // CSS3
        'css3/font-face',
        'css3/media-query-hidpi',
        'css3/media-query',

        //Addons
        'addons/clearfix',
        'addons/hide-text',
        'addons/image-replacement',
        'addons/image-retina';
``` 

I won't list all of the different files here, so have a look through the [folder structure](#css-folder-structure) and click on files you're interested in.

#### 1\. settings

`settings` contains variables that are used throughout the project, such as color, type, font sizes, etc.

It's best to use separate partials for logical groups of variables.

Variables should follow the BEM naming convention outlined [previously](#class-naming-convention).

When defining color variables, it can be useful to avoid using specific color names, as these may change, and instead assign generic identifiers, e.g.:

```scss
$color--brand-red: #ea1e06;
$base--text-color: #333;
$base--brand-color: $color--brand-red;
```

#### 2\. tools

`tools` contains mixins and functions. The tools included in this project are limited to ones that should be useful in almost every project. You are free to add or remove any you like. Be aware, however, that some mixins and functions may rely on each other to work.

!!!!!!!!!!!!!!!!!!!!!!`_prefix` is included here because other mixins rely on it. You should avoid using this in your CSS, and use [`grunt-autoprefixer`](https://github.com/nDmitry/grunt-autoprefixer) to handle browser prefixes instead.!!!!!!!!!!!!!!!!!!!!!!
