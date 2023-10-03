/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React, {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";

import useIsBrowser from "@docusaurus/useIsBrowser";
import { duplicates } from "@mxenabled/docusaurus-theme-common";
import type { Props as TabItemProps } from "@theme/TabItem";
import clsx from "clsx";

import styles from "./styles.module.css"; // A very rough duck type, but good enough to guard against mistakes while

type TabItemElement = React.ReactElement<TabItemProps>;

const {
  useScrollPositionBlocker,
  useTabGroupChoice,
} = require("@mxenabled/docusaurus-theme-common/internal");

// allowing customization

function isTabItem(comp: React.ReactElement) {
  return typeof comp.props.value !== "undefined";
}

type ApiTabsProps = {
  lazy?: boolean;
  block?: boolean;
  defaultValue?: string | null;
  values?: Array<{
    value: string;
    label?: string;
    attributes?: Record<string, unknown>;
  }>;
  groupId?: string;
  className?: string;
  title?: string;
  children: React.ReactNode;
};

function ApiTabsComponent(props: ApiTabsProps) {
  const {
    lazy,
    block,
    defaultValue: defaultValueProp,
    values: valuesProp,
    groupId,
    className,
    title,
  } = props;
  const children = Children.map(props.children, (child) => {
    if (isValidElement(child) && isTabItem(child)) {
      return child;
    } // child.type.name will give non-sensical values in prod because of
    // minification, but we assume it won't throw in prod.

    throw new Error(
      `Docusaurus error: Bad <Tabs> child <${
        // @ts-expect-error: guarding against unexpected cases
        typeof child.type === "string" ? child.type : child.type.name
      }>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`
    );
  }) as TabItemElement[];

  if (!children || !children.length) {
    throw new Error(
      "Docusaurus error: <Tabs> should have at least one <TabItem> child."
    );
  }

  const values =
    valuesProp ?? // We only pick keys that we recognize. MDX would inject some keys by default
    children.map(({ props: { value, label, attributes } }) => ({
      value,
      label,
      attributes,
    }));
  const dup = duplicates(values, (a, b) => a.value === b.value);

  if (dup.length > 0) {
    throw new Error(
      `Docusaurus error: Duplicate values "${dup
        .map((a) => a.value)
        .join(", ")}" found in <Tabs>. Every value needs to be unique.`
    );
  } // When defaultValueProp is null, don't show a default tab

  const defaultValue =
    defaultValueProp === null
      ? defaultValueProp
      : defaultValueProp ??
        children.find((child) => child.props.default)?.props.value ??
        children[0]?.props.value;

  if (defaultValue !== null && !values.some((a) => a.value === defaultValue)) {
    throw new Error(
      `Docusaurus error: The <Tabs> has a defaultValue "${defaultValue}" but none of its children has the corresponding value. Available values are: ${values
        .map((a) => a.value)
        .join(
          ", "
        )}. If you intend to show no default tab, use defaultValue={null} instead.`
    );
  }

  const { tabGroupChoices, setTabGroupChoices } = useTabGroupChoice();
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const tabRefs: Array<HTMLLIElement> = [];
  const { blockElementScrollPositionUntilNextRender } =
    useScrollPositionBlocker();

  if (groupId != null) {
    const relevantTabGroupChoice = tabGroupChoices[groupId];

    if (
      relevantTabGroupChoice != null &&
      relevantTabGroupChoice !== selectedValue &&
      values.some((value) => value.value === relevantTabGroupChoice)
    ) {
      setSelectedValue(relevantTabGroupChoice);
    }
  }

  const handleTabChange = (
    event: React.FocusEvent<HTMLLIElement> | React.MouseEvent<HTMLLIElement>
  ) => {
    const newTab = event.currentTarget;
    const newTabIndex = tabRefs.indexOf(newTab);
    const newTabValue = values[newTabIndex].value;

    if (newTabValue !== selectedValue) {
      blockElementScrollPositionUntilNextRender(newTab);
      setSelectedValue(newTabValue);

      if (groupId != null) {
        setTabGroupChoices(groupId, newTabValue);
      }
    }
  };

  const handleKeydown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    let focusElement = null;

    switch (event.key) {
      case "ArrowRight": {
        const nextTab = tabRefs.indexOf(event.currentTarget) + 1;
        focusElement = tabRefs[nextTab] || tabRefs[0];
        break;
      }

      case "ArrowLeft": {
        const prevTab = tabRefs.indexOf(event.currentTarget) - 1;
        focusElement = tabRefs[prevTab] || tabRefs[tabRefs.length - 1];
        break;
      }

      default:
        break;
    }

    if (focusElement) {
      focusElement.focus();
    }
  };

  const tabItemListContainerRef = useRef<HTMLUListElement>(null);
  const [showTabArrows, setShowTabArrows] = useState(false);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const targetElement = entry.target as HTMLElement;

        if (targetElement.offsetWidth < targetElement.scrollWidth) {
          setShowTabArrows(true);
        } else {
          setShowTabArrows(false);
        }
      }
    });

    if (tabItemListContainerRef.current) {
      resizeObserver.observe(tabItemListContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleRightClick = () => {
    if (tabItemListContainerRef.current) {
      tabItemListContainerRef.current.scrollLeft += 90;
    }
  };

  const handleLeftClick = () => {
    if (tabItemListContainerRef.current) {
      tabItemListContainerRef.current.scrollLeft -= 90;
    }
  };

  return (
    <div className="tabs__container">
      <div className={styles.responseTabsTopSection}>
        <h3>{title ?? "Response"}</h3>
        <div className={styles.responseTabsContainer}>
          {showTabArrows && (
            <button
              className={clsx(styles.tabArrow, styles.tabArrowLeft)}
              onClick={handleLeftClick}
            />
          )}
          <ul
            ref={tabItemListContainerRef}
            role="tablist"
            aria-orientation="horizontal"
            className={clsx(
              styles.responseTabsListContainer,
              "tabs",
              {
                "tabs--block": block,
              },
              className
            )}
          >
            {values.map(({ value, label, attributes }) => {
              const responseStatusStyle =
                parseInt(value) >= 400
                  ? styles.responseStatusDanger
                  : parseInt(value) >= 200 && parseInt(value) < 300
                  ? styles.responseStatusSuccess
                  : styles.responseStatusInfo;

              return (
                <li
                  role="tab"
                  tabIndex={selectedValue === value ? 0 : -1}
                  aria-selected={selectedValue === value}
                  key={value}
                  ref={(tabControl) => {
                    if (tabControl) {
                      tabRefs.push(tabControl);
                    }
                  }}
                  onKeyDown={handleKeydown}
                  onFocus={handleTabChange}
                  onClick={handleTabChange}
                  {...attributes}
                  className={clsx(
                    "tabs__item",
                    styles.tabItem,
                    attributes?.className ?? "",
                    responseStatusStyle,
                    {
                      [styles.active]: selectedValue === value,
                    }
                  )}
                >
                  <div className={styles.responseTabDot} />
                  {label ?? value}
                </li>
              );
            })}
          </ul>
          {showTabArrows && (
            <button
              className={clsx(styles.tabArrow, styles.tabArrowRight)}
              onClick={handleRightClick}
            />
          )}
        </div>
      </div>
      <hr />
      {lazy ? (
        cloneElement(
          children.filter(
            (tabItem) => tabItem.props.value === selectedValue
          )[0],
          {
            className: clsx("margin-vert--md", styles.responseSchemaContainer),
          }
        )
      ) : (
        <div
          className={clsx("margin-vert--md", styles.responseSchemaContainer)}
        >
          {children.map((tabItem, i) =>
            cloneElement(tabItem, {
              key: i,
              hidden: tabItem.props.value !== selectedValue,
            })
          )}
        </div>
      )}
    </div>
  );
}

export default function ApiTabs(props: ApiTabsProps) {
  const isBrowser = useIsBrowser();
  return (
    <ApiTabsComponent // Remount tabs after hydration
      // Temporary fix for https://github.com/facebook/docusaurus/issues/5653
      key={String(isBrowser)}
      {...props}
    />
  );
}
