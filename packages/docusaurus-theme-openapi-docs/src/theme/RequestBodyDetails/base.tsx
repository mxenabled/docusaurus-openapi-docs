/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

interface RequestBodyDetailsBaseProps {
  children?: React.ReactNode;
  [key: string]: any;
}

export default function RequestBodyDetailsBase({
  children,
  ...props
}: RequestBodyDetailsBaseProps) {
  return <div style={{ margin: "8px 0" }}>{children}</div>;
}
