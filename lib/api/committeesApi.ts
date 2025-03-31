import { QueryFunctionContext } from "@tanstack/react-query";
import { WithId } from "mongodb";
import { committeeInterviewType } from "../types/types";

export const fetchOwCommittees = async () => {
  return fetch(`/api/periods/ow-committees`).then((res) => res.json());
};

export const fetchCommitteeTimes = async (
  context: QueryFunctionContext
): Promise<{ committees: WithId<committeeInterviewType>[] | undefined }> => {
  const periodId = context.queryKey[1];
  const committee = context.queryKey[2];

  return fetch(`/api/committees/times/${periodId}/${committee}`).then((res) =>
    res.json()
  );
};
