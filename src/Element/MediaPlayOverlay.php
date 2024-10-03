<?php

namespace Drupal\ambientimpact_media\Element;

use Drupal\Core\Render\Attribute\RenderElement;
use Drupal\Core\Render\Element\RenderElementBase;

/**
 * Provides a media play overlay render element.
 */
#[RenderElement('media_play_overlay')]
class MediaPlayOverlay extends RenderElementBase {

  /**
   * {@inheritdoc}
   */
  public function getInfo() {

    return [
      '#theme' => 'media_play_overlay',
    ];

  }

}
