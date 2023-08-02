/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React, { useState } from "react";

import styles from "./styles.module.css";

export type RowType = {
  field: string;
  description?: string;
  required: boolean;
  type: string;
  subfields?: RowType[];
};

export type TableProps = {
  data: RowType[];
  isBodyRequired?: boolean;
  isParentTable?: boolean;
};

const Table: React.FC<TableProps> = ({
  data,
  isBodyRequired,
  isParentTable,
}: TableProps) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  // if the body is marked as required and there's only one field, mark it as required
  if (isBodyRequired && !data[0].required && data.length === 1) {
    data[0].required = true;
  }

  const handleRowClick = (field: string) => {
    setExpandedRows((prevExpandedRows: string[]) =>
      prevExpandedRows.includes(field)
        ? prevExpandedRows.filter((row) => row !== field)
        : [...prevExpandedRows, field]
    );
  };

  const renderRow = (row: RowType) => {
    const isExpanded = expandedRows.includes(row.field);
    const hasSubfields = row.subfields && row.subfields.length;

    return (
      <React.Fragment key={row.field}>
        <tr onClick={() => row.subfields && handleRowClick(row.field)}>
          <td>
            {hasSubfields && (
              <span
                style={{
                  marginRight: "5px",
                  transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  display: "inline-block",
                  width: "10px",
                }}
              >
                &#8250;
              </span>
            )}
            {row.field}
          </td>
          <td>{row.description}</td>
          <td>{row.required ? "Yes" : "No"}</td>
          <td>{row.type}</td>
        </tr>
        {isExpanded && row.subfields && (
          <tr>
            <td colSpan={4}>
              <Table data={row.subfields} />
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  return (
    <table className={isParentTable ? styles.parentTable : ""}>
      <thead>
        <tr>
          <th>Field</th>
          <th>Description</th>
          <th>Required</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>{data.map(renderRow)}</tbody>
    </table>
  );
};

export default Table;
