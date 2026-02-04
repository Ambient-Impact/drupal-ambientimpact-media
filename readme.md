This Drupal module contains various components and enhancements to Drupal core's
media entities and files.

**Warning**: while this is generally production-ready, it's not guaranteed to
maintain a stable API and may occasionally contain bugs, being a
work-in-progress. Stable releases may be provided at a later date.

----

# Requirements

* [Drupal 10.3 or 11.0](https://www.drupal.org/download)

* PHP 8.1

* [Composer](https://getcomposer.org/)

## Drupal dependencies

Before attempting to install this, you must add the Composer repositories as
described in the installation instructions for these dependencies:

* The [`ambientimpact_core`](https://github.com/Ambient-Impact/drupal-ambientimpact-core), [`ambientimpact_icon`](https://github.com/Ambient-Impact/drupal-ambientimpact-icon), and [`ambientimpact_ux`](https://github.com/Ambient-Impact/drupal-ambientimpact-ux) modules.

## Front-end dependencies

To build front-end assets for this project, [Node.js](https://nodejs.org/) and
[Yarn](https://yarnpkg.com/) are required.

----

# Installation

## Composer

### Set up

Ensure that you have your Drupal installation set up with the correct Composer
installer types such as those provided by [the `drupal/recommended-project`
template](https://www.drupal.org/docs/develop/using-composer/starting-a-site-using-drupal-composer-project-templates#s-drupalrecommended-project).
If you're starting from scratch, simply requiring that template and following
[the Drupal.org Composer
documentation](https://www.drupal.org/docs/develop/using-composer/starting-a-site-using-drupal-composer-project-templates)
should get you up and running.

### Repository

In your root `composer.json`, add the following to the `"repositories"` section:

```json
"drupal/ambientimpact_media": {
  "type": "vcs",
  "url": "https://github.com/Ambient-Impact/drupal-ambientimpact-media.git"
}
```

### Patching

This module provides [one or more patches](#patches). These can be applied automatically by the the [`cweagans/composer-patches`](https://github.com/cweagans/composer-patches) Composer plug-in. If you're not already using it in your project, you need to install it:

```shell
composer require 'cweagans/composer-patches:^1.7 || ^2.0'
```

If you're using the 1.x version of the plug-in, you'll also need to run:

```shell
composer config extra.enable-patching true
composer config --json --merge extra.patchLevel '{"drupal/core": "-p2"}'
```

Note that you should remove these once you upgrade to `cweagans/composer-patches:^2.0` as 2.0 no longer uses that configuration.

### Installing

Once you've completed all of the above, run `composer require
"drupal/ambientimpact_media:^5.0@dev"` in the root of your project to have
Composer install this and its required dependencies for you.

## Front-end assets

To build front-end assets for this project, you'll need to install
[Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/).

This package makes use of [Yarn
Workspaces](https://yarnpkg.com/features/workspaces) and references other local
workspace dependencies. In the `package.json` in the root of your Drupal
project, you'll need to add the following:

```json
"workspaces": [
  "<web directory>/modules/custom/*"
],
```

where `<web directory>` is your public Drupal directory name, `web` by default.
Once those are defined, add the following to the `"dependencies"` section of
your top-level `package.json`:

```json
"drupal-ambientimpact-media": "workspace:^5"
```

Then run `yarn install` and let Yarn do the rest.

### Optional: install yarn.BUILD

While not required, [yarn.BUILD](https://yarn.build/) is recommended to make
building all of the front-end assets even easier.

----

# Building front-end assets

This uses [Webpack](https://webpack.js.org/) and [Symfony Webpack
Encore](https://symfony.com/doc/current/frontend.html) to automate most of the
build process. These will have been installed for you if you followed the Yarn
installation instructions above.

If you have [yarn.BUILD](https://yarn.build/) installed, you can run:

```
yarn build
```

from the root of your Drupal site. If you want to build just this package, run:

```
yarn workspace drupal-ambientimpact-media run build
```

# Patches

The following patches are supplied (see [Patching](#patching) above):

* Drupal core:

  * [Add a hook to modify oEmbed resource data [#3042423]](https://www.drupal.org/project/drupal/issues/3042423#comment-15098326) (requires Drupal core 10.3 or newer)

If you need the above patch, we don't apply it automatically because it tends to
break every minor core version, so you'll have to opt in by merging the appropriate minor version below into your root `composer.json` or patches file.

For Drupal core 10.3.x:

```json
  "extra": {
    "patches": {
      "drupal/core": {
        "Add a hook to modify oEmbed resource data (core 10.3.x) [#3042423]: https://www.drupal.org/project/drupal/issues/3042423#comment-15772049": "https://raw.githubusercontent.com/Ambient-Impact/drupal-ambientimpact-media/0d2fd03030b6659814fad2dfd0383d0654f5a6c9/patches/drupal/core/3042423-hook-to-modify-oembed-resource-data-10.3.x.patch"
      }
    }
  }
```

For Drupal core 10.4.x or 11.0.x (not 11.1.x):

```json
  "extra": {
    "patches": {
      "drupal/core": {
        "Add a hook to modify oEmbed resource data (core 10.4.x) [#3042423]: https://www.drupal.org/project/drupal/issues/3042423#comment-15944908": "https://raw.githubusercontent.com/Ambient-Impact/drupal-ambientimpact-media/0d2fd03030b6659814fad2dfd0383d0654f5a6c9/patches/drupal/core/3042423-hook-to-modify-oembed-resource-data-10.4.x.patch"
      }
    }
  }
```

----

# Major breaking changes

The following major version bumps indicate breaking changes:

* 1.x:

  * Has been [`git subtree split`](https://shantanoo-desai.github.io/posts/technology/git_subtree/) from [`Ambient-Impact/drupal-modules`](https://github.com/Ambient-Impact/drupal-modules/tree/8.x) into a standalone package; version has been reset to 1.x.

  * Requires Drupal 9.5.

  * Increases minimum version of [Hook Event Dispatcher](https://www.drupal.org/project/hook_event_dispatcher) to 3.1, removes deprecated code, and adds support for 4.0 which supports Drupal 10.

* 2.x:

  * Requires [Drupal 10.0](https://www.drupal.org/project/drupal/releases/10.0.0); does not support Drupal 10.1.

  * Requires [Hook Event Dispatcher](https://www.drupal.org/project/hook_event_dispatcher) 4.0 which supports Drupal 10.

  * Increases minimum version of `guzzlehttp/guzzle` to 7.4.5 as older versions aren't supported by Drupal 10.

  * Requires [`drupal/ambientimpact_core` 2.x](https://github.com/Ambient-Impact/drupal-ambientimpact-core/tree/2.x) for Drupal 10 support.

* 3.x:

  * Requires Drupal 10.1 due to formatter changes.

  * Removes the following patches which are now in 10.1:

    * [Order image mappings by breakpoint ID and numeric multiplier [#3267870]](https://www.drupal.org/project/drupal/issues/3267870)

    * [Apply width and height attributes to responsive image tag [#3192234]](https://www.drupal.org/project/drupal/issues/3192234#comment-14510278)

* 4.x:

  * Requires Drupal 10.2 due to [oEmbed hook patch](https://www.drupal.org/project/drupal/issues/3042423); explicitly does not support Drupal 10.3 to prevent future breakage due to patch.

  * The oEmbed resource data alter event has been removed; use [Hux](https://www.drupal.org/project/hux) to implement the hook with dependency injection instead; removed:

    * `\Drupal\ambientimpact_media\AmbientImpactMediaEventInterface`

    * `\Drupal\ambientimpact_media\Event\Media\OEmbedResourceDataAlterEvent`

  * Existing oEmbed alter event subscribers have been converted to Hux hook classes and renamed to be more in line with PHP, Drupal, and Symfony naming conventions.

  * Migrate configuration and plug-ins have been removed as they haven't been tested in a long while and are unmaintained; if you need to migrate file entities from Drupal 7 to media entities in modern Drupal, these can still be found in the 3.x and earlier branches:

    * `config/optional/migrate_plus.migration.d7_file_entity_vimeo.yml`

    * `config/optional/migrate_plus.migration.d7_file_entity_youtube.yml`

    * `\Drupal\ambientimpact_media\Plugin\migrate\process\Vimeo`

    * `\Drupal\ambientimpact_media\Plugin\migrate\process\YouTube`

    * `\Drupal\ambientimpact_media\Plugin\migrate\source\FileEntity`

* 5.x:

  * Requires Drupal 10.3 or 11.0.
