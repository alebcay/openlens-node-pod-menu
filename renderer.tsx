/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { Renderer } from "@k8slens/extensions";
import { NodeMenu } from "./src/node-menu";
import { PodAttachMenu } from "./src/attach-menu";
import { PodShellMenu } from "./src/shell-menu";
import { PodLogsMenu } from "./src/logs-menu";
import React from "react";

export default class PodMenuRendererExtension extends Renderer.LensExtension {
  kubeObjectMenuItems = [
    {
      kind: "Node",
      apiVersions: ["v1"],
      components: {
        MenuItem: (props: Renderer.Component.KubeObjectMenuProps<Renderer.K8sApi.Node>) => <NodeMenu {...props} />,
      },
    },
    {
      kind: "Pod",
      apiVersions: ["v1"],
      components: {
        MenuItem: (props: Renderer.Component.KubeObjectMenuProps<Renderer.K8sApi.Pod>) => <PodAttachMenu {...props} />,
      },
    },
    {
      kind: "Pod",
      apiVersions: ["v1"],
      components: {
        MenuItem: (props: Renderer.Component.KubeObjectMenuProps<Renderer.K8sApi.Pod>) => <PodShellMenu {...props} />,
      },
    },
    {
      kind: "Pod",
      apiVersions: ["v1"],
      components: {
        MenuItem: (props: Renderer.Component.KubeObjectMenuProps<Renderer.K8sApi.Pod>) => <PodLogsMenu {...props} />,
      },
    },
  ];
}
