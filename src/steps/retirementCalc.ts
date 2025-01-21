import { Given, When, Then } from '@wdio/cucumber-framework';
import testData from '../testData/retirementCalc.data.json' with { type: "json" }
import RetirementCalcPage from '../pageObjects/retirementCalc.page';
import logger from '../helper/logger'


Given(/^user opens retirement savings website$/, async () => {
       await RetirementCalcPage.open("")    
});


When(/^user submits form with (all|mandatory|default adjusted) data populated$/, async (arg) => {
    await RetirementCalcPage.submitFormData(arg)        
});


When(/^user clicks "([^"]*)" button$/,async(arg) =>{
     await RetirementCalcPage.clickBtn(arg)   
    
})

When(/^user selects Social Security benefit option as (Yes|No)$/,async(arg) =>{
      await RetirementCalcPage.setSocialSecurityFlag(arg);
      
})

When(/^user submits form with current age greater than retirement$/,async() =>
    {
       await RetirementCalcPage.submitDataWithError(testData.errorData)
    })

    
Then(/^page should highlight (mandatory|error) fields with appropriate error message$/,async(arg) =>
{
    await RetirementCalcPage.checkError(arg)   

})

Then(/^user should see calculated results displayed$/, async () => {
    await expect(RetirementCalcPage.resultHeader).toBeExisting()
    await expect(RetirementCalcPage.resultMsg).toBeExisting()
    logger.info(await RetirementCalcPage.resultMsg.getText())    
});

// Then(/^user should see mandatory fields highighted$/, async () => {
//     await expect(RetirementCalcPage.resultHeader).toExist()
//     await expect(RetirementCalcPage.resultMsg).toExist()
// });

Then(/^verify Additional Social Security fields are (displayed|hidden)$/, async (arg) => {
    await RetirementCalcPage.checkSocialSecurityDisplay(arg);
});
