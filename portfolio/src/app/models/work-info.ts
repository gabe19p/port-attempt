export interface JobDetail {
  jobDuty: string;
  jobDetails: string[];
}

export interface WorkInfo {
  jobTitle: string;
  jobCompany: string;
  jobLocation: string;
  jobDates: string;
  jobDetails: JobDetail[];
  image: string;
}
