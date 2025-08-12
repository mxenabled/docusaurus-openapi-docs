/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "./store";

const defaultState: RootState = {
  accept: { value: undefined },
  contentType: { value: undefined },
  response: { value: undefined },
  server: { value: undefined, options: [] },
  body: { type: "empty" },
  params: {},
  auth: { selected: undefined, options: {}, data: {} },
} as RootState;

export const useTypedDispatch = (): any => {
  // Create a reference that we can update
  let dispatch: any;

  if (ExecutionEnvironment.canUseDOM) {
    // Only call useDispatch when we're in the browser
    // eslint-disable-next-line react-hooks/rules-of-hooks
    dispatch = useDispatch<AppDispatch>();
  } else {
    // Return a no-op function during SSR
    dispatch = () => {};
  }

  return dispatch;
};
export const useTypedSelector: TypedUseSelectorHook<RootState> = (selector) => {
  if (!ExecutionEnvironment.canUseDOM) {
    // Return default values during SSR to prevent null store access
    return selector(defaultState);
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const result = useSelector((state: RootState) => {
    return selector(state);
  });

  return result;
};
