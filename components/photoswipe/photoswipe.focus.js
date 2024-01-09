// -----------------------------------------------------------------------------
//   Ambient.Impact - Media - PhotoSwipe focus management component
// -----------------------------------------------------------------------------

// @see https://allyjs.io/api/maintain/disabled.html

AmbientImpact.onGlobals('ally.maintain.disabled', function() {
AmbientImpact.on(['fastdom', 'photoswipe'], function(aiFastDom, aiPhotoSwipe) {
AmbientImpact.addComponent('photoswipe.focus', function(photoswipeFocus, $) {

  'use strict';

  /**
   * Our event namespace.
   *
   * @type {String}
   */
  const eventNamespace = 'aiPhotoSwipeFocus';

  /**
   * FastDom instance.
   *
   * @type {FastDom}
   */
  const fastdom = aiFastDom.getInstance();

  /**
   * ally.maintain.disabled 'filter' selector.
   *
   * @type {String}
   */
  const focusDisabledFilter = `.${$.PhotoSwipe.baseClass} *`;

  /**
   * Property name on the viewer we save the ally.maintain.disabled instance to.
   *
   * @type {String}
   */
  const propertyName = 'focusDisabledHandle';

  /**
   * PhotoSwipe open event handler; blocks focus to elements outside of viewer.
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

    fastdom.mutate(function() {

      // Make sure to disengage a previous instance before potentially overwriting
      // the reference to it, thus losing the ability to do so.
      if (typeof $viewer.prop(propertyName) !== 'undefined') {
        $viewer.prop(propertyName).disengage();
      }

      $viewer.prop(propertyName, ally.maintain.disabled({
        filter: focusDisabledFilter,
      }));

    });

  };

  /**
   * PhotoSwipe close event handler; unblocks focus to rest of document.
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

    fastdom.mutate(function() {

      if (typeof $viewer.prop(propertyName) !== 'undefined') {

        $viewer.prop(propertyName).disengage();

        $viewer.removeProp(propertyName);

      }

    }).then(function () {

      // Focus the link of the current gallery index on gallery destruction. By
      // default, PhotoSwipe 4.x doesn't do this, which results in focus being
      // reset to the start of the document.
      $(gallery.currItem.el).find('a').trigger('focus');

      $viewer.trigger('PhotoSwipeFocusRestored', [
        gallery,
        $gallery,
        gallerySettings
      ]);

    });

  };

  this.addBehaviour(
    'AmbientImpactPhotoSwipeFocus',
    'ambientimpact-photoswipe-focus',
    'body',
    function(context, settings) {

      $(this).on({
        // @see https://stackoverflow.com/questions/33194138/template-string-as-object-property-name#70080319
        [`PhotoSwipeInitialZoomInEnd.${eventNamespace}`]:   openHandler,
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

        $viewer.prop(propertyName).disengage();

        $viewer.removeProp(propertyName);

      }

    }
  );

});
});
});
