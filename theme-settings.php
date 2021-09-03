<?php

/**
 * @file
 * Functions to support theming in the Blue Skies theme.
 */

use Drupal\Core\Form\FormStateInterface;

/**
 * Allow themes to alter the theme-specific settings form.
 */
function drupal_starter_theme_form_system_theme_settings_alter(&$form, FormStateInterface $form_state) {
  $form['theme']['custom'] = [
    '#type' => 'fieldset',
    '#title' => 'Custom Settings',
  ];

  // Custom setting for the new homepage.
  $form['theme']['custom']['browsersync'] = [
    '#type' => 'checkbox',
    '#disabled' => TRUE,
    '#title' => 'Use browsersync for local development',
    '#default_value' => theme_get_setting('browsersync', 'drupal_starter_theme'),
  ];
}
