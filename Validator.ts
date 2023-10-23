import { validateUserRisk, getOutcomeOdds, validateOdd, validateAccumalatorRisk } from "./API";

export interface User{
    id: number,
}


export interface AccumalatorRequest{
    user: User;
    outcomeIds: number[];
}

export interface AccumalatorResponse{
    accumalatorOdds?: number, 
    accept: boolean,
}

// @ts-ignore
export const validateAccumalator = async(accumalatorRequest: AccumalatorRequest): Promise<AccumalatorResponse> => {
    const validUser = await validateUserRisk(accumalatorRequest.user.id);

    let odds: number[] = [];
    for (const outcomeId of accumalatorRequest.outcomeIds){
        const odd = await getOutcomeOdds(outcomeId);
        odds.push(odd);
    }

    let validOdds = true;
    for (const odd of odds){
        const oddValid = await validateOdd(odd);
        validOdds = validOdds && oddValid;
    }

    const accumalatorOdds = odds.reduce( (a,b) => a * b );
    const validAccumalatorRisk = await validateAccumalatorRisk(accumalatorOdds);

    return {
        accumalatorOdds,
        accept: validAccumalatorRisk && validOdds && validUser,
    }

}