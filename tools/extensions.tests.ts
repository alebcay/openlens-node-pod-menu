/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { ElectronApplication, Frame, Page } from "playwright";
import { expect } from "@jest/globals";
import * as utils from "../helpers/utils";

describe("extensions page tests", () => {
  let window: Page;
  let cleanup: undefined | (() => Promise<void>);
  let frame: Frame;

  beforeAll(async () => {
    let app: ElectronApplication;

    ({ window, cleanup, app } = await utils.start());
    window.on('console', msg => console.log(msg.text()));
    await utils.clickWelcomeButton(window);

    // Navigate to extensions page
    await app.evaluate(async ({ app }) => {
      await app.applicationMenu
        ?.getMenuItemById(process.platform === "darwin" ? "mac" : "file")
        ?.submenu
        ?.getMenuItemById("navigate-to-extensions")
        ?.click();
    });

    // Trigger extension install
    const textbox = window.getByPlaceholder("Name or file path or URL");
    await textbox.fill(process.env.EXTENSION_PATH);
    const install_button_selector = 'button[class*="Button install-module__button--"]';
    await window.waitForSelector(install_button_selector.concat('[data-waiting=false]'));
    await window.click(install_button_selector.concat('[data-waiting=false]'));
    await window.waitForSelector(install_button_selector.concat('[data-waiting=true]'));
    await window.waitForSelector(install_button_selector.concat('[data-waiting=false]'));

    // Expect extension to be listed in installed list and enabled
    const installedExtensionName = await (await window.waitForSelector('div[class*="installed-extensions-module__extensionName--"]')).textContent();
    expect(installedExtensionName).toBe("@alebcay/openlens-node-pod-menu");
    const installedExtensionState = await (await window.waitForSelector('div[class*="installed-extensions-module__enabled--"]')).textContent();
    expect(installedExtensionState).toBe("Enabled");
    await window.click('div[class*="close-button-module__closeButton--"][aria-label=Close]');

    // Navigate to catalog
    await window.waitForSelector('div[data-rbd-draggable-id=catalog-entity]');
    await window.click('div[data-rbd-draggable-id=catalog-entity]');

    // Navigate to minikube cluster
    frame = await utils.lauchMinikubeClusterFromCatalog(window);

    // Expand workloads menu if not already expanded
    await frame.waitForSelector('div[data-testid=sidebar-item-workloads]');
    if (await frame.locator('div[data-testid=sidebar-item-pods]').count() === 0) {
      await frame.click('div[data-testid=sidebar-item-workloads]');
    }
  }, 10*60*1000);

  afterAll(async () => {
    await cleanup?.();
  }, 10*60*1000);

  it('adds menu items to the pod details overlay', async () => {
    // Navigate to pods view
    await frame.click('div[data-testid=sidebar-item-pods]');

    // Navigate to kube-system namespace
    await frame.click('div[data-testid=namespace-select-filter]');
    await frame.waitForSelector('.NamespaceSelectFilterMenu');
    await frame.click('.Select__option >> text=kube-system');

    // Click on etcd-minikube pod
    await frame.waitForSelector('text=etcd-minikube');
    await frame.click('text=etcd-minikube');

    // Wait for pod details to pop out
    await frame.waitForSelector('span[data-icon-name=close]');

    // Check for expected menu items
    expect(await frame.locator('li[class="MenuItem"] span[class="title"] >> text="Attach Pod"').count()).toBe(1);
    expect(await frame.locator('li[class="MenuItem"] span[class="title"] >> text="Shell"').count()).toBe(1);
    expect(await frame.locator('li[class="MenuItem"] span[class="title"] >> text="Logs"').count()).toBe(1);

    // Close pod details
    await frame.click('span[data-icon-name=close]');
  }, 10*60*1000);

  it('adds menu items to the pod actions dropdown', async () => {
    // Navigate to pods view
    await frame.click('div[data-testid=sidebar-item-pods]');

    // Sort pods by running status
    await frame.click('div[id="status"][class="TableCell status nowrap sorting"]');

    // Click on a running pod item's dropdown
    const menu = frame.locator('div[class="TableCell menu"]').last();
    await menu.click();

    // Wait for dropdown menu to appear
    await frame.waitForSelector('ul[id*="menu-actions-for-kube-object-menu-for-"]');

    // Check for expected menu items
    expect(await frame.locator('li[class="MenuItem"] span[class="title"] >> text="Attach Pod"').count()).toBe(1);
    expect(await frame.locator('li[class="MenuItem"] span[class="title"] >> text="Shell"').count()).toBe(1);
    expect(await frame.locator('li[class="MenuItem"] span[class="title"] >> text="Logs"').count()).toBe(1);

    // Close dropdown
    await menu.click();

    // Go back to sorting by name
    await frame.click('div[id="name"][class="TableCell name nowrap sorting"]');
  }, 10*60*1000);

  it('adds menu items to the node details overlay', async () => {
    // Navigate to nodes view
    await frame.click('div[data-testid=sidebar-item-nodes]');

    // Click on minikube node
    await frame.waitForSelector('div[class="TableCell name"] >> text=minikube');
    await frame.click('div[class="TableCell name"] >> text=minikube');

    // Wait for node details to pop out
    await frame.waitForSelector('span[data-icon-name=close]');

    // Check for expected menu items
    expect(await frame.locator('li[class="MenuItem"] span[class="title"] >> text="Shell"').count()).toBe(1);
    expect(await frame.locator('li[class="MenuItem"] span[class="title"] >> text="Cordon"').count()).toBe(1);
    expect(await frame.locator('li[class="MenuItem"] span[class="title"] >> text="Drain"').count()).toBe(1);

    // Close node details
    await frame.click('span[data-icon-name=close]');
  }, 10*60*1000);

  it('adds menu items to the node actions dropdown', async () => {
    // Navigate to nodes view
    await frame.click('div[data-testid=sidebar-item-nodes]');

    // Click on a node item's dropdown
    const menu = frame.locator('div[class="TableCell menu"]').first();
    await menu.click();

    // Wait for dropdown menu to appear
    await frame.waitForSelector('ul[id*="menu-actions-for-kube-object-menu-for-"]');

    // Check for expected menu items
    expect(await frame.locator('li[class="MenuItem"] span[class="title"] >> text="Shell"').count()).toBe(1);
    expect(await frame.locator('li[class="MenuItem"] span[class="title"] >> text="Cordon"').count()).toBe(1);
    expect(await frame.locator('li[class="MenuItem"] span[class="title"] >> text="Drain"').count()).toBe(1);

    // Close dropdown
    await menu.click();
  }, 10*60*1000);
});
