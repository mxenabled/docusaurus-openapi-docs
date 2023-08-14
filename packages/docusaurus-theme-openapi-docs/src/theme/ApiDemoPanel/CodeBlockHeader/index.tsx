/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import CopyButton from "@theme/CodeBlock/CopyButton";

import styles from "./styles.module.css";

export default function CodeBlockHeader({
  code,
  children = <span className="text-base">JSON</span>,
}: {
  code: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.languageWrapper}>
        <span className={styles.language}>Language:</span>
        {children}
      </div>
      <CopyButton
        // @ts-ignore
        showText
        code={code}
        className={styles.copyButton}
      />
    </div>
  );
}
