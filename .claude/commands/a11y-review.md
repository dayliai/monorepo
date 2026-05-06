Run a WCAG 2.2 Level AA accessibility review on the current work.

Use the `a11y-reviewer` subagent. Pass it this prompt:

> Review the current branch for WCAG 2.2 AA conformance against the Dayli design system. Run `git diff --name-only main...HEAD` to find changed files, then read each in full and produce findings in the standard format defined in your system prompt.
>
> If no files are changed (clean branch), audit a single specific surface instead — pick the most important untouched route in `docs/wcag-2.2-aa-followups-dayli.md`.
>
> Pay particular attention to alt-text quality. For every informative image, supply suggested replacement copy ready to ship.

When the subagent returns its report, summarize:
1. Total findings by severity (counts)
2. The top 3 fixes to do first
3. Any flags that suggest the user should run a manual screen reader check

Then ask the user whether they want you to apply the suggested fixes. Don't apply anything without confirmation — the subagent is read-only by design and the user should decide what ships.
