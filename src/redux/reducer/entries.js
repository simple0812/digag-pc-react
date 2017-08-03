/**
 * Created by Yuicon on 2017/7/16.
 * https://github.com/Yuicon
 */
import Immutable from 'immutable';
import {
  CREATE_ENTRY,
  CREATE_ENTRY_FAILURE,
  CREATE_ENTRY_SUCCESS,
  FIND_ALL_ENTRIES,
  FIND_ALL_ENTRIES_FAILURE,
  FIND_ALL_ENTRIES_SUCCESS,
  UPDATE_ENTRY,
  UPDATE_ENTRY_SUCCESS,
  UPDATE_ENTRY_FAILURE, LIKE_ENTRY, LIKE_RESULT_ENTRY
} from '../action/entries';
import {Entry} from '../record/models';
import {convertArrayToRecordMap} from "../../utils/common";


const initialState = Immutable.fromJS({
  newEntry: null,
  error: null,
  saveSuccess: false,
  entries: new Immutable.Map(),
  oldEntry: null,
  eid: null,
});

export const entries = (state = initialState, action = {}) => {
  let entries;
  switch (action.type) {
    case CREATE_ENTRY:
      return state.merge({
        'newEntry': action.data,
        'saveSuccess': false,
        'error': null,
      });
    case CREATE_ENTRY_SUCCESS:
      return state.set('saveSuccess', action.data);
    case CREATE_ENTRY_FAILURE:
      return state.set('error', action.data);
    case FIND_ALL_ENTRIES:
      return state.merge({
        'entries': [],
        'error': null,
      });
    case FIND_ALL_ENTRIES_SUCCESS:
      return state.set('entries', convertArrayToRecordMap(action.data.content, Entry));
    case FIND_ALL_ENTRIES_FAILURE:
      return state.set('error', action.data);
    case UPDATE_ENTRY:
      return state.merge({
        'error': null,
        'oldEntry': action.data
      });
    case UPDATE_ENTRY_SUCCESS:
      return state.update('entries', map => map.set(action.data.id, new Entry(action.data)));
    case UPDATE_ENTRY_FAILURE:
      return state.merge({
        'error': action.data,
        'oldEntry': null
      });
    case LIKE_ENTRY:
      return state.merge({
        'eid': action.data
      });
    case LIKE_RESULT_ENTRY:
      entries = state.get('entries');
      const likeEntry = entries.get(action.data.eid);
      return state.update('entries', map => map.set(action.data.eid,
        likeEntry.set('collectionCount',Number(action.data.count) + Number(likeEntry.collectionCount))));
    default:
      return state
  }
};
