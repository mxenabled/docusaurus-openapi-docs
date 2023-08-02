/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import CopyButton from "@theme/CodeBlock/CopyButton";
import clsx from "clsx";

import styles from "./styles.module.css";

type EndpointProps = {
  method: string;
  path: string;
};

export default function Endpoint({ method, path }: EndpointProps) {
  return (
    <div className={styles.container}>
      <div className={styles.textWrapper}>
        <div className={clsx(styles.method, styles[method])}>
          {method.toUpperCase()}
        </div>
        <div className={styles.path}>{path}</div>
      </div>

      <div className={styles.copyButtonContainer}>
        <CopyButton
          // @ts-ignore
          showText
          code={path}
          className={styles.copyButton}
        />
      </div>
    </div>
  );
}
