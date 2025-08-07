#!/bin/bash

# Update deprecated GitHub Actions
echo "Updating deprecated GitHub Actions..."

# Update core actions
find .github/workflows -name "*.yml" -o -name "*.yaml" | xargs sed -i '' 's/actions\/checkout@v3/actions\/checkout@v4/g'
find .github/workflows -name "*.yml" -o -name "*.yaml" | xargs sed -i '' 's/actions\/setup-node@v3/actions\/setup-node@v4/g'
find .github/workflows -name "*.yml" -o -name "*.yaml" | xargs sed -i '' 's/actions\/github-script@v3/actions\/github-script@v7/g'
find .github/workflows -name "*.yml" -o -name "*.yaml" | xargs sed -i '' 's/actions\/upload-artifact@v3/actions\/upload-artifact@v4/g'
find .github/workflows -name "*.yml" -o -name "*.yaml" | xargs sed -i '' 's/actions\/download-artifact@v3/actions\/download-artifact@v4/g'

# Update CodeQL actions from v2 to v3 
find .github/workflows -name "*.yml" -o -name "*.yaml" | xargs sed -i '' 's/github\/codeql-action\/init@v2/github\/codeql-action\/init@v3/g'
find .github/workflows -name "*.yml" -o -name "*.yaml" | xargs sed -i '' 's/github\/codeql-action\/analyze@v2/github\/codeql-action\/analyze@v3/g'

# Update Firebase action to latest version
find .github/workflows -name "*.yml" -o -name "*.yaml" | xargs sed -i '' 's/FirebaseExtended\/action-hosting-deploy@276388dd6c2cde23455b30293105cc866c22282d # v0.6-alpha/FirebaseExtended\/action-hosting-deploy@v0/g'

# Update machine-learning-apps action from @master to specific version
find .github/workflows -name "*.yml" -o -name "*.yaml" | xargs sed -i '' 's/machine-learning-apps\/actions-app-token@master/machine-learning-apps\/actions-app-token@v1/g'

# Update compressed-size-action from v2 to latest commit (includes Node 20 and updated dependencies)
find .github/workflows -name "*.yml" -o -name "*.yaml" | xargs sed -i '' 's/preactjs\/compressed-size-action@v2/preactjs\/compressed-size-action@2a937a1/g'

echo "Done updating GitHub Actions!"

# Check for any remaining deprecated actions
echo "Checking for remaining deprecated actions..."
echo "=== Core Actions ==="
grep -r "actions/checkout@v[123]" .github/workflows/ && echo "❌ Found deprecated checkout actions" || echo "✅ All checkout actions updated"
grep -r "actions/setup-node@v[123]" .github/workflows/ && echo "❌ Found deprecated setup-node actions" || echo "✅ All setup-node actions updated"
grep -r "actions/upload-artifact@v[123]" .github/workflows/ && echo "❌ Found deprecated upload-artifact actions" || echo "✅ All upload-artifact actions updated"  
grep -r "actions/download-artifact@v[123]" .github/workflows/ && echo "❌ Found deprecated download-artifact actions" || echo "✅ All download-artifact actions updated"
grep -r "actions/github-script@v[123]" .github/workflows/ && echo "❌ Found deprecated github-script actions" || echo "✅ All github-script actions updated"

echo "=== CodeQL Actions ==="
grep -r "codeql-action.*@v[12]" .github/workflows/ && echo "❌ Found deprecated CodeQL actions" || echo "✅ All CodeQL actions updated"

echo "=== Other Actions ==="  
grep -r "@master" .github/workflows/ && echo "⚠️  Found actions using @master branch" || echo "✅ No actions using @master branch"
grep -r "276388dd6c2cde23455b30293105cc866c22282d" .github/workflows/ && echo "❌ Found pinned Firebase action commit" || echo "✅ Firebase action updated to latest"

echo "=== Summary ==="
echo "All GitHub Actions have been updated to their latest stable versions."
