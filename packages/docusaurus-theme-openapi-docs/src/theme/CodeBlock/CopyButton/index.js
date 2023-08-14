import React, { useCallback, useState, useRef, useEffect } from "react";
import clsx from "clsx";
// @ts-expect-error: TODO, we need to make theme-classic have type: module
import copy from "copy-text-to-clipboard";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

export default function CopyButton({ code, showText = false, className }) {
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeout = useRef(undefined);

  const handleCopyCode = useCallback(() => {
    copy(code);
    setIsCopied(true);
    copyTimeout.current = window.setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }, [code]);

  useEffect(() => () => window.clearTimeout(copyTimeout.current), []);

  return (
    <button
      type="button"
      aria-label={
        isCopied
          ? translate({
              id: "theme.CodeBlock.copied",
              message: "Copied",
              description: "The copied button label on code blocks",
            })
          : translate({
              id: "theme.CodeBlock.copyButtonAriaLabel",
              message: "Copy code to clipboard",
              description: "The ARIA label for copy code blocks button",
            })
      }
      title={translate({
        id: "theme.CodeBlock.copy",
        message: "Copy",
        description: "The copy button label on code blocks",
      })}
      className={clsx(
        "clean-btn",
        "flex items-center",
        className,
        styles.copyButton,
        isCopied && styles.copyButtonCopied
      )}
      onClick={handleCopyCode}
    >
      {showText ? (
        <span className="font-semibold text-base mr-2">Copy</span>
      ) : null}
      <span className={styles.copyButtonIcons} aria-hidden="true">
        <svg
          className={styles.copyButtonIcon}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5.5 0C5.22386 0 5 0.223858 5 0.5V2.79167C5 3.06781 5.22386 3.29167 5.5 3.29167C5.77614 3.29167 6 3.06781 6 2.79167V1H14V11H12.25C11.9739 11 11.75 11.2239 11.75 11.5C11.75 11.7761 11.9739 12 12.25 12H14.5C14.7761 12 15 11.7761 15 11.5V0.5C15 0.223858 14.7761 0 14.5 0H5.5Z" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.5 4C1.22386 4 1 4.22386 1 4.5V15.5C1 15.7761 1.22386 16 1.5 16H10.5C10.7761 16 11 15.7761 11 15.5V4.5C11 4.22386 10.7761 4 10.5 4H1.5ZM2 15V5H10V15H2Z"
          />
        </svg>
        <svg
          className={styles.copyButtonSuccessIcon}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.8686 4.18867C13.1326 3.93201 13.5547 3.93796 13.8113 4.20195C14.068 4.46594 14.062 4.88801 13.7981 5.14466L6.94091 11.8113C6.68216 12.0629 6.27022 12.0629 6.01147 11.8113L2.20195 8.10763C1.93796 7.85097 1.93201 7.4289 2.18867 7.16491C2.44533 6.90092 2.8674 6.89498 3.13139 7.15163L6.47619 10.4035L12.8686 4.18867Z"
          />
        </svg>
      </span>
    </button>
  );
}
