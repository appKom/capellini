import {
  emailCommitteeInterviewType,
  emailApplicantInterviewType,
} from "../../types/types";
import { changeDisplayName } from "../toString";
import { formatDateHours } from "../dateUtils";
import sendEmail from "../../email/sendEmail";
import sendSMS from "./sendSMS";

interface sendInterviewTimesProps {
  committeesToEmail: emailCommitteeInterviewType[];
  applicantsToEmail: emailApplicantInterviewType[];
}

export const formatAndSendEmails = async ({
  committeesToEmail,
  applicantsToEmail,
}: sendInterviewTimesProps) => {
  try {
    // Send email to each applicant
    for (const applicant of applicantsToEmail) {
      const typedApplicant: emailApplicantInterviewType = applicant;
      const applicantEmail = [typedApplicant.applicantEmail];
      const subject = `Hei, ${typedApplicant.applicantName}, her er dine intervjutider:`;

      let emailBody = `<p>Hei <strong>${typedApplicant.applicantName}</strong>,</p><p>Her er dine intervjutider for ${typedApplicant.period_name}:</p><ul><br/>`;
      let phoneBody = `Hei ${typedApplicant.applicantName}, her er dine intervjutider for ${typedApplicant.period_name}: \n \n`;

      typedApplicant.committees.sort((a, b) => {
        return (
          new Date(a.interviewTime.start).getTime() -
          new Date(b.interviewTime.start).getTime()
        );
      });

      typedApplicant.committees.forEach((committee) => {
        emailBody += `<li><b>Komite:</b> ${changeDisplayName(
          committee.committeeName
        )}<br>`;
        emailBody += `<b>Start:</b> ${formatDateHours(
          new Date(committee.interviewTime.start)
        )}<br>`;
        emailBody += `<b>Slutt:</b> ${formatDateHours(
          new Date(committee.interviewTime.end)
        )}<br>`;
        emailBody += `<b>Rom:</b> ${committee.interviewTime.room}</li><br>`;

        phoneBody += `Komite: ${changeDisplayName(committee.committeeName)} \n`;
        phoneBody += `Start: ${formatDateHours(
          new Date(committee.interviewTime.start)
        )}\n`;
        phoneBody += `Slutt: ${formatDateHours(
          new Date(committee.interviewTime.end)
        )}\n`;
        phoneBody += `Rom: ${committee.interviewTime.room} \n \n`;
      });

      emailBody += `</ul> <br/> <br/> <p>Skjedd en feil? Ta kontakt med <a href="mailto:appkom@online.ntnu.no">Appkom</a>❤️</p>`;
      phoneBody += `Skjedd en feil? Ta kontakt med Appkom`;

      await sendEmail({
        toEmails: applicantEmail,
        subject: subject,
        htmlContent: emailBody,
      });

      let toPhoneNumber = "+47";
      toPhoneNumber += typedApplicant.applicantPhone;
      sendSMS(toPhoneNumber, phoneBody);
    }

    // Send email to each committee
    for (const committee of committeesToEmail) {
      const typedCommittee: emailCommitteeInterviewType = committee;
      const committeeEmail = [typedCommittee.committeeEmail];
      const subject = `${changeDisplayName(
        typedCommittee.committeeName
      )} sine intervjutider for ${typedCommittee.period_name}`;

      let body = `<p>Hei <strong>${changeDisplayName(
        typedCommittee.committeeName
      )}</strong>,</p><p>Her er deres intervjutider:</p><ul>`;

      typedCommittee.applicants.sort((a, b) => {
        return (
          new Date(a.interviewTime.start).getTime() -
          new Date(b.interviewTime.start).getTime()
        );
      });

      typedCommittee.applicants.forEach((applicant) => {
        body += `<li><b>Navn:</b> ${applicant.applicantName}<br>`;
        body += `<b>Start:</b> ${formatDateHours(
          new Date(applicant.interviewTime.start)
        )}<br>`;
        body += `<b>Slutt:</b> ${formatDateHours(
          new Date(applicant.interviewTime.end)
        )}<br>`;
        body += `<b>Rom:</b> ${applicant.interviewTime.room}</li><br>`;
      });

      body += `</ul> <br/> <br/> <p>Skjedd en feil? Ta kontakt med <a href="mailto:appkom@online.ntnu.no">Appkom</a>❤️</p>`;

      await sendEmail({
        toEmails: committeeEmail,
        subject: subject,
        htmlContent: body,
      });
    }
  } catch (error) {
    return { error: "Failed to send out interview times" };
  }
};
