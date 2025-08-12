/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

interface EndpointProps {
  method: string;
  path: string;
}

export default function Endpoint({ method, path }: EndpointProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "4px",
        padding: "8px 12px",
        margin: "16px 0",
        backgroundColor: "#f8f9fa",
      }}
    >
      <span
        style={{
          backgroundColor: method === "get" ? "#28a745" : "#007bff",
          color: "white",
          padding: "2px 8px",
          borderRadius: "3px",
          fontSize: "12px",
          fontWeight: "bold",
          textTransform: "uppercase",
          marginRight: "8px",
        }}
      >
        {method}
      </span>
      <code>{path}</code>
    </div>
  );
}
