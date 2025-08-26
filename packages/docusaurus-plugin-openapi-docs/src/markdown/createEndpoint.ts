/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { create } from "./utils";
import { ApiPageMetadata } from "../types";

type Method = Pick<ApiPageMetadata, "api">["api"]["method"];
type Path = Pick<ApiPageMetadata, "api">["api"]["path"];

export function createEndpoint(method: Method, path: Path) {
  if (!method || !path) {
    return undefined;
  }

  return create("Endpoint", {
    method,
    path,
  });
}
