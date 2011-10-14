# jquery.ajaxformloader.js

An ajax form loader plugin.

## Usage

  $("#container").ajaxFormLoaderForm(options);

#container needs to contain a link to the target form page. This way, users without JS will still be able to use the form. The link has no be the first link in #container. The target form page should respond with a result message containing a specific class for when the submission was successful (see Options).

## Options

 * className - Base name for classes. Default: 'ajax-form'
 * formSelector: Selector for finding the form element. Default: 'form'
 * messageSelector: Selector for finding result messages. Default: '#messages'
 * successfulSelector: Selector for finding successful result messages. Default: '.status'
