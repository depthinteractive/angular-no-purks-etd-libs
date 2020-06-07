import {Entry, TypedEntry} from '../../models/Entry.model';
import * as GroupmentActions from './groupment.actions';
import {groupmentInitialState} from './groupment.initial';
import {StatesService} from '../../services/states.service';

const $states: StatesService = StatesService.instance;

const $$groupment: TypedEntry<Entry[]> = $states.getGroupment(groupmentInitialState);
let $$mode = $states.mode;

export function GroupmentReducer(
  groupment: Entry[] = [],
  actions: GroupmentActions.Actions
) {
  switch (actions.type) {
    case GroupmentActions.ADD_GROUP:
      const last: Entry = groupment.slice(-1).shift();

      if (last.onlyLast) {
        groupment.splice(-1, 1, actions.group, last);
      } else {
        groupment.push(actions.group);
      }

      actions.group.prop.used = true;

      changeGroupment(groupment);

      return [...groupment];

    case GroupmentActions.REMOVE_GROUP:
      if (groupment.some(group => group.key === actions.groupKey)) {
        groupment.splice(
          groupment.findIndex(group => group.key === actions.groupKey),
          1
        );
      }

      if ($$groupment[$$mode].some(group => group.key === actions.groupKey)) {
        $$groupment[$$mode].find(group =>
          group.key === actions.groupKey
        ).prop.used = false;
      }

      changeGroupment(groupment);

      return [...groupment];


    case GroupmentActions.REORDER_GROUP:
      const reorder = actions.reorder;
      const node: Entry = reorder.node.origin,
        dragNode: Entry = reorder.dragNode.origin;

      // Индекс узла на место которого перетаскивается другой узел
      const nodeIndex: number = groupment.findIndex(group => group.key === node.key),
        // Индекс перетаскиваемого узла
        dragNodeIndex: number = groupment.findIndex(group => group.key === dragNode.key);

      if (actions.reorder['pos'] === 1 && dragNodeIndex > nodeIndex) {
        groupment.splice(nodeIndex, 1, groupment[nodeIndex], ...groupment.splice(dragNodeIndex, 1));
      } else if (actions.reorder['pos'] === -1 && dragNodeIndex > nodeIndex) {
        groupment.splice(nodeIndex, 1, ...groupment.splice(dragNodeIndex, 1), groupment[nodeIndex]);
      } else if (actions.reorder['pos'] === 1 && dragNodeIndex < nodeIndex) {
        groupment.splice(nodeIndex, 1, groupment[nodeIndex], groupment[dragNodeIndex]);
        groupment.splice(dragNodeIndex, 1);
      } else if (actions.reorder['pos'] === -1 && dragNodeIndex < nodeIndex) {
        groupment.splice(nodeIndex, 1, groupment[dragNodeIndex], groupment[nodeIndex]);
        groupment.splice(dragNodeIndex, 1);
      }

      changeGroupment(groupment);

      return [...groupment];

    case GroupmentActions.CHANGE_MODE:
      $$mode = actions.mode;
      groupment = $$groupment[$$mode];
      return [...groupment];

    default:
      return groupment;
  }
}

function changeGroupment(groupment: Entry[]): void {
  $$groupment[$$mode] = groupment;
}
