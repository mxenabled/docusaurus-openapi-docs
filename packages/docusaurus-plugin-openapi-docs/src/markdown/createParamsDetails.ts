/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { ApiItem } from "../types";
// import { createDetails } from "./createDetails";
// import { createDetailsSummary } from "./createDetailsSummary";
import { create } from "./utils";

interface Props {
  parameters: ApiItem["parameters"];
  type: "path" | "query" | "header" | "cookie";
}

export function createParamsDetails({ parameters, type }: Props) {
  // if (parameters === undefined) {
  //   return undefined;
  // }
  // const params = parameters.filter((param) => param?.in === type);
  // if (params.length === 0) {
  //   return undefined;
  // }

  // return createDetails({
  //   "data-collapsed": false,
  //   open: true,
  //   style: { marginBottom: "1rem" },
  //   children: [
  //     createDetailsSummary({
  //       children: [
  //         create("strong", {
  //           children: `${
  //             type.charAt(0).toUpperCase() + type.slice(1)
  //           } Parameters`,
  //         }),
  //       ],
  //     }),
  //     create("div", {
  //       children: [
  //         create("ul", {
  //           children: params.map((param) =>
  //             create("ParamsItem", {
  //               className: "paramsItem",
  //               param: param,
  //             })
  //           ),
  //         }),
  //       ],
  //     }),
  //   ],
  // });

  if (parameters === undefined) {
    return undefined;
  }
  const params = parameters.filter((param) => param?.in === type);
  if (params.length === 0) {
    return undefined;
  }

  // uppercase first letter
  const paramType = type.charAt(0).toUpperCase() + type.slice(1);

  const normalizedParams = params.map((param) => {
    const { description, name, required, schema } = param;

    let type = null;
    if (schema?.type) {
      // uppercase first letter
      type = schema.type.charAt(0).toUpperCase() + schema.type.slice(1);
    }

    return {
      field: name,
      required,
      description,
      type,
    };
  });

  return create("ParamDetails", {
    paramType,
    params: normalizedParams,
  });
}
