# Release Process Checklist

This document outlines the complete process for creating and publishing a release of Ci Moment.

## Pre-Release Preparation

### Code Quality
- [ ] All tests pass (if applicable)
- [ ] Type checking passes: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Production build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] No ESLint warnings

### Security
- [ ] Review `npm audit` output
- [ ] Address critical vulnerabilities
- [ ] Document known issues in SECURITY.md
- [ ] Verify no secrets in code
- [ ] Check .gitignore is comprehensive
- [ ] Security headers configured
- [ ] Webhook signature verification working

### Documentation
- [ ] README.md is up to date
- [ ] All docs in `/docs` folder are current
- [ ] CHANGELOG.md updated with new version
- [ ] API documentation accurate
- [ ] Environment variables documented
- [ ] Deployment guide verified
- [ ] Examples working

### Dependencies
- [ ] Dependencies up to date (where safe)
- [ ] No deprecated packages in use
- [ ] License compatibility verified
- [ ] Package.json complete

### Testing
- [ ] Manual testing completed
- [ ] Payment flow tested (test mode)
- [ ] Webhook delivery verified
- [ ] Verification page working
- [ ] All contexts tested (Career, Love, Timing)
- [ ] Error handling verified
- [ ] Mobile responsiveness checked
- [ ] Cross-browser testing done

## Version Update

### Update Version Number

1. Determine version bump (major.minor.patch):
   - **Major (X.0.0)**: Breaking changes
   - **Minor (X.Y.0)**: New features, backward compatible
   - **Patch (X.Y.Z)**: Bug fixes, backward compatible

2. Update `package.json`:
   ```json
   "version": "X.Y.Z"
   ```

3. Update `CHANGELOG.md`:
   - Add new version section at top
   - Document all changes
   - Follow Keep a Changelog format
   - Include date

4. Update any version references in docs (if applicable)

### Commit Version Changes

```bash
git add package.json CHANGELOG.md
git commit -m "Release vX.Y.Z"
```

## Create Release

### 1. Create Git Tag

```bash
# Create annotated tag
git tag -a vX.Y.Z -m "Version X.Y.Z"

# Verify tag
git tag -l vX.Y.Z
git show vX.Y.Z
```

### 2. Push Changes

```bash
# Push commits
git push origin main

# Push tag
git push origin vX.Y.Z
```

### 3. Create GitHub Release

1. Go to: https://github.com/Ihorog/ci-moment/releases/new
2. Select tag: `vX.Y.Z`
3. Release title: `Version X.Y.Z`
4. Use RELEASE_NOTES_TEMPLATE.md as guide
5. Include:
   - Highlights
   - What's new
   - Bug fixes
   - Breaking changes (if any)
   - Installation instructions
   - Links to documentation
6. Attach any release assets (if applicable)
7. Check "Set as the latest release" (if applicable)
8. Publish release

## Post-Release

### Verification

- [ ] GitHub release published successfully
- [ ] Tag appears in repository
- [ ] Release notes are clear and complete
- [ ] Links in release notes work
- [ ] Deployment still works
- [ ] Quick smoke test of functionality

### Communication

- [ ] Update live demo (if applicable)
- [ ] Announce on social media (optional)
- [ ] Update Product Hunt (if listed)
- [ ] Notify stakeholders
- [ ] Update documentation site (if applicable)

### Monitoring

First 24-48 hours after release:

- [ ] Monitor error logs
- [ ] Check deployment status
- [ ] Review user feedback
- [ ] Monitor Stripe dashboard
- [ ] Check webhook deliveries
- [ ] Address critical issues immediately

### Documentation

- [ ] Archive release documentation
- [ ] Update roadmap (if applicable)
- [ ] Document lessons learned
- [ ] Update support documentation

## Rollback Procedure

If critical issues found:

1. **Immediate**: Revert Vercel deployment to previous version
2. **Tag**: Create patch version with fix
3. **Communicate**: Notify users of issue and resolution
4. **Document**: Add to CHANGELOG as hotfix

```bash
# Revert tag (if needed)
git tag -d vX.Y.Z
git push origin :refs/tags/vX.Y.Z
```

## Hotfix Process

For critical bugs in production:

1. Create hotfix branch from tag:
   ```bash
   git checkout -b hotfix/vX.Y.Z+1 vX.Y.Z
   ```

2. Fix the issue

3. Test thoroughly

4. Update version to X.Y.Z+1

5. Update CHANGELOG.md

6. Follow release process

7. Merge back to main

## Version Numbering Guide

### Major Version (X.0.0)
- Breaking API changes
- Significant architecture changes
- Removed features
- Incompatible with previous versions

### Minor Version (X.Y.0)
- New features
- New components
- New API endpoints
- Backward compatible
- Deprecations announced

### Patch Version (X.Y.Z)
- Bug fixes
- Security fixes
- Documentation updates
- Performance improvements
- No new features

## Release Schedule

**Ci Moment** follows semantic versioning:

- **Patch releases**: As needed for critical bugs
- **Minor releases**: When new features are ready
- **Major releases**: When breaking changes necessary

## Automation Opportunities

Future improvements:

- [ ] Automated version bumping
- [ ] Automated CHANGELOG generation
- [ ] Automated release notes creation
- [ ] CI/CD integration for releases
- [ ] Automated deployment tagging

## Checklist Template

Copy this for each release:

```markdown
## Release vX.Y.Z Checklist

- [ ] All pre-release checks passed
- [ ] Version updated in package.json
- [ ] CHANGELOG.md updated
- [ ] Changes committed
- [ ] Git tag created
- [ ] Tag pushed to GitHub
- [ ] GitHub release created
- [ ] Release notes published
- [ ] Post-release verification done
- [ ] Communication sent (if applicable)
- [ ] Monitoring in place
```

## Resources

- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [Git Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging)

## Notes

- Always test the release process in a feature branch first
- Document any issues encountered during release
- Update this checklist with lessons learned
- Keep release notes user-focused
- Be clear about breaking changes
- Provide migration guides when needed

---

**Remember**: A good release process is repeatable, documented, and verified.
