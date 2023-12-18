<?php

declare(strict_types=1);

namespace Drupal\ambientimpact_media\Hooks;

use Drupal\hux\Attribute\Alter;
use Drupal\media\OEmbed\Provider;
use GuzzleHttp\Client as GuzzleClient;

/**
 * Media hook implementations.
 */
class Media {

  #[Alter('oembed_resource_url')]
  /**
   * Implements \hook_oembed_resource_url_alter().
   *
   * This informs Vimeo to return the thumbnail at the maximum size they
   * support, which is currently 1280 pixels wide.
   *
   * @param array $parsedUrl
   *   A parsed URL, as returned by
   *   \Drupal\Component\Utility\UrlHelper::parse().
   *
   * @param \Drupal\media\OEmbed\Provider $provider
   *   The oEmbed provider for the resource.
   */
  public function oembedUrlAlterVimeo(
    array &$parsedUrl, Provider $provider,
  ): void {

    if (
      \strpos($parsedUrl['path'], 'https://vimeo.com/') !== 0 ||
      isset($parsedUrl['query']['width'])
    ) {
      return;
    }

    $parsedUrl['query']['width'] = '1280';

  }

  #[Alter('oembed_resource_data')]
  /**
   * Implements \hook_oembed_resource_data_alter().
   *
   * This tries to fetch the highest resolution YouTube thumbnail by sending
   * requests via Guzzle for the various formats from highest to lowest, using
   * the first one that doesn't return a 404.
   *
   * @param array &$data
   *   The oEmbed data, parsed into an array.
   *
   * @param string $url
   *   The oEmbed URL that $data was retrieved from.
   *
   * @see https://www.drupal.org/project/drupal/issues/3042423
   *   This hook won't be invoked unless this Drupal core patch is applied.
   *
   * @see https://stackoverflow.com/a/20542029
   *   Thumbnail types taken from this Stack Overflow answer.
   */
  public function oembedDataAlterYoutube(array &$data, string $url): void {

    $thumbnailTypes = ['maxresdefault', 'sddefault'];

    if (
      $data['provider_name'] !== 'YouTube' ||
      \strpos($data['thumbnail_url'], 'hqdefault.jpg') === false
    ) {
      return;
    }

    /** @var \GuzzleHttp\ClientInterface A Guzzle instance to try and fetch thumbnail images with. */
    $client = new GuzzleClient();

    foreach ($thumbnailTypes as $thumbnailName) {

      // Replace 'hqdefault' in the thumbnail URL with the current type we're
      // testing for.
      /** @var string */
      $testThumbnailUrl = \str_replace(
        'hqdefault',
        $thumbnailName,
        $data['thumbnail_url'],
      );

      // We need to wrap the request in a try {} catch {} because Guzzle will
      // throw an exception on a 404.
      try {

        /** @var \Psr\Http\Message\ResponseInterface */
        $response = $client->request('GET', $testThumbnailUrl);

      // Got an exception? Skip to the next thumbnail size, assuming this
      // returned a 404 or ran into some other error.
      } catch (\Exception $exception) {
        continue;
      }

      // If we got anything other than a 200 status back, skip to the next size.
      if ($response->getStatusCode() !== 200) {
        continue;
      }

      // If this was a 200 response, update the thumbnail URL and dimensions
      // with the higher resolution and break out of the loop.

      /** @var array|false */
      $imageSizeData = \getimagesizefromstring(
        $response->getBody()->getContents(),
      );

      // Check that \getimagesizefromstring() was able to determine the image
      // size. Note the checks for zero, which can happen in some edge cases
      // if it was passed valid image data but it couldn't determine the
      // dimensions due to the image format.
      //
      // @see https://www.php.net/manual/en/function.getimagesize.php
      if (
        !\is_array($imageSizeData) ||
        empty($imageSizeData[0]) ||
        $imageSizeData[0] === 0 ||
        empty($imageSizeData[1]) ||
        $imageSizeData[1] === 0
      ) {
        continue;
      }

      $data['thumbnail_url']    = $testThumbnailUrl;
      $data['thumbnail_width']  = $imageSizeData[0];
      $data['thumbnail_height'] = $imageSizeData[1];

      break;

    }

  }

}
