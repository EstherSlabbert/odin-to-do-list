# The Odin Project: ToDo List

This is my solution for the Odin Project's ToDo List Page project, the specifications of which can be found [here](https://www.theodinproject.com/lessons/node-path-javascript-todo-list).

To learn more about bundling your assets with webpack go [here](https://webpack.js.org/).

## Set up for project

- `npm init` and follow prompts to create project.
- `npm install webpack webpack-cli --save-dev` to install webpack.
- `npm i html-webpack-plugin` to install HTML webpack plugin.
- Create `src/index.html` and `src/index.js` files.
- Create `webpack.config.js` in root of project directory with the following minimum content:

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
```

- `npx webpack --config webpack.config.js` to run the build with the webpack config you set. This should generate the files in the `./dist` folder. (command can be run without `--config webpack.config.js` flag if it has the default name as it does).

- Add `"build": "webpack --mode=development"` to scripts section of package.json file. Now you can run build command by typing `npm run build`.

- `npx webpack --watch` will not have to rerun webpack every time you make a change to your `.js` files.

- `npm install --save-dev style-loader css-loader` to add css to webpack and add the following to your `webpack.config.js`:

```js
module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
```

To run and get build from webpack in dist folder: `npm run build`.

To display in GitHub Pages see this [gist](https://gist.github.com/cobyism/4730490).

## Acknowledgements

Based on the anime One Punch.

[Icons](https://icons8.com/icon/set/time-and-date/bubbles) by icons8.

[Planner](https://icons8.com/icon/114612/planner) icon by [Icons8](https://icons8.com)
