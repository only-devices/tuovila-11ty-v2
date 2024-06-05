const pluginRss = require("@11ty/eleventy-plugin-rss"); // needed for absoluteUrl feature
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

// Base setup for builds, needed for og tags and correct image paths
// (mostly for github pages deployment, see build-deploy.yaml)
const baseUrl = process.env.BASE_URL || 'https://beta.tuovila.com/';
// e.g. 'https://mandrasch.github.io/'
const pathPrefix = process.env.PATH_PREFIX || '/';
// e.g. '/11ty-plain-boostrap5/'
console.log('baseUrl is set to ...', baseUrl);
console.log('pathPrefix is set to ...', pathPrefix);

// will be accessible in all templates via
// see "eleventyConfig.addGlobalData("site", globalData);"" below
// related: https://github.com/11ty/eleventy/issues/1641
const globalSiteData = {
  title: "tuovila.com",
  description: "eric tuovila's personal website",
  locale: 'en',
  baseUrl: baseUrl,
  pathPrefix: pathPrefix,
}

// https://www.11ty.dev/docs/plugins/image/#use-this-in-your-templates
const Image = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
  // Image processing
  eleventyConfig.addShortcode("image", async function (src, classes, alt, sizes = "100vw") {
    let metadata = await Image(src, {
      widths: [48, 600, 1200],
      formats: ['webp']
    });

    let imageAttributes = {
      class: classes,
      alt,
      sizes,
      loading: "lazy",
      decoding: "async"
    };

    // You bet we throw an error on a missing alt (alt="" works okay)
    return Image.generateHTML(metadata, imageAttributes);
  });

  // Heroicons -- https://libraries.io/npm/@cdransf%2Feleventy-plugin-heroicons
  eleventyConfig.addPlugin(require("@cdransf/eleventy-plugin-heroicons"));

  // Set site title
  eleventyConfig.addGlobalData("site", globalSiteData);

  // Add plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Copy dist/ files from laravel mix
  eleventyConfig.addPassthroughCopy("dist/"); // path is relative from root

  // Copy (static) files to output (_site)
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/js/global.js");

  // Important for watch: Eleventy will not add a watch for files or folders that
  // are in .gitignore (--> dist/),unless setUseGitIgnore is turned off. See this chapter:
  // https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets
  eleventyConfig.setUseGitIgnore(false);

  // Watch for changes (and reload browser)
  eleventyConfig.addWatchTarget("./src/assets"); // normal (static) assets
  eleventyConfig.addWatchTarget("./src/js"); // custom JS folder
  eleventyConfig.addWatchTarget("./dist") // laravel-mix output changes

  // Copy transformed images
  // TODO: this is executed too soon? imgs not there?
  eleventyConfig.addPassthroughCopy("img/*");

  // RandomId function for IDs used by labelled-by
  // Thanks https://github.com/mozilla/nunjucks/issues/724#issuecomment-207581540
  // TODO: replace with addNunjucksGlobal? https://github.com/11ty/eleventy/issues/1498
  eleventyConfig.addFilter("generateRandomIdString", function (prefix) {
    return prefix + "-" + Math.floor(Math.random() * 1000000);
  });

  // Base Config
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "includes", // this path is releative to input-path (src/)
      layouts: "layouts", // this path is releative to input-path (src/)
      data: "data", // this path is releative to input-path (src/)
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    // important for github pages build (subdirectory):
    //pathPrefix: pathPrefix
  };
};
