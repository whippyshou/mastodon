import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { debounce } from 'lodash';

import { scrollTopTimeline, loadPending } from '../../../actions/timelines';
import StatusList from '../../../components/status_list';

const makeGetStatusIds = (pending = false) => createSelector([
  (state) => state.getIn(['settings', 'local'], ImmutableMap()),
  (state, { type }) => state.getIn(['timelines', type, pending ? 'pendingItems' : 'items'], ImmutableList()),
  (state)           => state.get('statuses'),
  (type)            => type
], (columnSettings, statusIds, statuses,type) => {
  return statusIds.filter(id => {
    if (id === null) return true;

    const statusForId = statuses.get(id);
    
    let showStatus = true;

    if (statusForId.get('visibility') === 'direct')
      return false;
    if (statusForId.get('in_reply_to_id')) {
      showStatus =  showStatus && statusForId.get('in_reply_to_account_id') === statusForId.get('account')
    }
    if (columnSettings.getIn(['shows', 'media']) === true) {
      showStatus = showStatus &&  statusForId.get('media_attachments').size>0;
    }

    return showStatus;
  });
});

const makeMapStateToProps = () => {
  const getStatusIds = makeGetStatusIds();
  const getPendingStatusIds = makeGetStatusIds(true);

  const mapStateToProps = (state, { timelineId }) => ({
    statusIds: getStatusIds(state, { type: timelineId }),
    lastId:    state.getIn(['timelines', timelineId, 'items'])?.last(),
    isLoading: state.getIn(['timelines', timelineId, 'isLoading'], true),
    isPartial: state.getIn(['timelines', timelineId, 'isPartial'], false),
    hasMore:   state.getIn(['timelines', timelineId, 'hasMore']),
    numPending: getPendingStatusIds(state, { type: timelineId }).size,
  });

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, { timelineId }) => ({

  onScrollToTop: debounce(() => {
    dispatch(scrollTopTimeline(timelineId, true));
  }, 100),

  onScroll: debounce(() => {
    dispatch(scrollTopTimeline(timelineId, false));
  }, 100),

  onLoadPending: () => dispatch(loadPending(timelineId)),

});

export default connect(makeMapStateToProps, mapDispatchToProps)(StatusList);
