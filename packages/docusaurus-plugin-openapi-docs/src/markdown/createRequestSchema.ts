/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { MediaTypeObject, SchemaObject } from "../openapi/types";
import { createDescription } from "./createDescription";
import { createNodes } from "./createSchema";
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

export function createRequestSchema({ title, body, ...rest }: Props) {
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

  if (mimeTypes && mimeTypes.length > 1) {
    return create("MimeTabs", {
      schemaType: "request",
      children: mimeTypes.map((mimeType) => {
        const firstBody = body.content![mimeType].schema;
        const requestBodyProps = {
          title,
          description: body.description
            ? createDescription(body.description)
            : null,
          required: body.required,
        };

        const requestBodyDetails = getRequestBody(firstBody, requestBodyProps);

        return create("TabItem", {
          label: mimeType,
          value: `${mimeType}`,
          children: [requestBodyDetails],
        });
      }),
    });
  }

  const randomFirstKey = Object.keys(body.content)[0];
  const firstBody =
    body.content[randomFirstKey].schema ?? body.content![randomFirstKey];
  const requestBodyProps = {
    title,
    description: body.description ? createDescription(body.description) : null,
    required: body.required,
  };

  return getRequestBody(firstBody, requestBodyProps);
}

export function hasProperties(obj: any): obj is SchemaObject {
  return obj && obj.properties !== undefined;
}

export function getRequestBody(
  firstBody: MediaTypeObject | SchemaObject | undefined,
  requestBodyProps: {
    title: string;
    description: string | null;
    required: boolean | string[] | undefined;
  }
) {
  if (firstBody === undefined) {
    return undefined;
  }

  // we don't show the table if there is no properties to show
  if (hasProperties(firstBody) && firstBody.properties !== undefined) {
    if (Object.keys(firstBody.properties).length === 0) {
      return undefined;
    }
  }

  let nodes = createNodes(firstBody);

  if (typeof nodes === "string") {
    const content = nodes.trim();
    return (
      create("RequestBodyDetailsBase", requestBodyProps) + `\n\n${content}\n\n`
    );
  }

  if (!Array.isArray(nodes)) {
    nodes = [nodes];
  }

  return create("RequestBodyDetails", {
    ...requestBodyProps,
    data: nodes.filter(Boolean), // filter out any null or undefined values,
  });
}
