#!/bin/bash

# Update deprecated GitHub Actions
echo "Updating deprecated GitHub Actions..."

# Update checkout v3 to v4
find .github/workflows -name "*.yml" -o -name "*.yaml" | xargs sed -i '' 's/actions\/checkout@v3/actions\/checkout@v4/g'

# Update setup-node v3 to v4
find .github/workflows -name "*.yml" -o -name "*.yaml" | xargs sed -i '' 's/actions\/setup-node@v3/actions\/setup-node@v4/g'

# Update github-script v3 to v7 
find .github/workflows -name "*.yml" -o -name "*.yaml" | xargs sed -i '' 's/actions\/github-script@v3/actions\/github-script@v7/g'

echo "Done updating GitHub Actions!"

# Check for any remaining deprecated actions
echo "Checking for remaining deprecated actions..."
grep -r "actions/.*@v[123]" .github/workflows/ || echo "No deprecated actions found!"
