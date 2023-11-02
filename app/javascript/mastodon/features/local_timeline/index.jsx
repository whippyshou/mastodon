import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import { Helmet } from 'react-helmet';

import { List as ImmutableList } from 'immutable';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { NotSignedInIndicator } from 'mastodon/components/not_signed_in_indicator';
import { me } from 'mastodon/initial_state';

import { addColumn, removeColumn, moveColumn } from '../../actions/columns';
import { expandHomeTimeline } from '../../actions/timelines';
import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';
import LocalStatusListContainer from '../ui/containers/local_status_list_container';

import { ColumnSettings } from './components/column_settings';
import { ExplorePrompt } from './components/explore_prompt';

const messages = defineMessages({
  title: { id: 'column.local', defaultMessage: 'local' },
});

const getHomeFeedSpeed = createSelector([
  state => state.getIn(['timelines', 'home', 'items'], ImmutableList()),
  state => state.getIn(['timelines', 'home', 'pendingItems'], ImmutableList()),
  state => state.get('statuses'),
], (statusIds, pendingStatusIds, statusMap) => {
  const recentStatusIds = pendingStatusIds.size > 0 ? pendingStatusIds : statusIds;
  const statuses = recentStatusIds.filter(id => id !== null).map(id => statusMap.get(id)).filter(status => status?.get('account') !== me).take(20);

  if (statuses.isEmpty()) {
    return {
      gap: 0,
      newest: new Date(0),
    };
  }

  const datetimes = statuses.map(status => status.get('created_at', 0));
  const oldest = new Date(datetimes.min());
  const newest = new Date(datetimes.max());
  const averageGap = (newest - oldest) / (1000 * (statuses.size + 1)); // Average gap between posts on first page in seconds

  return {
    gap: averageGap,
    newest,
  };
});

const homeTooSlow = createSelector([
  state => state.getIn(['timelines', 'home', 'isLoading']),
  state => state.getIn(['timelines', 'home', 'isPartial']),
  getHomeFeedSpeed,
], (isLoading, isPartial, speed) =>
  !isLoading && !isPartial // Only if the home feed has finished loading
  && (
    (speed.gap > (30 * 60) // If the average gap between posts is more than 30 minutes
    || (Date.now() - speed.newest) > (1000 * 3600)) // If the most recent post is from over an hour ago
  )
);

const mapStateToProps = state => ({
  hasUnread: state.getIn(['timelines', 'home', 'unread']) > 0,
  isPartial: state.getIn(['timelines', 'home', 'isPartial']),
  tooSlow: homeTooSlow(state),
});

class HomeTimeline extends PureComponent {

  static contextTypes = {
    identity: PropTypes.object,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
    isPartial: PropTypes.bool,
    columnId: PropTypes.string,
    multiColumn: PropTypes.bool,
    tooSlow: PropTypes.bool,
  };

  handlePin = () => {
    const { columnId, dispatch } = this.props;

    if (columnId) {
      dispatch(removeColumn(columnId));
    } else {
      dispatch(addColumn('HOME', {}));
    }
  };

  handleMove = (dir) => {
    const { columnId, dispatch } = this.props;
    dispatch(moveColumn(columnId, dir));
  };

  handleHeaderClick = () => {
    this.column.scrollTop();
  };

  setRef = c => {
    this.column = c;
  };

  handleLoadMore = maxId => {
    this.props.dispatch(expandHomeTimeline({ maxId }));
  };

  componentDidUpdate (prevProps) {
    this._checkIfReloadNeeded(prevProps.isPartial, this.props.isPartial);
  }

  componentWillUnmount () {
    this._stopPolling();
  }

  _checkIfReloadNeeded (wasPartial, isPartial) {
    const { dispatch } = this.props;

    if (wasPartial === isPartial) {
      return;
    } else if (!wasPartial && isPartial) {
      this.polling = setInterval(() => {
        dispatch(expandHomeTimeline());
      }, 3000);
    } else if (wasPartial && !isPartial) {
      this._stopPolling();
    }
  }

  _stopPolling () {
    if (this.polling) {
      clearInterval(this.polling);
      this.polling = null;
    }
  }



  render () {
    const { intl, hasUnread, columnId, multiColumn, tooSlow } = this.props;
    const pinned = !!columnId;
    const { signedIn } = this.context.identity;
    const banners = [];


    if (tooSlow) {
      banners.push(<ExplorePrompt key='explore-prompt' />);
    }

    return (
      <Column bindToDocument={!multiColumn} ref={this.setRef} label={intl.formatMessage(messages.title)}>
        <ColumnHeader
          icon='home'
          active={hasUnread}
          title={intl.formatMessage(messages.title)}
          onPin={this.handlePin}
          onMove={this.handleMove}
          onClick={this.handleHeaderClick}
          pinned={pinned}
          multiColumn={multiColumn}
        >
          <ColumnSettings />
        </ColumnHeader>

        {signedIn ? (
          <LocalStatusListContainer
            prepend={banners}
            alwaysPrepend
            trackScroll={!pinned}
            scrollKey={`home_timeline-${columnId}`}
            onLoadMore={this.handleLoadMore}
            timelineId='home'
            emptyMessage={<FormattedMessage id='empty_column.home' defaultMessage='Your home timeline is empty! Follow more people to fill it up.' />}
            bindToDocument={!multiColumn}
          />
        ) : <NotSignedInIndicator />}

        <Helmet>
          <title>{intl.formatMessage(messages.title)}</title>
          <meta name='robots' content='noindex' />
        </Helmet>
      </Column>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(HomeTimeline));
