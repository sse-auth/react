export interface AzureDevOpsProfile extends Record<string, any> {
  id: string;
  displayName: string;
  emailAddress: string;
  coreAttributes: { Avatar: { value: { value: string } } };
}
