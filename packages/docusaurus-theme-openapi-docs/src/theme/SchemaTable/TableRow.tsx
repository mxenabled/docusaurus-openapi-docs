/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import clsx from "clsx";

import type { RowType } from "./";
import styles from "./styles.module.css";
import { TBody } from "./TableBody";

type TRProps = {
  row: RowType;
  index: number;
  subfieldLevel: number;
};

export function TR({ row, index, subfieldLevel }: TRProps) {
  return (
    <tr
      className={clsx(styles.tr)}
      style={{
        backgroundColor:
          subfieldLevel % 2 ? "var(--ifm-color-secondary-lighter)" : "#fff",
        borderBottom: subfieldLevel ? "none" : "var(--ifm-table-border-width)",
      }}
    >
      <td
        colSpan={3}
        className={clsx(styles.TableRowTd)}
        style={{
          backgroundColor:
            subfieldLevel % 2 ? "var(--ifm-color-secondary-lighter)" : "#fff",
        }}
      >
        <table className={clsx(styles.table, styles.TableRowTable)}>
          <thead hidden>
            <tr>
              <th className={styles.fieldTh}>Field</th>
              <th className={styles.requiredTh}>Required</th>
              <th className={styles.typeTh}>Type</th>
            </tr>
          </thead>
          <TBody tableData={row.subfields!} subfieldLevel={subfieldLevel} />
        </table>
      </td>
    </tr>
  );
}
