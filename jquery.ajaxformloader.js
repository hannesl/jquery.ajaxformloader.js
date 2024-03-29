(function($) {

  /**
   * An ajax form loader plugin.
   * 
   * Usage: $("#container").ajaxFormLoaderForm(options);
   * 
   * #container needs to contain a link to the target form page. This way, users
   * without JS will still be able to use the form. The link has no be the first
   * link in #container. The target form page should respond with a result 
   * message containing a specific class for when the submission was successful 
   * (see Options).
   * 
   * Options:
   *  * className - Base name for classes.
   *      Default: 'ajax-form'
   *  * formSelector: Selector for finding the form element.
   *      Default: 'form'
   *  * messageSelector: Selector for finding result messages.
   *      Default: '#messages'
   *  * successfulSelector: Selector for finding successful result messages.
   *      Default: '.status'
   */
  $.fn.ajaxFormLoader = function(options) {
    
    // Merge passed options with defaults.
    var opts = $.extend({}, $.fn.ajaxFormLoader.defaults, options);

    var $ajaxWrapper = this;
    
    var $toggle = $ajaxWrapper.find("a:first");
    $toggle.addClass(opts.className + "-form-toggle");
    
    // Set up form div.
    var ajaxDiv = document.createElement("div");
    ajaxDiv.setAttribute("class", opts.className + "-form");
    ajaxDiv.setAttribute("style", "display: none");
    var messagesDiv = document.createElement("div");
    messagesDiv.setAttribute("class", "form-messages");
    messagesDiv.setAttribute("style", "display: none");
    ajaxDiv.appendChild(messagesDiv);
    $ajaxWrapper.append(ajaxDiv);

    var $formDiv;
    
    // Click behavior for the toggle link.
    $($toggle).click(function(e) {
      e.preventDefault();
      
      if ($formDiv == null) {
        $(ajaxDiv).addClass("loading");
      }
      
      $(ajaxDiv).toggle(100, function() {
        if ($(this).is(":visible")) {
          $ajaxWrapper.addClass("expanded");
          if ($formDiv == null) {
            // Load the form.
            $formDiv = $(document.createElement("div"));
            $formDiv.attr("class", "form-wrapper").css("display", "none");
            $formDiv.load($toggle.attr("href") + ' ' + opts.formSelector, function() {
              // Trigger the load-complete event.
              $ajaxWrapper.trigger("ajaxformloader-load-complete");
              $(ajaxDiv).removeClass("loading");
              $(ajaxDiv).addClass("form-loaded");
              
              $formDiv.find("form").submit(function() {
                submitForm($formDiv);
                return false;
              });
              $formDiv.appendTo($(ajaxDiv)).slideDown(50);
            });
          }
        }
        else {
          $ajaxWrapper.removeClass("expanded");
          // Reset the form.
          if (!$(ajaxDiv).hasClass("form-loaded") && $formDiv instanceof jQuery) {
            $formDiv.empty();
            $(messagesDiv).empty();
            $formDiv = null;
          }
        }
      });
    });

    // Form submission handler.
    var submitForm = function($formWrapper) {
      $(ajaxDiv).addClass("loading");
      
      // Remove old messages.
      $(messagesDiv).slideUp(50, function() {
        $(this).empty();
      });
      
      // Collect form values.
      var vars = {};
      $.each($formWrapper.find("form").serializeArray(), function(i, field) {
        vars[field.name] = field.value;
      });
      $formWrapper.find("input, textarea").attr("disabled", "disabled");
      
      // Post the form.
      var url = $formWrapper.find("form").attr('action');
      $.post( url, vars, function( data ) {
        // Look for the result message.
        var content = $(data).find(opts.messageSelector);
        if (content.find(opts.successfulSelector).length > 0) {
          // Remove the form.
          $formWrapper.slideUp(50, function() {
            $(this).empty();
          });
          $(ajaxDiv).removeClass("form-loaded");
          // Trigger the submit-success event.
          $ajaxWrapper.trigger("ajaxformloader-submit-success");
        }
        else {
          $formWrapper.find("input, textarea").attr("disabled", "");
          // Trigger the submit-fail event.
          $ajaxWrapper.trigger("ajaxformloader-submit-fail");
        }
        $(messagesDiv).html(content.html()).slideDown(50);
        $(ajaxDiv).removeClass("loading");
      });
    }
  };
 
  // Default options.
  $.fn.ajaxFormLoader.defaults = {
    className:   'ajax-form',
    formSelector: 'form',
    messageSelector: '#messages',
    successfulSelector: '.status'
  };

})(jQuery);
