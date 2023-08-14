/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import Table from "../SchemaTable";
import type { RowType } from "../SchemaTable";
import RequestBodyDetailsBase from "./base";
import type { RequestBodyDetailsBaseProps } from "./base";

type RequestBodyDetailsProps = Pick<
  RequestBodyDetailsBaseProps,
  "title" | "description" | "required"
> & {
  data: RowType[];
};

export default function RequestBodyDetails({
  title = "Request Body",
  description,
  required,
  data,
}: RequestBodyDetailsProps) {
  console.log("data: ", data);
  return (
    <RequestBodyDetailsBase
      title={title}
      description={description}
      required={required}
    >
      <Table data={data} isBodyRequired={required} isParentTable />
    </RequestBodyDetailsBase>
  );
}
