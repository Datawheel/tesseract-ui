#!/usr/bin/env node

const cli = require("cac")("create-tesseract-ui");
const spawn = require("cross-spawn");
const {green, grey, yellow} = require("kleur");
const path = require("path");
const prompts = require("prompts");

const pkg = require("../package.json");
const create = require("./create");
const utils = require("./utils");
const validate = require("./validate");

const LINE = `-----------------------------------------------------------`;

cli
  .command("<directory>", "Create a tesseract-ui boilerplate in the defined directory")
  .option("-n, --name <name>", "Sets the project name")
  .option("-t, --title <title>", "Sets the site's title")
  .option("-s, --server <url>", "Sets the URL for the tesseract server")
  .action(async (targetFolder, options) => {
    console.log(LINE);
    console.log(`Creating a new tesseract-ui instance`);

    const targetPath = path.resolve(targetFolder);
    console.log(grey("Target directory: "), green(targetPath));
    console.log(LINE);

    utils.makeDirectory(targetPath);

    const promptOptions = {onCancel: () => process.exit(0)};

    const environment = await prompts(
      {
        name: "type",
        type: "select",
        message: "Where will this instance run?",
        choices: [
          {title: "A local computer", value: "local"},
          {title: "A production server", value: "production"}
        ]
      },
      promptOptions
    );

    /** @type {prompts.PromptObject[]} */
    const questions = [
      {
        type: options.title ? false : "text",
        name: "title",
        message: "Enter the title for the web application",
        initial: targetFolder
      },
      {
        type: options.server ? false : "text",
        name: "server",
        message: "Enter the full URL for the tesseract-server",
        validate: validate.absoluteUrl
      }
    ];
    const responses = await prompts(questions, promptOptions);

    Object.assign(options, responses);

    console.log(LINE);
    console.log("Creating files and applying configuration...");
    create({
      name: targetFolder,
      serverUrl: options.server,
      targetPath,
      title: options.title
    });

    const spawnSyncOptions = {cwd: targetPath, stdio: "inherit"};

    console.log(LINE);
    console.log("Installing required dependencies...");
    spawn.sync("npm", ["install"], spawnSyncOptions);

    if (environment.type === "production") {
      console.log(LINE);
      console.log("Building app...");
      spawn.sync("npx", ["poi", "--prod", "--no-clear-console"], spawnSyncOptions);

      console.log(LINE);
      console.log(`The tesseract-ui boilerplate was successfully built on`);
      console.log(green(path.join(targetPath, "dist")));
      console.log(`We suggest you to point the virtual server root folder to this path.`);
    }
    else {
      console.log(LINE);
      console.log(`The tesseract-ui boilerplate is ready to run in development mode.`);
      console.log(`Use the command`, yellow(`npm run dev`), `to start the server.`);
      console.log(`The app will then run on http://localhost:4000`);
      console.log(`To build a production bundle, run`, yellow(`npm run build`));
      console.log(`The bundle will be generated in`, path.join(targetPath, "dist/"));
    }
  });

cli.help();
cli.version(pkg.version);

cli.parse();
