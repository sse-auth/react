import path from "path";
import camelcase from "camelcase";
import type { IconDefinition } from "../../scripts/_types";
import { glob } from "../../scripts/glob";

export const icons: IconDefinition[] = [
  {
    id: "fa5",
    name: "Font Awesome 5",
    contents: [
      {
        files: path.resolve(__dirname, "../../icons/fontawesome/svgs/+(brands|solid)/*.svg"),
        formatter: (name) =>
          `Fa5${name}`.replace(/_/g, "").replace(/&/g, "And"),
      },
    ],
    projectUrl: "https://fontawesome.com/",
    license: "MIT",
    licenseUrl: "https://github.com/sse-auth/icons/blob/master/LICENSE",
    source: {
      type: "git",
      localName: "SSE-FA5",
      remoteDir: "svg/fa5/",
      url: "https://github.com/sse-auth/icons.git",
      branch: "master",
      hash: "3d32dba878959176a0842aa91952221b50047f30",
    },
  },
];
