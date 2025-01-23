Feature: Test Retirement Saving Calculator features
  
Background:
   Given user is on retirement calculator page

   Scenario: Verify calculated result displayed when user submit form with all and default adjusted data
    When user submits form with all data populated
    Then user should see calculated results displayed
    When user clicks "Edit" button
    And  user submits form with default adjusted data populated
    Then user should see calculated results displayed

   Scenario: Validate mandatory field check on retirement calculator page
    When user clicks "Calculate" button
    Then page should highlight mandatory fields with appropriate error message
    When user submits form with mandatory data populated
    Then user should see calculated results displayed

   Scenario: Validate error message when retirement age is less than current age
    When user submits form with current age greater than retirement
    Then page should highlight error fields with appropriate error message

   Scenario: Verify Additional Social Security fields display/hide based on Social Security benefits toggle  
    When user selects Social Security benefit option as Yes
    Then verify Additional Social Security fields are displayed
    When user selects Social Security benefit option as No
    Then verify Additional Social Security fields are hidden

    
   

    
    
     


   

    
