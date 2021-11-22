import sitemap from "../sitemap.json";

/**
 * Get the page metadata (title, description, googleDocId, image, ...)
 * @param {*} param can be either a slug or the googleDocId
 * @returns
 */
export function getPageMetadata(param) {
  let pageInfo = sitemap[param.toLowerCase()];
  if (!pageInfo) {
    // search by param
    Object.keys(sitemap).forEach((key) => {
      if (sitemap[key].googleDocId === param) {
        pageInfo = sitemap[key];
        pageInfo.slug = key;
      }
    });
  }
  return pageInfo || {};
}
