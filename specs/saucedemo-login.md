# Saucedemo Login Test Plan

## Application Overview

Swag Labs (https://www.saucedemo.com) is a demo e-commerce storefront. Its landing page is a single "Login" form
(Username, Password, Login button) plus a help panel that lists the accepted usernames
(`standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user`, `visual_user`) and the
shared password `secret_sauce`. A successful login redirects to `/inventory.html` (the "Products" page); a failed
login stays on `/` and shows a dismissible error banner prefixed with `Epic sadface:`. This plan covers the login flow
only.

**Exploration notes** (observed live with `playwright-cli`, headed Chrome):

- Landing page title is `Swag Labs`. Form is exposed as `form "Login"` containing `textbox "Username"`,
  `textbox "Password"` and `button "Login"`. Login button locator observed: `[data-test="login-button"]`; password
  field: `[data-test="password"]`.
- Errors render as an `alert` containing a `button "Dismiss error"` and the message text. Clicking the dismiss button
  removes the alert; the field values that were typed remain.
- After a failed login the URL stays `https://www.saucedemo.com/` and typed values are retained in the fields.
- The console shows unrelated third-party errors (401 / CORS from `backtrace.io`) on the login page. Do **not**
  assert on console output.
- Only the scenarios listed by the requester are covered. `problem_user`, `performance_glitch_user`, `error_user`,
  `visual_user`, logout, and direct access to `/inventory.html` without logging in were not explored.

## Test Scenarios

### 1. Login

**Seed:** `tests/seed.spec.ts` (not yet created; it must navigate to `https://www.saucedemo.com/` and stop. Every
scenario below starts from that fresh, logged-out landing page.)

#### 1.1. login-with-standard-user-succeeds

**File:** `tests/login/login-with-standard-user-succeeds.spec.ts`

**Preconditions:** Fresh browser context (no stored session), landing page loaded, no error banner visible.

**Steps:**
  1. Type `standard_user` into the Username field
    - expect: Username field has value `standard_user`
  2. Type `secret_sauce` into the Password field
    - expect: Password field is filled and its content is masked
  3. Click the Login button
    - expect: URL changes to `https://www.saucedemo.com/inventory.html`
    - expect: No error alert is visible
    - expect: The "Products" heading/title is visible
    - expect: The page title is still `Swag Labs`
    - expect: The product list shows 6 items, each with an "Add to cart" button
    - expect: The cart button is shown as empty ("Cart, empty")
    - expect: The "Open Menu" button and the "Sort products" combobox (default `Name (A to Z)`) are visible
    - expect: The Login form is no longer displayed

#### 1.2. login-with-locked-out-user-shows-error

**File:** `tests/login/login-with-locked-out-user-shows-error.spec.ts`

**Preconditions:** Fresh browser context, landing page loaded, no error banner visible.

**Steps:**
  1. Type `locked_out_user` into the Username field
    - expect: Username field has value `locked_out_user`
  2. Type `secret_sauce` into the Password field
    - expect: Password field is filled
  3. Click the Login button
    - expect: An error alert is visible with the text `Epic sadface: Sorry, this user has been locked out.`
    - expect: The alert contains a "Dismiss error" button
    - expect: URL remains `https://www.saucedemo.com/` (no redirect to `/inventory.html`)
    - expect: The Login form is still displayed and the Products page is not shown
    - expect: Username and Password fields retain the entered values

#### 1.3. login-with-empty-username-shows-error

**File:** `tests/login/login-with-empty-username-shows-error.spec.ts`

**Preconditions:** Fresh browser context, landing page loaded, both fields empty, no error banner visible.

**Steps:**
  1. Leave the Username field empty
    - expect: Username field is empty
  2. Type `secret_sauce` into the Password field
    - expect: Password field is filled
  3. Click the Login button
    - expect: An error alert is visible with the text `Epic sadface: Username is required`
    - expect: URL remains `https://www.saucedemo.com/`
    - expect: Username field is still empty
    - expect: Password field retains its value
  4. Click the "Dismiss error" button in the alert
    - expect: The error alert is no longer visible
    - expect: The Login form is still displayed

**Note:** Submitting with *both* fields empty was also observed and gives the same message
(`Username is required`), because the username check runs first. It is not a separate scenario.

#### 1.4. login-with-empty-password-shows-error

**File:** `tests/login/login-with-empty-password-shows-error.spec.ts`

**Preconditions:** Fresh browser context, landing page loaded, both fields empty, no error banner visible.

**Steps:**
  1. Type `standard_user` into the Username field
    - expect: Username field has value `standard_user`
  2. Leave the Password field empty
    - expect: Password field is empty
  3. Click the Login button
    - expect: An error alert is visible with the text `Epic sadface: Password is required`
    - expect: URL remains `https://www.saucedemo.com/`
    - expect: Username field retains the value `standard_user`
    - expect: Password field is still empty
    - expect: The Products page is not shown

#### 1.5. login-with-invalid-credentials-shows-error

**File:** `tests/login/login-with-invalid-credentials-shows-error.spec.ts`

**Preconditions:** Fresh browser context, landing page loaded, no error banner visible.

**Steps:**
  1. Type `foo` into the Username field
    - expect: Username field has value `foo`
  2. Type `bar` into the Password field
    - expect: Password field is filled
  3. Click the Login button
    - expect: An error alert is visible with the text
      `Epic sadface: Username and password do not match any user in this service`
    - expect: The alert contains a "Dismiss error" button
    - expect: URL remains `https://www.saucedemo.com/`
    - expect: The Login form is still displayed and the Products page is not shown
    - expect: Username and Password fields retain the entered values (`foo` / masked `bar`)

## Coverage Summary

| # | Scenario | Input | Expected result |
|---|---|---|---|
| 1.1 | login-with-standard-user-succeeds | `standard_user` / `secret_sauce` | Redirect to `/inventory.html`, 6 products |
| 1.2 | login-with-locked-out-user-shows-error | `locked_out_user` / `secret_sauce` | `Sorry, this user has been locked out.` |
| 1.3 | login-with-empty-username-shows-error | *(empty)* / `secret_sauce` | `Username is required` |
| 1.4 | login-with-empty-password-shows-error | `standard_user` / *(empty)* | `Password is required` |
| 1.5 | login-with-invalid-credentials-shows-error | `foo` / `bar` | `Username and password do not match any user in this service` |
