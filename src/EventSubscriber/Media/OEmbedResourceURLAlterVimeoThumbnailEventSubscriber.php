<?php

declare(strict_types=1);

namespace Drupal\ambientimpact_media\EventSubscriber\Media;

use Drupal\media_event_dispatcher\Event\Media\OEmbedResourceUrlAlterEvent;
use Drupal\media_event_dispatcher\MediaHookEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Vimeo thumbnail oEmbed hook_oembed_resource_url_alter() event subscriber.
 */
class OEmbedResourceURLAlterVimeoThumbnailEventSubscriber implements EventSubscriberInterface {

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    return [
      MediaHookEvents::MEDIA_OEMBED_RESOURCE_DATA_ALTER =>
        'oEmbedResourceURLAlter',
    ];
  }

  /**
   * Get a high resolution thumbnail for Vimeo oEmbed resources.
   *
   * This informs Vimeo to return the thumbnail at the maximum size they
   * support, which is currently 1280 pixels wide.
   *
   * @param \Drupal\media_event_dispatcher\Event\Media\OEmbedResourceUrlAlterEvent $event
   *   The event object.
   */
  public function oEmbedResourceURLAlter(
    OEmbedResourceUrlAlterEvent $event
  ): void {

    /** @var array */
    $parsedURL = &$event->getParsedUrl();

    if (
      \strpos($parsedURL['path'], 'https://vimeo.com/') === 0 &&
      !isset($parsedURL['query']['width'])
    ) {
      $parsedURL['query']['width'] = '1280';
    }

  }

}
