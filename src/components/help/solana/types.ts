
export type ResourceLink = {
  url: string;
  title: string;
  description: string;
  category: string;
};

export type ResourceCategory = {
  id: string;
  name: string;
};

export type CommandType = {
  command: string;
  description: string;
  category: string;
  example?: string;
};

export type SecurityFeature = {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
};

export type PlatformCommand = {
  id: string;
  command: string;
  description: string;
  usage: string;
  category: string;
  isAdvanced?: boolean;
};
