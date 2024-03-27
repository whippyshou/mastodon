import PropTypes from 'prop-types';
import {defineMessages, FormattedMessage } from 'react-intl';
import { Helmet } from 'react-helmet';

import { List as ImmutableList } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import { TimelineHint } from 'mastodon/components/timeline_hint';
import BundleColumnError from 'mastodon/features/ui/components/bundle_column_error';
import { normalizeForLookup } from 'mastodon/reducers/accounts_map';
import { getAccountHidden } from 'mastodon/selectors';
import ColumnBackButtonSlim from '../../components/column_back_button_slim';
import { lookupAccount, fetchAccount } from '../../actions/accounts';
import { fetchFeaturedTags } from '../../actions/featured_tags';
import {  expandAccountDirectTimeline} from '../../actions/timelines';
import { LoadingIndicator } from '../../components/loading_indicator';
import StatusList from '../../components/status_list';
import Column from '../ui/components/column';


const emptyList = ImmutableList();

const mapStateToProps = (state, { params: { acct, id, tagged } }) => {
  const accountId = id || state.getIn(['accounts_map', normalizeForLookup(acct)]);

  if (accountId === null) {
    return {
      isLoading: false,
      isAccount: false,
      statusIds: emptyList,
    };
  } else if (!accountId) {
    return {
      isLoading: true,
      statusIds: emptyList,
    };
  }


  return {
    accountId,
    remote: !!(state.getIn(['accounts', accountId, 'acct']) !== state.getIn(['accounts', accountId, 'username'])),
    remoteUrl: state.getIn(['accounts', accountId, 'url']),
    isAccount: !!state.getIn(['accounts', accountId]),
    statusIds: state.getIn(['timelines', `account:${accountId}:with_replies`, 'items'], emptyList),
    featuredStatusIds: ImmutableList(),
    isLoading: state.getIn(['timelines', `account:${accountId}:with_replies`, 'isLoading']),
    hasMore: state.getIn(['timelines', `account:${accountId}:with_replies`, 'hasMore']),
    suspended: state.getIn(['accounts', accountId, 'suspended'], false),
    hidden: getAccountHidden(state, accountId),
    blockedBy: state.getIn(['relationships', accountId, 'blocked_by'], false),
  };
};

const RemoteHint = ({ url }) => (
  <TimelineHint url={url} resource={<FormattedMessage id='timeline_hint.resources.statuses' defaultMessage='Older posts' />} />
);

RemoteHint.propTypes = {
  url: PropTypes.string.isRequired,
};

class AccountTimeline extends ImmutablePureComponent {

  static contextTypes = {
    identity: PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.shape({
      acct: PropTypes.string,
      id: PropTypes.string,
      tagged: PropTypes.string,
    }).isRequired,
    accountId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.list,
    featuredStatusIds: ImmutablePropTypes.list,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    blockedBy: PropTypes.bool,
    isAccount: PropTypes.bool,
    suspended: PropTypes.bool,
    hidden: PropTypes.bool,
    remote: PropTypes.bool,
    remoteUrl: PropTypes.string,
    multiColumn: PropTypes.bool,
  };

  _load () {
    const { accountId, dispatch } = this.props;

    dispatch(fetchAccount(accountId));

    dispatch(fetchFeaturedTags(accountId));
    dispatch(expandAccountDirectTimeline(accountId));

  }

  componentDidMount () {
    const { params: { acct }, accountId, dispatch } = this.props;
    if (accountId) {
      this._load();
    } else {
      dispatch(lookupAccount(acct));
    }
  }

  componentDidUpdate (prevProps) {
    const { params: { acct }, accountId, dispatch } = this.props;
    if (prevProps.accountId !== accountId && accountId) {
      this._load();
    } else if (prevProps.params.acct !== acct) {
      dispatch(lookupAccount(acct));
    } 
  }

  handleLoadMore = maxId => {
    this.props.dispatch(expandAccountDirectTimeline(this.props.accountId, { maxId}));
  };

  render () {
    const { statusIds, featuredStatusIds, isLoading, hasMore, blockedBy, suspended, isAccount, hidden, multiColumn, remote, remoteUrl } = this.props;
    const { signedIn } = this.context.identity;

    if (isLoading && statusIds.isEmpty()) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    } else if (!isLoading && !isAccount) {
      return (
        <BundleColumnError multiColumn={multiColumn} errorType='routing' />
      );
    }

    let emptyMessage;

    const forceEmptyState = suspended || blockedBy || hidden || !signedIn
    if (!signedIn) {
      emptyMessage = <FormattedMessage id='empty_column.visitor' defaultMessage='Account suspended' />;
    } 
    else if (suspended) {
      emptyMessage = <FormattedMessage id='empty_column.account_suspended' defaultMessage='Account suspended' />;
    }  else if (blockedBy) {
      emptyMessage = <FormattedMessage id='empty_column.account_unavailable' defaultMessage='Profile unavailable' />;
    } else if (remote && statusIds.isEmpty()) {
      emptyMessage = <RemoteHint url={remoteUrl} />;
    } else {
      emptyMessage = <FormattedMessage id='empty_column.account_timeline' defaultMessage='No posts found' />;
    }

    const remoteMessage = remote ? <RemoteHint url={remoteUrl} /> : null;

    return (

      <Column bindToDocument={!multiColumn} icon='thumb-tack' heading='-' ref={this.setRef}>
        <ColumnBackButtonSlim />
        <StatusList
          append={remoteMessage}
          scrollKey='account_timeline'
          statusIds={forceEmptyState ? emptyList : statusIds}
          featuredStatusIds={featuredStatusIds}
          isLoading={isLoading}
          hasMore={!forceEmptyState && hasMore}
          onLoadMore={this.handleLoadMore}
          emptyMessage={emptyMessage}
          bindToDocument={!multiColumn}
          timelineId='account_direct'
        />
        <Helmet>
          <meta name='robots' content='noindex' />
        </Helmet>
      </Column>
    );
  }

}

export default connect(mapStateToProps)(AccountTimeline);
