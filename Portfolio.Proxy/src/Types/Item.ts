export type ItemModel = {
  id: number;
  name: string;
  type: string;
  iconURL: string;
  summary: string;
  description: string;
  frameworks: string[];
  languages: string[];
  environments: string[];
  demoLink: string | null;
  releaseNotes: string;
  buildHistory: ItemBuildHistoryModel[];
  unitTestCoverage: number | null;
  gitHubInformation: ItemGitHubInformation;
  llmUsage: ItemLLMUsageModel | null;
  llmUsageNotes: string | null;
  dateCreated: Date;
  dateUpdated: Date;
  isDeleted: boolean;
}

export type ItemRequestModel = {
  name: string | null;
  type: string | null;
  iconURL: string | null;
  summary: string | null;
  description: string | null;
  frameworks: string[] | null;
  languages: string[] | null;
  environments: string[] | null;
  demoLink: string | null;
  releaseNotes: string | null;
  buildHistory: ItemBuildHistoryModel[] | null;
  unitTestCoverage: number | null;
  gitHubLink: string | null;
  llmUsage: ItemLLMUsageModel | null;
  llmUsageNotes: string | null;
}

export type ItemBuildHistoryModel = {
  version: string;
  releaseDate: Date;
}

export type ItemGitHubInformation = {
  url: string;
  ciStatus: ItemGitHubCIStatusModel[];
  issueBreakdown: ItemGitHubIssueBreakdownModel;
  assigneeBreakdown: ItemGitHubAssigneeBreakdownModel[];
  inProgressBreakdown: ItemGitHubInProgressBreakdownModel[];
}

export type ItemGitHubCIStatusModel = {
  workflow: string;
  status: string;
}

export type ItemGitHubIssueBreakdownModel = {
  totalIssues: number;
  bugs: number;
  newFeatures: number;
}

export type ItemGitHubAssigneeBreakdownModel = {
  name: string;
  issues: number;
}

export type ItemGitHubInProgressBreakdownModel = {
  id: number;
  assignee: string;
  title: string;
  type: string;
}

export type ItemLLMUsageModel = {
  company: string;
  model: string;
}