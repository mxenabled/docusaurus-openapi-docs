/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import { sampleResponseFromSchema } from "@mxenabled/docusaurus-plugin-openapi-docs/src/openapi/createResponseExample";
import { ApiItem } from "@mxenabled/docusaurus-plugin-openapi-docs/src/types";
import CodeBlock from "@theme/CodeBlock";
import TabItem from "@theme/TabItem";

import ApiTabs from "../../ApiTabs";
import CodeBlockHeader from "../CodeBlockHeader";

export default function ResponseSample({
  responses,
}: {
  responses: NonNullable<ApiItem>["responses"];
}) {
  if (responses === undefined) {
    return null;
  }

  const statusCodes = Object.keys(responses);
  if (statusCodes.length === 0) {
    return null;
  }
  const responseExamples = Object.entries(responses).reduce(
    (acc, [status, value]) => {
      const { content } = value;

      for (const mimeType in content) {
        // TODO: handle other mime types if needed
        if (mimeType.endsWith("json") && content.hasOwnProperty(mimeType)) {
          const bodyContent = content[mimeType].schema ?? content[mimeType];

          const example = sampleResponseFromSchema(bodyContent);
          acc[status] = example;
        }
      }

      return acc;
    },
    {} as { [key: string]: any }
  ) as { [key: string]: any };

  return (
    <div>
      <ApiTabs title="Response sample">
        {statusCodes.map((code) => {
          const responseCode =
            JSON.stringify(responseExamples[code], null, 2) ??
            responses[code]?.description ??
            "No response body";

          return (
            <TabItem label={code} value={code} key={code}>
              <CodeBlock
                key="json"
                showLineNumbers
                language="json"
                // @ts-ignore
                // LanguageSelector={<CodeBlockHeader code={responseCode} />}
              >
                {responseCode}
              </CodeBlock>
            </TabItem>
          );
        })}
      </ApiTabs>
    </div>
  );
}
