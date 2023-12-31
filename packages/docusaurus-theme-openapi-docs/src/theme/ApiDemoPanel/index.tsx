/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import { ApiItem } from "@mxenabled/docusaurus-plugin-openapi-docs/src/types";
import sdk from "@paloaltonetworks/postman-collection";
import Curl from "@theme/ApiDemoPanel/Curl";
// import MethodEndpoint from "@theme/ApiDemoPanel/MethodEndpoint";
// import Request from "@theme/ApiDemoPanel/Request";
// import Response from "@theme/ApiDemoPanel/Response";
// import SecuritySchemes from "@theme/ApiDemoPanel/SecuritySchemes";

import ResponseSample from "./ResponseSample";

function ApiDemoPanel({
  item,
}: // infoPath,
{
  item: NonNullable<ApiItem>;
  // infoPath: string;
}) {
  const postman = new sdk.Request(item.postman);
  // const { path, method } = item;

  return (
    <div>
      {/* <MethodEndpoint method={method} path={path} /> */}
      {/* <SecuritySchemes infoPath={infoPath} />
      <Request item={item} />
      <Response /> */}
      <div>
        <h3>Request sample</h3>
        <Curl
          postman={postman}
          codeSamples={(item as any)["x-code-samples"] ?? []}
          jsonRequestBodyExample={item.jsonRequestBodyExample}
        />
      </div>

      <ResponseSample responses={item.responses} />
    </div>
  );
}

export default ApiDemoPanel;
