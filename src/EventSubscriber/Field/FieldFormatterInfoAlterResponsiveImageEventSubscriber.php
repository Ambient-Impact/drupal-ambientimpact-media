<?php

namespace Drupal\ambientimpact_media\EventSubscriber\Field;

use Drupal\field_event_dispatcher\Event\Field\FieldFormatterInfoAlterEvent;
use Drupal\field_event_dispatcher\FieldHookEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Responsive image formatter hook_field_formatter_info_alter() event subscriber.
 */
class FieldFormatterInfoAlterResponsiveImageEventSubscriber implements EventSubscriberInterface {

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    return [
      FieldHookEvents::FIELD_FORMATTER_INFO_ALTER =>
        'fieldFormatterInfoAlter',
    ];
  }

  /**
   * Replace the core 'responsive_image' field formatter with our own.
   *
   * Note that this will only replace the formatter if the existing class is the
   * core responsive image formatter class to avoid breaking other modules.
   *
   * @param \Drupal\media_event_dispatcher\Event\Field\FieldFormatterInfoAlterEvent $event
   *   The event object.
   *
   * @see \Drupal\ambientimpact_media\Plugin\Field\FieldFormatter\ResponsiveImageFormatter
   *   Our 'responsive_image' field formatter override class.
   */
  public function fieldFormatterInfoAlter(FieldFormatterInfoAlterEvent $event) {

    /** @var array */
    $info = &$event->getInfo();

    if (
      isset($info['responsive_image']) &&
      $info['responsive_image']['class'] ===
        'Drupal\responsive_image\Plugin\Field\FieldFormatter\ResponsiveImageFormatter'
    ) {

      $info['responsive_image']['class'] =
        'Drupal\ambientimpact_media\Plugin\Field\FieldFormatter\ResponsiveImageFormatter';

      $info['responsive_image']['provider'] = 'ambientimpact_media';

    }
  }

}
