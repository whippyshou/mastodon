/* eslint-disable @typescript-eslint/no-unsafe-call,
                  @typescript-eslint/no-unsafe-return,
                  @typescript-eslint/no-unsafe-assignment,
                  @typescript-eslint/no-unsafe-member-access
                  -- the settings store is not yet typed */
import { useCallback } from 'react';

import { FormattedMessage } from 'react-intl';

import { useAppSelector, useAppDispatch } from 'mastodon/store';

import { changeSetting } from '../../../actions/settings';
import SettingToggle from '../../notifications/components/setting_toggle';

export const ColumnSettings: React.FC = () => {
  const settings = useAppSelector((state) => state.settings.get('local'));

  const dispatch = useAppDispatch();
  const onChange = useCallback(
    (key: string, checked: boolean) => {
      dispatch(changeSetting(['local', ...key], checked));
    },
    [dispatch],
  );

  return (
    <div>
      <div className='column-settings__row'>
        <SettingToggle
          prefix='local_timeline'
          settings={settings}
          settingPath={['shows', 'media']}
          onChange={onChange}
          label={
            <FormattedMessage
              id='local.column_settings.show_media'
              defaultMessage='Show Media'
            />
          }
        />
      </div>
    </div>
  );
};
