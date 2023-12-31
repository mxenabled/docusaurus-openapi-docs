/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React, { Fragment, useState } from "react";

import clsx from "clsx";
import ReactMarkdown from "react-markdown";

import type { RowType } from "./";
import styles from "./styles.module.css";
import { TR } from "./TableRow";

const PADDING_LEFT = 12;

interface TBodyProps extends React.HTMLProps<HTMLTableSectionElement> {
  tableData: RowType[];
  subfieldLevel?: number;
}

export function TBody({ tableData, subfieldLevel = 0, ...props }: TBodyProps) {
  const [openRows, setOpenRows] = useState<number[]>([]);

  const toggleRow = (index: number) => {
    if (openRows.includes(index)) {
      setOpenRows(openRows.filter((i) => i !== index));
    } else {
      setOpenRows([...openRows, index]);
    }
  };

  return (
    <tbody {...props} className={clsx(styles.tbody, props?.className)}>
      {tableData.map((row, index) => {
        const isSubfieldTableOpen = openRows.includes(index);
        // const hasPossibleValues =
        //   row.schema?.oneOf || row.schema?.anyOf || row.schema?.enum;

        const qualifierMessage = row?.qualifierMessage
          ? `${row.qualifierMessage}\n`
          : "";

        // const enumValues = getEnumRows(row);
        // if (enumValues.length) {
        //   console.log({ enumValues });
        // }
        return (
          <Fragment key={row.field}>
            <tr
              className={clsx(
                styles.tr,
                !subfieldLevel &&
                  index === tableData.length - 1 &&
                  styles.hasBottomBorder
              )}
              style={{
                backgroundColor:
                  subfieldLevel % 2
                    ? "var(--ifm-color-secondary-lighter)"
                    : "#fff",
              }}
              onClick={() => row.subfields && toggleRow(index)}
            >
              <td
                className={clsx(styles.fieldTh, styles.td)}
                style={{
                  paddingLeft: `${(subfieldLevel + 1) * PADDING_LEFT}px`,
                }}
              >
                <span className="font-semibold">{row.field}</span>
                {row.description ? (
                  <ReactMarkdown className="mt-1 text-xs">
                    {`${qualifierMessage}${row.description}`}
                  </ReactMarkdown>
                ) : null}

                {row.subfields ? (
                  <button
                    className={clsx(
                      "button",
                      "button--secondary",
                      styles.subfieldButton
                    )}
                  >
                    <Chevron
                      className={clsx(styles.subfieldButtonIcon)}
                      style={{
                        transform: `rotate(${
                          isSubfieldTableOpen ? "0deg" : "180deg"
                        })`,
                      }}
                    />
                    {isSubfieldTableOpen ? "Hide" : "View"} subfields
                  </button>
                ) : null}
              </td>
              <td className={styles.requiredTh}>
                <Required isRequired={row.required} />
              </td>
              <td className={clsx(styles.typeTh, styles.tdType)}>
                {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
              </td>
            </tr>

            {row.subfields &&
              (isSubfieldTableOpen ? (
                <TR row={row} index={index} subfieldLevel={subfieldLevel + 1} />
              ) : null)}
          </Fragment>
        );
      })}
    </tbody>
  );
}

function Required({ isRequired }: { isRequired: boolean }) {
  return (
    <div
      className={clsx(styles.requiredBubble, isRequired && styles.isRequired)}
    >
      <span>{isRequired ? "Required" : "Optional"}</span>
    </div>
  );
}

function Chevron(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="rgba(0,0,0,0.5)"
        d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
      ></path>
    </svg>
  );
}

// function getEnumRows(row: RowType) {
//   if (!row.schema) {
//     return [];
//   }

//   const enumValues = row.schema!.enum;

//   if (!enumValues) {
//     return [];
//   }

//   const enumRows = enumValues.map((value, index) => {
//     return {
//       field: value,
//       type: row.type,
//     };
//   });
//   return enumRows;
// }

// function getOneOfRows(row: RowType) {
//   if (!row.schema) {
//     return [];
//   }

//   const oneOfValues = row.schema!.oneOf;

//   if (!oneOfValues) {
//     return [];
//   }

//   const oneOfRows = oneOfValues.map((value, index) => {
//     const types = value.allOf;
//     let subfields: RowType[] = [];

//     if (types && types.length > 1) {
//       subfields = types.slice(1).map((subfield) => {
//         // TODO: get row info
//       });
//     }

//     let type = row.type;

//     if (types && types.length && typeof types[0] === "string") {
//       type = types[0];
//     }

//     return {
//       field: value.title,
//       type,
//       description: value?.description,
//       subfields,
//     };
//   });
//   return oneOfRows;
// }
