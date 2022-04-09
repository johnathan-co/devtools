/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

//

import { selectLocation } from "../sources";
import { fetchScopes } from "./fetchScopes";
import { setFramePositions } from "./setFramePositions";
import actions from "../../actions";
import assert from "../../utils/assert";

/**
 * @memberof actions/pause
 * @static
 */
export function selectFrame(cx, frame, point) {
  return async (dispatch, getState, { client }) => {
    assert(cx.thread == frame.thread, "Thread mismatch");
    console.log({ frame });

    if (point) {
      await dispatch(actions.seek(point.point, point.time, true));
    }

    const state = getState();
    console.log({ frame, state });

    // Frames that aren't on-stack do not support evalling and may not
    // have live inspectable scopes, so we do not allow selecting them.
    if (frame.state !== "on-stack") {
      return dispatch(selectLocation(cx, frame.location));
    }

    dispatch({
      type: "SELECT_FRAME",
      cx,
      thread: cx.thread,
      frame,
    });

    client.fetchAncestorFramePositions(frame.asyncIndex, frame.protocolId);

    dispatch(selectLocation(cx, frame.location));
    dispatch(setFramePositions());

    dispatch(fetchScopes(cx));
  };
}
