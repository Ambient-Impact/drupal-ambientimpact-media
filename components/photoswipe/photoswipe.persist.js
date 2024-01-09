// -----------------------------------------------------------------------------
//   Ambient.Impact - Media - PhotoSwipe persist component
// -----------------------------------------------------------------------------

// Provides a behaviour that attaches and detaches the PhotoSwipe viewer element
// from the DOM, and destroys any existing galleries on detach. This is
// necessary if re-attaching when using Hotwire Turbo or any other means that
// swaps out the page contents without doing a full page load.

AmbientImpact.on(['photoswipe'], function(aiPhotoSwipe) {
AmbientImpact.addComponent('photoswipe.persist', function(
  photoswipePersist, $
) {

  'use strict';

  this.addBehaviour(
    'AmbientImpactPhotoSwipePersist',
    'ambientimpact-photoswipe-persist',
    'body',
    function(context, settings) {

      if ($(this).find(aiPhotoSwipe.getViewer()).length === 0) {

        aiPhotoSwipe.getViewer().appendTo(this);

      }

    },
    function(context, settings, trigger) {

      aiPhotoSwipe.destroyAll();

      aiPhotoSwipe.getViewer().detach();

    }
  );

});
});
