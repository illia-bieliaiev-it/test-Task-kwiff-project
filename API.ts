import { User } from "./Validator";

const delay = (seconds: number) => {
    // @ts-ignore
    return new Promise((resolve) => {
      setTimeout(resolve, seconds * 1000);
    });
  }

// @ts-ignore
export const validateOdd = async(odd: number): Promise<boolean> => {
    await delay(0.1);
    if (odd > 10){
        return false
    }
    return true;
}

// @ts-ignore
export const validateUserRisk = async(userId: User['id']): Promise<boolean> => {
    await delay(0.1);
    if (userId===1){
        return false
    }
    return true;
}

// @ts-ignore
export const validateAccumalatorRisk = async(odds: number): Promise<boolean> => {
    await delay(0.1);
    if (odds > 100){
        return false
    }
    return true;
}

export const getOutcomeOdds = async(outcomeId: number) => {
    await delay(0.1);
    return outcomeId * 1.5;
}