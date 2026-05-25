# GitHub Repository Rulesets

This directory contains repository ruleset configurations for the ci-moment project.

## Branch Protection Ruleset

The `branch-protection.json` file defines a branch protection ruleset with **enforcement disabled**.

### Ruleset Configuration

- **Name**: Branch Protection with Disabled Enforcement
- **Target**: Branch
- **Enforcement**: Disabled (advisory mode)
- **Branches**: main, master

### Rules Included

1. **Pull Request Reviews**
   - No required approving reviews (count: 0)
   - Stale reviews not dismissed on push
   - Code owner review not required
   - Last push approval not required

2. **Required Status Checks**
   - CI workflow must pass
   - Strict status checks not enforced

3. **Non-Fast-Forward Push Protection**
   - Prevents force pushes and deletions

### Bypass Actors

- Repository administrators can bypass all rules

## Applying the Ruleset

### Method 1: GitHub Web UI

1. Navigate to repository Settings
2. Go to Rules → Rulesets
3. Click "New ruleset" → "New branch ruleset"
4. Click "Import a ruleset"
5. Upload the `branch-protection.json` file
6. Click "Create"

### Method 2: GitHub API

```bash
# Get the repository ID
REPO_ID=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/Ihorog/ci-moment | jq -r '.id')

# Create the ruleset
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/Ihorog/ci-moment/rulesets \
  -d @.github/rulesets/branch-protection.json
```

### Method 3: GitHub CLI

```bash
gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/Ihorog/ci-moment/rulesets \
  --input .github/rulesets/branch-protection.json
```

## Enforcement Mode

This ruleset is configured with **enforcement: disabled**, which means:

- Rules are evaluated but not enforced
- Users receive warnings when rules are violated
- Pushes and PRs are not blocked by rule violations
- Useful for testing rules before enabling strict enforcement

## Enabling Enforcement

To enable strict enforcement:

1. Edit the ruleset in GitHub UI: Settings → Rules → Rulesets
2. Change "Enforcement status" from "Disabled" to "Active"
3. Or update the JSON file and re-import with `"enforcement": "active"`

## Notes

- This configuration matches the requirements specified in the GitHub issue
- The ruleset protects main/master branches but doesn't block operations
- CI checks are required but can be bypassed
- Repository admins always have bypass permissions

## References

- [GitHub Rulesets Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [GitHub API - Rulesets](https://docs.github.com/en/rest/repos/rules)
