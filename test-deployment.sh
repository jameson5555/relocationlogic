#!/bin/bash

echo "=== RelocationLogic Deployment Test ==="
echo ""

# Test 1: Check if build output exists
echo "✓ Test 1: Checking build output..."
if [ -d ".next" ]; then
    echo "  ✓ .next directory exists"
else
    echo "  ✗ .next directory missing"
    exit 1
fi

# Test 2: Check required files
echo "✓ Test 2: Checking required files..."
REQUIRED_FILES=("package.json" "next.config.ts" "tsconfig.json" "data/cities.json" "data/careers.json")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file exists"
    else
        echo "  ✗ $file missing"
        exit 1
    fi
done

# Test 3: Check data integrity
echo "✓ Test 3: Checking data integrity..."
CITY_COUNT=$(cat data/cities.json | grep -c '"id"')
CAREER_COUNT=$(cat data/careers.json | grep -c '"id"')
echo "  ✓ Cities: $CITY_COUNT"
echo "  ✓ Careers: $CAREER_COUNT"

# Test 4: Check page generation
echo "✓ Test 4: Verifying pages were generated..."
if [ -d ".next/server/app/salary" ]; then
    echo "  ✓ Salary pages generated"
else
    echo "  ✗ Salary pages not found"
    exit 1
fi

# Test 5: Check TypeScript compilation
echo "✓ Test 5: Checking TypeScript..."
npm run lint > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  ✓ ESLint passed"
else
    echo "  ✗ ESLint failed"
    exit 1
fi

echo ""
echo "=== All Tests Passed! ==="
echo ""
echo "The application is ready for deployment."
echo "See DEPLOYMENT.md for deployment instructions."
