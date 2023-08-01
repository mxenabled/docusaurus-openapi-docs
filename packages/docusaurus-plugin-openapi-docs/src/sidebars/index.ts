/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import fs from "fs";
import path from "path";

import {
  ProcessedSidebar,
  SidebarItemCategory,
  SidebarItemCategoryLinkConfig,
  SidebarItemDoc,
} from "@docusaurus/plugin-content-docs/src/sidebars/types";
import { posixPath } from "@docusaurus/utils";
import clsx from "clsx";
import getFrontmatter from "gray-matter";
import { kebabCase } from "lodash";
import uniq from "lodash/uniq";

import { TagObject } from "../openapi/types";
import type {
  SidebarOptions,
  APIOptions,
  ApiPageMetadata,
  ApiMetadata,
} from "../types";

function isApiItem(item: ApiMetadata): item is ApiMetadata {
  return item.type === "api";
}

function isInfoItem(item: ApiMetadata): item is ApiMetadata {
  return item.type === "info";
}

type NonApiItem = {
  sidebar_position?: number;
  sidebar_label?: string;
  title?: string;
  id: string;
  api_tags?: string[];
  description?: string;
  slug?: string;
};

type GroupByTagsArgs = {
  items: ApiPageMetadata[];
  sidebarOptions: SidebarOptions;
  options: APIOptions;
  tags: TagObject[][];
  docPath: string;
  nonApiMdxFiles: string[] | [];
};

function groupByTags({
  items,
  sidebarOptions,
  options,
  tags,
  nonApiMdxFiles,
  docPath,
}: GroupByTagsArgs): ProcessedSidebar {
  let { outputDir, label } = options;

  // Remove trailing slash before proceeding
  outputDir = outputDir.replace(/\/$/, "");

  const {
    sidebarCollapsed,
    sidebarCollapsible,
    customProps,
    categoryLinkSource,
  } = sidebarOptions;

  const apiItems = items.filter(isApiItem);
  const infoItems = items.filter(isInfoItem);
  const intros = infoItems.map((item: any) => {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      tags: item.info.tags,
    };
  });

  const nonApiItems = nonApiMdxFiles
    .map((item: string) => {
      const itemFilePath = path.join(outputDir, item);
      const itemFileContents = fs.readFileSync(itemFilePath, "utf8");
      const { data: frontmatter } = getFrontmatter(itemFileContents);

      if (frontmatter?.draft) {
        return null;
      }

      return frontmatter;
    })
    .filter(Boolean) as NonApiItem[];

  // TODO: make sure we only take the first tag
  const operationTags = uniq(
    apiItems
      .flatMap((item) => item.api.tags)
      .filter((item): item is string => !!item)
  );

  // Combine globally defined tags with operation tags
  // Only include global tag if referenced in operation tags
  let apiTags: string[] = [];
  tags.flat().forEach((tag) => {
    // Should we also check x-displayName?
    if (operationTags.includes(tag.name!)) {
      apiTags.push(tag.name!);
    }
  });
  apiTags = uniq(apiTags.concat(operationTags));

  const basePath = docPath
    ? outputDir.split(docPath!)[1].replace(/^\/+/g, "")
    : outputDir.slice(outputDir.indexOf("/", 1)).replace(/^\/+/g, "");

  function createDocItem(item: ApiPageMetadata): SidebarItemDoc {
    const sidebar_label = item.frontMatter.sidebar_label;
    const title = item.title;
    const id = item.id;

    return {
      type: "doc" as const,
      id:
        basePath === "" || undefined ? `${item.id}` : `${basePath}/${item.id}`,
      label: (sidebar_label as string) ?? title ?? id,
      customProps: customProps,
      className: clsx(
        {
          "menu__list-item--deprecated": item.api.deprecated,
          "api-method": !!item.api.method,
        },
        item.api.method
      ),
    };
  }

  function createNonApiDocItem(item: NonApiItem): SidebarItemDoc {
    const { sidebar_label, title, id } = item;

    return {
      type: "doc" as const,
      id: basePath === "" || undefined ? `${id}` : `${basePath}/${id}`,
      label: (sidebar_label as string) ?? title ?? id,
      customProps,
    };
  }

  let rootIntroDoc = undefined;
  if (infoItems.length === 1) {
    const infoItem = infoItems[0];
    const id = infoItem.id;
    rootIntroDoc = {
      type: "doc" as const,
      id: basePath === "" || undefined ? `${id}` : `${basePath}/${id}`,
    };
  }

  const tagged = apiTags
    .map((tag) => {
      // Map info object to tag
      const taggedInfoObject = intros.find((i) =>
        i.tags ? i.tags.find((t: any) => t.name === tag) : undefined
      );

      const tagObject = tags.flat().find(
        (t) =>
          tag === t.name ?? {
            name: tag,
            description: `${tag} Index`,
          }
      );

      // TODO: perhaps move this into a getLinkConfig() function
      let linkConfig = undefined;
      if (taggedInfoObject !== undefined && categoryLinkSource === "info") {
        linkConfig = {
          type: "doc",
          id:
            basePath === "" || undefined
              ? `${taggedInfoObject.id}`
              : `${basePath}/${taggedInfoObject.id}`,
        } as SidebarItemCategoryLinkConfig;
      }

      // TODO: perhaps move this into a getLinkConfig() function
      if (tagObject !== undefined && categoryLinkSource === "tag") {
        const tagId = kebabCase(tagObject.name);
        linkConfig = {
          type: "doc",
          id:
            basePath === "" || undefined ? `${tagId}` : `${basePath}/${tagId}`,
        } as SidebarItemCategoryLinkConfig;
      }

      // Default behavior
      if (categoryLinkSource === undefined) {
        linkConfig = {
          type: "generated-index" as "generated-index",
          title: tag,
          slug: label
            ? posixPath(
                path.join(
                  "/category",
                  basePath,
                  kebabCase(label),
                  kebabCase(tag)
                )
              )
            : posixPath(path.join("/category", basePath, kebabCase(tag))),
        } as SidebarItemCategoryLinkConfig;
      }

      const tagApiItems = apiItems
        .filter((item) => !!item.api.tags?.includes(tag))
        .map(createDocItem);

      const tagNonApiItems = nonApiItems
        .filter((i) =>
          i.api_tags ? i.api_tags.find((t: string) => t === tag) : false
        )
        .map(createNonApiDocItem);

      const items = [...tagNonApiItems, ...tagApiItems];

      const tagObjectLabel = tagObject?.["x-displayName"] ?? tag;
      const uppercaseLabel =
        tagObjectLabel.charAt(0).toUpperCase() + tagObjectLabel.slice(1);
      return {
        type: "category" as const,
        label: uppercaseLabel,
        link: linkConfig,
        collapsible: sidebarCollapsible,
        collapsed: sidebarCollapsed,
        items,
      };
    })
    .filter((item) => item.items.length > 0); // Filter out any categories with no items.

  // Handle items with no tag
  const untaggedApiItems = apiItems
    .filter(({ api }) => api.tags === undefined || api.tags.length === 0)
    .map(createDocItem);

  const untaggedNonApiItems = nonApiItems
    .filter((i) => i.api_tags === undefined || i.api_tags.length === 0)
    .map(createNonApiDocItem);

  const untaggedItems = [...untaggedNonApiItems, ...untaggedApiItems];
  let untagged: SidebarItemCategory[] = [];
  if (untaggedItems.length > 0) {
    untagged = [
      {
        type: "category" as const,
        label: "UNTAGGED",
        collapsible: sidebarCollapsible!,
        collapsed: sidebarCollapsed!,
        items: untaggedItems,
      },
    ];
  }

  // Shift root intro doc to top of sidebar
  // TODO: Add input validation for categoryLinkSource options
  if (rootIntroDoc && categoryLinkSource !== "info") {
    tagged.unshift(rootIntroDoc as any);
  }

  return [...tagged, ...untagged];
}

type GenerateSidebarSliceArgs = {
  sidebarOptions: SidebarOptions;
  options: APIOptions;
  api: ApiMetadata[];
  tags: TagObject[][];
  nonApiMdxFiles: string[] | [];
  docPath: string;
};

export default function generateSidebarSlice({
  sidebarOptions,
  options,
  api,
  tags,
  nonApiMdxFiles,
  docPath,
}: GenerateSidebarSliceArgs) {
  let sidebarSlice: ProcessedSidebar = [];

  if (sidebarOptions.groupPathsBy === "tag") {
    sidebarSlice = groupByTags({
      items: api as ApiPageMetadata[],
      sidebarOptions,
      options,
      tags,
      nonApiMdxFiles,
      docPath,
    });
  }
  return sidebarSlice;
}
