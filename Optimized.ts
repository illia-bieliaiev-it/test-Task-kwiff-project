import { validateUserRisk, getOutcomeOdds, validateOdd, validateAccumalatorRisk } from "./API";
import { AccumalatorRequest, AccumalatorResponse } from "./Validator";

// @ts-ignore
export const validateAccumalator = async(accumalatorRequest: AccumalatorRequest): Promise<AccumalatorResponse> => {
    const validUserPromise = validateUserRisk(accumalatorRequest.user.id);

    const oddsPromises = accumalatorRequest.outcomeIds.map(outcomeId => getOutcomeOdds(outcomeId));

    // @ts-ignore
    const odds = await Promise.all(oddsPromises);

    const validOddsPromises = odds.map(odd => validateOdd(odd));

    // @ts-ignore
    const oddsValidationResults = await Promise.all(validOddsPromises);

    const validOdds = oddsValidationResults.every(result => result);

    const accumalatorOdds = odds.reduce((a,b) => a * b);
    const validAccumalatorRisk = await validateAccumalatorRisk(accumalatorOdds);

    const validUser = await validUserPromise;

    return {
        accumalatorOdds,
        accept: validAccumalatorRisk && validOdds && validUser
    }
}
