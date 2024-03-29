/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import zlib from "zlib";

import React from "react";

import BrowserOnly from "@docusaurus/BrowserOnly";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import { HtmlClassNameProvider } from "@docusaurus/theme-common";
import { DocProvider } from "@docusaurus/theme-common/internal";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useIsBrowser from "@docusaurus/useIsBrowser";
import { createAuth } from "@theme/ApiExplorer/Authorization/slice";
import { createPersistanceMiddleware } from "@theme/ApiExplorer/persistanceMiddleware";
import DocItemLayout from "@theme/ApiItem/Layout";
import type { Props } from "@theme/DocItem";
import DocItemMetadata from "@theme/DocItem/Metadata";
import clsx from "clsx";
import {
  ServerObject,
  ParameterObject,
} from "@mxenabled/docusaurus-plugin-openapi-docs/src/openapi/types";
import type { ApiItem as ApiItemType } from "@mxenabled/docusaurus-plugin-openapi-docs/src/types";
import type {
  DocFrontMatter,
  ThemeConfig,
} from "@mxenabled/docusaurus-theme-openapi-docs/src/types";
import { Provider } from "react-redux";

import { createStoreWithoutState, createStoreWithState } from "./store";

let ApiExplorer = (_: { item: any; infoPath: any; sampleResponses: any }) => (
  <div />
);

if (ExecutionEnvironment.canUseDOM) {
  ApiExplorer = require("@theme/ApiExplorer").default;
}

interface DocFM extends DocFrontMatter {
  readonly api_reference?: boolean;
}

export interface SampleResponses {
  statusCodes: string[];
  responseExamples: { [key: string]: any };
}

interface ApiFrontMatter extends DocFrontMatter {
  readonly api?: ApiItemType;
  readonly sample_responses?: SampleResponses;
}

type MdxComponent = Omit<Props["content"], "frontMatter"> & {
  frontMatter: DocFM;
};

// @ts-ignore
export default function ApiItem(props: Props): React.JSX.Element {
  const docHtmlClassName = `docs-doc-id-${props.content.metadata.id}`;
  const MDXComponent = props.content;
  const { frontMatter, metadata } = MDXComponent as MdxComponent;
  const { title } = metadata;
  const { info_path: infoPath } = frontMatter as DocFM;
  let { api, sample_responses: sampleResponses } =
    frontMatter as ApiFrontMatter;
  // decompress and parse
  if (api) {
    api = JSON.parse(
      zlib.inflateSync(Buffer.from(api as any, "base64")).toString()
    );
  }

  // decompress and parse
  if (sampleResponses) {
    sampleResponses = JSON.parse(
      zlib.inflateSync(Buffer.from(sampleResponses as any, "base64")).toString()
    );
  }

  const { siteConfig } = useDocusaurusContext();
  const themeConfig = siteConfig.themeConfig as ThemeConfig;
  const options = themeConfig.api;
  const isBrowser = useIsBrowser();

  // Regex for 2XX status
  const statusRegex = new RegExp("(20[0-9]|2[1-9][0-9])");

  // Define store2
  let store2: any = {};
  const persistanceMiddleware = createPersistanceMiddleware(options);

  // Init store for SSR
  if (!isBrowser) {
    store2 = createStoreWithoutState({}, [persistanceMiddleware]);
  }

  // Init store for CSR to hydrate components
  if (isBrowser) {
    // Create list of only 2XX response content types to create request samples from
    let acceptArray: any = [];
    for (const [code, content] of Object.entries(api?.responses ?? [])) {
      if (statusRegex.test(code)) {
        acceptArray.push(Object.keys(content.content ?? {}));
      }
    }
    acceptArray = acceptArray.flat();

    const content = api?.requestBody?.content ?? {};
    const contentTypeArray = Object.keys(content);
    const servers = api?.servers ?? [];
    const params = {
      path: [] as ParameterObject[],
      query: [] as ParameterObject[],
      header: [] as ParameterObject[],
      cookie: [] as ParameterObject[],
    };
    api?.parameters?.forEach(
      (param: { in: "path" | "query" | "header" | "cookie" }) => {
        const paramType = param.in;
        const paramsArray: ParameterObject[] = params[paramType];
        paramsArray.push(param as ParameterObject);
      }
    );
    const auth = createAuth({
      security: api?.security,
      securitySchemes: api?.securitySchemes,
      options,
    });
    // TODO: determine way to rehydrate without flashing
    // const acceptValue = window?.sessionStorage.getItem("accept");
    // const contentTypeValue = window?.sessionStorage.getItem("contentType");
    const server = window?.sessionStorage.getItem("server");
    const serverObject = (JSON.parse(server!) as ServerObject) ?? {};

    store2 = createStoreWithState(
      {
        accept: {
          value: acceptArray[0],
          options: acceptArray,
        },
        contentType: {
          value: contentTypeArray[0],
          options: contentTypeArray,
        },
        server: {
          value: serverObject.url ? serverObject : undefined,
          options: servers,
        },
        response: { value: undefined },
        body: { type: "empty" },
        params,
        auth,
      },
      [persistanceMiddleware]
    );
  }

  if (api) {
    return (
      <DocProvider content={props.content}>
        <HtmlClassNameProvider className={docHtmlClassName}>
          <DocItemMetadata />
          <DocItemLayout>
            <Provider store={store2}>
              <h1>{title}</h1>

              <div className={clsx("row", "theme-api-markdown")}>
                <div className="col col--7 openapi-left-panel__container">
                  <MDXComponent />
                </div>
                <div className="col col--5 openapi-right-panel__container">
                  <BrowserOnly fallback={<div>Loading...</div>}>
                    {() => {
                      return (
                        <ApiExplorer
                          item={api}
                          sampleResponses={sampleResponses}
                          infoPath={infoPath}
                        />
                      );
                    }}
                  </BrowserOnly>
                </div>
              </div>
            </Provider>
          </DocItemLayout>
        </HtmlClassNameProvider>
      </DocProvider>
    );
  }

  // Non-API docs
  return (
    <DocProvider content={props.content}>
      <HtmlClassNameProvider className={docHtmlClassName}>
        <DocItemMetadata />
        <DocItemLayout>
          <div className="row">
            <div className="col col--12">
              <MDXComponent />
            </div>
          </div>
        </DocItemLayout>
      </HtmlClassNameProvider>
    </DocProvider>
  );
}
