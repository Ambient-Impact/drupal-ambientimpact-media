// -----------------------------------------------------------------------------
//   Ambient.Impact - Media - PhotoSwipe immerse events component
// -----------------------------------------------------------------------------

// Triggers 'immerseEnter' and 'immerseExit' events on PhotoSwipe open and
// close, respectively.

AmbientImpact.on(['photoswipe', 'photoswipe.event'], function(
  aiPhotoSwipe,
  aiPhotoSwipeEvent,
) {
AmbientImpact.addComponent(
  'photoswipe.event.immerse',
function(aiPhotoSwipeEventImmerse, $) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  this.addBehaviour(
    'AmbientImpactPhotoSwipeEventImmerse',
    'ambientimpact-photoswipe-event-immerse',
    'body',
    function(context, settings) {

      aiPhotoSwipe.getViewer().on(
        `PhotoSwipeInitialZoomIn.${eventNamespace}`,
      function(event) {
        $(this).trigger('immerseEnter');
      }).on(
        `PhotoSwipeInitialZoomOut.${eventNamespace}`,
      function(event) {
        $(this).trigger('immerseExit');
      });

    },
    function(context, settings, trigger) {

      aiPhotoSwipe.getViewer().off([
        `PhotoSwipeInitialZoomIn.${eventNamespace}`,
        `PhotoSwipeInitialZoomOut.${eventNamespace}`,
      ].join(' '));

    }
  );

});
});
