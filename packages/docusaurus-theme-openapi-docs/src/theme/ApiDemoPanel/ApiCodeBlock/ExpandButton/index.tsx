/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React, { useEffect } from "react";

import { usePrismTheme } from "@docusaurus/theme-common";
import { translate } from "@docusaurus/Translate";
// @ts-ignore
import Container from "@theme/ApiExplorer/ApiCodeBlock/Container";
// @ts-ignore
import CopyButton from "@theme/ApiExplorer/ApiCodeBlock/CopyButton";
// @ts-ignore
import ExitButton from "@theme/ApiExplorer/ApiCodeBlock/ExitButton";
// @ts-ignore
import Line from "@theme/ApiExplorer/ApiCodeBlock/Line";
import clsx from "clsx";
import { Highlight, type Language } from "prism-react-renderer";
import Modal from "react-modal";

interface Props {
  code: string;
  className: string;
  language: Language;
  showLineNumbers: boolean;
  blockClassName: string;
  title: string;
  lineClassNames: string[];
}

export default function ExpandButton({
  code,
  className,
  language,
  showLineNumbers,
  blockClassName,
  title,
  lineClassNames,
}: Props): React.JSX.Element {
  const prismTheme = usePrismTheme();

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const [modalIsOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    Modal.setAppElement("body");
  });

  return (
    <>
      <button
        type="button"
        aria-label={
          modalIsOpen
            ? translate({
                id: "theme.CodeBlock.expanded",
                message: "Expanded",
                description: "The expanded button label on code blocks",
              })
            : translate({
                id: "theme.CodeBlock.expandButtonAriaLabel",
                message: "Expand code to fullscreen",
                description: "The ARIA label for expand code blocks button",
              })
        }
        title={translate({
          id: "theme.CodeBlock.expand",
          message: "Expand",
          description: "The expand button label on code blocks",
        })}
        className={clsx(
          "clean-btn",
          className,
          "openapi-explorer__code-block-expand-btn",
          modalIsOpen && "openapi-explorer__code-block-expand-btn--copied"
        )}
        onClick={openModal}
      >
        <span
          className="openapi-explorer__code-block-expand-btn-icons"
          aria-hidden="true"
        >
          <svg
            className="openapi-explorer__code-block-expand-btn-icon"
            viewBox="0 0 448 512"
          >
            <path d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64V352zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H320zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352z" />
          </svg>
          <svg
            className="openapi-explorer__code-block-expand-btn-icon--success"
            viewBox="0 0 24 24"
          >
            <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
          </svg>
        </span>
      </button>
      <Modal
        className="openapi-explorer__expand-modal-content"
        overlayClassName="openapi-explorer__expand-modal-overlay"
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Code Snippet"
      >
        <Container
          as="div"
          className={clsx(
            "openapi-explorer__code-block-container",
            language &&
              !blockClassName.includes(`language-${language}`) &&
              `language-${language}`
          )}
        >
          {title && (
            <div className="openapi-explorer__code-block-title">{title}</div>
          )}
          <div className="openapi-explorer__code-block-content">
            <Highlight
              theme={prismTheme}
              code={code}
              language={language ?? "text"}
            >
              {({ className, tokens, getLineProps, getTokenProps }) => (
                <pre
                  /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
                  tabIndex={0}
                  className={clsx(
                    className,
                    "openapi-explorer__code-block",
                    "thin-scrollbar"
                  )}
                >
                  <code
                    className={clsx(
                      "openapi-explorer__code-block-lines",
                      showLineNumbers &&
                        "openapi-explorer__code-block-lines-numbers"
                    )}
                  >
                    {tokens.map((line, i) => (
                      <Line
                        key={i}
                        line={line}
                        getLineProps={getLineProps}
                        getTokenProps={getTokenProps}
                        classNames={lineClassNames}
                        showLineNumbers={showLineNumbers}
                      />
                    ))}
                  </code>
                </pre>
              )}
            </Highlight>
            <div className="openapi-explorer__code-block-btn-group">
              <CopyButton
                className="openapi-explorer__code-block-code-btn"
                code={code}
              />
              <ExitButton
                className="openapi-dmeo__code-block-code-btn"
                handler={closeModal}
              />
            </div>
          </div>
        </Container>
      </Modal>
    </>
  );
}
