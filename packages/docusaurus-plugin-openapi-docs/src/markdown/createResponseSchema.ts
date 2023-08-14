/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { MediaTypeObject } from "../openapi/types";
import { createDescription } from "./createDescription";
// import { createDetails } from "./createDetails";
// import { createDetailsSummary } from "./createDetailsSummary";
import { getRequestBody as getResponseBody } from "./createRequestSchema";
// import { createNodes } from "./createSchema";
// import {
//   createExampleFromSchema,
//   createResponseExample,
//   createResponseExamples,
// } from "./createStatusCodes";
import { create } from "./utils";

interface Props {
  style?: any;
  title: string;
  body: {
    content?: {
      [key: string]: MediaTypeObject;
    };
    description?: string;
    required?: string[] | boolean;
  };
}

export function createResponseSchema({ title, body, ...rest }: Props) {
  if (
    body === undefined ||
    body.content === undefined ||
    Object.keys(body).length === 0 ||
    Object.keys(body.content).length === 0
  ) {
    return undefined;
  }

  // Get all MIME types, including vendor-specific
  const mimeTypes = Object.keys(body.content);

  if (mimeTypes && mimeTypes.length) {
    return create("MimeTabs", {
      schemaType: "response",
      children: mimeTypes.map((mimeType: any) => {
        const responseExamples = body.content![mimeType].examples;
        const responseExample = body.content![mimeType].example;
        const firstBody =
          body.content![mimeType].schema ?? body.content![mimeType];

        if (
          firstBody === undefined &&
          responseExample === undefined &&
          responseExamples === undefined
        ) {
          return undefined;
        }

        const responseBody = getResponseBody(firstBody, {
          title,
          description: body.description
            ? createDescription(body.description)
            : null,
          required: false,
        });

        if (responseBody === undefined) {
          return undefined;
        }

        return create("TabItem", {
          label: `${mimeType}`,
          value: `${mimeType}`,
          children: [
            responseBody,
            // create("SchemaTabs", {
            // TODO: determine if we should persist this
            // groupId: "schema-tabs",
            // children: [
            // firstBody &&
            //   create("TabItem", {
            //     label: `${title}`,
            //     value: `${title}`,
            //     children: [responseBody],
            //   }),
            // firstBody && createExampleFromSchema(firstBody, mimeType),
            // responseExamples &&
            //   createResponseExamples(responseExamples, mimeType),
            // responseExample &&
            //   createResponseExample(responseExample, mimeType),
            // ],
            // }),
          ],
        });
      }),
    });
  }

  return undefined;
}
