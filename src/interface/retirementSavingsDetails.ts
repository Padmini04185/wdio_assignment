/*
Interfaces defined as a custom data type for data File attributes
*/

export interface RetirementSavingAllDetails{
        "currentAge":number,
        "retirementAge":number,
        "currentAnnualIncome":number,
        "spouseAnnualIncome":number,
        "currentRetirementSavings":number,
        "currentRetirementContri":number,
        "annualRetirmentContriIncrease":number,
        "socialSecIncome":string,
        "relationshipStatus":string,
        "socialSecurityOverride":number,
        "otherIncome":number,
        "yearRetirementToLast":number,
        "postRetirmentIncomeRise":string,
        "percentFinalIncomeDesired":number
    }

export interface RetirementSavingsMandateEntry{
        "currentAge":number,
        "retirementAge":number,
        "currentAnnualIncome":number,
        "currentRetirementSavings":number,
        "currentRetirementContri":number,
        "annualRetirmentContriIncrease":number,
    }

export interface ErrorText {
    "alertMsg":string
    "inputRequiredMsg":string
    "retirementAgeErrorMsg":string    
}



    
