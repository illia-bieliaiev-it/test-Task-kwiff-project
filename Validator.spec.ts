import { AccumalatorRequest, validateAccumalator } from './Validator';

describe('Validator', () => {
  test('Should reject bets from user 1', async() => {
    // This is a template outcome we will be testing against
    const accumalatorRequest: AccumalatorRequest = {
        user:{ id: 1},
        outcomeIds: [1,2]
    };

    const result = await validateAccumalator(accumalatorRequest);
    expect(result.accept).toBeFalsy();
});

test('Should accept bets from user 2', async() => {
    // This is a template outcome we will be testing against
    const accumalatorRequest: AccumalatorRequest = {
        user:{ id: 2},
        outcomeIds: [1,2]
    };

    const result = await validateAccumalator(accumalatorRequest);
    expect(result.accept).toBeTruthy();
    expect(result.accumalatorOdds).toEqual(4.5);
});
test('Should reject outcome 11', async() => {
    // This is a template outcome we will be testing against
    const accumalatorRequest: AccumalatorRequest = {
        user:{ id: 2},
        outcomeIds: [1,11]
    };

    const result = await validateAccumalator(accumalatorRequest);
    expect(result.accept).toBeFalsy(); 
});
test('Should reject this outcome combination', async() => {
    // This is a template outcome we will be testing against
    const accumalatorRequest: AccumalatorRequest = {
        user:{ id: 2},
        outcomeIds: [1,2,3,4]
    };

    const result = await validateAccumalator(accumalatorRequest);
    expect(result.accept).toBeFalsy();
    expect(result.accumalatorOdds).toEqual(121.5);
});
});