/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import Table from "../Table";
import type { TableProps } from "../Table";
import styles from "./styles.module.css";

type ParamDetailsProps = {
  paramType: string;
  params: TableProps["data"];
};

export default function ParamDetails({ paramType, params }: ParamDetailsProps) {
  return (
    <div>
      <h3 className={styles.heading}>{paramType} Parameters</h3>
      <Table data={params} isParentTable />
    </div>
  );
}
