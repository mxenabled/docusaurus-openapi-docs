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
  const dispatch = useDispatch<AppDispatch>();

  if (!ExecutionEnvironment.canUseDOM) {
    return () => {}; // Return a no-op function during SSR
  }
  return dispatch;
};

export const useTypedSelector: TypedUseSelectorHook<RootState> = (selector) => {
  const result = useSelector((state: RootState) => {
    if (!ExecutionEnvironment.canUseDOM) {
      // Return default values during SSR to prevent null store access
      return selector(defaultState);
    }
    return selector(state);
  });

  return result;
};
