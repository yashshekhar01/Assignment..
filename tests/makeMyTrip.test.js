const { test, expect } = require('@playwright/test');

test.describe('MakeMyTrip Automation', () => {
  test('Flight booking test', async ({ page }) => {
    
    await page.goto('https://www.makemytrip.com/');

    // Handle potential popups or modals
    try {
      await page.locator('body').click(); // Dismiss any popups
    } catch (e) {
      console.log('No popups to dismiss');
    }

    // Select "Flights" as the travel type
    await page.click('label[for="fromCity"]');
    await page.locator('input[placeholder="From"]').type('Mumbai');
    await page.locator('.react-autosuggest__suggestions-list').locator('text=Mumbai').click();

    await page.locator('input[placeholder="To"]').type('Chennai');
    await page.locator('.react-autosuggest__suggestions-list').locator('text=Chennai').click();

    // Select the lowest fare in December
    await page.click('label[for="departure"]');
    await page.click('text=December'); 
    const lowestFare = await page.locator('.DayPicker-Day--available .price').allTextContents();
    const minFare = Math.min(...lowestFare.map(price => parseInt(price.replace('₹', '').trim())));
    await page.locator(`.DayPicker-Day--available:has-text("${minFare}")`).first().click();

    // Search for flights
    await page.click('button[aria-label="Search"]');

    // Select the first flight
    await page.waitForSelector('.fli-list');
    await page.locator('.fli-list').first().click();

    // Verify price breakdown
    await page.waitForSelector('#fare-summary');
    const baseFare = await page.locator('#baseFareValue').innerText();
    const taxes = await page.locator('#taxesValue').innerText();
    const totalAmount = await page.locator('#totalFareValue').innerText();

    expect(parseInt(baseFare) + parseInt(taxes)).toBe(parseInt(totalAmount));

    // Test invalid promo code
    await page.locator('#promoCode').type('INVALIDCODE');
    await page.click('#applyPromo');
    const errorMessage = await page.locator('.promo-error-message').innerText();
    expect(errorMessage).toContain('Invalid promo code');

    // Test valid promo code
    await page.locator('#promoCode').fill('MMTSECURE');
    await page.click('#applyPromo');
    const successMessage = await page.locator('.promo-success-message').innerText();
    expect(successMessage).toContain('Travel Assurance has been added');

    // Verify the new total amount
    const discount = 199; // ₹199 discount for MMTSECURE promo code
    const updatedTotalAmount = parseInt(totalAmount) - discount;
    const finalAmount = await page.locator('#totalFareValue').innerText();
    expect(parseInt(finalAmount)).toBe(updatedTotalAmount);
  });
});
