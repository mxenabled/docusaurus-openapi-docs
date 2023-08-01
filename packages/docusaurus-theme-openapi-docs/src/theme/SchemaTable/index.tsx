/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import styles from "./styles.module.css";
import { TBody } from "./TableBody";

export type RowType = {
  field: string;
  description?: string;
  required: boolean;
  type: string;
  subfields?: RowType[];
};

const initialData: RowType[] = [
  {
    field: "name",
    description:
      "User's name. I am a really long description so that this will wrap onto the next line.",
    required: true,
    type: "Name",
    subfields: [
      {
        field: "first",
        description: "First name",
        required: true,
        type: "string",
      },
      {
        field: "last",
        description: "Last name",
        required: true,
        type: "string",
      },
    ],
  },
  {
    field: "age",
    description: "User's age, in years",
    required: true,
    type: "number",
  },
  {
    field: "email",
    description: "User's email address",
    required: true,
    type: "string",
  },
  {
    field: "address",
    description: "User's home address",
    required: false,
    type: "Address",
    subfields: [
      {
        field: "street",
        description: "User's street address",
        required: true,
        type: "Street",
        subfields: [
          {
            field: "address 1",
            description: "First line of street address",
            required: true,
            type: "string",
          },
          {
            field: "address 2",
            description: "Second line of street address",
            required: false,
            type: "string",
          },
        ],
      },
      {
        field: "city",
        description: "City of the home address",
        required: true,
        type: "string",
      },
      {
        field: "state",
        description: "State of the home address",
        required: true,
        type: "string",
      },
      {
        field: "zip",
        description: "Postal code of the home address",
        required: true,
        type: "string",
      },
    ],
  },
  {
    field: "phone",
    description: "User's phone number",
    required: false,
    type: "string",
  },
];

type TableProps = {
  data?: RowType[];
  isBodyRequired?: boolean;
};

const Table = ({ data = initialData, isBodyRequired }: TableProps) => {
  // if the body is marked as required and there's only one field, mark it as required
  if (isBodyRequired && !data[0].required && data.length === 1) {
    data[0].required = true;
  }

  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>
          <th className={styles.fieldTh}>Field</th>
          <th className={styles.requiredTh}>Required</th>
          <th className={styles.typeTh}>Type</th>
        </tr>
      </thead>

      <TBody tableData={data} className="relative" />
    </table>
  );
};

export default Table;
