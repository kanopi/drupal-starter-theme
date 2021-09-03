<?php

/**
 * @file
 * Functions to support theming in the Blus Skies theme.
 */

/**
 * Implements hook_page_attachments_alter().
 *
 * Removes Drupal core's default meta tags.
 *
 * @todo Workaround for https://www.drupal.org/node/2735195.
 */
function drupal_starter_theme_page_attachments_alter(&$page) {
  // List the meta tags to remove them.
  $meta_tags_to_remove = [
    'system_meta_content_type',
    'system_meta_generator',
    'MobileOptimized',
    'HandheldFriendly',
    'viewport',
    'cleartype',
  ];
  // Unset loop.
  foreach ($page['#attached']['html_head'] as $index => $parts) {
    if (in_array($parts[1], $meta_tags_to_remove)) {
      unset($page['#attached']['html_head'][$index]);
    }
  }
}
