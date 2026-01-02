# YieldPulse Calculator Testing Guide

## Quick Test Scenarios

### Scenario 1: Non Authenticated User Flow
1. Navigate to homepage `/`
2. Click "Get Started" or "Start Calculating Free"
3. Should navigate to `/calculator`
4. Fill in the form (or use default values)
5. Click "Calculate ROI"
6. ✅ Quick results appear on same page
7. ✅ Blue info box prompts to sign in to save
8. ✅ Automatically navigates to `/results`
9. ✅ Shows 4 key metrics
10. ✅ Shows financial overview
11. ✅ Shows premium section (locked)
12. ✅ Shows sign in prompt at bottom

### Scenario 2: Authenticated User Flow
1. Sign in to the application
2. Navigate to `/calculator`
3. Fill in property details
4. Click "Calculate ROI"
5. ✅ Analysis saves to database automatically
6. ✅ Quick results preview shows
7. ✅ Navigates to `/results`
8. ✅ All metrics display correctly
9. ✅ NO sign in prompt (user is authenticated)
10. ✅ Can view saved analyses from dashboard (future feature)

### Scenario 3: Direct URL Access
1. Navigate directly to `/calculator`
2. ✅ Calculator form loads
3. Navigate directly to `/results`
4. ✅ Shows "No results to display" message
5. ✅ Link to go back to calculator

### Scenario 4: Calculate Multiple Properties
1. On `/calculator` page
2. Enter first property details
3. Click "Calculate ROI"
4. View results
5. Click "Back to Calculator"
6. ✅ Form clears for new entry
7. Enter second property details
8. Calculate again
9. ✅ Both analyses saved (if authenticated)

## Test Data Sets

### Test 1: Profitable Investment
```
Portal: Bayut
Purchase Price: AED 1,500,000
Property Size: 1000 sqft
Monthly Rent: AED 8,000
Deposit: 20%
Interest Rate: 5.5%
Mortgage Term: 25 years
Service Charge: 15 AED/sqft/year
Management: 5%
Maintenance: 1%
Insurance: AED 2,000/year
Vacancy: 5%
Other Costs: AED 1,000/year

Expected Results:
- Gross Yield: ~6.4%
- Net Yield: ~4.8%
- Monthly Cash Flow: Positive
- Cash on Cash: Positive
```

### Test 2: High Yield Scenario
```
Portal: Property Finder
Purchase Price: AED 800,000
Property Size: 600 sqft
Monthly Rent: AED 5,500
Deposit: 25%
Interest Rate: 5.0%
Mortgage Term: 20 years
Service Charge: 12 AED/sqft/year
Management: 4%
Maintenance: 0.5%
Insurance: AED 1,500/year
Vacancy: 3%
Other Costs: AED 500/year

Expected Results:
- Gross Yield: ~8.25%
- Higher returns
- Lower expenses
```

### Test 3: Negative Cash Flow
```
Portal: Dubizzle
Purchase Price: AED 2,500,000
Property Size: 1500 sqft
Monthly Rent: AED 6,000
Deposit: 15%
Interest Rate: 7.0%
Mortgage Term: 30 years
Service Charge: 20 AED/sqft/year
Management: 8%
Maintenance: 2%
Insurance: AED 3,000/year
Vacancy: 10%
Other Costs: AED 2,000/year

Expected Results:
- Low yield
- Negative monthly cash flow
- High operating costs
```

## Validation Tests

### Field Validation
1. **Purchase Price**
   - Try entering 0 ✅ Should require > 0
   - Try negative number ✅ Should not allow
   - Try very large number ✅ Should accept

2. **Percentages**
   - Try -5% ✅ Should not allow
   - Try 150% ✅ Should limit to max 100
   - Try 0% ✅ Should accept

3. **Required Fields**
   - Leave purchase price empty ✅ Form won't submit
   - Leave any required field empty ✅ Browser validation

4. **Mortgage Term**
   - Try 0 years ✅ Should require min 1
   - Try 50 years ✅ Should limit to max 30

## Database Tests (Authenticated Users)

### Check Analysis Saved
1. Sign in as test user
2. Calculate ROI
3. Check Supabase database:
   ```sql
   SELECT * FROM analyses 
   WHERE user_id = '<user_id>'
   ORDER BY created_at DESC
   LIMIT 1;
   ```
4. ✅ Should see latest analysis
5. ✅ Should have all input fields
6. ✅ Should have calculation_results JSONB

### Check RLS Policies
1. User A calculates and saves analysis
2. User B should NOT see User A's analysis
3. Admin should see all analyses
4. ✅ RLS policies enforced

## UI/UX Tests

### Responsive Design
1. Desktop (1920x1080) ✅ Full layout
2. Tablet (768px) ✅ 2 column grid
3. Mobile (375px) ✅ Single column
4. ✅ All buttons accessible
5. ✅ Forms remain usable

### Navigation Flow
1. Header logo ✅ Links to home
2. "Back to Calculator" ✅ Works from results
3. "Get Started" buttons ✅ Navigate to calculator
4. Browser back button ✅ Works correctly
5. Direct URL access ✅ All routes work

### Loading States
1. Click "Calculate ROI" ✅ Button shows "Calculating..."
2. While saving ✅ Button disabled
3. After save ✅ Button re-enables
4. ✅ No flash of unstyled content

## Error Handling

### Network Errors
1. Disconnect internet
2. Try to save analysis (authenticated user)
3. ✅ Should show error in console
4. ✅ Should not crash app
5. ✅ Calculation still works (client side)

### Invalid Data
1. Enter extremely large numbers
2. ✅ Should handle gracefully
3. ✅ Results should calculate
4. ✅ No infinity or NaN values

### Server Errors
1. Invalid auth token
2. ✅ Should return 401 Unauthorized
3. ✅ Should not save to database
4. ✅ User sees sign in prompt

## Performance Tests

### Calculation Speed
1. Enter data
2. Click Calculate
3. ✅ Results appear instantly (< 100ms)
4. ✅ No visible lag
5. ✅ Smooth navigation

### Database Save
1. Authenticated user calculates
2. ✅ Save happens in background
3. ✅ No blocking UI
4. ✅ Navigation doesn't wait for save

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Accessibility

- [ ] All inputs have labels
- [ ] Form can be navigated with keyboard
- [ ] Tab order is logical
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible

## Regression Tests

After any changes:
1. ✅ Homepage still works
2. ✅ Navigation still works
3. ✅ Auth system still works
4. ✅ Existing API endpoints still work
5. ✅ Database schema unchanged
6. ✅ No console errors

---

## Quick Smoke Test (2 minutes)

1. Go to homepage
2. Click "Get Started"
3. Use default values
4. Click "Calculate ROI"
5. ✅ Quick results show
6. ✅ Navigate to /results
7. ✅ See 4 key metrics
8. ✅ See premium section
9. Click "Back to Calculator"
10. ✅ Can calculate again

If all ✅ pass, deployment is ready!
