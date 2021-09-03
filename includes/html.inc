<?php

/**
 * @file
 * Functions to support theming in the Blue Skies theme.
 */

/**
 * Implements hook_library_info_alter().
 *
 * Unsets Drupal core's CSS files.
 *
 * @todo Workaround for https://www.drupal.org/node/2642122.
 */
function drupal_starter_theme_library_info_alter(&$libraries, $extension) {
  if ($extension == 'system' && isset($libraries['base'])) {
    unset($libraries['base']['css']['component']['css/components/ajax-progress.module.css']);
    unset($libraries['base']['css']['component']['css/components/align.module.css']);
    unset($libraries['base']['css']['component']['css/components/autocomplete-loading.module.css']);
    unset($libraries['base']['css']['component']['css/components/fieldgroup.module.css']);
    unset($libraries['base']['css']['component']['css/components/container-inline.module.css']);
    unset($libraries['base']['css']['component']['css/components/clearfix.module.css']);
    unset($libraries['base']['css']['component']['css/components/details.module.css']);
    // unset($libraries['base']['css']['component']['css/components/hidden.module.css']);.
    unset($libraries['base']['css']['component']['css/components/item-list.module.css']);
    unset($libraries['base']['css']['component']['css/components/js.module.css']);
    unset($libraries['base']['css']['component']['css/components/nowrap.module.css']);
    unset($libraries['base']['css']['component']['css/components/position-container.module.css']);
    unset($libraries['base']['css']['component']['css/components/progress.module.css']);
    unset($libraries['base']['css']['component']['css/components/reset-appearance.module.css']);
    unset($libraries['base']['css']['component']['css/components/resize.module.css']);
    unset($libraries['base']['css']['component']['css/components/sticky-header.module.css']);
    unset($libraries['base']['css']['component']['css/components/system-status-counter.css']);
    unset($libraries['base']['css']['component']['css/components/system-status-report-counters.css']);
    unset($libraries['base']['css']['component']['css/components/system-status-report-general-info.css']);
    unset($libraries['base']['css']['component']['css/components/tabledrag.module.css']);
    unset($libraries['base']['css']['component']['css/components/tablesort.module.css']);
    unset($libraries['base']['css']['component']['css/components/tree-child.module.css']);
  }
}

/**
 * Implements hook_preprocess_HOOK() for HTML.
 */
function drupal_starter_theme_preprocess_html(&$vars) {
  // Define the route.
  $route = \Drupal::routeMatch()->getRouteName();

  // Determine the page status, if 404 or 403, add the utility class.
  $status = \Drupal::requestStack()->getCurrentRequest()->attributes->get('exception');
  if ($status && $status->getStatusCode() == 404 || $status && $status->getStatusCode() == 403) {
    $vars['attributes']['class'][] = 'page-utility';
  }

  // Define an array of pages that are user pages.
  $user_paths = [
    'user.login',
    'user.pass',
    'user.register',
  ];

  // If the route matches, add the utility class to the pages above.
  if (in_array($route, $user_paths)) {
    $vars['attributes']['class'][] = 'page-utility';
  }

  // Variable for browsersync.
  $browsersync_setting = theme_get_setting('browsersync');
  // Add gulp browsersync if it's set in local
  // settings and the local environment.
  if ($browsersync_setting === 1) {
    $host = \Drupal::request()->getHost();
    if ($host === 'drupal_starter_theme.docksal') {
      $vars['gulp_browsersync'] = TRUE;
    }
  }
}
