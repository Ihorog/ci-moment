#!/bin/bash

# Apply GitHub Repository Ruleset
# This script applies the branch protection ruleset with disabled enforcement
# to the ci-moment repository using the GitHub API.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}Error: GITHUB_TOKEN environment variable is not set${NC}"
    echo "Please set your GitHub token:"
    echo "  export GITHUB_TOKEN=your_github_token_here"
    exit 1
fi

REPO_OWNER="Ihorog"
REPO_NAME="ci-moment"
RULESET_FILE=".github/rulesets/branch-protection.json"

echo -e "${YELLOW}Applying GitHub repository ruleset...${NC}"
echo "Repository: $REPO_OWNER/$REPO_NAME"
echo "Ruleset: $RULESET_FILE"
echo ""

# Check if the ruleset file exists
if [ ! -f "$RULESET_FILE" ]; then
    echo -e "${RED}Error: Ruleset file not found: $RULESET_FILE${NC}"
    exit 1
fi

# Validate JSON format
if ! jq empty "$RULESET_FILE" 2>/dev/null; then
    echo -e "${RED}Error: Invalid JSON in ruleset file${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Ruleset file found and validated"

# Apply the ruleset using GitHub API
echo ""
echo "Applying ruleset via GitHub API..."

RESPONSE=$(curl -s -w "\n%{http_code}" \
    -X POST \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/rulesets" \
    -d @"$RULESET_FILE")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 201 ]; then
    echo -e "${GREEN}✓${NC} Ruleset created successfully!"
    echo ""
    RULESET_ID=$(echo "$BODY" | jq -r '.id')
    RULESET_NAME=$(echo "$BODY" | jq -r '.name')
    echo "Ruleset ID: $RULESET_ID"
    echo "Ruleset Name: $RULESET_NAME"
    echo "Enforcement: disabled (advisory mode)"
    echo ""
    echo "View the ruleset at:"
    echo "https://github.com/$REPO_OWNER/$REPO_NAME/settings/rules/$RULESET_ID"
elif [ "$HTTP_CODE" -eq 401 ]; then
    echo -e "${RED}✗${NC} Authentication failed. Please check your GITHUB_TOKEN."
elif [ "$HTTP_CODE" -eq 403 ]; then
    echo -e "${RED}✗${NC} Permission denied. Your token needs 'repo' or 'admin:repo' scope."
elif [ "$HTTP_CODE" -eq 422 ]; then
    echo -e "${YELLOW}⚠${NC}  Validation error or ruleset already exists."
    echo "Response: $BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}✗${NC} Failed to create ruleset. HTTP code: $HTTP_CODE"
    echo "Response: $BODY" | jq '.' 2>/dev/null || echo "$BODY"
    exit 1
fi

echo ""
echo -e "${GREEN}Done!${NC}"
