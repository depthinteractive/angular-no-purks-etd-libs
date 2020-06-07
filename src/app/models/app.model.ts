export interface App {
  mode: string;
  modeLoading: boolean;
  settingsCollapse: boolean;
  systemInfo: {
    title: string;
    value: string;
  }[];
}
