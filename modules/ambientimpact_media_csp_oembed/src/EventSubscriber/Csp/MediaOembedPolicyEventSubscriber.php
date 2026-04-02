<?php

declare(strict_types=1);

namespace Drupal\ambientimpact_media_csp_oembed\EventSubscriber\Csp;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Site\Settings;
use Drupal\csp\CspEvents;
use Drupal\csp\Event\PolicyAlterEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Alter Content-Security-Policy header to add media oEmbed policies.
 */
class MediaOembedPolicyEventSubscriber implements EventSubscriberInterface {

  /**
   * Event subscriber constructor; saves dependencies.
   *
   * @param \Drupal\Core\Site\Settings $configFactory
   *   The Drupal configuration object factory service.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $siteSettings
   *   The Drupal site settings.php service.
   */
  public function __construct(
    protected readonly ConfigFactoryInterface $configFactory,
    protected readonly Settings $siteSettings,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents(): array {

    return [
      // @see https://www.drupal.org/docs/extending-drupal/contributed-modules/contributed-module-documentation/content-security-policy/altering-a-sites-policy#s-default-policy-subscribers
      CspEvents::POLICY_ALTER => ['onCspPolicyAlter', 254],
    ];

  }

  /**
   * Automagically add the configured S3 URL to CSP directives.
   *
   * @param \Drupal\csp\Event\PolicyAlterEvent $alterEvent
   *   The Policy Alter event.
   */
  public function onCspPolicyAlter(PolicyAlterEvent $alterEvent): void {

    /** @var \Drupal\Core\Config\ImmutableConfig The S3 File System module configuration. */
    $mediaConfig = $this->configFactory->get('media.settings');

    $oembedDomain = $mediaConfig->get('iframe_domain');

    // Don't do anything if no oEmbed domain has been configured.
    if (empty($oembedDomain)) {
      return;
    }

    /** @var \Drupal\csp\Csp */
    $policy = $alterEvent->getPolicy();

    $policy->appendDirective('frame-src', [$oembedDomain]);

    // If the 'primary_host' site setting is set, use that to allow embedding
    // only by that host.
    //
    // @todo Make this optional?
    //
    // @todo What about other hosts that this is site may be legitimately
    //  allowed to be accessed via?
    $primaryHost = $this->siteSettings->get('primary_host');

    if (empty($primaryHost)) {
      return;
    }

    $policy->appendDirective('frame-ancestors', ['https://' . $primaryHost]);

  }

}
