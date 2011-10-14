# jquery.ajaxformloader.js

An ajax form loader plugin. It takes a link to a form page and turns it into a toggle for loading and embedding the form on the page. The form can then be submitted through ajax.

## Usage

  $("#container").ajaxFormLoaderForm(options);

\#container needs to contain a link to the target form page. This way, users without JS will still be able to use the form. The link has no be the first link in #container. The target form page should respond with a result message containing a specific class for when the submission was successful (see Options).

## Options

 * className - Base name for classes. Default: 'ajax-form'
 * formSelector: Selector for finding the form element. Default: 'form'
 * messageSelector: Selector for finding result messages. Default: '#messages'
 * successfulSelector: Selector for finding successful result messages. Default: '.status'
