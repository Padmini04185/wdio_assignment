import { $ } from '@wdio/globals'
import Page from './page';
import { ChainablePromiseElement } from 'webdriverio';
import { RetirementSavingsMandateEntry, RetirementSavingAllDetails,ErrorText} from '../interface/retirementSavingsDetails';
import testData from '../testData/retirementCalc.data.json' with { type: "json" }
import logger from '../helper/logger'

const MANDATORY:string ='mandatory'
const ALL:string ='all'
const ERROR:string ='error'
const DEFAULT:string ='default'

class RetirementPage extends Page {
    
    /**
     * selectors defined using getter method
     */
     get currentAge(): ChainablePromiseElement { return $('#current-age'); }
     get retirementAge(): ChainablePromiseElement { return $('#retirement-age'); }
     get currentIncome(): ChainablePromiseElement { return $('#current-income'); }
     get spouseIncome(): ChainablePromiseElement { return $('#spouse-income'); }
     get currentTotalSavings(): ChainablePromiseElement { return $("//input[@id='current-total-savings']"); }
     get currentAnnualSavings(): ChainablePromiseElement { return $("//input[@id='current-annual-savings']"); }
     get savingsIncreaseRate(): ChainablePromiseElement { return $("#savings-increase-rate"); }
     get ssnBenefitNoRadioBtn(): ChainablePromiseElement { return $("#no-social-benefits"); }
     get yesSocialBenefitsLabel(): ChainablePromiseElement { return $("//label[@for='yes-social-benefits']"); }
     get noSocialBenefitsLabel(): ChainablePromiseElement { return $("//label[@for='no-social-benefits']"); }
     get relationShipStatusGrp(): ChainablePromiseElement { return $("//fieldset[@id='marital-status-toggle-group']/../..") }
     get marriedStatus(): ChainablePromiseElement { return $("//label[@id='married']"); }
     get marriedStatusLabel(): ChainablePromiseElement { return $('#marital-status-label'); }
     get singleRadioBtn(): ChainablePromiseElement { return $('#single'); }
     get marriedRadioBtn(): ChainablePromiseElement { return $('#married'); }
     get socSecurityOverride(): ChainablePromiseElement { return $('#social-security-override'); }
     get resultHeader(): ChainablePromiseElement { return $("//div/h3[contains(text(),'Results')]") }
     get resultMsg(): ChainablePromiseElement { return $("#result-message"); }
     get currentAgeInvalidError(): ChainablePromiseElement { return $('#invalid-current-age-error'); }
     get retirementAgeInvalidErr(): ChainablePromiseElement { return $('#invalid-retirement-age-error'); }
     get currentIncomeInvalidErr(): ChainablePromiseElement { return $('#invalid-current-income-error'); }
     get currTotalSavingsInvalidErr(): ChainablePromiseElement { return $('#invalid-current-total-savings-error'); }
     get currAnnualSavingsInvalidErr(): ChainablePromiseElement { return $('#invalid-current-annual-savings-error'); }
     get savingsIncreaseRateInvalidErr(): ChainablePromiseElement { return $('#invalid-savings-increase-rate-error'); }
     get additionalIncome(): ChainablePromiseElement { return $('#additional-income'); }
     get retirementDuration(): ChainablePromiseElement { return $('#retirement-duration'); }
     get adjustDefaultValuesLink(): ChainablePromiseElement { return $('=Adjust default values') }
     get calculatorAlertBoxText(): ChainablePromiseElement { return $('#calculator-input-alert-desc') }
     get defaultCalculatorDialog(): ChainablePromiseElement { return $("//h2[contains(text(),'Default calculator values')]") }

/**
* Method to encapsule automation code to interact with the page
* submitFormData method is to populated right set of data based on the condition and submit form
* Param -> arg , this parameter expects string 'mandatory,all, default' 
* testData - > Data is fetched from /testData/retirementCalc.data.json file
*/

     async submitFormData(arg: string): Promise<void> {
       try{
        if (arg.includes(MANDATORY)) {
            const data: RetirementSavingsMandateEntry = testData.mandatoryData
            await this.submitFormWithMandatoryData(data)
        }
        else if (arg.includes(ALL)) {
            const data: RetirementSavingAllDetails = testData.allData
            await this.submitFormWithMandatoryData(data)
            await this.addValueToTextbox(this.spouseIncome, data.spouseAnnualIncome)
            await this.setSSBenefitsAndRelationStatus(data.socialSecurityOverride)
            logger.info("All Data entered ....")
        }
        else if (arg.includes(DEFAULT)) {
            const data: RetirementSavingAllDetails = testData.allData
            await this.adjustDefaultValues(data)
            await this.clickBtn('Save changes');
        }
        else {
            logger.info('Argument passed does not match with string all|default|mandatory ....')
        }
        await this.clickBtn('Calculate');
        await this.waitForElementToDisplay(this.resultHeader)
        logger.info('Form Data submitted succesfully ----')
    }
    catch(error){
        throw Error ('Error encountered during submitting form data...'+error)
    }

    }

  

/**
* submitFormWithMandatoryData method is to populate mandatory set of fields
* Param -> data , this parameter takes data object.
*/

     async submitFormWithMandatoryData(data: RetirementSavingAllDetails | RetirementSavingsMandateEntry): Promise<void> {
        try{
        await this.currentAge.setValue(data.currentAge)
        await this.retirementAge.setValue(data.retirementAge)
        await this.addValueToTextbox(this.currentIncome, data.currentAnnualIncome)
        await this.addValueToTextbox(this.currentTotalSavings, data.currentRetirementSavings)
        await this.addValueToTextbox(this.currentAnnualSavings, data.annualRetirmentContriIncrease)
        await this.addValueToTextbox(this.savingsIncreaseRate, data.currentRetirementContri)
        logger.info(" Mandatory data filled in successfully ----")
        }
        catch(error)
        {
            throw Error ('Error during submitting forms with mandatory data...'+error)
        }
    }

/**
* adjustDefaultValues method is to open default calculator values dialog and some field data and submit
* Param -> data , this parameter takes data object.
*/

     async adjustDefaultValues(data: RetirementSavingAllDetails): Promise<void> {
        try {
            await this.waitForElementToDisplay(this.adjustDefaultValuesLink)
            await this.adjustDefaultValuesLink.click();
            await this.waitForElementToDisplay(this.defaultCalculatorDialog)
            await this.addValueToTextbox(this.additionalIncome, data.otherIncome)
            await this.addValueToTextbox(this.retirementDuration, data.yearRetirementToLast)
            logger.info(" Adjusted Default Values----")
        }
        catch (error) {
            throw Error("Error in adjusting default values----" + error)
        }
    }

/**
     * Method to set Social Security Benefit and relationship status
     * This method checks if SSN Benefit secion is not set to Yes 
     * then selects Yes and chooses marital status
*/

  async setSSBenefitsAndRelationStatus(socialSecOveride: number): Promise<void> {
        const relationStatusDisplayed = await this.marriedStatusLabel.isDisplayed()
        
        try{
            await this.yesSocialBenefitsLabel.click()
            if (relationStatusDisplayed) {
                await this.marriedStatus.click()
                this.addValueToTextbox(this.socSecurityOverride, socialSecOveride)
            }
            else {
                logger.info("Relationship Status section not visible ----------")
            }
        }
        catch(error){
                throw Error('Social Security Benefit Radio Button is not defaulted to No')
            }

    }

/**
     * Method to verify all mandatory fields highlighted and displaying error message
     * data - expected text is fetched from data file
*/
   
 async mandatoryFieldCheck(data: ErrorText): Promise<void> {
        await expect(this.calculatorAlertBoxText).toHaveText(data.alertMsg)
        await expect(this.currentAgeInvalidError).toHaveText(data.inputRequiredMsg)
        await expect(this.retirementAgeInvalidErr).toHaveText(data.inputRequiredMsg)
        await expect(this.currentIncomeInvalidErr).toHaveText(data.inputRequiredMsg)
        await expect(this.currTotalSavingsInvalidErr).toHaveText(data.inputRequiredMsg)
        await expect(this.currAnnualSavingsInvalidErr).toHaveText(data.inputRequiredMsg)
        await expect(this.savingsIncreaseRateInvalidErr).toHaveText(data.inputRequiredMsg)     
}

/**
     * Method to verify submit form with mandatory and invalid data
     * data - is data object fetched from data file 
*/

async submitDataWithError(data: RetirementSavingsMandateEntry): Promise<void> {
        try {
            await this.submitFormWithMandatoryData(data)
            await this.clickBtn('Calculate')
            logger.info('Form data populated with age greater than retirement')
        }
        catch (error) {
            throw Error("Error in populating mandatory data with error----" + error)
        }
    }

/**
     * retirementAgeValidationCheck method to check retirement age field showing error message
     * data - expected text is fetch from data file
*/

async retirementAgeValidationCheck(errData: ErrorText): Promise<void> {
        await this.waitForElementToDisplay(this.calculatorAlertBoxText)
        await expect(this.calculatorAlertBoxText).toHaveText(errData.alertMsg)
        await expect(this.retirementAgeInvalidErr).toHaveText(errData.retirementAgeErrorMsg)
 }

/*
    * checkSocialSecurityDisplay method is defined to perform check on Social Security section display 
    * param - Based on state parameter value then assertion are perfomed 
*/
 
 async checkSocialSecurityDisplay(state: string): Promise<void> {
        if (state === 'displayed') {
            logger.info("Additional social security fields display check ...")
            await expect(this.singleRadioBtn).toBeDisplayed();
            await expect(this.marriedRadioBtn).toBeDisplayed();
            await expect(this.socSecurityOverride).toBeDisplayed()
        }
        else if (state === 'hidden') {
            logger.info("Additional social security fields hidden check ...")
            expect(this.relationShipStatusGrp).toHaveAttribute('style', 'display:none')
            await expect(this.singleRadioBtn).not.toBeDisplayed();
            await expect(this.marriedRadioBtn).not.toBeDisplayed();
            await expect(this.socSecurityOverride).not.toBeDisplayed();
        }

    }


/* 
   Method to choose Social Security benefit option as (Yes|No) based on user input
   
*/

async setSocialSecurityFlag(arg: string) {
        if (arg === 'Yes')
        {
            await this.yesSocialBenefitsLabel.click();
            logger.info("SocialSecurity Benefit Radio button set to Yes")
        }    
        else if (arg === 'No')
        {
            await this.noSocialBenefitsLabel.click();
            logger.info("SocialSecurity Benefit Radio button set to No")
        }
        else
          {
            throw Error('Error in setting social security Benefit flag values')
          }
}

/*
Method to verify error message for mandatory and invalid data check
arg : string accepts input 'mandatory or error'
*/

async checkError(arg:string){
        if(arg===MANDATORY){
            await this.mandatoryFieldCheck(testData.errorText);
            logger.info("Mandatory fields validation... ")
        }
        else if(arg===ERROR){
            await this.retirementAgeValidationCheck(testData.errorText);
            logger.info("Retirment Age validation check... ")
        } 
        else
        { 
            throw Error(`String ${arg} does not match with mandatory/error ...`)
        }

}
}

export default new RetirementPage();
