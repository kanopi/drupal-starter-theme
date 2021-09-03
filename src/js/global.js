/**
 * Misc JS functions.
 * @file
 */
(function ($, Drupal, drupalSettings) {
    /*
    * A11Y improvements.
    */
    Drupal.behaviors.drupal_starter_themeA11y = {
      attach: function (context, settings) {
      // Detect the "I am a keyboard user" key.
      // Check if the user is using keyboard navigation and if so, add a class.
      function handleFirstTab(e) {
        if (e.keyCode === 9) {
          document.body.classList.add("user-is-tabbing");
          window.removeEventListener("keydown", handleFirstTab);
        }
      }

      window.addEventListener("keydown", handleFirstTab);
    },
  };

  /*
  * Forms.
  */
  Drupal.behaviors.drupal_starter_themeForm = {
    attach: function (context, settings) {
      // Variables for select label and select.
      const select_item = document.querySelectorAll('.js-form-type-select');
      const labelExists = document.getElementsByName('.js-form-type-select label');

      if (labelExists) {
        select_item.forEach(element => element.classList.add('has-label'));
      }
    },
  };

})(jQuery, Drupal, drupalSettings);
