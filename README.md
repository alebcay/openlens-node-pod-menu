# OpenLens Extensions

This repository contains the last version of MIT-licensed extensions from the OpenLens repository (https://github.com/lensapp/lens) prior to their removal in version 6.3.0.

Some minor changes have been added to allow these extensions to be built outside of the OpenLens tree (e.g. adding some `devDependencies`).

# How to use these extensions

From the root of this repository:

```sh
# Choose the same version of Node that is used in the Electron version
# that OpenLens uses. It might work with other (newer) versions of
# Node but I haven't tested it.
nvm install 16.14.2
make build
```

Tarballs for the four extensions will be output to a subdirectory `dist`. In OpenLens, navigate to the Extensions list and provide the path to the tarball for each extension to be loaded, or drag and drop the extension tarball into the OpenLens window. After loading for a moment, the extension should appear in the list of enabled extensions. Verify that the features provided by the desired extensions are working as expected.

# License

Like the OpenLens repository itself at the point from which these extensions were extracted, the content of this repository is released under the MIT license. See the file `LICENSE` for details.

# Disclaimer

I don't use all of the features provided by these extensions on a regular basis. My evaluation and testing of these extensions only extends insofar as me using it to get work done during my day job. I will probably try to maintain these as best I can but it's a best-effort basis for now.
