import { ObjectId } from "mongodb";

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type commiteeType = {
  periodId: string;
  period_name: string;
  committee: string;
  availableTimes: [
    {
      start: string;
      end: string;
    },
  ];
  timeslot: string;
  message: string;
};

export type preferencesType = {
  first: string;
  second: string;
  third: string;
};

export type committeePreferenceType = {
  committee: string;
};

export type applicantType = {
  owId: string;
  name: string;
  email: string;
  phone: string;
  grade: string;
  about: string;
  preferences: preferencesType | committeePreferenceType[];
  bankom: bankomOptionsType;
  optionalCommittees: string[];
  selectedTimes: [
    {
      start: string;
      end: string;
    },
  ];
  date: Date;
  periodId: string | ObjectId;
};

export type bankomOptionsType = "yes" | "no" | "maybe" | undefined;

// applicantType modified to fit email content
export type emailDataType = {
  name: string;
  emails: string[];
  phone: string;
  grade: string;
  about: string;
  firstChoice: string;
  secondChoice: string;
  thirdChoice: string;
  bankom: "Ja" | "Nei" | "Kanskje";
  optionalCommittees: string;
};

export type periodType = {
  _id: ObjectId;
  name: string;
  description: string;
  applicationPeriod: {
    start: Date;
    end: Date;
  };
  interviewPeriod: {
    start: Date;
    end: Date;
  };
  committees: string[];
  optionalCommittees: string[];
  hasSentInterviewTimes: boolean;
};

export type AvailableTime = {
  start: string;
  end: string;
  room: string;
};

export type committeeInterviewType = {
  periodId: string;
  period_name: string;
  committee: string;
  committeeEmail: string;
  availabletimes: AvailableTime[];
  timeslot: string;
  message: string;
};

export type owCommitteeType = {
  name_short: string;
  name_long: string;
  email?: string;
  description_long?: string;
  description_short?: string;
  application_description?: string;
  image?: { xs: string };
};

export type algorithmType = {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  interviews: {
    start: string;
    end: string;
    committeeName: string;
  }[];
};

export type committeeEmails = {
  name_short: string;
  email: string;
};

export type emailCommitteeInterviewType = {
  periodId: string;
  period_name: string;
  committeeName: string;
  committeeEmail: string;
  applicants: {
    applicantName: string;
    applicantPhone: string;
    applicantEmail: string;
    interviewTime: {
      start: string;
      end: string;
      room: string;
    };
  }[];
};

export type emailApplicantInterviewType = {
  periodId: string;
  period_name: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  committees: {
    committeeName: string;
    committeeEmail: string;
    interviewTime: {
      start: string;
      end: string;
      room: string;
    };
  }[];
};
