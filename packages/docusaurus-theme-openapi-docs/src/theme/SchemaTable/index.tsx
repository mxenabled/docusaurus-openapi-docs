/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

interface SchemaTableProps {
  children?: React.ReactNode;
  [key: string]: any;
}

export default function SchemaTable({ children, ...props }: SchemaTableProps) {
  return (
    <div style={{ margin: "16px 0" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", ...props.style }}
      >
        {children}
      </table>
    </div>
  );
}
