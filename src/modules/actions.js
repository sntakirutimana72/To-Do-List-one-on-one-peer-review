import {
  $select, $prop, $attrib, $is,
} from './selectors.js';

const propClearTaskTrigger = (enforce) => {
  const trigger = $select('.clear-all-btn');
  const isDisabled = $is(trigger, 'disabled');

  if (isDisabled) {
    $prop(trigger, 'disabled');
  } else if (!enforce) $attrib(trigger, 'disabled', true);
};

export default propClearTaskTrigger;
