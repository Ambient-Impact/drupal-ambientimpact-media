AmbientImpact.on(['photoswipe'], function(aiPhotoSwipe) {
AmbientImpact.addComponent('photoswipe.destroy', function(
  aiPhotoSwipeDestroy, $
) {

  'use strict';

  // console.debug(aiPhotoSwipe.getHTML());
  console.debug($('.pswp')[0]);

  let pswp = $('.pswp')[0];

  this.addBehaviour(
    'AmbientImpactPhotoSwipeDestroy',
    'ambientimpact-photoswipe-destroy',
    // '.layout-container',
    'body',
    function(context, settings) {

      // let $pswp = $(this).find('.pswp');

      // if ($pswp.length > 0) {
      //   return;
      // }

      // pswp = $pswp[0];

      // console.debug(pswp);

      // // if (typeof $('html').prop('aiPhotoSwipeHtml') === 'undefined') {
      // if (typeof pswp === 'undefined') {
      //   return;
      // }

      $(this).append(pswp);

      // Doesn't do anything an attach.

    },
    function(context, settings, trigger) {

      aiPhotoSwipe.destroyAll();

      // let $pswp = $(this).find('.pswp');

      // console.debug($pswp);

      // if ($pswp.length === 0) {
      //   return;
      // }

      // // $('html').prop('aiPhotoSwipeHtml', $pswp[0]);
      // pswp = $pswp[0];

    }
  );

});
});
