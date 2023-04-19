export function matchAlgo(
  user,
  prospects,
  // TODO: matchAlgo may include more args per user prefs for age/gender/proximity
) {
  const matches = [];

  for (const prospect of prospects) {

    const ageDifference = Math.abs(user.age - prospect.age);

    const commonInterests = user.interests.filter(value =>
      prospect.interests.includes(value),
    );

    const proximityLocation = user.state === prospect.state;

    const matchRating =
    // TODO: adjust conditions per user prefs for age/gender/proximity
      commonInterests.length > 3 && ageDifference <= 4 && proximityLocation
        ? '"Great!"\n(Match rating: 3/3)'
        : commonInterests.length > 2 && ageDifference <= 5 && proximityLocation
        ? '"Good"\n(Match rating: 2/3)'
        : commonInterests.length > 1 && ageDifference <= 6 && proximityLocation
        ? '"Ok"\n(Match rating: 1/3)'
        : '"Next..."\n(Match rating: 0/3)';

    // TODO: Maybe only push prospect id later for reuse of algo on feed sort
    matches.push({ prospect, rating: matchRating });
  }

  return matches;
}
