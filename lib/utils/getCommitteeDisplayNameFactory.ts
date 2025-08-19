import { fetchOwCommittees } from "../api/committeesApi";

export const getCommitteeDisplayNameFactory = async () => {
  const committees: { name_short: string; name_long: string }[] =
    await fetchOwCommittees();

  /**
   * Returns "name_long (name_short)" for the given committee
   *
   * Defaults to given committee name if no long name is found.
   *
   * @param committee Short name (name_short) of committee
   */
  const getCommitteeDisplayName = (committee: string) => {
    const name_long = committees.find(
      ({ name_short }) => name_short == committee
    )?.name_long;

    return name_long ? `${name_long} (${committee})` : committee;
  };

  return getCommitteeDisplayName;
};
