/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import { createDescription } from "@mxenabled/docusaurus-theme-openapi-docs/lib/markdown/createDescription";
import {
  getQualifierMessage,
  getSchemaName,
} from "@mxenabled/docusaurus-theme-openapi-docs/lib/markdown/schema";
import {
  guard,
  toString,
} from "@mxenabled/docusaurus-theme-openapi-docs/lib/markdown/utils";
import CodeBlock from "@theme/CodeBlock";
import SchemaTabs from "@theme/SchemaTabs";
import TabItem from "@theme/TabItem";
/* eslint-disable import/no-extraneous-dependencies*/
/* eslint-disable import/no-extraneous-dependencies*/
/* eslint-disable import/no-extraneous-dependencies*/
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import styles from "./styles.module.css";

function ParamsItem({
  param: { description, example, examples, name, required, schema },
}) {
  if (!schema || !schema?.type) {
    schema = { type: "any" };
  }

  const renderSchemaName = guard(schema, (schema) => (
    <span className={styles.schemaName}> {getSchemaName(schema)}</span>
  ));

  const renderSchemaRequired = guard(required, () => (
    <strong className={styles.paramsRequired}> required</strong>
  ));

  const renderSchema = guard(getQualifierMessage(schema), (message) => (
    <div>
      <ReactMarkdown
        children={createDescription(message)}
        rehypePlugins={[rehypeRaw]}
      />
    </div>
  ));

  const renderDescription = guard(description, (description) => (
    <div>
      <ReactMarkdown
        children={createDescription(description)}
        components={{
          pre: "div",
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            if (inline) return <code>{children}</code>;
            return !inline && match ? (
              <CodeBlock className={className}>{children}</CodeBlock>
            ) : (
              <CodeBlock>{children}</CodeBlock>
            );
          },
        }}
        rehypePlugins={[rehypeRaw]}
      />
    </div>
  ));

  const renderDefaultValue = guard(
    schema && schema.items
      ? schema.items.default
      : schema
      ? schema.default
      : undefined,
    (value) => (
      <div>
        <ReactMarkdown children={`**Default value:** \`${value}\``} />
      </div>
    )
  );

  const renderExample = guard(toString(example), (example) => (
    <div>
      <strong>Example: </strong>
      {example}
    </div>
  ));

  const renderExamples = guard(examples, (examples) => {
    const exampleEntries = Object.entries(examples);
    return (
      <>
        <strong>Examples:</strong>
        <SchemaTabs>
          {exampleEntries.map(([exampleName, exampleProperties]) => (
            <TabItem value={exampleName} label={exampleName}>
              {exampleProperties.summary && <p>{exampleProperties.summary}</p>}
              {exampleProperties.description && (
                <p>
                  <strong>Description: </strong>
                  <span>{exampleProperties.description}</span>
                </p>
              )}
              <p>
                <strong>Example: </strong>
                <code>{exampleProperties.value}</code>
              </p>
            </TabItem>
          ))}
        </SchemaTabs>
      </>
    );
  });

  return (
    <div className={styles.paramsItem}>
      <strong>{name}</strong>
      {renderSchemaName}
      {renderSchemaRequired}
      {renderSchema}
      {renderDefaultValue}
      {renderDescription}
      {renderExample}
      {renderExamples}
    </div>
  );
}

export default ParamsItem;
