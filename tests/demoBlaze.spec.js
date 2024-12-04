const { test, expect } = require('@playwright/test');

test.describe('Demoblaze Website Testing', () => {

    test('Validate Homepage', async ({ page }) => {
        await page.goto('https://www.demoblaze.com/#');
        await expect(page).toHaveTitle('STORE');
        await expect(page.locator('nav')).toBeVisible(); // Check navbar is present
        await expect(page.locator('div#carouselExampleIndicators')).toBeVisible(); // Check carousel is visible
    });

    test('Signup functionality', async ({ page }) => {
    await page.goto('https://www.demoblaze.com/#');
    await page.click('a:has-text("Sign up")'); // Open signup modal
    await page.fill('#sign-username', 'testuser');
    await page.fill('#sign-password', 'password123');
    await page.click('button[onclick="register()"]'); // Submit form
    await page.waitForSelector('.modal-content'); // Wait for modal to appear
    const signupMessage = await page.locator('.modal-content').textContent();
    expect(signupMessage).toContain('Sign up successful'); 
});


test('Login functionality', async ({ page }) => {
    await page.goto('https://www.demoblaze.com/#');
    await page.click('a:has-text("Log in")'); // Open login modal
    await page.fill('#loginusername', 'testuser');
    await page.fill('#loginpassword', 'password123');
    await page.click('button[onclick="logIn()"]'); // Submit form
    await page.waitForSelector('#nameofuser'); 
    const welcomeText = await page.locator('#nameofuser').textContent();
    expect(welcomeText).toContain('Welcome testuser'); // Validate text
});


      test('Compare Mobile Names', async ({ page }) => {
        await page.goto('https://www.demoblaze.com/#');
        await page.click('a:has-text("Phones")');
        const mobileNames = await page.$$eval('.card-title', cards =>
          cards.map(card => card.textContent.trim())
        );
        console.log('Mobile Names:', mobileNames); // Logs names for comparison
      });

      

      test('Validate Pagination', async ({ page }) => {
        await page.goto('https://www.demoblaze.com/#');
        await page.click('a:has-text("Phones")'); // Open Phones category
        await page.waitForSelector('.pagination'); // Wait for pagination to load
        await page.click('.pagination a:has-text("2")'); 
        await expect(page).toHaveURL(/page=2/); 
    });
       

      test('Add Product to Cart', async ({ page }) => {
        await page.goto('https://www.demoblaze.com/#');
        await page.click('a:has-text("Phones")');
        await page.click('a:has-text("Samsung galaxy s6")');
        await page.click('a:has-text("Add to cart")');
        await page.on('dialog', dialog => dialog.accept()); 
      });
    
      

    });
