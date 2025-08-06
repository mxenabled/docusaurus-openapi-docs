/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

import type { RootState, AppDispatch } from "./store";

export const useTypedDispatch = (): any => {
  if (!ExecutionEnvironment.canUseDOM) {
    return () => {}; // Return a no-op function during SSR
  }
  return useDispatch<AppDispatch>();
};

export const useTypedSelector: TypedUseSelectorHook<RootState> = (selector) => {
  if (!ExecutionEnvironment.canUseDOM) {
    // Return default values during SSR to prevent null store access
    return selector({
      accept: { value: undefined },
      contentType: { value: undefined },
      response: { value: undefined },
      server: { value: undefined, options: [] },
      body: { type: "empty" },
      params: {},
      auth: { selected: undefined, options: {}, data: {} },
    } as RootState);
  }
  return useSelector(selector);
};
