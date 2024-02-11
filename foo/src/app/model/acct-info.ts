import { TenantProfile } from "./tenant-profile";

export class AcctInfo {
  authorityType: string;
  clientInfo: string;
  homeAccountId: string;
  environment: string;
  realm: string;
  localAccountId: string;
  username: string;
  name: string;
  tenantProfiles: TenantProfile[];
}
