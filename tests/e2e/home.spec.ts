import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the hero section', async ({ page }) => {
    await page.goto('/');
    
    // Check main heading is visible
    await expect(page.locator('h1')).toBeVisible();
    
    // Check CTA button is present
    await expect(page.getByRole('link', { name: /commander/i })).toBeVisible();
  });

  test('should navigate to order page', async ({ page }) => {
    await page.goto('/');
    
    // Click on the order CTA
    await page.getByRole('link', { name: /commander/i }).first().click();
    
    // Should be on the order page
    await expect(page).toHaveURL(/\/commander/);
  });

  test('should display pricing section', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to pricing
    await page.evaluate(() => {
      document.querySelector('#pricing')?.scrollIntoView();
    });
    
    // Check offers are displayed
    await expect(page.getByText('One Page')).toBeVisible();
    await expect(page.getByText('Site Vitrine')).toBeVisible();
  });
});

test.describe('Order Flow', () => {
  test('should complete step 1 form', async ({ page }) => {
    await page.goto('/commander');
    
    // Fill in customer information
    await page.fill('input[name="firstName"]', 'Jean');
    await page.fill('input[name="lastName"]', 'Dupont');
    await page.fill('input[name="email"]', 'jean@example.com');
    
    // Fill in project information
    await page.fill('input[name="projectName"]', 'Mon Super Site');
    await page.fill('textarea[name="projectDescription"]', 'Description du projet');
    
    // Select objective
    await page.click('text=Promouvoir une activité');
    
    // Select an offer
    await page.click('text=Site Vitrine');
    
    // Submit form
    await page.click('button:has-text("Continuer")');
    
    // Should navigate to step 2
    await expect(page).toHaveURL(/\/commander\/projet/);
  });
});

test.describe('Admin Login', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Check login form is visible
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /connecter/i })).toBeVisible();
  });

  test('should login with demo credentials', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Fill in demo credentials
    await page.fill('input[name="email"]', 'admin@fastfabric.fr');
    await page.fill('input[name="password"]', 'admin123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to admin dashboard
    await expect(page).toHaveURL('/admin');
    await expect(page.getByText('Dashboard')).toBeVisible();
  });
});

test.describe('Legal Pages', () => {
  test('should display mentions légales', async ({ page }) => {
    await page.goto('/mentions-legales');
    await expect(page.getByRole('heading', { name: /mentions légales/i })).toBeVisible();
  });

  test('should display CGV', async ({ page }) => {
    await page.goto('/cgv');
    await expect(page.getByRole('heading', { name: /conditions générales/i })).toBeVisible();
  });

  test('should display privacy policy', async ({ page }) => {
    await page.goto('/confidentialite');
    await expect(page.getByRole('heading', { name: /politique de confidentialité/i })).toBeVisible();
  });
});


