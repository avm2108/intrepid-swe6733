export function matchAlgo(
  user,
  prospects,
  // TODO: matchAlgo may include more args per user prefs for age/gender/proximity
) {

  const matches = [];

  const calcAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const ageDiff = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiff);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age
  }

  for (const prospect of prospects) {

    // age algo: if w/in pref range, ageDiff = 0, else calc diff
    const prospectAge = calcAge(prospect.dateOfBirth)
    const userPrefAge = user.profile.preferences.ageRange
    var ageDifference = 0
    if (prospectAge >= userPrefAge.min && prospectAge <= userPrefAge.max) {
      ageDifference = 0
    } else {

      if (prospectAge < userPrefAge.min) {
        ageDifference = userPrefAge.min - prospectAge
      } else {
        ageDifference = prospectAge - userPrefAge.max
      }
      
    }

    // interests algo: percent of common interests
    const totalInterests = user.profile.interests.length;
    const commonInterests = user.profile.interests.filter(value =>
      prospect.profile.interests.includes(value),
    );
    const commonInterestsCount = commonInterests.length;
    const commonInterestsPercentage = (commonInterestsCount / totalInterests) * 100;


    // proximity algo: check if w/in same state    
    const proximityLocation = user.profile.location.state === prospect.profile.location.state;


    // conditions

    const matchRating =
    // TODO: adjust conditions per user prefs for age/gender/proximity
      commonInterestsPercentage >= 75 && ageDifference <= 0 && proximityLocation
        ? '"Great!"\n(Match rating: 3/3)'
        : commonInterests.length >= 50 && ageDifference <= 3 && proximityLocation
        ? '"Good"\n(Match rating: 2/3)'
        : commonInterests.length >= 25 && ageDifference <= 6 && proximityLocation
        ? '"Ok"\n(Match rating: 1/3)'
        : '"Next..."\n(Match rating: 0/3)';

    // TODO: Maybe only push prospect id later for reuse of algo on feed sort
    matches.push({ prospect, rating: matchRating });
  }

  return matches;
}
