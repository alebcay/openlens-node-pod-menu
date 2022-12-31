# OpenLens Node/Pod Menu Extension

This OpenLens extension adds back the node and pod menu functionality that was removed from OpenLens itself in 6.3.0.

# Installing this extension

In OpenLens, navigate to the Extensions list. In the text box, enter the name of this plugin:

```
@alebcay/openlens-node-pod-menu
```

Click "Install", and after a few moments, the plugin should appear in the list of installed extensions and be enabled.

# How to build this extension locally

From the root of this repository:

```sh
# Choose the same version of Node that is used in the Electron version
# that OpenLens uses. It might work with other (newer) versions of
# Node but I haven't tested it.
nvm install 16.14.2

npm ci
npm run build
npm pack
```

The tarball for the extension will be placed in the current directory. In OpenLens, navigate to the Extensions list and provide the path to the tarball to be loaded, or drag and drop the extension tarball into the OpenLens window. After loading for a moment, the extension should appear in the list of enabled extensions.

# License

Like the OpenLens repository itself at the point from which this extension is based upon, the content of this repository is released under the MIT license. See the file `LICENSE` for details.
