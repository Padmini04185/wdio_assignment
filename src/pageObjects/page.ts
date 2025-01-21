import { browser } from '@wdio/globals'
import { waitTime } from '../enum/waitTime'
import logger from '../helper/logger'

/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class Page {
    /**
    * Opens a sub page of the page
    */
    async open(path:string) {
        logger.info("Launching website.....")
        await browser.url(path)
        logger.info("Retirement Calculator Website launched successfully....")
    }

   
     // Common reusable web element action 
  
    /**
     * Method waitForElementToDisplay waits maximum 5 sec for webElement to be displayed on the page
     * elem -> elem , web element on which operation is performed
     *  
     */
    async waitForElementToDisplay(elem: ChainablePromiseElement): Promise<void> {
        try{
         await elem.waitForDisplayed({ timeout: waitTime.FIVESEC })
         } 
         catch(error)
         {
             throw Error('WebElement failed to display in 5 sec....')
         }
 
    }

     /**
     * Method addValueToTextbox performs click operation on textbox and then sets value
     * Param -> ele , web element on which operation is performed
     * value -> string or number data are accepted
     *  
     */

     async addValueToTextbox(ele: ChainablePromiseElement, value: string | number) {
        if (await ele.isClickable()) {
            await ele.click()
            await ele.addValue(value)
        }
        else {
            throw Error("----Data not set for web element : " + await ele.getAttribute("Id"))
        }
    }

    
     /**
     * Method returns xpath of button object based button name passed as parameter
     * Param -> name is a button name 
     *  
     */

    async getBtnObj(name: string) {
        return $(`//button[contains(text(),'${name}')]`)
    }

    
     /**
     * Method waits for 5 element to display and then performs click operation 
     * Param -> name is a button name string
     *  
     */

    async clickBtn(btnName: string): Promise<void> {
        const btn = await this.getBtnObj(btnName)
        await this.waitForElementToDisplay(btn)
        try {
            await btn.click()
            logger.info(`${btnName} button clicked succesfully ...`)
        }
        catch (error) {
            throw Error('---Btn not clickable : ' + btn.getAttribute("Id"))
        }
    }

    
}
