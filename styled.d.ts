/* eslint-disable @typescript-eslint/no-empty-object-type */
import "styled-components/native";

import type { AppTheme } from "@/theme/theme";

declare module "styled-components/native" {
  export interface DefaultTheme extends AppTheme {}
}
