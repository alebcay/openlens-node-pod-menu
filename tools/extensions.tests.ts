/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { ElectronApplication, Page } from "playwright";
import { expect } from '@jest/globals';
import * as utils from "../helpers/utils";

describe("extensions page tests", () => {
  let window: Page;
  let cleanup: undefined | (() => Promise<void>);

  beforeAll(async () => {
    let app: ElectronApplication;

    ({ window, cleanup, app } = await utils.start());
    await utils.clickWelcomeButton(window);

    await app.evaluate(async ({ app }) => {
      await app.applicationMenu
        ?.getMenuItemById(process.platform === "darwin" ? "mac" : "file")
        ?.submenu
        ?.getMenuItemById("navigate-to-extensions")
        ?.click();
    });
  }, 10*60*1000);

  afterAll(async () => {
    await cleanup?.();
  }, 10*60*1000);

  it('installs the extension', async () => {
    const textbox = window.getByPlaceholder("Name or file path or URL");
    await textbox.fill(process.env.EXTENSION_PATH)
    const install_button_selector = 'button[class*="Button install-module__button--"]';
    await window.waitForSelector(install_button_selector.concat('[data-waiting=false]'));
    await window.click(install_button_selector.concat('[data-waiting=false]'))
    await window.waitForSelector(install_button_selector.concat('[data-waiting=true]'))
    await window.waitForSelector(install_button_selector.concat('[data-waiting=false]'));

    const installedExtensionName = await (await window.waitForSelector('div[class*="installed-extensions-module__extensionName--"]')).textContent()
    expect(installedExtensionName).toBe("@alebcay/openlens-node-pod-menu")
    const installedExtensionState = await (await window.waitForSelector('div[class*="installed-extensions-module__enabled--"]')).textContent()
    expect(installedExtensionState).toBe("Enabled")
  }, 10*60*1000);
});
