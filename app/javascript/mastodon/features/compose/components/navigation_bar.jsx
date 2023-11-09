import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import { Avatar } from '../../../components/avatar';

import ActionBar from './action_bar';

export default class NavigationBar extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    onLogout: PropTypes.func.isRequired,
    onClose: PropTypes.func,
  };

  render () {
    const username = this.props.account.get('acct')
    const displayName = this.props.account.get('display_name');
    
    return (
      <div className='navigation-bar'>
        <Link to={`/@${username}`}>
          <span style={{ display: 'none' }}>{username}</span>
          <Avatar account={this.props.account} size={46} />
        </Link>

        <div className='navigation-bar__profile'>
        <span>
            <Link to={`/@${username}`}>
              <strong className='navigation-bar__profile-account display-name'>{displayName}</strong>
            </Link>
          </span>
          
          <span>
            <Link to={`/@${username}`}>
              <strong className='navigation-bar__profile-account username'>@{username}</strong>
            </Link>
          </span>
        </div>

        <div className='navigation-bar__actions'>
          <ActionBar account={this.props.account} onLogout={this.props.onLogout} />
        </div>
      </div>
    );
  }

}
