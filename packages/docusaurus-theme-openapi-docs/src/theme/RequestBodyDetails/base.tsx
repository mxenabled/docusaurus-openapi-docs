/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import ReactMarkdown from "react-markdown";

import styles from "./styles.module.css";

export type RequestBodyDetailsBaseProps = {
  title?: string;
  description?: string;
  required: boolean;
  children?: React.ReactNode;
};

export default function RequestBodyDetailsBase({
  title = "Request Body",
  description,
  required,
  children,
}: RequestBodyDetailsBaseProps) {
  return (
    <div>
      <div className={styles.flex}>
        <h3 className={styles.h3}>{title}</h3>
        {required ? <span className={styles.required}> required</span> : null}
      </div>
      {description ? (
        <p className={styles.description}>
          <ReactMarkdown>{description}</ReactMarkdown>
        </p>
      ) : null}
      {children}
    </div>
  );
}
