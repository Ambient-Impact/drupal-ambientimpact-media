// -----------------------------------------------------------------------------
//   Ambient.Impact - Media - PhotoSwipe events component
// -----------------------------------------------------------------------------

// The following PhotoSwipe events are triggered on the viewer element as a
// convenience:
//
// * initialZoomIn      => PhotoSwipeInitialZoomIn
// * initialZoomInEnd   => PhotoSwipeInitialZoomInEnd
// * initialZoomOut     => PhotoSwipeInitialZoomOut
// * initialZoomOutEnd  => PhotoSwipeInitialZoomOutEnd
// * beforeChange       => PhotoSwipeBeforeChange
// * afterChange        => PhotoSwipeAfterChange
//
// @see https://github.com/dimsemenov/PhotoSwipe/blob/v4.1.3/website/documentation/api.md#events
//
// This provides some additional events that the main PhotoSwipe component or
// PhotoSwipe library itself do not provide. These are triggered on the viewer
// element:
//
// * PhotoSwipeZoomIn
// * PhotoSwipeZoomOut

AmbientImpact.on(['photoswipe'], function(aiPhotoSwipe) {
AmbientImpact.addComponent(
  'photoswipe.event',
function(aiPhotoSwipeEvent, $) {
  'use strict';

  /**
   * The PhotoSwipe viewer element, wrapped in a jQuery collection.
   *
   * @type {jQuery}
   */
  const $viewer = aiPhotoSwipe.getViewer();

  var viewerClass   = $.PhotoSwipe.baseClass,
    transposeEvents = {
      initialZoomIn:    'PhotoSwipeInitialZoomIn',
      initialZoomInEnd: 'PhotoSwipeInitialZoomInEnd',
      initialZoomOut:   'PhotoSwipeInitialZoomOut',
      // 'initialZoomOutEnd' doesn't want to fire as of 4.0.5, so we're
      // binding to 'destroy', which fires right after that is supposed
      // to, and actually does fire. ¯\_(ツ)_/¯
      destroy:      'PhotoSwipeInitialZoomOutEnd',
      beforeChange:   'PhotoSwipeBeforeChange',
      afterChange:    'PhotoSwipeAfterChange'
    };

  // We bind to the before open event to ensure we can reliably catch the
  // initialZoomIn event.
  $viewer.on('PhotoSwipeBeforeOpen.aiPhotoSwipeEvent', function(
    event, gallery, $gallery, gallerySettings
  ) {
    // Fire events on the document when PhotoSwipe fires them on the
    // gallery.
    $.each(transposeEvents, function(PhotoSwipeEventName, docEventName) {
      gallery.listen(PhotoSwipeEventName, function() {
        $viewer.trigger(docEventName, [
          gallery,
          $gallery,
          gallerySettings
        ]);
      });
    });
  });

  // Don't do anything for the zoom event if MutationObserver isn't supported.
  if (!window.MutationObserver) {
    return;
  }

  // Don't do anything until the gallery has finished transitioning to the
  // open state, so as to not affect performance.
  $viewer.on('PhotoSwipeInitialZoomInEnd.aiPhotoSwipeEvent', function(
    event, gallery, $gallery, gallerySettings
  ) {
    var zoomedIn    = false,
      zoomedInClass = viewerClass + '--zoomed-in',
      observer;

    observer = new MutationObserver(function(mutationsList) {
      for (var i = mutationsList.length - 1; i >= 0; i--) {
        // Did we just zoom in?
        if (!zoomedIn && $viewer.hasClass(zoomedInClass)) {
          zoomedIn = true;

          $viewer.trigger('PhotoSwipeZoomIn', [
            gallery,
            $gallery,
            gallerySettings
          ]);

          return;
        }

        // Did we just zoom out?
        if (zoomedIn && !$viewer.hasClass(zoomedInClass)) {
          zoomedIn = false;

          $viewer.trigger('PhotoSwipeZoomOut', [
            gallery,
            $gallery,
            gallerySettings
          ]);

          return;
        }
      }
    });

    observer.observe(gallery.template, {
      attributes:     true,
      attributeFilter:  ['class']
    });

    gallery.listen('destroy', function() {
      observer.disconnect();
    });
  });
});
});
