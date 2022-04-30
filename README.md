**Web-Crawler**

A basic Web Crawler in Node JS

Create the crawler with a max fixed number of visitors, each time extracts new links put them in the blocking queue and if the place for the visitor is available then process the link from the top of the queue(FIFO). All the network calls will be handled concurrently by using NodeJS native non-blocking model. A blocking queue is used to control the concurrent connections at any point in time. The process will stop if there is no active visitor and the blocking queue is empty.

***Limitations***

* Max depth is not implemented, the process will run until it finds all links.
* robots.txt is not supported 
* susceptible to the rate limit since there is no proxy configuration
* No backoff mechanism
* Will not follow static files

***Env Values***

```
CONCURRENT: 10
ROOT_URL: https://examble.com
```

***How to run***

```
yarn
yarn start
```

****Output****
```
Visitor: Visiting https://example.com
Visitor: Found on https://example.com Links 
----> https://example.com/#
----> https://example.com/
----> https://example.com/
----> https://example.com/
----> https://example.com/i/business
----> https://example.com/i/current-account/
----> https://example.com/i/example-plus/
----> https://example.com/i/example-premium/
----> https://example.com/i/business/
----> https://example.com/features/joint-accounts/
----> https://example.com/features/16-plus/
----> https://example.com/i/switch/
----> https://example.com/i/savingwithexample/
----> https://example.com/features/savings/
----> https://example.com/isa
----> https://example.com/flex
----> https://example.com/i/overdrafts/
----> https://example.com/i/loans/
----> https://example.com/blog/2019/11/12/what-are-unsecured-loans/
----> https://example.com/i/pots
----> https://example.com/features/travel/
----> https://example.com/features/energy-switching/
----> https://example.com/i/shared-tabs-more/
----> https://community.example.com/c/making-example/
----> https://example.com/help/
----> https://app.adjust.com/ydi27sn_9mq4ox7?engagement_type=fallback_click&fallback=https%3A%2F%2Fexample.com%2Fdownload&redirect_macos=https%3A%2F%2Fexample.com%2Fdownload
----> https://example.com/flex/
----> https://app.adjust.com/ydi27sn_9mq4ox7?engagement_type=fallback_click&fallback=https%3A%2F%2Fexample.com%2Fdownload&redirect_macos=https%3A%2F%2Fexample.com%2Fdownload
----> https://uk.trustpilot.com/review/www.example.com
----> https://app.adjust.com/ydi27sn?engagement_type=fallback_click&fallback=https%3A%2F%2Fexample.com%2Fdownload&redirect_macos=https%3A%2F%2Fexample.com%2Fdownload
----> https://app.adjust.com/9mq4ox7?engagement_type=fallback_click&fallback=https%3A%2F%2Fexample.com%2Fdownload&redirect_macos=https%3A%2F%2Fexample.com%2Fdownload
----> https://app.adjust.com/ydi27sn_9mq4ox7?engagement_type=fallback_click&fallback=https%3A%2F%2Fexample.com%2Fdownload&redirect_macos=https%3A%2F%2Fexample.com%2Fdownload
----> https://example.com/i/example-premium/
----> https://example.com/i/example-plus/
----> https://example.com/features/savings/
----> https://example.com/features/travel/
----> https://example.com/i/loans/
----> https://example.com/i/security/
----> https://example.com/service-quality-results/#great-britain
----> https://example.com/service-quality-results/#northern-ireland
----> https://app.adjust.com/ydi27sn?engagement_type=fallback_click&fallback=https%3A%2F%2Fexample.com%2Fdownload&redirect_macos=https%3A%2F%2Fexample.com%2Fdownload
----> https://app.adjust.com/9mq4ox7?engagement_type=fallback_click&fallback=https%3A%2F%2Fexample.com%2Fdownload&redirect_macos=https%3A%2F%2Fexample.com%2Fdownload
----> https://example.com/about/
----> https://example.com/us/
----> https://example.com/blog/
----> https://example.com/press/
----> https://example.com/careers/
----> https://example.com/i/our-social-programme/
----> https://example.com/i/accessibility/
----> https://web.example.com
----> https://example.com/i/supporting-all-our-customers/
----> https://example.com/i/helping-everyone-belong-at-example/
----> https://example.com/i/coronavirus-faq
----> https://example.com/i/fraud/
----> https://example.com/tone-of-voice/
----> https://example.com/i/business/
----> https://example.com/static/docs/modern-slavery-statement/modern-slavery-statement-2021.pdf
----> https://example.com/faq/
----> https://example.com/legal/terms-and-conditions/
----> https://example.com/legal/fscs-information/
----> https://example.com/legal/privacy-notice/
----> https://example.com/legal/cookie-notice/
----> https://example.com/legal/browser-support-policy/
----> https://example.com/information-about-current-account-services/
----> https://example.com/service-information/
----> https://app.adjust.com/ydi27sn?engagement_type=fallback_click&fallback=https%3A%2F%2Fexample.com%2Fdownload&redirect_macos=https%3A%2F%2Fexample.com%2Fdownload
----> https://app.adjust.com/9mq4ox7?engagement_type=fallback_click&fallback=https%3A%2F%2Fexample.com%2Fdownload&redirect_macos=https%3A%2F%2Fexample.com%2Fdownload
----> https://twitter.com/example
----> https://www.instagram.com/example
----> https://www.facebook.com/examplebank
----> https://www.linkedin.com/company/example-bank
----> https://www.youtube.com/examplebank

Visitor: Visiting https://example.com/#
Visitor: Visiting https://example.com/
Visitor: Visiting https://example.com/i/business
Visitor: Visiting https://example.com/i/current-account/
Visitor: Visiting https://example.com/i/example-plus/
Visitor: Visiting https://example.com/i/example-premium/
Visitor: Visiting https://example.com/i/business/
Visitor: Visiting https://example.com/features/joint-accounts/
Visitor: Visiting https://example.com/features/16-plus/
Visitor: Visiting https://example.com/i/switch/
Visitor: Found on https://example.com/features/joint-accounts/ Links 
----> https://example.com/#
----> https://example.com/
----> https://example.com/
----> https://example.com/
----> https://example.com/i/business
----> https://example.com/i/current-account/
----> https://example.com/i/example-plus/
----> https://example.com/i/example-premium/
----> https://example.com/i/business/
----> https://example.com/features/joint-accounts/
----> https://example.com/features/16-plus/
----> https://example.com/i/switch/
----> https://example.com/i/savingwithexample/
----> https://example.com/features/savings/
----> https://example.com/isa
----> https://example.com/flex
----> https://example.com/i/overdrafts/
----> https://example.com/i/loans/
----> https://example.com/blog/2019/11/12/what-are-unsecured-loans/
----> https://example.com/i/pots
----> https://example.com/features/travel/
----> https://example.com/features/energy-switching/
----> https://example.com/i/shared-tabs-more/
----> https://community.example.com/c/making-example/
----> https://example.com/help/
----> https://app.adjust.com/ydi27sn_9mq4ox7?engagement_type=fallback_click&fallback=https%3A%2F%2Fexample.com%2Fdownload&redirect_macos=https%3A%2F%2Fexample.com%2Fdownload
----> https://example.com/i/switch/
----> https://app.adjust.com/ydi27sn?engagement_type=fallback_click&fallback=https%3A%2F%2Fexample.com%2Fdownload&redirect_macos=https%3A%2F%2Fexample.com%2Fdownload
----> https://app.adjust.com/9mq4ox7?engagement_type=fallback_click&fallback=https%3A%2F%2Fexample.com%2Fdownload&redirect_macos=https%3A%2F%2Fexample.com%2Fdownload
----> https://example.com/about/
----> https://example.com/us/
----> https://example.com/blog/
----> https://example.com/press/
----> https://example.com/careers/
----> https://example.com/i/our-social-programme/
----> https://example.com/i/accessibility/
----> https://web.example.com
----> https://example.com/i/supporting-all-our-customers/
----> https://example.com/i/helping-everyone-belong-at-example/
----> https://example.com/i/coronavirus-faq
----> https://example.com/i/fraud/
----> https://example.com/tone-of-voice/
----> https://example.com/i/business/
----> https://example.com/static/docs/modern-slavery-statement/modern-slavery-statement-2021.pdf
----> https://example.com/faq/
----> https://example.com/legal/terms-and-conditions/
----> https://example.com/legal/fscs-information/
----> https://example.com/legal/privacy-notice/
----> https://example.com/legal/cookie-notice/
----> https://example.com/legal/browser-support-policy/
----> https://example.com/information-about-current-account-services/
----> https://example.com/service-information/
----> https://app.adjust.com/ydi27sn?engagement_type=fallback_click&fallback=https%3A%2F%2Fexample.com%2Fdownload&redirect_macos=https%3A%2F%2Fexample.com%2Fdownload
----> https://app.adjust.com/9mq4ox7?engagement_type=fallback_click&fallback=https%3A%2F%2Fexample.com%2Fdownload&redirect_macos=https%3A%2F%2Fexample.com%2Fdownload
----> https://twitter.com/example
----> https://www.instagram.com/example
----> https://www.facebook.com/examplebank
----> https://www.linkedin.com/company/example-bank
----> https://www.youtube.com/examplebank
```

***How to run tests***

```
yarn test
```

