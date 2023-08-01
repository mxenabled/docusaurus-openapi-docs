/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import Table from "../SchemaTable";
import type { RowType } from "../SchemaTable";
import styles from "./styles.module.css";

type Props = {
  title?: string;
  description?: string;
  required: boolean;
  data: RowType[];
};

export default function RequestBodyDetails({
  title = "Request Body",
  description,
  required,
  data,
}: Props) {
  console.log("data: ", data);
  return (
    <div>
      <div className={styles.flex}>
        <h3 className={styles.h3}>{title}</h3>
        {required ? <span className={styles.required}> required</span> : null}
      </div>
      {description ? <p className={styles.description}>{description}</p> : null}
      <Table data={data} isBodyRequired={required} />
    </div>
  );
}
