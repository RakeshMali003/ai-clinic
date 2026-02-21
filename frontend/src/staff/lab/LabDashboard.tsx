import { LabDashboard as LabDashboardContent } from "../../dashboards/LabDashboard";
import { User } from "../../common/types";

interface LabDashboardProps {
  user: User;
}

// ROLE: Lab Technician - Shows lab dashboard with test management and diagnostics
export function LabDashboard({ user }: LabDashboardProps) {
  return <LabDashboardContent user={user} />;
}
