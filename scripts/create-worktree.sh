#!/bin/bash
# create-worktree.sh - 创建隔离的AI开发环境
# Usage: ./create-worktree.sh <task-name> [base-branch] [ai-agent]
# Example: ./create-worktree.sh hero-component main claude

set -e

TASK_NAME=$1
BASE_BRANCH=${2:-main}
AI_AGENT=${3:-claude}

if [ -z "$TASK_NAME" ]; then
    echo "Error: Task name is required."
    echo "Usage: ./create-worktree.sh <task-name> [base-branch] [ai-agent]"
    exit 1
fi

REPO_ROOT=$(git rev-parse --show-toplevel)
REPO_NAME=$(basename "$REPO_ROOT")
WORKTREE_PATH="$REPO_ROOT/../${REPO_NAME}-${TASK_NAME}"

if [ -d "$WORKTREE_PATH" ]; then
    echo "Error: Worktree path '$WORKTREE_PATH' already exists."
    echo "Please remove it first or use a different task name."
    exit 1
fi

echo "==============================================="
echo "  Creating Worktree for Task: $TASK_NAME"
echo "==============================================="
echo "  Base branch: $BASE_BRANCH"
echo "  AI Agent: $AI_AGENT"
echo "  Path: $WORKTREE_PATH"
echo ""

echo "[1/3] Creating worktree branch..."
git worktree add -b "feat/$TASK_NAME" "$WORKTREE_PATH" "$BASE_BRANCH"

echo ""
echo "[2/3] Installing dependencies..."
cd "$WORKTREE_PATH"
npm install

echo ""
echo "[3/3] Creating task contract..."
cat > TASK.md << EOF
# Task: $TASK_NAME

## Objective
[Describe the main goal for this worktree here.]

## AI Agent
$AI_AGENT

## Key Requirements
- Requirement 1: Follow the project structure defined in ARCHITECTURE_DESIGN.md
- Requirement 2: Use the logging system defined in LOGGING_GUIDE.md
- Requirement 3: All components must have error handling (ErrorBoundary)
- Requirement 4: Write unit tests for new functionality

## Success Criteria
- [ ] All existing tests pass.
- [ ] New feature is fully tested.
- [ ] Code meets our style guide (ESLint + Prettier).
- [ ] Component is integrated into App.tsx routing.
- [ ] Documentation is updated if needed.

## Module Info
- Component module: src/components/{core|extensions}/{ComponentName}/
- Hook: src/hooks/use{FeatureName}.ts
- Utils: src/utils/{featureName}Utils.ts
- Types: src/types/index.ts

## Notes
- Created: $(date)
- Base branch: $BASE_BRANCH
- Project docs: FINAL_PRD.md, ARCHITECTURE_DESIGN.md
EOF

echo ""
echo "==============================================="
echo "  Worktree Created Successfully!"
echo "==============================================="
echo "  Path: $WORKTREE_PATH"
echo "  Branch: feat/$TASK_NAME"
echo ""
echo "Next steps:"
echo "  cd $WORKTREE_PATH"
echo "  npm run dev"
echo ""
echo "Remember to:"
echo "  1. Read TASK.md for task details"
echo "  2. Run 'npm run doctor' before starting"
echo "  3. Use 'npm run lint' before committing"
echo ""
