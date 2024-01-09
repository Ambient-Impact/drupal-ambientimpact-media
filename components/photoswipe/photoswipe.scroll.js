// -----------------------------------------------------------------------------
//   Ambient.Impact - Media - PhotoSwipe scroll component
// -----------------------------------------------------------------------------

AmbientImpact.on([
  'photoswipe', 'scrollBlocker',
], function(aiPhotoSwipe, aiScrollBlocker) {
AmbientImpact.addComponent('photoswipe.scroll', function(photoswipeScroll, $) {

  'use strict';

  /**
   * Our event namespace.
   *
   * @type {String}
   */
  const eventNamespace = 'aiPhotoSwipeScroll';

  /**
   * Property name on the viewer we save the scroll blocker instance to.
   *
   * @type {String}
   */
  const propertyName = 'scrollBlocker';

  /**
   * PhotoSwipe open event handler; blocks scrolling.
   *
   * @param {jQuery.Event} event
   *
   * @param {Object} gallery
   *
   * @param {jQuery} $gallery
   *
   * @param {Object} gallerySettings
   */
  function openHandler(event, gallery, $gallery, gallerySettings) {

    /**
     * The PhotoSwipe viewer element, wrapped in a jQuery collection.
     *
     * @type {jQuery}
     */
    const $viewer = aiPhotoSwipe.getViewer();

    $viewer.prop(propertyName).block($viewer);

  };

  /**
   * PhotoSwipe close event handler; unblocks scrolling.
   *
   * @param {jQuery.Event} event
   *
   * @param {Object} gallery
   *
   * @param {jQuery} $gallery
   *
   * @param {Object} gallerySettings
   */
  function closeHandler(event, gallery, $gallery, gallerySettings) {

    /**
     * The PhotoSwipe viewer element, wrapped in a jQuery collection.
     *
     * @type {jQuery}
     */
    const $viewer = aiPhotoSwipe.getViewer();

    $viewer.prop(propertyName).unblock($viewer);

  };

  this.addBehaviour(
    'AmbientImpactPhotoSwipeScroll',
    'ambientimpact-photoswipe-scroll',
    'body',
    function(context, settings) {

      aiPhotoSwipe.getViewer().prop(propertyName, aiScrollBlocker.create());

      $(this).on({
        // @see https://stackoverflow.com/questions/33194138/template-string-as-object-property-name#70080319
        [`PhotoSwipeInitialZoomIn.${eventNamespace}`]:      openHandler,
        [`PhotoSwipeInitialZoomOutEnd.${eventNamespace}`]:  closeHandler,
      });

    },
    function(context, settings, trigger) {

      $(this).off({
        [`PhotoSwipeInitialZoomIn.${eventNamespace}`]:      openHandler,
        [`PhotoSwipeInitialZoomOutEnd.${eventNamespace}`]:  closeHandler,
      });

      const $viewer = aiPhotoSwipe.getViewer();

      if (typeof $viewer.prop(propertyName) !== 'undefined') {

        $viewer.prop(propertyName).unblock($viewer).then(function() {

          $viewer.removeProp(propertyName);

        });

      }

    }
  );

});
});
