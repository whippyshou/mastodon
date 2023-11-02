import { FormattedMessage } from 'react-intl';
import { DismissableBanner } from 'mastodon/components/dismissable_banner';
import { title } from 'mastodon/initial_state';

export const ExplorePrompt = () => (
  <DismissableBanner id='local.explore_prompt'>
    <p>
      <FormattedMessage
        id='local.explore_prompt.body'
        defaultMessage="Your home feed will have a mix of posts from the hashtags you've chosen to follow, the people you've chosen to follow, and the posts they boost. If that feels too quiet, you may want to:" values={{ title }}
      />
    </p>
  </DismissableBanner>
);
