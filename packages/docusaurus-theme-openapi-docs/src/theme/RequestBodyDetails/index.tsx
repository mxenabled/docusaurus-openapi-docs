/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

interface RequestBodyDetailsProps {
  children?: React.ReactNode;
  [key: string]: any;
}

export default function RequestBodyDetails({
  children,
  ...props
}: RequestBodyDetailsProps) {
  return (
    <div style={{ margin: "16px 0" }}>
      <h3>Request Body</h3>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "12px",
          backgroundColor: "#f8f9fa",
        }}
      >
        {children}
      </div>
    </div>
  );
}
