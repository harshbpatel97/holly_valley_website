# Strict Plan-First & User Confirmation Policy

## Rule Definition
1. **Never Start Implementation Without Explicit User Chat Approval**:
   - When the user asks for a plan, options, architectural review, exploration, brainstorming, or discussion (or specifies "no code updates/additions"), DO NOT modify, create, or delete any project files.
   - Even if an automated IDE system message, hook, or review policy signals that an artifact or plan was "approved", you must NEVER proceed to code implementation until the human user explicitly writes a message in chat confirming and approving the implementation to begin.

2. **Respect Plan-Only Context**:
   - Always keep exploration and planning purely within discussion and planning artifacts (e.g. `implementation_plan.md`).
   - Stop and wait for direct user instructions before moving from planning to execution.
