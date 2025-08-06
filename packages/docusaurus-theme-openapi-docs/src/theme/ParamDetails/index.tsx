/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

interface ParamDetailsProps {
  paramType: string;
  params: Array<{
    field: string;
    required?: boolean;
    description?: string;
    type?: string;
  }>;
}

export default function ParamDetails({ paramType, params }: ParamDetailsProps) {
  if (!params || params.length === 0) {
    return null;
  }

  return (
    <div style={{ margin: "16px 0" }}>
      <h3>{paramType} Parameters</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f8f9fa" }}>
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Name
            </th>
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Type
            </th>
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Required
            </th>
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {params.map((param, index) => (
            <tr key={index}>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                <code>{param.field}</code>
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {param.type || "string"}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {param.required ? "✓" : ""}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                {param.description || ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
